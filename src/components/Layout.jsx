import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme-v2')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

const NAV = [
  { to: '/', label: 'News', end: true },
  { to: '/council', label: 'Council' },
  { to: '/planning-tracker', label: 'Planning' },
  { to: '/police', label: 'Crime' },
  { to: '/about', label: 'About' },
]

const CITY_LINKS = [
  { to: '/news/st-catharines', label: 'St. Catharines' },
  { to: '/news/welland', label: 'Welland' },
  { to: '/news/thorold', label: 'Thorold' },
]

const DESK_LINKS = [
  { to: '/news/st-catharines', label: 'St. Catharines desk' },
  { to: '/news/welland', label: 'Welland desk' },
  { to: '/news/thorold', label: 'Thorold desk' },
]

function formatDateline() {
  return new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function MobileDrawer({ onClose }) {
  return (
    <nav className="scd-drawer" aria-label="Mobile navigation">
      {NAV.map((item) => (
        <NavLink
          key={item.to + item.label}
          to={item.to}
          end={item.end}
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
        >
          {item.label}
        </NavLink>
      ))}
      {CITY_LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
        >
          {item.label}
        </NavLink>
      ))}
      {DESK_LINKS.map((item) => (
        <NavLink
          key={'desk-' + item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.body.classList.add('news-mode')
    localStorage.setItem('theme-v2', theme)
  }, [theme])

  useEffect(() => {
    setMenuOpen(false)
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

      <header className={`scd-h ${menuOpen ? 'is-menu-open' : ''}`}>
        <div className="scd-mast">
          <p className="scd-dateline" suppressHydrationWarning>
            {formatDateline()}
          </p>
          <div className="scd-mast-top">
            <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
              <span className="scd-brand-name">St. Catharines Digital</span>
              <span className="scd-brand-tag">Local news for Niagara</span>
            </Link>
            <div className="scd-h-tools">
              <button type="button" className="scd-theme" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? '☀' : '☾'}
              </button>
              <button
                type="button"
                className={`scd-burger ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <span className="scd-burger-x" aria-hidden="true">
                    ×
                  </span>
                ) : (
                  <>
                    <span />
                    <span />
                    <span />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop nav — hidden on mobile */}
          <nav className="scd-nav-row scd-nav-desktop" aria-label="Primary">
            <div className="scd-nav-row-inner">
              {NAV.map((item) => (
                <NavLink
                  key={item.to + item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'scd-nav-a active' : 'scd-nav-a')}
                >
                  {item.label}
                </NavLink>
              ))}
              {CITY_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'scd-nav-a active' : 'scd-nav-a')}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>

        {menuOpen && <MobileDrawer onClose={() => setMenuOpen(false)} />}
      </header>

      <main id="main-content" className="scd-main">
        <Outlet />
      </main>

      <footer className="scd-f scd-f-dark">
        <div className="scd-f-grid">
          <div>
            <div className="scd-f-name">St. Catharines Digital</div>
            <p>
              Independent local coverage for St. Catharines, Welland and Thorold. Every item
              links to an official primary source.
            </p>
          </div>
          <div>
            <div className="scd-f-label">Sections</div>
            <Link to="/council">Council</Link>
            <Link to="/planning-tracker">Planning</Link>
            <Link to="/police">Crime</Link>
            <Link to="/news/st-catharines">St. Catharines</Link>
            <Link to="/news/welland">Welland</Link>
            <Link to="/news/thorold">Thorold</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <div className="scd-f-label">Cities</div>
            <Link to="/news/st-catharines">St. Catharines</Link>
            <Link to="/news/welland">Welland</Link>
            <Link to="/news/thorold">Thorold</Link>
          </div>
          <div>
            <div className="scd-f-label">Official sources</div>
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
          <span>Not affiliated with The Standard or Metroland Media.</span>
        </div>
      </footer>
    </div>
  )
}
