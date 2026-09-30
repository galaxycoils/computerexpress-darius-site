import { useId, useState } from 'react'
import { submitForm } from '../../utils/formRequest'
import UiIcon from '../journal/UiIcon'
import './NewsletterPanel.css'

export default function NewsletterPanel({ placement = 'site_rail', topics = null }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const emailId = `scd-newsletter-email-${uid}`
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(() => new Set())

  function toggleTopic(value) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    setError('')
    setStatus('sending')
    try {
      await submitForm('/api/newsletter', { email: email.trim(), placement, topics: [...selected] }, 'Subscription could not be confirmed. Please try again later.')
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="scd-rail-block scd-newsletter">
      <h2 className="scd-rail-label">Local email updates</h2>
      {status === 'success' ? (
        <p className="scd-rail-text" role="status">
          Check your inbox and confirm your email to finish subscribing.
        </p>
      ) : (
        <>
          <p className="scd-rail-text">
            Join the newsroom mailing list. Confirm your email to receive future updates when they are sent.
          </p>
          <form className="scd-newsletter-form" onSubmit={onSubmit} aria-busy={status === 'sending'}>
            <label className="scd-newsletter-sr" htmlFor={emailId}>
              Email address
            </label>
            {topics && topics.length > 0 && (
              <fieldset className="scd-newsletter-topics" disabled={status === 'sending'}>
                <legend>Choose topics (optional)</legend>
                {topics.map((topic) => {
                  const value = topic.toLowerCase()
                  return (
                    <label key={value}>
                      <input
                        type="checkbox"
                        checked={selected.has(value)}
                        onChange={() => toggleTopic(value)}
                      />
                      {topic}
                    </label>
                  )
                })}
              </fieldset>
            )}
            <input
              id={emailId}
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              maxLength={254}
              aria-describedby={status === 'error' ? `${emailId}-error` : undefined}
              required
              disabled={status === 'sending'}
            />
            <button type="submit" className="island-btn" disabled={status === 'sending'}>
              <span>{status === 'sending' ? 'Subscribing…' : 'Subscribe free'}</span>
              <span className="island-icon"><UiIcon /></span>
            </button>
          </form>
          {status === 'error' && (
            <p id={`${emailId}-error`} className="scd-newsletter-error" role="alert">{error}</p>
          )}
          <p className="scd-newsletter-note">Unsubscribe anytime. <a href="/privacy">How we use your email</a>.</p>
        </>
      )}
    </div>
  )
}
