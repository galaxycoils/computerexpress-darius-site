import { useState } from 'react'
import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'
import { IconWeb, IconSearch, IconMap } from '../components/Icons'
import AuditMedia, { AUDIT_VIDEO } from '../components/AuditMedia'
import { getLocalBusinessSchema, getVideoObjectSchema } from '../data/schema'
import { serviceAreaCities, siteConfig } from '../data/siteConfig'

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
      { title: 'Design', desc: 'Custom mockups and revisions until the direction is right.' },
      { title: 'Build', desc: 'Development with SEO, speed, and mobile-first focus.' },
      { title: 'Launch', desc: 'Go live with tracking, analytics, and optimization.' },
    ],
    faqs: [
      { q: "How long does a website project take?", a: "A typical project takes 4 weeks from kickoff to launch. We work in structured sprints to ensure your site is delivered on time." },
      { q: "Can I update the website myself?", a: "Yes. We build sites using modular, reusable React components. For text or image updates, you can edit the files directly, or we can configure a headless CMS if requested." },
      { q: "Is hosting and domain setup included?", a: "We set up hosting on high-performance Cloudflare servers (which is free/low cost) and help map your domain. We ensure your configuration is secure and fast." }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Website Design',
      description: 'Custom website design for service businesses. Mobile-first, SEO-optimized, conversion-focused.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: BASE_URL },
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
      'Schema markup implementation where page-visible content supports it',
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
    faqs: [
      { q: "What does technical SEO cover?", a: "Technical SEO covers site structure, speed (Core Web Vitals), mobile responsiveness, XML sitemaps, robots.txt, canonical URLs, and schema structured data markup." },
      { q: "Why is site speed important for SEO?", a: "Google uses speed as a direct ranking signal. Faster websites offer a better user experience, reduce bounce rates, and rank higher on search results." },
      { q: "How do you test site speed?", a: "We use Lighthouse, PageSpeed Insights, and Web Vitals to measure load times and identify bottlenecks in rendering, asset delivery, and execution." }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Technical SEO',
      description: 'Technical SEO services including audits, site speed optimization, schema markup, and Core Web Vitals.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: BASE_URL },
      areaServed: [{ '@type': 'City', name: 'St. Catharines' }, { '@type': 'State', name: 'Ontario' }],
    },
  },
  'gbp-optimization': {
    icon: 'map',
    title: 'Google Business Profile Optimization',
    headline: 'Strengthen Google Maps and Local Search Visibility',
    description: 'Get found by customers searching for your services in your area. We optimize your Google Business Profile to improve trust signals, service clarity, and contact paths.',
    keywords: ['Google Business Profile', 'GBP optimization', 'Google Maps ranking', 'local SEO', 'local pack'],
    features: [
      'Google Business Profile setup and verification support',
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
    faqs: [
      { q: "How long to see results from Google Business Profile optimization?", a: "Most service businesses notice an increase in local map pack views and calls within 30 to 90 days of complete profile optimization." },
      { q: "What is the Google Local Pack?", a: "The Local Pack is the set of 3 map results that appear at the top of Google searches for local terms (e.g. 'plumber near me'). Ranking here drives significant call volume." },
      { q: "Do you handle negative review removal?", a: "We cannot delete negative reviews directly, but we help you set up an automated review generation strategy and write professional responses that build customer trust." }
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Google Business Profile Optimization',
      description: 'Google Business Profile optimization for stronger Google Maps and local search visibility.',
      provider: { '@type': 'LocalBusiness', name: 'St. Catharines Digital', url: BASE_URL },
      areaServed: [{ '@type': 'City', name: 'St. Catharines' }, { '@type': 'State', name: 'Ontario' }],
    },
  },
}

const iconMap = { web: IconWeb, search: IconSearch, map: IconMap }

function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
          <button
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-question-${i}`}
          >
            {item.q}
            <span className="faq-icon" aria-hidden="true">{openIndex === i ? '×' : '+'}</span>
          </button>
          {openIndex === i && (
            <div
              className="faq-answer"
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
            >
              <div className="faq-answer-inner">{item.a}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

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
    url: `${BASE_URL}/services/${slug}`,
    description: service.description,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${BASE_URL}/services`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `${BASE_URL}/services/${slug}`
      }
    ]
  }

  const pageJsonLd = [service.jsonLd, getLocalBusinessSchema(), webpageJsonLd, breadcrumbJsonLd]
  if (slug === 'gbp-optimization') {
    pageJsonLd.push(getVideoObjectSchema({
      name: AUDIT_VIDEO.title,
      description: AUDIT_VIDEO.description,
      path: AUDIT_VIDEO.path,
      thumbnailPath: AUDIT_VIDEO.poster,
    }))
  }

  return (
    <>
      <Seo
        title={`${service.title} | St. Catharines Digital`}
        description={service.description}
        path={`/services/${slug}`}
        type="service"
        jsonLd={pageJsonLd}
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

      {slug === 'gbp-optimization' && (
        <section className="section" aria-label="Google Business Profile launch plan">
          <div className="container">
            <AnimatedSection>
              <div className="gbp-feature-grid">
                <div>
                  <span className="eyebrow">Google Maps readiness</span>
                  <h2>Built for a hidden-address service-area profile</h2>
                  <p>
                    The profile setup uses St. Catharines and Niagara service areas without publishing a private storefront address. Profile links and review CTAs stay disabled until Google verification is complete.
                  </p>
                  <div className="gbp-checklist">
                    <div><strong>Primary category</strong><span>{siteConfig.googleBusinessProfile.primaryCategory}</span></div>
                    <div><strong>Service areas</strong><span>{serviceAreaCities.map(city => city.name).join(', ')}</span></div>
                    <div><strong>Address mode</strong><span>Hidden service-area business</span></div>
                    <div><strong>Status</strong><span>{siteConfig.googleBusinessProfile.verificationNote}</span></div>
                  </div>
                  <div className="gbp-actions">
                    {siteConfig.googleBusinessProfile.profileUrl ? (
                      <a className="button button-primary" href={siteConfig.googleBusinessProfile.profileUrl} target="_blank" rel="noopener noreferrer">View on Google</a>
                    ) : (
                      <button className="button button-secondary" type="button" disabled>Google profile pending verification</button>
                    )}
                    <Link className="button button-primary" to="/free-audit">Start Free Audit</Link>
                  </div>
                </div>
                <div className="gbp-media-stack">
                  <img src="/images/gbp/maps-visibility.webp" alt="Google Maps visibility diagnostic for Niagara service areas" loading="lazy" />
                  <AuditMedia title="Audit walkthrough preview" description="Preview how we verify Maps, mobile, and conversion gaps before making recommendations." />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

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

      <section className="section" aria-label="Frequently asked questions">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <div className="section-heading" style={{ marginBottom: '2rem' }}>
              <h2>Frequently asked questions</h2>
              <p>Common questions about our {service.title} services.</p>
            </div>
            <FAQAccordion items={service.faqs} />
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt" style={{ paddingBottom: '7rem' }}>
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
