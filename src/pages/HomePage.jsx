import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import {
  getActiveNotices,
  getUpcomingMeetings,
} from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'

export default function HomePage() {
  const activeNotices = getActiveNotices()
  const upcomingMeetings = getUpcomingMeetings()

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
        title="St. Catharines Digital | Official Municipal Planning Notices, Tracked & Delivered"
        description="Scans St. Catharines, Welland, Thorold, and Niagara Region notices every week and puts the active ones in one free digest. Official municipal sources only, no paywalls, no editorial interference."
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="section-first" style={{ paddingTop: '3.5rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}>
            St. Catharines · Welland · Thorold
          </p>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 650,
            lineHeight: 1.2,
            maxWidth: '36rem',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Independent local news from official sources only.
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '32rem',
            lineHeight: 1.55,
            marginBottom: '1.75rem'
          }}>
            Council decisions, Niagara Regional Police releases, planning notices and municipal updates — reported straight from the primary documents.
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
      </section>

      {/* Main grid */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '2.5rem' }} className="news-layout">
            
            {/* Stories column */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem',
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: 600
              }}>
                <span style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 0 3px rgba(34,197,94,0.25)'
                }} />
                Latest official notices
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {featured.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No active notices right now.</p>
                ) : (
                  featured.map((n) => (
                    <article
                      key={n.id}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1.25rem 1.35rem',
                        transition: 'border-color 0.15s'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        marginBottom: '0.5rem',
                        fontSize: '0.7rem',
                        color: 'var(--text-muted)'
                      }}>
                        <span style={{
                          background: 'rgba(59,130,246,0.12)',
                          color: 'var(--primary)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          {n.municipality || 'Municipal'}
                        </span>
                        <span>{n.type}</span>
                        {n.publishedDate && (
                          <span>· {new Date(n.publishedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                      </div>
                      <h2 style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        lineHeight: 1.35,
                        marginBottom: '0.4rem'
                      }}>
                        {n.title}
                      </h2>
                      {n.description && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                          marginBottom: '0.6rem'
                        }}>
                          {n.description.length > 160 ? n.description.slice(0, 160) + '…' : n.description}
                        </p>
                      )}
                      {n.sourceUrl && (
                        <a
                          href={n.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary)',
                            textDecoration: 'none'
                          }}
                        >
                          Official source ↗
                        </a>
                      )}
                    </article>
                  ))
                )}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/planning-tracker" className="button button-secondary">
                  View all active notices →
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  marginBottom: '0.85rem'
                }}>
                  Official Sources
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          textDecoration: 'none'
                        }}
                      >
                        {s.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  fontWeight: 600,
                  marginBottom: '0.6rem'
                }}>
                  About
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  St. Catharines Digital reports only from official primary sources. We do not use social media or unofficial lists for public safety information.
                </p>
              </div>

              <div style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '12px',
                padding: '1.25rem'
              }}>
                <h3 style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  Public Safety
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  For official community notifications, always check the Niagara Regional Police media releases. Ontario does not maintain a public searchable sex offender map.
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
