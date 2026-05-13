import Seo from '../components/Seo'
import ContactForm from '../components/ContactForm'
import { useEffect, useRef } from 'react'

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useInView()
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      <Seo title="Contact | ComputerExpress" description="Request a free audit and start with practical next steps" path="/contact" />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Get in touch</div>
            <h1>Request a free audit and start with practical next steps</h1>
            <p>Tell us what you are trying to improve: lead quality, rankings, local visibility, offer clarity, or website credibility.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: '7rem' }}>
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
              <ContactForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
