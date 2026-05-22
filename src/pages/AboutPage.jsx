import Seo, { BASE_URL } from '../components/Seo'
import { useState } from 'react'
import AnimatedSection from '../hooks/useInView'
import { steps, guarantee } from '../data/siteData'

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'St. Catharines Digital',
  url: BASE_URL,
  description: 'St. Catharines Digital is a web design and local SEO agency for service businesses in St. Catharines and across Ontario.',
  areaServed: {
    '@type': 'City',
    name: 'St. Catharines',
    containedInPlace: {
      '@type': 'State',
      name: 'Ontario',
      containedInPlace: {
        '@type': 'Country',
        name: 'Canada'
      }
    }
  },
  knowsAbout: ['Web Design', 'Technical SEO', 'Local SEO', 'Google Business Profile'],
  foundingDate: '2024'
}

// FAQ items from siteData — kept here for about page FAQ section
const aboutFaqs = [
  {
    q: 'What does "AI-first" mean?',
    a: 'We use AI tools to speed up research, copywriting, and design tasks — but every decision is made by a human. AI helps us move faster and keep costs lower, never to cut corners.'
  },
  {
    q: 'Do you work with businesses outside of St. Catharines?',
    a: 'Yes. While we are based locally, we work with service businesses across Ontario. The same principles of local SEO and conversion-focused design apply to any market.'
  }
]

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
      name: 'About',
      item: `${BASE_URL}/about`
    }
  ]
}

const valueItems = [
  { icon: '⚡', title: 'Premium positioning', desc: 'Agency-quality work, zero agency overhead.' },
  { icon: '🔍', title: 'Search-ready structure', desc: 'Built for rankings from day one.' },
  { icon: '📍', title: 'Local-first mindset', desc: 'Tailored for service-area businesses.' },
  { icon: '🎯', title: 'Conversion-focused', desc: 'Clear CTAs and lead flow on every page.' }
]

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <Seo
        title="About | St. Catharines Digital — Web Design & SEO Agency"
        description="St. Catharines Digital builds high-performance websites with technical SEO and local growth for service businesses. AI-powered, human-directed, no bloated process."
        path="/about"
        jsonLd={[aboutPageJsonLd, breadcrumbJsonLd]}
      />

      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      {/* Hero */}
      <section className="section-first page-hero" aria-label="About overview">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>About us</div>
          <h1>We build websites that rank and convert</h1>
          <p>Web design and local SEO for service businesses. Higher Google rankings, more qualified leads, and a credible online presence — no bloated process, no vague deliverables.</p>
        </div>
      </section>

      {/* Values */}
      <section className="section" aria-label="Our values">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <h2>What we stand for</h2>
            </div>
          </AnimatedSection>
          <div className="values-grid">
            {valueItems.map(v => (
              <AnimatedSection key={v.title}>
                <article className="info-card">
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} aria-hidden="true">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Our process">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Simple process, clear outputs</h2>
              <p>Transparent steps from audit to launch, built around your business.</p>
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

          {/* FAQ accordion */}
          <div className="section-heading" style={{ marginTop: '4rem' }}>
            <h2>Common questions</h2>
          </div>
          <div className="page-block">
            {aboutFaqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderBottom: '1px solid var(--line)', padding: '1rem 0' }}>
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-bright)', fontSize: '1.1rem', cursor: 'pointer', padding: '0.5rem 0', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  aria-expanded={openIndex === i}
                >
                  {faq.q}
                  <span style={{ fontSize: '1.5rem', fontWeight: '300' }}>{openIndex === i ? '×' : '+'}</span>
                </button>
                {openIndex === i && (
                  <p style={{ color: 'var(--muted)', marginTop: '0.5rem', lineHeight: '1.6' }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
