import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrder } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';

export default function TrackOrder() {
  const { user } = useAuth();
  const [id, setId] = useState('');
  const [found, setFound] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setFound(null);

    try {
      const order = await getOrder(id.trim());
      setFound(order);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not find that order.');
    } finally {
      setBusy(false);
    }
  };

  return <>
    <div className="page-hero">
      <span className="page-hero__eyebrow">After You Order</span>
      <h1>Track Your Order</h1>
      <p>Enter your Sugar & Stones order number to see its current status.</p>
    </div>
    <div className="container ecommerce-page">
      <div className="track-card">
        <form onSubmit={submit}>
          <label className="form-field">
            <span>Order Number / ID</span>
            <input value={id} onChange={e => setId(e.target.value)} placeholder="e.g. SS12345678" required />
          </label>
          <button className="btn btn--gold" disabled={busy}>{busy ? 'Checking…' : 'Track Order'}</button>
        </form>
        {found ? (
          <div className="tracking-result">
            <span className="status-pill">{found.status}</span>
            <h2>Order #{found.orderId}</h2>
            <p>Thank you for shopping with Sugar & Stones. Your order has been received and is being prepared.</p>
            <div className="tracking-steps">
              <span className={['Confirmed','Shipped','Delivered'].includes(found.status) ? 'done' : ''}>✓ Order Confirmed</span>
              <span className={['Shipped','Delivered'].includes(found.status) ? 'done' : ''}>○ Being Prepared</span>
              <span className={['Shipped','Delivered'].includes(found.status) ? 'done' : ''}>○ Out for Delivery</span>
              <span className={found.status === 'Delivered' ? 'done' : ''}>○ Delivered</span>
            </div>
          </div>
        ) : error ? <p className="form-error">{error}</p> : null}
        {!user && <p className="form-error">Sign in to access your order history.</p>}
        <Link to="/shop" className="auth-back">Continue shopping →</Link>
      </div>
    </div>
  </>;
}
