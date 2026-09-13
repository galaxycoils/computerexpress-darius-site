import { useState } from 'react'
import './NewsletterPanel.css'

export default function NewsletterPanel({ placement = 'site_rail' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    setError('')
    setStatus('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), placement }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success !== true) throw new Error(data.error || 'Subscription could not be confirmed. Please try again later.')
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="scd-rail-block scd-newsletter">
      <h2 className="scd-rail-label">Planning alerts by email</h2>
      {status === 'success' ? (
        <p className="scd-rail-text" role="status">
          You're on the list. Watch your inbox for the next digest.
        </p>
      ) : (
        <>
          <p className="scd-rail-text">
            New notices, upcoming hearings, and what changed — one weekly digest that stays with you.
          </p>
          <form className="scd-newsletter-form" onSubmit={onSubmit} noValidate={false}>
            <label className="scd-newsletter-sr" htmlFor="scd-newsletter-email">
              Email address
            </label>
            <input
              id="scd-newsletter-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
              disabled={status === 'sending'}
            />
            <button type="submit" className="island-btn" disabled={status === 'sending'}>
              <span>{status === 'sending' ? 'Subscribing…' : 'Subscribe free'}</span>
              <span className="island-icon" aria-hidden="true">→</span>
            </button>
          </form>
          {status === 'error' && (
            <p className="scd-newsletter-error" role="alert">{error}</p>
          )}
          <p className="scd-newsletter-note">No spam. Unsubscribe anytime.</p>
        </>
      )}
    </div>
  )
}

