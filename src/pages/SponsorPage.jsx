import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import '../components/news/news.css'
import '../components/news/sponsor.css'
import { siteMetrics } from '../data/metrics.js';
import { getLastRefreshedLabel } from '../data/officialDiscovery.js';

const FRESHNESS_LABEL = getLastRefreshedLabel();
const SPONSOR_ONE_PAGE_RATE = '$250/month';
const VERIFIED_COUNCIL_DECISIONS = [
  { city: 'St. Catharines', motion: '2026-07', date: 'Mar 16, 2026', label: 'Aquatic Centre/Multi-Use Facility preliminary cost estimates' },
  { city: 'St. Catharines', motion: '2026-10', date: 'Apr 2, 2026', label: 'CIP for Sites of Strategic Importance and Municipal Significance' },
  { city: 'St. Catharines', motion: '2026-12', date: 'Apr 24, 2026', label: 'Downtown Parking' },
  { city: 'St. Catharines', motion: '2026-20', date: 'Aug 7, 2026', label: 'Flood Resilience Efforts' },
  { city: 'Welland', motion: '2026-105', date: 'Jun 9, 2026', label: 'Welland Downtown BIA constitution amendments + Lisa Mooney appointment (CARRIED)' },
  { city: 'Thorold', motion: '2026-10', date: 'Jun 2, 2026', label: 'Mayoral decision ratifying council by-laws' },
  { city: 'Thorold', motion: '2026-12', date: 'Jun 23, 2026', label: 'Mayoral decision ratifying council by-laws' },
  { city: 'Thorold', motion: '2026-13', date: 'Jul 14, 2026', label: 'Mayoral decision ratifying council by-laws' },
  { city: 'Thorold', motion: '2026-16', date: 'Sep 8, 2026', label: 'Mayoral decision ratifying council by-laws' },
];
const VERIFIED_COUNTS = `${siteMetrics.police} police media releases and ${siteMetrics.planning} municipal planning notices`;
const LAST_REFRESHED = FRESHNESS_LABEL ? `${FRESHNESS_LABEL} — every record is link-clean and attached to its official source.` : 'Source corpus verification date unavailable.';
const OPTIONS = [
  { value: 'primary', label: 'Planning Alert sponsorship inquiry' },
  { value: 'category', label: 'Planning Tracker placement inquiry' },
  { value: 'notice', label: 'Other local sponsorship inquiry' },
]

export default function SponsorPage() {
  const [formData, setFormData] = useState({ businessName: '', contactName: '', email: '', phone: '', sponsorshipType: 'primary', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData(previous => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await submitForm('/api/sponsor', formData, 'We couldn’t confirm your inquiry. Please try again later or email cccemt@pm.me.')
      setSubmitted(true)
    } catch (failure) {
      setError(failure.message || 'Please email cccemt@pm.me')
    } finally {
      setLoading(false)
    }
  }

  return <>
    <Seo title="Sponsorship | St. Catharines Digital" description="Ask about local sponsorship opportunities and our editorial independence policy." path="/sponsor"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Sponsorship', url: `${BASE_URL}/sponsor` }} />
    <div className="scd-page scd-sponsor">
      <header className="scd-intro scd-sponsor-intro">
        <div>
          <p className="scd-eyebrow">Sponsorship</p>
          <h1 className="scd-intro-title">Support local information for Niagara</h1>
          <p className="scd-intro-note">Ask about opportunities alongside Planning Alerts or the Planning Tracker. Sponsorship starts at <strong>$250/month</strong>. Placement, timing, audience and final pricing depend on availability and are confirmed directly before any agreement.</p>
        </div>
        <aside className="scd-rail-block scd-sponsor-rail" aria-label="Sponsorship at a glance">
          <p className="scd-rail-label">Start a conversation</p>
          <p>Tell us about your business and the community you want to reach. Placements start at $250/month.</p>
          <a className="button button-primary" href="#sponsor-form">Send an inquiry</a>
          <p className="scd-sponsor-fineprint">Or email <a href="mailto:cccemt@pm.me">cccemt@pm.me</a>.</p>
        </aside>
      </header>
<section className="scd-sponsor-section" aria-labelledby="verified-corpus">
      <h2 id="verified-corpus" className="scd-section-rule">Verified public record</h2>
      <p>
        The corpus sponsors buy into is the audited public record: {VERIFIED_COUNTS}.
        Council and committee decisions are cited separately, not folded into the
        document total.
      </p>
      <p className="scd-sponsor-freshness" data-testid="source-corpus-last-verified">{LAST_REFRESHED}</p>
    </section>

      <section className="scd-sponsor-section" aria-labelledby="verified-council-decisions">
        <h2 id="verified-council-decisions" className="scd-section-rule">
          Council and committee decisions cited separately
        </h2>
        <p>These are verified outcomes, not part of the 52/47 count above.</p>
        <ul className="scd-rail-list">
          {VERIFIED_COUNCIL_DECISIONS.map((decision) => (
            <li key={`${decision.city}-${decision.motion}`}>
              {decision.city} — motion {decision.motion} ({decision.date}) —{' '}
              {decision.label}
            </li>
          ))}
        </ul>
        <p>
          One page, one rate: {SPONSOR_ONE_PAGE_RATE}. No fine print.
        </p>
      </section>

      <section className="scd-sponsor-section" aria-labelledby="sponsor-policy">
        <h2 id="sponsor-policy" className="scd-section-rule">How sponsorship works</h2>
        <p>We discuss placement and availability with each prospective sponsor. We disclose paid placements clearly. Sponsors do not choose stories, alter source documents, or influence editorial decisions.</p>
        <p>Explore the <Link to="/planning-tracker">Planning Tracker</Link> and <Link to="/planning-alerts">Planning Alerts</Link> to see the reader services you may support.</p>
      </section>
      <section className="scd-sponsor-section" aria-labelledby="sponsor-form-title" id="sponsor-form">
        <h2 id="sponsor-form-title" className="scd-section-rule">Ask about sponsorship</h2>
        <div className="card scd-sponsor-formcard">
          {submitted ? <div role="status"><h3>Inquiry received</h3><p>Thanks for getting in touch. To add details, email <a href="mailto:cccemt@pm.me">cccemt@pm.me</a>.</p></div> : <>
            <p className="scd-sponsor-form-intro">This form sends an inquiry. We will discuss availability, placement and terms with you by email.</p>
            {error && <p className="scd-sponsor-error" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} className="scd-sponsor-form" aria-busy={loading}>
              <div className="scd-sponsor-row">
                <div className="scd-sponsor-field"><label htmlFor="businessName">Business name *</label><input id="businessName" name="businessName" required autoComplete="organization" value={formData.businessName} onChange={handleChange} /></div>
                <div className="scd-sponsor-field"><label htmlFor="contactName">Contact name *</label><input id="contactName" name="contactName" required autoComplete="name" value={formData.contactName} onChange={handleChange} /></div>
              </div>
              <div className="scd-sponsor-row">
                <div className="scd-sponsor-field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} /></div>
                <div className="scd-sponsor-field"><label htmlFor="phone">Phone</label><input id="phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={handleChange} /></div>
              </div>
              <div className="scd-sponsor-field"><label htmlFor="sponsorshipType">Interest</label><select id="sponsorshipType" name="sponsorshipType" value={formData.sponsorshipType} onChange={handleChange}>{OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
              <div className="scd-sponsor-field"><label htmlFor="message">Message</label><textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Tell us about your business and what you would like to sponsor." /></div>
              <button type="submit" className="button button-primary" disabled={loading}>{loading ? 'Sending…' : 'Send inquiry'}</button>
              <p className="scd-sponsor-privacy">We use these details to respond to your sponsorship inquiry.</p>
            </form>
          </>}
        </div>
      </section>
    </div>
  </>
}
