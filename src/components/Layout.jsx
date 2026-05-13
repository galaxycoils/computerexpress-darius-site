import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on nav
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function closeMenu() { setMenuOpen(false) }

  return (
    <div className="page-shell">
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav">
          <Link className="brand" to="/" aria-label="ComputerExpress home">
            <img className="brand-logo" src="/logo-horizontal.svg" alt="ComputerExpress" />
          </Link>
          <button
            className={`nav-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary">
            <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
            <NavLink to="/about" onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
            <Link to="/contact" className="button button-ghost" onClick={closeMenu}>Book Audit</Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-row">
          <div className="footer-brand-block">
            <img className="footer-logo" src="/logo-horizontal.svg" alt="ComputerExpress" />
            <p>Premium websites, technical SEO, and local growth systems for service businesses that need better visibility and more qualified leads.</p>
          </div>
          <div className="footer-links">
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
