# News hub rebuild on owned primitives

Written against: bce09db5

## Evidence chain

- Surface: `/news` hub, full file `src/pages/NewsPage.jsx` (58 lines).
- Problem: 10 classes with zero definitions in any `src` stylesheet (`page`, `news-index`, `news-index-header`, `kicker`, `lead`, `city-hubs`, `card-grid`, `city-card`, `source-link`, `editorial-standards`); only the bare `card` token inside resolves. The entry hub to every city renders on browser defaults plus global element rules. A nested interactive element (`a` inside router `Link`) sits in each city entry.
- Design evidence: site contract reuse list (`scd-page`, `scd-intro`, `scd-eyebrow`, `scd-section-rule`, `scd-cat`, `card`, `meeting-card`, `badge`, `button`); `src/components/news/news.css` (`scd-page`, `scd-intro` family, `scd-section-rule`); `src/styles.css` (`card`, `button`, `badge`); contract page-layout rule (page-specific layout lives in a new additive stylesheet under `src/components/news/`, `var(--*)` only).
- Owner: `src/pages/NewsPage.jsx` (no stylesheet; none exists for it).
- Scope and affected surfaces: `/news` only. Single consumer for all 10 names.
- Uncertainty: none on owners; rendered side-by-side confirmation was not performed (read-only audit, no visual inspection requested).

## Design decision

Rebuild the hub on owned primitives with one page-scoped additive stylesheet for grid layout only, because no owner exists for any hub composition and the contract explicitly permits page-scoped additive layout. All copy and all destinations stay identical.

## Reuse

- `scd-page`, `scd-intro`, `scd-eyebrow`, `scd-intro-title`, `scd-intro-note` (`src/components/news/news.css`)
- `scd-section-rule` for `City Hubs`, `Other Coverage`, `Editorial Standards` headings
- `card` (`src/styles.css`) for city and coverage entries
- `badge badge-status` for the `Official Sources Only` kicker if a chip reads better than eyebrow text (either is owned; pick one)
- Exemplar header: `src/pages/SponsorPage.jsx` `scd-sponsor-intro`
- Exemplar ruled sections: `src/pages/HomePage.jsx` `scd-section-rule` blocks

New page-scoped (not shared) primitive: `src/components/news/news-hub.css` containing ONLY the responsive card grid (1 col under 640px, 2 col to 899px, 3 col at 900px+, gap `var(--sp-4)`). Justification: no existing grid owner fits link-cards (sponsor grid is sponsor-scoped, latest-list is article-scoped); single consumer; contract-sanctioned location.

## Changes

1. `src/pages/NewsPage.jsx` shell and header (lines 13-18)
   - Change: `main` becomes `div className="scd-page"`; header becomes `scd-intro` with `scd-eyebrow` (`Official Sources Only`), `scd-intro-title` (`Local News`), `scd-intro-note` (existing dek copy).
   - Preserve: Seo block and all copy verbatim.
   - Verify: hub header matches HomePage/sponsor intro rhythm.
2. `src/pages/NewsPage.jsx` sections (lines 20-54)
   - Change: each `h2` becomes `scd-section-rule`; each `card-grid` becomes the new hub grid class; city entries keep `card` and drop `city-card`; official-site line becomes non-nested text link (keep both destinations, never nest interactives); drop `city-hubs`, `news-index-links`, `editorial-standards`, `source-link`, `kicker`, `lead`, `page`, `news-index*` names entirely.
   - Preserve: every city from `cityConfig`, all 3 coverage links and destinations, editorial-standards paragraph verbatim.
   - Verify: 4 city cards plus 3 coverage cards render as owned cards at 390px and 1240px.
3. `src/components/news/news-hub.css` (new file, imported by NewsPage)
   - Change: grid layout only, `var(--*)` spacing, no colors, no fonts.
   - Preserve: nothing else lives in this file.
   - Verify: file contains no color, font-family, or hardcoded px outside the three breakpoints.

## Scope

- Inherit: `/news` only.
- Verify: city routes linked from the hub; dark theme via vars; no impact on HomePage/CityNewsPage (no shared owner touched).
- Exclude: city data shape; Seo; blog routes; tracker/council destinations.

## Validation

- Product: open `/news`; header, 4 city cards, 3 coverage cards, standards section all on-system; every card navigates to its current destination.
- Interface: 390px single column, 1240px three column; keyboard tab order passes through cards without a nested-link stop.
- System: no new token, no new shared class; hub css holds layout only.
- Repository: `grep -rn "news-index\|city-hubs\|card-grid\|city-card\|source-link\|editorial-standards\|\"kicker\"\|\"lead\"\|\"page " src/pages/NewsPage.jsx` → empty; `npm test` green; `npm run build` exit 0; `grep -o 'scd-section-rule' dist/news/index.html` → 3 hits.

## Stop conditions

- Stop if a city entry cannot keep both destinations without nested interactives (escalate, do not drop a destination silently).
- Stop if the grid needs anything beyond columns/gap (re-scope, do not grow the additive file into a second system).

## Design documentation

- None. No doc update required.
