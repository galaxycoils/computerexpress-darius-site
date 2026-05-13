import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

const values = [
  'Premium positioning without agency fluff',
  'Search-ready structure from day one',
  'Built for local service businesses',
  'Clear calls to action and conversion flow'
]

const steps = [
  'Audit your current site, offer clarity, search visibility, and conversion friction.',
  'Shape the right information architecture, messaging, and local SEO opportunities.',
  'Design and build a site that looks premium and performs like a sales asset.',
  'Launch with tracking, search fundamentals, and a clear lead capture path.'
]

export default function AboutPage() {
  return (
    <>
      <Seo title="About | ComputerExpress" description="Built to make your business look more credible online" path="/about" />
      <section className="section-first page-hero">
        <div className="container">
          <h1>Built to make your business look more credible online</h1>
          <p>ComputerExpress is positioned as an AI-first agency that combines modern design, technical SEO, and local growth systems without overcomplicating the client experience.</p>
        </div>
      </section>

      <section className="section">
        <div className="container split-layout">
          <div>
            <h2>What the brand stands for</h2>
            <ul className="feature-list">
              {values.map(v => <li key={v}>{v}</li>)}
            </ul>
          </div>
          <div className="about-copy">
            <p>ComputerExpress blends modern design, technical execution, and practical local growth strategy.</p>
            <p>The goal is simple: make your business look sharper, rank better, and convert traffic into real inquiries.</p>
            <p>Every page is structured to reduce friction, reinforce trust, and move the right prospects toward contact.</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container section-heading">
          <h2>How projects move</h2>
          <p>Simple steps, clear outputs, and direct communication.</p>
        </div>
        <div className="container page-block">
          <ol className="step-list">
            {steps.map((s, i) => (
              <li key={i}>
                <span>{i + 1}</span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container cta-strip">
          <div>
            <h2>Ready to turn the positioning into lead flow?</h2>
            <p>Move to the contact page and capture the first audit requests.</p>
          </div>
          <Link to="/contact" className="button button-primary">Go to Contact</Link>
        </div>
      </section>
    </>
  )
}
