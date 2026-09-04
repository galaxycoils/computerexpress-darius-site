import Seo, { BASE_URL } from '../components/Seo'

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'St. Catharines Digital',
  url: BASE_URL,
  description:
    'Independent local news for St. Catharines, Welland and Thorold. Council decisions, police releases, planning notices and municipal updates from official sources only.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'St. Catharines',
    addressRegion: 'ON',
    addressCountry: 'CA',
  },
  areaServed: [
    { '@type': 'City', name: 'St. Catharines' },
    { '@type': 'City', name: 'Welland' },
    { '@type': 'City', name: 'Thorold' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
  ],
}

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About — St. Catharines Digital"
        description="Independent local news for St. Catharines, Welland and Thorold. We report only from official primary sources."
        path="/about"
        jsonLd={[aboutPageJsonLd, breadcrumbJsonLd]}
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
            About
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            marginBottom: '0.85rem',
            maxWidth: '28rem'
          }}>
            Local news from official sources only.
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '36rem',
            lineHeight: 1.6
          }}>
            St. Catharines Digital covers St. Catharines, Welland and Thorold.
            We focus on city council decisions, Niagara Regional Police releases,
            planning notices and municipal updates — always linked back to the
            primary documents.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.5rem' }}>
        <div className="container" style={{ maxWidth: '40rem' }}>

          <article style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              What we do
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              We surface official information that affects residents of the three cities:
            </p>
            <ul style={{
              margin: 0,
              paddingLeft: '1.2rem',
              fontSize: '0.95rem',
              color: 'var(--text-muted)',
              lineHeight: 1.7
            }}>
              <li>City council agendas, minutes and decisions</li>
              <li>Official Niagara Regional Police media releases</li>
              <li>Planning applications, zoning notices and public meetings</li>
              <li>Municipal budgets, road closures and public notices</li>
            </ul>
          </article>

          <article style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              How we work
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Everything published here comes from official primary sources:
              the Niagara Regional Police Service, the City of St. Catharines,
              the City of Welland, the City of Thorold, and Niagara Region.
              We do not use social media, Facebook groups or Reddit as sources.
            </p>
          </article>

          <article style={{
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--primary)' }}>
              Public safety policy
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Ontario does not maintain a public searchable sex offender map.
              St. Catharines Digital never creates maps, lists or location trackers
              of individuals. For official community notifications, always check
              the Niagara Regional Police media releases at{' '}
              <a
                href="https://www.niagarapolice.ca/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)' }}
              >
                niagarapolice.ca
              </a>.
            </p>
          </article>

        </div>
      </section>
    </>
  )
}
