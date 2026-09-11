import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { planningNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import NewsletterPanel from '../components/news/NewsletterPanel'
import AnimatedSection from '../hooks/useInView'
import '../components/news/news.css'

/** Editorial hero/thumb images for the newspaper front page (mock-aligned). */
const STORY_IMAGES = {
  'stc-455-welland-ave':
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
  'stc-ontario-st-corridor':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'stc-12-stepney-st':
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  'stc-cip-strategic-sites':
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'stc-p23-061-brimley-crescent':
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  'welland-op-update':
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
  'welland-opa-55':
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80',
  'thorold-pamela-drive-watermain':
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
  'thorold-1201-egerter-rd':
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  'welland-first-st-coa-2026-09-28':
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
}

const LEAD_ORDER = [
  'stc-455-welland-ave',
  'stc-ontario-st-corridor',
  'stc-12-stepney-st',
  'stc-cip-strategic-sites',
  'stc-p23-061-brimley-crescent',
  'welland-op-update',
  'welland-opa-55',
  'thorold-pamela-drive-watermain',
  'thorold-1201-egerter-rd',
  'welland-first-st-coa-2026-09-28',
]

function formatDate(iso) {
  if (!iso) return null
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
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
  const type = (notice.type || '').toLowerCase()
  if (type.includes('official plan') || type.includes('community improvement') || type.includes('council')) {
    if (type.includes('community improvement')) return 'COUNCIL'
    if (type.includes('official plan')) return notice.municipality?.toUpperCase() || 'COUNCIL'
  }
  if (type.includes('minor variance') || type.includes('committee of adjustment') || type.includes('zoning')) {
    return 'PLANNING'
  }
  if (notice.municipality) return String(notice.municipality).toUpperCase()
  return 'MUNICIPAL'
}

function withImage(n) {
  return {
    ...n,
    imageUrl: n.imageUrl || STORY_IMAGES[n.id] || null,
  }
}

function buildFeatured() {
  const byId = Object.fromEntries(planningNotices.map((n) => [n.id, n]))
  const ordered = []
  const seen = new Set()

  for (const id of LEAD_ORDER) {
    if (byId[id] && !seen.has(id)) {
      seen.add(id)
      ordered.push(withImage(byId[id]))
    }
  }

  const rest = [...planningNotices]
    .filter((n) => !seen.has(n.id))
    .sort((a, b) => {
      const da = new Date(a.publishedDate || 0).getTime()
      const db = new Date(b.publishedDate || 0).getTime()
      return db - da
    })

  for (const n of rest) {
    if (ordered.length >= 12) break
    ordered.push(withImage(n))
  }

  // Prefer upcoming meetings near the top if thin
  if (ordered.length < 6) {
    for (const n of getUpcomingMeetings()) {
      if (seen.has(n.id)) continue
      ordered.push(withImage(n))
      if (ordered.length >= 12) break
    }
  }

  return ordered
}

export default function HomePage() {
  const featured = buildFeatured()
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
          <div className="scd-empty">No notices right now. Check the planning tracker.</div>
        )}

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
