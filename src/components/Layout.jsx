import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'

const NEWSLETTER_API = '/api/newsletter'

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [newsletterState, setNewsletterState] = useState({ status: '', message: '' })

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
          <Link className="brand" to="/" aria-label="ComputerExpress home">
            <img className="brand-logo" src="/logo-horizontal.svg" alt="ComputerExpress" width="180" height="32" />
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
            <Link to="/contact" className="button button-ghost" onClick={closeMenu}>Book Audit</Link>
          </nav>
        </div>
      </header>
      <main id="main-content">
        <Outlet />
      </main>
      <footer className="site-footer footer-enhanced" role="contentinfo">
        <div className="container">
          <div className="footer-main">
            <div className="footer-col">
              <img className="footer-logo" src="/logo-horizontal.svg" alt="ComputerExpress" width="180" height="32" />
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
          <div className="footer-bottom">
            <span className="footer-copyright">&copy; {new Date().getFullYear()} ComputerExpress. All rights reserved.</span>
            <nav className="footer-social" aria-label="Social media links">
              <a href="https://twitter.com" aria-label="Twitter / X" rel="noopener noreferrer" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://github.com" aria-label="GitHub" rel="noopener noreferrer" target="_blank">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
