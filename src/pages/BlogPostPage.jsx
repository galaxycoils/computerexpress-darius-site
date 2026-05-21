import Seo, { BASE_URL } from '../components/Seo'
import { Link } from 'react-router-dom'
import AnimatedSection from '../hooks/useInView'

// Blog post content database
const blogPosts = {
  'local-seo-checklist-2026': {
    title: 'The Complete Local SEO Checklist for Service Businesses in 2026',
    date: '2026-05-13',
    readTime: '8 min read',
    tags: ['Local SEO', 'Google Business Profile', 'Checklist'],
    author: 'St. Catharines Digital',
    content: `
## Why Local SEO Matters for Service Businesses

If you're a plumber, HVAC company, electrician, lawyer, or any service business, your customers are searching Google right now. The question is: will they find you or your competitor?

Local SEO is the process of optimizing your online presence to appear in local search results. For service businesses, this means showing up in the Google Maps "Local Pack" and organic results when someone searches for your service in your area.

**The stakes are high:**
- 46% of all Google searches have local intent
- 88% of consumers who do a local search visit a store within 24 hours
- 76% of people who search for something nearby visit a business that day

## The Complete Local SEO Checklist

### 1. Google Business Profile Optimization

Your Google Business Profile (GBP) is the single most important factor for local rankings.

- [ ] **Claim and verify** your Google Business Profile
- [ ] **Choose the right primary category** (be specific: "HVAC Contractor" not just "Contractor")
- [ ] **Add all applicable secondary categories** (up to 9)
- [ ] **Write a keyword-rich business description** (750 characters max)
- [ ] **Add your service areas** (cities/neighborhoods you serve)
- [ ] **Set accurate hours** including special hours for holidays
- [ ] **Add all services** with descriptions and pricing where possible
- [ ] **Upload high-quality photos** (exterior, interior, team, work samples)
- [ ] **Enable messaging** and respond within 24 hours
- [ ] **Post weekly updates** (offers, news, tips)

### 2. On-Page SEO for Local Signals

Your website needs to reinforce your local relevance.

- [ ] **Include city/region in title tags** (e.g., "Plumbing Services in St. Catharines | Company Name")
- [ ] **Add NAP (Name, Address, Phone) consistently** across all pages
- [ ] **Create location-specific service pages** (e.g., "/plumbing-st-catharines")
- [ ] **Add LocalBusiness schema markup** to your homepage
- [ ] **Include a Google Map embed** on your contact page
- [ ] **Write unique meta descriptions** for each service page
- [ ] **Use local keywords naturally** in headings and body content

### 3. Reviews and Reputation

Reviews are a top-3 ranking factor for local search.

- [ ] **Ask every satisfied customer** for a Google review
- [ ] **Respond to every review** (positive and negative) within 48 hours
- [ ] **Aim for 5+ new reviews per month**
- [ ] **Include keywords naturally** in your review responses
- [ ] **Display reviews on your website** with Review schema markup

### 4. Local Link Building

Links from local sources signal geographic relevance.

- [ ] **Get listed in local directories** (BBB, Chamber of Commerce, Yelp)
- [ ] **Sponsor local events** and get mentioned on their websites
- [ ] **Partner with complementary businesses** for cross-referrals
- [ ] **Get featured in local media** (news sites, blogs)
- [ ] **Join industry associations** and get listed on their sites

### 5. Technical SEO Foundations

Even the best content won't rank if Google can't crawl your site.

- [ ] **Ensure mobile-first responsive design**
- [ ] **Achieve 90+ PageSpeed score** (compress images, minify code)
- [ ] **Implement proper heading hierarchy** (H1 → H2 → H3)
- [ ] **Add structured data** (LocalBusiness, Service, FAQ, Review)
- [ ] **Create and submit XML sitemap**
- [ ] **Fix any crawl errors** in Google Search Console
- [ ] **Ensure HTTPS is active**

### 6. Content Strategy for Local SEO

Content that answers local questions builds authority.

- [ ] **Write service pages for each offering** (1000+ words each)
- [ ] **Create a blog** with local-focused content
- [ ] **Answer FAQ schema questions** on relevant pages
- [ ] **Create location-specific landing pages** for each service area
- [ ] **Publish case studies** showing local results

## Common Local SEO Mistakes

1. **Inconsistent NAP** — Your name, address, and phone must match everywhere
2. **Ignoring reviews** — Not responding to reviews hurts rankings and trust
3. **Thin service pages** — One-paragraph service pages don't rank
4. **No local content** — Generic content doesn't signal local relevance
5. **Slow website** — Speed is a ranking factor; aim for under 3 seconds

## How St. Catharines Digital Can Help

We build websites with local SEO baked in from day one. From technical optimization to Google Business Profile setup, we help service businesses rank higher and get more qualified leads.

[Get a free SEO audit](/contact) to see where you stand.
`,
  },
  'how-to-get-more-leads-from-website': {
    title: 'How to Get More Leads from Your Service Business Website',
    date: '2026-05-13',
    readTime: '6 min read',
    tags: ['Lead Generation', 'Web Design', 'Conversion'],
    author: 'St. Catharines Digital',
    content: `
## Your Website Should Be Your Best Salesperson

Most service business websites are digital brochures. They look nice, but they don't generate leads. Here's how to fix that.

## 7 Proven Strategies to Get More Leads

### 1. Make Your Value Proposition Crystal Clear

Visitors should understand what you do within 5 seconds. Your hero section should answer: What do you do? Who do you serve? Why should I choose you?

**Bad:** "Welcome to ABC Plumbing"
**Good:** "St. Catharines' Most Trusted Plumber — Same-Day Service, Guaranteed"

### 2. Add Clear Calls to Action (CTAs) on Every Page

Every page should have a clear next step. Don't make visitors hunt for your phone number or contact form.

- **Primary CTA:** "Get a Free Quote" or "Call Now"
- **Secondary CTA:** "Learn More About Our Services"
- **Sticky header** with phone number on mobile

### 3. Show Social Proof

Trust is the #1 factor in choosing a service provider.

- Display **Google reviews** prominently
- Show **before/after photos** of your work
- Include **client testimonials** with names and photos
- Add **trust badges** (licensed, insured, BBB accredited)

### 4. Create Service-Specific Landing Pages

Don't lump all services onto one page. Create dedicated pages for each service with:
- Detailed description of the service
- Pricing information or "starting at" ranges
- FAQ section with schema markup
- Strong CTA at the top and bottom

### 5. Optimize for Mobile-First

70%+ of local searches happen on mobile. Your site must be fast and easy to use on a phone.

- Tap-to-call buttons
- Click-to-text for SMS
- Fast loading (under 3 seconds)
- Large, tappable buttons
- Simplified navigation

### 6. Add Live Chat or Chatbots

Many visitors won't call. Give them another way to reach you.

- Live chat for immediate questions
- Chatbot for after-hours inquiries
- Callback request forms

### 7. Track and Optimize

You can't improve what you don't measure.

- Set up **Google Analytics 4**
- Track **form submissions** as conversions
- Monitor **phone call clicks**
- Use **heatmaps** to see where visitors click
- A/B test headlines and CTAs

## The Bottom Line

A lead-generating website isn't about fancy design. It's about clarity, trust, and making it easy for the right prospects to take action.

[Ready to turn your website into a lead machine?](/contact) Get a free audit from St. Catharines Digital.
`,
  },
  'technical-seo-explained': {
    title: 'Technical SEO Explained: What It Is and Why Your Business Needs It',
    date: '2026-05-13',
    readTime: '7 min read',
    tags: ['Technical SEO', 'Schema', 'Site Speed'],
    author: 'St. Catharines Digital',
    content: `
## What Is Technical SEO?

Technical SEO is the process of optimizing your website so search engines can crawl, index, and understand your content. It's the foundation that everything else builds on.

Think of it this way: content is what you say, on-page SEO is how you say it, and technical SEO is whether search engines can even hear you.

## The Key Components

### 1. Site Speed

Google uses Core Web Vitals as ranking signals. Slow sites rank lower and have higher bounce rates.

**Key metrics:**
- **LCP (Largest Contentful Paint):** Under 2.5 seconds
- **FID (First Input Delay):** Under 100 milliseconds
- **CLS (Cumulative Layout Shift):** Under 0.1

**How to improve:**
- Compress and optimize images (WebP format)
- Minify CSS and JavaScript
- Use a CDN (Cloudflare Pages includes this)
- Enable browser caching
- Defer non-critical JavaScript

### 2. Crawlability

If Google can't crawl your pages, they can't rank.

**Checklist:**
- Submit XML sitemap to Google Search Console
- Fix broken links (404 errors)
- Use clean URL structures (/services/plumbing not /page?id=123)
- Implement proper redirects for moved pages
- Use robots.txt correctly (don't block important pages)

### 3. Indexability

Crawlable doesn't mean indexable. Make sure Google can add your pages to its index.

- Use canonical URLs to avoid duplicate content
- Add noindex only to pages you don't want ranked (thank you pages, etc.)
- Ensure important pages aren't blocked by robots.txt
- Use proper HTTP status codes (200 for live pages, 301 for redirects)

### 4. Structured Data (Schema Markup)

Schema helps Google understand your content and can earn rich snippets in search results.

**Essential schema types for service businesses:**
- **LocalBusiness** — Your business name, address, phone, hours
- **Service** — Each service you offer with descriptions
- **FAQPage** — Questions and answers (can earn FAQ rich snippets)
- **Review/AggregateRating** — Star ratings in search results
- **BreadcrumbList** — Site navigation structure

### 5. Mobile-First Indexing

Google primarily uses the mobile version of your site for ranking. If your mobile experience is poor, your rankings will suffer.

- Responsive design (not separate mobile site)
- Tap-friendly navigation
- Readable text without zooming
- Fast mobile load times

### 6. HTTPS Security

HTTPS is a confirmed ranking signal. All modern sites should use it.

- Cloudflare Pages provides free SSL
- Ensure all internal links use HTTPS
- Set up proper HTTP → HTTPS redirects

## How to Audit Your Technical SEO

1. **Google Search Console** — Check for crawl errors, indexing issues, and Core Web Vitals
2. **PageSpeed Insights** — Test your site speed and get optimization suggestions
3. **Schema Validator** — Test your structured data at validator.schema.org
4. **Screaming Frog** — Crawl your site to find technical issues
5. **Ahrefs/SEMrush** — Comprehensive SEO audits

## Why Technical SEO Matters for Local Service Businesses

Most local service business websites have terrible technical SEO. This is your competitive advantage. If your site is faster, more crawlable, and better structured than your competitors, you'll rank higher -- even with less content.

## How St. Catharines Digital Helps

Every website we build includes:
- 90+ PageSpeed scores
- Complete schema markup (LocalBusiness, Service, FAQ, Review, BreadcrumbList)
- Mobile-first responsive design
- Clean URL architecture
- XML sitemap and proper robots.txt
- Core Web Vitals optimization

[Get a free technical SEO audit](/contact) to see how your site stacks up.
`,
  },
}

// Simple markdown-to-HTML converter
function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    // Headers
    .replace(/^### (.+)$/gm, '<h3 style="color:var(--text-bright);font-size:1.1rem;margin:1.5rem 0 0.75rem;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:var(--text-bright);font-size:1.3rem;margin:2rem 0 1rem;">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--primary);text-decoration:none;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">$1</a>')
    // Checkboxes
    .replace(/- \[x\] (.+)/g, '<li style="list-style:none;color:var(--success);">✅ $1</li>')
    .replace(/- \[ \] (.+)/g, '<li style="list-style:none;">⬜ $1</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li style="margin:0.25rem 0;">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:0.25rem 0;">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p style="margin:0.75rem 0;line-height:1.7;">')
    // Wrap in paragraph
  html = '<p style="margin:0.75rem 0;line-height:1.7;">' + html + '</p>'
  // Clean up empty paragraphs
  html = html.replace(/<p style="[^"]*"><\/p>/g, '')
  return html
}

export default function BlogPostPage({ slug }) {
  const post = blogPosts[slug]

  if (!post) {
    return (
      <>
        <Seo title="Post Not Found | St. Catharines Digital Blog" path="/blog" noIndex />
        <section className="section-first page-hero">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Post not found</h1>
            <p><Link to="/blog" style={{ color: 'var(--primary)' }}>← Back to blog</Link></p>
          </div>
        </section>
      </>
    )
  }

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    image: `${BASE_URL}/og-card.png`,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: 'St. Catharines Digital', url: BASE_URL },
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
  }

  return (
    <>
      <Seo
        title={`${post.title} | St. Catharines Digital Blog`}
        description={post.content.substring(0, 160).replace(/[#*[\]()-]/g, '').trim()}
        path={`/blog/${slug}`}
        type="article"
        jsonLd={postJsonLd}
      />

      <div className="bg-orb bg-orb-1" aria-hidden="true"></div>
      <div className="bg-orb bg-orb-2" aria-hidden="true"></div>

      <section className="section-first page-hero">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {post.tags.map(tag => (
                <span key={tag} className="portfolio-tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
              ))}
            </div>
            <h1>{post.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
              <span>By {post.author}</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection>
            <article style={{ color: 'var(--text)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <div className="cta-strip">
              <div>
                <h2>Ready to rank higher on Google?</h2>
                <p>Get a free SEO audit from St. Catharines Digital.</p>
              </div>
              <Link to="/contact" className="button button-primary">Get Free Audit</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
