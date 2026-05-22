import { useParams, Link } from 'react-router-dom'
import Seo, { BASE_URL } from '../components/Seo'
import AnimatedSection from '../hooks/useInView'
import { HeroIllustration } from '../components/Icons'

const CITIES = {
  'st-catharines': { name: 'St. Catharines', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92982.52737648037!2d-79.31498188172935!3d43.18431093557997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d35054bb6a5a4d%3A0x8898124238e8cb80!2sSt.%20Catharines%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' },
  'niagara-falls': { name: 'Niagara Falls', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93139.19794026365!2d-79.16723238680702!3d43.08471243147514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d34307a51130d1%3A0xb35a0d33e9b110a5!2sNiagara%20Falls%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' },
  'welland': { name: 'Welland', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93290.41926639832!2d-79.31976077884126!3d42.98335431665673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d34b127ba2f8c5%3A0x6b80afc381c15f01!2sWelland%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' },
  'grimsby': { name: 'Grimsby', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92942.34567812345!2d-79.62012345678901!3d43.21012345678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9c1234567890%3A0x1234567890abcdef!2sGrimsby%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' },
  'thorold': { name: 'Thorold', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93100.12345678901!2d-79.25012345678901!3d43.11012345678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d3512345678901%3A0x1234567890abcdef!2sThorold%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' },
  'fort-erie': { name: 'Fort Erie', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d93300.12345678901!2d-79.05012345678901!3d42.91012345678901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d3412345678901%3A0x1234567890abcdef!2sFort%20Erie%2C%20ON!5e0!3m2!1sen!2sca!4v1716390123456!5m2!1sen!2sca' }
}

const SERVICES = {
  'web-design': {
    name: 'Web Design',
    keyword: 'web design',
    description: 'Custom, high-performance websites built for service businesses. Get a premium online presence that turns visitors into phone calls and booked jobs.',
    features: ['Mobile-first responsive design', 'Fast loading times (PageSpeed 100)', 'Conversion-focused layouts', 'Clear calls-to-action (CTAs)', 'Review & Testimonial integration'],
    whyHeadline: 'Why You Need Professional Web Design',
    whyText: 'A generic template won\'t cut it in today\'s competitive market. Customers evaluate your business within 3 seconds of landing on your site. If it looks outdated, loads slowly, or is hard to use on mobile, they will bounce to a competitor. We build websites that establish instant trust and guide users directly to booking your services.'
  },
  'local-seo': {
    name: 'Local SEO',
    keyword: 'local SEO',
    description: 'Dominate the Google Maps Pack and local search results. We optimize your online presence so customers find you first when searching for services nearby.',
    features: ['Google Business Profile optimization', 'Local keyword targeting', 'Citation building & management', 'Review generation strategies', 'On-page technical SEO'],
    whyHeadline: 'Why Local SEO Matters for Your Business',
    whyText: 'When someone searches for a service in their area, they rarely scroll past the top 3 results in the Google Maps Pack. If your business isn\'t there, you are losing leads to competitors every single day. Our local SEO strategy ensures your business is highly visible exactly when local customers have a high intent to purchase.'
  }
}

export default function LocalServiceAreaPage({ serviceSlug: propServiceSlug, citySlug: propCitySlug }) {
  const params = useParams()
  
  // Use props if provided (for static rendering flexibility), otherwise use URL params
  const serviceSlug = propServiceSlug || params.serviceSlug
  const citySlug = propCitySlug || params.citySlug

  const city = CITIES[citySlug]
  const service = SERVICES[serviceSlug]

  if (!city || !service) {
    return (
      <>
        <Seo title="Page Not Found | St. Catharines Digital" path={`/service-areas/${serviceSlug}/${citySlug}`} noIndex />
        <section className="section-first page-hero">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Location or Service Not Found</h1>
            <p><Link to="/services" style={{ color: 'var(--primary)' }}>← Back to services</Link></p>
          </div>
        </section>
      </>
    )
  }

  const pageTitle = `${service.name} in ${city.name}, ON | St. Catharines Digital`
  const metaDescription = `Looking for the best ${service.keyword} in ${city.name}, Ontario? St. Catharines Digital provides top-rated ${service.keyword.toLowerCase()} services to help your local business grow and get more leads.`
  const urlPath = `/service-areas/${serviceSlug}/${citySlug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}`,
    description: metaDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'St. Catharines Digital',
      url: BASE_URL,
      areaServed: {
        '@type': 'City',
        name: city.name,
        containedInPlace: { '@type': 'State', name: 'Ontario' }
      }
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: { '@type': 'State', name: 'Ontario' }
    }
  }

  const webpageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    url: `${BASE_URL}${urlPath}`,
    description: metaDescription
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: `${service.name} in ${city.name}`, item: `${BASE_URL}${urlPath}` }
    ]
  }

  return (
    <>
      <Seo
        title={pageTitle}
        description={metaDescription}
        path={urlPath}
        type="service"
        jsonLd={[jsonLd, webpageJsonLd, breadcrumbJsonLd]}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container hero-grid">
          <div>
            <AnimatedSection>
              <div className="eyebrow">{city.name} Service Area</div>
              <h1 className="h1">
                Top-Rated <span className="gradient-text">{service.name}</span> in {city.name}, ON
              </h1>
              <p style={{ fontSize: '1.1rem', maxWidth: '700px', marginBottom: '2rem' }}>
                {service.description} We are proud to serve businesses in {city.name} and the surrounding Niagara region.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="button button-primary">Get a Free Consultation</Link>
                <Link to="/services" className="button button-secondary">View All Services</Link>
              </div>
            </AnimatedSection>
          </div>
          <div className="hero-card">
            <HeroIllustration className="hero-illustration" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <h2>{service.whyHeadline} in {city.name}</h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-bright)' }}>
              {service.whyText}
            </p>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              For businesses operating in {city.name}, standing out online is critical. 
              Whether you are looking to revamp your online presence with professional {service.keyword.toLowerCase()}, 
              or you want to generate more targeted leads from local customers, we have the expertise to deliver results.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>What's Included in our {service.name} Package</h2>
              <p>Everything you need to succeed in {city.name}.</p>
            </div>
            <div className="card-grid three-up page-block stagger-children">
               {service.features.map((feature, i) => (
                <article key={i} className="info-card">
                  <div style={{ color: 'var(--success)', fontSize: '1.5rem', marginBottom: '1rem' }} aria-hidden="true">✓</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-bright)' }}>{feature}</h3>
                </article>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container">
           <AnimatedSection>
            <div className="section-heading">
              <div className="glow-line" aria-hidden="true"></div>
              <h2>Serving {city.name} & The Niagara Region</h2>
              <p>We are a local agency committed to helping businesses in {city.name} thrive.</p>
            </div>
            
            <div className="page-block" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--panel-border)', height: '400px' }}>
              <iframe 
                src={city.mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${city.name}, ON`}
              ></iframe>
            </div>
           </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingBottom: '7rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to grow your {city.name} business?</h2>
                <p>Contact us today to discuss your {service.name.toLowerCase()} needs and get a free project estimate.</p>
              </div>
              <Link to="/contact" className="button button-primary">Start Your Project</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

export { CITIES, SERVICES }
