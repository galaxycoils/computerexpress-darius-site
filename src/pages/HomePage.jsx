import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

const services = [
  {
    title: 'High-Performance Websites',
    description: 'Premium websites built to load fast, earn trust quickly, and guide visitors toward a clear next step.',
    bullets: ['Custom page structure', 'Conversion-focused messaging', 'Mobile-first build quality']
  },
  {
    title: 'Technical SEO',
    description: 'Search-ready architecture, metadata, internal linking, schema, and performance work that supports rankings over time.',
    bullets: ['Keyword-informed structure', 'On-page SEO setup', 'Technical cleanup + schema']
  },
  {
    title: 'Google Business Profile',
    description: 'Local visibility systems for businesses that need stronger map presence, better trust signals, and more calls.',
    bullets: ['GBP optimization', 'Review strategy', 'Local landing page alignment']
  }
]

const packages = [
  {
    name: 'Launch',
    price: '$1,500+',
    ideal: 'For businesses that need a sharp, credible online presence fast.',
    features: ['1-5 page website', 'Mobile-first design', 'Core on-page SEO', 'Contact funnel setup']
  },
  {
    name: 'Growth',
    price: '$3,500+',
    ideal: 'For teams that want stronger positioning, better search visibility, and more qualified leads.',
    features: ['Custom website build', 'Technical SEO foundation', 'Offer-driven copy', 'Analytics + conversion tracking']
  },
  {
    name: 'Local Authority',
    price: '$5,500+',
    ideal: 'For service brands ready to compete harder in local search and maps.',
    features: ['Everything in Growth', 'GBP optimization', 'Local SEO page structure', 'Review/content workflow']
  }
]

const steps = [
  'Audit your current site, offer clarity, search visibility, and conversion friction.',
  'Shape the right information architecture, messaging, and local SEO opportunities.',
  'Design and build a site that looks premium and performs like a sales asset.',
  'Launch with tracking, search fundamentals, and a clear lead capture path.'
]

const trustItems = [
  'Premium positioning without agency fluff',
  'Search-ready structure from day one',
  'Built for local service businesses',
  'Clear calls to action and conversion flow'
]

export default function HomePage() {
  return (
    <>
      <Seo />
      <section className="section-first hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Built for service businesses that need better leads, not just more traffic</div>
            <h1>Websites that look premium, rank cleanly, and convert with intent.</h1>
            <p className="hero-copy">
              ComputerExpress builds high-performance websites, technical SEO foundations, and local growth systems for businesses that need stronger visibility and more qualified inquiries.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="button button-primary">Get a Free SEO Audit</Link>
              <Link to="/services" className="button button-secondary">Explore Services</Link>
            </div>
            <ul className="hero-points">
              <li>Core promise: <strong>More trust. Better visibility. Higher-quality leads.</strong></li>
              <li>Build quality: <strong>Fast + mobile-first</strong></li>
              <li>Search readiness: <strong>SEO + schema baked in</strong></li>
              <li>Conversion flow: <strong>Offer clarity + CTA focus</strong></li>
              <li>Local growth: <strong>GBP alignment</strong></li>
            </ul>
          </div>
          <div className="hero-card">
            <div className="metric-grid">
              <div>
                <span>Performance-first</span>
                <strong>Search-ready architecture</strong>
              </div>
              <div>
                <span>Premium positioning</span>
                <strong>Local lead generation</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container section-heading">
          <h2>Built to help local businesses look sharper and convert faster</h2>
          <p>Every engagement is designed to improve clarity, credibility, search visibility, and the path from visit to inquiry.</p>
        </div>
        <div className="container card-grid three-up page-block">
          {services.map(s => (
            <article key={s.title} className="info-card">
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <ul className="feature-list">
                {s.bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container section-heading">
          <h2>A simple workflow built around clarity, speed, and execution</h2>
          <p>The goal is not to bury you in process. It is to move from diagnosis to launch with a cleaner strategy.</p>
        </div>
        <div className="container page-block">
          <ol className="step-list">
            {steps.map((s, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container section-heading">
          <h2>Starter packages you can tune before launch</h2>
          <p>These tiers give you a usable pricing structure now while keeping room to refine your offer later.</p>
        </div>
        <div className="container card-grid three-up page-block">
          {packages.map(p => (
            <article key={p.name} className="pricing-card">
              <div className="pricing-top">
                <h3>{p.name}</h3>
                <strong>{p.price}</strong>
              </div>
              <p className="pricing-ideal">{p.ideal}</p>
              <ul>
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container trust-bar">
          <div className="trust-items">
            {trustItems.map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-strip">
          <div>
            <h2>AI-first execution without generic agency language</h2>
            <p>ComputerExpress blends modern design, technical execution, and practical local growth strategy.</p>
          </div>
          <Link to="/contact" className="button button-primary">Book Audit</Link>
        </div>
      </section>
    </>
  )
}
