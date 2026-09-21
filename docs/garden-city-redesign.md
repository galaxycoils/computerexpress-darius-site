# Garden City redesign implementation

Implemented September 21, 2026.

## Delivered

- New photographic masthead/front page, cobalt/paper/apricot palette, two-font typography, responsive section compositions and light/dark/system themes.
- Shared publication selector for home, news, city editions, search, saved stories and RSS. Stable source deduplication, source-type labels, date filters and explicit unknown dates.
- Searchable, paginated news with city/topic/type/date filters in the URL. Device-local city preference and bookmarks.
- Civic calendar with list/month views, city/date filters, event detail pages and DST-aware ICS downloads.
- Development record pages with file references and scheduled dates; tracker links to them.
- Three source-linked Explore guides, accessibility page and contextual event/accessibility contact forms.
- Source-brief article layout with credited file photographs, save/copy/print controls and related records. Older unverified expanded summaries are not rendered.
- Collector preserves editorial rejection/review/withdrawal state and prior source-health records. Zero extraction becomes a source failure; operational report is separate from publication changes.
- Collector passes exact post-commit SHA to deploy. Deployment serializes releases, skips superseded builds, writes release metadata and verifies the live hash plus key pages.
- Newsletter signup uses expiring, hashed confirmation tokens, explicit confirmation, preferences and unsubscribe pages. Provider failures return errors; confirmation GET requests do not activate subscriptions.
- Fonts are self-hosted to avoid external font requests.
- Prerender uses Vite-generated assets and excludes private utility routes from the sitemap.

## Validation

Baseline: 49 application tests, 19 regression tests, content audit without errors (three existing adapter-review warnings).
Updated verification: 55 application tests, 21 regression tests, 65 prerendered routes. Content and schema audits pass.
Browser run [35651833662](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/35651833662) passed 44 responsive page checks at 320/390/768/1440px and six reader journeys. Desktop, mobile and dark-theme screenshots were inspected. CI Matrix and Content integrity also passed on `d01c773e82af41fbe2e823b244995a613eca7f31`.

Production [run 35652009920](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/35652009920) succeeded. Live verification matched revision `41b6710f4f21b39c8cfc0603887a10abdae41bad`, snapshot `e158e3fb0dfad7b361803fa267392d1fb4a92decdf899a3697bb01336684c2bb`, 112 records, and home/news/events/explore page content. Migration 0007 applied successfully.

## External and ongoing prerequisites

These are not claimed complete by code changes:

- Subscriber confirmation/inbox delivery and contact delivery require configured services and an authorized test recipient. No real subscriber messages were sent in this task.
- A broader community-event calendar, food guides and community-photo feature need actual submissions, rights-cleared material and a person maintaining them. The current events product is explicitly a civic calendar.
- A role-based editorial CMS/admin dashboard requires an authentication and role model. The existing repository remains the editorial source of truth; no unprotected admin route is exposed.
- Field performance and accessibility conformance require measured evidence; no score or conformance certification is asserted.
- Paid services, costs, quotas and backup restoration require account-level checks. No new paid provider or plan was purchased.

## Operations and rollback

The previous successful production revision is `d0c0ad87c70a4ddf71116cc5824abc5c5a4e4bdf`, deployed by [run 35648330854](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/35648330854). This is the pre-redesign rollback reference.

Before each production release, retain the last successful Cloudflare deployment and its SHA. Release metadata is at `/release.json`. Verify SHA, snapshot hash and representative live pages after deployment. A green collector run alone does not establish that content is public.

Rollback: use Cloudflare Pages deployment rollback to the recorded prior successful deployment, then verify its `/release.json` and routes. Do not reset or force-push main. Data restore is separate; migration 0007 adds a newsletter token table and indexes without removing existing data. Subscription changes occur only through reader actions.

No-change collections retain the public snapshot and upload a source-health artifact. Review source failures and zero-item extraction in that artifact. Source adapters remain accountable to their registry policy; uncertain publication dates stay unknown.

## Source and media register

Existing local photographs: see `src/data/localPhotos.js` for photographer, file-photo date, source and CC BY-SA version. Cropping is presentation-only; keep attribution with the displayed image. New guide sources: see `src/data/exploreGuides.js`, checked September 21, 2026. No generated documentary images were used.
