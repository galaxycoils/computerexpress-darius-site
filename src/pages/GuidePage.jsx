import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import NewsletterPanel from '../components/news/NewsletterPanel'
import { getGuideBySlug } from '../data/guides'
import '../components/news/news.css'

export default function GuidePage({ slug }) {
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return (
      <article className="scd-page">
        <h1 className="scd-intro-title">Guide not found</h1>
        <p className="scd-intro-note">No verified guide matches that address.</p>
        <Link to="/planning-tracker" className="scd-more">
          Return to the Planning Tracker →
        </Link>
      </article>
    )
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    mainEntityOfPage: `https://stcatharinesdigital.ca/guides/${guide.slug}/`,
    author: { '@type': 'Organization', name: 'St. Catharines Digital' },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'St. Catharines Digital',
      url: 'https://stcatharinesdigital.ca',
    },
  }

  return (
    <>
      <Seo
        title={`${guide.title} | St. Catharines Digital`}
        description={guide.description}
        path={`/guides/${guide.slug}`}
        type="article"
        jsonLd={schema}
      />
      <article className="scd-page">
        <header className="scd-intro">
          <div>
            <p className="scd-eyebrow">Official source guide · {guide.city}</p>
            <h1 className="scd-intro-title">{guide.title}</h1>
            <p className="scd-intro-note">{guide.description}</p>
          </div>
        </header>

        <section>
          <h2 className="scd-section-rule">What the notice says</h2>
          <ul className="scd-guide-list">
            {guide.whatItMeans.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="scd-section-rule">What to watch</h2>
          <ul className="scd-guide-list">
            {guide.whatToWatch.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <p className="scd-guide-source">
          <a href={guide.primarySource} target="_blank" rel="noopener noreferrer">
            View the official notice ↗
          </a>
        </p>

        <p className="scd-guide-cta">
          <Link to="/planning-tracker">Open the Planning Tracker →</Link>
        </p>

        <section className="scd-rail-block" aria-labelledby="guide-alerts-heading">
          <h2 id="guide-alerts-heading" className="scd-rail-label">
            Get the next change by email
          </h2>
          <p className="scd-rail-text">
            Get new hearings and notice changes by email. Free weekly digest. Official sources only.
          </p>
          <NewsletterPanel placement="guide_inline" />
        </section>
      </article>
    </>
  )
}