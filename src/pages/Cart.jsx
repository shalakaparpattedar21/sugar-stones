
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <>
      <div className="page-hero">
        <span className="page-hero__eyebrow">Your Selection</span>
        <h1>Shopping Bag</h1>
        <p>Review your pieces before moving to checkout.</p>
      </div>

      <div className="container ecommerce-page">
        <div className="cart-layout">
          <div>
            {cart.length === 0 ? (
              <div className="empty-commerce">
                <h2>Your bag is empty</h2>
                <p>
                  Find something beautiful to add to your collection.
                </p>
                <Link className="btn btn--primary" to="/shop">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={`/${item.images[0]}`}
                    alt={item.name}
                  />

                  <div className="cart-item__info">
                    <span>{item.collection}</span>
                    <h3>{item.name}</h3>
                    <p>₹{item.price.toLocaleString('en-IN')}</p>

                    <div className="qty">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>

                      <strong>{item.quantity}</strong>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-link"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong className="cart-line-total">
                    ₹
                    {(item.price * item.quantity).toLocaleString('en-IN')}
                  </strong>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <aside className="summary-card">
              <span className="section__eyebrow">Order Summary</span>
              <h2>Ready to checkout?</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
              </div>

              <Link
                to="/checkout"
                className="btn btn--gold summary-btn"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="btn btn--outline summary-btn"
              >
                Continue Shopping
              </Link>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
