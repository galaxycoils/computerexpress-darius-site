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
    name: 'St. Catharines Digital',
    url: 'https://stcatharinesdigital.pages.dev'
  },
  areaServed: [
    { '@type': 'City', name: 'St. Catharines' },
    { '@type': 'State', name: 'Ontario' },
    { '@type': 'Country', name: 'Canada' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'St. Catharines Digital Services',
    itemListElement: services.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.description }
    }))
  }
}

const industryPages = [
  { path: '/services/web-design-for-plumbers', label: 'Plumbers', desc: 'Emergency call CTAs, service area pages, review integration, and GBP optimization.' },
  { path: '/services/web-design-for-hvac', label: 'HVAC Companies', desc: 'Seasonal service pages, maintenance plan landing pages, and local SEO.' },
  { path: '/services/web-design-for-electricians', label: 'Electricians', desc: 'Residential and commercial service pages, license display, and click-to-call.' },
  { path: '/services/local-seo-for-service-businesses', label: 'All Service Businesses', desc: 'Google Maps dominance, review generation, and local link building.' },
]

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Web Design, Technical SEO & GBP Optimization Services | St. Catharines Digital"
        description="Expert web design, technical SEO, and Google Business Profile optimization for service businesses. Custom websites that rank on Google and convert visitors into qualified leads."
        path="/services"
        jsonLd={servicesPageJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" aria-label="Services overview">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>What we do</div>
            <h1>Three services. One goal: more qualified leads.</h1>
            <p>Websites that rank on Google. Technical SEO that gets you found. Google Business Profile that drives calls. Everything service businesses need to dominate their market — nothing they don't.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="Services">
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

      <section className="section section-alt" aria-label="Industry solutions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Built for your industry</h2>
              <p>Specialized solutions for the service businesses we know best.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {industryPages.map((page, i) => (
              <AnimatedSection key={page.path} delay={i * 100}>
                <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <Link to={page.path} style={{ color: 'var(--text-bright)' }}>{page.label}</Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>{page.desc}</p>
                  <Link to={page.path} style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>
                    Learn more →
                  </Link>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="Pricing">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Transparent pricing</h2>
              <p>No bloated retainers. No vague deliverables. Pick a package and get started.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {packages.map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 100}>
                <article className={`pricing-card ${p.featured ? 'featured' : ''}`}>
                  {p.featured && <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}><span className="portfolio-tag" style={{ fontSize: '0.65rem' }}>MOST POPULAR</span></div>}
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
                <h2>Ready to rank higher and get more leads?</h2>
                <p>Start with a free audit. We'll show you exactly what to fix and what to build.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="button button-primary">Get Free Audit</Link>
                <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-secondary">Book a Call</a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
