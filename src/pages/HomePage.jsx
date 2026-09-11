import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { getActiveNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import NoticeCard from '../components/news/NoticeCard'
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
  const cascade = featured.slice(1, 4) // asymmetrical supporting cascade
  const river = featured.slice(4)

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
            {/* Asymmetrical lead cascade */}
            {lead ? (
              <AnimatedSection className="scd-lead-cascade" delay={0}>
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

                {cascade.length > 0 && (
                  <div className="scd-cascade-grid">
                    {cascade.map((n, i) => (
                      <AnimatedSection key={n.id} delay={80 + i * 60}>
                        <article className="scd-cascade-item">
                          <p className="scd-cascade-kicker">
                            {n.municipality || 'Municipal'}
                            {n.type ? ` · ${n.type}` : ''}
                          </p>
                          <h2 className="scd-cascade-title">
                            {n.sourceUrl ? (
                              <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">
                                {n.title}
                              </a>
                            ) : (
                              n.title
                            )}
                          </h2>
                          {n.description && (
                            <p className="scd-cascade-dek">
                              {n.description.length > 110
                                ? n.description.slice(0, 110) + '…'
                                : n.description}
                            </p>
                          )}
                          <div className="scd-cascade-meta">
                            {formatDate(n.publishedDate) && <span>{formatDate(n.publishedDate)}</span>}
                            {n.sourceUrl && (
                              <a
                                className="scd-lead-source"
                                href={n.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Source →
                              </a>
                            )}
                          </div>
                        </article>
                      </AnimatedSection>
                    ))}
                  </div>
                )}
              </AnimatedSection>
            ) : (
              <div className="scd-empty">
                No active notices right now. Check the planning tracker or a city desk.
              </div>
            )}

            {river.length > 0 && (
              <AnimatedSection delay={120}>
                <h2 className="scd-section-label">More from the desk</h2>
                {river.map((n, i) => (
                  <AnimatedSection key={n.id} delay={40 + i * 40}>
                    <NoticeCard notice={n} />
                  </AnimatedSection>
                ))}
              </AnimatedSection>
            )}

            <Link to="/planning-tracker" className="scd-more">
              All active notices →
            </Link>
          </div>

          <aside className="scd-rail">
            <AnimatedSection delay={60}>
              <OfficialSourcesPanel />
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <NewsletterPanel />
            </AnimatedSection>

            <AnimatedSection delay={140}>
              <div className="scd-rail-block">
                <h2 className="scd-rail-label">How we report</h2>
                <p className="scd-rail-text">
                  Only official primary documents — city sites, NRPS releases, and planning
                  notices. No social media lists for public safety.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={180}>
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
            </AnimatedSection>
          </aside>
        </div>
      </div>
    </>
  )
}
