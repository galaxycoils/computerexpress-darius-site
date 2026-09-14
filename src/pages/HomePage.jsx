import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import { planningNotices, getUpcomingMeetings } from '../data/planningNotices'
import { siteConfig } from '../data/siteConfig'
import { CITIES } from '../data/cities'
import NewsletterPanel from '../components/news/NewsletterPanel'
import '../components/news/news.css'

const LOCAL_PHOTOS = {
  'stc-455-welland-ave': { src: '/images/local/st-catharines-city-hall.webp', alt: 'Stone facade of St. Catharines City Hall', caption: 'St. Catharines City Hall · File photo, December 2023', credit: 'Hannah Clover', license: '4.0', source: 'https://commons.wikimedia.org/wiki/File:St._Catharines_City_Hall_2023.jpg' },
  'welland-op-update': { src: '/images/local/welland-city-hall.webp', alt: 'Welland City Hall and Public Library', caption: 'Welland City Hall & Public Library · File photo, 2023', credit: 'JFVoll', license: '4.0', source: 'https://commons.wikimedia.org/wiki/File:Welland_City_Hall_%26_Public_Library_-_Welland,_ON.jpg' },
  'thorold-pamela-drive-watermain': { src: '/images/local/thorold-canal.webp', alt: 'Historic-site sign for the Old Welland Canal in Thorold', caption: 'Old Welland Canal historic-site sign, Thorold · File photo, 2016', credit: 'Ken Lund', license: '2.0', source: 'https://commons.wikimedia.org/wiki/File:Old_Welland_Canal,_Thorold,_Ontario_(29951124456).jpg' },
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function categoryLabel(notice) {
  const type = (notice.type || '').toLowerCase()
  if (type.includes('minor variance') || type.includes('committee') || type.includes('zoning')) return 'Planning'
  if (type.includes('council') || type.includes('official plan')) return 'Council'
  return notice.municipality || 'Municipal update'
}

function getStories() {
  const rank = (notice) => {
    const status = (notice.status || '').toLowerCase()
    if (status.includes('scheduled') || status === 'active') return 0
    if (status.includes('construction')) return 1
    return 2
  }
  return [...planningNotices].sort((a, b) => rank(a) - rank(b) || Number(Boolean(LOCAL_PHOTOS[b.id])) - Number(Boolean(LOCAL_PHOTOS[a.id])) || new Date(b.meetingDate || b.publishedDate || 0) - new Date(a.meetingDate || a.publishedDate || 0)).slice(0, 8)
}

function StoryLink({ story, className = '' }) {
  return <a className={className} href={story.sourceUrl} target="_blank" rel="noopener noreferrer">{story.title}</a>
}

function Photo({ story, lead = false }) {
  const photo = LOCAL_PHOTOS[story.id]
  if (!photo) return null
  return <figure className={lead ? 'scd-lead-figure' : 'scd-local-figure'}><a href={story.sourceUrl} target="_blank" rel="noopener noreferrer"><div className={lead ? 'scd-lead-media' : 'scd-latest-media'}><img src={photo.src} alt={photo.alt} loading={lead ? 'eager' : 'lazy'} /></div></a><figcaption>{photo.caption} · <a href={photo.source} target="_blank" rel="noopener noreferrer">{photo.credit}</a> · <a href={`https://creativecommons.org/licenses/by-sa/${photo.license}/`} target="_blank" rel="noopener noreferrer">CC BY-SA {photo.license}</a></figcaption></figure>
}

export default function HomePage() {
  const stories = getStories()
  const [lead, ...remaining] = stories
  const topStories = remaining.slice(0, 3)
  const updates = remaining.slice(3)
  const weekAhead = getUpcomingMeetings().slice(0, 3)
  const jsonLd = [{ '@context': 'https://schema.org', '@type': 'NewsMediaOrganization', name: siteConfig.name, url: BASE_URL, description: siteConfig.description, areaServed: CITIES.map((city) => ({ '@type': 'City', name: city.name })) }]

  return <><Seo title="St. Catharines Digital | Local news for Niagara" description="Local council, planning, election and public-safety coverage for Niagara, connected to official sources." path="/" jsonLd={jsonLd} />
    <div className="scd-page scd-home">
      <header className="scd-front-heading"><p>Niagara local briefing</p><h1>What matters locally, today.</h1><span>Independent coverage grounded in public records and primary sources.</span></header>
      {lead && <section className="scd-lead-grid" aria-labelledby="lead-story-heading">
        <article className="scd-lead-story"><Photo story={lead} lead /><p className="scd-cat">{categoryLabel(lead)}</p><h2 id="lead-story-heading"><StoryLink story={lead} /></h2><p className="scd-lead-dek">{lead.description}</p><p className="scd-story-meta"><time dateTime={lead.publishedDate}>{formatDate(lead.publishedDate)}</time> · <a href={lead.sourceUrl} target="_blank" rel="noopener noreferrer">Read official source</a></p></article>
        <aside className="scd-top-stories" aria-labelledby="top-stories-heading"><div className="scd-section-heading"><h2 id="top-stories-heading">Latest updates</h2><Link to="/news">All news →</Link></div>{topStories.map((story) => <article key={story.id} className="scd-top-item"><p className="scd-cat">{categoryLabel(story)}</p><h3><StoryLink story={story} /></h3><p className="scd-story-meta">{formatDate(story.publishedDate)}</p></article>)}</aside>
      </section>}
      <section className="scd-reader-strip" aria-label="Explore local coverage"><Link to="/council"><span>Council</span><strong>Decisions and meeting records</strong></Link><Link to="/planning-tracker"><span>Development</span><strong>Projects, hearings and notices</strong></Link><Link to="/votes"><span>Votes</span><strong>Election guides and civic information</strong></Link></section>
      <section className="scd-home-columns">
        <div className="scd-latest"><div className="scd-section-heading"><h2>More from Niagara</h2><Link to="/news">View all →</Link></div><div className="scd-update-list">{updates.map((story) => <article key={story.id} className="scd-update-card"><Photo story={story} /><div><p className="scd-cat">{categoryLabel(story)}</p><h3><StoryLink story={story} /></h3><p className="scd-story-meta">{formatDate(story.publishedDate)}</p></div></article>)}</div></div>
        <section className="scd-week-ahead" aria-labelledby="week-ahead-heading"><p className="scd-cat">Public calendar</p><h2 id="week-ahead-heading">This week locally</h2><p>Upcoming meetings and hearings from municipal notices.</p><ol>{weekAhead.map((notice) => <li key={notice.id}><time dateTime={notice.meetingDate}>{formatDate(notice.meetingDate)}</time><a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer">{notice.title}</a><span>{notice.municipality}</span></li>)}</ol><Link className="scd-text-link" to="/planning-tracker">Open planning tracker →</Link></section>
      </section>
      <section className="scd-home-newsletter" aria-label="Newsletter signup"><NewsletterPanel placement="home" topics={['Council', 'Planning', 'Police']} /></section>
    </div>
  </>
}
