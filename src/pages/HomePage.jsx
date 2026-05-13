import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { IconWeb, IconSearch, IconMap, HeroIllustration } from '../components/Icons'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedSection from '../hooks/useInView'
import {
  services, packages, steps, testimonials, faqItems,
  portfolioItems, stats
} from '../data/siteData'

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i}>
            {item.q}
            <span className="faq-icon">{openIndex === i ? '×' : '+'}</span>
          </button>
          {openIndex === i && (
            <div className="faq-answer">
              <div className="faq-answer-inner">{item.a}</div>
            </div>
          )}
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
            <HeroIllustration className="hero-illustration" />
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="section" style={{ padding: '3rem 0' }}>
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
