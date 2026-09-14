import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

const SECTIONS = [
  { to: '/news', label: 'News' },
  { to: '/council', label: 'Council' },
  { to: '/planning-tracker', label: 'Development' },
  { to: '/votes', label: 'Votes' },
  { to: '/police', label: 'Police' },
]

const CITIES = [
  { to: '/news/st-catharines', label: 'St. Catharines' },
  { to: '/news/welland', label: 'Welland' },
  { to: '/news/thorold', label: 'Thorold' },
  { to: '/news/niagara-falls', label: 'Niagara Falls' },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('theme-v2')
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* Storage can be disabled by the browser. */ }
  return 'light'
}

function formatDateline() {
  return new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function Navigation({ onNavigate }) {
  return (
    <>
      <div className="scd-nav-group">
        {SECTIONS.map((item) => <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => isActive ? 'scd-nav-a active' : 'scd-nav-a'}>{item.label}</NavLink>)}
      </div>
      <div className="scd-nav-group scd-city-nav">
        <span className="scd-city-nav-label">Cities</span>
        {CITIES.map((item) => <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => isActive ? 'scd-nav-a active' : 'scd-nav-a'}>{item.label}</NavLink>)}
      </div>
    </>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()
  const menuButton = useRef(null)

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.body.classList.add('news-mode')
    try { localStorage.setItem('theme-v2', theme) } catch { /* Storage can be disabled by the browser. */ }
  }, [theme])

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event) => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus() } }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const toggleTheme = useCallback(() => setTheme((value) => value === 'dark' ? 'light' : 'dark'), [])

  return (
    <div className={`news-root ${theme === 'light' ? 'is-light' : 'is-dark'}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className={`scd-h ${menuOpen ? 'is-menu-open' : ''}`}>
        <div className="scd-mast">
          <div className="scd-mast-top">
            <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
              <span className="scd-brand-name">St. Catharines <em>Digital</em></span>
              <span className="scd-brand-tag">Independent local reporting for Niagara</span>
            </Link>
            <div className="scd-h-tools">
              <p className="scd-dateline" suppressHydrationWarning>{formatDateline()}</p>
              <Link to="/planning-alerts" className="scd-header-link">Get local alerts</Link>
              <button type="button" className="scd-theme" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>{theme === 'dark' ? '☀' : '☾'}</button>
              <button type="button" className="scd-burger" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" ref={menuButton}>
                {menuOpen ? <span className="scd-burger-x" aria-hidden="true">×</span> : <><span /><span /><span /></>}
              </button>
            </div>
          </div>
          <nav className="scd-nav-row scd-nav-desktop" aria-label="Primary"><Navigation /></nav>
        </div>
        {menuOpen && <nav id="mobile-navigation" className="scd-drawer" aria-label="Mobile navigation"><Navigation onNavigate={() => setMenuOpen(false)} /></nav>}
      </header>
      <main id="main-content" className="scd-main"><Outlet /></main>
      <footer className="scd-f scd-f-dark">
        <div className="scd-f-grid">
          <div><div className="scd-f-name">St. Catharines Digital</div><p>Independent local coverage for St. Catharines, Welland, Thorold and Niagara Falls. Every civic record links to its primary source.</p></div>
          <div><div className="scd-f-label">Coverage</div><Link to="/news">Latest news</Link><Link to="/council">Council</Link><Link to="/planning-tracker">Development</Link><Link to="/votes">Votes</Link><Link to="/police">Police</Link></div>
          <div><div className="scd-f-label">Reader services</div><Link to="/planning-alerts">Planning alerts</Link><Link to="/membership">Support the newsroom</Link><Link to="/sponsor">Sponsor</Link><Link to="/about">About</Link><Link to="/editorial-policy">Editorial policy</Link><Link to="/corrections">Corrections</Link></div>
          <div><div className="scd-f-label">Official sources</div><a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">St. Catharines</a><a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">Welland</a><a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">Thorold</a><a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police</a></div>
        </div>
        <div className="scd-f-bottom"><span>© {new Date().getFullYear()} St. Catharines Digital</span><div className="scd-legal-links"><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
      </footer>
    </div>
  )
}
