import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import manifest from '../data/generated/manifest.json'
import '../components/news/CouncilPage.css'

function SourceStatusBadge({ status }) {
  const config = {
    healthy  : { label: 'Healthy',      color: 'var(--success)' },
    'no-new' : { label: 'No new items', color: 'var(--info)' },
    failed   : { label: 'Failed',       color: 'var(--error)' },
  }
  const entry = config[status] || { label: status, color: 'var(--muted)' }
  return (
    <span
      className="badge badge-status"
      style={{ '--badge-tint': entry.color }}
      title={entry.label}
    >
      {entry.label}
    </span>
  )
}

function formatStaleDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const councilJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'City Council — St. Catharines, Welland & Thorold',
  url: 'https://stcatharinesdigital.ca/council/',
  description: 'Official city council agendas, minutes and decisions for St. Catharines, Welland and Thorold. Links to primary municipal sources only.',
  about: { '@type': 'Thing', name: 'Municipal Council' },
  inLanguage: 'en-CA',
}

function CouncilPage() {
  const COUNCIL_SOURCES = (manifest?.sources
    ? Object.entries(manifest.sources).filter(([, src]) => src.sourceType === 'council_document')
    : [])

  const allFailedNull = COUNCIL_SOURCES.length > 0 &&
    COUNCIL_SOURCES.every(([, src]) => src.status === 'failed' && src.lastSuccessfulScanAt === null)

  return (
    <>
      <Helmet>
        <title>City Council — St. Catharines, Welland & Thorold</title>
        <meta name="description" content="Official city council agendas, minutes and decisions for St. Catharines, Welland and Thorold. Links to primary municipal sources only." />
        <meta property="og:title" content="City Council — St. Catharines, Welland & Thorold" />
        <meta property="og:description" content="Official city council agendas, minutes and decisions for St. Catharines, Welland and Thorold. Links to primary municipal sources only." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(councilJsonLd)}</script>
        <link rel="canonical" href="/council/" />
      </Helmet>

      <section className="scd-page">
        <div className="scd-eyebrow">Official Sources</div>
        <h1 className="scd-page-title">City Council</h1>
        <p className="scd-page-desc">
          Agendas, minutes and decisions from the three cities. We only link to official municipal documents.
        </p>

        {allFailedNull && COUNCIL_SOURCES.length === 3 && (
          <div className="scd-source-rows">
            {COUNCIL_SOURCES.map(([, src]) => (
              <article key={src.sourcePageUrl} className="meeting-card">
                <div className="scd-source-header">
                  <h2>{src.municipality}</h2>
                  <SourceStatusBadge status="failed" />
                </div>
                <p className="scd-stale-null">No successful scan yet.</p>
                <a
                  href={src.sourcePageUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="button button-secondary scd-source-link"
                >
                  Visit official city page ↗
                </a>
              </article>
            ))}
          </div>
        )}

        {!allFailedNull && COUNCIL_SOURCES.length === 3 && (
          <div className="scd-source-rows">
            {COUNCIL_SOURCES.map(([, src]) => {
              const isFailedNull = src.status === 'failed' && src.lastSuccessfulScanAt === null
              const isFailedOk   = src.status === 'failed' && src.lastSuccessfulScanAt !== null
              const hasItems     = src.items?.length > 0

              return (
                <article key={src.sourcePageUrl} className="meeting-card">
                  <div className="scd-source-header">
                    <h2>{src.municipality}</h2>
                    <SourceStatusBadge status={src.status} />
                  </div>

                  {isFailedNull && (
                    <p className="scd-stale-null">No successful scan yet.</p>
                  )}

                  {isFailedOk && (
                    <div className="scd-stale-timestamp">
                      <span className="scd-stale-label">Stale — </span>
                      <span className="scd-stale-time">last successful scan: {formatStaleDate(src.lastSuccessfulScanAt)}</span>
                    </div>
                  )}

                  <a
                    href={src.sourcePageUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="button button-secondary scd-source-link"
                  >
                    Visit official city page ↗
                  </a>

                  {hasItems && (
                    <ul className="scd-doc-list">
                      {src.items.map((item) => (
                        <li key={item.link} className="scd-doc-item">
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                          <span className="scd-doc-date">{item.publishedAt?.slice(0, 10)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>
        )}

        <div className="scd-how-we-report">
          <strong>How we report</strong>
          <br />
          CouncilWatch only summarizes official agendas, minutes, bylaws and staff reports published by the three cities. No social media or secondary sources.
        </div>

        <p className="scd-see-also">
          <Link to="/planning-tracker">Also see Planning Tracker →</Link>
        </p>
      </section>
    </>
  )
}

export default CouncilPage
