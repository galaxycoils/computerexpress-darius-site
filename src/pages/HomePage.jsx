import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { getActiveNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import AnimatedSection from '../hooks/useInView'

export default function HomePage() {
  const activeNotices = getActiveNotices()
  const upcomingMeetings = getUpcomingMeetings()

  // Build featured list from notices + meetings (deduped, capped at 6)
  const featured = []
  const seen = new Set()
  for (const n of [...activeNotices, ...upcomingMeetings]) {
    if (!seen.has(n.id)) {
      seen.add(n.id)
      featured.push(n)
    }
    if (featured.length >= 6) break
  }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: siteConfig.name,
      url: BASE_URL,
      description: siteConfig.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'St. Catharines',
        addressRegion: 'ON',
        addressCountry: 'CA',
      },
      areaServed: [
        { '@type': 'City', name: 'St. Catharines' },
        { '@type': 'City', name: 'Welland' },
        { '@type': 'City', name: 'Thorold' },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteConfig.name,
      url: BASE_URL,
      inLanguage: 'en-CA',
    },
  ]

  return (
    <>
      <Seo
        title="St. Catharines Digital | Municipal News, Council & Planning"
        description="Independent local news from official sources. Council decisions, police releases, planning notices and municipal updates for St. Catharines, Welland and Thorold."
        path="/"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="section-first">
        <div className="container">
          <AnimatedSection>
            <div style={{ maxWidth: '40rem' }}>
              <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
                Official Sources · St. Catharines · Welland · Thorold
              </p>
              <h1 style={{ marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Municipal news from
                <br />
                <span style={{ background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  primary documents
                </span>
              </h1>
              <p style={{ fontSize: 'var(--fs-md)', color: 'var(--muted)', maxWidth: '34rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Council decisions, police releases, planning notices, and municipal updates —
                reported straight from the official source documents. No editorial interference.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/planning-tracker" className="button button-primary">
                  Planning Tracker
                </Link>
                <a
                  href="https://www.niagarapolice.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary"
                >
                  NRPS Releases ↗
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{featured.length}</div>
              <div className="stat-label">Active Notices</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4</div>
              <div className="stat-label">Municipalities</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">NRPS</div>
              <div className="stat-label">Police Source</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Editorial Interference</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '2.5rem' }} className="news-layout">
            
            {/* Stories column */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                fontWeight: 600
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--success)',
                  boxShadow: '0 0 0 3px rgba(52,211,153,0.25)'
                }} />
                Latest official notices
              </div>

              <div className="card-list">
                {featured.length === 0 ? (
                  <div className="state-container">
                    <h3>No active notices</h3>
                    <p>Check back soon — official municipal documents are published as they're released.</p>
                    <Link to="/planning-tracker" className="button button-primary">
                      View Planning Tracker
                    </Link>
                  </div>
                ) : (
                  featured.map((n) => (
                    <article key={n.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        fontSize: 'var(--fs-xs)',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          background: 'var(--emerald-dim)',
                          color: 'var(--primary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-mono)',
                          fontSize: 'var(--fs-xs)'
                        }}>
                          {n.municipality || 'Municipal'}
                        </span>
                        <span style={{ color: 'var(--muted)' }}>{n.type}</span>
                        {n.publishedDate && (
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 'var(--fs-xs)',
                            color: 'var(--muted-lite)'
                          }}>
                            · {new Date(n.publishedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 style={{ marginBottom: '0.35rem' }}>
                        <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-bright)', textDecoration: 'none' }}>
                          {n.title}
                        </a>
                      </h3>
                      {n.description && (
                        <p style={{ fontSize: 'var(--fs-sm)', marginBottom: '0.6rem' }}>
                          {n.description.length > 160 ? n.description.slice(0, 160) + '…' : n.description}
                        </p>
                      )}
                      {n.sourceUrl && (
                        <a
                          href={n.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 'var(--fs-sm)',
                            color: 'var(--primary)',
                            textDecoration: 'none',
                            fontWeight: 500
                          }}
                        >
                          Official source →
                        </a>
                      )}
                    </article>
                  ))
                )}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/planning-tracker" className="button button-ghost">
                  View all active notices →
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Official Sources
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Niagara Regional Police', href: 'https://www.niagarapolice.ca/' },
                    { label: 'City of St. Catharines', href: 'https://www.stcatharines.ca/' },
                    { label: 'City of Welland', href: 'https://www.welland.ca/' },
                    { label: 'City of Thorold', href: 'https://www.thorold.ca/' },
                    { label: 'Niagara Region', href: 'https://www.niagararegion.ca/' },
                  ].map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 'var(--fs-sm)',
                          color: 'var(--muted)',
                          textDecoration: 'none',
                          display: 'block',
                          padding: '0.25rem 0',
                        }}
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  How We Report
                </h4>
                <p style={{ fontSize: 'var(--fs-sm)' }}>
                  St. Catharines Digital reports only from official primary sources. We do not use social media or unofficial lists for public safety information.
                </p>
              </div>

              <div className="card" style={{ padding: '1.25rem', background: 'var(--emerald-dim)', borderColor: 'rgba(156,228,193,0.2)' }}>
                <h4 style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Public Safety
                </h4>
                <p style={{ fontSize: 'var(--fs-sm)' }}>
                  Ontario does not maintain a public searchable sex offender map. For official community notifications, check the Niagara Regional Police media releases at{' '}
                  <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>niagarapolice.ca</a>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .news-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
