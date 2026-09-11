import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

/** theme-v2 resets old localStorage dark preference so paper light is the default */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem('theme-v2')
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
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

function formatDateline() {
  return new Date().toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function NewsDropdown({ isOpen, onToggle, items }) {
  return (
    <div className="scd-dropdown">
      <button
        type="button"
        className={`scd-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        News <span aria-hidden="true">▾</span>
      </button>
      {isOpen && (
        <div className="scd-dropdown-menu" role="menu">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => onToggle(false)}
              className="scd-dropdown-item"
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileDrawer({ isOpen, onClose, navItems, dropdownItems }) {
  return (
    <nav className="scd-drawer" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onClose}
          className={({ isActive }) => (isActive ? 'scd-drawer-a active' : 'scd-drawer-a')}
        >
          {item.label}
        </NavLink>
      ))}
      <p className="scd-drawer-label">News by city</p>
      {dropdownItems.map((item) => (
        <NavLink
          key={item.to}
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
  const [newsDropdown, setNewsDropdown] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.body.classList.add('news-mode')
    localStorage.setItem('theme-v2', theme)
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

      <header className="scd-h">
        <div className="scd-mast">
          <p className="scd-dateline" suppressHydrationWarning>
            {formatDateline()}
          </p>
          <div className="scd-mast-top">
            <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
              <span className="scd-brand-name">St. Catharines Digital</span>
              <span className="scd-brand-tag">Official sources · Niagara</span>
            </Link>
            <div className="scd-h-tools">
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

          <nav className="scd-nav-row" aria-label="Primary">
            <div className="scd-nav-row-inner">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => (isActive ? 'scd-nav-a active' : 'scd-nav-a')}
                >
                  {item.label}
                </NavLink>
              ))}
              <NewsDropdown
                isOpen={newsDropdown}
                onToggle={setNewsDropdown}
                items={NEWS_DROPDOWN}
              />
            </div>
          </nav>
        </div>

        {menuOpen && (
          <MobileDrawer
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            navItems={NAV}
            dropdownItems={NEWS_DROPDOWN}
          />
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
