import { useState, useMemo, useEffect } from 'react';
import { localNews, localNewsCategories, localNewsSources, getRecentNews, getLatestNews, getNewsStats, getNewsByMunicipality } from '../data/localNews.js';
import { formatDate } from '../utils/dateUtils.js';

export default function NewsPage() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMunicipality, setFilterMunicipality] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [viewMode, setViewMode] = useState('card');
  const [loading, setLoading] = useState(false);

  const news = useMemo(() => {
    let filtered = localNews;

    if (filterCategory !== 'all') {
      filtered = filtered.filter(n => n.category === filterCategory);
    }

    if (filterMunicipality !== 'all') {
      filtered = filtered.filter(n =>
        n.municipality.toLowerCase().includes(filterMunicipality.toLowerCase())
      );
    }

    if (filterSource !== 'all') {
      filtered = filtered.filter(n => n.sourceId === filterSource);
    }

    return filtered.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }, [filterCategory, filterMunicipality, filterSource]);

  const stats = getNewsStats();
  const allMunicipalities = [...new Set(localNews.map(n => n.municipality))].sort();
  const activeSources = localNewsSources.filter(s => s.active);

  const categoryMap = Object.fromEntries(localNewsCategories.map(c => [c.key, c]));

  // Auto-refresh check (could be enhanced with WebSocket/SSE)
  useEffect(() => {
    const interval = setInterval(() => {
      // Could trigger a refetch or just notify user
      // For now, we'll rely on the daily cron job
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="news-page">
      <header className="page-header">
        <div className="container">
          <h1>Local News</h1>
          <p className="page-subtitle">
            Aggregated local reporting from Niagara's trusted news sources.
            Updated daily from official RSS feeds. Each article links to the original publisher.
          </p>
        </div>
      </header>

      <section className="stats-bar" aria-label="News statistics">
        <div className="container">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Articles Tracked</span>
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
            <span className="stat-value">{stats.sourcesActive}</span>
            <span className="stat-label">Active Sources</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.latestDate ? formatDate(stats.latestDate) : '—'}</span>
            <span className="stat-label">Latest Article</span>
          </div>
        </div>
      </section>

      <section className="filters-section" aria-label="Filter news">
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
                {localNewsCategories.map(cat => (
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

            <div className="filter-group">
              <label htmlFor="source-filter" className="visually-hidden">Filter by source</label>
              <select
                id="source-filter"
                value={filterSource}
                onChange={e => setFilterSource(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Sources</option>
                {activeSources.map(src => (
                  <option key={src.id} value={src.id}>{src.name}</option>
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

          {news.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="8" x2="14" y2="14"/></svg>
              <p>No articles match your current filters.</p>
              <button type="button" className="btn btn-secondary" onClick={() => { setFilterCategory('all'); setFilterMunicipality('all'); setFilterSource('all'); }}>Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="news-section" aria-label="Local news articles">
        <div className="container">
          {viewMode === 'card' ? (
            <div className="news-grid" role="list">
              {news.map(article => (
                <article key={article.id} className="news-card" role="listitem">
                  <div className="news-header">
                    <span className={`category-badge category-${article.category}`}>{categoryMap[article.category]?.label || article.category}</span>
                    <span className="news-source">{article.sourceName}</span>
                    <time className="news-date" dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
                  </div>
                  <h2 className="news-title">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                  </h2>
                  <p className="news-description">{article.description}</p>
                  <div className="news-meta">
                    <span className="news-municipality">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {article.municipality}
                    </span>
                  </div>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                    Read full article <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="news-table-wrapper" role="region" aria-label="News table" tabIndex={0}>
              <table className="news-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Headline</th>
                    <th scope="col">Source</th>
                    <th scope="col">Municipality</th>
                    <th scope="col">Category</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {news.map(article => (
                    <tr key={article.id}>
                      <td><time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time></td>
                      <td>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="table-link">{article.title}</a>
                      </td>
                      <td>{article.sourceName}</td>
                      <td>{article.municipality}</td>
                      <td><span className={`category-badge category-${article.category}`}>{categoryMap[article.category]?.label || article.category}</span></td>
                      <td>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline" aria-label={`Read full article: ${article.title}`}>Read</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {news.length > 0 && (
            <p className="results-count" aria-live="polite">
              Showing {news.length} of {localNews.length} articles
            </p>
          )}
        </div>
      </section>

      <footer className="page-footer-note">
        <div className="container">
          <h3>Sources</h3>
          <ul className="sources-list">
            {activeSources.map(src => (
              <li key={src.id}>
                <a href={src.baseUrl} target="_blank" rel="noopener noreferrer">{src.name}</a>
                <span className="source-municipality">({src.municipality})</span>
              </li>
            ))}
          </ul>
          <p><strong>Policy:</strong> Articles are aggregated from public RSS feeds. St. Catharines Digital links to original publishers — we do not reproduce full articles. Content belongs to respective publishers.</p>
        </div>
      </footer>
    </main>
  );
}