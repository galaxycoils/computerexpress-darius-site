import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { steps, guarantee } from '../data/siteData'

const whatToExpectJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'What to Expect | St. Catharines Digital',
    url: `${BASE_URL}/what-to-expect`,
    description: 'Understand the timeline, deliverables, processes, and satisfaction guarantees when working with St. Catharines Digital.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'St. Catharines Digital',
      url: BASE_URL
    }
  },
  {
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
        name: 'What to Expect',
        item: `${BASE_URL}/what-to-expect`
      }
    ]
  }
]

const detailedSteps = [
  {
    week: 'Week 1',
    title: 'Audit & Strategy Mapping',
    desc: 'We analyze your service area, identify competitor gaps, and design a keyword-informed sitemap map. You get a clear blueprint showing what pages to build and why.',
    deliverables: ['Custom competitor audit report', 'Keyword research map', 'Sitemap structure diagram']
  },
  {
    week: 'Week 2',
    title: 'Custom Layout & Copywriting',
    desc: 'We write conversion-focused, keyword-optimized copy and design a premium dark-theme mockup. No generic templates — we show you precisely how we build trust for your specific business.',
    deliverables: ['Fully written copy for all core pages', 'Visual interactive design mockup', 'Call-to-action path mapping']
  },
  {
    week: 'Week 3',
    title: 'High-Performance Engineering',
    desc: 'We code your website using React 18 and Vite. We implement policy-safe structured data, compile fast assets, verify accessibility, and integrate the private WebLLM browser AI widgets.',
    deliverables: ['Built speed-optimized website code', 'Integrated schema markups', 'Local contact/newsletter endpoints']
  },
  {
    week: 'Week 4',
    title: 'Launch & Google Maps Alignment',
    desc: 'We map the custom domain and deploy to Cloudflare. We register your sitemap with Google Search Console, optimize your Google Business Profile, and document local map improvement actions.',
    deliverables: ['Cloudflare deploy verification', 'Google Search Console registration', 'GBP audit and post templates']
  }
]

export default function WhatToExpectPage() {
  return (
    <>
      <Seo
        title="What to Expect | St. Catharines Digital — Timelines & Process"
        description="Learn about our 4-week website design and local SEO process. We outline timelines, expectations, deliverables, and our 30-day satisfaction guarantee."
        path="/what-to-expect"
        jsonLd={whatToExpectJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      {/* Hero */}
      <section className="section-first page-hero" aria-label="Overview of process">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Our Blueprint</div>
          <h1>What to expect when working with us</h1>
          <p>No vague agency handwaves. We build local authority through a structured, transparent 4-week framework. Learn what we build, when you receive it, and how we measure progress.</p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section" aria-label="Detailed Timeline">
        <div className="container" style={{ maxWidth: '900px' }}>
          <AnimatedSection>
            <div className="section-heading">
              <h2>The 4-Week Local Authority Roadmap</h2>
              <p>Here is what happens from our kickoff call to search indexing.</p>
            </div>
          </AnimatedSection>

          <div className="timeline-container page-block" style={{ position: 'relative', marginTop: '3rem' }}>
            {detailedSteps.map((s, i) => (
              <AnimatedSection key={s.week} delay={i * 100}>
                <article className="timeline-item" style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '2rem',
                  marginBottom: '3rem',
                  position: 'relative'
                }}>
                  <div className="timeline-badge-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="timeline-week-tag" style={{
                      background: 'var(--primary-dim)',
                      border: '1px solid var(--primary)',
                      color: 'var(--primary)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      textAlign: 'center',
                      display: 'block',
                      width: '100%'
                    }}>{s.week}</span>
                  </div>
                  <div className="timeline-content-card" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-bright)', marginBottom: '0.75rem' }}>{s.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>{s.desc}</p>
                    <div className="timeline-deliverables">
                      <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--muted-lite)', marginBottom: '0.5rem' }}>Deliverables:</strong>
                      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                        {s.deliverables.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
                            <span style={{ color: 'var(--success)' }}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trust and Commitments */}
      <section className="section section-alt" aria-label="Commitments and Guarantee">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <div className="section-heading">
              <h2>Our Commitments to You</h2>
              <p>We reduce project friction through strict accountability guides.</p>
            </div>
          </AnimatedSection>

          <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2.5rem' }}>
            <AnimatedSection>
              <article className="info-card" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--text-bright)', marginBottom: '0.5rem' }}>⏰ Transparent Timelines</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  If we miss our launch date due to our own delays, we give you a 20% refund on the project price. We keep you updated via weekly dashboard checks so you always know where we stand.
                </p>
              </article>
            </AnimatedSection>

            <AnimatedSection>
              <article className="info-card" style={{ padding: '2rem' }}>
                <h3 style={{ color: 'var(--text-bright)', marginBottom: '0.5rem' }}>👥 Your Time Commitment</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  We value your time. We only need two hours of your time in total: a 45-minute strategy kickoff session, a 45-minute content review session, and a 30-minute launch sign-off call. We handle all writing, styling, design, and code configuration.
                </p>
              </article>
            </AnimatedSection>

            <AnimatedSection>
              <article className="info-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🛡️</span>
                  <h3 style={{ color: 'var(--text-bright)', margin: 0 }}>{guarantee.title}</h3>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  {guarantee.description} We document the scope, revision path, and refund terms in writing before work begins.
                </p>
              </article>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Kickoff CTA">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to build a website that delivers results?</h2>
                <p>Start with a free audit and roadmap review. We will map out your sitemap and strategy blueprint with zero commitment.</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="button button-primary">Request Free Roadmap</Link>
                <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-secondary">Schedule Kickoff Call</a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
