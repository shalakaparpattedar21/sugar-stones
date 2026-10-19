import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="nav__logo">
              Sugar <span style={{ color: 'var(--gold)' }}>&</span> Stones
            </Link>
            <p>
              Crafted for Every Celebration. Premium jewellery for brides,
              celebrations and the everyday moments that deserve to shine.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com/sugarandstones123" target="_blank">♦</a>
              <a href="https://www.facebook.com/share/18BAbuiJAV/" target="_blank">f</a>
              <a href="https://www.threads.com/@sugarandstones123" target="_blank">@</a>
              <a href="https://whatsapp.com/channel/0029VbCWbq0B4hdRPZgqRW1q" target="_blank">W</a>
              <a href="mailto:shipragold07@gmail.com">✉</a>
            </div>
          </div>

          <div className="footer__col">
            <h5>Explore</h5>
            <ul>
              <li><Link to="/shop">All Jewellery</Link></li>
              <li><Link to="/shop?collection=Wedding%20Collection">Wedding Collection</Link></li>
              <li><Link to="/shop?collection=Party%20Wear">Party Wear</Link></li>
              <li><Link to="/shop?collection=Everyday%20Elegance">Everyday Elegance</Link></li>
              <li><Link to="/shop?collection=Bracelets">Bracelets</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h5>Pages</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/account">My Account</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h5>Connect</h5>
            <ul>
              <li><a href="https://www.instagram.com/sugarandstones123" target="_blank">Instagram</a></li>
              <li><a href="https://www.threads.com/@sugarandstones123" target="_blank">Threads</a></li>
              <li><a href="https://whatsapp.com/channel/0029VbCWbq0B4hdRPZgqRW1q" target="_blank">WhatsApp Channel</a></li>
              <li><a href="mailto:shipragold07@gmail.com">Email Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Sugar & Stones. All rights reserved.</p>
          <p>Handcrafted with care · Made in India</p>
        </div>
      </div>
    </footer>
  );
}
