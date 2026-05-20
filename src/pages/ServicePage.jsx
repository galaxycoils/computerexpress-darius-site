import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { IconWeb, IconSearch, IconMap } from '../components/Icons'

const serviceData = {
  'website-design': {
    icon: 'web',
    title: 'Website Design for Service Businesses',
    headline: 'Premium Websites That Rank on Google and Convert Visitors',
    description: 'Custom websites built for service businesses that need better visibility, more qualified leads, and a professional online presence. Every site includes technical SEO, mobile-first design, and conversion optimization.',
    keywords: ['website design', 'web design for service businesses', 'custom website', 'responsive web design'],
    features: [
      'Custom design tailored to your brand and industry',
      'Mobile-first responsive design (70% of local searches are on mobile)',
      'Technical SEO foundation (schema markup, speed, crawlability)',
      'Conversion-optimized layout with clear CTAs',
      'Service area pages for every city you serve',
      'Google Business Profile integration',
      'Contact forms with email notifications',
      'Analytics setup and monthly reporting',
    ],
    process: [
      { title: 'Discovery', desc: 'We learn about your business, customers, and goals.' },
      { title: 'Design', desc: 'Custom mockups and revisions until it\'s perfect.' },
      { title: 'Build', desc: 'Development with SEO, speed, and mobile-first focus.' },
      { title: 'Launch', desc: 'Go live with tracking, analytics, and optimization.' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Website Design',
      description: 'Custom website design for service businesses. Mobile-first, SEO-optimized, conversion-focused.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: 'https://stcatharinesdigital.pages.dev' },
      areaServed: [{ '@type': 'City', name: 'St. Catharines' }, { '@type': 'State', name: 'Ontario' }],
    },
  },
  'technical-seo': {
    icon: 'search',
    title: 'Technical SEO Services',
    headline: 'Technical SEO That Makes Google Love Your Website',
    description: 'Technical SEO is the foundation of rankings. We optimize site speed, schema markup, crawlability, and Core Web Vitals to help your service business rank higher and get more organic traffic.',
    keywords: ['technical SEO', 'SEO audit', 'site speed optimization', 'schema markup', 'Core Web Vitals'],
    features: [
      'Comprehensive technical SEO audit',
      'Site speed optimization (target: 90+ PageSpeed)',
      'Schema markup implementation (LocalBusiness, Service, FAQ, Review)',
      'Core Web Vitals optimization (LCP, FID, CLS)',
      'XML sitemap creation and submission',
      'robots.txt optimization',
      'Canonical URL and duplicate content fixes',
      'Mobile-first indexing verification',
    ],
    process: [
      { title: 'Audit', desc: 'Full technical analysis of your current site.' },
      { title: 'Fix', desc: 'Resolve crawl errors, speed issues, and markup gaps.' },
      { title: 'Optimize', desc: 'Implement schema, improve Core Web Vitals.' },
      { title: 'Monitor', desc: 'Ongoing tracking and monthly reports.' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Technical SEO',
      description: 'Technical SEO services including audits, site speed optimization, schema markup, and Core Web Vitals.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: 'https://stcatharinesdigital.pages.dev' },
      areaServed: [{ '@type': 'City', name: 'St. Catharines' }, { '@type': 'State', name: 'Ontario' }],
    },
  },
  'gbp-optimization': {
    icon: 'map',
    title: 'Google Business Profile Optimization',
    headline: 'Dominate Google Maps and Local Search Results',
    description: 'Get found by customers searching for your services in your area. We optimize your Google Business Profile to rank #1 in the Local Pack and drive more calls, visits, and inquiries.',
    keywords: ['Google Business Profile', 'GBP optimization', 'Google Maps ranking', 'local SEO', 'local pack'],
    features: [
      'Complete GBP setup and verification',
      'Keyword-optimized business description',
      'Service and product listings',
      'Photo and video optimization',
      'Review generation strategy',
      'Weekly Google Posts',
      'Q&A optimization',
      'Local citation building',
    ],
    process: [
      { title: 'Setup', desc: 'Claim, verify, and fully optimize your profile.' },
      { title: 'Content', desc: 'Add services, photos, posts, and Q&A.' },
      { title: 'Reviews', desc: 'Implement review generation system.' },
      { title: 'Grow', desc: 'Ongoing optimization and monthly reporting.' },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Google Business Profile Optimization',
      description: 'Google Business Profile optimization to rank #1 on Google Maps and local search.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: 'https://stcatharinesdigital.pages.dev' },
      areaServed: [{ '@type': 'City', name: 'St. Catharines' }, { '@type': 'State', name: 'Ontario' }],
    },
  },
}

const iconMap = { web: IconWeb, search: IconSearch, map: IconMap }

export default function ServicePage({ slug }) {
  const service = serviceData[slug]

  if (!service) {
    return (
      <>
        <Seo title="Service Not Found | St. Catharines Digital" path="/services" noIndex />
        <section className="section-first page-hero">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Service not found</h1>
            <p><Link to="/services" style={{ color: 'var(--primary)' }}>← Back to services</Link></p>
          </div>
        </section>
      </>
    )
  }

  const Icon = iconMap[service.icon]

  const webpageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${service.title} | St. Catharines Digital`,
    url: `https://stcatharinesdigital.pages.dev/services/${slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'p']
    }
  }

  return (
    <>
      <Seo
        title={`${service.title} | St. Catharines Digital`}
        description={service.description}
        path={`/services/${slug}`}
        type="service"
        jsonLd={[service.jsonLd, webpageJsonLd]}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>{service.title}</div>
            <h1>{service.headline}</h1>
            <p style={{ fontSize: '1.1rem', maxWidth: '700px' }}>{service.description}</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <Link to="/contact" className="button button-primary">Get a Free Audit</Link>
              <Link to="/services" className="button button-secondary">View All Services</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="What's included">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <h2>What's included</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              {service.features.map((feature, i) => (
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
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt" aria-label="Process">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <h2>How it works</h2>
            <ol className="step-list" style={{ marginTop: '1.5rem' }}>
              {service.process.map((step, i) => (
                <li key={i}>
                  <span aria-hidden="true">{i + 1}</span>
                  <div>
                    <strong style={{ color: 'var(--text-bright)', display: 'block', marginBottom: '0.25rem' }}>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: '7rem' }}>
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to get started?</h2>
                <p>Get a free audit and see how we can help your business rank higher.</p>
              </div>
              <Link to="/contact" className="button button-primary">Get Free Audit</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

export { serviceData }
