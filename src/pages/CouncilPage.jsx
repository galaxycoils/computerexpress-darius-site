import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { planningNotices } from '../data/planningNotices'
import '../components/news/CouncilPage.css'

const COUNCIL_SOURCES = [
  {
    municipality: 'St. Catharines',
    url: 'https://www.stcatharines.ca/council-and-administration/mayor-and-council/',
    description: 'Council, committee, meeting and governance information from the City of St. Catharines.',
  },
  {
    municipality: 'Welland',
    url: 'https://www.welland.ca/city-hall/mayor-and-council/council-agendas-and-minutes/',
    description: 'Council agendas, minutes and meeting records published by the City of Welland.',
  },
  {
    municipality: 'Thorold',
    url: 'https://www.thorold.ca/council-administration/council/council-meetings/',
    description: 'Council meeting information and municipal records published by the City of Thorold.',
  },
]

const FEATURED_IDS = {
  'St. Catharines': ['stc-ontario-st-corridor', 'stc-cip-strategic-sites', 'stc-455-welland-ave'],
  Welland: ['welland-first-st-coa-2026-09-28', 'welland-coa-2026-09-16', 'welland-op-update'],
  Thorold: ['thorold-1201-egerter-rd', 'thorold-blocks-232-239', 'thorold-436-quaker-rd'],
}

function formatRecordDate(value) {
  if (!value) return 'Date not stated'
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-CA', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? 'UTC' : 'America/Toronto',
  })
}

function recordsFor(municipality) {
  return (FEATURED_IDS[municipality] || [])
    .map((id) => planningNotices.find((record) => record.id === id))
    .filter(Boolean)
}

const councilJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'City Council — St. Catharines, Welland & Thorold',
      description: 'Official council portals and sourced civic records for St. Catharines, Welland and Thorold.',
      url: 'https://stcatharinesdigital.ca/council/',
      inLanguage: 'en-CA',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'City Council — St. Catharines, Welland & Thorold',
      url: 'https://stcatharinesdigital.ca/council/',
      description: 'Official council portals and sourced civic records for St. Catharines, Welland and Thorold.',
      inLanguage: 'en-CA',
    }
  ]
}

export default function CouncilPage() {
  return (
    <>
      <Helmet>
        <title>City Council — St. Catharines, Welland & Thorold</title>
        <meta name="description" content="Official council portals and sourced civic records for St. Catharines, Welland and Thorold." />
        <meta property="og:title" content="City Council — St. Catharines, Welland & Thorold" />
        <meta property="og:description" content="Official council portals and sourced civic records for St. Catharines, Welland and Thorold." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(councilJsonLd)}</script>
        <link rel="canonical" href="/council/" />
      </Helmet>

      <section className="scd-page scd-council-page">
        <header className="scd-council-intro">
          <div className="scd-eyebrow">On the public record</div>
          <h1 className="scd-page-title">City Council</h1>
          <p className="scd-page-desc">
            Official council portals and recent civic records for St. Catharines, Welland and Thorold.
            Every item below links directly to its municipal source.
          </p>
        </header>

        <section aria-labelledby="city-portals-heading">
          <div className="scd-council-section-heading">
            <div>
              <p className="scd-section-kicker">Start here</p>
              <h2 id="city-portals-heading">Official council portals</h2>
            </div>
            <p>Agendas, minutes, meetings and governance information.</p>
          </div>
          <div className="scd-council-portals">
            {COUNCIL_SOURCES.map((source) => (
              <article key={source.municipality} className="scd-council-portal">
                <span className="scd-source-state">Official source</span>
                <h3>{source.municipality}</h3>
                <p>{source.description}</p>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  Open council portal <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="scd-civic-records" aria-labelledby="records-heading">
          <div className="scd-council-section-heading">
            <div>
              <p className="scd-section-kicker">Recently tracked</p>
              <h2 id="records-heading">Council and public-hearing records</h2>
            </div>
            <p>Nine sourced records already monitored by the newsroom.</p>
          </div>

          {COUNCIL_SOURCES.map((source) => (
            <section className="scd-city-records" key={source.municipality} aria-labelledby={`records-${source.municipality.toLowerCase().replaceAll(' ', '-')}`}>
              <div className="scd-city-records-title">
                <h3 id={`records-${source.municipality.toLowerCase().replaceAll(' ', '-')}`}>{source.municipality}</h3>
                <Link to={`/news/${source.municipality.toLowerCase().replaceAll(' ', '-').replace('st.-', 'st-')}`}>More local coverage →</Link>
              </div>
              <div className="scd-record-grid">
                {recordsFor(source.municipality).map((record) => (
                  <article className="scd-record-card" key={record.id}>
                    <div className="scd-record-meta">
                      <span>{record.type}</span>
                      <time dateTime={record.publishedDate}>{formatRecordDate(record.publishedDate)}</time>
                    </div>
                    <h4><a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">{record.title}</a></h4>
                    <p>{record.description}</p>
                    <dl>
                      <div><dt>Status</dt><dd>{record.status}</dd></div>
                      {record.fileNumber && <div><dt>File</dt><dd>{record.fileNumber}</dd></div>}
                      {record.meetingDate && <div><dt>Meeting</dt><dd>{formatRecordDate(record.meetingDate)}</dd></div>}
                    </dl>
                    <a className="scd-record-source" href={record.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Read official record <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>

        <aside className="scd-how-we-report">
          <strong>How we report</strong>
          <p>We summarize official agendas, minutes, bylaws, staff reports and public notices. A meeting having occurred does not mean a proposal was approved; each card shows the documented status in the source record.</p>
        </aside>

        <p className="scd-see-also"><Link to="/planning-tracker">Explore the full Planning Tracker →</Link></p>
      </section>
    </>
  )
}
