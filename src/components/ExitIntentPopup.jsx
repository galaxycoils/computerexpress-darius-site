import { useState, useEffect } from 'react'
import { trackEvent, trackLead } from '../utils/analytics'

const AUDIT_API = '/api/contact'

function validateEmail(email) {
  if (!email) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return 'Please enter a valid email address'
  return ''
}

function validateUrl(url) {
  if (!url) return 'Website URL is required'
  if (!url.includes('.') || url.length < 4) return 'Please enter a valid URL'
  return ''
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [url, setUrl] = useState('')
  const [emailError, setEmailError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    // If user has already closed/submitted the popup, don't register event listeners
    const isSeen = localStorage.getItem('exit_intent_seen')
    if (isSeen === 'true') return

    const handleMouseLeave = (e) => {
      // clientY < 50 suggests moving cursor up towards address bar/exit
      if (e.clientY < 50) {
        setIsVisible(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  function handleClose() {
    setIsVisible(false)
    localStorage.setItem('exit_intent_seen', 'true')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const eErr = validateEmail(email)
    const uErr = validateUrl(url)

    setEmailError(eErr)
    setUrlError(uErr)

    if (eErr || uErr) return

    setLoading(true)
    setApiError('')

    const payload = {
      name: 'Exit Intent Requester',
      email: email.trim(),
      message: `Requested Free Website and SEO Audit.\nWebsite URL: ${url.trim()}`
    }

    try {
      const res = await fetch(AUDIT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()

      if (res.ok) {
        trackLead('exit_intent_audit', {
          page_path: window.location.pathname,
        })
        trackEvent('free_audit_submit', {
          form_id: 'exit_intent_audit',
          page_path: window.location.pathname,
        })
        setSuccess(true)
        localStorage.setItem('exit_intent_seen', 'true')
      } else {
        setApiError(result.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Exit intent audit submission failed:', err)
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="exit-intent-overlay" role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
      <div className="exit-intent-modal">
        <button
          className="exit-intent-close"
          onClick={handleClose}
          aria-label="Close promotion modal"
        >
          ×
        </button>

        {success ? (
          <div className="exit-intent-success">
            <span className="exit-intent-icon" aria-hidden="true">🛡️</span>
            <h3 id="exit-intent-title">Audit Requested!</h3>
            <p>We are analyzing your site details. We will send your report to <strong>{email}</strong> within 24 hours.</p>
            <button className="button button-primary" onClick={handleClose}>
              Got it
            </button>
          </div>
        ) : (
          <form name="exit-intent-audit" data-form-id="exit_intent_audit" onSubmit={handleSubmit} noValidate>
            <span className="exit-intent-badge" aria-hidden="true">Limited Offer</span>
            <h2 id="exit-intent-title" className="gradient-text">Wait! Get a Free SEO & Speed Audit</h2>
            <p className="exit-intent-intro">Don't leave empty-handed. Enter your website and email below, and we will send you a personalized analysis of your site's SEO, speed, and conversion gaps — completely free.</p>

            {apiError && (
              <div className="contact-form-error" role="alert" style={{ marginBottom: '1rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {apiError}
              </div>
            )}

            <div className={`form-field ${urlError ? 'has-error' : ''}`}>
              <label htmlFor="exit-url">Website URL</label>
              <input
                type="text"
                id="exit-url"
                placeholder="yourwebsite.com"
                autoComplete="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setUrlError('')
                }}
                required
                aria-invalid={!!urlError}
                aria-describedby={urlError ? 'exit-url-error' : undefined}
              />
              {urlError && (
                <span id="exit-url-error" className="field-error" role="alert">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {urlError}
                </span>
              )}
            </div>

            <div className={`form-field ${emailError ? 'has-error' : ''}`}>
              <label htmlFor="exit-email">Email Address</label>
              <input
                type="email"
                id="exit-email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'exit-email-error' : undefined}
              />
              {emailError && (
                <span id="exit-email-error" className="field-error" role="alert">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {emailError}
                </span>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                className="button button-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'Submitting…' : 'Analyze My Website'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={handleClose}
              >
                No thanks
              </button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.75rem', textAlign: 'center' }}>
              No obligation. We will never share your email address.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
