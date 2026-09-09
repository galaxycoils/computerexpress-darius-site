import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { getActiveNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import NoticeCard from '../components/news/NoticeCard'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import '../components/news/news.css'

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

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
    if (featured.length >= 10) break
  }

  const lead = featured[0] || null
  const river = featured.slice(1)

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
      areaServed: CITIES.map((c) => ({ '@type': 'City', name: c.name })),
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
        title="St. Catharines Digital | Municipal News from Official Sources"
        description="Independent local news from official sources for St. Catharines, Welland and Thorold."
        path="/"
        jsonLd={jsonLd}
      />

      <div className="scd-page">
        <nav className="scd-sections" aria-label="City desks">
          {CITIES.map((c) => (
            <Link key={c.slug} to={`/news/${c.slug}`} className="scd-section-link">
              {c.name}
            </Link>
          ))}
          <Link to="/planning-tracker" className="scd-section-link">
            Planning
          </Link>
          <Link to="/news/police" className="scd-section-link">
            Police releases
          </Link>
          <a
            href="https://www.niagarapolice.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="scd-section-link"
          >
            NRPS ↗
          </a>
        </nav>

        <div className="scd-front">
          <div>
            {lead ? (
              <article className="scd-lead">
                <p className="scd-lead-kicker">
                  {lead.municipality || 'Municipal'}
                  {lead.type ? ` · ${lead.type}` : ''}
                </p>
                <h1 className="scd-lead-title">
                  {lead.sourceUrl ? (
                    <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">
                      {lead.title}
                    </a>
                  ) : (
                    lead.title
                  )}
                </h1>
                {lead.description && (
                  <p className="scd-lead-dek">
                    {lead.description.length > 220
                      ? lead.description.slice(0, 220) + '…'
                      : lead.description}
                  </p>
                )}
                <div className="scd-lead-meta">
                  {formatDate(lead.publishedDate) && <span>{formatDate(lead.publishedDate)}</span>}
                  {lead.sourceUrl && (
                    <a
                      className="scd-lead-source"
                      href={lead.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official source →
                    </a>
                  )}
                </div>
              </article>
            ) : (
              <div className="scd-empty">
                No active notices right now. Check the planning tracker or a city desk.
              </div>
            )}

            {river.length > 0 && (
              <>
                <h2 className="scd-section-label">More from the desk</h2>
                {river.map((n) => (
                  <NoticeCard key={n.id} notice={n} />
                ))}
              </>
            )}

            <Link to="/planning-tracker" className="scd-more">
              All active notices →
            </Link>
          </div>

          <aside className="scd-rail">
            <OfficialSourcesPanel />

            <div className="scd-rail-block">
              <h2 className="scd-rail-label">How we report</h2>
              <p className="scd-rail-text">
                Only official primary documents — city sites, NRPS releases, and planning
                notices. No social media lists for public safety.
              </p>
            </div>

            <div className="scd-rail-block">
              <h2 className="scd-rail-label">Public safety</h2>
              <p className="scd-rail-text">
                Ontario does not publish a searchable offender map. Use{' '}
                <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">
                  NRPS media releases
                </a>{' '}
                for official community notices.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
