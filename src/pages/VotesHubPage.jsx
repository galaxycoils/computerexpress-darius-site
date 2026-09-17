import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import '../components/news/news.css'

export default function VotesHubPage() {
  return (
    <>
      <Seo title="Elections & Voting | St. Catharines Digital" description="Verified local election guides, candidate information, key dates and voting details for Niagara residents." path="/votes" jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Elections & Voting', url: BASE_URL }} />
      <div className="scd-page">
        <nav className="scd-article-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Elections & Voting</span>
        </nav>
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">Verified civic information</p>
            <h1 className="scd-intro-title">Elections & Voting</h1>
            <p className="scd-intro-note">Key dates, candidate information and voting instructions from official municipal sources. Election information is checked and dated so you can see what may have changed.</p>
          </div>
        </header>
        <section aria-labelledby="current-guides">
          <h2 id="current-guides" className="scd-section-rule">Current guides</h2>
          <article className="card">
            <p className="scd-cat">Welland · Municipal election 2026</p>
            <h3>Welland Votes 2026</h3>
            <p>Mayoral candidates, key dates, advance voting, eligibility and the rest of the ballot.</p>
            <Link to="/welland-votes" className="scd-more">Open the Welland voter guide →</Link>
          </article>
        </section>
        <section aria-labelledby="how-checked">
          <h2 id="how-checked" className="scd-section-rule">How election information is checked</h2>
          <p className="scd-lead-dek">Candidate certification, dates, locations and voting rules are linked to the responsible city or election authority. Statements are attributed to the source that published them. If a detail is not verified, it is marked for review rather than presented as current.</p>
        </section>
      </div>
    </>
  )
}
