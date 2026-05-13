import { Outlet } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="container nav">
          <Link className="brand" to="/" aria-label="ComputerExpress home">
            <img className="brand-logo" src="/logo-horizontal.svg" alt="ComputerExpress" />
          </Link>
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link to="/contact" className="button button-ghost">Book Audit</Link>
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
            <p>Premium websites, technical SEO, and local growth systems for service businesses.</p>
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
