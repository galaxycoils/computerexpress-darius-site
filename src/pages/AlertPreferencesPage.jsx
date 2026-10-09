import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'

const NOTICE_TYPES = ['OPA', 'ZBA', 'Site Plan', 'CoA', 'Consent', 'Part Lot Control']
const STATUSES = ['Received', 'Public Meeting Scheduled', 'Hearing Scheduled', 'Decision', 'Appeal', 'Active']

// Delivery is gated on a confirmed payment (functions/cron/daily-digest.js), so
// this page has to say why the digest stopped and how to restart it.
const PLANNING_ALERTS_PRICE = '$49/month'
const PLANNING_ALERTS_EMAIL = 'cccemt@pm.me'

function formatDay(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'soon'
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function AlertPreferencesPage() {
  const [token, setToken] = useState('')
  const [alert, setAlert] = useState(null)
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const linkToken = params.get('token')
    let savedToken = linkToken || ''
    try {
      if (!savedToken) savedToken = window.sessionStorage.getItem('scd-alert-token') || ''
      if (linkToken) window.sessionStorage.setItem('scd-alert-token', linkToken)
    } catch {
      // The private link still works when browser storage is unavailable.
    }
    if (linkToken) {
      window.history.replaceState(window.history.state, '', '/preferences')
    }
    setToken(savedToken)
    if (!savedToken) {
      setState('missing')
      return
    }
    loadAlert(savedToken)
  }, [])

  async function loadAlert(authToken) {
    try {
      const response = await fetch('/api/alerts/manage', { headers: { 'X-Alert-Token': authToken } })
      const data = await response.json()
      if (!response.ok || !data.alert) throw new Error(data.error || 'This private link is invalid or expired.')
      setAlert(data.alert)
      setState('ready')
    } catch (error) {
      setMessage(error.message || 'Unable to load your alert preferences.')
      setState('error')
    }
  }

  function toggle(field, value) {
    setAlert(current => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter(item => item !== value)
        : [...current[field], value],
    }))
  }

  async function save(event) {
    event.preventDefault()
    setState('saving')
    setMessage('')
    try {
      const response = await fetch('/api/alerts/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Alert-Token': token },
        body: JSON.stringify({
          frequency: alert.frequency,
          wards: alert.wards,
          types: alert.types,
          statuses: alert.statuses,
          keywords: alert.keywords,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save your preferences.')
      setMessage('Your planning alert preferences were saved.')
      setState('ready')
    } catch (error) {
      setMessage(error.message || 'Unable to save your preferences.')
      setState('ready')
    }
  }

  async function removeAlert() {
    setState('deleting')
    setMessage('')
    try {
      const response = await fetch('/api/alerts/manage', {
        method: 'DELETE',
        headers: { 'X-Alert-Token': token },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to stop your alerts.')
      try { window.sessionStorage.removeItem('scd-alert-token') } catch {}
      setAlert(null)
      setMessage('Your planning alerts have been stopped and the saved private link was removed from this browser.')
      setState('deleted')
    } catch (error) {
      setMessage(error.message || 'Unable to stop your alerts.')
      setState('ready')
    }
  }

  return (
    <>
      <Seo
        title="Planning Alert Preferences | St. Catharines Digital"
        description="Private planning-alert preference management."
        path="/preferences"
        noIndex
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Planning Alert Preferences', url: BASE_URL }}
      />
      <div className="scd-page scd-alerts scd-preferences">
        <header className="scd-intro scd-alerts-intro">
          <p className="scd-eyebrow">Reader services</p>
          <h1 className="scd-intro-title">Planning alert preferences</h1>
          <p className="scd-intro-note">Review your delivery schedule and filters using the private link from your alert email.</p>
        </header>

        {state === 'loading' && <p className="scd-preferences-status" role="status">Loading your preferences…</p>}

        {(state === 'missing' || state === 'error') && (
          <section className="card scd-alerts-card scd-preferences-empty">
            <h2>Open your private email link</h2>
            <p>{message || 'For your privacy, preferences are available only through the secure link in an alert email.'}</p>
            <Link className="button button-primary" to="/planning-alerts">Create a new planning alert</Link>
          </section>
        )}

        {state === 'deleted' && (
          <section className="card scd-alerts-card scd-preferences-empty" role="status">
            <h2>Alerts stopped</h2>
            <p>{message}</p>
            <Link className="button button-secondary" to="/planning-alerts">Create another alert</Link>
          </section>
        )}

        {alert && ['ready', 'saving', 'deleting'].includes(state) && (
          <form className="card scd-alerts-card scd-preferences-form" onSubmit={save}>
            <div className="scd-preferences-account">
              <span>Alert email</span>
              <strong>{alert.email}</strong>
            </div>

            {alert.delivery_state === 'active' && (
              <div className="scd-preferences-subscription is-active" role="status">
                <strong>Subscription active</strong>
                <p>Your weekly digest is delivering on the schedule below.</p>
              </div>
            )}
            {(alert.delivery_state === 'grace' || alert.delivery_state === 'paused') && (
              <div className={`scd-preferences-subscription is-${alert.delivery_state}`} role="status">
                <strong>{alert.delivery_state === 'grace' ? 'Payment due' : 'Delivery paused'}</strong>
                <p>
                  {alert.delivery_state === 'grace'
                    ? `Your weekly digest is complimentary until ${formatDay(alert.grace_until)}.`
                    : 'Your filters are saved, but the weekly digest has stopped because no payment is on file.'}{' '}
                  Planning Alerts are {PLANNING_ALERTS_PRICE} — send it by Interac e-Transfer to{' '}
                  {PLANNING_ALERTS_EMAIL}, then reply to any alert email with your transfer reference.
                </p>
              </div>
            )}

            <fieldset className="scd-alerts-field">
              <legend>Delivery</legend>
              {alert.frequency === 'immediate' && <p role="status">Immediate delivery is currently unavailable. Select the weekly digest and save to receive scheduled emails.</p>}
              <label className="scd-alerts-radio-option">
                <input type="radio" name="frequency" checked={alert.frequency === 'daily'} onChange={() => setAlert({ ...alert, frequency: 'daily' })} />
                <span className="scd-alerts-radio-label"><strong>Weekly digest</strong><em>Thursday morning</em></span>
              </label>
            </fieldset>

            <fieldset className="scd-alerts-field">
              <legend>Notice types</legend>
              <div className="scd-alerts-chips">
                {NOTICE_TYPES.map(type => <button key={type} type="button" aria-pressed={alert.types.includes(type)} className={`scd-alerts-chip${alert.types.includes(type) ? ' is-active' : ''}`} onClick={() => toggle('types', type)}>{type}</button>)}
              </div>
            </fieldset>

            <fieldset className="scd-alerts-field">
              <legend>Statuses</legend>
              <div className="scd-alerts-chips">
                {STATUSES.map(status => <button key={status} type="button" aria-pressed={alert.statuses.includes(status)} className={`scd-alerts-chip${alert.statuses.includes(status) ? ' is-active' : ''}`} onClick={() => toggle('statuses', status)}>{status}</button>)}
              </div>
            </fieldset>

            <div className="scd-alerts-field">
              <label htmlFor="preference-keywords">Keywords</label>
              <input id="preference-keywords" className="scd-alerts-textInput" value={alert.keywords} onChange={event => setAlert({ ...alert, keywords: event.target.value })} placeholder="Ontario St, zoning, watermain…" />
            </div>

            {message && <p className="scd-preferences-message" role="status">{message}</p>}
            <button className="button button-primary scd-alerts-submit" disabled={state !== 'ready'}>{state === 'saving' ? 'Saving…' : 'Save preferences'}</button>

            <div className="scd-preferences-danger">
              <h2>Stop these alerts</h2>
              <p>This permanently deletes this alert and its filters.</p>
              {!confirmDelete ? (
                <button className="button button-ghost" type="button" onClick={() => setConfirmDelete(true)}>Stop planning alerts</button>
              ) : (
                <div className="scd-preferences-confirm">
                  <button className="button button-ghost" type="button" onClick={removeAlert} disabled={state === 'deleting'}>{state === 'deleting' ? 'Stopping…' : 'Yes, stop alerts'}</button>
                  <button className="button button-secondary" type="button" onClick={() => setConfirmDelete(false)}>Keep alerts</button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  )
}
