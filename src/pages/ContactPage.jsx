import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact | ComputerExpress" description="Request a free audit and start with practical next steps" path="/contact" />
      <section className="section-first page-hero">
        <div className="container">
          <h1>Request a free audit and start with practical next steps</h1>
          <p>Tell ComputerExpress what you are trying to improve: lead quality, rankings, local visibility, offer clarity, or website credibility.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-panel">
          <div>
            <h2>What to expect</h2>
            <p>A good first response should identify friction, explain the highest-leverage fixes, and clarify what should be built first.</p>
            <div className="stacked-notes">
              <div className="mini-card">
                <strong>Good for:</strong>
                <span>service businesses, local brands, redesigns, SEO cleanup, GBP alignment</span>
              </div>
              <div className="mini-card">
                <strong>Best inputs:</strong>
                <span>your website, service area, main offer, and the leads you want more of</span>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
