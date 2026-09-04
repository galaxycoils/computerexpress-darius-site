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

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
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
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <div className="page-shell news-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className={`scd-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="scd-header-inner">
          <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home">
            <img src="/logo-horizontal.svg?v=2" alt="St. Catharines Digital" height="28" />
          </Link>

          <nav className="scd-nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'scd-link active' : 'scd-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="scd-actions">
            <button type="button" className="scd-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
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
          <div className="scd-mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'scd-mobile-link active' : 'scd-mobile-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main id="main-content" className="scd-main">
        <Outlet />
      </main>

      <footer className="scd-footer">
        <div className="scd-footer-grid">
          <div>
            <img src="/logo-horizontal.svg?v=2" alt="St. Catharines Digital" height="24" loading="lazy" />
            <p className="scd-footer-tag">Independent local news for St. Catharines, Welland &amp; Thorold. Official sources only.</p>
          </div>
          <div>
            <div className="scd-footer-label">Sections</div>
            <Link to="/council">Council</Link>
            <Link to="/police">Police</Link>
            <Link to="/planning-tracker">Planning</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <div className="scd-footer-label">Official Sources</div>
            <a href="https://www.niagarapolice.ca/" target="_blank" rel="noopener noreferrer">Niagara Regional Police</a>
            <a href="https://www.stcatharines.ca/" target="_blank" rel="noopener noreferrer">City of St. Catharines</a>
            <a href="https://www.welland.ca/" target="_blank" rel="noopener noreferrer">City of Welland</a>
            <a href="https://www.thorold.ca/" target="_blank" rel="noopener noreferrer">City of Thorold</a>
          </div>
        </div>
        <div className="scd-footer-bottom">
          <span>© {new Date().getFullYear()} St. Catharines Digital</span>
          <span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </span>
        </div>
      </footer>

      <style>{`
        /* ========== FORCE NEWS VISUAL SYSTEM ========== */
        .news-shell,
        .news-shell * {
          box-sizing: border-box;
        }

        .news-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0b0d12 !important;
          color: #e8eaef !important;
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        body.light .news-shell {
          background: #f7f8fa !important;
          color: #111827 !important;
        }

        /* Header */
        .scd-header {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(11, 13, 18, 0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #1c2030;
        }

        body.light .scd-header {
          background: rgba(247, 248, 250, 0.92);
          border-bottom-color: #e5e7eb;
        }

        .scd-header.scrolled {
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
        }

        .scd-header-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 56px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .scd-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          color: #e8eaef;
        }

        body.light .scd-brand {
          color: #111827;
        }

        .scd-brand img {
          height: 26px;
          width: auto;
          display: block;
        }

        .scd-nav {
          display: none;
          align-items: center;
          gap: 0.15rem;
        }

        .scd-link {
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }

        .scd-link:hover {
          color: #e2e8f0;
          background: rgba(255,255,255,0.05);
        }

        .scd-link.active {
          color: #fff;
          background: rgba(59, 130, 246, 0.15);
        }

        body.light .scd-link {
          color: #64748b;
        }

        body.light .scd-link:hover,
        body.light .scd-link.active {
          color: #0f172a;
          background: rgba(15, 23, 42, 0.06);
        }

        .scd-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .scd-icon-btn {
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 1rem;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
        }

        .scd-icon-btn:hover {
          background: rgba(255,255,255,0.06);
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

        body.light .scd-burger span {
          background: #0f172a;
        }

        .scd-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .scd-burger.open span:nth-child(2) { opacity: 0; }
        .scd-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .scd-mobile {
          display: flex;
          flex-direction: column;
          padding: 0.25rem 1.25rem 1rem;
          border-top: 1px solid #1c2030;
          background: #0b0d12;
        }

        body.light .scd-mobile {
          background: #f7f8fa;
          border-top-color: #e5e7eb;
        }

        .scd-mobile-link {
          padding: 0.9rem 0.2rem;
          font-size: 1rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          border-bottom: 1px solid #1c2030;
        }

        .scd-mobile-link.active {
          color: #fff;
        }

        body.light .scd-mobile-link.active {
          color: #0f172a;
        }

        .scd-main {
          flex: 1;
        }

        /* Footer */
        .scd-footer {
          border-top: 1px solid #1c2030;
          padding: 2.75rem 0 1.5rem;
          margin-top: auto;
        }

        body.light .scd-footer {
          border-top-color: #e5e7eb;
        }

        .scd-footer-grid {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.25rem;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 2rem;
        }

        .scd-footer-tag {
          margin-top: 0.75rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #94a3b8;
          max-width: 22rem;
        }

        .scd-footer-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 0.7rem;
        }

        .scd-footer-grid a {
          display: block;
          font-size: 0.9rem;
          color: #94a3b8;
          text-decoration: none;
          margin-bottom: 0.45rem;
        }

        .scd-footer-grid a:hover {
          color: #e2e8f0;
        }

        .scd-footer-bottom {
          max-width: 1100px;
          margin: 2rem auto 0;
          padding: 1.1rem 1.25rem 0;
          border-top: 1px solid #1c2030;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          font-size: 0.8rem;
          color: #64748b;
        }

        body.light .scd-footer-bottom {
          border-top-color: #e5e7eb;
        }

        .scd-footer-bottom a {
          color: #64748b;
          text-decoration: none;
          margin-left: 1rem;
        }

        @media (min-width: 860px) {
          .scd-nav { display: flex; }
          .scd-burger { display: none; }
        }

        @media (max-width: 859px) {
          .scd-footer-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .scd-footer-bottom {
            flex-direction: column;
          }
        }

        /* Kill leftover marketing chrome */
        .site-header,
        .nav-links,
        .nav-phone,
        .hero-trust-badges,
        .bg-orb,
        .exit-intent,
        .ai-chat-widget {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
