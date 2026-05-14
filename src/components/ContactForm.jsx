import { useState } from 'react'

const CONTACT_API = '/api/contact'

export default function ContactForm({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = e.target
    const data = new FormData(form)

    const payload = {
      name: data.get('name')?.trim() || '',
      email: data.get('email')?.trim() || '',
      message: data.get('message')?.trim() || '',
    }

    try {
      const res = await fetch(CONTACT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok) {
        setSubmitted(true)
        form.reset()
        if (onSuccess) onSuccess()
      } else {
        setError(result.error || 'Something went wrong. Please try again.')
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
        <div className="contact-form-success-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Message sent</h3>
        <p>Thanks for reaching out. We'll get back to you within 1-2 business days.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {error && (
        <div className="contact-form-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <label>
        Name
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          autoComplete="name"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
      </label>

      <label>
        Message
        <textarea
          name="message"
          rows="5"
          placeholder="Tell us about your project, website, or goals..."
          required
        />
      </label>

      <button
        type="submit"
        className={`button button-primary${loading ? ' is-loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
