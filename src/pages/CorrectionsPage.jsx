import { Link, useSearchParams } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import '../components/news/news.css'

export default function CorrectionsPage() {
  const [params] = useSearchParams()
  const requested = params.get('entry')
  const entry = requested && /^[a-z0-9-]+$/.test(requested) ? requested : ''
  return (
    <>
      <Seo
        title="Corrections | St. Catharines Digital"
        description="A public record of corrections and important updates to St. Catharines Digital reporting."
        path="/corrections"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Corrections', url: BASE_URL }}
      />
      <article className="scd-page">
        <header className="scd-intro"><div><p className="scd-eyebrow">Accountability</p><h1 className="scd-intro-title">Corrections</h1><p className="scd-intro-note">We keep a clear record when published information needs a material correction.</p></div></header>
        <section aria-labelledby="corrections-log"><h2 id="corrections-log" className="scd-section-rule">Correction log</h2><p className="scd-lead-dek">No corrections have been logged on this page.</p>{entry ? <p className="scd-lead-dek">Right of reply for record <strong>{entry}</strong>. Include the claim to review and a supporting source. Correction requests are reviewed within 72 hours.</p> : null}<p className="scd-lead-dek">To report a possible error, use the <Link to={entry ? `/contact?subject=Correction` : '/contact'}>contact page</Link> and include the article URL, the specific claim and a supporting source.</p></section>
      </article>
    </>
  )
}
