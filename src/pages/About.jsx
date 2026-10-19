
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      <div className="about-hero">
        <div className="about-hero__image">
          <img
            src="/assets/images/IMG-20260628-WA0039.jpg"
            alt="Sugar & Stones jewellery"
          />
        </div>

        <div className="about-hero__content">
          <span className="section__eyebrow">Our Story</span>
          <h1>
            Born from a love of <em>adorning</em> every occasion
          </h1>
          <p>
            Sugar & Stones began with a simple belief — that beautiful
            jewellery should be accessible to every woman, for every
            celebration in her life.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="story-prose">
            <p>
              What started as a personal passion for jewellery became
              something more — a collection that celebrates the richness
              of Indian craftsmanship alongside the clean lines of
              contemporary design.
            </p>

            <p>
              Every piece in our collection is chosen with intention.
              We look for jewellery that honours the occasions it will
              be worn to — whether that's a bride stepping into her
              forever, a daughter dressed for a family celebration, or
              a woman who simply wants to feel beautiful on a Tuesday.
            </p>

            <p>
              Our speciality is bridging the gap between tradition and
              modernity. Our Wedding Collection carries the opulence of
              kundan and pearl work that has adorned Indian brides for
              generations.
            </p>
          </div>
        </div>
      </section>

      <section
        className="section--tight"
        style={{
          background: 'var(--white)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section__header section__header--center">
            <span className="section__eyebrow">What We Stand For</span>
            <h2 className="section__title">Our Values</h2>
            <div className="divider divider--center"></div>
          </div>

          <div className="values-grid">
            <Value
              title="Craftsmanship"
              text="Every piece is chosen for the quality of its making — from the setting of stones to the finish of the metal."
            />

            <Value
              title="Accessibility"
              text="Luxury should not be out of reach. Our collections span a range of prices without compromising on the feeling of something special."
            />

            <Value
              title="Personal Service"
              text="We believe jewellery is personal, which is why every customer interaction is handled with care."
            />
          </div>
        </div>
      </section>

      <section className="section about-cta">
        <div className="container">
          <div className="section__header section__header--center">
            <span className="section__eyebrow">Begin Your Journey</span>
            <h2 className="section__title">Ready to Find Your Piece?</h2>
            <div className="divider divider--center"></div>
            <p className="section__subtitle">
              Browse our collection and shop your favourites online.
            </p>

            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/shop" className="btn btn--primary">
                Explore the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Value({ title, text }) {
  return (
    <div className="value-card">
      <div className="value-card__icon">✦</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
