import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { planningNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import OfficialSourcesPanel from '../components/news/OfficialSourcesPanel'
import NewsletterPanel from '../components/news/NewsletterPanel'
import AnimatedSection from '../hooks/useInView'
import '../components/news/news.css'
import '../components/news/election.css'

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

function LocalPhoto({ photo, lead = false, href = null }) {
  const media = (
    <div className={lead ? 'scd-lead-media' : 'scd-latest-media'}>
      <img src={photo.src} alt={photo.alt} loading={lead ? 'eager' : 'lazy'} fetchpriority={lead ? 'high' : undefined} />
    </div>
  )
  return (
    <figure className={lead ? 'scd-lead-figure' : 'scd-local-figure'}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={photo.alt}>
          {media}
        </a>
      ) : (
        media
      )}
      <figcaption>{photo.caption}<br /><a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit}</a> · <a href={`https://creativecommons.org/licenses/by-sa/${photo.license}/`} target="_blank" rel="noopener noreferrer">CC BY-SA {photo.license}</a> · Cropped & resized</figcaption>
    </figure>
  )
}

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
  const activeRank = (notice) => {
    const status = (notice.status || '').toLowerCase()
    if (status.includes('scheduled') || status === 'active') return 0
    if (status.includes('construction')) return 1
    return 2
  }

  return [...planningNotices]
    .sort((a, b) => {
      const rank = activeRank(a) - activeRank(b)
      if (rank) return rank
      const imageRank = Number(Boolean(LOCAL_PHOTOS[b.id])) - Number(Boolean(LOCAL_PHOTOS[a.id]))
      if (imageRank) return imageRank
      const aMeeting = new Date(a.meetingDate || 0).getTime()
      const bMeeting = new Date(b.meetingDate || 0).getTime()
      if (aMeeting !== bMeeting) return bMeeting - aMeeting
      return new Date(b.publishedDate || 0).getTime() - new Date(a.publishedDate || 0).getTime()
    })
    .slice(0, 12)
    .map(withImage)
}

export default function HomePage() {
  const featured = buildFeatured()
  const lead = featured[0] || null
  const topStories = featured.slice(1, 4)
  const latest = featured.slice(4)
  const weekAhead = getUpcomingMeetings().slice(0, 3)

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
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Top municipal stories',
      itemListElement: [lead, ...topStories].filter(Boolean).slice(0, 4).map((n, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: n.title,
        ...(n.sourceUrl ? { url: n.sourceUrl } : {}),
      })),
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

      <section className="scd-home-hero" aria-labelledby="home-title">
          <div className="scd-home-hero-copy">
            <p className="scd-kicker">Independent Niagara newsroom</p>
            <h1 id="home-title">Know what is changing where you live.</h1>
            <p>Local news, council decisions, planning notices and public-safety updates—organized for residents, with the original source close at hand.</p>
            <div className="scd-hero-actions"><Link to="/news" className="scd-primary-btn">Read the latest <span aria-hidden="true">→</span></Link><Link to="/planning-tracker" className="scd-text-btn">Track local development</Link></div>
          </div>
          <div className="scd-hero-index" aria-label="Coverage snapshot">
            <div><strong>{planningNotices.length}</strong><span>planning records</span></div>
            <div><strong>{CITIES.length}</strong><span>city hubs</span></div>
            <div><strong>01</strong><span>source-first rule</span></div>
          </div>
        </section>
        <nav className="scd-topic-nav" aria-label="Explore coverage">
          <span>Explore</span><Link to="/news/st-catharines">St. Catharines</Link><Link to="/news/welland">Welland</Link><Link to="/news/thorold">Thorold</Link><Link to="/council">Council</Link><Link to="/votes">Votes</Link>
        </nav>

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
              {lead.photo && <LocalPhoto photo={lead.photo} lead href={lead.sourceUrl} />}
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
                {lead.publishedDate ? (
                  <time dateTime={new Date(lead.publishedDate).toISOString()}>{relativeAgo(lead.publishedDate)}</time>
                ) : (
                  relativeAgo(lead.publishedDate)
                )}
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
                      <p className="scd-top-time">{n.publishedDate ? (<time dateTime={new Date(n.publishedDate).toISOString()}>{relativeAgo(n.publishedDate)}</time>) : relativeAgo(n.publishedDate)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </AnimatedSection>
        )}

        </div>

        <section className="scd-election-band" aria-labelledby="decision-2026-h">
          <div className="scd-intro">
            <div>
              <p className="scd-eyebrow">Decision 2026 · Welland votes Oct 26</p>
              <p className="scd-intro-title">Eight candidates. One mayor.</p>
              <p className="scd-intro-note">The certified field, key dates, advance polls, and how to vote — drawn from City of Welland sources.</p>
              <ul className="scd-votes-facts" aria-label="Race at a glance">
                <li><span className="badge badge-status">Voting Day Oct 26</span></li>
                <li><span className="badge badge-status">8 certified for mayor</span></li>
                <li><span className="badge badge-default">Paper ballot</span></li>
              </ul>
            </div>
            <div className="scd-election-band-cta">
              <Link to="/welland-votes" className="button button-primary">Open the voter guide</Link>
              <Link to="/news/welland" className="scd-more">All Welland coverage →</Link>
            </div>
          </div>
        </section>

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
                      {n.photo && <LocalPhoto photo={n.photo} href={n.sourceUrl} />}
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
                        {n.publishedDate ? (<time dateTime={new Date(n.publishedDate).toISOString()}>{formatDate(n.publishedDate) || relativeAgo(n.publishedDate)}</time>) : (formatDate(n.publishedDate) || relativeAgo(n.publishedDate))}
                      </p>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}

        {weekAhead.length > 0 && (
          <AnimatedSection delay={100}>
            <section className="scd-week-ahead" aria-labelledby="week-ahead-h">
              <div>
                <p className="scd-cat">LOCAL CALENDAR</p>
                <h2 id="week-ahead-h">What affects you this week</h2>
                <p>Upcoming public meetings and hearings from official municipal notices.</p>
              </div>
              <ol>
                {weekAhead.map((notice) => (
                  <li key={notice.id}>
                    <time dateTime={notice.meetingDate}>{formatDate(notice.meetingDate)}</time>
                    <div>
                      <strong>{notice.title}</strong>
                      <span>{notice.municipality}{notice.meetingLocation ? ` · ${notice.meetingLocation}` : ''}</span>
                    </div>
                    <a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a>
                  </li>
                ))}
              </ol>
            </section>
          </AnimatedSection>
        )}

        <section aria-label="Get planning alerts by email">
          <NewsletterPanel placement="home" topics={['Council', 'Planning', 'Police']} />
        </section>

        <div className="scd-cta-row">
          <Link to="/planning-tracker" className="scd-cta-primary">
            Planning Tracker
          </Link>
          <Link to="/planning-alerts" className="scd-outline-btn">
            Get Planning Alerts
          </Link>
          <Link to="/sponsor" className="scd-outline-btn">
            Sponsor Us
          </Link>
          <Link to="/membership" className="scd-outline-btn">
            Founding Supporter
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

