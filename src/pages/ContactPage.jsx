import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import ContactForm from '../components/ContactForm'
import { getLocalBusinessSchema } from '../data/schema'
import { siteConfig } from '../data/siteConfig'

const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact St. Catharines Digital',
  url: `${BASE_URL}/contact`,
  description: 'Contact St. Catharines Digital about our Planning Alert newsletter, municipal news coverage, and local advertising opportunities.',
  about: 'St. Catharines Digital is a municipal news platform tracking official council, police, and planning notices across the Niagara Region.',
  knowsLanguage: ['English'],
  knowsAbout: ['Municipal News', 'Planning Alerts', 'Local Government Coverage', 'Editorial Independence'],
  areaServed: {
    '@type': 'City',
    name: 'St. Catharines',
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Ontario' },
    addressCountry: { '@type': 'Country', name: 'Canada' }
  }
}

const localBusinessJsonLd = getLocalBusinessSchema()

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` }
  ]
}

export default function ContactPage() {
  return (
    <>
      <Seo
        title="Contact | St. Catharines Digital — Editorial & Advertising Inquiries"
        description="Contact the St. Catharines Digital editorial team about Planning Alert sponsorship, press inquiries, or corrections."
        path="/contact"
        jsonLd={[contactPageJsonLd, localBusinessJsonLd, breadcrumbJsonLd]}
      />
      <main className="contact-page">
        <section className="contact-hero">
          <h1>Editorial & Advertising Contact</h1>
          <p className="lead">St. Catharines Digital tracks official municipal notices across the Niagara Region. For editorial inquiries, sponsorship opportunities, or corrections, reach out below.</p>
        </section>
        <ContactForm />
        <section className="contact-info">
          <h2>Connect With Us</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <h3>Planning Alert Sponsorship</h3>
              <p>Founding pilot at $300/mo. One placement per send, editorial firewall guaranteed.</p>
              <Link to="/planning-tracker" className="btn">View Planning Tracker</Link>
            </div>
            <div className="contact-card">
              <h3>Press & Corrections</h3>
              <p>All sources are official municipal domains. Report errors or request corrections.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
