import Seo, { BASE_URL } from '../components/Seo'
import '../components/news/news.css'

export default function EditorialPolicyPage() {
  return (
    <>
      <Seo
        title="Editorial Policy | St. Catharines Digital"
        description="How St. Catharines Digital sources, checks, labels and corrects local news."
        path="/editorial-policy"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Editorial Policy', url: BASE_URL }}
      />
      <article className="scd-page">
        <header className="scd-intro"><div><p className="scd-eyebrow">Accountability</p><h1 className="scd-intro-title">Editorial Policy</h1><p className="scd-intro-note">A clear record of how we gather, check and label local information.</p></div></header>
        <section><h2 className="scd-section-rule">Sources and verification</h2><p className="scd-lead-dek">We begin with primary sources such as municipal notices, agendas, minutes, staff reports, police releases and election authorities. We identify the source for material claims and check dates, names, locations and status before publication.</p></section>
        <section><h2 className="scd-section-rule">Labels and independence</h2><p className="scd-lead-dek">Reporting, explainers, opinions, reader submissions and sponsored material are labelled separately. Sponsorship does not determine editorial decisions. Candidate statements are attributed to the candidate or publication that made them.</p></section>
        <section><h2 className="scd-section-rule">Updates and corrections</h2><p className="scd-lead-dek">Time-sensitive pages show publication and update dates. When a material error is found, we correct it promptly and record the change on the <a href="/corrections">Corrections page</a>.</p></section>
      </article>
    </>
  )
}
