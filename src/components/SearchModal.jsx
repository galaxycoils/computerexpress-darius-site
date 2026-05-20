import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const searchIndex = [
  {
    title: 'Home',
    desc: 'St. Catharines Digital builds premium websites, technical SEO systems, and local growth engines for service businesses.',
    path: '/',
    keywords: ['home', 'main', 'landing', 'st catharines', 'agency']
  },
  {
    title: 'Services & Pricing',
    desc: 'Explore our core packages (Launch, Growth, Local Authority) and local service business digital strategy pricing.',
    path: '/services',
    keywords: ['pricing', 'packages', 'cost', 'plans', 'rates', 'services']
  },
  {
    title: 'Web Design for Plumbers',
    desc: 'Plumbing websites built to rank on Google Maps, showcase your services, and convert visitors into calls.',
    path: '/services/web-design-for-plumbers',
    keywords: ['plumber', 'plumbing', 'drain', 'water heater', 'leak']
  },
  {
    title: 'Web Design for HVAC Companies',
    desc: 'HVAC websites built for local search dominance. Rank for AC repair, furnace installation, and maintenance terms.',
    path: '/services/web-design-for-hvac',
    keywords: ['hvac', 'ac repair', 'air conditioning', 'furnace', 'heating']
  },
  {
    title: 'Web Design for Electricians',
    desc: 'Professional electrician websites that rank on Google and convert local service traffic into booked jobs.',
    path: '/services/web-design-for-electricians',
    keywords: ['electrician', 'electrical', 'wire', 'panel', 'breaker']
  },
  {
    title: 'Local SEO for Service Businesses',
    desc: 'Dominate local maps and search pack ranking for your service area. Get found by regional customers.',
    path: '/services/local-seo-for-service-businesses',
    keywords: ['local seo', 'maps pack', 'ranking', 'regional', 'citations']
  },
  {
    title: 'Custom Website Design Service',
    desc: 'Learn about our bespoke React web development featuring sub-second speed, schema markup, and responsiveness.',
    path: '/services/website-design',
    keywords: ['website design', 'web development', 'speed', 'react', 'vite']
  },
  {
    title: 'Technical SEO Audit & Setup',
    desc: 'Optimize site speed, schema structure, Core Web Vitals, and crawl settings so Google indexes your pages first.',
    path: '/services/technical-seo',
    keywords: ['technical seo', 'schema', 'page speed', 'audit', 'core web vitals']
  },
  {
    title: 'Google Business Profile Optimization',
    desc: 'Increase reviews, optimize categories, and maintain weekly posts to claim the top spots in local Google Maps.',
    path: '/services/gbp-optimization',
    keywords: ['google business profile', 'gbp', 'google maps', 'reviews', 'local pack']
  },
  {
    title: 'About St. Catharines Digital',
    desc: 'We are a local web design and SEO agency combining modern design, technical SEO, and AI-driven growth systems.',
    path: '/about',
    keywords: ['about', 'agency', 'team', 'who we are', 'location', 'local']
  },
  {
    title: 'What to Expect — Our Timeline',
    desc: 'Our structured 4-week roadmap (Audit → Strategy → Build → Launch), customer commitments, and guarantee details.',
    path: '/what-to-expect',
    keywords: ['what to expect', 'timeline', 'process', 'weeks', 'guarantee', 'refund']
  },
  {
    title: 'Contact Us & Free Audit Request',
    desc: 'Get in touch for custom website services, book a free 30-minute discovery call, or submit an SEO audit request.',
    path: '/contact',
    keywords: ['contact', 'email', 'phone', 'calendly', 'audit', 'message', 'help']
  },
  {
    title: 'Blog & Local Marketing Insights',
    desc: 'Explore our latest guides, checklists, and articles on local SEO, speed, and lead conversion.',
    path: '/blog',
    keywords: ['blog', 'articles', 'tips', 'guides', 'news', 'insights']
  },
  {
    title: 'Blog: The Complete Local SEO Checklist for 2026',
    desc: 'Step-by-step checklist covering GBP settings, local keyword signaling, NAP consistency, and citation links.',
    path: '/blog/local-seo-checklist-2026',
    keywords: ['local seo checklist', 'gbp setup', 'nap consistency', 'reviews']
  },
  {
    title: 'Blog: How to Get More Leads from Your Website',
    desc: '7 proven conversion rate optimization (CRO) strategies including clear value propositions and CTA placements.',
    path: '/blog/how-to-get-more-leads-from-website',
    keywords: ['cro', 'conversion rate', 'leads', 'calls to action', 'social proof']
  },
  {
    title: 'Blog: Technical SEO Explained',
    desc: 'Understanding Core Web Vitals (LCP, CLS, INP), schema structured data markup, and mobile indexing rules.',
    path: '/blog/technical-seo-explained',
    keywords: ['technical seo', 'core web vitals', 'schema markup', 'indexing', 'speed']
  }
]

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    inputRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    };
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setActiveIndex(0)
      return
    }

    const cleanQuery = query.toLowerCase().trim()
    const matches = searchIndex.filter(item => 
      item.title.toLowerCase().includes(cleanQuery) ||
      item.desc.toLowerCase().includes(cleanQuery) ||
      item.keywords.some(k => k.includes(cleanQuery))
    )

    setResults(matches)
    setActiveIndex(0)
  }, [query])

  const handleKeyDown = (e) => {
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(results[activeIndex].path)
    }
  }

  function handleSelect(path) {
    navigate(path)
    onClose()
  }

  return (
    <div className="search-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Site Search">
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <header className="search-modal-header">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search services, blog posts, guidelines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="search-results-list"
          />
          <kbd className="search-modal-kbd">ESC</kbd>
        </header>

        <main className="search-modal-results">
          {query && results.length === 0 ? (
            <div className="search-no-results">
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <p>No results found for "<strong>{query}</strong>"</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Try searching for "SEO", "speed", "pricing", or "plumber".</p>
            </div>
          ) : query ? (
            <ul id="search-results-list" role="listbox" aria-label="Search results">
              {results.map((item, idx) => (
                <li
                  key={item.path}
                  id={`search-result-item-${idx}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  className={`search-result-item ${idx === activeIndex ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item.path)}
                >
                  <div className="search-item-header">
                    <span className="search-item-title">{item.title}</span>
                    <span className="search-item-path">{item.path}</span>
                  </div>
                  <p className="search-item-desc">{item.desc}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-prompt">
              <h3>Popular searches</h3>
              <div className="search-prompt-tags">
                {['pricing', 'SEO', 'plumber', 'HVAC', 'about', 'what to expect'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="search-prompt-tag"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
