import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, toUiOrder } from '../api/orderApi';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  loadRazorpayScript
} from '../api/paymentApi';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { user, saveOrder } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    pincode: '',
    payment: 'cod'
  });
  const [busy, setBusy] = useState(false);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  if (!cart.length) {
    return <div className="loading-page"><h2>Your bag is empty.</h2><p>Add a product before checkout.</p></div>;
  }

  const paymentItems = () => cart.map(item => ({
    product: item.id || item._id,
    quantity: Number(item.quantity)
  }));

  const shippingAddress = () => ({
    name: form.name,
    phone: form.phone,
    address: form.address,
    city: form.city,
    pincode: form.pincode
  });

  const finishOrder = order => {
    saveOrder(order);
    clearCart();
    nav('/order-success', { state: { order } });
  };

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (form.payment === 'upi') {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error('Could not load Razorpay Checkout. Check your internet connection.');

        const checkoutOrder = await createRazorpayOrder({
          items: paymentItems(),
          shippingAddress: shippingAddress(),
          promoCode: promo
        });

        const options = {
          key: checkoutOrder.keyId,
          amount: checkoutOrder.amount,
          currency: checkoutOrder.currency || 'INR',
          name: 'Sugar & Stones',
          description: 'Jewellery purchase',
          order_id: checkoutOrder.razorpayOrderId,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone
          },
          notes: { store: 'Sugar & Stones' },
          theme: { color: '#b88a44' },
          handler: async response => {
            try {
              const verified = await verifyRazorpayPayment({
                ...response,
                items: paymentItems(),
                shippingAddress: shippingAddress(),
                promoCode: promo
              });
              finishOrder(toUiOrder(verified.order));
            } catch (verifyError) {
              setError(
                verifyError.response?.data?.message ||
                'Payment could not be verified. Do not retry payment immediately; check the Razorpay test dashboard first.'
              );
              setBusy(false);
            }
          },
          modal: {
            ondismiss: () => setBusy(false)
          }
        };

        const checkout = new window.Razorpay(options);
        checkout.on('payment.failed', response => {
          setError(response.error?.description || 'Test payment failed. Please try again.');
          setBusy(false);
        });
        checkout.open();
        return;
      }

      // Only product ids + quantities are sent; the server looks up prices and applies the promo itself.
      const order = await createOrder({
        items: paymentItems(),
        shippingAddress: shippingAddress(),
        paymentMethod: 'cod',
        promoCode: promo || undefined
      });

      finishOrder(order);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not place the order.');
      setBusy(false);
    }
  };

  const applyPromo = () => {
    const normalized = promo.trim().toUpperCase();
    setDiscount(normalized === 'SUGAR10' ? Math.round(subtotal * 0.10) : 0);
  };

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  return <>
    <div className="page-hero">
      <span className="page-hero__eyebrow">Secure Checkout</span>
      <h1>Complete Your Order</h1>
      <p>UPI payments are processed in Razorpay Test Mode. No real money is transferred.</p>
    </div>
    <div className="container ecommerce-page">
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Delivery Details</h2>
          <div className="form-grid">
            <Field label="Full Name" name="name" value={form.name} onChange={change} required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={change} required />
            <Field label="Phone" name="phone" value={form.phone} onChange={change} required />
            <Field label="Pincode" name="pincode" value={form.pincode} onChange={change} required />
          </div>
          <Field label="Address" name="address" value={form.address} onChange={change} required />
          <Field label="City" name="city" value={form.city} onChange={change} required />

          <h2 className="checkout-subhead">Promo Code</h2>
          <div className="promo-row">
            <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Try SUGAR10" />
            <button type="button" onClick={applyPromo}>Apply</button>
          </div>
          {discount > 0 && <p className="promo-success">10% discount applied — you saved ₹{discount.toLocaleString('en-IN')}.</p>}

          <h2 className="checkout-subhead">Payment Method</h2>
          <label className="payment-option">
            <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={change} />
            Cash on Delivery <span>Available</span>
          </label>
          <label className="payment-option">
            <input type="radio" name="payment" value="upi" checked={form.payment === 'upi'} onChange={change} />
            UPI via Razorpay <span>Test Mode</span>
          </label>
          {form.payment === 'upi' && (
            <p className="form-hint">
              Razorpay Checkout will show payment methods enabled for your test account. Use test-mode payment details only; no real UPI transfer occurs.
            </p>
          )}

          {error && <div className="form-error">{error}</div>}
          <button className="btn btn--gold checkout-submit" disabled={busy}>
            {busy ? 'Processing…' : form.payment === 'upi' ? 'Continue to Test Payment' : 'Place Order'}
          </button>
        </form>

        <aside className="summary-card">
          <span className="section__eyebrow">Your Items</span>
          {cart.map(x => (
            <div className="mini-order" key={x.id || x._id}>
              <img src={`/${x.images?.[0] || x.image || ''}`} alt="" />
              <div><strong>{x.name}</strong><span>{x.quantity} × ₹{Number(x.price).toLocaleString('en-IN')}</span></div>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>₹{(subtotal - discount).toLocaleString('en-IN')}</strong>
          </div>
        </aside>
      </div>
    </div>
  </>;
}

function Field({ label, ...props }) {
  return <label className="form-field"><span>{label}</span>{props.name === 'address' ? <textarea {...props} /> : <input {...props} />}</label>;
}
