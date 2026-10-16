import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { paymentReferenceForAlertId } from '../data/paymentReference';
import Seo from '../components/Seo';

const WARDS = [
  { value: 'all', label: 'All wards (Niagara region)' },
  { value: '1', label: 'Ward 1' },
  { value: '2', label: 'Ward 2' },
  { value: '3', label: 'Ward 3' },
  { value: '4', label: 'Ward 4' },
  { value: '5', label: 'Ward 5' },
  { value: '6', label: 'Ward 6' },
];

const NOTICE_TYPES = [
  { value: 'OPA', label: 'Official Plan Amendment' },
  { value: 'ZBA', label: 'Zoning By-law Amendment' },
  { value: 'Site Plan', label: 'Site Plan Control' },
  { value: 'CoA', label: 'Committee of Adjustment (Minor Variance)' },
  { value: 'Consent', label: 'Consent Application' },
  { value: 'Part Lot Control', label: 'Part Lot Control' },
];

const STATUSES = [
  { value: 'Received', label: 'Received / Application Complete' },
  { value: 'Public Meeting Scheduled', label: 'Public Meeting Scheduled' },
  { value: 'Hearing Scheduled', label: 'Hearing Scheduled' },
  { value: 'Decision', label: 'Decision / Approved / Passed' },
  { value: 'Appeal', label: 'Under Appeal' },
  { value: 'Active', label: 'Active / Under Construction' },
];

// Planning Alerts is the paid product. The weekly digest is gated on a confirmed
// payment (functions/cron/daily-digest.js), so the price is disclosed here rather
// than after the reader has handed over an address.
const PLANNING_ALERTS_PRICE = '$49/month';
const PLANNING_ALERTS_EMAIL = 'cccemt@pm.me';
const PLANNING_ALERTS_AMOUNT = '$49.00 CAD';

function CopyField({ label, value, testId }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="scd-alerts-copy-row">
      <span className="scd-cat">{label}</span>
      <code data-testid={testId}>{value}</code>
      <button type="button" className="button button-ghost button-sm" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export default function PlanningAlertsPage() {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [wards, setWards] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [reference, setReference] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function toggleMulti(selectKey, value) {
    setError(null);
    if (selectKey === 'wards') {
      setWards(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else if (selectKey === 'types') {
      setTypes(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else if (selectKey === 'statuses') {
      setStatuses(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency, wards, types, statuses, keywords }),
      });

      const result = await res.json();

      if (res.ok) {
        setReference(paymentReferenceForAlertId(result.alert_id));
        setSuccess(true);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Seo
          title="Alerts Confirmed | St. Catharines Digital"
          description="Your planning alerts are saved. Confirm your email address, then activate the weekly digest."
          path="/planning-alerts"
        />
        <div className="scd-page scd-alerts">
          <div className="card scd-alerts-success" role="status">
            <div className="scd-alerts-success-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="scd-cat">Check your inbox</p>
            <h1>Almost there.</h1>
            <p>We sent a confirmation email to <strong>{email}</strong>. Click the link inside to confirm your address and save your filters.</p>
            <section className="scd-alerts-pay" aria-labelledby="alerts-pay">
              <h2 id="alerts-pay">Activate: pay {PLANNING_ALERTS_PRICE} by Interac e-Transfer</h2>
              <CopyField label="Amount" value={PLANNING_ALERTS_AMOUNT} testId="pay-amount" />
              <CopyField label="Send to" value={PLANNING_ALERTS_EMAIL} testId="pay-email" />
              {reference ? (
                <>
                  <CopyField label="Reference" value={reference} testId="pay-reference" />
                  <p><strong>Put {reference} in the e-Transfer message.</strong> That is how we match your payment to this alert, so you don't need to reply with anything.</p>
                </>
              ) : (
                <p>Put the email address you signed up with in the e-Transfer message so we can match it.</p>
              )}
              <h3>What happens next</h3>
              <ol>
                <li>Confirm your email using the link we just sent (it expires in 24 hours).</li>
                <li>Send the e-Transfer. Payments are matched by hand, not instantly.</li>
                <li>Once matched, you get a "Payment received" email and delivery switches on.</li>
                <li>Your digest arrives on the next Thursday at 6 AM after activation.</li>
              </ol>
            </section>
            <p>Didn't see it? Check your spam folder, or{' '}
              <button className="button button-ghost button-sm" type="button" onClick={() => setSuccess(false)}>
                start over
              </button>
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Planning Alerts for Professionals | St. Catharines Digital"
        description="A filtered weekly planning notice digest across St. Catharines, Welland, Thorold, and Niagara Region. $49/month after email confirmation."
        path="/planning-alerts"
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Planning Alerts — St. Catharines Digital',
          description: 'Weekly filtered planning notice digest for Niagara Region professionals.',
          url: 'https://stcatharinesdigital.ca/planning-alerts',
        }]}
      />
      <div className="scd-page scd-alerts">
        {/* Header */}
        <header className="scd-intro scd-alerts-intro">
          <div>
            <p className="scd-eyebrow">Planning Alerts — Professionals</p>
            <h1 className="scd-intro-title">The notices that matter, in your inbox</h1>
            <p className="scd-intro-note">
              Weekly digest of planning notices, zoning changes, and public meetings across
              St. Catharines, Welland, Thorold, and Niagara Region. Filtered to your
              municipality, notice type, and keywords. Email verification is required.
            </p>
            <p className="scd-alerts-price">
              <strong>{PLANNING_ALERTS_PRICE}</strong>, paid by Interac e-Transfer to {PLANNING_ALERTS_EMAIL}.
              Confirming your email saves your filters; we then send activation instructions.
              Reading the <Link to="/planning-tracker">Planning Tracker</Link> stays free.
            </p>
          </div>
        </header>

        {/* Builder */}
        <section className="scd-alerts-section" aria-labelledby="alerts-builder">
          <h2 id="alerts-builder" className="scd-section-rule">Build your alert</h2>
          <p className="scd-alerts-standfirst">
            Start with what you track. You can change or pause these anytime.
          </p>

          <div className="card scd-alerts-card">
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="scd-alerts-field">
                <label htmlFor="alert-email">Email address *</label>
                <input
                  type="email"
                  id="alert-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Frequency */}
              <div className="scd-alerts-field">
                <label htmlFor="alert-frequency">Delivery frequency</label>
                <div className="scd-alerts-radio">
                  <label className="scd-alerts-radio-option">
                    <input
                      type="radio"
                      name="frequency"
                      value="daily"
                      checked={frequency === 'daily'}
                      onChange={e => setFrequency(e.target.value)}
                    />
                    <span className="scd-alerts-radio-label">
                      <strong>Weekly digest</strong>
                      <em>Every Thursday, 6 AM. One email, all matches.</em>
                    </span>
                  </label>
                </div>
              </div>

              {/* Wards */}
              <div className="scd-alerts-field">
                <label>Wards (optional)</label>
                <p className="scd-alerts-hint">For MVP, wards filter by municipality. Full geographic ward filtering coming in v2.</p>
                <div className="scd-alerts-chips">
                  {WARDS.map(w => (
                    <button
                      key={w.value}
                      type="button"
                      className={`scd-alerts-chip${wards.includes(w.value) ? ' is-active' : ''}`}
                      onClick={() => toggleMulti('wards', w.value)}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div className="scd-alerts-field">
                <label>Notice types (optional)</label>
                <div className="scd-alerts-chips">
                  {NOTICE_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      className={`scd-alerts-chip${types.includes(t.value) ? ' is-active' : ''}`}
                      onClick={() => toggleMulti('types', t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statuses */}
              <div className="scd-alerts-field">
                <label>Statuses (optional)</label>
                <div className="scd-alerts-chips">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      className={`scd-alerts-chip${statuses.includes(s.value) ? ' is-active' : ''}`}
                      onClick={() => toggleMulti('statuses', s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div className="scd-alerts-field">
                <label htmlFor="alert-keywords">Keywords (optional)</label>
                <input
                  type="text"
                  id="alert-keywords"
                  value={keywords}
                  onChange={e => setKeywords(e.target.value)}
                  placeholder="Ontario St, OPA No. 55, watermain…"
                  className="scd-alerts-textInput"
                />
                <p className="scd-alerts-hint">Comma-separated. Matches against title, description, and tags.</p>
              </div>

              {error && (
                <p className="scd-alerts-error" role="alert">{error}</p>
              )}

              <button
                type="submit"
                className={`button button-primary scd-alerts-submit${loading ? ' is-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Creating alert…' : 'Create Alert'}
              </button>

              <p className="scd-alerts-fineprint">
                You will receive a verification email if the alert service is available. This form does not
                take payment — Planning Alerts are {PLANNING_ALERTS_PRICE}, activated by Interac e-Transfer to{' '}
                {PLANNING_ALERTS_EMAIL} after you confirm your email.
              </p>
            </form>
          </div>
        </section>

        {/* What you get */}
        <section className="scd-alerts-section" aria-labelledby="alerts-benefits">
          <h2 id="alerts-benefits" className="scd-section-rule">What you get</h2>
          <div className="scd-alerts-grid">
            <div className="card">
              <h3>Filtered weekly digest</h3>
              <p>Every Thursday morning, a single email with only the notices matching your filters. No noise. No generic blasts.</p>
            </div>
            <div className="card">
              <h3>Meeting dates & deadlines</h3>
              <p>Hearings, public meetings, submission deadlines — surfaced before they close. Don't miss a window.</p>
            </div>
            <div className="card">
              <h3>Source links</h3>
              <p>Every notice links to the official municipal document. Read the actual filing, not our summary.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="scd-alerts-section" aria-labelledby="alerts-how">
          <h2 id="alerts-how" className="scd-section-rule">How it works</h2>
          <ol className="scd-alerts-steps">
            <li>
              <strong>Pick your filters.</strong> Choose wards, notice types, statuses, and keywords above.
            </li>
            <li>
              <strong>Verify your email.</strong> We send a confirmation link. Confirming saves your filters — it does not start the digest on its own.
            </li>
            <li>
              <strong>Activate for {PLANNING_ALERTS_PRICE}.</strong> Send {PLANNING_ALERTS_PRICE} by Interac e-Transfer to {PLANNING_ALERTS_EMAIL} with your personal reference code (shown after signup and in your confirmation email) in the message. We match it by hand and email you when delivery is on.
            </li>
            <li>
              <strong>Get your digest.</strong> Every Thursday at 6 AM, matching notices land in your inbox.
            </li>
            <li>
              <strong>Manage anytime.</strong> Pause, edit filters, or delete your alert from your dashboard.
            </li>
          </ol>
        </section>

        {/* CTA */}
        <section className="scd-alerts-cta">
          <div className="card scd-alerts-cta-card">
            <h2 style={{ marginBottom: '0.5rem' }}>Ready to track what matters?</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Set up your alert above. It takes 30 seconds.
            </p>
            <Link to="/planning-tracker" className="button button-secondary">
              Browse the tracker first
            </Link>
            <span style={{ margin: '0 0.75rem', color: 'var(--muted)' }}>or</span>
            <Link to="/sponsor" className="button button-primary">
              Sponsor the digest
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

// Minimal test wrapper so vitest + RTL work without full Router + HelmetProvider in every test.
export function PlanningAlertsPageTestWrapper(props) {
  return (
    <HelmetProvider>
      <PlanningAlertsPage {...props} />
    </HelmetProvider>
  );
}
