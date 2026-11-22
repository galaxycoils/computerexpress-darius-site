import Seo, { BASE_URL } from '../components/Seo'

const aboutPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'St. Catharines Digital',
  url: BASE_URL,
  description:
    'Local news, civic records and places to explore in St. Catharines and Niagara. Connected to public records and primary sources.',
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
    { '@type': 'City', name: 'Niagara Falls' },
    { '@type': 'AdministrativeArea', name: 'Niagara Region' },
  ],
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about/` },
  ],
}

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About — St. Catharines Digital"
        description="St. Catharines Digital is an independent Niagara newsroom. We start with official records and name other outlets when we use them."
        path="/about"
        jsonLd={[aboutPageJsonLd, breadcrumbJsonLd]}
      />

      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
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
            A Niagara newsroom, close to the record.
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--muted)',
            maxWidth: '36rem',
            lineHeight: 1.6
          }}>
            St. Catharines Digital covers Niagara. The core of the desk is
            St. Catharines, Welland and Thorold, and the site also carries
            Niagara Falls, Niagara Region and Niagara Regional Police records
            when those sources publish them.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.5rem' }}>
        <div className="container" style={{ maxWidth: '40rem' }}>

          <article style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              What we do
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              We follow public records and local reporting that affect people in Niagara:
            </p>
            <ul style={{
              margin: 0,
              paddingLeft: '1.2rem',
              fontSize: '0.95rem',
              color: 'var(--muted)',
              lineHeight: 1.7
            }}>
              <li>City council agendas, minutes and decisions</li>
              <li>Niagara Regional Police media releases</li>
              <li>Planning applications, zoning notices and public meetings</li>
              <li>Municipal budgets, road closures and public notices</li>
            </ul>
          </article>

          <article style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              How we work
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              We begin with official records: municipal notices, council documents,
              police releases and election authorities. Where a record also uses
              an established news outlet, including the hate and extremism tracker,
              that outlet is named on the record. We do not use social media,
              Facebook groups or Reddit as sources.
            </p>
          </article>

          <article style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem' }}>
              Ownership
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6 }}>
              St. Catharines Digital is an independent local news site.
              Public credit: Darius T.
            </p>
          </article>

          <article style={{
            background: 'var(--signal-soft)',
            border: '1px solid color-mix(in srgb, var(--signal) 30%, transparent)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.6rem', color: 'var(--primary)' }}>
              Public safety policy
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6 }}>
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
