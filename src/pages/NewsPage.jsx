import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { cities } from '../data/cityConfig'

export default function NewsPage() {
  return (
    <>
      <Seo
        title="Local News | St. Catharines Digital"
        description="Independent local news from official sources for St. Catharines, Welland, and Thorold."
        path="/news"
      />
      <main className="page news-index">
        <header className="news-index-header">
          <p className="kicker">Official Sources Only</p>
          <h1>Local News</h1>
          <p className="lead">Independent coverage from official municipal and police sources across the Niagara Region.</p>
        </header>

        <section className="city-hubs">
          <h2>City Hubs</h2>
          <div className="card-grid">
            {cities.map(city => (
              <Link key={city.slug} to={`/news/${city.slug}`} className="card city-card">
                <h3>{city.name}</h3>
                <p>{city.description}</p>
                <span className="source-link">Official source → <a href={city.officialSite} target="_blank" rel="noopener noreferrer">City of {city.name}</a></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="news-index-links">
          <h2>Other Coverage</h2>
          <div className="card-grid">
            <Link to="/news/police" className="card">
              <h3>Police Media Releases</h3>
              <p>Official NRPS releases across the Niagara Region.</p>
            </Link>
            <Link to="/planning-tracker" className="card">
              <h3>Planning Tracker</h3>
              <p>Active planning notices from all four municipalities.</p>
            </Link>
            <Link to="/council" className="card">
              <h3>Council Coverage</h3>
              <p>Council agendas, minutes, and decisions.</p>
            </Link>
          </div>
        </section>

        <section className="editorial-standards">
          <h2>Editorial Standards</h2>
          <p>St. Catharines Digital reports only from official primary sources. We do not use social media or unofficial lists for public safety information. Every item links back to a verifiable document or release.</p>
        </section>
      </main>
    </>
  )
}
