import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { getActiveNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import NewsletterPanel from '../components/news/NewsletterPanel'
import AnimatedSection from '../hooks/useInView'
import '../components/news/news.css'

function formatDate(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function relativeAgo(iso) {
  if (!iso) return ''
  try {
    const then = new Date(iso)
    if (isNaN(then.getTime())) return ''
    const days = Math.floor((Date.now() - then.getTime()) / 86400000)
    if (days < 0) return formatDate(iso)
    if (days === 0) return 'Today'
    if (days === 1) return '1 day ago'
    if (days < 7) return `${days} days ago`
    if (days < 14) return '1 wk ago'
    if (days < 60) return `${Math.floor(days / 7)} wks ago`
    return formatDate(iso)
  } catch {
    return formatDate(iso)
  }
}

function categoryLabel(notice) {
  if (notice.municipality) return String(notice.municipality).toUpperCase()
  if (notice.category) return String(notice.category).replace(/-/g, ' ').toUpperCase()
  return 'MUNICIPAL'
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
    if (featured.length >= 12) break
  }

  const lead = featured[0] || null
  const topStories = featured.slice(1, 4)
  const latest = featured.slice(4)

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

      <div className="scd-page scd-paper">
        {/* Lead story — newspaper hero */}
        {lead ? (
          <AnimatedSection className="scd-lead-block" delay={0}>
            <article className="scd-lead-story">
              {lead.imageUrl && (
                <a
                  className="scd-lead-media"
                  href={lead.sourceUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={lead.imageUrl} alt="" loading="eager" />
                </a>
              )}
              <p className="scd-cat">{categoryLabel(lead)}</p>
              <h1 className="scd-lead-headline">
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
                  {lead.description.length > 240
                    ? lead.description.slice(0, 240) + '…'
                    : lead.description}
                </p>
              )}
              <p className="scd-lead-byline">
                {relativeAgo(lead.publishedDate)}
                {lead.sourceUrl && (
                  <>
                    {' · '}
                    <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Official source
                    </a>
                  </>
                )}
              </p>
            </article>
          </AnimatedSection>
        ) : (
          <div className="scd-empty">No active notices right now. Check the planning tracker.</div>
        )}

        {/* Top Stories — compact list */}
        {topStories.length > 0 && (
          <AnimatedSection delay={40}>
            <section className="scd-top-stories" aria-labelledby="top-stories-h">
              <h2 id="top-stories-h" className="scd-section-rule">
                Top Stories
              </h2>
              <ul className="scd-top-list">
                {topStories.map((n) => (
                  <li key={n.id} className="scd-top-item">
                    {n.imageUrl && (
                      <a
                        className="scd-top-thumb"
                        href={n.sourceUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={n.imageUrl} alt="" loading="lazy" />
                      </a>
                    )}
                    <div className="scd-top-body">
                      <p className="scd-cat">{categoryLabel(n)}</p>
                      <h3 className="scd-top-title">
                        {n.sourceUrl ? (
                          <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {n.title}
                          </a>
                        ) : (
                          n.title
                        )}
                      </h3>
                      <p className="scd-top-time">{relativeAgo(n.publishedDate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedSection>
        )}

        {/* Latest from Niagara — stacked story cards */}
        {latest.length > 0 && (
          <AnimatedSection delay={80}>
            <section className="scd-latest" aria-labelledby="latest-h">
              <h2 id="latest-h" className="scd-section-rule">
                Latest from Niagara
              </h2>
              <div className="scd-latest-list">
                {latest.map((n, i) => (
                  <AnimatedSection key={n.id} delay={40 + i * 30}>
                    <article className="scd-latest-card">
                      {n.imageUrl && (
                        <a
                          className="scd-latest-media"
                          href={n.sourceUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={n.imageUrl} alt="" loading="lazy" />
                        </a>
                      )}
                      <p className="scd-cat">{categoryLabel(n)}</p>
                      <h3 className="scd-latest-title">
                        {n.sourceUrl ? (
                          <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {n.title}
                          </a>
                        ) : (
                          n.title
                        )}
                      </h3>
                      <p className="scd-latest-time">
                        {formatDate(n.publishedDate) || relativeAgo(n.publishedDate)}
                      </p>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}

        <div className="scd-cta-row">
          <Link to="/planning-tracker" className="scd-outline-btn">
            See all planning notices
          </Link>
        </div>

        <div className="scd-front scd-front-rail">
          <aside className="scd-rail">
            <AnimatedSection delay={60}>
              <OfficialSourcesPanel />
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <NewsletterPanel />
            </AnimatedSection>
          </aside>
        </div>
      </div>
    </>
  )
}
