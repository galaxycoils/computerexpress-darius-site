import { useParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { cityBySlug } from '../data/cities'
import { planningNotices } from '../data/planningNotices'
import { nrpsReleases } from '../data/nrpsReleases'
import NoticeCard from '../components/news/NoticeCard'
import '../components/news/news.css'

function toNoticeShape(item) {
  return {
    id: item.id,
    municipality: item.municipality || item.city,
    type: item.type || item.category,
    title: item.title,
    description: item.description || item.summary,
    sourceUrl: item.sourceUrl || item.url,
    publishedDate: item.publishedDate || item.publishedAt || item.date,
  }
}

function belongsToCity(notice, city) {
  const muni = (notice.municipality || '').toLowerCase()
  const title = (notice.title || '').toLowerCase()
  const desc = (notice.description || '').toLowerCase()
  const name = city.name.toLowerCase()
  const alt = city.slug.replace(/-/g, ' ')

  if (muni === name || muni.includes(name)) return true
  if (city.planningKey && muni === city.planningKey.toLowerCase()) return true

  // Niagara Region packet: only if the notice clearly names this city
  if (muni.includes('niagara region')) {
    return title.includes(name) || title.includes(alt) || desc.includes(name)
  }

  return false
}

export default function CityNewsPage() {
  const { citySlug } = useParams()
  const city = cityBySlug[citySlug]

  if (!city) {
    return (
      <>
        <Seo title="City not found | St. Catharines Digital" description="City not found." />
        <div className="scd-page">
          <h1 className="scd-intro-title">City not found</h1>
          <Link to="/" className="scd-more">
            Return home →
          </Link>
        </div>
      </>
    )
  }

  const planning = planningNotices
    .filter((n) => belongsToCity(n, city))
    .sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0))

  const police = nrpsReleases
    .filter((r) => {
      const municipality = (r.municipality || '').toLowerCase().trim()
      const terms = [city.name.toLowerCase(), city.slug.replace(/-/g, ' ')]
      const exactCity = terms.some(
        (term) => municipality === term || municipality.startsWith(term + ',')
      )
      const headline = (r.headline || '').toLowerCase()
      const headlineCity = terms.some(
        (term) => headline.includes(term) && !municipality.includes('wellandport')
      )
      return exactCity || headlineCity
    })
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))

  const latest = [
    ...planning.map((n) =>
      toNoticeShape({
        ...n,
        category: n.type || 'Planning',
        city: city.name,
      })
    ),
    ...police.map((r) =>
      toNoticeShape({
        id: r.id,
        municipality: city.name,
        type: 'Police',
        title: r.headline,
        description: r.headline,
        url: r.url,
        date: r.date,
      })
    ),
  ].sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0))

  return (
    <>
      <Seo
        title={`${city.name} News | St. Catharines Digital`}
        description={city.description}
        path={`/news/${citySlug}`}
      />

      <div className="scd-page">
        <nav className="scd-article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/news">Local news</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{city.name}</span>
        </nav>
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">
              Official sources · {city.name}
            </p>
            <h1 className="scd-intro-title">{city.name}</h1>
            <p className="scd-intro-note">{city.description}</p>
            <p className="scd-lead-byline">Source-linked civic and public-safety updates.</p>

            <div className="filter-row" role="navigation" aria-label="Other cities">
              <Link to="/news/st-catharines" className="badge badge-status" aria-current={city.slug === 'st-catharines' ? 'page' : undefined}>
                St. Catharines
              </Link>
              <Link to="/news/welland" className="badge badge-status" aria-current={city.slug === 'welland' ? 'page' : undefined}>
                Welland
              </Link>
              <Link to="/news/thorold" className="badge badge-status" aria-current={city.slug === 'thorold' ? 'page' : undefined}>
                Thorold
              </Link>
              <Link to="/news/niagara-falls" className="badge badge-status" aria-current={city.slug === 'niagara-falls' ? 'page' : undefined}>
                Niagara Falls
              </Link>
              <Link to="/planning-tracker" className="badge badge-default">
                Planning tracker
              </Link>
            </div>
          </div>
        </header>

        <div className="scd-front-rail">
          <div>
            <h2 id="latest-h" className="scd-section-rule">
              Latest
            </h2>
            {latest.length === 0 ? (
              <div className="scd-empty">
                No items yet. Check the{' '}
                <a href={city.officialSite} target="_blank" rel="noopener noreferrer">
                  official city site
                </a>{' '}
                or the <Link to="/planning-tracker">Planning Tracker</Link>.
              </div>
            ) : (
              latest.map((n) => <NoticeCard key={n.id} notice={n} />)
            )}

            {planning.length > 0 && (
              <>
                <h2 id="planning-h" className="scd-section-rule">
                  Planning
                </h2>
                {planning.map((n) => (
                  <NoticeCard
                    key={`p-${n.id}`}
                    notice={toNoticeShape({ ...n, type: n.type || 'Planning' })}
                  />
                ))}
              </>
            )}

            {police.length > 0 && (
              <>
                <h2 id="police-h" className="scd-section-rule">
                  Police / public safety
                </h2>
                {police.map((r) => (
                  <NoticeCard
                    key={`r-${r.id}`}
                    notice={toNoticeShape({
                      id: r.id,
                      municipality: city.name,
                      type: 'Police',
                      title: r.headline,
                      description: r.headline,
                      url: r.url,
                      date: r.date,
                    })}
                  />
                ))}
              </>
            )}
          </div>

          <aside className="scd-rail" aria-label="About this coverage">
            <div className="scd-rail-block">
              <p className="scd-rail-label">Official sources</p>
              <ul className="scd-rail-list">
                <li>
                  <a href={city.officialSite} target="_blank" rel="noopener noreferrer">
                    City of {city.name} ↗
                  </a>
                </li>
                <li>
                  <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">
                    Niagara Regional Police ↗
                  </a>
                </li>
                <li>
                  <a href="https://www.niagararegion.ca/" target="_blank" rel="noopener noreferrer">
                    Niagara Region ↗
                  </a>
                </li>
              </ul>
            </div>
            <div className="scd-rail-block">
              <p className="scd-rail-label">How we report</p>
              <p className="scd-rail-text">
                Only official primary sources. City hubs list planning notices and NRPS releases that
                clearly name this municipality.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
