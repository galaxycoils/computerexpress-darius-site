import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { steps } from '../data/siteData'

const values = [
  { icon: '✦', title: 'Premium positioning', desc: 'Without agency fluff or bloated process' },
  { icon: '◈', title: 'Search-ready structure', desc: 'Built for rankings from day one' },
  { icon: '◎', title: 'Local-first mindset', desc: 'Designed for service businesses' },
  { icon: '⬡', title: 'Conversion-focused', desc: 'Clear calls to action and lead flow' }
]

export default function AboutPage() {
  return (
    <>
      <Seo title="About | ComputerExpress" description="Built to make your business look more credible online" path="/about" />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>About us</div>
            <h1>Built to make your business look more credible online</h1>
            <p>ComputerExpress is an AI-first agency that combines modern design, technical SEO, and local growth systems without overcomplicating the client experience.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
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
                      }}>{v.icon}</span>
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
                <p>ComputerExpress blends modern design, technical execution, and practical local growth strategy into a single, focused engagement.</p>
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

      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line"></div>
              <h2>How projects move</h2>
              <p>Simple steps, clear outputs, and direct communication.</p>
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

      <section className="section" style={{ paddingBottom: '7rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to turn positioning into lead flow?</h2>
                <p>Move to the contact page and capture the first audit requests.</p>
              </div>
              <Link to="/contact" className="button button-primary">Go to Contact</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
