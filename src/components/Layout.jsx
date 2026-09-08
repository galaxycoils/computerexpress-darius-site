import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/council', label: 'Council' },
  { to: '/police', label: 'Police' },
  { to: '/planning-tracker', label: 'Planning' },
  { to: '/about', label: 'About' },
]

const NEWS_DROPDOWN = [
  { to: '/news/st-catharines', label: 'St. Catharines' },
  { to: '/news/welland', label: 'Welland' },
  { to: '/news/thorold', label: 'Thorold' },
  { to: '/news/police', label: 'Police Releases' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [newsDropdown, setNewsDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.body.classList.add('news-mode')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    setMenuOpen(false)
    setNewsDropdown(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className={`news-root ${theme === 'light' ? 'is-light' : 'is-dark'}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className={`scd-h ${scrolled ? 'scrolled' : ''}`}>
        <div className="scd-h-inner">
          <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
            <svg width="180" height="24" viewBox="0 0 400 52" fill="none" aria-hidden="true">
              <path d="M8 26 L20 6 L32 26 L20 46 Z" fill="#c9a06a" />
              <path d="M8 26 L20 16 L32 26 L20 36 Z" fill="#fff" fillOpacity="0.2" />
              <text
                x="42"
                y="33"
                fill="currentColor"
                fontFamily="IBM Plex Sans, system-ui, sans-serif"
                fontSize="18"
                fontWeight="700"
                letterSpacing="-0.3"
              >
                St. Catharines Digital
              </text>
            </svg>
          </Link>

          <nav className="scd-nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'scd-a active' : 'scd-a')}
              >
                {item.label}
              </NavLink>
            ))}
            <div className="scd-dropdown">
              <button
                type="button"
                className={`scd-a ${newsDropdown ? 'active' : ''}`}
                onClick={() => setNewsDropdown((v) => !v)}
                aria-expanded={newsDropdown}
                aria-haspopup="true"
              >
                News ▾
              </button>
              {newsDropdown && (
                <div className="scd-dropdown-menu" role="menu">
                  {NEWS_DROPDOWN.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      onClick={() => setNewsDropdown(false)}
                      className="scd-dropdown-item"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="scd-right">
            <button type="button" className="scd-theme" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button
              type="button"
              className={`scd-burger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="scd-drawer" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
              >
                {item.label}
              </NavLink>
            ))}
            <p className="scd-drawer-label">News by city</p>
            {NEWS_DROPDOWN.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content" className="scd-main">
        <Outlet />
      </main>

      <footer className="scd-f">
        <div className="scd-f-grid">
          <div>
            <div className="scd-f-name">St. Catharines Digital</div>
            <p>
              Independent local news for St. Catharines, Welland & Thorold. Official sources
              only.
            </p>
          </div>
          <div>
            <div className="scd-f-label">Sections</div>
            <Link to="/council">Council</Link>
            <Link to="/police">Police</Link>
            <Link to="/planning-tracker">Planning</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <div className="scd-f-label">News</div>
            <Link to="/news/st-catharines">St. Catharines</Link>
            <Link to="/news/welland">Welland</Link>
            <Link to="/news/thorold">Thorold</Link>
            <Link to="/news/police">Police Releases</Link>
          </div>
          <div>
            <div className="scd-f-label">Official Sources</div>
            <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">
              Niagara Regional Police
            </a>
            <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">
              City of St. Catharines
            </a>
            <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">
              City of Welland
            </a>
            <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">
              City of Thorold
            </a>
          </div>
        </div>
        <div className="scd-f-bottom">
          <span>© {new Date().getFullYear()} St. Catharines Digital</span>
          <span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
