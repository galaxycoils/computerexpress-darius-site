import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import { cities } from '../data/cityConfig'
import { getPublishableContent } from '../data/contentRegistry'
import { readLocalNews } from '../data/localNews'
import { getLocalBusinessSchema } from '../data/schema'
import '../components/news/news-hub.css'

export default function NewsPage() {
  const [localNewsLoading, setLocalNewsLoading] = useState(true);
  const [localNewsData, setLocalNewsData] = useState([]);

  // Curated verified coverage from contentRegistry (always available).
  const curatedLatest = useMemo(
    () => getPublishableContent().sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)),
    [],
  );

  // Fetches client-side; verified official-source records are the fallback.
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR: seeds are already in the bundle.
    let active = true
    readLocalNews({ limit: 20, offset: 0 })
      .then(result => {
        if (!active) return
        setLocalNewsData(result.articles);
        setLocalNewsLoading(false);
      })
      .catch(err => {
        if (!active) return
        console.warn('Failed to load local news from API:', err);
        setLocalNewsData([]);
        setLocalNewsLoading(false);
      });
    return () => { active = false }
  }, []);
  return (
    <>
      <Seo
        title="Local News | St. Catharines Digital"
        description="Independent local news from official sources for St. Catharines, Welland, and Thorold."
        path="/news"
        jsonLd={[
          { '@context': 'https://schema.org', '@type': 'WebSite', name: 'St. Catharines Digital', url: BASE_URL },
          getLocalBusinessSchema(),
        ]}
      />
      <div className="scd-page">
        <nav className="scd-article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Local news</span>
        </nav>
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">Official sources only</p>
            <h1 className="scd-intro-title">Local News</h1>
            <p className="scd-intro-note">Independent coverage from official municipal and police sources across the Niagara Region.</p>
          </div>
        </header>

        <section aria-labelledby="latest-coverage-h">
          <div className="scd-section-heading-row"><h2 id="latest-coverage-h" className="scd-section-rule">Latest verified coverage</h2><a href="/rss.xml" className="scd-rss-link">RSS</a></div>
          <div className="scd-verified-coverage">
            {curatedLatest.map(item => <article key={item.slug} className="card"><p className="scd-cat">{item.type} · {item.city}</p><h3><Link to={`/articles/${item.slug}`}>{item.title}</Link></h3><p>{item.description}</p><div className="scd-coverage-card-footer"><time dateTime={item.publishedDate}>{item.publishedDate}</time><Link to={`/articles/${item.slug}`}>Read record →</Link></div></article>)}
          </div>
        </section>

        {localNewsData.length > 0 && (
          <section aria-labelledby="auto-news-h" style={{ marginTop: '40px' }}>
            <div className="scd-section-heading-row">
              <h2 id="auto-news-h" className="scd-section-rule">From approved sources</h2>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontFamily: 'var(--font-ui)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {localNewsLoading ? 'Loading...' : `${localNewsData.length} articles`}
              </span>
            </div>
            <div className="scd-verified-coverage">
              {localNewsData.map(item => (
                <article key={item.id} className="card">
                  <p className="scd-cat">{item.category || 'news'} · {item.sourceName}</p>
                  <h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
                  <p>{item.description}</p>
                  <div className="scd-coverage-card-footer">
                    <time dateTime={item.pubDate || undefined}>{item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not provided'}</time>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">Read source →</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

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
            <article className="card">
              <h3>Welland Votes 2026</h3>
              <p>Mayoral race, key dates, and how to vote on Oct 26.</p>
              <Link to="/welland-votes" className="scd-hub-more">
                Open the voter guide →
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
