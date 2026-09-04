import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'

const CITIES = [
  {
    name: 'St. Catharines',
    url: 'https://www.stcatharines.ca/',
    agendaNote: 'Council agendas, minutes and public notices',
  },
  {
    name: 'Welland',
    url: 'https://www.welland.ca/',
    agendaNote: 'Council agendas, minutes and public notices',
  },
  {
    name: 'Thorold',
    url: 'https://www.thorold.ca/',
    agendaNote: 'Council agendas, minutes and public notices',
  },
]

export default function CouncilPage() {
  return (
    <>
      <Seo
        title="City Council — St. Catharines, Welland & Thorold"
        description="Official city council agendas, minutes and decisions for St. Catharines, Welland and Thorold. Links to primary municipal sources only."
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
            Official Sources
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)',
            fontWeight: 650,
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem'
          }}>
            City Council
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            maxWidth: '36rem',
            lineHeight: 1.55
          }}>
            Agendas, minutes and decisions from the three cities. We only link to official municipal documents.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0.5rem' }}>
        <div className="container" style={{ display: 'grid', gap: '1rem', maxWidth: '42rem' }}>
          {CITIES.map((city) => (
            <article
              key={city.name}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1.35rem 1.5rem'
              }}
            >
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                {city.name}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                {city.agendaNote}
              </p>
              <a
                href={city.url}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                Official city website ↗
              </a>
            </article>
          ))}

          <div style={{
            marginTop: '1rem',
            padding: '1.1rem 1.25rem',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.18)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}>
            <strong style={{ color: 'var(--primary)' }}>How we report</strong>
            <br />
            CouncilWatch only summarizes official agendas, minutes, bylaws and staff reports published by the three cities. No social media or secondary sources.
          </div>

          <p style={{ marginTop: '0.5rem' }}>
            <Link to="/planning-tracker" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
              Also see Planning Tracker →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
