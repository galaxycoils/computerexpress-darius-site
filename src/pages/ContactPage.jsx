import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'
import AnimatedSection from '../hooks/useInView'
import { useNavigate } from 'react-router-dom'

export default function ContactPage() {
  const navigate = useNavigate()

  function handleFormSuccess() {
    // Navigate to success page after a brief delay so user sees the success state
    setTimeout(() => navigate('/success'), 1500)
    // Update URL immediately for UX
    window.history.replaceState(null, '', '/contact?sent=1')
  }

  return (
    <>
      <Seo title="Contact | ComputerExpress" description="Request a free audit and start with practical next steps" path="/contact" />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow eyebrow-center">Get in touch</div>
            <h1>Request a free audit and start with practical next steps</h1>
            <p>Tell us what you are trying to improve: lead quality, rankings, local visibility, offer clarity, or website credibility.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-pad-bottom-lg">
        <div className="container">
          <div className="contact-panel">
            <AnimatedSection>
              <div>
                <h2>What to expect</h2>
                <p>A good first response should identify friction, explain the highest-leverage fixes, and clarify what should be built first.</p>
                <div className="stacked-notes">
                  <div className="mini-card">
                    <strong>Good for</strong>
                    <span>Service businesses, local brands, redesigns, SEO cleanup, GBP alignment</span>
                  </div>
                  <div className="mini-card">
                    <strong>Best inputs</strong>
                    <span>Your website, service area, main offer, and the leads you want more of</span>
                  </div>
                  <div className="mini-card">
                    <strong>Response time</strong>
                    <span>We typically respond within 24 hours on business days</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <ContactForm onSuccess={handleFormSuccess} />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
