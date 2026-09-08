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
    const bg = theme === 'dark' ? '#0b0d12' : '#f7f8fa'
    const fg = theme === 'dark' ? '#e8eaef' : '#111827'
    document.documentElement.style.background = bg
    document.body.style.background = bg
    document.body.style.color = fg
    document.body.classList.toggle('light', theme === 'light')
    document.body.classList.add('news-mode')
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
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className={`news-root ${theme === 'light' ? 'is-light' : 'is-dark'}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className={`scd-h ${scrolled ? 'scrolled' : ''}`}>
        <div className="scd-h-inner">
          <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
            <svg width="200" height="26" viewBox="0 0 400 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M8 26 L20 6 L32 26 L20 46 Z" fill="#9ce4c1"/>
              <path d="M8 26 L20 16 L32 26 L20 36 Z" fill="#fff" fillOpacity="0.22"/>
              <text x="42" y="33" fill="currentColor" fontFamily="IBM Plex Sans, system-ui, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.3">St. Catharines Digital</text>
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
            <div
              className="scd-dropdown"
              onMouseEnter={() => setNewsDropdown(true)}
              onMouseLeave={() => setNewsDropdown(false)}
            >
              <button
                type="button"
                className={`scd-a ${newsDropdown ? 'active' : ''}`}
                onClick={() => setNewsDropdown(!newsDropdown)}
                aria-expanded={newsDropdown}
              >
                News ▾
              </button>
              {newsDropdown && (
                <div className="scd-dropdown-menu">
                  {NEWS_DROPDOWN.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
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
              <span /><span /><span />
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
            <div className="scd-drawer-separator" />
            <p className="scd-drawer-label">News</p>
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
            <p>Independent local news for St. Catharines, Welland &amp; Thorold. Official sources only.</p>
          </div>
          <div>
            <div className="scd-f-label">Sections</div>
            <Link to="/council">Council</Link>
            <Link to="/police">Police</Link>
            <Link to="/planning-tracker">Planning</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <div className="scd-f-label">Official Sources</div>
            <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police</a>
            <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">City of St. Catharines</a>
            <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">City of Welland</a>
            <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">City of Thorold</a>
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

      <style>{`
        .news-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0b0d12 !important;
          color: #e8eaef !important;
          font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, sans-serif !important;
        }
        .news-root.is-light {
          background: #f7f8fa !important;
          color: #111827 !important;
        }

        .scd-h {
          position: sticky;
          top: 0;
          z-index: 300;
          background: rgba(11, 13, 18, 0.92) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #1c2030 !important;
        }
        .is-light .scd-h {
          background: rgba(247, 248, 250, 0.94) !important;
          border-bottom-color: #e5e7eb !important;
        }
        .scd-h.scrolled {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
        }

        .scd-h-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .scd-brand {
          display: flex;
          align-items: center;
          color: #e8eaef;
          text-decoration: none;
          flex-shrink: 0;
        }
        .is-light .scd-brand { color: #0f172a; }

        .scd-nav {
          display: none;
          align-items: center;
          gap: 0.1rem;
          margin-left: 0.35rem;
        }

        .scd-a {
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8 !important;
          text-decoration: none !important;
          transition: color 0.15s, background 0.15s;
        }
        .scd-a:hover {
          color: #e2e8f0 !important;
          background: rgba(255, 255, 255, 0.05);
        }
        .scd-a.active {
          color: #fff !important;
          background: rgba(156, 228, 193, 0.14) !important;
        }
        .is-light .scd-a { color: #64748b !important; }
        .is-light .scd-a:hover,
        .is-light .scd-a.active {
          color: #0f172a !important;
          background: rgba(15, 23, 42, 0.06) !important;
        }

        .scd-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.15rem;
        }

        .scd-theme {
          border: none;
          background: transparent;
          color: #94a3b8;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
        }
        .scd-theme:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #e2e8f0;
        }

        .scd-burger {
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
        .scd-burger span {
          display: block;
          height: 2px;
          width: 100%;
          background: #e2e8f0;
          border-radius: 1px;
          transition: 0.2s;
        }
        .is-light .scd-burger span { background: #0f172a; }
        .scd-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .scd-burger.open span:nth-child(2) { opacity: 0; }
        .scd-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .scd-drawer {
          display: flex;
          flex-direction: column;
          padding: 0.35rem 1.25rem 1rem;
          border-top: 1px solid #1c2030;
          background: #0b0d12;
        }
        .is-light .scd-drawer {
          background: #f7f8fa;
          border-top-color: #e5e7eb;
        }
        .scd-drawer-a {
          padding: 0.9rem 0.15rem;
          font-size: 1rem;
          font-weight: 500;
          color: #94a3b8 !important;
          text-decoration: none !important;
          border-bottom: 1px solid #1c2030;
        }
        .scd-drawer-a.active { color: #fff !important; }
        .is-light .scd-drawer-a.active { color: #0f172a !important; }

        .scd-main { flex: 1; }

        .scd-f {
          border-top: 1px solid #1c2030;
          padding: 2.5rem 0 1.4rem;
          margin-top: auto;
        }
        .is-light .scd-f { border-top-color: #e5e7eb; }

        .scd-f-grid {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 1.25rem;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 2rem;
        }

        .scd-f-name {
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .scd-f-grid p {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #94a3b8;
          max-width: 22rem;
          margin: 0;
        }
        .scd-f-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.65rem;
        }
        .scd-f-grid a {
          display: block;
          font-size: 0.9rem;
          color: #94a3b8 !important;
          text-decoration: none !important;
          margin-bottom: 0.4rem;
        }
        .scd-f-grid a:hover { color: #e2e8f0 !important; }

        .scd-f-bottom {
          max-width: 1080px;
          margin: 1.75rem auto 0;
          padding: 1rem 1.25rem 0;
          border-top: 1px solid #1c2030;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.8rem;
          color: #64748b;
        }
        .is-light .scd-f-bottom { border-top-color: #e5e7eb; }
        .scd-f-bottom a {
          color: #64748b !important;
          text-decoration: none !important;
          margin-left: 1rem;
        }

        @media (min-width: 860px) {
          .scd-nav { display: flex; }
          .scd-burger { display: none; }
        }
        @media (max-width: 859px) {
          .scd-f-grid { grid-template-columns: 1fr; gap: 1.6rem; }
          .scd-f-bottom { flex-direction: column; }
        }

        /* Kill any leftover marketing chrome from global CSS */
        .site-header,
        .nav-links,
        .nav-phone,
        .bg-orb,
        .hero-trust-badges,
        .custom-cursor,
        .exit-intent-popup,
        .ai-chat-widget,
        [class*="ExitIntent"],
        [class*="AIChat"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  )
}
