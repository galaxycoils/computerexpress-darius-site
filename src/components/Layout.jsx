import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  function closeMenu() { setMenuOpen(false) }

  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav">
          <Link className="brand" to="/" aria-label="St. Catharines Digital home">
            <img className="brand-logo" src="/logo-horizontal.svg" alt="St. Catharines Digital" width="180" height="32" />
          </Link>

          <button
            className={`nav-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', marginRight: '0.5rem', gap: '0.15rem' }}>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ border: 'none', background: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-bright)' }}
            >
              <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
            </button>
          </div>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <NavLink to="/council" onClick={closeMenu}>Council</NavLink>
            <NavLink to="/police" onClick={closeMenu}>Police</NavLink>
            <NavLink to="/planning-tracker" onClick={closeMenu}>Planning</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer footer-enhanced" role="contentinfo">
        <div className="container">
          <div className="footer-main" style={{ gridTemplateColumns: '1.4fr 1fr 1fr' }}>
            <div className="footer-col">
              <img className="footer-logo" src="/logo-horizontal.svg" alt="St. Catharines Digital" width="180" height="32" loading="lazy" />
              <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                Independent local news for St. Catharines, Welland and Thorold. Official sources only.
              </p>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Sections</span>
              <nav className="footer-col-links" aria-label="Sections">
                <Link to="/council">Council</Link>
                <Link to="/police">Police</Link>
                <Link to="/planning-tracker">Planning Tracker</Link>
                <Link to="/about">About</Link>
              </nav>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Official Sources</span>
              <nav className="footer-col-links" aria-label="Official sources">
                <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police</a>
                <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">City of St. Catharines</a>
                <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">City of Welland</a>
                <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">City of Thorold</a>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copyright">
              © {new Date().getFullYear()} St. Catharines Digital. Official sources only.
            </span>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
              <Link to="/privacy" style={{ color: 'var(--muted-lite)', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: 'var(--muted-lite)', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  )
}
