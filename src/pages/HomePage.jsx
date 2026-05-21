import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IconWeb, IconSearch, IconMap, HeroIllustration } from '../components/Icons'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedSection from '../hooks/useInView'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import AnimatedHeroBg from '../components/AnimatedHeroBg'
import {
  services, packages, steps, testimonials, faqItems,
  portfolioItems, stats, guarantee
} from '../data/siteData'

const homePageJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'St. Catharines Digital',
    '@id': BASE_URL,
    url: BASE_URL,
    description: 'St. Catharines Digital builds premium websites, technical SEO systems, and local growth engines for service businesses that need better visibility and more qualified leads.',
    areaServed: [
      { '@type': 'City', name: 'St. Catharines', containedInPlace: { '@type': 'State', name: 'Ontario' } },
      { '@type': 'State', name: 'Ontario' },
      { '@type': 'Country', name: 'Canada' },
    ],
    knowsAbout: ['Web Design', 'Technical SEO', 'Local SEO', 'Google Business Profile', 'React', 'Vite'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map(s => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.description }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '3'
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: 'About', item: `${BASE_URL}/about` },
      { '@type': 'ListItem', position: 4, name: 'Contact', item: `${BASE_URL}/contact` },
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '.hero-copy'],
  }
]

const serviceImages = [
  '/images/service_website_design.png',
  '/images/service_technical_seo.png',
  '/images/service_gbp_optimization.png'
]

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
          <button
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-question-${i}`}
          >
            {item.q}
            <span className="faq-icon" aria-hidden="true">{openIndex === i ? '×' : '+'}</span>
          </button>
          {openIndex === i && (
            <div
              className="faq-answer"
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
            >
              <div className="faq-answer-inner">{item.a}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [revealPos, setRevealPos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setRevealPos({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <Seo jsonLd={homePageJsonLd} />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-3" aria-hidden="true"></div>

      {/* ===== HERO — SHARP & ABOVE FOLD ===== */}
      <section className="section-first hero" aria-label="Hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatedHeroBg />
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Built for service businesses that need better leads, not just more traffic</div>
            <h1>
              Websites that look <span className="gradient-text">premium</span>, rank on page 1, and convert visitors into calls.
            </h1>
            <p className="hero-copy">
              St. Catharines Digital builds high-performance websites with technical SEO and local search optimization — everything service businesses need to dominate their market.
            </p>
            <div className="hero-actions">
              <Link to="/free-audit" className="button button-primary">Get a Free SEO Audit</Link>
              <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-secondary">Book a Free Call</a>
            </div>
            
            {/* Google Partner Trust Badges strip */}
            <div className="hero-trust-badges">
              <span className="hero-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                Google Partner Certified
              </span>
              <span className="hero-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
                Premium Stack Developers
              </span>
              <span className="hero-trust-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                100% PageSpeed Guaranteed
              </span>
            </div>

            <ul className="hero-points">
              <li><strong>Page 1 rankings.</strong> Technical SEO and local search optimization.</li>
              <li><strong>More calls.</strong> Click-to-call, contact forms, and GBP alignment.</li>
              <li><strong>Premium design.</strong> Custom sites that build trust instantly.</li>
            </ul>
          </div>
          <div className="hero-card">
            <HeroIllustration className="hero-illustration" />
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="section trust-bar-section" aria-label="Trust indicators">
        <div className="container">
          <AnimatedSection>
            <div className="trust-bar">
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>30-day satisfaction guarantee</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>No bloated retainers</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>AI-powered, human-directed</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>St. Catharines based</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="section stats-section" aria-label="Key statistics">
        <div className="container">
          <AnimatedSection>
            <div className="stats-bar">
              {stats.map(s => (
                <AnimatedCounter key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== THE AI-FIRST ADVANTAGE ===== */}
      <section className="section section-alt" aria-label="The AI-First Advantage">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>The AI-First Advantage</h2>
              <p>We use artificial intelligence to accelerate every phase of your project — from research to deployment — while a human expert directs every strategic decision.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="card-grid three-up page-block stagger-children">
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">⚡</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Speed to Market</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>AI-assisted code generation, automated asset optimization, and parallel workflow pipelines compress project timelines from weeks to days. Your competitors are still waiting on their agency — you are already live.</p>
              </article>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">💯</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>PageSpeed 100 Guarantee</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>Hand-crafted code with zero WordPress bloat. Every site ships with optimized images, minimal JavaScript bundles, and edge-cached static delivery. Google rewards speed — we guarantee a perfect score.</p>
              </article>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">🤖</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>Automated Schema Markup</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>AI generates correct JSON-LD structured data for local businesses, services, FAQs, and reviews — so Google bots understand exactly what you offer and where you serve. Competitors guess. We automate.</p>
              </article>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="section" id="services" aria-label="Services">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Built to help local businesses look sharper and convert faster</h2>
              <p>Every engagement is designed to improve clarity, credibility, search visibility, and the path from visit to inquiry.</p>
            </div>
          </AnimatedSection>
          
          <div className="page-block">
            <div 
              className="exhibition-list"
              onMouseMove={handleMouseMove}
            >
              {services.map((s, i) => (
                <Link
                  key={s.title}
                  to="/services"
                  className="exhibition-item"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="exhibition-item-left">
                    <span className="exhibition-num">0{i + 1}</span>
                    <h3 className="exhibition-title">{s.title}</h3>
                  </div>
                  <p className="exhibition-desc">{s.description}</p>
                </Link>
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
                    alt={services[hoveredIndex].title} 
                    className="hover-reveal__img" 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PORTFOLIO ===== */}
      <section className="section section-alt" id="portfolio" aria-label="Portfolio">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Work that speaks for itself</h2>
              <p>Real projects, real results. Here is a snapshot of what we have built for service businesses.</p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="portfolio-slider-showcase page-block" style={{ marginBottom: '4rem' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-bright)' }}>
                Interactive Redesign Case Study
              </h3>
              <BeforeAfterSlider />
            </div>
          </AnimatedSection>

          <div className="portfolio-grid page-block stagger-children">
            {portfolioItems.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 150}>
                <article className="portfolio-card">
                  <div className="portfolio-thumb" aria-hidden="true">
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
      <section className="section" id="process" aria-label="Our process">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>A simple workflow built around clarity, speed, and execution</h2>
              <p>The goal is not to bury you in process. It is to move from diagnosis to launch with a cleaner strategy.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block">
              <ol className="step-list">
                {steps.map((s, i) => (
                  <li key={i}>
                    <span aria-hidden="true">{i + 1}</span>
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

      {/* ===== TESTIMONIALS — ENHANCED ===== */}
      <section className="section section-alt" id="testimonials" aria-label="Client testimonials">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>What clients say</h2>
              <p>Service businesses that trusted us to build their digital presence.</p>
            </div>
          </AnimatedSection>
          <div className="testimonials-grid page-block stagger-children">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 100}>
                <article className="testimonial-card">
                  <div className="testimonial-stars" aria-label="5 out of 5 stars">{'★'.repeat(5)}</div>
                  <blockquote className="testimonial-text">{t.text}</blockquote>
                  <div className="testimonial-metric">
                    <span className="testimonial-metric-value">{t.metric}</span>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" aria-hidden="true">{t.initials}</div>
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

      {/* ===== GUARANTEE ===== */}
      <section className="section guarantee-section" aria-label="Our guarantee">
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
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing" aria-label="Pricing packages">
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

      {/* ===== FAQ ===== */}
      <section className="section section-alt" id="faq" aria-label="Frequently asked questions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
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

      {/* ===== BLOG / RESOURCES ===== */}
      <section className="section" id="resources" aria-label="Resources">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Web design and SEO insights</h2>
              <p>Expert guides to help your service business rank higher and get more qualified leads.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            <AnimatedSection delay={0}>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span className="portfolio-tag" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>Local SEO</span>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  <Link to="/blog/local-seo-checklist-2026" style={{ color: 'var(--text-bright)' }}>The Complete Local SEO Checklist for 2026</Link>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>Everything you need to rank #1 on Google Maps and local search. From GBP optimization to local link building.</p>
                <Link to="/blog/local-seo-checklist-2026" style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>Read the guide →</Link>
              </article>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span className="portfolio-tag" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>Lead Generation</span>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  <Link to="/blog/how-to-get-more-leads-from-website" style={{ color: 'var(--text-bright)' }}>How to Get More Leads from Your Website</Link>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>7 proven strategies to turn website visitors into qualified leads — from conversion-focused design to strategic CTAs.</p>
                <Link to="/blog/how-to-get-more-leads-from-website" style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>Read the guide →</Link>
              </article>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <span className="portfolio-tag" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>Technical SEO</span>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                  <Link to="/blog/technical-seo-explained" style={{ color: 'var(--text-bright)' }}>Technical SEO Explained</Link>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', flexGrow: 1 }}>What technical SEO covers — site speed, schema markup, crawlability, mobile-first — and why it matters for rankings.</p>
                <Link to="/blog/technical-seo-explained" style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>Read the guide →</Link>
              </article>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Call to action">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to rank higher and get more leads?</h2>
                <p>St. Catharines Digital blends modern design, technical SEO, and practical local growth strategy — built for service businesses that need results.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/free-audit" className="button button-primary">Get Free Audit</Link>
                <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-secondary">Book a Call</a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
