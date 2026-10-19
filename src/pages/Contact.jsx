
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    interest: '',
    message: '',
  });

  const [open, setOpen] = useState(null);

  const send = () => {
    const msg = `Hi, I'm ${
      form.name || 'interested in Sugar & Stones jewellery'
    }.

I'm looking for: ${form.interest || 'Jewellery'}

${form.message}`;

    window.open(
      `https://wa.me/919930766951?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  };

  const faqs = [
    [
      'How do I place an order?',
      'Browse the collection, add your favourites to the bag, and use checkout. You can also enquire directly on WhatsApp.',
    ],
    [
      'Do you ship across India?',
      'Yes, shipping details can be confirmed for your location before the final order.',
    ],
    [
      'What is 1gm gold jewellery?',
      'It is jewellery plated with 1 gram of real gold over a base metal, offering the appearance of gold at a lower cost.',
    ],
    [
      'Are the pieces anti-tarnish?',
      'Many modern and everyday pieces feature anti-tarnish coatings. Product details mention the relevant finish.',
    ],
    [
      'Can I add multiple pieces to one order?',
      'Yes. Add multiple pieces to the bag and checkout together.',
    ],
  ];

  return (
    <div className="container">
      <div className="contact-layout">
        <div className="contact-info">
          <span className="contact-info__eyebrow">Get in Touch</span>

          <h1>We'd love to hear from you.</h1>

          <p>
            Questions about a piece, a custom request, or simply want to
            say hello? Reach us directly.
          </p>

          <div className="contact-channels">
            <a
              href="mailto:shipragold07@gmail.com"
              className="contact-channel"
            >
              <div className="contact-channel__icon">✉</div>

              <div className="contact-channel__body">
                <h4>Email</h4>
                <p>shipragold07@gmail.com</p>
              </div>

              <span className="contact-channel__arrow">→</span>
            </a>

            <a
              href="https://wa.me/919930766951"
              target="_blank"
              rel="noreferrer"
              className="contact-channel"
            >
              <div className="contact-channel__icon contact-channel__icon--wa">
                W
              </div>

              <div className="contact-channel__body">
                <h4>WhatsApp</h4>
                <p>Message us for product help</p>
              </div>

              <span className="contact-channel__arrow">→</span>
            </a>
          </div>
        </div>

        <div className="contact-enquiry">
          <div className="quick-enquiry">
            <h3>Send a Quick Enquiry</h3>

            <p>
              Fill in the details below and we'll open WhatsApp with your
              message pre-filled.
            </p>

            <div className="form-field">
              <label>Your Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g. Priya Sharma"
              />
            </div>

            <div className="form-field">
              <label>I'm Looking For</label>

              <select
                value={form.interest}
                onChange={(e) =>
                  setForm({ ...form, interest: e.target.value })
                }
              >
                <option value="">Select a category…</option>
                <option>Wedding Jewellery</option>
                <option>Party Wear</option>
                <option>Everyday Jewellery</option>
                <option>Bracelets</option>
                <option>A Specific Product</option>
              </select>
            </div>

            <div className="form-field">
              <label>Message</label>

              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                placeholder="Tell us what you're looking for…"
              />
            </div>

            <button
              className="btn btn--whatsapp"
              onClick={send}
              style={{
                width: '100%',
                justifyContent: 'center',
              }}
            >
              Open in WhatsApp
            </button>
          </div>

          <h2>Frequently Asked</h2>
          <p>Quick answers to the questions we hear most often.</p>

          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div className="faq-item" key={q}>
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {q}
                  <span className="faq-icon">+</span>
                </button>

                <div
                  className={`faq-answer ${
                    open === i ? 'open' : ''
                  }`}
                >
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
