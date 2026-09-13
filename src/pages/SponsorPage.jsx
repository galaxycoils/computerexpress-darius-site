import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import { getLocalBusinessSchema } from '../data/schema'
import '../components/news/news.css'
import '../components/news/sponsor.css'

const sponsorshipPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Planning Alert Sponsorship — St. Catharines Digital',
  description: 'Sponsor the weekly Planning Alert digest for St. Catharines, Welland, and Thorold. Reach residents directly affected by municipal planning decisions.',
  url: `${BASE_URL}/sponsor`,
  brand: {
    '@type': 'Brand',
    name: 'St. Catharines Digital'
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CAD',
    price: '300',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'St. Catharines Digital',
      url: BASE_URL
    }
  }
}

const faqSponsorshipJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does the Planning Alert sponsorship include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One placement per weekly Planning Alert email, your logo/link on the Planning Tracker page (41 active notices, 4 municipalities), and editorial firewall guarantee — no influence over coverage.'
      }
    },
    {
      '@type': 'Question',
      name: 'How many people receive the Planning Alert?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subscribers are residents directly affected by planning notices, city council decisions, and public safety updates across St. Catharines, Welland, and Thorold. Our weekly digest reaches homeowners, property owners, real estate agents, lawyers, contractors, and municipal professionals.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I sponsor a specific municipality or category?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We offer category sponsorships (e.g., "Planning Tracker powered by [Your Business]") at $150/mo and per-notice sponsorship at $50 per notice. Primary sponsorship (entire email) is $300/mo.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is there an editorial firewall?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Sponsors have zero influence over what we cover, how we cover it, or what we say. Our coverage is sourced exclusively from official municipal domains. This is non-negotiable.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do I get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fill out the form below or email cccemt@pm.me. We will send you a sample digest and a manual invoice within 1 business day. Sponsorship begins within 24 hours of payment.'
      }
    }
  ]
}

const TIERS = [
  {
    key: 'primary',
    kicker: 'Primary sponsor',
    badge: 'Most requested',
    title: 'The full dispatch',
    price: '$300',
    per: '/mo',
    features: [
      'One placement in every weekly Planning Alert email',
      'Logo + link on the Planning Tracker page',
      '41 active notices across 4 municipalities',
      'Founding pilot pricing, first 6 months'
    ],
    audience: 'Real estate lawyers, agents, mortgage brokers, title insurers'
  },
  {
    key: 'category',
    kicker: 'Category sponsor',
    badge: null,
    title: 'Own the Tracker page',
    price: '$150',
    per: '/mo',
    features: [
      '"Planning Tracker powered by [Your Business]"',
      'Logo on all planning-related coverage',
      'Linked from every digest footer',
      'Monthly commitment, cancel anytime'
    ],
    audience: 'Builders, engineering firms, contractors, trades'
  },
  {
    key: 'notice',
    kicker: 'Notice sponsor',
    badge: null,
    title: 'A single file number',
    price: '$50',
    per: '/notice',
    features: [
      'Your name beside one planning notice',
      'Paired with that notice email alert',
      'Pay per notice, no subscription',
      'Good for testing a neighbourhood'
    ],
    audience: 'Surveyors, consultants, agents with a nearby listing'
  }
]

export default function SponsorPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    sponsorshipType: 'primary',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await res.json()

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError(result.error || 'Something went wrong. Please try again or email cccemt@pm.me')
      }
    } catch (err) {
      setError('Network error. Please email cccemt@pm.me')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <>
        <Seo
          title="Sponsorship Request Received | St. Catharines Digital"
          description="Thank you for your interest in sponsoring the Planning Alert. We will send you a sample digest and payment link within 1 business day."
          path="/sponsor"
        />
        <div className="scd-page scd-sponsor">
          <div className="card scd-sponsor-success" role="status">
            <div className="scd-sponsor-success-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="scd-cat">Request received</p>
            <h1>We have your request.</h1>
            <p>Thank you for your interest in sponsoring St. Catharines Digital. We will send a sample Planning Alert digest and a manual invoice within 1 business day.</p>
            <p>If you need a faster response, email <a href="mailto:cccemt@pm.me">cccemt@pm.me</a>.</p>
            <Link to="/planning-tracker" className="button button-primary">View Planning Tracker</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Sponsor Planning Alert | St. Catharines Digital"
        description="Reach Niagara Region residents directly affected by planning notices, zoning changes, and council decisions. $300/mo founding sponsorship. Editorial firewall guaranteed."
        path="/sponsor"
        jsonLd={[sponsorshipPageJsonLd, faqSponsorshipJsonLd, getLocalBusinessSchema()]}
      />
      <div className="scd-page scd-sponsor">
        {/* ── Dateline header: editorial, not SaaS hero ── */}
        <header className="scd-intro scd-sponsor-intro">
          <div>
            <p className="scd-eyebrow">Sponsorship — Planning Alert</p>
            <h1 className="scd-intro-title">Reach the people affected by Niagara planning decisions</h1>
            <p className="scd-intro-note">Your business in the weekly Planning Alert read across St. Catharines, Welland, and Thorold. One placement per send. Editorial firewall guaranteed — sponsors never shape coverage.</p>
            <ul className="scd-sponsor-facts" aria-label="Coverage at a glance">
              <li><span className="badge badge-status">41 active notices</span></li>
              <li><span className="badge badge-status">4 municipalities</span></li>
              <li><span className="badge badge-default">Official sources only</span></li>
            </ul>
          </div>
          <aside className="scd-rail-block scd-sponsor-rail" aria-label="Sponsorship at a glance">
            <p className="scd-rail-label">Founding pilot</p>
            <p className="scd-sponsor-railprice">$300<span>/mo · primary</span></p>
            <p>From $50 per notice. Cancel with 30 days notice. Live within 24 hours of payment.</p>
            <a className="button button-primary" href="#sponsor-form">Request details</a>
            <p className="scd-sponsor-fineprint">Or email cccemt@pm.me</p>
          </aside>
        </header>

        {/* ── Tiers ── */}
        <section className="scd-sponsor-section" aria-labelledby="sponsor-tiers">
          <h2 id="sponsor-tiers" className="scd-section-rule">Sponsorship options</h2>
          <p className="scd-sponsor-standfirst">Three ways in. Every tier carries the same guarantee: your logo appears, your words do not touch the reporting.</p>
          <div className="scd-sponsor-grid">
            {TIERS.map((tier) => (
              <article
                key={tier.key}
                className={`card meeting-card scd-sponsor-card${tier.key === 'primary' ? ' scd-sponsor-card--featured' : ''}`}
              >
                <div className="scd-sponsor-kicker">
                  <p className="scd-cat" style={{ margin: 0 }}>{tier.kicker}</p>
                  {tier.badge && <span className="badge badge-status">{tier.badge}</span>}
                </div>
                <h3>{tier.title}</h3>
                <p className="scd-sponsor-price">{tier.price}<span>{tier.per}</span></p>
                <ul className="scd-sponsor-list">
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="scd-sponsor-audience"><strong>Best for:</strong> {tier.audience}</p>
              </article>
            ))}
          </div>
          <p className="scd-sponsor-firewall">Sponsors have zero influence over what we cover or how we cover it. Coverage is sourced exclusively from official municipal domains. Non-negotiable.</p>
        </section>

        {/* ── Sample dispatch ── */}
        <section className="scd-sponsor-section" aria-labelledby="sponsor-sample">
          <h2 id="sponsor-sample" className="scd-section-rule">What your audience sees</h2>
          <div className="scd-sponsor-demo-grid">
            <div className="scd-sponsor-demo-copy">
              <p>Each Thursday the digest lands with new notices, meeting dates, and links to the primary documents. Your placement sits inside the email residents open because a decision affects their street.</p>
              <p>Below is the shape of it — three notices, your box, one link to the full Tracker.</p>
              <Link to="/planning-tracker" className="scd-more">View all 41 notices →</Link>
            </div>
            <figure className="scd-rail-block scd-sponsor-demo" aria-label="Sample Planning Alert email">
              <div className="scd-sponsor-demo-head">
                <p className="scd-sponsor-demo-from">St. Catharines Digital &lt;alerts@stcatharinesdigital.ca&gt;</p>
                <p className="scd-sponsor-demo-subject">Planning Alert: 3 new notices in St. Catharines</p>
              </div>
              <div className="scd-sponsor-demo-body">
                <p>New planning notices for the week of September 8, 2026:</p>
                <ul className="scd-sponsor-demo-list">
                  <li>455 Welland Avenue — Parking Variance (248 units)</li>
                  <li>Ontario Street Corridor Secondary Plan</li>
                  <li>Pamela Drive Watermain Replacement</li>
                </ul>
                <div className="scd-sponsor-demo-box">
                  <p className="scd-cat">Sponsored</p>
                  <p className="scd-sponsor-demo-name">[Your Business Name]</p>
                  <p className="scd-sponsor-demo-tag">Your tagline or offer here</p>
                </div>
                <a className="scd-sponsor-demo-link" href="/planning-tracker">View all 41 notices →</a>
              </div>
              <figcaption className="scd-sponsor-demo-cap">Sample placement. Your logo and link appear here.</figcaption>
            </figure>
          </div>
        </section>

        {/* ── Inquiry form ── */}
        <section className="scd-sponsor-section" aria-labelledby="sponsor-form-title" id="sponsor-form">
          <h2 id="sponsor-form-title" className="scd-section-rule">Request details</h2>
          <div className="card scd-sponsor-formcard">
            <h3>Get started</h3>
            <p className="scd-sponsor-form-intro">Fill this in and we send a sample digest plus a manual invoice within 1 business day.</p>

            {error && (
              <p className="scd-sponsor-error" role="alert">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="scd-sponsor-form">
              <div className="scd-sponsor-row">
                <div className="scd-sponsor-field">
                  <label htmlFor="businessName">Business name *</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    autoComplete="organization"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Your Company Inc."
                  />
                </div>
                <div className="scd-sponsor-field">
                  <label htmlFor="contactName">Contact name *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    autoComplete="name"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="scd-sponsor-row">
                <div className="scd-sponsor-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="scd-sponsor-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(905) 555-0123"
                  />
                </div>
              </div>

              <div className="scd-sponsor-field">
                <label htmlFor="sponsorshipType">Sponsorship type</label>
                <select
                  id="sponsorshipType"
                  name="sponsorshipType"
                  value={formData.sponsorshipType}
                  onChange={handleChange}
                >
                  <option value="primary">Primary Sponsor — $300/mo</option>
                  <option value="category">Category Sponsor — $150/mo</option>
                  <option value="notice">Notice Sponsor — $50/notice</option>
                </select>
              </div>

              <div className="scd-sponsor-field">
                <label htmlFor="message">Message (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your business, who you want to reach, or any questions..."
                />
              </div>

              <button
                type="submit"
                className={`button button-primary${loading ? ' is-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Request Sponsorship Details'}
              </button>
              <p className="scd-sponsor-privacy">By submitting, you agree to be contacted about sponsorship. No spam. Unsubscribe anytime.</p>
            </form>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="scd-sponsor-section" aria-labelledby="sponsor-faq">
          <h2 id="sponsor-faq" className="scd-section-rule">Questions, answered</h2>
          <ul className="scd-sponsor-faq">
            <li>
              <h3>What does the sponsorship include?</h3>
              <p>One placement per weekly Planning Alert email, your logo and link on the Planning Tracker page (41 active notices, 4 municipalities), and the editorial firewall guarantee.</p>
            </li>
            <li>
              <h3>Who receives the digest?</h3>
              <p>Residents directly affected by planning notices, council decisions, and public safety updates across St. Catharines, Welland, and Thorold.</p>
            </li>
            <li>
              <h3>Is there an editorial firewall?</h3>
              <p>Yes. Sponsors have zero influence over what we cover, how we cover it, or what we say. Coverage comes only from official municipal domains.</p>
            </li>
            <li>
              <h3>Can I cancel anytime?</h3>
              <p>Yes. No long-term contract. Cancel with 30 days notice. Your sponsorship runs to the end of the current billing period.</p>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
