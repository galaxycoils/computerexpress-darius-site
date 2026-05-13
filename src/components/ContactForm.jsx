import { useState } from 'react'

const FORMSPREE_URL = 'https://formspree.io/f/xpwzgkby'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
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
      }
    } catch (err) {
      console.error('Form submit failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="contact-form" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(52, 211, 153, 0.1)',
          border: '1px solid rgba(52, 211, 153, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '1.5rem'
        }}>✓</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-bright)' }}>Audit request received</h3>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
          Thanks for reaching out. We'll review your site and get back to you within 1-2 business days.
        </p>
      </div>
    )
  }

  function fieldClass(name) {
    return `form-field ${focused === name ? 'focused' : ''}`
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="audit-request" />
      
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
        className="button button-primary"
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}
      >
        {loading ? 'Sending...' : 'Request Free Audit'}
      </button>
    </form>
  )
}
