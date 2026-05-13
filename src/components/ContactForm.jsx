import { useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/xpwzgkby'

export default function ContactForm({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      })
      if (res.ok) {
        setSubmitted(true)
        form.reset()
        if (onSuccess) onSuccess()
      } else {
        const errData = await res.json().catch(() => ({}))
        setError(errData.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Form submit failed:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="contact-form contact-form-success">
        <div className="contact-form-success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Audit request received</h3>
        <p>Thanks for reaching out. We'll review your site and get back to you within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="audit-request" />

      {error && (
        <div className="contact-form-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <label>
        Business name
        <input
          type="text"
          name="businessName"
          placeholder="Your Company"
          required
          onFocus={() => setFocused('businessName')}
          onBlur={() => setFocused(null)}
        />
      </label>
      
      <label>
        Email
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          onFocus={() => setFocused('email')}
          onBlur={() => setFocused(null)}
        />
      </label>
      
      <label>
        Website
        <input
          type="url"
          name="website"
          placeholder="https://your-site.com"
          onFocus={() => setFocused('website')}
          onBlur={() => setFocused(null)}
        />
      </label>
      
      <label>
        Primary service needed
        <select
          name="serviceInterest"
          onFocus={() => setFocused('service')}
          onBlur={() => setFocused(null)}
          defaultValue=""
        >
          <option value="" disabled>Select a service...</option>
          <option value="website">Website design / redesign</option>
          <option value="seo">Technical SEO</option>
          <option value="local">Local SEO / GBP optimization</option>
          <option value="full">Full package (Website + SEO + Local)</option>
          <option value="other">Something else</option>
        </select>
      </label>
      
      <label>
        What outcome are you trying to create?
        <textarea
          name="goals"
          rows="4"
          placeholder="More leads, better rankings, clearer positioning, stronger local visibility..."
          required
          onFocus={() => setFocused('goals')}
          onBlur={() => setFocused(null)}
        />
      </label>
      
      <button
        type="submit"
        className={`button button-primary${loading ? ' is-loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Request Free Audit'}
      </button>
    </form>
  )
}
