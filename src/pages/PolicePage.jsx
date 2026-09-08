import { getLatestNrpsReleases } from '../data/nrpsReleases'
import Seo from '../components/Seo'
import { BASE_URL } from '../components/Seo'

export default function PolicePage() {
  const recent = getLatestNrpsReleases(8, 30)
  return (
    <>
      <Seo
        title="Niagara Regional Police — Official Releases"
        description="Official media releases and community notifications from the Niagara Regional Police Service relevant to St. Catharines, Welland and Thorold."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsMediaOrganization',
          name: 'St. Catharines Digital Police News',
          url: BASE_URL,
          description: 'Compiled Niagara Regional Police Service media releases — official sources only.',
          founder: { '@type': 'Organization', name: 'St. Catharines Digital' },
          knowsAbout: ['Police Media Releases', 'Crime', 'Public Safety', 'Niagara Region', 'St. Catharines', 'Welland', 'Thorold'],
        }}
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

      {recent.length > 0 && (
        <section className="section" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
          <div className="container" style={{ maxWidth: '42rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Recent official releases
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              marginBottom: '1rem'
            }}>
              Latest public safety and crime-related notices from the Niagara Regional Police Service. Each item links to the original release on niagarapolice.ca.
            </p>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              borderTop: '1px solid var(--border)'
            }}>
              {recent.map(release => (
                <li key={release.id} style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '0.85rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}>
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.95rem',
                      color: 'var(--primary)',
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    {release.headline}
                  </a>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <time dateTime={release.date}>{release.date}</time>
                    <span>{release.municipality}</span>
                    <a href="https://www.niagarapolice.ca/news/posts/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>niagarapolice.ca →</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: '0.5rem' }}>
        <div className="container" style={{ maxWidth: '42rem' }}>
          <article style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Full police news archive
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.55,
              marginBottom: '1.25rem'
            }}>
              Browse all public safety and crime-related reporting on this site, with search and filters by municipality and category.
            </p>
            <a
              href="/news/police"
              className="button button-primary"
            >
              View all NRPS media releases ↗
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
