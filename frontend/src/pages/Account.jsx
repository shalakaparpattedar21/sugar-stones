
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Account() {
  const { user, logout, orders } = useAuth();
  const nav = useNavigate();

  if (!user) {
    return (
      <div className="auth-required">
        <h1>Your account awaits</h1>
        <p>
          Sign in to access your wishlist, order history and saved
          shopping details.
        </p>
        <Link to="/login" className="btn btn--gold">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero">
        <span className="page-hero__eyebrow">My Account</span>
        <h1>Hello, {user.name.split(' ')[0]}</h1>
        <p>Manage your Sugar & Stones shopping experience.</p>
      </div>

      <div className="container ecommerce-page">
        <div className="account-layout">
          <aside className="account-menu">
            <div className="account-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <strong>{user.name}</strong>
            <span>{user.email}</span>

            <Link to="/wishlist">♡ Wishlist</Link>
            <Link to="/cart">🛍 Shopping Bag</Link>

            <button
              onClick={() => {
                logout();
                nav('/');
              }}
            >
              Sign Out
            </button>
          </aside>

          <main className="account-main">
            <div className="account-panel">
              <div className="account-panel__head">
                <div>
                  <span className="section__eyebrow">Profile</span>
                  <h2>Personal Details</h2>
                </div>

                <span className="account-badge">Member</span>
              </div>

              <div className="profile-grid">
                <div>
                  <small>Name</small>
                  <strong>{user.name}</strong>
                </div>

                <div>
                  <small>Email</small>
                  <strong>{user.email}</strong>
                </div>

                <div>
                  <small>Mobile</small>
                  <strong>{user.phone || 'Not added'}</strong>
                </div>
              </div>
            </div>

            <div className="account-panel">
              <div className="account-panel__head">
                <div>
                  <span className="section__eyebrow">Your Purchases</span>
                  <h2>Order History</h2>
                </div>
              </div>

              {orders.length ? (
                orders.slice(0, 6).map((o) => (
                  <div className="order-row" key={o.orderId}>
                    <div>
                      <strong>#{o.orderId}</strong>
                      <span>
                        {new Date(
                          o.createdAt || Date.now()
                        ).toLocaleDateString('en-IN')}
                        {' · '}
                        {o.items?.length || 0} item(s)
                      </span>
                    </div>

                    <div>
                      <strong>
                        ₹
                        {Number(
                          o.totalAmount ?? o.total ?? 0
                        ).toLocaleString('en-IN')}
                      </strong>

                      <span className="status-pill">
                        {o.status || 'confirmed'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="account-empty">
                  <p>You haven't placed an order yet.</p>
                  <Link to="/shop" className="btn btn--outline">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
