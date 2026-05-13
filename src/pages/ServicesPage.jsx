import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { IconWeb, IconSearch, IconMap } from '../components/Icons'

const services = [
  {
    icon: 'web',
    title: 'High-Performance Websites',
    description: 'Premium websites built to load fast, earn trust quickly, and guide visitors toward a clear next step.',
    bullets: ['Custom page structure', 'Conversion-focused messaging', 'Mobile-first build quality']
  },
  {
    icon: 'search',
    title: 'Technical SEO',
    description: 'Search-ready architecture, metadata, internal linking, schema, and performance work that supports rankings over time.',
    bullets: ['Keyword-informed structure', 'On-page SEO setup', 'Technical cleanup + schema']
  },
  {
    icon: 'map',
    title: 'Google Business Profile',
    description: 'Local visibility systems for businesses that need stronger map presence, better trust signals, and more calls.',
    bullets: ['GBP optimization', 'Review strategy', 'Local landing page alignment']
  }
]

const packages = [
  {
    name: 'Launch',
    price: '$1,500',
    period: 'starting at',
    ideal: 'For businesses that need a sharp, credible online presence fast.',
    features: ['1-5 page website', 'Mobile-first design', 'Core on-page SEO', 'Contact funnel setup'],
    featured: false
  },
  {
    name: 'Growth',
    price: '$3,500',
    period: 'starting at',
    ideal: 'For teams that want stronger positioning, better search visibility, and more qualified leads.',
    features: ['Custom website build', 'Technical SEO foundation', 'Offer-driven copy', 'Analytics + conversion tracking'],
    featured: true
  },
  {
    name: 'Local Authority',
    price: '$5,500',
    period: 'starting at',
    ideal: 'For service brands ready to compete harder in local search and maps.',
    features: ['Everything in Growth', 'GBP optimization', 'Local SEO page structure', 'Review/content workflow'],
    featured: false
  }
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useInView()
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <>
      <Seo title="Services | ComputerExpress" description="Services built around visibility, trust, and conversion" path="/services" />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>What we do</div>
            <h1>Services built around visibility, trust, and conversion</h1>
            <p>ComputerExpress focuses on the three areas that tend to matter most for local service brands: site quality, search readiness, and local presence.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card-grid three-up page-block stagger-children">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100}>
                <article className="info-card">
                  <div className={`icon-circle ${i === 0 ? 'cyan' : i === 1 ? 'purple' : 'green'}`}>
                    {s.icon === 'web' && <IconWeb />}
                    {s.icon === 'search' && <IconSearch />}
                    {s.icon === 'map' && <IconMap />}
                  </div>
                  <h3>{s.title}</h3>
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

      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
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

      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
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

      <section className="section" style={{ paddingBottom: '7rem' }}>
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
