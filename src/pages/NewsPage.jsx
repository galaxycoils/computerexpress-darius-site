import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Local News — Coming Soon',
  url: BASE_URL + '/news',
  description:
    'St. Catharines Digital is building a local news page with attributed link-outs from Niagara\'s news sources.',
  admissionToAttendance: 'Coming Soon',
}

export default function NewsPage() {
  return (
    <>
      <Seo
        title="Local News — Coming Soon | St. Catharines Digital"
        description="St. Catharines Digital is building a local news page with attributed link-outs from Niagara's news sources. RSS feeds are being verified — check back soon."
        jsonLd={jsonLd}
      />

      <main
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          background: 'var(--surface)',
          borderRadius: '16px',
          margin: '2rem auto',
          maxWidth: '720px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
          >
            <path d="M12 2a10 10 0 1 0 10 10h-10V2z" />
            <path d="M12 12 16 9v6l-4-3z" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 650,
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}
        >
          Local News — Coming Soon
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '480px',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          We're building a local news page with attributed link-outs from Niagara's news sources,
          including the St. Catharines Standard, Niagara This Week, Welland Tribune, and Niagara Falls Review.
          RSS feeds are being verified — check back soon.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/news/police"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              background: 'var(--primary)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            Police Releases (live)
          </Link>

          <Link
            to="/planning-tracker"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.25rem',
              background: 'transparent',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
              borderRadius: '8px',
              fontWeight: 500,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Planning Tracker
          </Link>
        </div>
      </main>
    </>
  )
}
