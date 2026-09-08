import { useParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { cities, cityBySlug } from '../data/cityConfig'
import { planningNotices } from '../data/planningNotices'
import { nrpsReleases } from '../data/nrpsReleases'

function CityNewsPageContent() {
  const { citySlug } = useParams()
  const city = cityBySlug[citySlug]

  if (!city) {
    return (
      <>
        <Seo title="City Not Found | St. Catharines Digital" description="City not found." />
        <main className="page">
          <h1>City not found</h1>
          <Link to="/">Return home</Link>
        </main>
      </>
    )
  }

  // Filter data for this city
  const planning = planningNotices.filter(n => 
    n.municipality === city.planningKey || 
    n.municipality?.includes(city.name) ||
    citySlug === 'st-catharines' && n.municipality?.includes('Niagara Region')
  ).sort((a, b) => new Date(b.publishedDate || 0) - new Date(a.publishedDate || 0))

  const police = nrpsReleases.filter(r => {
    const municipality = (r.municipality || '').toLowerCase().trim()
    // Exact-match city: only tag a release for a city hub when the NRPS
    // municipality field clearly names that city, not when it merely contains
    // the city name as a substring (e.g. "Wellandport" must NOT match "Welland").
    const exactCity = [city.name.toLowerCase(), city.slug.replace('-', ' ')].some(
      term => municipality === term || municipality.startsWith(term + ',')
    )
    const headline = (r.headline || '').toLowerCase()
    const headlineCity = [city.name.toLowerCase(), city.slug.replace('-', ' ')].some(
      term => headline.includes(term) && !municipality.includes('wellandport')
    )
    return exactCity || headlineCity
  }).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))

  const allItems = [
    ...planning.map(n => ({
      id: n.id,
      city: city.name,
      category: 'planning',
      title: n.title,
      summary: n.description || n.title,
      sourceName: n.municipality || 'City of ' + city.name,
      sourceUrl: n.sourceUrl,
      publishedAt: n.publishedDate,
      fetchedAt: n.fetchedAt,
    })),
    ...police.map(r => ({
      id: r.id,
      city: city.name,
      category: 'police',
      title: r.headline,
      summary: r.headline,
      sourceName: r.source || 'NRPS',
      sourceUrl: r.url,
      publishedAt: r.date,
      fetchedAt: r.fetchedAt,
    })),
  ].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))

  const lastUpdated = new Date().toISOString().split('T')[0]

  return (
    <>
      <Seo
        title={`${city.name} News | St. Catharines Digital`}
        description={city.description}
        path={`/news/${citySlug}`}
      />
      <main className="page city-page">
        <header className="city-header">
          <p className="kicker">Official Sources Only</p>
          <h1>{city.name}</h1>
          <p className="lead">{city.description}</p>
          <p className="last-updated">Last updated: {lastUpdated}</p>
        </header>

        <section className="city-section">
          <h2>Latest</h2>
          {allItems.length === 0 ? (
            <p className="empty-state">
              No items yet. Check the official <a href={city.officialSite} target="_blank" rel="noopener noreferrer">city site</a> or <Link to="/planning-tracker">Planning Tracker</Link>.
            </p>
          ) : (
            <div className="card-grid">
              {allItems.map(item => (
                <article key={item.id} className="card">
                  <div className="card-meta">
                    <span className={`category-${item.category}`}>{item.category}</span>
                    <span className="card-date">{item.publishedAt}</span>
                    {item.fetchedAt && <span className="card-verified">Verified {item.fetchedAt}</span>}
                  </div>
                  <h3><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
                  <p>{item.summary}</p>
                  <p className="source-link">Official source → <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.sourceName}</a></p>
                </article>
              ))}
            </div>
          )}
        </section>

        {planning.length > 0 && (
          <section className="city-section">
            <h2>Planning</h2>
            <div className="card-grid">
              {planning.map(n => (
                <article key={n.id} className="card">
                  <h3><a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">{n.title}</a></h3>
                  <p>{n.fileNumber} — {n.status}</p>
                  <p className="source-link">Official source → <a href={n.sourceUrl} target="_blank" rel="noopener noreferrer">{n.municipality}</a></p>
                </article>
              ))}
            </div>
          </section>
        )}

        {police.length > 0 && (
          <section className="city-section">
            <h2>Police / Public Safety</h2>
            <div className="card-grid">
              {police.map(r => (
                <article key={r.id} className="card">
                  <div className="card-meta">
                    <span className="category-police">police</span>
                    <span className="card-date">{r.date}</span>
                  </div>
                  <h3><a href={r.url} target="_blank" rel="noopener noreferrer">{r.headline}</a></h3>
                  <p className="source-link">Official source → <a href={r.url} target="_blank" rel="noopener noreferrer">NRPS</a></p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="city-section official-sources">
          <h2>Official Sources</h2>
          <ul>
            <li><a href={city.officialSite} target="_blank" rel="noopener noreferrer">City of {city.name}</a></li>
            <li><a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police Service</a></li>
            <li><a href="https://www.niagararegion.ca/" target="_blank" rel="noopener noreferrer">Niagara Region</a></li>
          </ul>
        </section>
      </main>
    </>
  )
}

export default function CityNewsPage() {
  return <CityNewsPageContent />
}
