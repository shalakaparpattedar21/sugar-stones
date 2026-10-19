
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProduct, getProducts } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Product() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [active, setActive] = useState(0);
  const [pin, setPin] = useState('');
  const [delivery, setDelivery] = useState('');

  const { addToCart, buyNow } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    setProduct(null);

    Promise.all([getProduct(id), getProducts()]).then(([p, all]) => {
      setProduct(p);

      setRelated(
        all
          .filter(
            (x) =>
              x.id !== p.id &&
              (x.collection === p.collection ||
                x.category === p.category)
          )
          .slice(0, 4)
      );
    });
  }, [id]);

  if (!product) {
    return <div className="loading-page">Loading product…</div>;
  }

  const checkDelivery = () =>
    setDelivery(
      pin.length === 6
        ? `Available for ${pin} · Estimated 3–7 working days`
        : 'Enter a valid 6-digit pincode'
    );

  return (
    <>
      <div className="product-detail">
        <div className="container">
          <div className="product-detail__inner">
            <div className="gallery">
              <div className="gallery__main">
                <img
                  src={`/${product.images[active]}`}
                  alt={product.name}
                />
              </div>

              <div className="gallery__thumbs">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    className={`gallery__thumb ${
                      active === i ? 'active' : ''
                    }`}
                    onClick={() => setActive(i)}
                  >
                    <img
                      src={`/${src}`}
                      alt={`Product view ${i + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-info">
              <nav className="product-info__breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <Link to="/shop">Shop</Link>
                <span>/</span>
                <span>{product.name}</span>
              </nav>

              <span className="product-info__collection">
                {product.collection}
              </span>

              <h1 className="product-info__name">{product.name}</h1>

              <p className="product-info__code">
                Code: {product.code}
              </p>

              <div className="product-info__price">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              <div className="product-info__availability">
                ● {product.availability}
              </div>

              <div className="product-info__divider"></div>

              <p className="product-info__description">
                {product.description}
              </p>

              <div className="product-assurance">
                <div>
                  <strong>✦ Easy Delivery</strong>
                  <span>Pan-India shipping available</span>
                </div>

                <div>
                  <strong>♢ Secure Checkout</strong>
                  <span>Protected mock checkout</span>
                </div>

                <div>
                  <strong>↻ Customer Support</strong>
                  <span>WhatsApp assistance</span>
                </div>
              </div>

              <div className="delivery-check">
                <span>Check delivery to your pincode</span>

                <div>
                  <input
                    value={pin}
                    onChange={(e) =>
                      setPin(
                        e.target.value.replace(/\D/g, '').slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit pincode"
                  />

                  <button type="button" onClick={checkDelivery}>
                    Check
                  </button>
                </div>

                {delivery && <small>{delivery}</small>}
              </div>

              <Accordion title="Material">
                <p>{product.material}</p>
              </Accordion>

              <Accordion title="Care Instructions">
                <p>{product.care}</p>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <p>
                  Mock delivery is available across India. In a
                  production MERN backend, this section can be connected
                  to live delivery estimates and return policies.
                </p>
              </Accordion>

              <div className="product-info__cta">
                <button
                  className="btn btn--gold"
                  onClick={() => {
                    buyNow(product);
                    location.href = '/checkout';
                  }}
                >
                  Buy Now
                </button>

                <button
                  className="btn btn--outline"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

                <button
                  className={`product-wishlist-btn ${
                    isWishlisted(product.id) ? 'saved' : ''
                  }`}
                  onClick={() => toggleWishlist(product)}
                >
                  {isWishlisted(product.id)
                    ? '♥ Saved to Wishlist'
                    : '♡ Add to Wishlist'}
                </button>

                <a
                  href={`https://wa.me/919930766951?text=${encodeURIComponent(
                    `Hi, I'm interested in ${product.name} (${product.code}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--whatsapp"
                >
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="related-section section--tight">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">You May Also Love</span>
            <h2 className="section__title">Similar Pieces</h2>
            <div className="divider"></div>
          </div>

          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`detail-row ${open ? 'open' : ''}`}>
      <button
        className="detail-row__header"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className="detail-row__icon">+</span>
      </button>

      <div className="detail-row__body">{children}</div>
    </div>
  );
}
