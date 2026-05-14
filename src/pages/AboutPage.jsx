import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { steps } from '../data/siteData'

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'St. Catharines Digital',
  url: 'https://stcatharinesdigital.pages.dev',
  description: 'St. Catharines Digital is a web design and local SEO agency for service businesses.',
  areaServed: {
    '@type': 'City',
    name: 'St. Catharines',
    containedInPlace: {
      '@type': 'State',
      name: 'Ontario'
    }
  },
  knowsAbout: ['Web Design', 'Technical SEO', 'Local SEO', 'Google Business Profile']
}

const values = [
  { icon: '✦', title: 'Premium positioning', desc: 'Without agency fluff or bloated process' },
  { icon: '◈', title: 'Search-ready structure', desc: 'Built for rankings from day one' },
  { icon: '◎', title: 'Local-first mindset', desc: 'Designed for service businesses' },
  { icon: '⬡', title: 'Conversion-focused', desc: 'Clear calls to action and lead flow' }
]

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About | St. Catharines Digital — AI-First Web Design Agency"
        description="Learn about St. Catharines Digital: an AI-first agency combining modern design, technical SEO, and local growth systems for service businesses."
        path="/about"
        jsonLd={aboutPageJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" aria-label="About overview">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>About us</div>
            <h1>We build websites that rank and convert</h1>
            <p>St. Catharines Digital is an AI-first web design and local SEO agency. We help service businesses rank higher on Google, get more qualified leads, and look credible online — without the bloated process or vague deliverables of a traditional agency.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="Our values">
        <div className="container">
          <div className="split-layout">
            <AnimatedSection>
              <div>
                <h2>What we stand for</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                  {values.map((v, i) => (
                    <div key={v.title} style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'flex-start',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--panel-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      transition: 'var(--transition-base)'
                    }}>
                      <span style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(18, 214, 255, 0.08)',
                        border: '1px solid rgba(18, 214, 255, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--primary)',
                        fontSize: '1.1rem'
                      }} aria-hidden="true">{v.icon}</span>
                      <div>
                        <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.2rem' }}>{v.title}</strong>
                        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{v.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="about-copy">
                <p>St. Catharines Digital blends modern design, technical execution, and practical local growth strategy into a single, focused engagement.</p>
                <p>The goal is simple: make your business look sharper, rank better, and convert traffic into real inquiries. No bloated retainers. No vague deliverables.</p>
                <p>Every page is structured to reduce friction, reinforce trust, and move the right prospects toward contact. We use AI to move faster, not to cut corners.</p>
                <div style={{ marginTop: '2rem' }}>
                  <Link to="/contact" className="button button-primary">Work With Us</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-label="Our process">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>How projects move</h2>
              <p>Simple steps, clear outputs, and direct communication.</p>
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

      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Call to action">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to rank higher?</h2>
                <p>Get a free audit and see exactly what your site needs.</p>
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
