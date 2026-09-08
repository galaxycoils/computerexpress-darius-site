import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { getActiveNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import NoticeCard from '../components/news/NoticeCard'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import '../components/news/news.css'

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
    if (featured.length >= 8) break
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
        title="St. Catharines Digital | Municipal News, Council & Planning"
        description="Independent local news from official sources for St. Catharines, Welland and Thorold."
        path="/"
        jsonLd={jsonLd}
      />

      <div className="scd-page">
        <p className="scd-kicker">
          <span className="scd-kicker-dot" aria-hidden="true" />
          Official sources · Niagara
        </p>

        <h1 className="scd-hero-title">Local news from primary documents</h1>

        <p className="scd-hero-lead">
          Council decisions, police releases, and planning notices for St. Catharines,
          Welland, and Thorold — each item linked to the official source.
        </p>

        <div className="scd-city-row" role="navigation" aria-label="City news">
          {CITIES.map((c) => (
            <Link key={c.slug} to={`/news/${c.slug}`} className="scd-city-chip">
              {c.name}
            </Link>
          ))}
          <Link to="/planning-tracker" className="scd-city-chip">
            Planning tracker
          </Link>
          <a
            href="https://www.niagarapolice.ca/"
            target="_blank"
            rel="noopener noreferrer"
            className="scd-city-chip"
          >
            NRPS ↗
          </a>
        </div>

        <div className="scd-layout">
          <div>
            <div className="scd-feed-label">
              <span className="scd-kicker-dot" aria-hidden="true" />
              Latest official notices
            </div>

            {featured.length === 0 ? (
              <div className="scd-empty">
                No active notices right now. Check the planning tracker or a city page.
              </div>
            ) : (
              featured.map((n) => <NoticeCard key={n.id} notice={n} />)
            )}

            <Link to="/planning-tracker" className="scd-more">
              View all active notices →
            </Link>
          </div>

          <aside>
            <OfficialSourcesPanel />

            <div className="scd-side-block">
              <h4 className="scd-side-label">How we report</h4>
              <p className="scd-side-text">
                Only official primary sources. No social media or unofficial lists for
                public safety information.
              </p>
            </div>

            <div className="scd-side-block">
              <h4 className="scd-side-label">Public safety</h4>
              <p className="scd-side-text">
                Ontario does not maintain a public searchable sex offender map. Use{' '}
                <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">
                  NRPS media releases
                </a>{' '}
                for official community notifications.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
