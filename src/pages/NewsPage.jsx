import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { cities } from '../data/cityConfig'
import '../components/news/news.css'
import '../components/news/news-hub.css'

export default function NewsPage() {
  return (
    <>
      <Seo
        title="Local News | St. Catharines Digital"
        description="Independent local news from official sources for St. Catharines, Welland, and Thorold."
        path="/news"
      />
      <div className="scd-page">
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">Official sources only</p>
            <h1 className="scd-intro-title">Local News</h1>
            <p className="scd-intro-note">Independent coverage from official municipal and police sources across the Niagara Region.</p>
          </div>
        </header>

        <section aria-labelledby="city-hubs-h">
          <h2 id="city-hubs-h" className="scd-section-rule">City Hubs</h2>
          <div className="scd-hub-grid">
            {cities.map(city => (
              <article key={city.slug} className="card">
                <h3>{city.name}</h3>
                <p>{city.description}</p>
                <Link to={`/news/${city.slug}`} className="scd-hub-more">
                  Read {city.name} news →
                </Link>
                <a className="scd-hub-more" href={city.officialSite} target="_blank" rel="noopener noreferrer">
                  City of {city.name} official site ↗
                </a>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="other-coverage-h">
          <h2 id="other-coverage-h" className="scd-section-rule">Other Coverage</h2>
          <div className="scd-hub-grid">
            <article className="card">
              <h3>Police Media Releases</h3>
              <p>Official NRPS releases across the Niagara Region.</p>
              <Link to="/news/police" className="scd-hub-more">
                Read police releases →
              </Link>
            </article>
            <article className="card">
              <h3>Planning Tracker</h3>
              <p>Active planning notices from all four municipalities.</p>
              <Link to="/planning-tracker" className="scd-hub-more">
                Open the tracker →
              </Link>
            </article>
            <article className="card">
              <h3>Council Coverage</h3>
              <p>Council agendas, minutes, and decisions.</p>
              <Link to="/council" className="scd-hub-more">
                Read council coverage →
              </Link>
            </article>
          </div>
        </section>

        <section aria-labelledby="standards-h">
          <h2 id="standards-h" className="scd-section-rule">Editorial Standards</h2>
          <p className="scd-lead-dek">St. Catharines Digital reports only from official primary sources. We do not use social media or unofficial lists for public safety information. Every item links back to a verifiable document or release.</p>
        </section>
      </div>
    </>
  )
}
