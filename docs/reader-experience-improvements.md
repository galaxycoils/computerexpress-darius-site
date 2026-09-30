# Reader experience improvements

This report describes the reader-experience release and its local validation. The production deployment workflow verifies the published revision and representative routes after release.

## What changed

- The mobile edition selector, menu keyboard handling, route focus and history scroll restoration make navigation more predictable. Filter changes preserve the reader's position.
- Site search now covers news, development records, civic meetings and local guides, with section filters, removable filter chips, useful empty states and accessible pagination.
- Reading lists support guides and civic/development records, deduplicate stored IDs, retain data when storage writes fail, confirm clearing and offer Undo.
- Contact and reader-support pages use the newsroom's visual system. Corrections carry the article URL into the form; event and accessibility inquiries have their own submission kinds.
- Form errors focus the relevant field. Failed requests retain entered details. Contact, sponsorship and newsletter submissions require explicit API confirmation, with timeouts and useful recovery messages.
- Light and dark themes have corrected contrast, shared color tokens and early theme initialization. Small screens no longer overflow on the development filters. SVG controls keep decorative icons out of accessible names.
- Images use generated 480px/800px WebP variants and explicit dimensions. The two visible typefaces are preloaded to reduce loading shifts. More routes and contact styles load on demand; the navigation stays visible while page code loads.
- Missing records have their own canonical URLs and noindex metadata. Structured data escapes script delimiters. Prerendered HTML is hydrated only when it matches the requested route and filter state.
- Static Cloudflare Pages responses gain browser security headers. The outreach script reads its API key from the environment instead of embedding a credential.
- Private alert links preserve router history and still load when browser storage is blocked. The preferences page uses the shared main landmark and announces selected filters.
- The README describes the current development, assets, tests and service configuration. CI runs responsive checks and the reader journeys.

## Validation

The final production build passed, along with:

- 121 automated tests in 28 files and 25 collector/service regression checks.
- The existing coverage gate: 100% coverage for its three enforced files; this is not whole-site coverage.
- 64 responsive page checks at 320, 390, 768 and 1440 pixels, plus 12 reader journeys.
- 62 prerendered routes with one main landmark, one main heading and no detected hydration or page errors.
- 60 automated accessibility checks across 15 routes, two widths and both themes, with zero detected WCAG A/AA violations or horizontal overflow.
- Structured-data and content-integrity audits; the content audit retains three source-review warnings listed below.
- The production dependency audit, with zero known vulnerabilities, and `git diff --check`.

Browser form checks use mocked responses and send no messages. The calendar journey fixes its test clock to the seeded event dates.

The homepage's static gzip JavaScript decreased from 107.3 KB to 98.5 KB; CSS decreased from 17.1 KB to 17.0 KB. On the tested mobile viewport, the selected lead image decreased from 153,760 bytes to 54,814 bytes. Original photos and their credit/license information are retained.

Local mobile Lighthouse comparison on the homepage:

| Measurement | Before | After |
| --- | ---: | ---: |
| Performance | 90 | 97 |
| Accessibility | 96 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| Largest contentful paint | 3.31 s | 2.56 s |
| Cumulative layout shift | 0.013 | 0 |

These are individual runs against local Vite production preview with simulated mobile throttling. Results can vary between runs. Diagnostic artifacts are in the ignored `.qa/` folder and reader-journey screenshots/reports are in `artifacts/browser/`.

## Release follow-up

- Rotate the AgentMail credential that was previously embedded in the outreach script. Removing it from the working tree does not revoke it or remove it from Git history.
- Verify deployed Pages headers and live function bindings/secrets. Vite preview cannot validate Cloudflare response headers, D1 delivery or email receipt.
- The content audit still flags the existing St. Catharines, Welland and Thorold source adapters for editorial review. It reports no content-integrity errors. No reporting or event outcomes were invented to resolve those warnings.
- Membership and sponsorship pages invite inquiries; paid offerings and delivery promises require an actual service agreement.

Automated accessibility and performance measurements describe the tested local build. They do not establish accessibility conformance or live production performance for every route.
