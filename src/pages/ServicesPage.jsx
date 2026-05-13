import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import { IconWeb, IconSearch, IconMap } from '../components/Icons'
import AnimatedSection from '../hooks/useInView'
import { services, packages } from '../data/siteData'

const servicesPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  provider: {
    '@type': 'Organization',
    name: 'ComputerExpress',
    url: 'https://computerexpress.pages.dev'
  },
  areaServed: {
    '@type': 'City',
    name: 'St. Catharines'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'ComputerExpress Services',
    itemListElement: services.map(s => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.title,
        description: s.description
      }
    }))
  }
}

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services | ComputerExpress — Web Design, SEO & Local Growth"
        description="Explore ComputerExpress services: high-performance web design, technical SEO, Google Business Profile optimization, and local SEO for service businesses."
        path="/services"
        jsonLd={servicesPageJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" aria-label="Services overview">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>What we do</div>
            <h1>Services built around visibility, trust, and conversion</h1>
            <p>ComputerExpress focuses on the three areas that tend to matter most for local service brands: site quality, search readiness, and local presence.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="Service details">
        <div className="container">
          <div className="card-grid three-up page-block stagger-children">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100}>
                <article className="info-card">
                  <div className={`icon-circle ${i === 0 ? 'cyan' : i === 1 ? 'purple' : 'green'}`} aria-hidden="true">
                    {s.icon === 'web' && <IconWeb />}
                    {s.icon === 'search' && <IconSearch />}
                    {s.icon === 'map' && <IconMap />}
                  </div>
                  <h2>{s.title}</h2>
                  <p>{s.description}</p>
                  <ul className="feature-list">
                    {s.bullets.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-label="Getting started">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Offer structure you can publish now and refine later</h2>
              <p>Use these as draft packages for launch, then tighten them as your positioning becomes more specific.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Not sure which package fits?</p>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>Start with a free audit and use that to shape the right engagement.</p>
              <Link to="/contact" className="button button-primary">Request Free Audit</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="Pricing packages">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Packages</h2>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {packages.map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 100}>
                <article className={`pricing-card ${p.featured ? 'featured' : ''}`}>
                  <div className="pricing-top">
                    <h3>{p.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-lite)', display: 'block' }}>{p.period}</span>
                      <strong>{p.price}</strong>
                    </div>
                  </div>
                  <p className="pricing-ideal">{p.ideal}</p>
                  <ul>
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to="/contact" className={`button ${p.featured ? 'button-primary' : 'button-secondary'}`}>
                    Get Started
                  </Link>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Call to action">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to get started?</h2>
                <p>Request a free audit and we'll identify the highest-leverage improvements for your site.</p>
              </div>
              <Link to="/contact" className="button button-primary">Request Free Audit</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
