import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import { submitForm } from '../utils/formRequest'
import '../components/news/news.css'
import '../styles/contact.css'

const ENTRY_PATTERN = /^[a-z0-9-]+$/

function entryFromQuery(value) {
  return value && ENTRY_PATTERN.test(value) ? value : ''
}

export default function CorrectionsPage() {
  const [params] = useSearchParams()
  const requested = entryFromQuery(params.get('entry'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [entry, setEntry] = useState(requested)
  const [sourceUrl, setSourceUrl] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    const cleanEntry = entry.trim()
    if (cleanEntry && !ENTRY_PATTERN.test(cleanEntry)) {
      setError('Use the entry id from the record link, with letters, numbers and hyphens only.')
      return
    }
    if (name.trim().length < 2) {
      setError('Enter your name (at least 2 characters).')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (message.trim().length < 10) {
      setError('Describe the claim to review (at least 10 characters).')
      return
    }
    if (sourceUrl.trim()) {
      try {
        const source = new URL(sourceUrl.trim())
        if (source.protocol !== 'https:' || source.username || source.password) throw new Error('bad url')
      } catch {
        setError('Use a complete https:// source address, without a username or password.')
        return
      }
    }
    const payload = {
      name: name.trim(),
      email: email.trim(),
      kind: 'correction',
      website,
      sourceUrl: sourceUrl.trim(),
      message: `Correction request\nEntry: ${cleanEntry || 'not specified'}\n\n${message.trim()}`,
    }
    if (JSON.stringify(payload).length > 8192) {
      setError('Please shorten the request before sending.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await submitForm('/api/contact', payload, 'We could not confirm this request. Please try again later.')
      setSubmitted(true)
    } catch (failure) {
      setError(failure.message || 'We could not confirm this request. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Corrections | St. Catharines Digital"
        description="Request a correction or right of reply. Correction requests are reviewed within 72 hours."
        path="/corrections"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Corrections', url: `${BASE_URL}/corrections/` }}
      />
      <article className="scd-page">
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">Accountability</p>
            <h1 className="scd-intro-title">Corrections</h1>
            <p className="scd-intro-note">We keep a clear record when published information needs a material correction.</p>
          </div>
        </header>
        <section aria-labelledby="corrections-log">
          <h2 id="corrections-log" className="scd-section-rule">Correction log</h2>
          <p className="scd-lead-dek">No corrections have been logged on this page.</p>
        </section>
        <section aria-labelledby="right-of-reply">
          <h2 id="right-of-reply" className="scd-section-rule">Request a correction or right of reply</h2>
          <p className="scd-lead-dek">Correction requests are reviewed within 72 hours.</p>
          <p className="scd-lead-dek">We use your name and email only to review this request and reply to you. Requests are stored in our editorial queue and sent to the editor by email through our email providers. See our <Link to="/privacy">privacy policy</Link>.</p>
          {requested ? <p className="scd-lead-dek">This form is for record <strong>{requested}</strong>.</p> : null}
          {submitted ? (
            <p role="status">Request received. Correction requests are reviewed within 72 hours.</p>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} aria-busy={loading}>
              <div aria-hidden="true" className="contact-honeypot">
                <label htmlFor="correction-website">Website</label>
                <input id="correction-website" name="website" tabIndex="-1" autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </div>
              {error ? <p role="alert">{error}</p> : null}
              <div className="form-field">
                <label htmlFor="correction-name">Name</label>
                <input id="correction-name" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="correction-email">Email</label>
                <input id="correction-email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="correction-entry">Entry</label>
                <input id="correction-entry" name="entry" value={entry} onChange={(event) => setEntry(event.target.value)} autoComplete="off" spellCheck="false" />
              </div>
              <div className="form-field">
                <label htmlFor="correction-source">Supporting source URL</label>
                <input id="correction-source" name="sourceUrl" type="url" inputMode="url" placeholder="https://" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="correction-message">Claim to review</label>
                <textarea id="correction-message" name="message" rows="5" required value={message} onChange={(event) => setMessage(event.target.value)} />
              </div>
              <button type="submit" className="button button-primary" disabled={loading}>{loading ? 'Sending…' : 'Send correction request'}</button>
            </form>
          )}
        </section>
      </article>
    </>
  )
}
