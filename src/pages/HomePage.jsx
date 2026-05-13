import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

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

const steps = [
  { title: 'Audit', desc: 'Audit your current site, offer clarity, search visibility, and conversion friction.' },
  { title: 'Strategy', desc: 'Shape the right information architecture, messaging, and local SEO opportunities.' },
  { title: 'Build', desc: 'Design and build a site that looks premium and performs like a sales asset.' },
  { title: 'Launch', desc: 'Launch with tracking, search fundamentals, and a clear lead capture path.' }
]

const testimonials = [
  {
    text: 'ComputerExpress rebuilt our site from the ground up. Within 3 months we were ranking on page 1 for our main service area and leads doubled.',
    name: 'Marcus Chen',
    role: 'Owner, Chen Plumbing',
    initials: 'MC'
  },
  {
    text: 'The difference was immediate. Our old site looked generic -- the new one actually makes us look like the premium service we are. Clients comment on it.',
    name: 'Sarah Williams',
    role: 'Director, Williams Legal',
    initials: 'SW'
  },
  {
    text: 'They handled everything -- design, SEO, Google Business Profile. Our map pack visibility went from nowhere to top 3 in our city.',
    name: 'James Rodriguez',
    role: 'Founder, Rodriguez HVAC',
    initials: 'JR'
  }
]

const faqItems = [
  {
    q: 'How long does a typical project take?',
    a: 'Most website projects launch within 2-4 weeks depending on scope. SEO work begins immediately but meaningful ranking improvements typically show within 60-90 days.'
  },
  {
    q: 'Do you work with businesses outside our local area?',
    a: 'Yes. While we specialize in local SEO and service businesses, we work with clients remotely across the US and internationally.'
  },
  {
    q: 'What makes ComputerExpress different from other agencies?',
    a: 'We use AI to move faster and keep costs down, but every decision is made by a human who understands your business. No bloated retainers, no vague deliverables.'
  },
  {
    q: 'Do you offer ongoing support after launch?',
    a: 'Yes. We offer maintenance retainers for updates, content changes, and ongoing SEO. But we also build sites you can manage yourself -- your choice.'
  },
  {
    q: 'What do you need from me to get started?',
    a: 'Just your current website URL, a sense of what you want to improve, and your main service offerings. We handle the rest -- strategy, design, copy, and technical setup.'
  }
]

const portfolioItems = [
  {
    icon: '🔧',
    title: 'Plumbing Co. Website + Local SEO',
    desc: 'Full redesign with service area pages, review integration, and GBP optimization for a regional plumbing company.',
    tags: ['Web Design', 'Local SEO', 'GBP'],
    results: [
      { value: '3x', label: 'More leads' },
      { value: '#1', label: 'Local pack' },
      { value: '98', label: 'PageSpeed' }
    ]
  },
  {
    icon: '⚖️',
    title: 'Law Firm Technical SEO Overhaul',
    desc: 'Complete technical SEO cleanup, schema implementation, and content restructuring for a boutique law firm.',
    tags: ['Technical SEO', 'Schema', 'Content'],
    results: [
      { value: '5x', label: 'Organic traffic' },
      { value: '12', label: 'Page 1 ranks' },
      { value: '45s', label: 'Avg. load' }
    ]
  }
]

const stats = [
  { value: '50+', label: 'Sites launched' },
  { value: '98', label: 'Avg. PageSpeed' },
  { value: '3x', label: 'Lead increase' },
  { value: '24h', label: 'Response time' }
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

function ServiceIcon({ type }) {
  const icons = {
    web: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    ),
    search: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    map: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    )
  }
  return icons[type] || icons.web
}

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
            {item.q}
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            <div className="faq-answer-inner">{item.a}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <Seo />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-3" aria-hidden="true"></div>

      {/* ===== HERO ===== */}
      <section className="section-first hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Built for service businesses that need better leads, not just more traffic</div>
            <h1>
              Websites that look <span className="gradient-text">premium</span>, rank cleanly, and convert with intent.
            </h1>
            <p className="hero-copy">
              ComputerExpress builds high-performance websites, technical SEO foundations, and local growth systems for businesses that need stronger visibility and more qualified inquiries.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="button button-primary">Get a Free SEO Audit</Link>
              <Link to="/services" className="button button-secondary">Explore Services</Link>
            </div>
            <ul className="hero-points">
              <li><strong>More trust.</strong> Better visibility. Higher-quality leads.</li>
              <li><strong>Fast + mobile-first</strong> build quality</li>
              <li><strong>SEO + schema</strong> baked in from day one</li>
              <li><strong>Offer clarity + CTA</strong> focused conversion flow</li>
              <li><strong>GBP alignment</strong> for local growth</li>
            </ul>
          </div>
          <div className="hero-card">
            <div className="hero-visual">
              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-value">100</div>
                  <span>PageSpeed Score</span>
                  <strong>Performance-first builds</strong>
                </div>
                <div className="metric-card">
                  <div className="metric-value">3x</div>
                  <span>Lead Increase</span>
                  <strong>Conversion-optimized</strong>
                </div>
                <div className="metric-card">
                  <div className="metric-value">Top 3</div>
                  <span>Local Pack</span>
                  <strong>Map visibility</strong>
                </div>
                <div className="metric-card">
                  <div className="metric-value">24h</div>
                  <span>Response Time</span>
                  <strong>Direct communication</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <AnimatedSection>
            <div className="stats-bar">
              {stats.map(s => (
                <div key={s.label} className="stat-item">
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>Built to help local businesses look sharper and convert faster</h2>
              <p>Every engagement is designed to improve clarity, credibility, search visibility, and the path from visit to inquiry.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100}>
                <article className="info-card">
                  <div className={`icon-circle ${i === 0 ? 'cyan' : i === 1 ? 'purple' : 'green'}`}>
                    <ServiceIcon type={s.icon} />
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

      {/* ===== PORTFOLIO ===== */}
      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>Work that speaks for itself</h2>
              <p>Real projects, real results. Here is a snapshot of what we have built for service businesses.</p>
            </div>
          </AnimatedSection>
          <div className="portfolio-grid page-block stagger-children">
            {portfolioItems.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 150}>
                <article className="portfolio-card">
                  <div className="portfolio-thumb">
                    <div className="portfolio-thumb-content">
                      <div className="portfolio-thumb-icon">{p.icon}</div>
                      <div className="portfolio-thumb-label">Case Study</div>
                    </div>
                  </div>
                  <div className="portfolio-info">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="portfolio-tags">
                      {p.tags.map(t => <span key={t} className="portfolio-tag">{t}</span>)}
                    </div>
                    <div className="portfolio-results">
                      {p.results.map(r => (
                        <div key={r.label} className="portfolio-result">
                          <div className="portfolio-result-value">{r.value}</div>
                          <div className="portfolio-result-label">{r.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>A simple workflow built around clarity, speed, and execution</h2>
              <p>The goal is not to bury you in process. It is to move from diagnosis to launch with a cleaner strategy.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block">
              <ol className="step-list">
                {steps.map((s, i) => (
                  <li key={i}>
                    <span>{i + 1}</span>
                    <div>
                      <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>{s.title}</strong>
                      <p>{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>What clients say</h2>
              <p>Service businesses that trusted us to build their digital presence.</p>
            </div>
          </AnimatedSection>
          <div className="testimonials-grid page-block stagger-children">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <article className="testimonial-card">
                  <div className="testimonial-stars">{'★'.repeat(5)}</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>Starter packages you can tune before launch</h2>
              <p>These tiers give you a usable pricing structure now while keeping room to refine your offer later.</p>
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

      {/* ===== FAQ ===== */}
      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>Frequently asked questions</h2>
              <p>Everything you need to know before getting started.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block">
              <FAQAccordion items={faqItems} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingBottom: '7rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>AI-first execution without generic agency language</h2>
                <p>ComputerExpress blends modern design, technical execution, and practical local growth strategy.</p>
              </div>
              <Link to="/contact" className="button button-primary">Book Audit</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
