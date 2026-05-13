import Seo from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'

const posts = [
  {
    slug: 'local-seo-checklist-2026',
    title: 'The Complete Local SEO Checklist for Service Businesses in 2026',
    excerpt: 'Everything you need to rank #1 on Google Maps and local search. From Google Business Profile optimization to local link building -- the definitive checklist.',
    date: '2026-05-13',
    readTime: '8 min read',
    tags: ['Local SEO', 'Google Business Profile', 'Checklist'],
    keywords: ['local SEO checklist', 'Google Business Profile optimization', 'local SEO for service businesses', 'local search ranking'],
  },
  {
    slug: 'how-to-get-more-leads-from-website',
    title: 'How to Get More Leads from Your Service Business Website',
    description: 'Your website should be your best salesperson. Learn the 7 proven strategies that turn website visitors into qualified leads -- from conversion-focused design to strategic CTAs.',
    date: '2026-05-13',
    readTime: '6 min read',
    tags: ['Lead Generation', 'Web Design', 'Conversion'],
    keywords: ['get more leads from website', 'service business lead generation', 'website conversion optimization'],
  },
  {
    slug: 'technical-seo-explained',
    title: 'Technical SEO Explained: What It Is and Why Your Business Needs It',
    excerpt: 'Technical SEO is the foundation of rankings. Learn what it covers -- site speed, schema markup, crawlability, mobile-first -- and why it matters for local service businesses.',
    date: '2026-05-13',
    readTime: '7 min read',
    tags: ['Technical SEO', 'Schema', 'Site Speed'],
    keywords: ['what is technical SEO', 'technical SEO for small business', 'technical SEO basics'],
  },
]

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'ComputerExpress Blog',
  description: 'Expert insights on web design, local SEO, and digital growth for service businesses.',
  url: 'https://computerexpress.pages.dev/blog',
}

export default function BlogPage() {
  return (
    <>
      <Seo
        title="Blog | Web Design & Local SEO Tips for Service Businesses | ComputerExpress"
        description="Expert insights on web design, local SEO, Google Business Profile optimization, and digital growth strategies for service businesses."
        path="/blog"
        jsonLd={blogJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero" aria-label="Blog">
        <div className="container">
          <AnimatedSection>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Blog</div>
            <h1>Web Design & Local SEO Tips for Service Businesses</h1>
            <p>Expert insights on how to rank higher on Google, get more leads, and build a website that actually works for your business.</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" aria-label="Blog posts">
        <div className="container">
          <div className="card-grid three-up page-block stagger-children">
            {posts.map((post) => (
              <AnimatedSection key={post.slug} delay={post.index * 100}>
                <article className="info-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {post.tags.map(tag => (
                      <span key={tag} className="portfolio-tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
                    ))}
                  </div>
                  <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    <Link to={`/blog/${post.slug}`} style={{ color: 'var(--text-bright)' }}>
                      {post.title}
                    </Link>
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem', flexGrow: 1 }}>
                    {post.excerpt || post.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--muted-lite)' }}>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" aria-label="Newsletter CTA">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Get SEO tips delivered to your inbox</h2>
                <p>Join our newsletter for actionable web design and local SEO insights.</p>
              </div>
              <Link to="/contact" className="button button-primary">Subscribe</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
