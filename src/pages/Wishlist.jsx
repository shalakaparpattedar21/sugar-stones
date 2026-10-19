
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <>
      <div className="page-hero">
        <span className="page-hero__eyebrow">Saved for Later</span>
        <h1>My Wishlist</h1>
        <p>
          Keep the pieces you love close until you're ready to make
          them yours.
        </p>
      </div>

      <div className="container ecommerce-page">
        {wishlist.length ? (
          <div className="product-grid">
            {wishlist.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-commerce">
            <div className="wishlist-empty-icon">♡</div>

            <h2>Your wishlist is waiting</h2>

            <p>
              Save your favourite jewellery here and come back whenever
              inspiration strikes.
            </p>

            <Link to="/shop" className="btn btn--gold">
              Explore Jewellery
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
