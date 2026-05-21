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
  'google-business-profile-tips-local-seo': {
    title: '7 Essential Google Business Profile Tips for Local Service Businesses',
    date: '2026-05-21',
    readTime: '7 min read',
    tags: ['Local SEO', 'Google Business Profile', 'Google Maps'],
    author: 'St. Catharines Digital',
    content: `
## Dominate Local Search with Your Google Business Profile

For service businesses like plumbers, electricians, landscapers, and HVAC techs, a Google Business Profile (GBP) is the ultimate lead generation tool. Most customer journeys start with a search like "plumber near me." If you rank in the Google Maps top 3 (the "Local Pack"), you get the lion's share of clicks and calls.

Here are 7 essential Google Business Profile tips to optimize your listing and beat local competitors.

### 1. Match Your Categories to Search Intent

Your primary category carries the most weight in Google's ranking algorithm. Be precise. If you install furnaces and air conditioners, set your primary category to "HVAC Contractor" rather than "Heating Contractor" or "Air Conditioning Contractor" if HVAC Contractor is the most comprehensive search term.

Next, add up to 9 secondary categories. If you are an HVAC contractor who also does plumbing, add "Plumber." If you specialize in hot water tanks, add "Water Heater Repair Service." Do not add unrelated categories, as this confuses Google's algorithm.

### 2. Craft a Keyword-Rich Business Description

You have 750 characters to write your business description. Do not waste them on corporate jargon. Write a clear, compelling story about what services you offer, what local areas you serve, and why customers should choose you.

Naturally weave in target local keywords. For example: "St. Catharines Digital provides expert local SEO and web design services for residential and commercial contractors in Niagara." Avoid keyword stuffing -- write for human readers first.

### 3. Service Area Setup and Business Hours

If you are a service-area business (meaning you drive to your customers and do not have a physical storefront for walk-ins), hide your street address and set your service areas. Specify cities, towns, and postal codes that you actually cover. Keep this zone realistic -- setting a massive radius can dilute your local relevance.

Keep your operating hours accurate. If you offer 24/7 emergency service, list it. If you close on holidays, update your special hours in advance. Consistent and accurate hours build customer trust and prevent negative reviews.

### 4. Upload Real Photos Weekly

Businesses with photos on their profiles receive 35% more clicks to their websites. Do not use generic stock photos. Google's cloud vision AI can detect stock photography and will devalue it.

Instead, upload real, high-resolution photos of:
- Your completed work (before and after shots)
- Your team in uniform standing by your branded trucks
- Your tools, equipment, and office
- Happy customers (with their permission)

Aim to upload 1 to 2 new photos every week to signal to Google that your business is active.

### 5. Build an Automated Review Loop

Reviews are a massive ranking signal for the local map pack. It is not just about the number of stars, but also the frequency and text of the reviews.

Create a simple system to ask every customer for a review immediately after completing a job. Send a direct link via SMS or email. Make it easy for them.

When responding to reviews, do so within 48 hours. Thank them, and naturally mention the service and city. For example: "Thanks for the review, Dave! We were happy to help with your boiler repair in St. Catharines." This adds natural local keywords to your profile.

### 6. Leverage Google Business Profile Posts

Think of Google Posts as social media updates that appear directly in your local search panel. You can share offers, announcements, and educational tips.

Publish at least one update per week. Use a high-quality photo, write a punchy description, and include a call to action link pointing directly to your website or grader. For example, write an update promoting your free online SEO audit!

### 7. Answer Your Own Local FAQs

The Q&A section of your profile is public. Anyone can ask a question, and anyone can answer it. Do not let random users answer questions for you.

Proactively populate this section yourself. Log in and ask common questions, then answer them. For example:
- "Do you offer emergency plumbing repairs on weekends?" (Answer: "Yes, we offer 24/7 emergency service across St. Catharines. Call us at...")
- "Are your technicians licensed and insured?" (Answer: "Yes, all our team members are fully certified, licensed, and insured...")

This provides immediate answers to prospects and helps close deals right from the search page.

## Wrap Up

An optimized Google Business Profile is the fastest way to get more phone calls and leads. Work through these 7 tips, keep your profile active, and watch your local rankings grow.

Need help dominating local search? [Get a free audit from St. Catharines Digital](/contact) to see how you compare to local competitors.
`,
  },
  'how-to-rank-1-on-google-maps': {
    title: 'How to Rank #1 on Google Maps: The Definitive Local Pack Guide',
    date: '2026-05-21',
    readTime: '9 min read',
    tags: ['Google Maps', 'Local SEO', 'Citations'],
    author: 'St. Catharines Digital',
    content: `
## How the Google Maps Algorithm Works

If you want your service business to grow, you need to rank in the Google Maps top 3. When users search for local services, Google displays a map with three highlighted listings above the traditional organic search results. This is known as the "Local Pack" or "3-Pack."

How does Google choose which businesses to display here? The algorithm relies on three core pillars: **Proximity**, **Relevance**, and **Prominence**.

Here is the breakdown of how these factors work and how you can optimize for them to rank #1.

### 1. Proximity: The Distance Factor

Proximity is the distance between the searcher and your business. If a user searches for "electrical repair" while standing in north St. Catharines, Google will prioritize electricians near that location.

While you cannot change a user's location, you can optimize how Google understands your service boundaries:
- **Set precise service areas** in your Google Business Profile (GBP).
- **List surrounding municipalities** naturally in your site's landing pages (e.g. Thorold, Niagara Falls, Welland).
- **Ensure your NAP (Name, Address, Phone)** matches your physical location exactly.

### 2. Relevance: The Match Factor

Relevance is how well a local business profile matches what someone is searching for. If someone searches for "emergency furnace repair," Google wants to show profiles that explicitly mention HVAC and furnace services.

To maximize relevance:
- **Include specific keywords** in your business categories, services list, and business description.
- **Build dedicated service pages** on your website for every service you offer. Do not lump "heating, cooling, and plumbing" onto a single page.
- **Use local schema markup (JSON-LD)** to tell search bots exactly what services you offer and where.

### 3. Prominence: The Authority Factor

Prominence is how well-known or authoritative your business is. Google measures this using data gathered from across the web, including links, citations, reviews, and directory listings.

Here are the four key actions to build prominence:

#### Action A: Clean Up Your Local Citations

A citation is any online mention of your business name, address, and phone number (NAP). Consistent citations across the web build search engine trust.

Make sure you are listed with identical NAP info on major directories:
- Yellow Pages Canada
- Yelp and TripAdvisor
- local chamber of commerce
- industry-specific directories (e.g. Homestars, TrustedPros)

Fix any duplicate listings or incorrect phone numbers immediately.

#### Action B: Generate Consistent Reviews

Google wants to recommend active, well-liked businesses. A steady stream of 5-star reviews signals that you are active and trustworthy.

Establish a post-job workflow:
- Send a text message with a direct review link within 2 hours of completing service.
- Train your technicians to ask for reviews in person before leaving the site.
- Reply to every review promptly, using natural variations of your keywords.

#### Action C: Build Local Backlinks

Links from reputable local websites to your site signal geographic authority. Try to earn backlinks by:
- Sponsoring local sports teams or charity events.
- Partnering with local businesses for guest blogs or joint promotions.
- Registering with the local business bureau and municipal directories.

#### Action D: Structure On-Page Local Content

Your website's authority directly affects your Google Maps rankings. A high-ranking website boosts the prominence of its associated Google Business Profile.

Optimize your on-page structure:
- Embed a Google Map of your service area on your contact page.
- Ensure your site is fully mobile-first and loads in under 2 seconds.
- Use geographic headings (H2, H3) on service landing pages (e.g. "Residential HVAC in St. Catharines").

## Summary

Ranking #1 on Google Maps does not happen overnight. It requires consistent category matching, directory alignment, reviews, and technical website optimization.

Ready to see how your site scores? [Try our interactive Website Grader](/free-audit) for a free instant SEO and speed assessment.
`,
  },
  'website-speed-optimization-tips': {
    title: 'Speed Kills Conversions: 5 Website Speed Optimization Tips for 2026',
    date: '2026-05-21',
    readTime: '6 min read',
    tags: ['Site Speed', 'Technical SEO', 'Core Web Vitals'],
    author: 'St. Catharines Digital',
    content: `
## Why Site Speed is the Ultimate Conversion Multiplier

In 2026, web visitors expect instant responses. If your website takes more than 3 seconds to load, over 53% of mobile visitors will bounce. Speed is not just a user experience detail -- it is a direct ranking factor in Google's mobile-first index and a primary conversion indicator.

Google measures this using **Core Web Vitals**:
- **LCP (Largest Contentful Paint)**: How fast the main content renders (target: under 2.5s).
- **INP (Interaction to Next Paint)**: How responsive the site is to clicks and taps (target: under 200ms).
- **CLS (Cumulative Layout Shift)**: Visual stability during loading (target: under 0.1).

Here are 5 practical website speed optimization tips to speed up your website and capture more leads.

### 1. Optimize and Modernize Images

Images are usually the heaviest assets on a local service website. Large raw images from smartphones can be 5MB or larger, grinding mobile loading to a halt.

- **Use WebP or AVIF formats**: These modern image formats provide high visual quality at a fraction of the file size of PNGs or JPEGs.
- **Compress before uploading**: Use tools like TinyPNG or squoosh.app to compress images without losing quality.
- **Implement responsive image dimensions**: Do not serve a 3000px wide image inside a 300px wide sidebar container. Specify correct width and height attributes in your HTML.
- **Lazy load images**: Add the \`loading="lazy"\` attribute to all images below the fold to prioritize loading critical assets above the fold.

### 2. Minify and Combine Assets

Every file your website loads requires a separate network request. Minifying removes unnecessary characters (like spaces and comments) from your CSS, JS, and HTML files.

- Use build systems (like Vite or Webpack) that automatically bundle, tree-shake, and minify your assets.
- Eliminate unused CSS classes. If you import a massive styling framework but only use a button class, you are loading unnecessary code.
- Defer non-critical Javascript. Use the \`defer\` or \`async\` attributes on script tags so they do not block HTML parsing.

### 3. Leverage Caching and CDNs

A Content Delivery Network (CDN) stores copies of your website on a global network of servers. When a user in St. Catharines visits your site, the CDN serves the files from the nearest regional server rather than fetching them from a distant primary database.

- **Deploy on edge servers**: Platforms like Cloudflare Pages host your code directly on the network edge, ensuring near-instant response times.
- **Configure browser caching**: Tell browsers to store static files (logos, icons, fonts) locally so repeat visitors load your site instantly.

### 4. Implement Server-Side Prerendering (SSG)

Traditional Single Page Applications (SPAs) load a blank HTML file and use Javascript to build the page in the browser. This creates a delay before the user sees anything.

- **Use Static Site Generation (SSG)**: Prerender your pages into static HTML files during the build phase.
- When a user requests a route, the server sends completed HTML instantly, dropping LCP metrics to under 1 second.
- Hydraulically mount React components only after the initial page structure loads.

### 5. Code-Split Heavy Third-Party Libraries

Third-party scripts (chat widgets, maps, analytics, font libraries) are notorious performance killers.

- **Code-split large components**: Use dynamic imports (\`React.lazy\`) to defer loading heavy assets (like WebLLM models or complex maps) until the user explicitly requests them.
- **Self-host fonts**: Do not link directly to Google Fonts API which requires additional DNS lookups. Host font files (.woff2) locally.
- **Audit your scripts**: Regularly check Google PageSpeed Insights and remove unused tracking tags.

## Start Grading Your Site Speed

Implementing these 5 tips will make your website faster, rank higher on search engines, and convert more visitors into active customers.

Want to see your current Core Web Vitals score? [Run your website through our free Website Grader](/free-audit) for an instant diagnostic report.
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
        name: 'Blog',
        item: `${BASE_URL}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${BASE_URL}/blog/${slug}`
      }
    ]
  }

  const webpageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${post.title} | St. Catharines Digital Blog`,
    url: `${BASE_URL}/blog/${slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'p']
    }
  }

  return (
    <>
      <Seo
        title={`${post.title} | St. Catharines Digital Blog`}
        description={post.content.substring(0, 160).replace(/[#*[\]()-]/g, '').trim()}
        path={`/blog/${slug}`}
        type="article"
        jsonLd={[postJsonLd, breadcrumbJsonLd, webpageJsonLd]}
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
