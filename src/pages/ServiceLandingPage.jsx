import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'

const servicePages = [
  {
    slug: 'web-design-for-plumbers',
    title: 'Web Design for Plumbers',
    headline: 'Plumbing Websites That Rank #1 and Generate More Calls',
    description: 'Custom plumbing websites built to rank on Google, showcase your services, and convert visitors into phone calls. Local SEO included.',
    keywords: ['plumber web design', 'plumbing website', 'plumber SEO', 'plumbing company website'],
    services: [
      'Service area pages for every city you serve',
      'Emergency call CTA on every page',
      'Service-specific landing pages (drain cleaning, water heater, etc.)',
      'Google Business Profile optimization',
      'Review generation system',
      'Mobile-first design (70% of local searches are on mobile)',
    ],
    cta: 'Get a Free Plumbing Website Audit',
  },
  {
    slug: 'web-design-for-hvac',
    title: 'Web Design for HVAC Companies',
    headline: 'HVAC Websites That Rank Higher and Book More Jobs',
    description: 'HVAC websites built for local search dominance. Rank for "HVAC near me", "AC repair [city]", and "furnace installation".',
    keywords: ['HVAC web design', 'HVAC website', 'HVAC SEO', 'AC repair website'],
    services: [
      'Seasonal service pages (AC repair, furnace installation, maintenance)',
      'Service area optimization for every neighborhood',
      'Emergency service CTAs with click-to-call',
      'Maintenance plan landing pages',
      'Local SEO and Google Maps optimization',
      'Review and testimonial integration',
    ],
    cta: 'Get a Free HVAC Website Audit',
  },
  {
    slug: 'web-design-for-electricians',
    title: 'Web Design for Electricians',
    headline: 'Electrician Websites That Generate More Service Calls',
    description: 'Professional electrician websites that rank on Google and convert visitors into booked jobs. Built for local service businesses.',
    keywords: ['electrician web design', 'electrician website', 'electrician SEO', 'electrical contractor website'],
    services: [
      'Residential and commercial service pages',
      'Emergency electrician CTAs',
      'Service area pages for every city',
      'License and certification display',
      'Google Business Profile optimization',
      'Review generation and display',
    ],
    cta: 'Get a Free Electrician Website Audit',
  },
  {
    slug: 'local-seo-for-service-businesses',
    title: 'Local SEO for Service Businesses',
    headline: 'Local SEO That Puts You on Top of Google Maps',
    description: 'Dominate local search results for your service area. Get found by customers searching for your services in your city.',
    keywords: ['local SEO service', 'local SEO for service businesses', 'Google Maps ranking', 'local search optimization'],
    services: [
      'Google Business Profile setup and optimization',
      'Local keyword research and targeting',
      'Service area page creation',
      'Review generation strategy',
      'Local link building',
      'Monthly ranking reports',
    ],
    cta: 'Get a Free Local SEO Audit',
  },
]

export default function ServiceLandingPage({ slug }) {
  const page = servicePages.find(p => p.slug === slug)

  if (!page) {
    return (
      <>
        <Seo title="Page Not Found | St. Catharines Digital" path="/services" noIndex />
        <section className="section-first page-hero">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Page not found</h1>
            <p><Link to="/services" style={{ color: 'var(--primary)' }}>← Back to services</Link></p>
          </div>
        </section>
      </>
    )
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'St. Catharines Digital',
      url: 'https://stcatharinesdigital.pages.dev',
      areaServed: [
        { '@type': 'City', name: 'St. Catharines' },
        { '@type': 'State', name: 'Ontario' },
      ],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: page.title,
      itemListElement: page.services.map((s, i) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s },
      })),
    },
  }

  return (
    <>
      <Seo
        title={`${page.title} | St. Catharines Digital`}
        description={page.description}
        path={`/services/${slug}`}
        type="service"
        jsonLd={jsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>St. Catharines Digital</div>
            <h1>{page.headline}</h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>{page.description}</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/contact" className="button button-primary">{page.cta}</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <h2>What's Included</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              {page.services.map((service, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}>
                  <span style={{ color: 'var(--success)', fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <h2>Why Service Businesses Need Specialized Web Design</h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              Generic websites don't rank for local service searches. Your website needs to be built specifically for how customers search for services in their area — things like "plumber near me", "HVAC repair St. Catharines", or "emergency electrician Ontario".
            </p>
            <p style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              St. Catharines Digital builds websites with local SEO baked in from day one. Every page is structured to rank for your target keywords, every service area gets its own optimized page, and your Google Business Profile is fully integrated.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to dominate local search?</h2>
                <p>Get a free audit and see where your website stands.</p>
              </div>
              <Link to="/contact" className="button button-primary">{page.cta}</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

export { servicePages }
