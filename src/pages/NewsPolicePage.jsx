import { useState, useMemo } from 'react';
import { nrpsReleases, nrpsCategories, getRecentReleases, getLatestReleases, getReleaseStats } from '../data/nrpsReleases.js';
import { formatDate } from '../utils/dateUtils.js';

export default function NewsPolicePage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMunicipality, setFilterMunicipality] = useState('all');
  const [viewMode, setViewMode] = useState('card');

  const releases = useMemo(() => {
    let filtered = nrpsReleases;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(r => r.category === filterCategory);
    }

    if (filterMunicipality !== 'all') {
      filtered = filtered.filter(r =>
        r.municipality.toLowerCase().includes(filterMunicipality.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filterCategory, filterMunicipality]);

  const stats = getReleaseStats();
  const allMunicipalities = [...new Set(nrpsReleases.map(r => r.municipality))].sort();

  const categoryMap = Object.fromEntries(nrpsCategories.map(c => [c.key, c]));

  return (
    <main className="news-police-page">
      <header className="page-header">
        <div className="container">
          <h1>Niagara Regional Police — Media Releases</h1>
          <p className="page-subtitle">
            Official media releases and community notifications from the Niagara Regional Police Service.
            Sourced exclusively from <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer">niagarapolice.ca</a>.
          </p>
        </div>
      </header>

      <section className="stats-bar" aria-label="Release statistics">
        <div className="container">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Releases Tracked</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.recent30Days}</span>
            <span className="stat-label">Last 30 Days</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Object.keys(stats.byMunicipality).length}</span>
            <span className="stat-label">Municipalities</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Object.keys(stats.byCategory).length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.latestDate ? formatDate(stats.latestDate) : '—'}</span>
            <span className="stat-label">Latest Release</span>
          </div>
        </div>
      </section>

      <section className="filters-section" aria-label="Filter releases">
        <div className="container">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="category-filter" className="visually-hidden">Filter by category</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {nrpsCategories.map(cat => (
                  <option key={cat.key} value={cat.key}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="municipality-filter" className="visually-hidden">Filter by municipality</label>
              <select
                id="municipality-filter"
                value={filterMunicipality}
                onChange={e => setFilterMunicipality(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Municipalities</option>
                {allMunicipalities.map(muni => (
                  <option key={muni} value={muni}>{muni}</option>
                ))}
              </select>
            </div>

            <div className="filter-group view-toggle">
              <button
                type="button"
                className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                onClick={() => setViewMode('card')}
                aria-pressed={viewMode === 'card'}
                aria-label="Card view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                aria-label="Table view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="3" x2="21" y2="3"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="3" x2="3" y2="21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="21" y1="3" x2="21" y2="21"/></svg>
              </button>
            </div>
          </div>

          {releases.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="8" x2="14" y2="14"/></svg>
              <p>No releases match your current filters.</p>
              <button type="button" className="btn btn-secondary" onClick={() => { setFilterCategory('all'); setFilterMunicipality('all'); }}>Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="releases-section" aria-label="NRPS media releases">
        <div className="container">
          {viewMode === 'card' ? (
            <div className="releases-grid" role="list">
              {releases.map(release => (
                <article key={release.id} className="release-card" role="listitem">
                  <div className="release-header">
                    <span className={`category-badge category-${release.category}`}>{categoryMap[release.category]?.label || release.category}</span>
                    <time className="release-date" dateTime={release.date}>{formatDate(release.date)}</time>
                  </div>
                  <h2 className="release-title">
                    <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer">{release.headline}</a>
                  </h2>
                  <p className="release-description">{release.description}</p>
                  <div className="release-meta">
                    <span className="release-municipality">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {release.municipality}
                    </span>
                    <span className="release-type">{release.type}</span>
                  </div>
                  <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer" className="release-link">
                    Read full release <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="releases-table-wrapper" role="region" aria-label="Releases table" tabIndex={0}>
              <table className="releases-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Headline</th>
                    <th scope="col">Municipality</th>
                    <th scope="col">Category</th>
                    <th scope="col">Type</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {releases.map(release => (
                    <tr key={release.id}>
                      <td><time dateTime={release.date}>{formatDate(release.date)}</time></td>
                      <td>
                        <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer" className="table-link">{release.headline}</a>
                      </td>
                      <td>{release.municipality}</td>
                      <td><span className={`category-badge category-${release.category}`}>{categoryMap[release.category]?.label || release.category}</span></td>
                      <td>{release.type}</td>
                      <td>
                        <a href={release.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" aria-label={`Read full release: ${release.headline}`}>Read</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {releases.length > 0 && (
            <p className="results-count" aria-live="polite">
              Showing {releases.length} of {nrpsReleases.length} releases
            </p>
          )}
        </div>
      </section>

      <footer className="page-footer-note">
        <div className="container">
          <p><strong>Source:</strong> All releases sourced from the official Niagara Regional Police Service media releases page at <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer">niagarapolice.ca/news/posts/</a>.</p>
          <p><strong>Policy:</strong> St. Catharines Digital only reports information that police have officially released. No secondary sources, no maps/lists of individuals, no speculation.</p>
        </div>
      </footer>
    </main>
  );
}