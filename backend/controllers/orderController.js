import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { calculateCart, validateShippingAddress } from '../utils/cart.js';

const sendError = (res, error, fallbackMessage) => {
  const status = error.status || 500;
  res.status(status).json({ message: error.status ? error.message : fallbackMessage });
};

// Cash on Delivery. Prices, discount and total are recalculated from the database;
// whatever the browser sends for those is ignored.
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, promoCode } = req.body || {};
    if (paymentMethod === 'upi') return res.status(400).json({ message: 'For UPI, use the Razorpay payment flow.' });

    const address = validateShippingAddress(shippingAddress);
    const cart = await calculateCart(items, promoCode);

    const order = await Order.create({
      user: req.user?.id || null,
      items: cart.savedItems,
      totalAmount: cart.totalAmount,
      shippingAddress: address,
      paymentMethod: 'cod',
      paymentStatus: 'Pending',
      promoCode: cart.promoCode,
      discountAmount: cart.discountAmount
    });

    res.status(201).json(await order.populate('items.product'));
  } catch (error) {
    sendError(res, error, 'Could not place the order.');
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    sendError(res, error, 'Could not load your orders.');
  }
};

// Anyone with an order number can see its STATUS (guest tracking).
// Only the customer who owns the order gets the full details (address, phone, items).
export const getOrder = async (req, res) => {
  try {
    const id = String(req.params.id || '');
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderNumber: id };
    const order = await Order.findOne(query).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = req.user?.id && order.user && String(order.user) === String(req.user.id);
    if (isOwner) return res.json(order);

    res.json({ orderNumber: order.orderNumber, status: order.status, createdAt: order.createdAt });
  } catch (error) {
    sendError(res, error, 'Could not look up the order.');
  }
};
