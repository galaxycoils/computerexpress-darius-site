import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import { nrpsReleases } from '../data/nrpsReleases'
import { siteConfig } from '../data/siteConfig'
import AnimatedSection from '../hooks/useInView'
import { parseTorontoDate } from '../utils/renderClock.js'

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
      const d = parseTorontoDate(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
          ? 'UTC'
          : 'America/Toronto',
      })
    } catch { return dateStr }
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    try {
      const d = parseTorontoDate(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateStr)
          ? 'America/Toronto'
          : 'UTC',
      })
    } catch { return dateStr }
  }

  const renderEnhancedRelease = (release) => {
    const hasEnhanced = release.charges || release.victim || release.suspects_outstanding || release.court || release.contact || release.updates
    if (!hasEnhanced) return null

    return (
      <div className="enhanced-release-detail" style={{
        marginTop: '1.5rem',
        padding: '1.5rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '4px solid var(--primary)'
      }}>
        {/* Incident details */}
        {(release.incident_date || release.published || release.location) && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Incident Details</h4>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: 'var(--fs-sm)' }}>
              {release.incident_date && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Incident date/time:</dt>
                  <dd style={{ margin: 0 }}>{formatDateTime(release.incident_date)}</dd>
                </>
              )}
              {release.published && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Originally published:</dt>
                  <dd style={{ margin: 0 }}>{formatDate(release.published)}</dd>
                </>
              )}
              {release.location?.text && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Location:</dt>
                  <dd style={{ margin: 0 }}>{release.location.text}</dd>
                </>
              )}
              {release.nrps_incident_number && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>NRPS incident #:</dt>
                  <dd style={{ margin: 0, fontFamily: 'monospace' }}>{release.nrps_incident_number}</dd>
                </>
              )}
            </dl>
          </section>
        )}

        {/* Victim */}
        {release.victim && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Victim</h4>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: 'var(--fs-sm)' }}>
              <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Age:</dt>
              <dd style={{ margin: 0 }}>{release.victim.age}</dd>
              <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>City:</dt>
              <dd style={{ margin: 0 }}>{release.victim.city}</dd>
              <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Injuries:</dt>
              <dd style={{ margin: 0 }}>{release.victim.injuries}</dd>
              <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Transported to:</dt>
              <dd style={{ margin: 0 }}>{release.victim.transported}</dd>
            </dl>
          </section>
        )}

        {/* Charges */}
        {release.charges && release.charges.length > 0 && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Charges</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {release.charges.map((charge, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600 }}>{charge.name}</div>
                  <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', marginTop: '0.5rem', fontSize: 'var(--fs-sm)' }}>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Accused:</dt>
                    <dd style={{ margin: 0 }}>{charge.accused}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Age:</dt>
                    <dd style={{ margin: 0 }}>{charge.age}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>City:</dt>
                    <dd style={{ margin: 0 }}>{charge.city}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Status:</dt>
                    <dd style={{ margin: 0 }}><span className="badge" style={{ background: 'var(--danger)', color: '#fff', fontSize: 'var(--fs-xs)' }}>{charge.status}</span></dd>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Suspects Outstanding */}
        {release.suspects_outstanding && release.suspects_outstanding.length > 0 && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--danger)' }}>Suspect(s) Outstanding — Public Assistance Requested</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {release.suspects_outstanding.map((suspect, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                  <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', fontSize: 'var(--fs-sm)' }}>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Sex:</dt>
                    <dd style={{ margin: 0 }}>{suspect.sex}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Race:</dt>
                    <dd style={{ margin: 0 }}>{suspect.race}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Age range:</dt>
                    <dd style={{ margin: 0 }}>{suspect.age_range}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Height:</dt>
                    <dd style={{ margin: 0 }}>{suspect.height}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Weight:</dt>
                    <dd style={{ margin: 0 }}>{suspect.weight}</dd>
                    <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Clothing:</dt>
                    <dd style={{ margin: 0 }}>{suspect.clothing}</dd>
                    {suspect.possible_name && (
                      <>
                        <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Possible name:</dt>
                        <dd style={{ margin: 0, fontWeight: 500 }}>{suspect.possible_name}</dd>
                      </>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Flags */}
        {(release.hate_motivated_investigation || release.edi_engaged_with_victim) && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Investigation Notes</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {release.hate_motivated_investigation && (
                <li style={{ padding: '0.35rem 0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', fontSize: 'var(--fs-xs)', color: 'var(--danger)' }}>
                  Hate-motivated investigation underway
                </li>
              )}
              {release.edi_engaged_with_victim && (
                <li style={{ padding: '0.35rem 0.75rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '999px', fontSize: 'var(--fs-xs)', color: 'var(--primary)' }}>
                  EDIU engaged with victim
                </li>
              )}
            </ul>
          </section>
        )}

        {/* Court */}
        {release.court && release.court.length > 0 && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Court Proceedings</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {release.court.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600 }}>{item.label}</div>
                  <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem', marginTop: '0.5rem', fontSize: 'var(--fs-sm)' }}>
                    {item.date && (
                      <>
                        <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Date:</dt>
                        <dd style={{ margin: 0 }}>{formatDate(item.date)}</dd>
                      </>
                    )}
                    {item.venue && (
                      <>
                        <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Venue:</dt>
                        <dd style={{ margin: 0 }}>{item.venue}</dd>
                      </>
                    )}
                    {item.address && (
                      <>
                        <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Address:</dt>
                        <dd style={{ margin: 0 }}>{item.address}</dd>
                      </>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Contact */}
        {release.contact && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Contact Information</h4>
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: 'var(--fs-sm)' }}>
              {release.contact.unit && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Unit:</dt>
                  <dd style={{ margin: 0 }}>{release.contact.unit}</dd>
                </>
              )}
              {release.contact.phone && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Phone:</dt>
                  <dd style={{ margin: 0 }}>{release.contact.phone}{release.contact.ext && ` x${release.contact.ext}`}</dd>
                </>
              )}
              {release.contact.anonymous && (
                <>
                  <dt style={{ color: 'var(--muted)', fontWeight: 500 }}>Anonymous tips:</dt>
                  <dd style={{ margin: 0 }}>{release.contact.anonymous}</dd>
                </>
              )}
            </dl>
          </section>
        )}

        {/* Updates */}
        {release.updates && release.updates.length > 0 && (
          <section className="enhanced-section" style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Updates</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {release.updates.map((update, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-date" style={{ fontSize: 'var(--fs-xs)' }}>{update.label}</span>
                    {update.date && <time dateTime={update.date} style={{ fontSize: 'var(--fs-sm)', color: 'var(--muted)' }}>{formatDate(update.date)}</time>}
                  </div>
                  <p style={{ margin: 0, fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>{update.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Source links */}
        {(release.source_url || release.update_url) && (
          <section className="enhanced-section" style={{ marginBottom: 0 }}>
            <h4 style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--primary)' }}>Sources</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {release.source_url && (
                <a href={release.source_url} target="_blank" rel="noopener noreferrer" className="button button-ghost button-sm">
                  Original release
                </a>
              )}
              {release.update_url && release.update_url !== release.source_url && (
                <a href={release.update_url} target="_blank" rel="noopener noreferrer" className="button button-primary button-sm">
                  Latest update
                </a>
              )}
              <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer" className="button button-ghost button-sm">
                All NRPS releases
              </a>
            </div>
          </section>
        )}
      </div>
    )
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
        description="A sourced selection of Niagara Regional Police Service media releases and community notifications. Check the official NRPS feed for the latest posts."
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
            <nav className="scd-article-crumb" aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Police Media Releases</span>
            </nav>
            <div style={{ maxWidth: '40rem' }}>
              <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
                Official NRPS Media Releases
              </p>
              <h1 style={{ marginBottom: '1.25rem' }}>Police Media Releases</h1>
              <p style={{ fontSize: 'var(--fs-md)', color: 'var(--muted)', maxWidth: '34rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                A sourced selection of Niagara Regional Police Service media releases and community
                notifications. <a href="https://www.niagarapolice.ca/news/">Check the official NRPS feed for the latest posts.</a>
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
                  {municipalities.map(m => <option key={m.key} value={m.key === 'all' ? 'all' : m.label.toLowerCase()}>{m.label}</option>)}
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
                      <span className="badge badge-date">{formatDate(filteredReleases[0].published || filteredReleases[0].date)}</span>
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
                    {renderEnhancedRelease(filteredReleases[0])}
                    <div className="featured-actions">
                      {filteredReleases[0].unverified ? (
                        <span className="unverified-badge" style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: '999px',
                          fontSize: 'var(--fs-xs)',
                          color: 'var(--danger)',
                          fontWeight: 500
                        }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Source link not verified — no official NRPS page found
                        </span>
                      ) : (
                        <a href={filteredReleases[0].url} target="_blank" rel="noopener noreferrer" className="button button-primary">Read official release</a>
                      )}
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
                          {renderEnhancedRelease(release)}
                          <div className="release-actions">
                            {release.unverified ? (
                              <span className="unverified-badge" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.35rem 0.75rem',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '999px',
                                fontSize: 'var(--fs-xs)',
                                color: 'var(--danger)',
                                fontWeight: 500
                              }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                Source link not verified — no official NRPS page found
                              </span>
                            ) : (
                              <a href={release.url} target="_blank" rel="noopener noreferrer" className="button button-ghost button-sm">Read official release →</a>
                            )}
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
