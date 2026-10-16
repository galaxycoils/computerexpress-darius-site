import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import NewsletterPanel from '../components/news/NewsletterPanel'
import { getNoticesByMunicipality } from '../data/planningNotices'
import { ELECTION_DATE, WARD_RACES_RETRIEVED, WARD_RACES_SOURCE, getWardRace, wellandWardRaces } from '../data/wardRaces'
import NotFoundPage from './NotFoundPage'
import '../components/news/news.css'

export default function WardRacePage() {
  const { ward } = useParams()
  const race = getWardRace(ward)
  if (!race) return <NotFoundPage />
  const path = `/elections/welland/${race.slug}`
  const notices = (getNoticesByMunicipality('welland') || []).slice(0, 5)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Welland Ward ${race.ward} Councillor Election`,
    startDate: `${ELECTION_DATE}T10:00:00-04:00`,
    endDate: `${ELECTION_DATE}T20:00:00-04:00`,
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'City', name: 'Welland, Ontario' },
  }
  return (
    <>
      <Seo
        title={`Welland Ward ${race.ward} Candidates 2026 | St. Catharines Digital`}
        description={`All ${race.candidates.length} certified candidates for Welland Ward ${race.ward} council (${race.seats} seats) in the October 26, 2026 election, from the City of Welland's official list.`}
        path={path}
        jsonLd={[jsonLd]}
      />
      <div className="scd-page">
        <nav aria-label="Breadcrumb"><Link to="/votes">Votes</Link> / <Link to="/welland-votes">Welland</Link> / Ward {race.ward}</nav>
        <h1>Welland Ward {race.ward}: who's running</h1>
        <p>{race.seats} councillors to be elected on October 26, 2026. {race.candidates.length} certified candidates.</p>
        <ul className="scd-ward-candidates">
          {race.candidates.map((c) => (
            <li key={c.name}>
              <strong>{c.name}</strong>
              {c.site ? <> — <a href={c.site} rel="noopener noreferrer nofollow" target="_blank">campaign site</a></> : null}
            </li>
          ))}
        </ul>
        <p className="scd-source">
          Source: <a href={WARD_RACES_SOURCE}>City of Welland — Registered Candidates</a> (retrieved {WARD_RACES_RETRIEVED}). Information is supplied by candidates. Listed alphabetically.
        </p>
        {notices.length > 0 && (
          <section aria-labelledby="ward-notices">
            <h2 id="ward-notices">What the next council inherits: recent Welland notices</h2>
            <ul>{notices.map((n) => <li key={n.id}><a href={n.sourceUrl}>{n.title}</a></li>)}</ul>
            <Link to="/planning-tracker">Full planning tracker →</Link>
          </section>
        )}
        <NewsletterPanel placement={`ward_race_welland_${race.slug}`} topics={['council', 'planning']} />
        <nav aria-label="Other wards">
          Other wards:{' '}
          {wellandWardRaces.filter((w) => w.slug !== race.slug).map((w) => (
            <Link key={w.slug} to={`/elections/welland/${w.slug}`} style={{ marginRight: '0.75rem' }}>Ward {w.ward}</Link>
          ))}
        </nav>
      </div>
    </>
  )
}
