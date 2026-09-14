import Seo from '../components/Seo'
import '../components/news/news.css'

export default function CorrectionsPage() {
  return (
    <>
      <Seo title="Corrections | St. Catharines Digital" description="A public record of corrections and important updates to St. Catharines Digital reporting." path="/corrections" />
      <article className="scd-page">
        <header className="scd-intro"><div><p className="scd-eyebrow">Accountability</p><h1 className="scd-intro-title">Corrections</h1><p className="scd-intro-note">We keep a clear record when published information needs a material correction.</p></div></header>
        <section aria-labelledby="corrections-log"><h2 id="corrections-log" className="scd-section-rule">Correction log</h2><p className="scd-lead-dek">No corrections have been logged on this page.</p><p className="scd-lead-dek">To report a possible error, use the <a href="/contact">contact page</a> and include the article URL, the specific claim and a supporting source.</p></section>
      </article>
    </>
  )
}
