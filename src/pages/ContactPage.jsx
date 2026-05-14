import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'
import AnimatedSection from '../hooks/useInView'
import { useNavigate } from 'react-router-dom'

const CALENDLY_URL = 'https://calendly.com/tahamtandariush/30min'

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact ComputerExpress',
  url: 'https://computerexpress.pages.dev/contact',
  description: 'Contact ComputerExpress for web design and local SEO services.'
}

export default function ContactPage() {
  const navigate = useNavigate()

  function handleFormSuccess() {
    setTimeout(() => navigate('/success'), 1500)
    window.history.replaceState(null, '', '/contact?sent=1')
  }

  return (
    <>
      <Seo
        title="Contact | ComputerExpress — Web Design & Local SEO"
        description="Contact ComputerExpress for web design, technical SEO, and local SEO services. Book a free 30-minute call or send us a message."
        path="/contact"
        jsonLd={contactPageJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" aria-label="Contact form">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow eyebrow-center">Get in touch</div>
            <h1>Let's talk about your project</h1>
            <p>Book a free 30-minute call or send us a message.</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="button button-primary">Book a Free Call</a>
              <a href="tel:+13653595973" className="button button-secondary">Call (365) 359-5973</a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-pad-bottom-lg" aria-label="Contact details and form">
        <div className="container">
          <div className="contact-panel">
            <AnimatedSection>
              <div>
                <h2>Send a message</h2>
                <p>We'll identify the highest-leverage improvements for your site and clarify what to build first.</p>

                <div className="stacked-notes">
                  <div className="mini-card">
                    <strong>Good for</strong>
                    <span>Service businesses, local brands, redesigns, SEO cleanup, GBP alignment</span>
                  </div>
                  <div className="mini-card">
                    <strong>Response time</strong>
                    <span>We typically respond within 24 hours on business days</span>
                  </div>
                  <div className="mini-card">
                    <strong>Prefer to talk?</strong>
                    <span><a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{color:'var(--primary)',textDecoration:'none'}}>Book a 30-minute call</a> or <a href="tel:+13653595973" style={{color:'var(--primary)',textDecoration:'none'}}>call us</a></span>
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
