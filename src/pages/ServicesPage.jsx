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

const relatedPages = [
  { path: '/services/web-design-for-plumbers', label: 'Plumbing Web Design' },
  { path: '/services/web-design-for-hvac', label: 'HVAC Web Design' },
  { path: '/services/web-design-for-electricians', label: 'Electrician Web Design' },
  { path: '/services/local-seo-for-service-businesses', label: 'Local SEO Services' },
]

const relatedBlogPosts = [
  { path: '/blog/local-seo-checklist-2026', label: 'Local SEO Checklist 2026' },
  { path: '/blog/how-to-get-more-leads-from-website', label: 'How to Get More Leads' },
  { path: '/blog/technical-seo-explained', label: 'Technical SEO Explained' },
]

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Web Design, Technical SEO & GBP Optimization Services | ComputerExpress"
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

      {/* Internal links to service-specific landing pages */}
      <section className="section section-alt" aria-label="Service-specific solutions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Solutions for your industry</h2>
              <p>We build specialized websites for service businesses. Explore our industry-specific solutions.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {relatedPages.map((page, i) => (
              <AnimatedSection key={page.path} delay={i * 100}>
                <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <Link to={page.path} style={{ color: 'var(--text-bright)' }}>{page.label}</Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>
                    Custom web design and SEO solutions tailored for {page.label.toLowerCase()}.
                  </p>
                  <Link to={page.path} style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>
                    Learn more →
                  </Link>
                </article>
              </AnimatedSection>
            ))}
          </div>
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

      {/* Internal links to related blog posts */}
      <section className="section section-alt" aria-label="Related resources">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Learn more about web design and SEO</h2>
              <p>Expert insights to help your service business rank higher and get more leads.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {relatedBlogPosts.map((post, i) => (
              <AnimatedSection key={post.path} delay={i * 100}>
                <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <Link to={post.path} style={{ color: 'var(--text-bright)' }}>{post.label}</Link>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>
                    {post.path.includes('local-seo') && 'Complete checklist to rank #1 on Google Maps and local search.'}
                    {post.path.includes('leads') && '7 proven strategies to turn website visitors into qualified leads.'}
                    {post.path.includes('technical-seo') && 'What technical SEO covers and why your business needs it.'}
                  </p>
                  <Link to={post.path} style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>
                    Read more →
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
