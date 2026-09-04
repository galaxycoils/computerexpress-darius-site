import Seo from '../components/Seo'

export default function PolicePage() {
  return (
    <>
      <Seo
        title="Niagara Regional Police — Official Releases"
        description="Official media releases and community notifications from the Niagara Regional Police Service relevant to St. Catharines, Welland and Thorold."
      />

      <section className="section-first" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div className="container">
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            fontWeight: 600,
            marginBottom: '0.6rem'
          }}>
            Official Sources Only
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem'
          }}>
            Niagara Regional Police
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '38rem',
            lineHeight: 1.55
          }}>
            Media releases and community notifications published by the Niagara Regional Police Service. We only report what appears in official NRPS releases.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.5rem' }}>
        <div className="container" style={{ maxWidth: '42rem' }}>
          <article style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Official media releases
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              marginBottom: '1.25rem'
            }}>
              All public safety and crime-related reporting on this site comes exclusively from releases published on the Niagara Regional Police website.
            </p>
            <a
              href="https://www.niagarapolice.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              View NRPS media releases ↗
            </a>
          </article>

          <div style={{
            marginTop: '1.25rem',
            padding: '1.2rem 1.35rem',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55
          }}>
            <strong style={{ color: 'var(--primary)' }}>Public safety policy</strong>
            <br /><br />
            Ontario does not maintain a public searchable sex offender map. St. Catharines Digital never creates maps, lists or location trackers of individuals. We only publish information that the Niagara Regional Police has officially released, and we always link back to the original release.
          </div>
        </div>
      </section>
    </>
  )
}
