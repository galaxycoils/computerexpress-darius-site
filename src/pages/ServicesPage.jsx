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

export default function ServicesPage() {
  return (
    <>
      <Seo title="Services | ComputerExpress" description="Services built around visibility, trust, and conversion" path="/services" />
      <section className="section-first page-hero">
        <div className="container">
          <h1>Services built around visibility, trust, and conversion</h1>
          <p>ComputerExpress focuses on the three areas that tend to matter most for local service brands: site quality, search readiness, and local presence.</p>
        </div>
      </section>

      <section className="section">
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
          <h2>Offer structure you can publish now and refine later</h2>
          <p>Use these as draft packages for launch, then tighten them as your positioning becomes more specific.</p>
        </div>
        <div className="container page-block">
          <p>Need help deciding which offer to lead with?</p>
          <p>Start with a free audit and use that to shape the first version of the sales page.</p>
        </div>
      </section>

      <section className="section">
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

      <section className="section">
        <div className="container cta-strip">
          <div>
            <h2>Ready to get started?</h2>
            <p>Request a free audit and we'll identify the highest-leverage improvements for your site.</p>
          </div>
          <Link to="/contact" className="button button-primary">Request Free Audit</Link>
        </div>
      </section>
    </>
  )
}
