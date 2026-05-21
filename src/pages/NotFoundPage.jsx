import React from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found | St. Catharines Digital" noIndex />
      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <span style={{ fontSize: '6rem', display: 'block', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(18, 214, 255, 0.3))' }} aria-hidden="true">
            404
          </span>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Page Not Found</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--muted)', marginBottom: '2rem' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center', gap: '1rem' }}>
            <Link to="/" className="button button-primary">
              Go to Homepage
            </Link>
            <Link to="/services" className="button button-secondary">
              View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
