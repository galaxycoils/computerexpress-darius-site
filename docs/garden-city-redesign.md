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
- Prerender uses Vite-generated assets and excludes private utility routes from the sitemap.

## Validation

Baseline: 49 application tests, 19 regression tests, content audit without errors (three existing adapter-review warnings).
Updated local verification: 55 application tests, 19 regression tests, 65 prerendered routes.
Browser verification is defined in `.github/workflows/redesign-browser.yml`; record the run result before release.

## External and ongoing prerequisites

These are not claimed complete by code changes:

- Subscriber confirmation/inbox delivery and contact delivery require configured services and an authorized test recipient. No real subscriber messages were sent in this task.
- A broader community-event calendar, food guides and community-photo feature need actual submissions, rights-cleared material and a person maintaining them. The current events product is explicitly a civic calendar.
- A role-based editorial CMS/admin dashboard requires an authentication and role model. The existing repository remains the editorial source of truth; no unprotected admin route is exposed.
- Field performance and accessibility conformance require measured evidence; no score or conformance certification is asserted.
- Paid services, costs, quotas and backup restoration require account-level checks. No new paid provider or plan was purchased.

## Operations and rollback

Before each production release, retain the last successful Cloudflare deployment and its SHA. Release metadata is at `/release.json`. Verify SHA, snapshot hash and representative live pages after deployment. A green collector run alone does not establish that content is public.

Rollback: use Cloudflare Pages deployment rollback to the recorded prior successful deployment, then verify its `/release.json` and routes. Do not reset or force-push main. Data restore is separate; this redesign does not change database schemas or subscriber records.

No-change collections retain the public snapshot and upload a source-health artifact. Review source failures and zero-item extraction in that artifact. Source adapters remain accountable to their registry policy; uncertain publication dates stay unknown.

## Source and media register

Existing local photographs: see `src/data/localPhotos.js` for photographer, file-photo date, source and CC BY-SA version. Cropping is presentation-only; keep attribution with the displayed image. New guide sources: see `src/data/exploreGuides.js`, checked September 21, 2026. No generated documentary images were used.
