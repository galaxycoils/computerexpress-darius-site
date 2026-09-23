import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import '../components/news/news.css'
import '../components/news/sponsor.css'

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
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Please try again or email cccemt@pm.me')
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
          <p className="scd-intro-note">Ask about opportunities alongside Planning Alerts or the Planning Tracker. Placement, timing, audience and pricing depend on availability and are confirmed directly before any agreement.</p>
        </div>
        <aside className="scd-rail-block scd-sponsor-rail" aria-label="Sponsorship at a glance">
          <p className="scd-rail-label">Start a conversation</p>
          <p>Tell us about your business and the community you want to reach.</p>
          <a className="button button-primary" href="#sponsor-form">Send an inquiry</a>
          <p className="scd-sponsor-fineprint">Or email <a href="mailto:cccemt@pm.me">cccemt@pm.me</a>.</p>
        </aside>
      </header>
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
            <form onSubmit={handleSubmit} className="scd-sponsor-form">
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
