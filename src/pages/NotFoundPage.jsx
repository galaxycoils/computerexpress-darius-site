import { Link, useLocation } from 'react-router-dom'
import Seo from '../components/Seo'
import '../components/news/news.css'
import '../components/news/news-hub.css'

export default function NotFoundPage() {
  const { pathname } = useLocation()
  return (
    <>
      <Seo title="Page Not Found | St. Catharines Digital" path={pathname} noIndex />
      <div className="scd-page">
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">404 · Off the record</p>
            <h1 className="scd-intro-title">This page is not on file.</h1>
            <p className="scd-intro-note">It may have been removed, renamed, or never existed. Try one of these sections instead.</p>
          </div>
        </header>

        <form className="journal-recovery-search" action="/search" role="search" aria-label="Find another page">
          <label htmlFor="recovery-search">Find a story, street or local guide</label>
          <div><input id="recovery-search" type="search" name="q" placeholder="What were you looking for?" maxLength={200} required /><button className="journal-button" type="submit">Search</button></div>
        </form>

        <section aria-labelledby="lost-sections-h">
          <h2 id="lost-sections-h" className="scd-section-rule">Start here instead</h2>
          <div className="scd-hub-grid">
            <article className="card">
              <h3>Local News</h3>
              <p>St. Catharines, Welland, Thorold, and Niagara Falls from official sources.</p>
              <Link to="/news" className="scd-hub-more">
                Browse local news →
              </Link>
            </article>
            <article className="card">
              <h3>Planning Tracker</h3>
              <p>Planning notices, zoning files, and meeting records.</p>
              <Link to="/planning-tracker" className="scd-hub-more">
                Open the tracker →
              </Link>
            </article>
            <article className="card">
              <h3>Welland Votes 2026</h3>
              <p>Mayoral race, key dates, and voter information.</p>
              <Link to="/welland-votes" className="scd-hub-more">
                Open the voter guide →
              </Link>
            </article>
          </div>
          <p>
            <Link to="/" className="button button-primary">Go to Homepage</Link>
          </p>
        </section>
      </div>
    </>
  )
}
