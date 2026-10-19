
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/productApi';

const heroImages = [
  '/assets/images/IMG-20260628-WA0023.jpg',
  '/assets/images/IMG-20260628-WA0033.jpg',
  '/assets/images/IMG-20260628-WA0013.jpg',
];

const collections = [
  [
    'Wedding Collection',
    '/assets/images/IMG-20260628-WA0033.jpg',
  ],
  [
    'Party Wear',
    '/assets/images/IMG-20260628-WA0013.jpg',
  ],
  [
    'Everyday Elegance',
    '/assets/images/dmt90-2.jpg',
  ],
  [
    'Bracelets',
    '/assets/images/IMG-20260628-WA0001.jpg',
  ],
];

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((p) =>
      setProducts(p.filter((x) => x.featured).slice(0, 4))
    );
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">
            Fine Jewellery · Crafted with Care
          </span>

          <h1 className="hero__title hero__title--logo">
            <img
              src="/assets/images/logo.png"
              alt="Sugar & Stones Jewelry"
            />
          </h1>

          <p className="hero__tagline">
            Crafted for Every Celebration.
          </p>

          <p className="hero__desc">
            From timeless bridal sets to everyday pieces that shimmer —
            every jewel in our collection is chosen to mark your most
            cherished moments.
          </p>

          <div className="hero__cta">
            <Link to="/shop" className="btn btn--primary">
              Explore Collection
            </Link>

            <Link to="/contact" className="btn btn--outline">
              Enquire Now
            </Link>
          </div>
        </div>

        <div className="hero__collage">
          <div className="hero__collage-grid">
            {heroImages.map((src, i) => (
              <div className="hero__collage-img" key={src}>
                <img
                  src={src}
                  alt="Sugar & Stones jewellery"
                  loading={i ? 'lazy' : 'eager'}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hero__scroll">Scroll to explore</div>
      </section>

      <div
        className="refer-band reveal visible"
        style={{
          background: 'var(--bg-deep)',
          color: '#fff',
          padding: 'var(--space-lg) 0',
        }}
      >
        <div className="container">
          <div className="section__header section__header--center">
            <span
              className="section__eyebrow"
              style={{ color: 'var(--gold)' }}
            >
              Refer & Earn
            </span>

            <h2
              className="section__title"
              style={{ color: '#fff' }}
            >
              Share the sparkle, get rewarded
            </h2>

            <div className="divider divider--center"></div>

            <p
              className="section__subtitle"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              Refer a friend to Sugar & Stones. When they place their
              first order, you get{' '}
              <strong style={{ color: 'var(--gold)' }}>₹200</strong>
              {' '}and they get{' '}
              <strong style={{ color: 'var(--gold)' }}>₹100</strong>
              {' '}off — just mention your name when you order.
            </p>

            <div className="reward-values">
              <div>
                <div className="reward-amount">₹200</div>
                <div className="reward-label">For You</div>
              </div>

              <div>
                <div className="reward-amount">₹100</div>
                <div className="reward-label">For Your Friend</div>
              </div>
            </div>

            <a
              href="https://wa.me/919930766951"
              target="_blank"
              rel="noreferrer"
              className="btn btn--gold"
            >
              Refer on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="trust-strip">
        <div className="container">
          <div className="trust-strip__inner">
            {[
              [
                'Curated Collections',
                'Handpicked pieces for every occasion',
              ],
              [
                'Anti-Tarnish Pieces',
                'Lasting shine, lasting beauty',
              ],
              [
                'Easy Checkout',
                'Simple and secure shopping',
              ],
              [
                '1gm Gold Available',
                'Premium look, accessible price',
              ],
            ].map(([a, b]) => (
              <div className="trust-item" key={a}>
                <div className="trust-item__icon">✦</div>

                <div className="trust-item__text">
                  <h5>{a}</h5>
                  <p>{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="section featured-section">
        <div className="container">
          <div className="section__header">
            <span className="section__eyebrow">Curated for You</span>
            <h2 className="section__title">Featured Pieces</h2>
            <div className="divider"></div>

            <p className="section__subtitle">
              Our most-loved jewellery — each piece a conversation
              starter, an heirloom in the making.
            </p>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: '3rem',
            }}
          >
            <Link to="/shop" className="btn btn--outline">
              View All Pieces
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__header section__header--center">
            <span className="section__eyebrow">Shop by Style</span>
            <h2 className="section__title">Our Collections</h2>
            <div className="divider divider--center"></div>
          </div>

          <div className="collections-grid">
            {collections.map(([name, img]) => (
              <Link
                key={name}
                to={`/shop?collection=${encodeURIComponent(name)}`}
                className="collection-card reveal visible"
              >
                <img src={img} alt={name} />

                <div className="collection-card__body">
                  <div className="collection-card__name">{name}</div>
                  <span className="collection-card__link">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="about-strip">
        <div className="about-strip__image">
          <img
            src="/assets/images/dmt87-4.jpg"
            alt="Sugar & Stones Jewellery"
          />
        </div>

        <div className="about-strip__content">
          <span className="about-strip__eyebrow">Our Story</span>

          <h2 className="about-strip__title">
            Jewellery born from a love of celebration
          </h2>

          <p className="about-strip__desc">
            Sugar & Stones was born from a belief that every woman
            deserves to feel adorned — at weddings, at festivals, and
            in the quiet moments in between. Each piece is chosen with
            intention, crafted with care.
          </p>

          <Link to="/about" className="btn btn--gold">
            Read Our Story
          </Link>
        </div>
      </div>

      <section className="section instagram-section">
        <div className="container">
          <span className="section__eyebrow">Follow Along</span>
          <h2 className="section__title">Find Us on Instagram</h2>
          <div className="divider divider--center"></div>

          <p>
            See our latest arrivals, styling inspiration, and
            behind-the-scenes from our studio.
          </p>

          <div className="home-social-actions">
            <a
              href="https://www.instagram.com/sugarandstones123"
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline"
            >
              ♦ @sugarandstones on Instagram
            </a>

            <a
              href="https://whatsapp.com/channel/0029VbCWbq0B4hdRPZgqRW1q"
              target="_blank"
              rel="noreferrer"
              className="btn btn--whatsapp"
            >
              Follow on WhatsApp Channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
