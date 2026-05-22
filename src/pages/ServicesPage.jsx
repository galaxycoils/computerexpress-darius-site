import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useState } from 'react'
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

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'St. Catharines Digital',
  url: BASE_URL,
  logo: `${BASE_URL}/logo-horizontal.svg`,
  image: `${BASE_URL}/og-card.webp`,
  telephone: '+13653595973',
  email: 'hello@stcatharinesdigital.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'St. Catharines',
    addressRegion: 'ON',
    addressCountry: 'CA'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.1594,
    longitude: -79.2449
  },
  areaServed: [
    { '@type': 'City', name: 'St. Catharines' },
    { '@type': 'State', name: 'Ontario' },
    { '@type': 'Country', name: 'Canada' }
  ]
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: BASE_URL
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Services',
      item: `${BASE_URL}/services`
    }
  ]
}

const speakableJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Services | St. Catharines Digital',
  url: `${BASE_URL}/services`,
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', 'p']
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

const serviceImages = [
  '/images/service_website_design.webp',
  '/images/service_technical_seo.webp',
  '/images/service_gbp_optimization.webp',
  '/images/service_website_design.webp',
  '/images/service_technical_seo.webp',
  '/images/service_technical_seo.webp'
]

export default function ServicesPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [revealPos, setRevealPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setRevealPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <Seo
        title="Services | St. Catharines Digital"
        description="Web design, technical SEO, and Google Business Profile optimization for service businesses. Transparent pricing, 30-day satisfaction guarantee."
        path="/services"
        jsonLd={[servicesPageJsonLd, localBusinessJsonLd, breadcrumbJsonLd, speakableJsonLd]}
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
          
          <div className="page-block">
            <div 
              className="exhibition-list"
              onMouseMove={handleMouseMove}
            >
              {serviceFeatures.map((s, i) => (
                <div
                  key={s.title}
                  className="exhibition-item"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="exhibition-item-left">
                    <span className="exhibition-num">0{i + 1}</span>
                    <h3 className="exhibition-title">{s.title}</h3>
                  </div>
                  <p className="exhibition-desc">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Hover Reveal Floating Container */}
            <div 
              className={`hover-reveal ${hoveredIndex !== null ? 'active' : ''}`}
              style={{
                left: `${revealPos.x}px`,
                top: `${revealPos.y}px`
              }}
            >
              <div className="hover-reveal__inner">
                {hoveredIndex !== null && (
                  <img 
                    src={serviceImages[hoveredIndex]} 
                    alt={serviceFeatures[hoveredIndex].title} 
                    className="hover-reveal__img" 
                  />
                )}
              </div>
            </div>
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
            { label: 'Landlords & Property Managers', path: '/services/web-design-for-landlords', desc: 'Property listing showcases, tenant portal integrations, and neighborhood-specific local SEO.' },
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