# St. Catharines Digital Content Strategy & Optimization Plan

## Goal
To develop a comprehensive, actionable content strategy and local SEO optimization plan for St. Catharines Digital based on modern web guidance, closing the existing content gaps and driving organic local traffic.

## Current Context & Assumptions
- **Project**: St. Catharines Digital (v1.1.0)
- **Live URL**: https://stcatharinesdigital.pages.dev (needs custom domain stcatharinesdigital.com/.ca)
- **Framework**: React 18 + Vite 6 + react-router-dom 7
- **Deployment**: Cloudflare Pages
- **Analytics**: GA4 is live (G-HDESV0NDX4), waiting for baseline data.
- **Completed Work**: Priority 1 & 2 items are done. Core pages have JSON-LD schema. Three SEO blogs are published.
- **Remaining Work (Priority 3 & 4)**: 
  - Publish missing blog posts (Local SEO cost, Service business examples).
  - Create real case studies (Plumber, HVAC, Legal).
  - Off-page SEO (GBP, Directories, Socials, Backlinks).
  - A/B testing, email nurture, custom domain setup.
- **Guidance Integrated**: 
  - `html`: Focus on modern HTML architecture, semantic tags, and resource prioritization.
  - `performance`: Optimize loading metrics, Core Web Vitals, and `VITE_BASE_URL` integration.
  - `optimize-preload-priority` & `improve-next-page-load-performance`: Utilize `<link rel="preload">` and speculation rules.
  - `search-hidden-content`: Ensure hidden content (like accordions) is searchable via `hidden="until-found"`.

## Proposed Approach

1.  **Address Technical & SEO Debt (Immediate)**:
    -   Secure a custom domain (requires Darius) and update all hardcoded `stcatharinesdigital.pages.dev` instances.
    -   Implement speculation rules (`<script type="speculationrules">`) for pre-rendering critical user journeys (e.g., from Home to Services/Contact).
    -   Audit and optimize `<link rel="preload">` for critical assets (fonts, hero SVG).
    -   Implement `hidden="until-found"` for any accordion/tab components to enhance native searchability.

2.  **Close Content Gaps (Short-Term)**:
    -   Draft and publish "How much does local SEO cost" (Target Volume: 590).
    -   Draft and publish "Service business website examples" (Target Volume: 210).
    -   Integrate these into `prerender.js`, `sitemap.xml`, and `BlogPage.jsx`.
    -   Ensure robust internal linking between new blogs and corresponding service pages.

3.  **Establish Case Study Framework (Medium-Term)**:
    -   Create a standardized React template (`CaseStudyPage.jsx`) focusing on Before/After metrics, problem-solution narrative, and client testimonials.
    -   Obtain real data from Darius for Plumber, HVAC, and Legal niches.
    -   Publish these under `/case-studies/...` and add them to the main navigation and sitemap.

4.  **Off-Page SEO & Nurture (Long-Term)**:
    -   Set up Google Search Console and submit the finalized `sitemap.xml`.
    -   Create a Google Business Profile (GBP) checklist for Darius.
    -   Draft an email nurture sequence to be triggered via AgentMail (`/api/newsletter` or `/api/contact`).

## Step-by-Step Plan

### Step 1: Technical Performance Polish
-   **Action**: Review `index.html` and `Layout.jsx` for missing semantic HTML5 elements.
-   **Action**: Add speculation rules to `index.html` to prefetch `/services`, `/about`, and `/contact`.
-   **Action**: Identify critical LCP assets (e.g., Hero image) and ensure they use `<link rel="preload" fetchpriority="high">`.
-   **Action**: Ensure the FAQ section (if using `<details>`) leverages the `name` attribute for exclusivity or `hidden="until-found"` if custom-built.

### Step 2: Content Generation (Blogs)
-   **Action**: Write `how-much-does-local-seo-cost.md`. Focus on transparent pricing tiers, ROI, and local market (Niagara/St. Catharines) specifics.
-   **Action**: Write `service-business-website-examples.md`. Highlight key conversion elements (CTA above fold, trust badges, mobile responsiveness).
-   **Action**: Integrate into `src/pages/BlogPostPage.jsx` logic and update `prerender.js`.

### Step 3: Case Study Architecture
-   **Action**: Design `CaseStudyPage.jsx`. Include sections for: Client Overview, The Challenge, The Solution (Technical & Design), The Results (Metrics), and a real Client Testimonial.
-   **Action**: Update routing in `App.jsx` to handle `/case-studies/:slug`.
-   **Action**: Add placeholder entries in `siteData.js` pending real data from Darius.

### Step 4: Email Nurture Sequence Setup
-   **Action**: Define a 3-part email sequence for the Lead Magnet (Website Health Check).
    -   Email 1: Immediate delivery of the audit + quick win.
    -   Email 2 (Day 3): The "Why Local SEO matters" educational email.
    -   Email 3 (Day 7): Soft pitch for a discovery call (Calendly link).
-   **Action**: Document the AgentMail implementation strategy in `KNOWLEDGE/wiki/Email-Strategy.md`.

## Files Likely to Change
-   `/Users/cmd/computerexpress-netlify/index.html` (Speculation rules, preloads)
-   `/Users/cmd/computerexpress-netlify/src/pages/BlogPage.jsx` (New entries)
-   `/Users/cmd/computerexpress-netlify/src/pages/BlogPostPage.jsx` (Markdown content rendering logic update if needed)
-   `/Users/cmd/computerexpress-netlify/scripts/prerender.js` (New routes)
-   `/Users/cmd/computerexpress-netlify/public/sitemap.xml` (New routes)
-   `/Users/cmd/computerexpress-netlify/src/pages/CaseStudyPage.jsx` (New file)
-   `/Users/cmd/computerexpress-netlify/src/App.jsx` (New routes)

## Tests / Validation
-   **Performance**: Run Lighthouse to ensure scores remain at 90+ (aiming for 100). Check LCP specifically after preload changes.
-   **SEO**: Validate the new blog pages using Google's Rich Results Test tool to ensure `BlogPosting` and `BreadcrumbList` schemas are correct.
-   **Build**: Run `npm run build && npx serve dist` locally to verify SSG generation of all new routes.
-   **Routing**: Ensure no 404s on the new URLs and that the catch-all `_redirects` logic is still absent.

## Risks, Tradeoffs, and Open Questions
-   **Risk**: Delay in acquiring real case study data from Darius stalls the credibility initiative.
-   **Risk**: Changing to a custom domain will require a sweep of all hardcoded URLs to prevent broken internal links or invalid JSON-LD.
-   **Tradeoff**: Implementing speculation rules might slightly increase bandwidth usage for users who don't click the prefetched links, but significantly improves perceived performance for those who do.
-   **Open Question**: When will the custom domain (`stcatharinesdigital.com` or `.ca`) be purchased and configured?
-   **Open Question**: Has the Google Business Profile been verified yet?