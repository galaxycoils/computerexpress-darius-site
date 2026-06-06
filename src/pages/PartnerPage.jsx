import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import AnimatedSection from '../hooks/useInView'
import { retainerTiers, partnerFAQ, partnerCaseStudies } from '../data/siteData'
import { getPartnerPageSchema } from '../data/schema'

const localBusinessJsonLd = getPartnerPageSchema({ retainerTiers })

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Local Authority Partner', item: `${BASE_URL}/partner` }
  ]
}

export default function PartnerPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  return (
    <>
      <Seo
        title="Local Authority Partner | Monthly SEO & Growth Retainers"
        description="Done-for-you local SEO, content, and Google Business Profile management. Three tiers: Foundation $497/mo, Growth $897/mo, Dominance $1,497/mo. Month-to-month after 3 months."
        path="/partner"
        jsonLd={[localBusinessJsonLd, breadcrumbJsonLd]}
      />

      <section className="section-first page-hero" aria-label="Partner hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Monthly Retainers</div>
            <h1>Local Authority Partner</h1>
            <p style={{ maxWidth: '700px', margin: '1rem auto 0' }}>Done-for-you local SEO, content, and Google Business Profile management. We build your visibility. You get the leads.</p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="#apply" className="button button-primary">Apply for Partnership</Link>
              <Link to="/services" className="button button-secondary">View One-Time Projects</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="How it works">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Our 4-Step Local Dominance System</h2>
              <p>No vague deliverables. A repeatable process that compounds.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {[
              { num: '01', title: 'Audit & Roadmap', desc: '42-point technical + local SEO audit. Competitor gap map. 90-day prioritized roadmap delivered in Notion + Loom.' },
              { num: '02', title: 'Execute', desc: 'GBP optimization, service-area pages, schema, citations, content calendar. We do the work. You approve topics.' },
              { num: '03', title: 'Monitor & Report', desc: 'Grid-based Maps tracking, organic rankings, traffic, leads. Monthly 1-page PDF + Loom. Quarterly strategy call.' },
              { num: '04', title: 'Compound', desc: 'Double down on what works. Expand to new service areas. Seasonal campaigns. Review generation at scale.' },
            ].map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 100}>
                <article className="pricing-card">
                  <div className="exhibition-num" style={{ marginBottom: '0.5rem' }}>{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="tiers" className="section section-alt" aria-label="Retainer tiers">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Three Tiers. One Partner.</h2>
              <p>Pick the level that matches your revenue and ambition. Upgrade or downgrade anytime.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children" style={{ alignItems: 'stretch' }}>
            {retainerTiers.map((tier, i) => (
              <AnimatedSection key={tier.id} delay={i * 100}>
                <article className={`pricing-card ${tier.featured ? 'featured' : ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                  {tier.featured && (
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <span className="portfolio-tag" style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'var(--bg)' }}>MOST POPULAR</span>
                    </div>
                  )}
                  <div className="pricing-top">
                    <h3>{tier.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-lite)', display: 'block' }}>{tier.period}</span>
                      <strong style={{ fontSize: '2.5rem' }}>{tier.price}</strong>
                    </div>
                  </div>
                  <p className="pricing-ideal">{tier.ideal}</p>
                  <ul style={{ flex: 1, margin: '1rem 0' }}>
                    {tier.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to="#apply" className={`button ${tier.featured ? 'button-primary' : 'button-secondary'}`} style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
                    {tier.ctaText}
                  </Link>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="section" aria-label="Frequently asked questions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Questions?</h2>
            </div>
          </AnimatedSection>
          <div className="page-block" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {partnerFAQ.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 50}>
                <details className="faq-item" open={openFaqIndex === i} onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="case-studies" className="section section-alt" aria-label="Case studies">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Results Speak</h2>
              <p>Anonymized client outcomes. Real businesses, real revenue growth.</p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {partnerCaseStudies.map((cs, i) => (
              <AnimatedSection key={cs.slug} delay={i * 100}>
                <article className="pricing-card">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <span className="portfolio-tag">{cs.industry}</span>
                    <span className="portfolio-tag">{cs.tier}</span>
                    <span className="portfolio-tag">{cs.duration}</span>
                  </div>
                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--muted)' }}>{cs.location}</div>
                  <div style={{ marginBottom: '1rem' }}>
                    {Object.entries(cs.results).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--panel-border)' }}>
                        <span style={{ color: 'var(--muted-lite)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                  <blockquote style={{ fontStyle: 'italic', color: 'var(--muted)', borderLeft: '3px solid var(--primary)', paddingLeft: '1rem', margin: 0 }}>
                    "{cs.quote}"
                  </blockquote>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="section" aria-label="Apply for partnership">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
              <h2>Ready to Build Local Authority?</h2>
              <p>We only take 5–8 partners at a time to ensure quality. Apply below and we'll schedule a 30-min fit call.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-primary">Book Fit Call</a>
                <Link to="/contact" className="button button-secondary">Email Instead</Link>
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>After the call: audit → proposal → onboarding → launch within 2 weeks.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
