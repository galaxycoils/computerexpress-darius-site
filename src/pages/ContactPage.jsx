import Seo from '../components/Seo'
import { Link, useLocation } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import ContactForm from '../components/ContactForm'
import { guarantee } from '../data/siteData'

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact St. Catharines Digital',
  url: 'https://stcatharinesdigital.pages.dev/contact',
  description: 'Contact St. Catharines Digital for web design, technical SEO, and Google Business Profile optimization. Get a free website audit.',
  about: 'We build high-performance websites and local SEO strategies for service businesses in St. Catharines and across Ontario.',
  knowsLanguage: ['English'],
  knowsAbout: ['Web Design', 'Technical SEO', 'Local SEO', 'Google Business Profile'],
  areaServed: {
    '@type': 'City',
    name: 'St. Catharines',
    containedInPlace: {
      '@type': 'State',
      name: 'Ontario',
      containedInPlace: {
        '@type': 'Country',
        name: 'Canada'
      }
    }
  }
}

// Breadcrumbs
const pathParts = useLocation().pathname.split('/').filter(Boolean)
const breadcrumbs = [
  { label: 'Home', path: '/' },
  ...pathParts.map((part, i) => ({
    label: part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    path: '/' + pathParts.slice(0, i + 1).join('/')
  }))
]

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | St. Catharines Digital — Get a Free SEO Audit"
        description="Contact St. Catharines Digital for web design, technical SEO, and Google Business Profile optimization. Get a free website audit and strategy call."
        path="/contact"
        jsonLd={contactPageJsonLd}
      />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      {/* Breadcrumbs handled by Layout */}

      {/* Hero */}
      <section className="section-first page-hero" aria-label="Contact us">
        <div className="container">
          <h1>Start with a free audit</h1>
          <p>We will review your site or business and send you a custom report with recommendations — no strings attached.</p>
        </div>
      </section>

      {/* Contact form section */}
      <section className="section" aria-label="Contact form">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-form-panel">
              <AnimatedSection>
                <div className="section-heading">
                  <div className="glow-line" aria-hidden="true"></div>
                  <h2>Send us a message</h2>
                  <p>Tell us about your business, your goals, and what is working (or not) with your current site.</p>
                </div>
                <ContactForm />
              </AnimatedSection>
            </div>

            <div className="contact-info-panel">
              <AnimatedSection delay={100}>
                <div className="info-box">
                  <h3>What happens next</h3>
                  <ul className="info-list">
                    <li>
                      <strong>Within 24 hours</strong> — We reply with a custom SEO and website audit
                    </li>
                    <li>
                      <strong>Free strategy call</strong> — Book a 30-minute call to walk through findings
                    </li>
                    <li>
                      <strong>No obligation</strong> — 30-day satisfaction guarantee on all packages
                    </li>
                    <li>
                      <strong>Response time</strong> — Expect a reply within 4 business hours
                    </li>
                  </ul>
                </div>

                <div className="info-box">
                  <h3>Get in touch directly</h3>
                  <div className="contact-method">
                    <div className="contact-method-icon" aria-hidden="true">📞</div>
                    <div>
                      <div className="contact-method-label">Phone</div>
                      <a href="tel:+13653595973">(365) 359-5973</a>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon" aria-hidden="true">📧</div>
                    <div>
                      <div className="contact-method-label">Email</div>
                      <a href="mailto:hello@stcatharinesdigital.com">hello@stcatharinesdigital.com</a>
                    </div>
                  </div>
                  <div className="contact-method">
                    <div className="contact-method-icon" aria-hidden="true">📞</div>
                    <div>
                      <div className="contact-method-label">Book a call</div>
                      <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer">30-minute free consultation</a>
                    </div>
                  </div>
                </div>

                <div className="info-box guarantee-box">
                  <h3>🔒 {guarantee.title}</h3>
                  <p>{guarantee.description}</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}