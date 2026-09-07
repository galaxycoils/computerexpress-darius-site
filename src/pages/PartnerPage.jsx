import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { getLocalBusinessSchema } from '../data/schema'
import { siteConfig } from '../data/siteConfig'

const partnerPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Partner With St. Catharines Digital',
  url: `${BASE_URL}/partner`,
  description: 'Sponsor the Planning Alert newsletter. Official municipal news coverage with guaranteed editorial independence.',
  knowsAbout: ['Municipal News', 'Planning Alerts', 'Local Advertising', 'Editorial Independence']
}

export default function PartnerPage() {
  return (
    <>
      <Seo
        title="Partner With Us | St. Catharines Digital"
        description="Sponsor the Planning Alert newsletter. Official municipal news coverage across St. Catharines, Welland, Thorold, and Niagara Region. Editorial independence guaranteed."
        path="/partner"
        jsonLd={[partnerPageJsonLd, getLocalBusinessSchema()]}
      />
      <main className="partner-page">
        <section className="partner-hero">
          <h1>Partner With Us</h1>
          <p className="lead">St. Catharines Digital tracks official municipal notices and publishes verified news from the Niagara Region. Sponsor the Planning Alert newsletter and reach residents, businesses, and officials who rely on official municipal data.</p>
        </section>
        <section className="partner-content">
          <h2>What We Offer</h2>
          <div className="partner-grid">
            <div className="partner-card">
              <h3>Planning Alert Newsletter</h3>
              <p>Founding sponsor at $300/mo. One primary placement per send. Editorial firewall guaranteed — sponsors cannot influence editorial content.</p>
              <Link to="/planning-tracker" className="btn">View Planning Tracker</Link>
            </div>
            <div className="partner-card">
              <h3>Website Development</h3>
              <p>Professional municipal and business websites. Starting at $1,500 for a custom landing page.</p>
              <Link to="/planning-tracker" className="btn">Learn More</Link>
            </div>
            <div className="partner-card">
              <h3>Local Authority SEO</h3>
              <p>Google Business Profile optimization, local search strategy, and monthly reporting for service businesses in Niagara.</p>
              <Link to="/planning-tracker" className="btn">Learn More</Link>
            </div>
          </div>
          <div className="editorial-independence">
            <h2>Editorial Independence Policy</h2>
            <p>All editorial content is independent of sponsorship. Sponsors receive placement — they do not receive editorial control. All sources are verified official municipal domains.</p>
          </div>
        </section>
      </main>
    </>
  )
}
