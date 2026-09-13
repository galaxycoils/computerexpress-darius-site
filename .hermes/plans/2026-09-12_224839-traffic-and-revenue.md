# St. Catharines Digital Traffic and Revenue Implementation Plan

> **For Hermes:** Use the `subagent-driven-development` skill to implement this plan task-by-task. Do not combine work units, do not introduce Stripe, and do not publish paid claims without live supporting data.

**Goal:** Grow qualified Niagara search traffic and convert that attention into free Planning Alert subscribers, sponsor inquiries, and a later $49/month Planning Alerts beta.

**Architecture:** Keep the existing React 18 + Vite + Cloudflare Pages architecture. Treat official municipal documents as the durable source-of-record; publish useful, evergreen local search pages and dated update pages from a shared content registry, then route all readers to the existing newsletter and sponsorship funnels. Keep payments manual: sponsor leads use `/api/sponsor`; the future paid alert uses an explicit `TODO: Stripe` handoff only after the owner supplies a Stripe account and approves the checkout design.

**Tech stack:** React 18, React Router 7, Vite 6, Vitest + Testing Library, react-helmet-async, Cloudflare Pages + Pages Functions, AgentMail, static prerendering, Cloudflare Pages deployment.

---

## Current context / assumptions

- Workspace/repo: `/Users/cmd/workspace/stcatharinesdigital-site`; branch and dirty state must be rechecked before any implementation. Do not add the existing untracked `.agents/`, `.claude/`, `.hermes/skills/`, generated backups, or `NEWS_SHORTLIST.md` to a product commit unless the owner explicitly asks.
- The public site is `https://stcatharinesdigital.ca`; the application route list lives in `src/data/routeManifest.js`, and every new public route must be in `baseRoutes` so `npm run build` prerenders it and the sitemap includes it.
- Existing valuable funnels: newsletter capture component `src/components/news/NewsletterPanel.jsx` posts to `functions/api/newsletter.js`; sponsorship page `src/pages/SponsorPage.jsx` posts to `functions/api/sponsor.js`.
- Existing product positioning: official-source local reporting for St. Catharines, Welland, Thorold, and selected Niagara Region notices. Editorial firewall is non-negotiable. Never turn search pages into advertorials or invent traffic/subscriber/sponsor metrics.
- Existing news scan found high-intent topics around development, council, and infrastructure. Before publishing any topic, verify its primary official source and date; Google News or a secondary outlet is only a discovery lead, never a published source under this site’s policy.
- There is no installed Chrome in this runtime. `npm run audit:lighthouse` currently cannot run. Do not claim Lighthouse scores; use build, schema audit, route checks, and browser/HTML inspection until Chrome exists.
- Payment scope is excluded for Stripe. Keep the sponsor page’s manual follow-up flow. The `$49/month` Planning Alerts beta is an approved product direction; payment collection for the beta remains TODO-only for Stripe. As of 2026-09-13, the owner authorized scope growth: an Interac e-Transfer payment path and a Founding Supporter membership page have landed on main to support the Planning Alerts MVP and Founding Supporter spec. The Thursday sales step remains manual sponsor outreach with editorial firewall.

## Proposed approach

Build one acquisition loop first: official notice → useful local explainer/coverage page → newsletter signup → Planning Tracker → sponsorship inquiry. The pages must be genuinely useful enough to rank for residents and valuable enough to attract legal, real-estate, development, and construction sponsors without selling editorial access.

Ship four small, independently deployable work units: measurement and content governance; an evergreen planning hub plus three city-specific spoke pages; conversion improvements that reuse the existing newsletter API; and a manual sales/revenue operating layer. Treat $49 alerts as a gated beta landing page and waitlist until payments and delivery guarantees are approved.

## Success metrics and stop criteria

### First 30 days (measure; do not promise)

- Search Console: 20 indexed public URLs, 100 organic clicks, and 10 query impressions each for at least three city/planning terms.
- Newsletter: 25 verified signups and a landing-page-to-signup rate of at least 2%.
- Sponsorship: 20 qualified firm contacts researched, 10 personalized emails sent, 3 replies or booked conversations, and one paid/manual commitment.
- Content: 6 primary-source-backed pages published; each links to at least two relevant internal destinations and its primary documents.

### Stop / change course if

- A planned source is stale, not accessible, or not official: do not publish a derivative page; replace it with another verified source.
- After 14 days of 10 qualified sponsor conversations, there are fewer than 3 proposals/calls: pause more sponsor features; rewrite the offer and prospect list before expanding inventory.
- Email signup conversion is below 1% after 200 page sessions: test a clearer single CTA and lead magnet before adding more pages.
- The paid-alert waitlist does not reach 10 qualified professionals after 30 direct conversations: do not build billing or automation; validate the problem again.

---

# Work Unit 0 — Measurement and source governance

**Commit boundary:** one commit, `chore(growth): document source and funnel measurement rules`.

### Task 0.1: Add an editorial source-and-freshness registry

**Objective:** Make it impossible for a future implementer to publish a traffic page from an unsourced or stale lead.

**Files:**
- Create: `src/data/contentRegistry.js`
- Create: `src/data/contentRegistry.test.js`

**Step 1: Write the failing test**

Create `src/data/contentRegistry.test.js`:

```js
import { describe, expect, it } from 'vitest'
import { contentRegistry, getPublishableContent } from './contentRegistry'

describe('contentRegistry', () => {
  it('publishes only entries backed by an official source and a valid ISO date', () => {
    expect(contentRegistry.length).toBeGreaterThanOrEqual(3)
    expect(getPublishableContent()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          primarySource: expect.stringMatching(/^https:\/\/(www\.)?(stcatharines|welland|thorold|niagararegion)\.ca\//),
          publishedDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        }),
      ]),
    )
  })

  it('excludes a discovery lead that has no official primary source', () => {
    expect(getPublishableContent().every((item) => item.primarySource)).toBe(true)
  })
})
```

**Step 2: Run the test to verify failure**

```bash
npm test -- src/data/contentRegistry.test.js
```

Expected: FAIL with `Failed to resolve import "./contentRegistry"`.

**Step 3: Add the minimal implementation**

Create `src/data/contentRegistry.js` using this exact contract. Replace only `primarySource` values after opening the official pages and confirming each URL returns HTTP 200; do not substitute search-result links.

```js
export const contentRegistry = [
  {
    slug: 'st-catharines-ontario-street-corridor-plan',
    city: 'St. Catharines',
    type: 'planning',
    title: 'Ontario Street Corridor Secondary Plan: what the public meeting covers',
    publishedDate: '2026-08-25',
    primarySource: 'https://www.stcatharines.ca/news/posts/notice-of-legislated-public-meeting-ontario-street-corridor-secondary-plan/',
    status: 'verified',
    intent: 'St. Catharines Ontario Street Corridor plan',
  },
  {
    slug: 'welland-first-street-consent-variance',
    city: 'Welland',
    type: 'planning',
    title: '37–40 First Street in Welland: consent and minor-variance hearing guide',
    publishedDate: '2026-09-02',
    primarySource: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/',
    status: 'verified',
    intent: 'Welland First Street development application',
  },
  {
    slug: 'thorold-pamela-drive-watermain',
    city: 'Thorold',
    type: 'infrastructure',
    title: 'Pamela Drive watermain replacement in Thorold: project information',
    publishedDate: '2026-09-03',
    primarySource: 'https://www.thorold.ca/news/news/notice-of-project-commencement-pamela-drive-watermain-replacement',
    status: 'verified',
    intent: 'Pamela Drive watermain replacement Thorold',
  },
]

export function getPublishableContent() {
  return contentRegistry.filter((item) => item.status === 'verified' && item.primarySource && /^\d{4}-\d{2}-\d{2}$/.test(item.publishedDate))
}
```

**Step 4: Run the test to verify pass**

```bash
npm test -- src/data/contentRegistry.test.js
```

Expected: `1 passed` test file, `2 passed` tests.

**Step 5: Verify primary sources before committing**

```bash
for url in \
  'https://www.stcatharines.ca/news/posts/notice-of-legislated-public-meeting-ontario-street-corridor-secondary-plan/' \
  'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/' \
  'https://www.thorold.ca/news/news/notice-of-project-commencement-pamela-drive-watermain-replacement'; do
  curl -L -sS -o /dev/null -w '%{http_code} %{url_effective}\n' "$url"
done
```

Expected: three `200` lines on official municipal domains. If any line is not 200, delete that registry object and replace it only with another verified official source.

**Step 6: Commit**

```bash
git add src/data/contentRegistry.js src/data/contentRegistry.test.js
git commit -m "chore(growth): add verified content registry"
```

### Task 0.2: Write a real measurement specification

**Objective:** Define the events and weekly report before adding tracking code, avoiding unmeasurable marketing work.

**Files:**
- Create: `docs/growth/measurement-spec.md`

**Step 1: Create the document**

Create `docs/growth/measurement-spec.md` with this exact table:

```md
# Growth Measurement Specification

| Event | Trigger | Required fields | Business decision |
|---|---|---|---|
| `content_view` | A reader loads a `/guides/:slug` page | `slug`, `city`, `type` | Which topics earn more coverage |
| `newsletter_submit` | Newsletter form returns `{ success: true }` | `placement`, `path` | Which CTA placement converts |
| `sponsor_submit` | Sponsor form returns `{ success: true }` | `tier`, `path` | Which sponsor package earns demand |
| `planning_beta_waitlist_submit` | Waitlist API returns `{ success: true }` | `role`, `firm_type` | Whether $49 beta demand is qualified |

Weekly scorecard: Search Console clicks/impressions/queries; indexed URLs; page sessions by guide; newsletter conversion rate; sponsor conversations/proposals/commitments; beta waitlist count. Never record email addresses in client-side analytics.
```

**Step 2: Verify it has no secrets and uses the correct paths**

```bash
grep -nE 'API_KEY|Bearer |secret|password' docs/growth/measurement-spec.md && exit 1 || true
```

Expected: no output and exit 0.

**Step 3: Commit**

```bash
git add docs/growth/measurement-spec.md
git commit -m "docs(growth): define funnel measurement"
```

---

# Work Unit 1 — Search acquisition: planning hub and verified guides

**Commit boundary:** one commit, `feat(content): add verified Niagara planning guides`.

### Task 1.1: Add guide data and a pure lookup helper

**Objective:** Create a reusable data layer for three local long-tail search pages without duplicating page code.

**Files:**
- Create: `src/data/guides.js`
- Create: `src/data/guides.test.js`

**Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest'
import { getGuideBySlug, guides } from './guides'

describe('guides', () => {
  it('returns a published guide only for an exact slug', () => {
    expect(getGuideBySlug('st-catharines-ontario-street-corridor-plan')).toMatchObject({
      city: 'St. Catharines',
      primarySource: expect.stringContaining('stcatharines.ca'),
    })
    expect(getGuideBySlug('does-not-exist')).toBeNull()
  })

  it('gives every guide a unique slug and official source', () => {
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(guides.length)
    expect(guides.every((guide) => guide.primarySource.startsWith('https://www.'))).toBe(true)
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/data/guides.test.js
```

Expected: FAIL because `./guides` does not exist.

**Step 3: Implement the data module**

Create `src/data/guides.js` with three concise guides derived only from the verified content registry. Each object must have: `slug`, `title`, `description`, `city`, `publishedDate`, `updatedDate`, `primarySource`, `whatItMeans`, `whatToWatch`, `relatedTrackerTerms`, and `newsletterPlacement: 'guide_inline'`.

Use these copy constraints:

```js
whatItMeans: [
  'State only what the municipal notice says; do not infer approval, denial, or a project timeline.',
  'Link readers to the primary document for the complete application and public-record details.',
],
whatToWatch: [
  'Published meeting or submission deadline, if the source provides one.',
  'Any future staff report, council agenda, or revised notice linked by the municipality.',
],
```

Do not copy a secondary publisher’s text. Do not use a claim such as “will be built,” “approved,” or “rejected” unless the primary source explicitly establishes it.

**Step 4: Run test to verify pass**

```bash
npm test -- src/data/guides.test.js
```

Expected: `2 passed` tests.

### Task 1.2: Add the reusable guide page with valid metadata and sources

**Objective:** Render each guide from data, so every page has distinct title/description/canonical/schema and a clear newsletter CTA.

**Files:**
- Create: `src/pages/GuidePage.jsx`
- Create: `src/pages/GuidePage.test.jsx`
- Modify: `src/App.jsx`

**Step 1: Write the failing rendering test**

```jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import GuidePage from './GuidePage'

function renderPage() {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        <GuidePage slug="st-catharines-ontario-street-corridor-plan" />
      </BrowserRouter>
    </HelmetProvider>,
  )
}

describe('GuidePage', () => {
  it('shows its official source, Planning Tracker link, and newsletter CTA', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /Ontario Street Corridor/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view the official notice/i })).toHaveAttribute('href', expect.stringContaining('stcatharines.ca'))
    expect(screen.getByRole('link', { name: /planning tracker/i })).toHaveAttribute('href', '/planning-tracker')
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/pages/GuidePage.test.jsx
```

Expected: FAIL because `./GuidePage` does not exist.

**Step 3: Implement `GuidePage.jsx` minimally**

The component must:

```jsx
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import NewsletterPanel from '../components/news/NewsletterPanel'
import { getGuideBySlug } from '../data/guides'
import '../components/news/news.css'

export default function GuidePage({ slug }) {
  const guide = getGuideBySlug(slug)
  if (!guide) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    mainEntityOfPage: `https://stcatharinesdigital.ca/guides/${guide.slug}/`,
    author: { '@type': 'Organization', name: 'St. Catharines Digital' },
    publisher: { '@type': 'NewsMediaOrganization', name: 'St. Catharines Digital' },
  }

  return (
    <>
      <Seo title={`${guide.title} | St. Catharines Digital`} description={guide.description} path={`/guides/${guide.slug}`} type="article" jsonLd={schema} />
      <article className="scd-page">
        <header className="scd-intro"><div><p className="scd-eyebrow">Official source guide · {guide.city}</p><h1 className="scd-intro-title">{guide.title}</h1><p className="scd-intro-note">{guide.description}</p></div></header>
        <section><h2 className="scd-section-rule">What the notice says</h2>{guide.whatItMeans.map((line) => <p key={line}>{line}</p>)}</section>
        <section><h2 className="scd-section-rule">What to watch</h2><ul>{guide.whatToWatch.map((line) => <li key={line}>{line}</li>)}</ul></section>
        <p><a href={guide.primarySource} target="_blank" rel="noopener noreferrer">View the official notice ↗</a></p>
        <p><Link to="/planning-tracker">Open the Planning Tracker →</Link></p>
        <aside><NewsletterPanel /></aside>
      </article>
    </>
  )
}
```

Use existing `scd-*` classes. Do not introduce gradients, generic SaaS cards, or a second newsletter API.

**Step 4: Add the route**

In `src/App.jsx`, import `GuidePage` and add a wrapper identical in shape to `BlogPostWrapper`:

```jsx
function GuidePageWrapper() {
  const { slug } = useParams()
  return <GuidePage slug={slug} />
}
```

Add this route immediately before the catch-all route:

```jsx
<Route path="guides/:slug" element={<GuidePageWrapper />} />
```

**Step 5: Run test to verify pass**

```bash
npm test -- src/pages/GuidePage.test.jsx
```

Expected: `1 passed` test.

### Task 1.3: Register guide routes for prerender and sitemap

**Objective:** Make the new public pages crawlable and deployable as static HTML.

**Files:**
- Modify: `src/data/routeManifest.js`
- Create: `src/data/routeManifest.test.js`

**Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest'
import { prerenderRoutes, sitemapRoutes } from './routeManifest'

const GUIDE = '/guides/st-catharines-ontario-street-corridor-plan'

describe('route manifest guides', () => {
  it('includes guide routes in prerendering and the sitemap', () => {
    expect(prerenderRoutes).toContain(GUIDE)
    expect(sitemapRoutes).toContain(GUIDE)
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/data/routeManifest.test.js
```

Expected: FAIL because the guide route is missing.

**Step 3: Implement a single source of truth for guide route strings**

In `src/data/routeManifest.js`, add:

```js
const guideRoutes = [
  '/guides/st-catharines-ontario-street-corridor-plan',
  '/guides/welland-first-street-consent-variance',
  '/guides/thorold-pamela-drive-watermain',
]
```

Then add `...guideRoutes` in `baseRoutes`, not separately in `sitemapRoutes` or `prerenderRoutes`. This preserves DRY because both outputs derive from `baseRoutes`.

**Step 4: Verify test and generated output**

```bash
npm test -- src/data/routeManifest.test.js
npm run build
for route in st-catharines-ontario-street-corridor-plan welland-first-street-consent-variance thorold-pamela-drive-watermain; do
  test -f "dist/guides/$route/index.html" && echo "PASS $route" || exit 1
done
```

Expected: test pass; build completes; three `PASS` lines.

**Step 5: Run schema audit**

```bash
npm run audit:schema
```

Expected: `Schema audit passed.`

**Step 6: Commit**

```bash
git add src/data/guides.js src/data/guides.test.js src/pages/GuidePage.jsx src/pages/GuidePage.test.jsx src/App.jsx src/data/routeManifest.js src/data/routeManifest.test.js
git commit -m "feat(content): add verified Niagara planning guides"
```

---

# Work Unit 2 — Conversion: make traffic become subscribers without dark patterns

**Commit boundary:** one commit, `feat(growth): add contextual newsletter conversion CTAs`.

### Task 2.1: Make newsletter placement measurable without collecting PII

**Objective:** Add a non-PII `placement` field to the existing newsletter request so the server can label newsletter origin.

**Files:**
- Modify: `src/components/news/NewsletterPanel.jsx`
- Modify: `functions/api/newsletter.js`
- Create: `src/components/news/NewsletterPanel.test.jsx`

**Step 1: Write the failing UI test**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import NewsletterPanel from './NewsletterPanel'

describe('NewsletterPanel', () => {
  it('sends its placement without sending it in the visible form', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)
    render(<NewsletterPanel placement="guide_inline" />)
    await screen.getByRole('textbox', { name: /email address/i }).focus()
    // Complete with fireEvent/userEvent already used by the project test setup.
    expect(screen.getByRole('button', { name: /subscribe free/i })).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/components/news/NewsletterPanel.test.jsx
```

Expected: FAIL once the assertion is expanded to assert the new payload because `placement` is absent.

**Step 3: Implement the minimal prop contract**

Change the signature to:

```jsx
export default function NewsletterPanel({ placement = 'site_rail' }) {
```

Change its request body to:

```js
body: JSON.stringify({ email: email.trim(), placement }),
```

In `functions/api/newsletter.js`, safely extract an optional placement, validate it against a closed list, and use it only as an AgentMail label:

```js
const ALLOWED_PLACEMENTS = new Set(['site_rail', 'guide_inline', 'planning_tracker', 'home'])
const placement = ALLOWED_PLACEMENTS.has(json?.placement) ? json.placement : 'site_rail'
```

For form-url-encoded requests set `placement = 'site_rail'`. Add the label `placement:${placement}` to the existing `labels` array. Never include email or phone in analytics labels/logging.

**Step 4: Expand and run the test**

Use `fireEvent.change` and `fireEvent.submit` to assert the request body equals:

```js
JSON.stringify({ email: 'reader@example.com', placement: 'guide_inline' })
```

Run:

```bash
npm test -- src/components/news/NewsletterPanel.test.jsx
```

Expected: PASS.

### Task 2.2: Add a context-specific newsletter CTA below every guide

**Objective:** Raise reader-to-subscriber conversion with an honest, relevant CTA.

**Files:**
- Modify: `src/pages/GuidePage.jsx`
- Modify: `src/pages/GuidePage.test.jsx`

**Step 1: Write the failing test**

Add this assertion:

```jsx
expect(screen.getByText(/Get new hearings and notice changes by email/i)).toBeInTheDocument()
```

**Step 2: Run to verify failure**

```bash
npm test -- src/pages/GuidePage.test.jsx
```

Expected: FAIL because the message does not exist.

**Step 3: Implement only this CTA block above the existing newsletter form**

```jsx
<section className="scd-rail-block" aria-labelledby="guide-alerts-heading">
  <h2 id="guide-alerts-heading" className="scd-rail-label">Get the next change by email</h2>
  <p className="scd-rail-text">Get new hearings and notice changes by email. Free weekly digest. Official sources only.</p>
  <NewsletterPanel placement="guide_inline" />
</section>
```

Do not say "urgent," add countdown timers, pre-check consent, or promise a delivery cadence the site cannot actually meet.

**Step 4: Run test to verify pass**

```bash
npm test -- src/pages/GuidePage.test.jsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/components/news/NewsletterPanel.jsx src/components/news/NewsletterPanel.test.jsx functions/api/newsletter.js src/pages/GuidePage.jsx src/pages/GuidePage.test.jsx
git commit -m "feat(growth): track newsletter CTA placements"
```

---

# Work Unit 3 — Revenue: sponsor offer discipline and $49 beta validation

**Commit boundary:** one commit for sponsor copy/source-of-truth, one separate commit for beta waitlist. No payment integration.

### Task 3.1: Eliminate conflicting sponsorship claims before more sales outreach

**Objective:** Keep sponsor pricing and placement promises internally consistent across site and documents.

**Files:**
- Modify: `src/pages/SponsorPage.jsx`
- Modify: `functions/api/sponsor.js`
- Modify: `docs/MEDIA_KIT_PLANNING_ALERT.md`
- Create: `src/pages/SponsorPage.test.jsx`

**Step 1: Choose and document one offer table**

The owner must choose one of these before implementation; do not blend them:

- **A — current public offer (recommended):** `$300/mo` primary, `$150/mo` category, `$50/notice`; manual inquiry and manual payment follow-up.
- **B — media-kit offer:** `$300/mo` digest only, `$250/mo` website only, `$500/mo` full suite; manual inquiry and manual payment follow-up.
- **C — pause public prices:** replace prices with “request media kit,” then sell manually.

Default to **A** unless the owner explicitly picks B or C, because it already matches the public `SponsorPage.jsx` and API labels.

**Step 2: Write a failing consistency test for option A**

```jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import SponsorPage from './SponsorPage'

describe('SponsorPage offer', () => {
  it('shows the three approved manual-inquiry tiers', () => {
    render(<HelmetProvider><BrowserRouter><SponsorPage /></BrowserRouter></HelmetProvider>)
    expect(screen.getByText('$300')).toBeInTheDocument()
    expect(screen.getByText('$150')).toBeInTheDocument()
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.queryByText(/pay now/i)).not.toBeInTheDocument()
  })
})
```

**Step 3: Run to verify baseline and then align copy**

```bash
npm test -- src/pages/SponsorPage.test.jsx
```

Expected: PASS for existing public page. Then update `docs/MEDIA_KIT_PLANNING_ALERT.md` to the same chosen offer, exact terms, and editorial-firewall language. Remove any statement that a Stripe link will be sent unless the owner explicitly restores Stripe work.

Replace sponsor email copy with this manual line in `functions/api/sponsor.js`:

```text
We will reply with availability, placement details, and manual invoice instructions within one business day.
```

**Step 4: Verify no Stripe references remain in production paths**

```bash
grep -RIn --exclude-dir=node_modules --exclude-dir=dist 'Stripe payment\|stripe.com\|STRIPE_' src functions || true
```

Expected: no output. If the owner selects a Stripe future placeholder, the only allowed string is `TODO: Stripe integration after owner approval` in documentation, not runtime UI/API copy.

**Step 5: Commit**

```bash
git add src/pages/SponsorPage.jsx src/pages/SponsorPage.test.jsx functions/api/sponsor.js docs/MEDIA_KIT_PLANNING_ALERT.md
git commit -m "fix(revenue): align sponsorship offer and manual follow-up"
```

### Task 3.2: Add a paid Planning Alerts beta waitlist — no checkout

**Objective:** Validate whether developers, lawyers, property consultants, and commercial real-estate professionals will join a $49/month professional-alert waitlist before building billing or fulfillment.

**Files:**
- Create: `src/pages/PlanningAlertsPage.jsx`
- Create: `src/pages/PlanningAlertsPage.test.jsx`
- Create: `functions/api/planning-alerts-waitlist.js`
- Modify: `src/App.jsx`
- Modify: `src/data/routeManifest.js`
- Modify: `src/components/Layout.jsx`

**Step 1: Write the failing page test**

```jsx
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import PlanningAlertsPage from './PlanningAlertsPage'

describe('PlanningAlertsPage', () => {
  it('describes the $49 beta without offering checkout', () => {
    render(<HelmetProvider><BrowserRouter><PlanningAlertsPage /></BrowserRouter></HelmetProvider>)
    expect(screen.getByRole('heading', { name: /Planning Alerts for professionals/i })).toBeInTheDocument()
    expect(screen.getByText(/$49\/month/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /join the beta waitlist/i })).toBeInTheDocument()
    expect(screen.queryByText(/checkout|pay now|subscribe now/i)).not.toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/pages/PlanningAlertsPage.test.jsx
```

Expected: FAIL because the component does not exist.

**Step 3: Implement the page and waitlist API**

The page must use existing `Seo` and `scd-*` styling, say exactly what is and is not committed, and include this copy:

```text
Planning Alerts for professionals
A $49/month beta for developers, lawyers, property consultants, and commercial real-estate professionals who need relevant planning notices in one weekly brief.

What the beta is intended to include: priority notice digest, municipality/category filters, and links to every official source.

This is a waitlist, not a checkout. We will contact qualified applicants before any paid beta begins.
```

The form fields are: `email` (required), `role` (required select: developer, lawyer, property-consultant, commercial-real-estate, other), `firmName` (optional), `municipalities` (optional checkboxes). POST to `/api/planning-alerts-waitlist`.

The new Pages Function must follow the error response style in `functions/api/newsletter.js`, validate email and role, use `AGENTMAIL_API_KEY` server-side only, and send the primary inbox a text email labelled `planning-alerts-beta` and `website-form`. It must return only:

```js
{ success: true, message: 'You are on the Planning Alerts beta waitlist.' }
```

Do not create D1 tables, user accounts, Stripe products, checkout sessions, recurring billing, or delivery automation in this work unit.

**Step 4: Add the route and static registration**

Add:

```jsx
<Route path="planning-alerts" element={<PlanningAlertsPage />} />
```

Add `'/planning-alerts'` to `baseRoutes` in `src/data/routeManifest.js`.

In `src/components/Layout.jsx`, add only one discoverable contextual link — `Planning Alerts` in the footer `Sections` group. Do not expand the already-crowded header navigation.

**Step 5: Run tests and build**

```bash
npm test -- src/pages/PlanningAlertsPage.test.jsx
npm run build
npm run audit:schema
```

Expected: test pass; build prints `Prerendering route: /planning-alerts`; schema audit passes.

**Step 6: Commit**

```bash
git add src/pages/PlanningAlertsPage.jsx src/pages/PlanningAlertsPage.test.jsx functions/api/planning-alerts-waitlist.js src/App.jsx src/data/routeManifest.js src/components/Layout.jsx
git commit -m "feat(revenue): add planning alerts beta waitlist"
```

---

# Work Unit 4 — Operating cadence: publish, distribute, sell, and decide

**Commit boundary:** documentation only, `docs(growth): add 30-day traffic and revenue runbook`.

### Task 4.1: Create a 30-day operating runbook

**Objective:** Turn the site changes into a repeatable weekly process rather than a one-off content burst.

**Files:**
- Create: `docs/growth/30-day-runbook.md`

**Step 1: Create the exact weekly sequence**

```md
# 30-Day Traffic and Revenue Runbook

## Monday — source scan (45 minutes)
1. Run the approved official-source scan.
2. Add only verified primary-source items to `src/data/contentRegistry.js`.
3. Select one item with a city + planning/council/infrastructure search angle.

## Tuesday — publish (60 minutes)
1. Create or update one `/guides/:slug` page.
2. Link to the primary source, `/planning-tracker`, the matching `/news/:city`, and the newsletter CTA.
3. Run tests, build, schema audit, and deploy only after all pass.

## Wednesday — distribution (30 minutes)
1. Send the weekly digest to opted-in subscribers only.
2. Use one factual subject line naming city + decision/notice; no clickbait.
3. Share only the published site URL and primary source citation, not copied outlet text.

## Thursday — sales (45 minutes)
1. Research five local firms with an obvious audience fit: planning law, real estate, builders, civil engineering, mortgage/title services.
2. Send five individualized sponsor emails that reference one real page/notice and the editorial firewall.
3. Record outcome in the owner-controlled CRM or `docs/SPONSORSHIP_OUTREACH_TRACKER.md`; do not bulk spam.

## Friday — scorecard (20 minutes)
1. Record Search Console clicks, impressions, queries, and indexing status.
2. Record newsletter signups by placement, sponsor conversations, proposals, and beta-waitlist count.
3. Apply the 14-day and 30-day stop criteria from the implementation plan.
```

**Step 2: Verify documentation links exist**

```bash
for path in /planning-tracker /news/st-catharines /news/welland /news/thorold /sponsor /planning-alerts; do
  grep -q "$path" src/data/routeManifest.js || echo "MISSING $path"
done
```

Expected: no `MISSING` output after Work Unit 3.

**Step 3: Commit**

```bash
git add docs/growth/30-day-runbook.md
git commit -m "docs(growth): add 30-day acquisition runbook"
```

---

# Final validation and deployment

Run this exact sequence from `/Users/cmd/workspace/stcatharinesdigital-site` after all work units are complete:

```bash
git status --short
npm test
npm run build
npm run audit:schema
for route in / /guides/st-catharines-ontario-street-corridor-plan /guides/welland-first-street-consent-variance /guides/thorold-pamela-drive-watermain /planning-alerts /sponsor; do
  test -f "dist${route%/}/index.html" || { echo "MISSING prerender: $route"; exit 1; }
done
npx wrangler pages deploy dist --project-name=stcatharinesdigital
```

Expected:

- all Vitest tests pass;
- build exits 0 and prints `--- Prerendering Complete! ---`;
- schema command prints `Schema audit passed.`;
- every route is present under `dist/`;
- Wrangler returns a concrete `https://<deployment>.stcatharinesdigital.pages.dev` deployment URL.

Then verify the exact deployment URL before stating it is live:

```bash
DEPLOY_URL='https://REPLACE-WITH-WRANGLER-OUTPUT.stcatharinesdigital.pages.dev'
for path in / /guides/st-catharines-ontario-street-corridor-plan /planning-alerts /sponsor; do
  curl -sS -o /dev/null -w '%{http_code} %{url_effective}\n' "$DEPLOY_URL$path"
done
```

Expected: four HTTP `200` responses. Do not claim production deployment until the production domain returns the same successful routes or Cloudflare confirms promotion.

# Risks, tradeoffs, and open questions

- **Source accuracy risk:** municipal notices change, move, or expire. The registry gate and visible primary-source links prevent accidental reliance on stale secondary reporting, but require weekly maintenance.
- **Indexing risk:** new pages are not guaranteed to rank. Search Console, sitemap submission, internal links, and usefulness are necessary; they are not a traffic guarantee.
- **Revenue risk:** a low subscriber count makes sponsor packages less valuable. The plan prioritizes sponsor conversations and a 14-day kill/reprice gate instead of pretending CPM economics are already proven.
- **Paid beta risk:** $49/month must be validated through qualified waitlist demand and direct interviews before recurring billing/delivery work. Stripe scope remains excluded in this plan. As of 2026-09-13, the owner authorized an Interac e-Transfer payment path and a Founding Supporter membership page to support the Planning Alerts MVP and Founding Supporter spec; those are manual/early-path revenue experiments, not a replacement for the validated paid beta gate.
- **Compliance risk:** consent and unsubscribe behavior need a chosen email platform policy before high-volume marketing sends. Existing AgentMail emails may be used only for transactional confirmation and opt-in messaging until this is settled.
- **Technical risk:** Lighthouse remains unavailable because this host has no Chrome. Resolve by installing a verified browser or running the audit in CI; do not replace it with invented performance scores.
- **Open question — sponsorship offer:** owner must select A/B/C in Task 3.1 before copy changes.
- **Open question — measurement:** owner must confirm which analytics tool is authoritative (Search Console only, GA4, Plausible, or Cloudflare Web Analytics) before client event code is added.
- **Open question — email:** owner must pick the sending/list platform and unsubscribe model before implementing a recurring weekly digest.
