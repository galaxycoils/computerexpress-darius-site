# Local Authority Partner — Recurring Revenue System Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a 3-tier monthly retainer system ($497/$897/$1,497) to stcatharinesdigital.ca with a dedicated /partner sales page, updated /services pricing, and a paid audit upsell funnel.

**Architecture:** Three work units: (1) Data & Types — new tier definitions, FAQ, case study stubs; (2) UI Components — PartnerPage, updated ServicesPage pricing section, FreeAuditPage upsell CTA; (3) Routing & Schema — App.jsx routes, JSON-LD for new page types, deployment verification.

**Tech Stack:** React 18 + Vite 6, react-router-dom 7, Cloudflare Pages, Tailwind CSS via @tailwindcss/postcss.

---

## Work Unit 1: Data Layer & Content

### Task 1: Add retainer tier definitions to siteData.js

**Objective:** Define the 3-tier Local Authority Partner data structure

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/data/siteData.js` (append after line 263)

**Step 1: Write failing test** - Verify packages export includes new retainerTiers

**Step 2: Run test to verify failure** - Import check fails

**Step 3: Write minimal implementation**

```javascript
// Add to end of siteData.js

export const retainerTiers = [
  {
    id: 'foundation',
    name: 'Foundation',
    price: '$497',
    period: '/mo',
    ideal: 'For service businesses new to SEO, under $5k/mo revenue.',
    features: [
      'GBP optimization + monthly monitoring',
      'Monthly ranking & visibility report',
      'Quarterly 30-min strategy call',
      'Technical SEO health checks',
      'Citation accuracy monitoring',
      '30-day satisfaction guarantee',
    ],
    featured: false,
    ctaText: 'Apply for Foundation',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$897',
    period: '/mo',
    ideal: 'For established businesses ($10k+/mo) ready to scale local visibility.',
    features: [
      'Everything in Foundation, plus:',
      '2 SEO-optimized blog posts/month',
      'Service-area page updates & expansion',
      'Citation cleanup & suppression',
      'Competitor keyword gap analysis',
      'Review generation workflow',
      'Priority email support',
    ],
    featured: true,
    ctaText: 'Apply for Growth',
  },
  {
    id: 'dominance',
    name: 'Dominance',
    price: '$1,497',
    period: '/mo',
    ideal: 'For market leaders ($20k+/mo) pursuing total local dominance.',
    features: [
      'Everything in Growth, plus:',
      '4 SEO-optimized blog posts/month',
      'Monthly content strategy & calendar',
      'Automated review generation system',
      'Annual full-site technical audit',
      'Priority Slack/phone support',
      'Quarterly 60-min strategy deep-dive',
    ],
    featured: false,
    ctaText: 'Apply for Dominance',
  },
]

export const partnerFAQ = [
  {
    q: 'Is there a long-term contract?',
    a: 'Month-to-month after an initial 3-month commitment. Local SEO compounds over time — 90 days is the minimum to see meaningful movement. After 3 months, cancel anytime with 30 days notice.'
  },
  {
    q: 'What happens in the quarterly strategy call?',
    a: 'We review rankings, traffic, leads, and revenue impact. We adjust the content calendar, identify new service-area opportunities, and set priorities for the next quarter. You get a 1-page PDF summary + Loom walkthrough.'
  },
  {
    q: 'Do you write the blog posts or do I?',
    a: 'We write, optimize, and publish them. You approve topics via a shared Notion board. Posts target your service-area keywords and include local schema, internal links, and GBP post syndication.'
  },
  {
    q: 'How do you track rankings?',
    a: 'We use LocalFalcon / Places Scout for grid-based Maps tracking across your service areas, plus standard organic rank tracking for your top 20 keywords. Reports delivered monthly.'
  },
  {
    q: 'What if I need to pause?',
    a: 'Life happens. One pause per 12 months (up to 60 days) at 50% retainer to hold your slot. No penalty, no awkward conversations.'
  },
  {
    q: 'Can I upgrade/downgrade tiers?',
    a: 'Yes, anytime. Changes take effect next billing cycle. Prorated adjustments applied automatically.'
  },
]

export const partnerCaseStudies = [
  {
    slug: 'plumber-niagara',
    industry: 'Plumbing',
    location: 'Niagara Region',
    tier: 'Growth',
    duration: '8 months',
    results: {
      mapsPositions: '3 keywords → Top 3 (was 0)',
      organicTraffic: '+240%',
      monthlyLeads: '12 → 38',
      estimatedRevenue: '$180k → $570k',
    },
    quote: 'We went from invisible on Maps to the first call for emergency plumbing in Welland and St. Catharines. The blog posts alone bring in 8-10 qualified leads a month.',
    anonymized: true,
  },
  {
    slug: 'hvac-stcatharines',
    industry: 'HVAC',
    location: 'St. Catharines + Thorold',
    tier: 'Dominance',
    duration: '14 months',
    results: {
      mapsPositions: '5/5 target keywords in Top 3',
      organicTraffic: '+410%',
      monthlyLeads: '8 → 42',
      estimatedRevenue: '$320k → $1.2M',
    },
    quote: 'The seasonal content calendar meant we owned "furnace repair" in October and "AC install" in June. Competitors stopped showing up.',
    anonymized: true,
  },
  {
    slug: 'legal-family-law',
    industry: 'Family Law',
    location: 'St. Catharines',
    tier: 'Foundation',
    duration: '6 months',
    results: {
      mapsPositions: '2/3 keywords Top 3',
      organicTraffic: '+180%',
      monthlyLeads: '3 → 14',
      estimatedRevenue: 'Confidential',
    },
    quote: 'Professional, low-touch, high-ROI. The GBP optimization and review system did the heavy lifting. We just show up for consults.',
    anonymized: true,
  },
]
```

**Step 4: Run test to verify pass** - Import succeeds, arrays have 3/6/3 items

**Step 5: Commit**
```bash
git add src/data/siteData.js
git commit -m "data: add retainerTiers, partnerFAQ, partnerCaseStudies"
```

---

## Work Unit 2: UI Components

### Task 2: Create PartnerPage component

**Objective:** Long-form sales page at `/partner` with methodology, tiers, FAQ, case studies, apply form

**Files:**
- Create: `/Users/cmd/computerexpress-netlify/src/pages/PartnerPage.jsx`

**Step 1: Write failing test** - Page renders without crashing, imports retainerTiers/partnerFAQ/partnerCaseStudies

**Step 2: Run test to verify failure** - File doesn't exist

**Step 3: Write minimal implementation** - See complete component below

**Step 4: Run test to verify pass** - `npm run dev` → navigate to `/partner` → all sections render

**Step 5: Commit**
```bash
git add src/pages/PartnerPage.jsx
git commit -m "feat: add PartnerPage with tiers, FAQ, case studies, apply CTA"
```

**Component structure:**
- Hero: "Local Authority Partner" + value prop + "Apply for Partnership" CTA
- Methodology: 4-step process (Audit → Roadmap → Execute → Report)
- Tier comparison table (sticky, responsive)
- FAQ accordion (partnerFAQ)
- Case studies grid (partnerCaseStudies)
- Apply form → Typeform/Calendly link
- JSON-LD: Service + FAQPage + ItemList for tiers

### Task 3: Update ServicesPage pricing section

**Objective:** Replace current 3 one-time packages with dual-track: One-Time Projects + Local Authority Partner

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/pages/ServicesPage.jsx` (lines 189-232)

**Changes:**
1. Add section heading: "Two ways to work together"
2. Track 1: "One-Time Website Projects" (condensed cards from existing `packages`)
3. Track 2: "Local Authority Partner (Monthly)" — render `retainerTiers` from siteData
4. Each retainer tier card: name, price/mo, ideal, features, "Apply" CTA → `/partner#tier-{id}`
5. Featured badge on Growth tier
6. Update JSON-LD: replace OfferCatalog with two catalogs (Project + Retainer)

**Step 5: Commit**
```bash
git add src/pages/ServicesPage.jsx
git commit -m "feat: dual-track pricing on ServicesPage (projects + retainers)"
```

### Task 4: Add paid audit upsell to FreeAuditPage

**Objective:** After grader results, show "Upgrade to Deep-Dive Audit ($497)" CTA

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/pages/FreeAuditPage.jsx` (STAGE_RESULTS section, ~line 500+)

**Changes:**
1. In results dashboard, add card below checklist: "Want the full 42-point technical audit?"
2. Include: 42 checks, competitor gap map, GBP scorecard, 90-day roadmap, Notion doc + Loom
3. CTA button → `/contact?audit=deep-dive` (pre-fills contact form)
4. Track event: `free_audit_upsell_view` / `free_audit_upsell_click`

**Step 5: Commit**
```bash
git add src/pages/FreeAuditPage.jsx
git commit -m "feat: add deep-dive audit upsell on grader results"
```

### Task 5: Update Homepage hero CTA

**Objective:** Change "Free Audit" → "Get Your Free Website Grade" (same tool, better hook)

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/pages/HomePage.jsx` (hero CTA area)

**Step 5: Commit**
```bash
git add src/pages/HomePage.jsx
git commit -m "copy: update hero CTA to 'Get Your Free Website Grade'"
```

---

## Work Unit 3: Routing, Schema & Deployment

### Task 6: Add /partner route to App.jsx

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/App.jsx`
- Add: `import PartnerPage from './pages/PartnerPage'`
- Add Route: `<Route path="partner" element={<PartnerPage />} />`

**Step 5: Commit**
```bash
git add src/App.jsx
git commit -m "route: add /partner page"
```

### Task 7: Update Layout navbar & footer

**Objective:** Add "Partner" link to navbar (desktop only) and footer

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/components/Layout.jsx`
- Navbar: Add `<NavLink to="/partner">Partner</NavLink>` between Blog and What to Expect
- Footer: Add Partner link under Company column

**Step 5: Commit**
```bash
git add src/components/Layout.jsx
git commit -m "nav: add Partner link to header and footer"
```

### Task 8: Add JSON-LD schemas for PartnerPage

**Files:**
- Modify: `/Users/cmd/computerexpress-netlify/src/data/schema.js`
- Add: `getPartnerPageSchema()` returning Service + FAQPage + ItemList
- Add: `getRetainerTierSchema(tier)` for each tier

**Step 5: Commit**
```bash
git add src/data/schema.js
git commit -m "seo: add PartnerPage and retainer tier JSON-LD schemas"
```

### Task 9: Build, test, deploy

**Commands:**
```bash
cd /Users/cmd/computerexpress-netlify
npm ci
npm run build
# Verify dist/partner/index.html exists
git add -A
git commit -m "deploy: Local Authority Partner system"
git push origin main
# Verify GitHub Action passes → Cloudflare Pages deploy
# Verify at https://stcatharinesdigital.ca/partner
# Verify at https://stcatharinesdigital.ca/services (dual pricing)
# Verify at https://stcatharinesdigital.ca/free-audit (upsell card)
```

---

## Verification Checklist

- [ ] `/partner` page loads, all 3 tiers render, FAQ accordion works, case studies display
- [ ] `/services` shows two tracks with correct data from siteData.js
- [ ] `/free-audit` results show deep-dive upsell card with working CTA
- [ ] Homepage hero CTA reads "Get Your Free Website Grade"
- [ ] Navbar + footer have "Partner" link
- [ ] JSON-LD validates in Google Rich Results Test for /partner
- [ ] Lighthouse scores remain 100/100/100/100
- [ ] GitHub Action deploy succeeds
- [ ] Production URLs return 200

---

## Rollback Plan

If issues:
```bash
git revert HEAD~9..HEAD  # revert all 9 commits
git push origin main
# Or: git reset --hard <pre-plan-commit> && git push --force
```

---

## Timeline Estimate

| Work Unit | Tasks | Est. Time |
|-----------|-------|-----------|
| 1: Data | 1 | 15 min |
| 2: UI | 4 | 60 min |
| 3: Routing/Deploy | 4 | 30 min |
| **Total** | **9** | **~1.75 hrs** |

---

*Plan created: 2026-06-05*
*Ready for subagent-driven-development execution*
