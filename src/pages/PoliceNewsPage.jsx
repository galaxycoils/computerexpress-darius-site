import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { BASE_URL } from '../components/Seo'
import { nrpsReleases } from '../data/nrpsReleases'
import { siteConfig } from '../data/siteConfig'
import AnimatedSection from '../hooks/useInView'

export default function PoliceNewsPage() {
  const [search, setSearch] = useState('')
  const [municipalityFilter, setMunicipalityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const filteredReleases = useMemo(() => {
    let result = nrpsReleases

    if (search) {
      const s = search.toLowerCase()
      result = result.filter(r =>
        r.headline.toLowerCase().includes(s) ||
        r.municipality.toLowerCase().includes(s) ||
        r.tags.some(t => t.toLowerCase().includes(s)) ||
        r.type.toLowerCase().includes(s)
      )
    }
    if (municipalityFilter !== 'all') {
      const key = municipalityFilter.toLowerCase()
      result = result.filter(r =>
        r.municipality.toLowerCase().includes(key) ||
        r.municipality.split(',').some(m => m.trim().toLowerCase().includes(key))
      )
    }
    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter)
    }
    return result.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [search, municipalityFilter, categoryFilter])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return dateStr }
  }

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'break-and-enter', label: 'Break & Enter' },
    { key: 'child-safety', label: 'Child Safety' },
    { key: 'collision', label: 'Collisions' },
    { key: 'community-notification', label: 'Community Notifications' },
    { key: 'drug-investigation', label: 'Drug Investigations' },
    { key: 'drug-seizure', label: 'Drug Seizures' },
  ]

  const municipalities = [
    { key: 'all', label: 'All Municipalities' },
    { key: 'st-catharines', label: 'St. Catharines' },
    { key: 'welland', label: 'Welland' },
    { key: 'thorold', label: 'Thorold' },
    { key: 'region-wide', label: 'Region-wide' },
    { key: 'niagara-falls', label: 'Niagara Falls' },
    { key: 'niagara-region', label: 'Niagara Region' },
  ]

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
          founder: { '@type': 'Organization', name: 'St. Catharines Digital' },
          knowsAbout: ['Police Media Releases', 'Crime', 'Public Safety', 'Niagara Region', 'St. Catharines', 'Welland', 'Thorold'],
        }}
      />

      {/* Hero */}
      <section className="section-first">
        <div className="container">
          <AnimatedSection>
            <div style={{ maxWidth: '40rem' }}>
              <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
                Official NRPS Media Releases
              </p>
              <h1 style={{ marginBottom: '1.25rem' }}>Police Media Releases</h1>
              <p style={{ fontSize: 'var(--fs-md)', color: 'var(--muted)', maxWidth: '34rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Official Niagara Regional Police Service media releases and community
                notifications — compiled daily from niagarapolice.ca.
              </p>
              <div className="stats-bar">
                <div className="stat-item">
                  <div className="stat-value">{filteredReleases.length}</div>
                  <div className="stat-label">Releases</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{municipalities.length - 1}</div>
                  <div className="stat-label">Municipalities</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">NRPS</div>
                  <div className="stat-label">Source</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container">
          {/* Filters */}
          <section className="filters-section" style={{ marginBottom: '2.5rem' }} aria-label="Filter police releases">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="police-search" className="visually-hidden">Search police releases</label>
                <input
                  type="search" id="police-search"
                  className="filter-input filter-search"
                  placeholder="Search by headline, municipality, keyword…"
                  value={search} onChange={e => setSearch(e.target.value)}
                  aria-describedby="police-search-hint"
                />
                <span id="police-search-hint" className="visually-hidden">Search across headline, municipality, type, and tags</span>
              </div>
              <div className="filter-group">
                <label htmlFor="police-municipality" className="visually-hidden">Filter by municipality</label>
                <select id="police-municipality" className="filter-select" value={municipalityFilter} onChange={e => setMunicipalityFilter(e.target.value)}>
                  {municipalities.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="police-category" className="visually-hidden">Filter by category</label>
                <select id="police-category" className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              {(search || municipalityFilter !== 'all' || categoryFilter !== 'all') && (
                <button className="button button-ghost" onClick={() => { setSearch(''); setMunicipalityFilter('all'); setCategoryFilter('all'); }}>
                  Clear
                </button>
              )}
            </div>
          </section>

          {/* Latest / Featured Release */}
          {filteredReleases.length > 0 && (
            <AnimatedSection>
              <section className="featured-release" style={{ marginBottom: '2.5rem' }} aria-labelledby="featured-heading">
                <div className="container">
                  <h2 id="featured-heading" className="section-heading" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Latest release</h2>
                  <article style={{ background: 'var(--bg-card)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                    <div className="featured-meta">
                      <span className="badge badge-date">{formatDate(filteredReleases[0].date)}</span>
                      <span className="news-source">{filteredReleases[0].source}</span>
                    </div>
                    <h3 className="featured-headline">
                      <a href={filteredReleases[0].url} target="_blank" rel="noopener noreferrer">{filteredReleases[0].headline}</a>
                    </h3>
                    <div className="featured-details">
                      <span className="news-municipality">{filteredReleases[0].municipality}</span>
                      <span className="news-type">{filteredReleases[0].type}</span>
                    </div>
                    <div className="featured-tags">
                      {filteredReleases[0].tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <div className="featured-actions">
                      <a href={filteredReleases[0].url} target="_blank" rel="noopener noreferrer" className="button button-primary">Read official release</a>
                      <span className="source-credit">Source: <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer">niagarapolice.ca</a></span>
                    </div>
                  </article>
                </div>
              </section>
            </AnimatedSection>
          )}

          {/* All Releases */}
          <section className="news-list-section" aria-labelledby="releases-heading">
            <div className="container">
              <h2 id="releases-heading" className="section-heading" style={{ textAlign: 'left', marginBottom: '2rem' }}>All releases ({filteredReleases.length})</h2>

              {filteredReleases.length === 0 ? (
                <div className="state-container">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <h3>No releases match your filters</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                  <button className="button button-ghost" onClick={() => { setSearch(''); setMunicipalityFilter('all'); setCategoryFilter('all'); }}>Clear filters</button>
                </div>
              ) : (
                <div className="releases-list">
                  {filteredReleases.map(release => (
                    <article key={release.id} className="release-card">
                      <div className="release-card-inner">
                        <div className="release-date-col">
                          <time dateTime={release.date} className="release-date">{formatDate(release.date)}</time>
                        </div>
                        <div className="release-body">
                          <div className="release-meta">
                            <span className="badge" style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                              {release.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="news-municipality">{release.municipality}</span>
                          </div>
                          <h3 className="release-headline">
                            <a href={release.url} target="_blank" rel="noopener noreferrer">{release.headline}</a>
                          </h3>
                          <div className="release-tags">
                            {release.tags.slice(0, 4).map(tag => <span key={tag} className="tag">{tag}</span>)}
                            {release.tags.length > 4 && <span className="tag more">+{release.tags.length - 4}</span>}
                          </div>
                          <div className="release-actions">
                            <a href={release.url} target="_blank" rel="noopener noreferrer" className="button button-ghost button-sm">Read official release →</a>
                            <span className="source-credit">Via <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer">Niagara Regional Police Service</a></span>
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
          <section style={{ marginTop: '3rem' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Stay on top of Niagara news</h3>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                In addition to police releases, we track local news from the St. Catharines Standard,
                Niagara This Week, Welland Tribune, and Niagara Falls Review. See the{' '}
                <Link to="/news" style={{ color: 'var(--primary)' }}>full local news</Link> roundup.
              </p>
              <Link to="/news" className="button button-primary">Browse local news</Link>
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
