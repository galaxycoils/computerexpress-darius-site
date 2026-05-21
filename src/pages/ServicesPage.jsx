import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { packages, guarantee } from '../data/siteData'

const servicesPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  provider: {
    '@type': 'Organization',
    name: 'St. Catharines Digital',
    url: BASE_URL
  },
  areaServed: [
    { '@type': 'City', name: 'St. Catharines' },
    { '@type': 'State', name: 'Ontario' },
    { '@type': 'Country', name: 'Canada' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'St. Catharines Digital Services',
    itemListElement: packages.map(p => ({
      '@type': 'Offer',
      name: p.name,
      price: p.price,
      itemOffered: { '@type': 'Service', name: p.name, description: p.ideal }
    }))
  }
}

const serviceFeatures = [
  { icon: 'web', title: 'Web Design', desc: 'Custom, mobile-first websites built for speed, SEO, and conversion.' },
  { icon: 'search', title: 'Technical SEO', desc: 'Site architecture, schema, Core Web Vitals — everything search engines need.' },
  { icon: 'map', title: 'Google Business Profile', desc: 'Dominance in local search and Google Maps for service businesses.' },
  { icon: 'code', title: 'Development', desc: 'Clean, fast code on modern stacks — no bloated frameworks or page builders.' },
  { icon: 'rocket', title: 'Speed Optimization', desc: 'Sub-second load times, optimized images, smart caching strategies.' },
  { icon: 'analytics', title: 'Analytics & Reporting', desc: 'Clear dashboards, goal tracking, and monthly performance reports.' },
]

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services | St. Catharines Digital"
        description="Web design, technical SEO, and Google Business Profile optimization for service businesses. Transparent pricing, 30-day satisfaction guarantee."
        path="/services"
        jsonLd={servicesPageJsonLd}
      />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      {/* Hero */}
      <section className="section-first page-hero" aria-label="Services overview">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>What we do</div>
            <h1>Three services. One goal: more qualified leads.</h1>
            <p>Websites that rank on Google. Technical SEO that gets you found. Google Business Profile that drives calls. Everything service businesses need to dominate their market.</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Service details */}
      <section className="section" aria-label="Detailed services">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Everything your business needs to compete online</h2>
              <p>We combine three core services into a complete local digital strategy.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {serviceFeatures.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100}>
                <article className="info-card">
                  <div className={`icon-circle ${i < 3 ? ['cyan', 'purple', 'green'][i] : i < 5 ? ['cyan', 'purple'][i - 3] : 'green'}`} aria-hidden="true">
                    <span style={{ fontSize: '1.3rem' }} aria-hidden="true">
                      {{ web: '🌐', search: '🔍', map: '📍', code: '💻', rocket: '🚀', analytics: '📊' }[s.icon]}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Industry pages */}
      <section className="section section-alt" aria-label="Industry solutions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Built for your industry</h2>
              <p>Specialized solutions for the service businesses we know best.</p>
            </div>
          </AnimatedSection>
          {[
            { label: 'Plumbers', path: '/services/web-design-for-plumbers', desc: 'Emergency call CTAs, service area pages, review integration, and GBP optimization.' },
            { label: 'HVAC Companies', path: '/services/web-design-for-hvac', desc: 'Seasonal service pages, maintenance plan landing pages, and local SEO.' },
            { label: 'Electricians', path: '/services/web-design-for-electricians', desc: 'Residential and commercial service pages, license display, and click-to-call.' },
          ].map(page => (
            <AnimatedSection key={page.label}>
              <Link to={page.path} style={{ textDecoration: 'none', display: 'block' }}>
                <article className="info-card" style={{ marginBottom: '1rem', cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {page.label}
                    <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>→</span>
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{page.desc}</p>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="section" aria-label="Pricing packages">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Transparent pricing</h2>
              <p>No bloated retainers. No vague deliverables. One clear price, one clear scope.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children" style={{ alignItems: 'start' }}>
            {packages.map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 100}>
                <article className={`pricing-card ${p.featured ? 'featured' : ''}`} style={{ position: 'relative' }}>
                  {p.featured && (
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <span className="portfolio-tag" style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'var(--bg)' }}>MOST POPULAR</span>
                    </div>
                  )}
                  <div className="pricing-top">
                    <h3>{p.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-lite)', display: 'block' }}>{p.period}</span>
                      <strong style={{ fontSize: '1.8rem' }}>{p.price}</strong>
                    </div>
                  </div>
                  <p className="pricing-ideal">{p.ideal}</p>
                  <ul>
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link to="/contact" className={`button ${p.featured ? 'button-primary' : 'button-secondary'}`} style={{ flex: 1 }}>
                      Get Started
                    </Link>
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--panel-border)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--success)' }}>✓</strong> {guarantee.title}
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee section */}
      <section className="section section-alt guarantee-section" aria-label="Our guarantee">
        <div className="container">
          <AnimatedSection>
            <div className="guarantee-card">
              <div className="guarantee-icon" aria-hidden="true">🛡️</div>
              <h2>{guarantee.title}</h2>
              <p>{guarantee.description}</p>
              <div className="guarantee-badges">
                <span className="guarantee-badge">No risk</span>
                <span className="guarantee-badge">No lock-in</span>
                <span className="guarantee-badge">Cancel anytime</span>
                <span className="guarantee-badge">Free revisions</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Call to action">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to rank higher and get more leads?</h2>
                <p>Start with a free audit. We will show you exactly what to fix and what to build.</p>
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