import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { submitForm } from '../../utils/formRequest'
import UiIcon from '../journal/UiIcon'
import './NewsletterPanel.css'

export default function NewsletterPanel({
  placement = 'site_rail',
  topics = null,
  source = '',
  heading = 'Local email updates',
  lede = 'Join the newsroom mailing list. Confirm your email to receive future updates when they are sent.',
  buttonLabel = 'Subscribe free',
  pendingLabel = 'Subscribing…',
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const emailId = `scd-newsletter-email-${uid}`
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState('')
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
      const payload = { email: email.trim(), placement, topics: [...selected] }
      if (source) payload.source = source
      const result = await submitForm('/api/newsletter', payload, 'Subscription could not be confirmed. Please try again later.')
      setConfirmation(result?.message || 'Check your inbox and confirm your email to finish subscribing.')
      setStatus('success')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again later.')
      setStatus('error')
    }
  }

  return (
    <div className="scd-rail-block scd-newsletter">
      {heading ? <h2 className="scd-rail-label">{heading}</h2> : null}
      {status === 'success' ? (
        <p className="scd-rail-text" role="status">
          {confirmation || 'Check your inbox and confirm your email to finish subscribing.'}
        </p>
      ) : (
        <>
          {lede ? <p className="scd-rail-text">{lede}</p> : null}
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
              <span>{status === 'sending' ? pendingLabel : buttonLabel}</span>
              <span className="island-icon"><UiIcon /></span>
            </button>
          </form>
          {status === 'error' && (
            <p id={`${emailId}-error`} className="scd-newsletter-error" role="alert">{error}</p>
          )}
          <p className="scd-newsletter-note">Unsubscribe anytime. <Link to="/privacy">How we use your email</Link>.</p>
        </>
      )}
    </div>
  )
}
