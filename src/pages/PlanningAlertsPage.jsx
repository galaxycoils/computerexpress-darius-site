import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
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

export default function PlanningAlertsPage() {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [wards, setWards] = useState([]);
  const [types, setTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);

  function toggleMulti(selectKey, value, current) {
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
        setToken(result.token);
        setSuccess(true);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
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
          description="Your planning alerts are set up. Check your email to verify and start receiving notices."
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
            <p className="scd-cat">You're on the list</p>
            <h1>Almost there.</h1>
            <p>We sent a verification email to <strong>{email}</strong>. Click the link inside to activate your alerts.</p>
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
        description="Get weekly digests of planning notices, zoning changes, and public meetings across St. Catharines, Welland, Thorold, and Niagara Region. Filtered to your interests. $49/mo beta."
        path="/planning-alerts"
        jsonLd={[{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Planning Alerts — St. Catharines Digital',
          description: 'Weekly filtered planning notice digest for Niagara Region professionals.',
          url: 'https://stcatharinesdigital.ca/planning-alerts',
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CAD',
            price: '49',
            availability: 'https://schema.org/InStock',
          },
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
              wards, types, and keywords. Beta: <strong>$49/month</strong>.
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
                      <strong>Daily digest</strong>
                      <em>Every Thursday, 6 AM. One email, all matches.</em>
                    </span>
                  </label>
                  <label className="scd-alerts-radio-option">
                    <input
                      type="radio"
                      name="frequency"
                      value="immediate"
                      checked={frequency === 'immediate'}
                      onChange={e => setFrequency(e.target.value)}
                    />
                    <span className="scd-alerts-radio-label">
                      <strong>Immediate</strong>
                      <em>Each match triggers a separate email. Best for time-sensitive applications.</em>
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
                      onClick={() => toggleMulti('wards', w.value, wards)}
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
                      onClick={() => toggleMulti('types', t.value, types)}
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
                      onClick={() => toggleMulti('statuses', s.value, statuses)}
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
                Beta: <strong>$49/month</strong> via Interac e-Transfer. Cancel anytime — reply to any alert email.
              </p>
              <p className="scd-alerts-fineprint">
                Send your first $49 to <strong>cccemt@pm.me</strong> with your email as the memo. We'll confirm within 1 business day.
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
            <div className="card">
              <h3 className="scd-alerts-beta-badge">Beta pricing: $49/mo</h3>
              <p>Founding pricing locked for the first 100 users. Cancel anytime.</p>
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
              <strong>Verify your email.</strong> We send a confirmation link. Click it to activate.
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