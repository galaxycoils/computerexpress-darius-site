import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { BASE_URL } from '../data/siteConfig'
import { getPublishableContent, getPublishableContentBySlug } from '../data/contentRegistry'

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getPublishableContentBySlug(slug)

  if (!article) {
    return <><Seo title="Article not found | St. Catharines Digital" description="Article not found." noIndex /><main className="scd-page scd-article-empty"><h1>Article not found</h1><p>This page may have moved or is no longer published.</p><Link to="/news">Browse local news →</Link></main></>
  }

  const related = getPublishableContent().filter((item) => item.slug !== article.slug && (item.city === article.city || item.type === article.type)).slice(0, 3)
  const citySlug = article.city.toLowerCase().replace(/\s+/g, '-')
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title,
    description: article.description, datePublished: article.publishedDate,
    dateModified: article.publishedDate, mainEntityOfPage: `https://stcatharinesdigital.ca/articles/${article.slug}/`,
    image: [`${BASE_URL}/og-card.webp`],
    author: { '@type': 'Organization', name: 'St. Catharines Digital', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'St. Catharines Digital', url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-mark.svg` } },
    isBasedOn: article.primarySource,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Local news', item: `${BASE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: article.city, item: `${BASE_URL}/news/${citySlug}` },
      { '@type': 'ListItem', position: 4, name: article.title, item: `https://stcatharinesdigital.ca/articles/${article.slug}/` }
    ]
  }

  return <>
    <Seo title={`${article.title} | St. Catharines Digital`} description={article.description} path={`/articles/${article.slug}`} type="article" jsonLd={[articleSchema, breadcrumbJsonLd]} />
    <article className="scd-page scd-article">
      <nav className="scd-article-crumb" aria-label="Breadcrumb"><Link to="/news">Local news</Link><span aria-hidden="true">/</span><Link to={`/news/${citySlug}`}>{article.city}</Link></nav>
      <header className="scd-article-header">
        <p className="scd-eyebrow">{article.type} · {article.city}</p>
        <h1>{article.title}</h1>
        <p className="scd-article-dek">{article.description}</p>
        <p className="scd-article-byline">St. Catharines Digital · <time dateTime={article.publishedDate}>Published {formatDate(article.publishedDate)}</time></p>
      </header>

      <section className="scd-article-body" aria-labelledby="record-summary">
        <h2 id="record-summary">What this record says</h2>
        <p>{article.description}</p>
        <aside className="scd-article-source">
          <h2>Primary source</h2>
          <p>This page summarizes a verified municipal record. Read the original notice or document for the complete public record.</p>
          <a className="button button-primary" href={article.primarySource} target="_blank" rel="noopener noreferrer">Read the official source ↗</a>
        </aside>
      </section>

      <section className="scd-article-standards" aria-label="Reporting standard">
        <strong>Reporting note</strong><span>We link to the primary public source and do not add claims that are not supported by that record.</span>
      </section>

      {related.length > 0 && <section className="scd-article-related" aria-labelledby="related-coverage"><h2 id="related-coverage">Related coverage</h2><div>{related.map((item) => <Link key={item.slug} to={`/articles/${item.slug}`}><span>{item.type} · {item.city}</span>{item.title}</Link>)}</div></section>}
    </article>
  </>
}
