import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/news/st-catharines', label: 'News', isDropdown: true },
  { to: '/planning-tracker', label: 'Planning' },
  { to: '/police', label: 'Police' },
  { to: '/council', label: 'Council' },
  { to: '/about', label: 'About' },
]

const NEWS_DROPDOWN = [
  { to: '/news/st-catharines', label: 'St. Catharines' },
  { to: '/news/welland', label: 'Welland' },
  { to: '/news/thorold', label: 'Thorold' },
  { to: '/news/police', label: 'Police Releases' },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme-v2')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

function formatDateline() {
  return new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [newsDropdown, setNewsDropdown] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  // Apply theme class to root + persist + update theme-color meta
  useEffect(() => {
    const root = document.querySelector('.news-root')
    if (root) {
      root.classList.toggle('is-light', theme === 'light')
      root.classList.toggle('is-dark', theme === 'dark')
    }
    document.body.classList.add('news-mode')
    localStorage.setItem('theme-v2', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#112233' : '#faf8f4')
    }
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

  const handleNewsToggle = useCallback((e) => {
    e.preventDefault()
    setNewsDropdown((v) => !v)
  }, [])

  return (
    <div className={`news-root ${theme === 'light' ? 'is-light' : 'is-dark'}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="scd-h">
        {/* Masthead: logo left, dateline left, utilities right */}
        <div className="scd-mast">
          <div className="scd-mast-top">
            <p className="scd-dateline" suppressHydrationWarning>
              {formatDateline()}
            </p>
            <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
              <span className="scd-brand-name">St. Catharines Digital</span>
              <span className="scd-brand-tag">Official sources · Niagara</span>
            </Link>
            <div className="scd-h-tools">
              <button
                type="button"
                className="scd-theme"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
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
        </div>

        {/* Blue nav bar — Standard register */}
        <nav className="scd-nav-bar" aria-label="Primary">
          <div className="scd-nav-bar-inner">
            {NAV.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.to} className="scd-dropdown">
                    <button
                      type="button"
                      className={`scd-nav-a ${newsDropdown ? 'active' : ''}`}
                      onClick={handleNewsToggle}
                      aria-expanded={newsDropdown}
                      aria-haspopup="true"
                    >
                      {item.label} ▾
                    </button>
                    {newsDropdown && (
                      <div className="scd-dropdown-menu" role="menu">
                        {NEWS_DROPDOWN.map((ddItem) => (
                          <NavLink
                            key={ddItem.to}
                            to={ddItem.to}
                            role="menuitem"
                            onClick={() => setNewsDropdown(false)}
                            className="scd-dropdown-item"
                          >
                            {ddItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'scd-nav-a active' : 'scd-nav-a')}
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {menuOpen && (
          <nav className="scd-drawer" aria-label="Mobile navigation">
            {NAV.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.to} className="scd-drawer-dropdown">
                    <button
                      type="button"
                      className="scd-drawer-toggle"
                      onClick={() => setNewsDropdown((v) => !v)}
                    >
                      {item.label} ▾
                    </button>
                    {newsDropdown && (
                      <div className="scd-drawer-dropdown-menu">
                        {NEWS_DROPDOWN.map((ddItem) => (
                          <NavLink
                            key={ddItem.to}
                            to={ddItem.to}
                            onClick={() => {
                              setNewsDropdown(false)
                              setMenuOpen(false)
                            }}
                            className="scd-drawer-a"
                          >
                            {ddItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
                >
                  {item.label}
                </NavLink>
              )
            })}
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
              Independent local coverage for St. Catharines, Welland & Thorold. Every item
              links to an official primary source.
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
            <div className="scd-f-label">City desks</div>
            <Link to="/news/st-catharines">St. Catharines</Link>
            <Link to="/news/welland">Welland</Link>
            <Link to="/news/thorold">Thorold</Link>
            <Link to="/news/police">Police Releases</Link>
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
          <span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </span>
        </div>
      </footer>
    </div>
  )
}
