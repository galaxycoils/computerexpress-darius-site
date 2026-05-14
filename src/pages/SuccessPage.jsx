import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

export default function SuccessPage() {
  return (
    <>
      <Seo
        title="Request Received | St. Catharines Digital"
        path="/success"
        noIndex
      />
      <section className="section-first page-hero" aria-label="Success confirmation">
        <div className="container center-panel">
          <div className="success-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1>Request received</h1>
          <p>Thanks — your audit request has been submitted. We'll review your site and get back to you within 1-2 business days.</p>
          <div className="hero-actions center-actions success-actions">
            <Link to="/" className="button button-primary">Back to Home</Link>
            <Link to="/services" className="button button-secondary">View Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
