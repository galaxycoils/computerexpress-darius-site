import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { planningNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import NewsletterPanel from '../components/news/NewsletterPanel'
import AnimatedSection from '../hooks/useInView'
import '../components/news/news.css'

const LOCAL_PHOTOS = {
  'stc-455-welland-ave': {
    src: '/images/local/st-catharines-city-hall.webp',
    alt: 'Stone facade of St. Catharines City Hall',
    caption: 'St. Catharines City Hall · File photo, December 2023',
    credit: 'Hannah Clover',
    license: '4.0',
    source: 'https://commons.wikimedia.org/wiki/File:St._Catharines_City_Hall_2023.jpg',
  },
  'welland-op-update': {
    src: '/images/local/welland-city-hall.webp',
    alt: 'Welland City Hall and Public Library',
    caption: 'Welland City Hall & Public Library · File photo, 2023',
    credit: 'JFVoll',
    license: '4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Welland_City_Hall_%26_Public_Library_-_Welland,_ON.jpg',
  },
  'thorold-pamela-drive-watermain': {
    src: '/images/local/thorold-canal.webp',
    alt: 'Historic-site sign for the Old Welland Canal in Thorold',
    caption: 'Old Welland Canal historic-site sign, Thorold · File photo, 2016',
    credit: 'Ken Lund',
    license: '2.0',
    source: 'https://commons.wikimedia.org/wiki/File:Old_Welland_Canal,_Thorold,_Ontario_(29951124456).jpg',
  },
}

function LocalPhoto({ photo, lead = false }) {
  return (
    <figure className={lead ? 'scd-lead-figure' : 'scd-local-figure'}>
      <div className={lead ? 'scd-lead-media' : 'scd-latest-media'}>
        <img src={photo.src} alt={photo.alt} loading={lead ? 'eager' : 'lazy'} fetchpriority={lead ? 'high' : undefined} />
      </div>
      <figcaption>{photo.caption}<br /><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit}</a> · <a href={`https://creativecommons.org/licenses/by-sa/${photo.license}/`} target="_blank" rel="noopener noreferrer">CC BY-SA {photo.license}</a> · Cropped & resized</figcaption>
    </figure>
  )
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
    photo: LOCAL_PHOTOS[n.id] || null,
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
        <div className="scd-intro">
          <div><p className="scd-eyebrow">St. Catharines · Welland · Thorold</p>
          <p className="scd-intro-title">Your region. On the record.</p></div>
          <p className="scd-intro-note">Local news from primary documents.<br />Council, planning and public safety — with the source in reach.</p>
        </div>
        <div className="scd-front-grid">
        {lead ? (
          <AnimatedSection className="scd-lead-block" delay={0}>
            <article className="scd-lead-story">
              {lead.photo && <LocalPhoto photo={lead.photo} lead />}
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
                Also on the record
              </h2>
              <ul className="scd-top-list">
                {topStories.map((n) => (
                  <li key={n.id} className="scd-top-item">
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

        </div>

        {latest.length > 0 && (
          <AnimatedSection delay={80}>
            <section className="scd-latest" aria-labelledby="latest-h">
              <h2 id="latest-h" className="scd-section-rule">
                More from Niagara
              </h2>
              <div className="scd-latest-list">
                {latest.map((n, i) => (
                  <AnimatedSection key={n.id} delay={40 + i * 30}>
                    <article className="scd-latest-card">
                      {n.photo && <LocalPhoto photo={n.photo} />}
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
            Planning Tracker
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

