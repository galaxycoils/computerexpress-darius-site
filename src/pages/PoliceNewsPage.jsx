import { useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Seo from '../components/Seo';
import { BASE_URL } from '../components/Seo';
import { nrpsReleases, getLatestNrpsReleases, getNrpsStats } from '../data/nrpsReleases';
import { siteConfig } from '../data/siteConfig';
import { getNewsFallback, localNewsSeeds } from '../data/localNewsSeeds';
import { getLatestNews } from '../data/localNews';
import { localNewsSources } from '../data/localNews';
import AnimatedSection from '../hooks/useInView';

export default function PoliceNewsPage() {
  const [search, setSearch] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const stats = useMemo(() => getNrpsStats(), []);

  const filteredReleases = useMemo(() => {
    let result = nrpsReleases;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(r =>
        r.headline.toLowerCase().includes(s) ||
        r.municipality.toLowerCase().includes(s) ||
        r.tags.some(t => t.toLowerCase().includes(s)) ||
        r.type.toLowerCase().includes(s)
      );
    }

    if (municipalityFilter !== 'all') {
      const key = municipalityFilter.toLowerCase();
      result = result.filter(r =>
        r.municipality.toLowerCase().includes(key) ||
        // Handle comma-separated municipalities like "Welland, Port Colborne"
        r.municipality.split(',').some(m => m.trim().toLowerCase().includes(key))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter);
    }

    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [search, municipalityFilter, categoryFilter]);

  const activeSources = localNewsSources.filter(s => s.active);
  const latestNews = getLatestNews(10).length > 0
    ? getLatestNews(10)
    : getNewsFallback(10);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'break-and-enter', label: 'Break & Enter' },
    { key: 'child-safety', label: 'Child Safety' },
    { key: 'collision', label: 'Collisions' },
    { key: 'community-notification', label: 'Community Notifications' },
    { key: 'drug-investigation', label: 'Drug Investigations' },
    { key: 'drug-seizure', label: 'Drug Seizures' },
  ];

  const municipalities = [
    { key: 'all', label: 'All Municipalities' },
    { key: 'st-catharines', label: 'St. Catharines' },
    { key: 'welland', label: 'Welland' },
    { key: 'thorold', label: 'Thorold' },
    { key: 'region-wide', label: 'Region-wide' },
    { key: 'niagara-falls', label: 'Niagara Falls' },
    { key: 'niagara-region', label: 'Niagara Region' },
  ];

  return (
    <>
      <Seo
        title="Police Media Releases | St. Catharines Digital"
        description="Official Niagara Regional Police Service media releases and community notifications, compiled daily. Cover St. Catharines, Welland, Thorold, and Niagara Region."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsMediaOrganization',
          name: 'St. Catharines Digital Police News',
          url: BASE_URL,
          description: 'Compiled Niagara Regional Police Service media releases — official sources only.',
          founder: {
            '@type': 'Organization',
            name: 'St. Catharines Digital',
          },
          knowsAbout: ['Police Media Releases', 'Crime', 'Public Safety', 'Niagara Region', 'St. Catharines', 'Welland', 'Thorold'],
        }}
      />

      {/* Header */}
      <section className="section-first police-header">
        <div className="container">
          <AnimatedSection>
            <div className="page-hero">
              <span className="eyebrow eyebrow-alert" style={{ margin: '0 auto 1.5rem' }}>
                Official NRPS Media Releases
              </span>
              <h1>Police Media Releases</h1>
              <p className="page-subtitle" style={{ maxWidth: '65ch', margin: '0 auto 2rem' }}>
                Official Niagara Regional Police Service media releases and community
                notifications — compiled daily from niagarapolice.ca. Covers St. Catharines,
                Welland, Thorold, and the Niagara Region.
              </p>
              <div className="stats-bar" style={{ justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div className="stat-item">
                  <div className="stat-value">{stats.recent7Days}</div>
                  <div className="stat-label">Releases (7 days)</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total in archive</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{activeSources.length}</div>
                  <div className="stat-label">Local news sources</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container">
        {/* Filters */}
        <section className="filters-section" style={{ marginBottom: '2.5rem' }} aria-label="Filter police releases">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="police-search" className="visually-hidden">Search police releases</label>
              <input
                type="search"
                id="police-search"
                className="filter-input filter-search"
                placeholder="Search by headline, municipality, keyword…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-describedby="police-search-hint"
              />
              <span id="police-search-hint" className="visually-hidden">Search across headline, municipality, type, and tags</span>
            </div>
            <div className="filter-group">
              <label htmlFor="police-municipality" className="visually-hidden">Filter by municipality</label>
              <select
                id="police-municipality"
                className="filter-select"
                value={municipalityFilter}
                onChange={e => setMunicipalityFilter(e.target.value)}
              >
                {municipalities.map(m => (
                  <option key={m.key} value={m.key}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="police-category" className="visually-hidden">Filter by category</label>
              <select
                id="police-category"
                className="filter-select"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </div>
            {(search || municipalityFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                className="button button-ghost filter-clear"
                onClick={() => { setSearch(''); setMunicipalityFilter('all'); setCategoryFilter('all'); }}
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* Latest / Featured Release */}
        {filteredReleases.length > 0 && (
          <AnimatedSection>
            <section className="featured-release" style={{ marginBottom: '2.5rem' }} aria-labelledby="featured-heading">
              <div className="container">
                <h2 id="featured-heading" className="section-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                  Latest release
                </h2>
                <article className="featured-article">
                  <div className="featured-meta">
                    <span className="badge badge-date">{formatDate(filteredReleases[0].date)}</span>
                    <span className="news-source">{filteredReleases[0].source}</span>
                  </div>
                  <h3 className="featured-headline">
                    <a href={filteredReleases[0].url} target="_blank" rel="noopener noreferrer">
                      {filteredReleases[0].headline}
                    </a>
                  </h3>
                  <div className="featured-details">
                    <span className="news-municipality">{filteredReleases[0].municipality}</span>
                    <span className="news-type">{filteredReleases[0].type}</span>
                  </div>
                  <div className="featured-tags">
                    {filteredReleases[0].tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="featured-actions">
                    <a href={filteredReleases[0].url} target="_blank" rel="noopener noreferrer" className="button button-primary">
                      Read official release
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ marginLeft: '0.5rem' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                    <span className="source-credit">
                      Source:{' '}
                      <a href={`https://www.niagarapolice.ca/news/posts/`} target="_blank" rel="noopener noreferrer">
                        niagarapolice.ca
                      </a>
                    </span>
                  </div>
                </article>
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* All Releases */}
        <section className="news-list-section" aria-labelledby="releases-heading">
          <div className="container">
            <h2 id="releases-heading" className="section-heading" style={{ textAlign: 'left', marginBottom: '2rem' }}>
              All releases ({filteredReleases.length})
            </h2>

            {filteredReleases.length === 0 ? (
              <div className="no-results">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3>No releases match your filters</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="releases-list">
                {filteredReleases.map(release => (
                  <article key={release.id} className="release-card">
                    <div className="release-card-inner">
                      <div className="release-date-col">
                        <time dateTime={release.date} className="release-date">
                          {formatDate(release.date)}
                        </time>
                      </div>
                      <div className="release-body">
                        <div className="release-meta">
                          <span className="badge" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                            {release.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="news-municipality">{release.municipality}</span>
                        </div>
                        <h3 className="release-headline">
                          <a href={release.url} target="_blank" rel="noopener noreferrer">
                            {release.headline}
                          </a>
                        </h3>
                        <p className="release-type">{release.type}</p>
                        <div className="release-tags">
                          {release.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                          {release.tags.length > 4 && <span className="tag more">+{release.tags.length - 4}</span>}
                        </div>
                        <div className="release-actions">
                          <a href={release.url} target="_blank" rel="noopener noreferrer" className="button button-ghost button-sm">
                            Read official release →
                          </a>
                          <span className="source-credit">
                            Via{' '}
                            <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer">
                              Niagara Regional Police Service
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Local News CTA */}
        <section className="tracker-cta" style={{ marginTop: '3rem' }}>
          <div className="cta-card">
            <h3>Stay on top of Niagara news</h3>
            <p>
              In addition to police releases, we track local news from the St. Catharines Standard,
              Niagara This Week, Welland Tribune, and Niagara Falls Review. See the{' '}
              <NavLink to="/news">full local news</NavLink>{' '}roundup.
            </p>
            <NavLink to="/news" className="button button-primary">
              Browse local news
            </NavLink>
          </div>
        </section>
      </div>

      <style>{`
        .police-header .page-hero h1 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 1rem;
          max-width: 22ch;
          margin-left: auto;
          margin-right: auto;
        }
        .featured-release {
          background: linear-gradient(135deg, rgba(18, 214, 255, 0.06), rgba(156, 228, 193, 0.04));
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          margin-bottom: 2.5rem;
        }
        .featured-article {
          max-width: 800px;
        }
        .featured-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .badge-date {
          background: var(--primary);
          color: var(--bg);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
        }
        .news-source {
          color: var(--muted);
          font-size: 0.85rem;
        }
        .featured-headline {
          font-size: clamp(1.3rem, 2.5vw, 1.8rem);
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 1rem;
          color: var(--text-bright);
        }
        .featured-headline a {
          color: inherit;
          text-decoration: none;
        }
        .featured-headline a:hover {
          color: var(--primary);
        }
        .featured-details {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .news-municipality {
          color: var(--text);
          font-size: 0.95rem;
          font-weight: 600;
        }
        .news-type {
          color: var(--muted);
          font-size: 0.85rem;
        }
        .featured-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .featured-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .source-credit {
          color: var(--muted);
          font-size: 0.8rem;
        }
        .source-credit a {
          color: var(--primary);
        }
        .source-credit a:hover {
          text-decoration: underline;
        }
        .releases-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .release-card {
          background: var(--bg-card);
          border: 1px solid var(--panel-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color var(--transition-base), transform var(--transition-base);
        }
        .release-card:hover {
          border-color: var(--line-strong);
          transform: translateY(-1px);
        }
        .release-card-inner {
          display: flex;
          gap: 1.5rem;
          padding: 1.25rem 1.5rem;
        }
        .release-date-col {
          flex-shrink: 0;
          width: 100px;
        }
        .release-date {
          display: block;
          font-size: 0.75rem;
          color: var(--muted);
          text-align: center;
          padding: 0.5rem;
          background: var(--bg-soft);
          border-radius: var(--radius-sm);
          border: 1px solid var(--line);
        }
        .release-body {
          flex: 1;
          min-width: 0;
        }
        .release-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }
        .news-municipality {
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .release-headline {
          font-size: 1.05rem;
          font-weight: 600;
          line-height: 1.35;
          margin-bottom: 0.25rem;
        }
        .release-headline a {
          color: var(--text-bright);
          text-decoration: none;
        }
        .release-headline a:hover {
          color: var(--primary);
        }
        .release-type {
          color: var(--muted);
          font-size: 0.82rem;
          margin-bottom: 0.5rem;
        }
        .release-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }
        .release-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .news-municipality {
          color: var(--text);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .news-type {
          color: var(--muted);
          font-size: 0.85rem;
        }
        .news-source {
          color: var(--muted);
          font-size: 0.85rem;
        }
        @media (max-width: 600px) {
          .release-card-inner {
            flex-direction: column;
            gap: 0.75rem;
          }
          .release-date-col {
            width: 100%;
          }
          .release-date {
            display: inline-block;
            width: auto;
            text-align: left;
          }
        }
      `}</style>
    </>
  );
}
