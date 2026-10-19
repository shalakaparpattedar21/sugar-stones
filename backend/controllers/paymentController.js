import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import { calculateCart, validateShippingAddress } from '../utils/cart.js';

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    const error = new Error('Razorpay test keys are missing in backend .env');
    error.status = 503;
    throw error;
  }
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
}

export const createRazorpayOrder = async (req, res) => {
  try {
    const { client, key_id } = getRazorpay();
    const { items, shippingAddress, promoCode } = req.body || {};
    validateShippingAddress(shippingAddress);

    const cart = await calculateCart(items, promoCode);
    const razorpayOrder = await client.orders.create({
      amount: Math.round(cart.totalAmount * 100),
      currency: 'INR',
      receipt: `ss_${Date.now()}`,
      notes: { store: 'Sugar & Stones', promoCode: cart.promoCode }
    });

    // Return only what the browser needs. The secret key never leaves the server.
    res.status(201).json({
      keyId: key_id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      totalAmount: cart.totalAmount
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Could not create payment order.'
    });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { client, key_secret } = getRazorpay();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      promoCode
    } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification details are incomplete.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const signatureBuffer = Buffer.from(expectedSignature, 'utf8');
    const receivedBuffer = Buffer.from(String(razorpay_signature), 'utf8');
    if (signatureBuffer.length !== receivedBuffer.length ||
        !crypto.timingSafeEqual(signatureBuffer, receivedBuffer)) {
      return res.status(400).json({ message: 'Payment signature verification failed.' });
    }

    // Browser retried after a success? Return the order we already saved.
    const existing = await Order.findOne({ razorpayPaymentId: razorpay_payment_id }).populate('items.product');
    if (existing) return res.json({ message: 'Payment already verified.', order: existing });

    // Confirm the payment belongs to this Razorpay order and is captured before creating a paid order.
    const payment = await client.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({ message: 'Payment does not match the order.' });
    }
    if (payment.status !== 'captured') {
      return res.status(409).json({
        message: `Payment status is "${payment.status}". The order has not been marked paid.`
      });
    }

    const address = validateShippingAddress(shippingAddress);

    // Money has already been taken at this point, so do NOT reject for stock here.
    const { savedItems, totalAmount, discountAmount, promoCode: normalizedPromo } =
      await calculateCart(items, promoCode, { checkStock: false });

    const razorpayOrder = await client.orders.fetch(razorpay_order_id);
    if (Number(razorpayOrder.amount) !== Math.round(totalAmount * 100) ||
        payment.amount !== razorpayOrder.amount ||
        payment.currency !== 'INR') {
      return res.status(400).json({ message: 'Payment amount verification failed.' });
    }

    let order;
    try {
      order = await Order.create({
        user: req.user?.id || null,
        items: savedItems,
        totalAmount,
        shippingAddress: address,
        paymentMethod: 'upi',
        paymentStatus: 'Paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        promoCode: normalizedPromo,
        discountAmount,
        status: 'Confirmed'
      });
    } catch (error) {
      // Two verify calls raced: the unique index let only one through, return that one.
      if (error.code === 11000) {
        const raced = await Order.findOne({ razorpayPaymentId: razorpay_payment_id }).populate('items.product');
        if (raced) return res.json({ message: 'Payment already verified.', order: raced });
      }
      throw error;
    }

    res.status(201).json({
      message: 'Payment verified and order saved.',
      order: await order.populate('items.product')
    });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.status ? error.message : 'Payment verification failed.'
    });
  }
};
