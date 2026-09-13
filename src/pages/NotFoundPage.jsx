import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import '../components/news/news.css'
import '../components/news/news-hub.css'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found | St. Catharines Digital" noIndex />
      <div className="scd-page">
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">404 · Off the record</p>
            <h1 className="scd-intro-title">This page is not on file.</h1>
            <p className="scd-intro-note">It may have been removed, renamed, or never existed. The sections below are all current.</p>
          </div>
        </header>

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
              <p>Active planning notices, zoning files, and public meetings.</p>
              <Link to="/planning-tracker" className="scd-hub-more">
                Open the tracker →
              </Link>
            </article>
            <article className="card">
              <h3>Welland Votes 2026</h3>
              <p>Mayoral race, key dates, and how to vote on Oct 26.</p>
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
