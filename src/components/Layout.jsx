import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
import AIChatWidget from './AIChatWidget'
import WebLLMChat from './WebLLMChat'

const NEWSLETTER_API = '/api/newsletter'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

// Breadcrumb data — maps paths to readable labels
const breadcrumbLabels = {
  '/': 'Home',
  '/services': 'Services',
  '/about': 'About',
  '/contact': 'Contact'
}

function Breadcrumbs() {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') return null

  const crumbs = [
    { label: 'Home', path: '/' }
  ]

  pathParts.forEach((part, i) => {
    const path = '/' + pathParts.slice(0, i + 1).join('/')
    crumbs.push({
      label: breadcrumbLabels[path] || part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      path: path
    })
  })

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path}>
          {i > 0 && <span className="breadcrumb-separator" aria-hidden="true">›</span>}
          {i === crumbs.length - 1 ? (
            <span className="breadcrumb-current">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="breadcrumb-link">{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [newsletterState, setNewsletterState] = useState({ status: '', message: '' })
  const scrollTimeoutRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
      setShowBackToTop(window.scrollY > 600)

      // Debounce scroll handler
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        setShowBackToTop(window.scrollY > 600)
      }, 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault()
    const form = e.target
    const email = form.email.value?.trim()
    if (!email) return

    setNewsletterState({ status: 'loading', message: 'Subscribing...' })

    try {
      const res = await fetch(NEWSLETTER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await res.json()

      if (res.ok) {
        setNewsletterState({ status: 'success', message: 'Subscribed! Check your inbox.' })
        form.reset()
      } else {
        setNewsletterState({ status: 'error', message: result.error || 'Something went wrong.' })
      }
    } catch (err) {
      setNewsletterState({ status: 'error', message: 'Network error. Try again.' })
    }

    setTimeout(() => setNewsletterState({ status: '', message: '' }), 5000)
  }

  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
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
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
            <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
            <NavLink to="/blog" onClick={closeMenu}>Blog</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <a href="tel:+13653595973" className="nav-phone" aria-label="Call us" style={{color:'var(--primary)',fontSize:'0.85rem',fontWeight:600,textDecoration:'none',display:'flex',alignItems:'center',gap:'0.25rem'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              (365) 359-5973
            </a>
            <a href="https://calendly.com/tahamtandariush/30min" target="_blank" rel="noopener noreferrer" className="button button-ghost" style={{fontSize:'0.8rem',padding:'0.4rem 0.8rem'}}>Book a Call</a>
            <Link to="/contact" className="button button-ghost" onClick={closeMenu}>Book Audit</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumbs rendered on every page except home */}
      <Breadcrumbs />

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer footer-enhanced" role="contentinfo">
        <div className="container">
          <div className="footer-main">
            <div className="footer-col">
              <img className="footer-logo" src="/logo-horizontal.svg" alt="St. Catharines Digital" width="180" height="32" />
              <p>Premium websites, technical SEO, and local growth systems for service businesses that need better visibility and more qualified leads.</p>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Services</span>
              <nav className="footer-col-links" aria-label="Services links">
                <Link to="/services">Web Design</Link>
                <Link to="/services">Technical SEO</Link>
                <Link to="/services">Google Business Profile</Link>
                <Link to="/services">Local SEO</Link>
              </nav>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Company</span>
              <nav className="footer-col-links" aria-label="Company links">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/contact">Free Audit</Link>
              </nav>
            </div>
            <div className="footer-col">
              <span className="footer-heading">Stay updated</span>
              <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Get SEO tips and web design insights.</p>
              <form className="footer-newsletter" onSubmit={handleNewsletterSubmit} aria-label="Newsletter signup">
                <input type="email" name="email" placeholder="your@email.com" aria-label="Email address" required />
                <button type="submit" className="button button-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Join</button>
              </form>
              {newsletterState.message && (
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: newsletterState.status === 'success' ? 'var(--success)' : newsletterState.status === 'error' ? '#ff6b6b' : 'var(--muted)' }}>
                  {newsletterState.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>

      <AIChatWidget />
      <WebLLMChat />
    </div>
  )
}