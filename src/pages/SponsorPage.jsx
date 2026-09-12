import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import AnimatedSection from '../hooks/useInView'
import { getLocalBusinessSchema } from '../data/schema'
import { siteConfig } from '../data/siteConfig'

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
        text: 'Fill out the form below or email hello@stcatharinesdigital.ca. We will send you a sample digest and a Stripe payment link. Sponsorship begins within 24 hours of payment.'
      }
    }
  ]
}

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
        setError(result.error || 'Something went wrong. Please try again or email hello@stcatharinesdigital.ca')
      }
    } catch (err) {
      setError('Network error. Please email hello@stcatharinesdigital.ca')
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
        <main className="sponsor-page">
          <section className="sponsor-success">
            <div className="container">
              <div className="success-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h1>Request received</h1>
              <p>Thank you for your interest in sponsoring St. Catharines Digital. We will send you a sample Planning Alert digest and a Stripe payment link within 1 business day.</p>
              <p>If you need a faster response, email <a href="mailto:hello@stcatharinesdigital.ca">hello@stcatharinesdigital.ca</a>.</p>
              <Link to="/planning-tracker" className="button button-primary">View Planning Tracker</Link>
            </div>
          </section>
        </main>
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
      <main className="sponsor-page">
        <section className="sponsor-hero">
          <div className="container">
            <p className="eyebrow">SPONSORSHIP</p>
            <h1>Reach the people affected by Niagara planning decisions</h1>
            <p className="lead">Your business featured in the weekly Planning Alert sent to residents across St. Catharines, Welland, and Thorold. Editorial firewall guaranteed.</p>
          </div>
        </section>

        <section className="sponsor-tiers">
          <div className="container">
            <h2>Sponsorship Options</h2>
            <div className="tiers-grid">
              <div className="tier-card tier-primary">
                <div className="tier-badge">Most Popular</div>
                <h3>Primary Sponsor</h3>
                <div className="tier-price">$300<span>/mo</span></div>
                <ul className="tier-features">
                  <li>One placement per weekly Planning Alert email</li>
                  <li>Logo + link on the Planning Tracker page</li>
                  <li>41 active notices, 4 municipalities</li>
                  <li>Editorial firewall guaranteed</li>
                  <li>Founding pilot pricing (first 6 months)</li>
                </ul>
                <div className="tier-audience">
                  <strong>Best for:</strong> Real estate lawyers, real estate agents, mortgage brokers, title insurance companies
                </div>
              </div>

              <div className="tier-card">
                <h3>Category Sponsor</h3>
                <div className="tier-price">$150<span>/mo</span></div>
                <ul className="tier-features">
                  <li>Sponsor the Planning Tracker page</li>
                  <li>"Planning Tracker powered by [Your Business]"</li>
                  <li>Logo on all planning-related content</li>
                  <li>Editorial firewall guaranteed</li>
                </ul>
                <div className="tier-audience">
                  <strong>Best for:</strong> Construction companies, engineering firms, home builders, municipal contractors
                </div>
              </div>

              <div className="tier-card">
                <h3>Notice Sponsor</h3>
                <div className="tier-price">$50<span>/notice</span></div>
                <ul className="tier-features">
                  <li>Sponsor a specific planning notice</li>
                  <li>Your name next to the notice description</li>
                  <li>Paired with that notice's email alert</li>
                  <li>Pay per notice, no monthly commitment</li>
                </ul>
                <div className="tier-audience">
                  <strong>Best for:</strong> Traffic engineers, environmental consultants, surveyors, real estate agents with specific listings
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="sponsor-demo">
          <div className="container">
            <h2>What your audience sees</h2>
            <div className="demo-email">
              <div className="demo-email-header">
                <span className="demo-email-from">St. Catharines Digital &lt;alerts@stcatharinesdigital.ca&gt;</span>
                <span className="demo-email-subject">Planning Alert: 3 new notices in St. Catharines</span>
              </div>
              <div className="demo-email-body">
                <p>New planning notices for the week of September 8, 2026:</p>
                <ul>
                  <li>455 Welland Avenue — Parking Variance (248 units)</li>
                  <li>Ontario Street Corridor Secondary Plan</li>
                  <li>Pamela Drive Watermain Replacement</li>
                </ul>
                <div className="demo-sponsor">
                  <div className="demo-sponsor-badge">
                    <span className="demo-sponsored-label">Sponsored by</span>
                    <span className="demo-sponsor-name">[Your Business Name]</span>
                    <span className="demo-sponsor-desc">Your tagline or offer here</span>
                  </div>
                </div>
                <p><a href="#">View all 41 notices →</a></p>
              </div>
            </div>
          </div>
        </section>

        <section className="sponsor-form-section">
          <div className="container">
            <div className="form-wrapper">
              <h2>Get started</h2>
              <p className="form-intro">Fill out the form and we will send you a sample digest + Stripe payment link within 1 business day.</p>

              {error && (
                <div className="form-error" role="alert">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="sponsor-form">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="businessName">Business name *</label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your Company Inc."
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contactName">Contact name *</label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(905) 555-0123"
                    />
                  </div>
                </div>

                <div className="form-field">
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

                <div className="form-field">
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
                  className={`button button-primary ${loading ? 'is-loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Request Sponsorship Details'}
                </button>
                <p className="form-privacy">By submitting, you agree to be contacted about sponsorship. No spam. Unsubscribe anytime.</p>
              </form>
            </div>
          </div>
        </section>

        <section className="sponsor-faq">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>What does the sponsorship include?</h3>
                <p>One placement per weekly Planning Alert email, your logo/link on the Planning Tracker page (41 active notices, 4 municipalities), and editorial firewall guarantee — no influence over coverage.</p>
              </div>
              <div className="faq-item">
                <h3>How many people receive the digest?</h3>
                <p>Subscribers are residents directly affected by planning notices, city council decisions, and public safety updates across St. Catharines, Welland, and Thorold.</p>
              </div>
              <div className="faq-item">
                <h3>Is there an editorial firewall?</h3>
                <p>Yes. Sponsors have zero influence over what we cover, how we cover it, or what we say. Our coverage is sourced exclusively from official municipal domains.</p>
              </div>
              <div className="faq-item">
                <h3>Can I cancel anytime?</h3>
                <p>Yes. No long-term contract. Cancel with 30 days notice. Your sponsorship ends at the end of your current billing period.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
