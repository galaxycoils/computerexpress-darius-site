import { useState, useEffect, useCallback, useRef } from 'react'
import { Outlet, useLocation, Link, NavLink } from 'react-router-dom'

const SECTIONS = [
  { to: '/news', label: 'Latest' },
  { to: '/council', label: 'Council' },
  { to: '/planning-tracker', label: 'Development' },
  { to: '/votes', label: 'Elections' },
  { to: '/police', label: 'Public Safety' },
]

const CITIES = [
  { to: '/news/st-catharines', label: 'St. Catharines' },
  { to: '/news/welland', label: 'Welland' },
  { to: '/news/thorold', label: 'Thorold' },
  { to: '/news/niagara-falls', label: 'Niagara Falls' },
]

const MOBILE_DOCK = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/news', label: 'Latest', icon: '≡' },
  { to: '/reader-services#cities', label: 'Cities', icon: '⌖', anchor: true },
  { to: '/search', label: 'Search', icon: '⌕' },
  { to: '/reader-services', label: 'Services', icon: '＋' },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = localStorage.getItem('theme-v2')
    if (stored === 'light' || stored === 'dark') return stored
  } catch { /* Storage can be disabled by the browser. */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function formatDateline() {
  return new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })
}

function Navigation({ onNavigate, includeUtilities = false }) {
  return <>
    <div className="scd-nav-group">
      {SECTIONS.map(item=><NavLink key={item.to} to={item.to} onClick={onNavigate} className={({isActive})=>isActive?'scd-nav-a active':'scd-nav-a'}>{item.label}</NavLink>)}
      {includeUtilities&&<><NavLink to="/search" onClick={onNavigate} className={({isActive})=>isActive?'scd-nav-a active':'scd-nav-a'}>Search</NavLink><NavLink to="/reader-services" onClick={onNavigate} className={({isActive})=>isActive?'scd-nav-a active':'scd-nav-a'}>Reader Services</NavLink></>}
    </div>
    <div className="scd-nav-group scd-city-nav">
      <span className="scd-city-nav-label">Cities</span>
      {CITIES.map(item=><NavLink key={item.to} to={item.to} onClick={onNavigate} className={({isActive})=>isActive?'scd-nav-a active':'scd-nav-a'}>{item.label}</NavLink>)}
    </div>
  </>
}

export default function Layout() {
  const [menuOpen,setMenuOpen]=useState(false)
  const [theme,setTheme]=useState(getInitialTheme)
  const location=useLocation()
  const menuButton=useRef(null)

  useEffect(()=>{
    document.body.classList.toggle('light',theme==='light')
    document.body.classList.add('news-mode')
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme-v2',theme) } catch { /* Storage can be disabled. */ }
  },[theme])

  useEffect(()=>{
    setMenuOpen(false)
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' }))
      return
    }
    window.scrollTo({top:0,behavior:'auto'})
  },[location.pathname,location.hash])

  useEffect(()=>{
    if(!menuOpen)return
    const closeOnEscape=event=>{if(event.key==='Escape'){setMenuOpen(false);menuButton.current?.focus()}}
    document.addEventListener('keydown',closeOnEscape)
    return()=>document.removeEventListener('keydown',closeOnEscape)
  },[menuOpen])

  const toggleTheme=useCallback(()=>setTheme(value=>value==='dark'?'light':'dark'),[])

  return <div className={`news-root ${theme==='light'?'is-light':'is-dark'}`}>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <header className={`scd-h ${menuOpen?'is-menu-open':''}`}>
      <div className="scd-mast">
        <div className="scd-mast-top">
          <Link to="/" className="scd-brand" aria-label="St. Catharines Digital home"><span className="scd-brand-name">St. Catharines <em>Digital</em></span><span className="scd-brand-tag">Independent local reporting for Niagara</span></Link>
          <div className="scd-h-tools">
            <p className="scd-dateline" suppressHydrationWarning>{formatDateline()}</p>
            <Link to="/search" className="scd-search-link" aria-label="Search the site">Search</Link>
            <Link to="/planning-alerts" className="scd-header-link scd-subscribe-link">Subscribe</Link>
            <button type="button" className="scd-theme" onClick={toggleTheme} aria-label={theme==='dark'?'Switch to light theme':'Switch to dark theme'}>{theme==='dark'?'☀':'☾'}</button>
            <button type="button" className="scd-burger" onClick={()=>setMenuOpen(open=>!open)} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" ref={menuButton}>{menuOpen?<span className="scd-burger-x" aria-hidden="true">×</span>:<><span/><span/><span/></>}</button>
          </div>
        </div>
        <nav className="scd-nav-row scd-nav-desktop" aria-label="Primary"><Navigation/></nav>
      </div>
      {menuOpen&&<nav id="mobile-navigation" className="scd-drawer" aria-label="Mobile navigation"><Navigation onNavigate={()=>setMenuOpen(false)} includeUtilities/></nav>}
    </header>
    <main id="main-content" className="scd-main"><Outlet/></main>
    <footer className="scd-f scd-f-dark">
      <div className="scd-f-grid">
        <div><div className="scd-f-name">St. Catharines Digital</div><p>Independent local coverage for St. Catharines, Welland, Thorold and Niagara Falls. Every civic record links to its primary source.</p></div>
        <div><div className="scd-f-label">Coverage</div><Link to="/news">Latest</Link><Link to="/council">Council</Link><Link to="/planning-tracker">Development</Link><Link to="/votes">Elections</Link><Link to="/police">Public Safety</Link></div>
        <div><div className="scd-f-label">Reader services</div><Link to="/reader-services">All reader services</Link><Link to="/search">Search</Link><Link to="/planning-alerts">Newsletters & alerts</Link><Link to="/contact">Send a news tip</Link><Link to="/corrections">Report a correction</Link><Link to="/membership">Support the newsroom</Link></div>
        <div><div className="scd-f-label">Your city</div>{CITIES.map(item=><Link key={item.to} to={item.to}>{item.label}</Link>)}<Link to="/about">About</Link><Link to="/editorial-policy">Editorial policy</Link></div>
      </div>
      <div className="scd-f-bottom"><span>© {new Date().getFullYear()} St. Catharines Digital</span><div className="scd-legal-links"><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div></div>
    </footer>
    <nav className="scd-mobile-dock" aria-label="Quick navigation">{MOBILE_DOCK.map(item=>item.anchor?<Link key={item.to} to={item.to}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></Link>:<NavLink key={item.to} to={item.to} end={item.end}><span aria-hidden="true">{item.icon}</span><strong>{item.label}</strong></NavLink>)}</nav>
  </div>
}
