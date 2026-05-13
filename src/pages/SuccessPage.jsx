import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

export default function SuccessPage() {
  return (
    <>
      <Seo title="Request Received | ComputerExpress" path="/success" />
      <section className="section-first page-hero">
        <div className="container center-panel">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '2px solid rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.75rem'
          }}>✓</div>
          <h1>Request received</h1>
          <p>Thanks — your audit request has been submitted. We'll review your site and get back to you within 1-2 business days.</p>
          <div className="hero-actions center-actions" style={{ marginTop: '1.5rem' }}>
            <Link to="/" className="button button-primary">Back to Home</Link>
            <Link to="/services" className="button button-secondary">View Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
