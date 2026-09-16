import { useSearchParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { planningNotices } from '../data/planningNotices'
import './reader-services.css'

const CITIES = [
  ['St. Catharines','/news/st-catharines'],
  ['Welland','/news/welland'],
  ['Thorold','/news/thorold'],
  ['Niagara Falls','/news/niagara-falls'],
]

function formatDate(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year,month]=value.split('-').map(Number)
    return new Date(Date.UTC(year,month-1,1)).toLocaleDateString('en-CA',{month:'long',year:'numeric',timeZone:'UTC'})
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-CA', { month:'short', day:'numeric', year:'numeric', timeZone:'UTC' })
  }
  const date=new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric',timeZone:'America/Toronto'})
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const query=(params.get('q')||'').trim()
  const normalized=query.toLowerCase()
  const results=normalized ? planningNotices.filter(item=>[
    item.title,item.description,item.municipality,item.type,item.status,item.fileNumber,...(item.tags||[])
  ].filter(Boolean).join(' ').toLowerCase().includes(normalized)) : []

  return <>
    <Seo title={query ? `Search: ${query} | St. Catharines Digital` : 'Search | St. Catharines Digital'} description="Search local news, planning records and civic information across Niagara." path="/search" />
    <div className="scd-page scd-search-page">
      <header className="scd-services-hero"><p className="scd-eyebrow">Find local coverage</p><h1>Search</h1><p>Search source-linked municipal records by address, subject, city, file number or status.</p></header>
      <form className="scd-search-form" action="/search" method="get" role="search">
        <label htmlFor="site-search">Search St. Catharines Digital</label>
        <div><input id="site-search" name="q" type="search" defaultValue={query} placeholder="Try an address, city or topic" autoComplete="off" /><button type="submit">Search</button></div>
      </form>
      {!query && <section className="scd-search-start"><h2>Browse by city</h2><div className="scd-city-pills">{CITIES.map(([label,to])=><Link key={to} to={to}>{label}<span aria-hidden="true">→</span></Link>)}</div><p>Popular topics: council, minor variance, road closure, zoning, public meeting and construction.</p></section>}
      {query && <section aria-live="polite" aria-labelledby="results-heading"><div className="scd-search-results-heading"><h2 id="results-heading">{results.length} {results.length===1?'result':'results'} for “{query}”</h2><Link to="/search">Clear search</Link></div>
        {results.length ? <div className="scd-search-results">{results.map(item=><article key={item.id}><div className="scd-record-meta"><span>{item.municipality}</span><time dateTime={item.publishedDate}>{formatDate(item.publishedDate)}</time></div><h3><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">{item.title}</a></h3><p>{item.description}</p><div className="scd-search-result-footer"><span>{item.type}</span><span>{item.status}</span>{item.fileNumber&&<span>File {item.fileNumber}</span>}</div></article>)}</div> : <div className="scd-search-empty"><h3>No matching records</h3><p>Try a city, street name, file number or broader topic.</p><Link to="/planning-tracker">Browse the Planning Tracker →</Link></div>}
      </section>}
    </div>
  </>
}
