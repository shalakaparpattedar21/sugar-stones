import { Link, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const id = state?.order?.orderId || 'SS-DEMO';

  return <div className="success-page">
    <div className="success-card">
      <div className="success-icon">✦</div>
      <span className="section__eyebrow">Order Confirmed</span>
      <h1>Thank you for shopping with us.</h1>
      <p>Your order has been saved to MongoDB. Order ID: <strong>{id}</strong></p>
      <div className="success-actions">
        <Link to="/shop" className="btn btn--gold">Continue Shopping</Link>
        <Link to="/account" className="btn btn--outline">View Account</Link>
      </div>
    </div>
  </div>;
}
