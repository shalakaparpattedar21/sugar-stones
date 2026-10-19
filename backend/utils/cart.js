import mongoose from 'mongoose';
import Product from '../models/Product.js';

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const PROMO_CODES = { SUGAR10: 0.10 };

export function validateShippingAddress(address) {
  const fields = ['name', 'phone', 'address', 'city', 'pincode'];
  const clean = {};
  for (const f of fields) {
    const value = typeof address?.[f] === 'string' ? address[f].trim() : '';
    if (!value) throw httpError(400, 'Complete all delivery details before placing the order.');
    clean[f] = value;
  }
  return clean;
}

// Prices ALWAYS come from the database, never from the browser.
export async function calculateCart(items, promoCode, { checkStock = true } = {}) {
  if (!Array.isArray(items) || items.length === 0) throw httpError(400, 'Your cart is empty.');

  let subtotal = 0;
  const savedItems = [];

  for (const item of items) {
    const productId = String(item?.product || item?.id || '');
    const quantity = Number(item?.quantity);

    if (!mongoose.Types.ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw httpError(400, 'Invalid product or quantity in cart.');
    }

    const product = await Product.findById(productId);
    if (!product) throw httpError(400, 'A product in your cart is no longer available.');
    if (checkStock && (product.inStock === false || product.availability === 'Out of Stock')) {
      throw httpError(409, `"${product.name}" is out of stock.`);
    }

    const price = Number(product.price);
    subtotal += price * quantity;
    savedItems.push({
      product: product._id,
      name: product.name,
      price,
      quantity,
      image: product.images?.[0] || ''
    });
  }

  const normalizedPromo = String(promoCode || '').trim().toUpperCase();
  const rate = PROMO_CODES[normalizedPromo] || 0;
  const discountAmount = Math.round(subtotal * rate);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    throw httpError(400, 'The order amount must be greater than zero.');
  }

  return { savedItems, subtotal, discountAmount, totalAmount, promoCode: discountAmount ? normalizedPromo : '' };
}
