import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/council', label: 'Council' },
  { to: '/police', label: 'Police' },
  { to: '/planning-tracker', label: 'Planning' },
  { to: '/about', label: 'About' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className="page-shell news-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className={`news-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="news-header-inner">
          <Link to="/" className="news-brand" aria-label="St. Catharines Digital home">
            <img src="/logo-horizontal.svg" alt="St. Catharines Digital" width="200" height="38" />
          </Link>

          <nav className="news-nav desktop-nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'news-nav-link is-active' : 'news-nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="news-header-actions">
            <button
              type="button"
              className="news-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            <button
              type="button"
              className={`news-menu-btn ${menuOpen ? 'is-open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="news-mobile-nav" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'news-mobile-link is-active' : 'news-mobile-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="news-footer">
        <div className="news-footer-inner">
          <div className="news-footer-brand">
            <img src="/logo-horizontal.svg" alt="St. Catharines Digital" width="180" height="34" loading="lazy" />
            <p>Independent local news for St. Catharines, Welland and Thorold. Official sources only.</p>
          </div>

          <div className="news-footer-col">
            <span className="news-footer-heading">Sections</span>
            <Link to="/council">Council</Link>
            <Link to="/police">Police</Link>
            <Link to="/planning-tracker">Planning</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="news-footer-col">
            <span className="news-footer-heading">Official Sources</span>
            <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police</a>
            <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">City of St. Catharines</a>
            <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">City of Welland</a>
            <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">City of Thorold</a>
          </div>
        </div>

        <div className="news-footer-bottom">
          <span>© {new Date().getFullYear()} St. Catharines Digital</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>

      <style>{`
        .news-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .news-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: color-mix(in srgb, var(--bg, #0a0b0f) 88%, transparent);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border, #1c1f28);
        }

        .news-header.is-scrolled {
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }

        .news-header-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 58px;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .news-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .news-brand img {
          height: 30px;
          width: auto;
          display: block;
        }

        .news-nav {
          display: none;
          align-items: center;
          gap: 0.15rem;
          margin-left: 1.5rem;
        }

        .news-nav-link {
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted, #8b93a7);
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }

        .news-nav-link:hover {
          color: var(--text-bright, #e8eaef);
          background: rgba(255,255,255,0.04);
        }

        .news-nav-link.is-active {
          color: var(--text-bright, #e8eaef);
          background: rgba(59,130,246,0.12);
        }

        .news-header-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .news-theme-btn {
          border: none;
          background: transparent;
          color: var(--text-muted, #8b93a7);
          font-size: 1rem;
          padding: 0.4rem 0.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .news-theme-btn:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-bright, #e8eaef);
        }

        .news-menu-btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 10px;
        }

        .news-menu-btn span {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--text-bright, #e8eaef);
          border-radius: 1px;
          transition: transform 0.2s, opacity 0.2s;
        }

        .news-menu-btn.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .news-menu-btn.is-open span:nth-child(2) {
          opacity: 0;
        }
        .news-menu-btn.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .news-mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1.25rem 1rem;
          border-top: 1px solid var(--border, #1c1f28);
          background: var(--bg, #0a0b0f);
        }

        .news-mobile-link {
          padding: 0.85rem 0.25rem;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-muted, #8b93a7);
          text-decoration: none;
          border-bottom: 1px solid var(--border, #1c1f28);
        }

        .news-mobile-link.is-active {
          color: var(--text-bright, #e8eaef);
        }

        .news-footer {
          margin-top: auto;
          border-top: 1px solid var(--border, #1c1f28);
          padding: 2.5rem 0 1.5rem;
        }

        .news-footer-inner {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.25rem;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 2rem;
        }

        .news-footer-brand p {
          margin-top: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-muted, #8b93a7);
          line-height: 1.5;
          max-width: 22rem;
        }

        .news-footer-brand img {
          height: 28px;
          width: auto;
        }

        .news-footer-heading {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted, #8b93a7);
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .news-footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .news-footer-col a {
          font-size: 0.9rem;
          color: var(--text-muted, #8b93a7);
          text-decoration: none;
        }

        .news-footer-col a:hover {
          color: var(--text-bright, #e8eaef);
        }

        .news-footer-bottom {
          max-width: 1120px;
          margin: 2rem auto 0;
          padding: 1.25rem 1.25rem 0;
          border-top: 1px solid var(--border, #1c1f28);
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-muted, #8b93a7);
        }

        .news-footer-bottom a {
          color: var(--text-muted, #8b93a7);
          text-decoration: none;
          margin-left: 1rem;
        }

        @media (min-width: 860px) {
          .news-nav {
            display: flex;
          }
          .news-menu-btn {
            display: none;
          }
        }

        @media (max-width: 859px) {
          .news-footer-inner {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .news-footer-bottom {
            flex-direction: column;
          }
        }

        /* Hide leftover old marketing chrome if any CSS still injects it */
        .site-header .nav-links > a[href*="services"],
        .site-header .nav-links > a[href*="partner"],
        .site-header .nav-links > a[href*="what-to-expect"],
        .site-header .nav-links > a[href*="free-audit"],
        .site-header .nav-phone,
        .site-header .button {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
