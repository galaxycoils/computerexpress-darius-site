import Seo from '../components/Seo'
import { Link } from 'react-router-dom'

export default function SuccessPage() {
  return (
    <>
      <Seo title="Request Received | ComputerExpress" path="/success" />
      <section className="section-first page-hero narrow center-panel">
        <div className="container">
          <h1>Request received</h1>
          <p>Thanks — your audit request has been submitted. We'll review your site and get back to you within 1–2 business days.</p>
          <div className="hero-actions center-actions">
            <Link to="/" className="button button-primary">Back to Home</Link>
            <Link to="/services" className="button button-secondary">View Services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
