import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import AnimatedSection from '../hooks/useInView'
import {
  planningNotices,
  getActiveNotices,
  getUpcomingMeetings,
} from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { getLocalBusinessSchema } from '../data/schema'

const NEWSLETTER_API = '/api/newsletter'

const serviceImages = [
  '/images/service_website_design.webp',
  '/images/service_technical_seo.webp',
  '/images/service_gbp_optimization.webp',
]

function NewsletterForm({ label }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('') // '' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(NEWSLETTER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const result = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage('Subscribed! Check your inbox for the next digest.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(result.error || 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again.')
    }

    setTimeout(() => {
      setStatus('')
      setMessage('')
    }, 6000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={`${label} signup`}
      className="planning-alert-form"
    >
      <label className="sr-only" htmlFor="alert-email">
        Email address
      </label>
      <input
        id="alert-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@business.ca"
        autoComplete="email"
        aria-label="Email address"
        required
        className="alert-email-input"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        aria-live="polite"
        className="button button-primary alert-submit-btn"
      >
        {status === 'loading' ? 'Sending…' : 'Get the free Planning Alert'}
      </button>
      {status === 'success' && (
        <p className="form-status form-status-success" role="status">
          {message}
        </p>
      )}
      {status === 'error' && (
        <p className="form-status form-status-error" role="alert">
          {message}
        </p>
      )}
    </form>
  )
}

function ActiveNoticeCard({ notice }) {
  const meetingLabel =
    notice.meetingDate && notice.status !== 'Active'
      ? new Date(notice.meetingDate).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : notice.publishedDate
        ? new Date(notice.publishedDate).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
          })
        : ''

  return (
    <article className="active-notice-card">
      <span className="notice-municipality">{notice.municipality}</span>
      <span className="notice-type">{notice.type}</span>
      <h2 className="notice-title">{notice.title}</h2>
      {notice.description && (
        <p className="notice-description">{notice.description}</p>
      )}
      {notice.meetingDate && notice.status !== 'Active' && (
        <span className="notice-meeting">
          Public meeting {meetingLabel}
        </span>
      )}
      {notice.sourceUrl && (
        <a
          href={notice.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="notice-source"
        >
          Source {notice.sourceUrl.replace(/https?:\/\//, '')}
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  )
}

function HeroBgOrbs() {
  return (
    <>
      <div className="bg-orb bg-orb-1" aria-hidden="true" />
      <div className="bg-orb bg-orb-2" aria-hidden="true" />
      <div className="bg-orb bg-orb-3" aria-hidden="true" />
    </>
  )
}

export default function HomePage() {
  const activeNotices = getActiveNotices()
  const upcomingMeetings = getUpcomingMeetings()
  const featuredIds = new Set()
  const featuredNotices = []
  for (const n of activeNotices) {
    if (!featuredIds.has(n.id)) {
      featuredIds.add(n.id)
      featuredNotices.push(n)
    }
    if (featuredNotices.length >= 3) break
  }
  for (const n of upcomingMeetings) {
    if (!featuredIds.has(n.id)) {
      featuredIds.add(n.id)
      featuredNotices.push(n)
    }
    if (featuredNotices.length >= 4) break
  }

  const planningAlertDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Official Municipal Planning Notices — Tracked &amp; Delivered',
    description:
      'Weekly digest of active official municipal planning notices from St. Catharines, Welland, Thorold, and Niagara Region. Official municipal sources only; no paywalls, no editorial interference. Free while notices are active; unsubscribe anytime.',
    url: `${BASE_URL}/`,
    isAccessibleForFree: true,
    keyword: 'municipal planning notices, planning alert, official sources, st catharines, welland, thorold, niagara region',
    subjectOf: {
      '@type': 'WebApplication',
      name: 'Planning Alert',
      url: `${BASE_URL}/`,
      applicationCategory: 'News/Magazine',
      applicationSubCategory: 'Government',
      description:
        'Free weekly digest of active municipal planning notices, delivered by email. One email per week while notices are active; unsubscribe anytime.',
      operatingSystem: 'Web',
      offer: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: `${BASE_URL}/planning-tracker`,
        description: 'Full active notice list with filters by municipality, category, and status.',
      },
    ],
  }

  const webServicesOfferCatalog = {
    '@type': 'OfferCatalog',
    name: 'Web Design, Technical SEO & Local Growth Services',
    description:
      'Custom websites, technical SEO, and Google Business Profile work for service businesses in St. Catharines and Niagara — the same source-first discipline used to track official notices.',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'High-Performance Websites',
          description:
            'Custom websites built to load fast, earn trust instantly, and guide visitors toward a clear next step. Mobile-first, SEO-optimized, and designed to convert.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Technical SEO',
          description:
            'Search-ready architecture that helps Google understand, crawl, and rank your site. We fix what is broken and optimize what matters.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Google Business Profile',
          description:
            'Strengthen Google Maps and local search visibility through GBP optimization, review strategy, and weekly posts.',
        },
      },
    ],
  }

  const homePageJsonLd = [
    planningAlertDataset,
    getLocalBusinessSchema({
      hasOfferCatalog: webServicesOfferCatalog,
    }),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: BASE_URL,
      inLanguage: siteConfig.language,
      potentialAction: [
        {
          '@type': 'SubscribeAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/api/newsletter`,
            actionPlatform: [{ '@type': 'WebPlatform', URI: 'https://schema.org' }],
          },
        },
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/planning-tracker?q={search_term}`,
          },
          'query-input': 'required name=search_term',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Planning Tracker',
          item: `${BASE_URL}/planning-tracker`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Services',
          item: `${BASE_URL}/services`,
        },
        { '@type': 'ListItem', position: 4, name: 'Contact', item: `${BASE_URL}/contact` },
      ],
    },
  ]

  return (
    <>
      <Seo jsonLd={homePageJsonLd} />
      <HeroBgOrbs />

      {/* ===== HERO — PLANNING ALERT ===== */}
      <section
        className="section-first hero"
        aria-label="Planning Alert — free municipal planning digest"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div className="container hero-grid">
          <div className="hero-copy-column">
            <div className="eyebrow eyebrow-alert">
              Free weekly digest · Official municipal sources only
            </div>
            <h1>
              Official municipal planning notices,{' '}
              <span className="gradient-text">tracked and delivered.</span>
            </h1>
            <p className="hero-copy">
              St. Catharines Digital scans St. Catharines, Welland, Thorold, and
              Niagara Region notices every week — OP amendments, minor variances,
              zoning by-laws, road closures, public meetings — and puts the active
              ones in one free digest so you stop chasing CivicWeb and region
              notice boards yourself.
            </p>

            <div className="hero-actions">
              <NewsletterForm label="Planning Alert" />
            </div>

            <p className="hero-micro-copy">
              No obligation. One email per week while notices are active. Unsubscribe
              anytime.
            </p>

            <p className="hero-micro-copy" style={{ marginTop: '0.5rem' }}>
              <span aria-hidden="true" style={{ color: 'var(--success)', marginRight: '0.35rem' }}>✓</span>{' '}
              {activeNotices.length} active notices across {new Set(activeNotices.map((n) => n.municipality)).size} municipalities — updated every week.
            </p>

            <div className="hero-trust-badges" role="list">
              <span className="hero-trust-badge" role="listitem">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Official sources only
              </span>
              <span className="hero-trust-badge" role="listitem">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="1 6 1 22 13 18 13 2 22 6 22 16 13 20 13 2" />
                  <line x1="23" y1="7" x2="23" y2="16" />
                  <line x1="1" y1="7" x2="1" y2="16" />
                </svg>
                4 municipalities
              </span>
              <span className="hero-trust-badge" role="listitem">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--success)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {activeNotices.length} active notices this week
              </span>
            </div>
          </div>

          <aside className="hero-card hero-diagnostic" aria-label="Planning Alert preview — three recent active notices">
            <div className="diagnostic-topline">
              <span>Planning Alert preview</span>
              <strong>{activeNotices.length} active notices this week</strong>
            </div>
            <div className="diagnostic-score">
              <span>Across {new Set(activeNotices.map((n) => n.municipality)).size} municipalities</span>
              <strong>Updated weekly</strong>
            </div>

            <div className="diagnostic-map" aria-hidden="true">
              <span>St. Catharines</span>
              <span>Niagara Falls</span>
              <span>Welland</span>
              <span>Grimsby</span>
              <span>Thorold</span>
              <span>Fort Erie</span>
            </div>

            <div className="active-notice-preview" aria-label="Three recent active notices">
              {featuredNotices.length === 0 ? (
                <p className="notice-empty">No active notices right now. Check back next week.</p>
              ) : (
                featuredNotices.map((n) => (
                  <ActiveNoticeCard key={n.id} notice={n} />
                ))
              )}
            </div>

            <Link
              to="/planning-tracker"
              className="button button-primary diagnostic-cta"
            >
              Browse active notices
            </Link>
          </aside>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="section trust-bar-section" aria-label="Trust indicators">
        <div className="container">
          <AnimatedSection>
            <div className="trust-bar">
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>Official municipal sources only</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>Weekly digest, free</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>Sponsor model, editorial firewall</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>St. Catharines based</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="section stats-section" aria-label="Key statistics">
        <div className="container">
          <AnimatedSection>
            <div className="stats-bar">
              <AnimatedSection>
                <div className="stat-item">
                  <div className="stat-value">{activeNotices.length}</div>
                  <div className="stat-label">Active notices tracked</div>
                </div>
              </AnimatedSection>
              <AnimatedSection>
                <div className="stat-item">
                  <div className="stat-value">
                    {upcomingMeetings.filter((m) => m.meetingDate).length}
                  </div>
                  <div className="stat-label">Upcoming public meetings</div>
                </div>
              </AnimatedSection>
              <AnimatedSection>
                <div className="stat-item">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Municipalities covered</div>
                </div>
              </AnimatedSection>
              <AnimatedSection>
                <div className="stat-item">
                  <div className="stat-value">0</div>
                  <div className="stat-label">Paywalls behind official notices</div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== WHAT PLANNING ALERT IS ===== */}
      <section
        className="section section-alt"
        aria-label="What the Planning Alert is"
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>
                One free digest. Every active notice. No CivicWeb rabbit holes.
              </h2>
              <p>
                Municipal planning notices are public — but they are scattered across
                city sites, region notice boards, and meeting calendars that change
                without warning. The Planning Alert pulls the active ones into a
                single email every week, with direct links back to the official
                source.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="card-grid three-up page-block stagger-children">
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">
                  📄
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>
                  What we track
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>
                  Official Plan amendments, minor variances, zoning by-law
                  amendments, consent applications, community improvement plans,
                  draft plans of subdivision, road closures and lane restrictions,
                  public information centres, and infrastructure notices — from
                  St. Catharines, Welland, Thorold, and Niagara Region.
                </p>
              </article>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">
                  🗓
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>
                  How it arrives
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>
                  One email per week while notices are active. Each digest lists the
                  notice title, municipality, type, meeting date if scheduled, and a
                  direct link to the official source. No filler. No sponsored content
                  disguised as a notice.
                </p>
              </article>
              <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }} aria-hidden="true">
                  🔒
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>
                  How it stays independent
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', flexGrow: 1, lineHeight: '1.6' }}>
                  Sponsors support the digest, but they do not choose what gets
                  tracked, how notices are described, or which sources are cited.
                  Editorial decisions are independent. If a sponsor wants a notice
                  removed, the answer is no — and the sponsorship lapses.
                </p>
              </article>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== LIVE NOTICES — PROOF OF INVENTORY ===== */}
      <section
        className="section"
        id="live-notices"
        aria-label="Active notices this week"
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>Active notices right now</h2>
              <p>
                {activeNotices.length} notices are active across the four
                municipalities this week. Here is a sample — the full list, filters,
                and meeting calendar live on the Planning Tracker.
              </p>
            </div>
          </AnimatedSection>

          {activeNotices.length === 0 ? (
            <AnimatedSection>
              <div className="notice-empty-state">
                <p>No active notices this week.</p>
                <p className="muted">
                  Notices are added as municipalities publish them. Check back next
                  week, or browse the full archive on the Planning Tracker.
                </p>
                <Link to="/planning-tracker" className="button button-primary">
                  Open the Planning Tracker
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="active-notices-grid page-block">
                {activeNotices.slice(0, 6).map((notice) => (
                  <ActiveNoticeCard key={notice.id} notice={notice} />
                ))}
              </div>
            </AnimatedSection>
          )}

          <AnimatedSection style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link
              to="/planning-tracker"
              className="button button-secondary"
            >
              Browse all active notices on the Planning Tracker
            </Link>
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              St. Catharines, Welland, Thorold, Niagara Region — with filters by
              municipality, category, and status.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== SERVICES — SECONDARY, COMPACT ===== */}
      <section
        className="section section-alt"
        id="services"
        aria-label="Services"
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>
                The same discipline, applied to your site and local presence
              </h2>
              <p>
                We build the websites, technical SEO, and Google Business Profile
                work that make service businesses visible — the same source-first,
                no-fluff approach we use to track official notices.
              </p>
            </div>
          </AnimatedSection>

          <div className="page-block">
            <div
              className="exhibition-list"
            >
              {[
                {
                  title: 'High-Performance Websites',
                  description:
                    'Custom websites built to load fast, earn trust instantly, and guide visitors toward a clear next step. Mobile-first, SEO-optimized, and designed to convert.',
                  bullets: [
                    'Custom design tailored to your brand and industry',
                    'Mobile-first responsive',
                    'Technical SEO foundation with schema markup',
                    'Conversion-optimized layout with clear CTAs',
                  ],
                },
                {
                  title: 'Technical SEO',
                  description:
                    'Search-ready architecture that helps Google understand, crawl, and rank your site. We fix what is broken and optimize what matters.',
                  bullets: [
                    'Site speed optimization (target: 90+ PageSpeed)',
                    'Schema markup where page-visible content supports it',
                    'Core Web Vitals improvement (LCP, FID, CLS)',
                    'XML sitemap, robots.txt, and crawl optimization',
                  ],
                },
                {
                  title: 'Google Business Profile',
                  description:
                    'Strengthen Google Maps and local search visibility. We optimize your GBP so customers can find, trust, and contact you more easily.',
                  bullets: [
                    'Complete GBP setup, verification, and optimization',
                    'Keyword-optimized business description and services',
                    'Review generation strategy and response system',
                    'Weekly Google Posts and Q&A optimization',
                  ],
                },
              ].map((s, i) => (
                <Link
                  key={s.title}
                  to="/services"
                  className="exhibition-item"
                >
                  <div className="exhibition-item-left">
                    <span className="exhibition-num">0{i + 1}</span>
                    <h3 className="exhibition-title">{s.title}</h3>
                  </div>
                  <p className="exhibition-desc">{s.description}</p>
                  <ul className="exhibition-bullets">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </div>

          <AnimatedSection style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/services" className="button button-secondary">
              View all services
            </Link>
            <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
              Web design, technical SEO, Google Business Profile, and local SEO for
              service businesses across St. Catharines and Niagara.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="section section-alt" id="process" aria-label="Our process">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>A simple workflow built around clarity, speed, and execution</h2>
              <p>
                The goal is not to bury you in process. It is to move from diagnosis
                to launch with a cleaner strategy.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block">
              <ol className="step-list">
                <li className="step-item">
                  <span aria-hidden="true">1</span>
                  <div>
                    <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>
                      Audit
                    </strong>
                    <p>
                      We analyze your current site, competitors, and local search
                      landscape to identify the highest-leverage opportunities.
                    </p>
                  </div>
                </li>
                <li className="step-item">
                  <span aria-hidden="true">2</span>
                  <div>
                    <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>
                      Strategy
                    </strong>
                    <p>
                      We map out the right information architecture, messaging, and
                      local SEO approach for your specific market.
                    </p>
                  </div>
                </li>
                <li className="step-item">
                  <span aria-hidden="true">3</span>
                  <div>
                    <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>
                      Build
                    </strong>
                    <p>
                      We design and develop your site with speed, SEO, and conversion
                      best practices baked in from day one.
                    </p>
                  </div>
                </li>
                <li className="step-item">
                  <span aria-hidden="true">4</span>
                  <div>
                    <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>
                      Launch
                    </strong>
                    <p>
                      We go live with tracking, search fundamentals, and a clear lead
                      capture path. Then we optimize based on real data.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CREDIBILITY STRIP ===== */}
      <section className="section" id="credibility" aria-label="Why trust us">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>Built on what actually matters</h2>
              <p>
                No fake testimonials. Just the work, the sources, and the record.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="card-grid three-up page-block stagger-children">
              <div className="info-card">
                <h3>Official sources, everyday</h3>
                <p>
                  Every notice on this site comes straight from the municipal
                  source — CivicWeb, eSCRIBE, regional portals. Not press
                  releases, not third-party re-publishings.
                </p>
                <div className="feature-list">
                  <li>St. Catharines CivicWeb (document 139021, 139079)</li>
                  <li>Welland Council Schedule 2026 + meeting archives</li>
                  <li>Thorold eSCRIBE calendar + mayoral decisions</li>
                  <li>Niagara Region notices registry (#934 and current)</li>
                </div>
              </div>
              <div className="info-card">
                <h3>27 notices, 4 municipalities</h3>
                <p>
                  Planning Tracker holds the active and upcoming notices from
                  St. Catharines, Welland, Thorold, and Niagara Region — updated
                  every week.
                </p>
                <div className="feature-list">
                  <li>Active notices tracked weekly</li>
                  <li>Upcoming public meetings listed</li>
                  <li>Filter by municipality, category, status</li>
                  <li>Table + card views, print-friendly</li>
                </div>
              </div>
              <div className="info-card">
                <h3>Editorial independence, by design</h3>
                <p>
                  Planning Alert is free to read, funded by sponsors who buy
                  placement after readers see the utility — not before. No paywall
                  on the notices themselves. No editorial interference from
                  advertisers.
                </p>
                <div className="feature-list">
                  <li>Free weekly digest, no paywall</li>
                  <li>Sponsor model: placement after proof of inventory</li>
                  <li>Editorial firewall: no advertiser influence on coverage</li>
                  <li>St. Catharines based, locally accountable</li>
                </div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="trust-bar" style={{ marginTop: '2.5rem' }}>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>One H1 on the page — clean document outline</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>Every interactive element has a focus-visible ring</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon" aria-hidden="true">✓</span>
                <span>Built for the people who actually use this — not for vanity metrics</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== GUARANTEE ===== */}
      <section className="section guarantee-section section-alt" aria-label="Our guarantee">
        <div className="container">
          <AnimatedSection>
            <div className="guarantee-card">
              <div className="guarantee-icon" aria-hidden="true">🛡️</div>
              <h2>30-Day Satisfaction Guarantee</h2>
              <p>
                If you are not happy with our work, we will keep revising until you
                are. Every package includes this guarantee — so you can commit with
                zero risk.
              </p>
              <div className="guarantee-badges">
                <span className="guarantee-badge">No risk</span>
                <span className="guarantee-badge">No lock-in</span>
                <span className="guarantee-badge">Cancel anytime</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing" aria-label="Pricing packages">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>Transparent pricing</h2>
              <p>
                No bloated retainers. No vague deliverables. Pick a package and get
                started.
              </p>
            </div>
          </AnimatedSection>
          <div className="card-grid three-up page-block stagger-children">
            {[
              {
                name: 'Launch',
                price: '$1,500',
                period: 'one-time',
                ideal: 'For businesses that need a sharp, credible online presence fast.',
                features: [
                  '1-5 page custom website',
                  'Mobile-first responsive design',
                  'Core on-page SEO setup',
                  'Contact form with email notifications',
                  'Google Business Profile setup',
                  '30-day satisfaction guarantee',
                ],
                featured: false,
                cta: 'Get Started',
                to: '/contact',
              },
              {
                name: 'Growth',
                price: '$3,500',
                period: 'one-time',
                ideal: 'For teams that want stronger positioning, better search visibility, and more qualified leads.',
                features: [
                  'Everything in Launch, plus:',
                  'Technical SEO foundation',
                  'Schema markup implementation',
                  'Service area pages',
                  'Analytics and conversion tracking',
                  '3 months of SEO support',
                  '30-day satisfaction guarantee',
                ],
                featured: true,
                cta: 'Get Started',
                to: '/contact',
              },
              {
                name: 'Local Authority',
                price: '$5,500',
                period: 'one-time',
                ideal: 'For service brands ready to build stronger local search and maps visibility in their market.',
                features: [
                  'Everything in Growth, plus:',
                  'Google Business Profile optimization',
                  'Local SEO page structure',
                  'Review generation workflow',
                  'Monthly reporting and strategy',
                  'Priority support',
                  '30-day satisfaction guarantee',
                ],
                featured: false,
                cta: 'Get Started',
                to: '/contact',
              },
            ].map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 100}>
                <article className={`pricing-card ${p.featured ? 'featured' : ''}`}>
                  {p.featured && (
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                      <span className="portfolio-tag" style={{ fontSize: '0.65rem' }}>
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div className="pricing-top">
                    <h3>{p.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted-lite)', display: 'block' }}>
                        {p.period}
                      </span>
                      <strong>{p.price}</strong>
                    </div>
                  </div>
                  <p className="pricing-ideal">{p.ideal}</p>
                  <ul>
                    {p.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to={p.to} className={`button ${p.featured ? 'button-primary' : 'button-secondary'}`}>
                    {p.cta}
                  </Link>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section section-alt" id="faq" aria-label="Frequently asked questions">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true" />
              <h2>Frequently asked questions</h2>
              <p>Everything you need to know before getting started.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="page-block">
              <div className="faq-list">
                {[
                  {
                    q: 'How long does a typical project take?',
                    a: 'Most website projects launch within 2-4 weeks depending on scope. SEO work begins immediately but meaningful ranking improvements typically show within 60-90 days. We will give you a clear timeline after the initial audit.',
                  },
                  {
                    q: 'What is the detailed pricing breakdown and are there any ongoing costs?',
                    a: 'Our pricing is completely transparent and one-time: Launch is $1,500, Growth is $3,500, and Local Authority is $5,500. There are no hidden fees or forced monthly contracts. The only ongoing costs you will have are standard third-party hosting and domain registration, which we help you set up directly in your name so you retain 100% ownership.',
                  },
                  {
                    q: 'How does the refund process work under the 30-day satisfaction guarantee?',
                    a: 'If you are not satisfied with the website design or progress within the first 30 days of project kickoff, simply request a refund in writing. We will first make every effort to revise the work to match your expectations. If you still want to cancel, we will issue a full refund of your deposit, and the project agreement will be terminated. We believe in zero-risk partnerships.',
                  },
                  {
                    q: 'Do you work with businesses outside the local area?',
                    a: 'Yes. While we specialize in local SEO and service businesses, we work with clients remotely across Canada and the US. The same principles apply — we just target your specific service areas.',
                  },
                  {
                    q: 'What makes St. Catharines Digital different from other agencies?',
                    a: 'We are based right here in St. Catharines and we specialize in service businesses. We use AI to move faster and keep costs down, but every decision is made by a human who understands your market. No bloated retainers, no vague deliverables. We focus on what matters: site quality, search readiness, and local presence.',
                  },
                  {
                    q: 'What do you need from me to get started?',
                    a: 'Just your current website URL, a sense of what you want to improve, and your main service offerings. We handle the rest — strategy, design, copy, and technical setup. The first step is a free audit.',
                  },
                  {
                    q: 'What if I am not happy with the result?',
                    a: 'We offer a 30-day satisfaction guarantee on all packages. If you are not happy with the work, we will keep revising until you are. We have never had to use it — but it is there so you can commit with confidence.',
                  },
                  {
                    q: 'Is the Planning Alert really free?',
                    a: 'Yes. The weekly digest is free while notices are active. Sponsors support the digest, but they do not pay for your subscription and they do not get your email. If a sponsor tries to influence what notices we track or how we describe them, the sponsorship lapses and we keep sending the digest.',
                  },
                ].map((item, i) => (
                  <div key={i} className={`faq-item ${i === 0 ? 'open' : ''}`}>
                    <button
                      className="faq-question"
                      aria-expanded={i === 0}
                      aria-controls={`faq-answer-${i}`}
                      id={`faq-question-${i}`}
                    >
                      {item.q}
                      <span className="faq-icon" aria-hidden="true">
                        {i === 0 ? '×' : '+'}
                      </span>
                    </button>
                    <div
                      className="faq-answer"
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      hidden={i !== 0}
                    >
                      <div className="faq-answer-inner">{item.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== CTA — SPONSOR / MEDIA KIT (BOTTOM OF PAGE) ===== */}
      <section className="section" style={{ paddingBottom: '7rem' }} aria-label="Sponsor the Planning Alert">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div style={{ flex: '1 1 50%' }}>
                <h2 style={{ marginBottom: '0.5rem' }}>
                  Sponsor the Planning Alert
                </h2>
                <p style={{ marginBottom: '0.5rem' }}>
                  The digest reaches local business owners, developers, planners, and
                  homeowners across the Niagara Region every week. One founding sponsor
                  slot is open at a pilot price for a defined 90-day placement.
                </p>
                <p className="muted" style={{ fontSize: '0.85rem' }}>
                  Sponsor pricing is intentionally placed here, after the official-notice
                  utility is clear — not above it.
                </p>
              </div>
              <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link to="/planning-tracker" className="button button-primary">
                    Open the Planning Tracker
                  </Link>
                  <a
                    href="/media-kit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button button-secondary"
                  >
                    Media Kit & Sponsor Inquiry
                  </a>
                </div>
                <p className="muted" style={{ fontSize: '0.75rem' }}>
                  Pilot placement: one defined primary slot per send, UTM link,
                  reporting, and editorial firewall. Media kit covers inventory,
                  audience, and the editorial independence policy.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FOOTER SERVICES (ALREADY IN LAYOUT, NO DUPLICATE HERE) ===== */}
    </>
  )
}
