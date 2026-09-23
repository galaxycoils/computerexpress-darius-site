import { Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import NewsletterPanel from '../components/news/NewsletterPanel'
import './reader-services.css'

const SERVICES = [
  { title: 'Local newsletter', text: 'Sign up for local updates. Confirm your email to join the mailing list.', to: '#subscribe', action: 'Sign up', tone: 'green' },
  { title: 'Planning alerts', text: 'Follow hearings, development applications and changes to tracked municipal records.', to: '/planning-alerts', action: 'Get planning alerts', tone: 'blue' },
  { title: 'Send a news tip', text: 'Tell the newsroom about a local decision, document, event or issue that deserves attention.', to: '/contact', action: 'Contact the newsroom', tone: 'gold' },
  { title: 'Report a correction', text: 'Identify the exact claim, share the page URL and include a supporting primary source.', to: '/corrections', action: 'Correction process', tone: 'plum' },
  { title: 'Support local reporting', text: 'Help sustain independent, source-linked reporting for Niagara communities.', to: '/membership', action: 'Support the newsroom', tone: 'green' },
  { title: 'RSS and sharing', text: 'Use the News page as the permanent chronological feed while section-specific feeds are prepared.', to: '/news', action: 'Open latest news', tone: 'blue' },
]

const CITIES = [
  ['St. Catharines', '/news/st-catharines'],
  ['Welland', '/news/welland'],
  ['Thorold', '/news/thorold'],
  ['Niagara Falls', '/news/niagara-falls'],
]

export default function ReaderServicesPage() {
  return <>
    <Seo
      title="Reader Services | St. Catharines Digital"
      description="Newsletters, planning alerts, corrections, local tips and reader support for St. Catharines Digital."
      path="/reader-services"
      jsonLd={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Reader Services', url: BASE_URL }}
    />
    <div className="scd-page scd-services-page">
      <header className="scd-services-hero">
        <p className="scd-eyebrow">For readers</p>
        <h1>Reader Services</h1>
        <p>Follow the places and subjects that matter to you, contact the newsroom, or support local reporting—all from one clear starting point.</p>
      </header>
      <nav id="cities" className="scd-city-chooser" aria-labelledby="choose-city-heading">
        <div><p className="scd-section-kicker">Local coverage</p><h2 id="choose-city-heading">Choose your city</h2></div>
        <div className="scd-city-pills">{CITIES.map(([label,to])=><Link key={to} to={to}>{label}<span aria-hidden="true">→</span></Link>)}</div>
      </nav>
      <section aria-labelledby="services-heading">
        <div className="scd-council-section-heading"><div><p className="scd-section-kicker">What can we help with?</p><h2 id="services-heading">Reader tools</h2></div><p>Common tasks are reachable in one step.</p></div>
        <div className="scd-service-grid">{SERVICES.map(service=><article key={service.title} className={`scd-service-card is-${service.tone}`}><h3>{service.title}</h3><p>{service.text}</p><Link to={service.to}>{service.action}<span aria-hidden="true">→</span></Link></article>)}</div>
      </section>
      <section id="subscribe" className="scd-services-subscribe" aria-labelledby="subscribe-heading">
        <div><p className="scd-section-kicker">Stay informed</p><h2 id="subscribe-heading">Join the local mailing list</h2><p>Confirm your email to receive future newsroom updates. A regular newsletter schedule has not been announced.</p></div>
        <NewsletterPanel placement="reader_services" topics={['Council','Planning','Police']} />
      </section>
      <aside className="scd-services-note"><strong>Privacy first.</strong><span>Reader contact details are used only for the service requested. Confirmation and unsubscribe options are provided by email.</span></aside>
    </div>
  </>
}
