# City news header rebuild on canonical owners

Written against: bce09db5

## Evidence chain

- Surface: `/news/:citySlug` header block plus 3 feed labels plus not-found branch (routes st-catharines, welland, thorold, niagara-falls). File `src/pages/CityNewsPage.jsx` lines 117-190 and 44-56.
- Problem: header renders 8 `scd-*` classes with zero definitions in any `src` stylesheet (`scd-kicker`, `scd-kicker-dot`, `scd-hero-title`, `scd-hero-lead`, `scd-side-text`, `scd-city-row`, `scd-city-chip`, `scd-layout`; single consumer). Feed subsections use `scd-feed-label`, a byte-near duplicate of the pre-override `scd-section-rule` that missed the current `.875rem` scale override, with the same inline `marginTop: 2rem` patch repeated 3 times. The not-found branch titles with undefined `scd-hero-title`.
- Design evidence: site contract reuse list (`scd-page`, `scd-intro`, `scd-eyebrow`, `scd-section-rule`, `scd-cat`, `card`, `meeting-card`, `badge`, `button`); `src/components/news/news.css` owners `scd-intro` + `scd-eyebrow` + `scd-intro-title` + `scd-intro-note`, `scd-section-rule`, `scd-empty`, `scd-more`; dead duplicate owner `scd-section-label`/`scd-feed-label` with zero consumers outside this file.
- Owner: `src/pages/CityNewsPage.jsx` and `src/components/news/news.css`.
- Scope and affected surfaces: 4 city routes plus the `!city` not-found branch. `NoticeCard` rows underneath are owned and untouched.
- Uncertainty: none on owners; rendered side-by-side confirmation was not performed (read-only audit, no visual inspection requested).

## Design decision

Replace the bespoke header dialect with the canonical `scd-intro` composition and move all three feed labels to `scd-section-rule`, because the dialect has no owners and the duplicate label owner has drifted off-scale. Delete the orphaned `scd-feed-label`/`scd-section-label` rule block. Copy stays byte-identical; only classes change.

## Reuse

- `scd-page` (already on the wrapper, keep)
- `scd-intro`, `scd-eyebrow`, `scd-intro-title`, `scd-intro-note` (`src/components/news/news.css`)
- `scd-section-rule` (same file)
- `badge badge-status` for the city/dateline facts row if the kicker-dot treatment needs a home; otherwise plain `scd-eyebrow` text
- Exemplar: `src/pages/SponsorPage.jsx` `scd-sponsor-intro` header composition
- Exemplar: `src/pages/HomePage.jsx` `scd-section-rule` usage

No new primitive: every replacement owner already exists and already serves the same job on sibling surfaces.

## Changes

1. `src/pages/CityNewsPage.jsx` header block (lines 117-145)
   - Change: kicker paragraph becomes `scd-eyebrow`; title becomes `scd-intro-title`; description becomes `scd-intro-note`; last-updated line becomes `scd-intro-note` second paragraph or `scd-lead-byline`; city-chip row becomes plain `scd-nav`-style inline links or `badge`-row — pick the `scd-sponsor-facts` badge-row pattern from the exemplar; wrap block in `header className="scd-intro"`.
   - Preserve: all visible copy, all 5 destinations, `role="navigation"` and its aria-label.
   - Verify: rendered header matches HomePage intro rhythm (eyebrow, Playfair title, serif note).
2. `src/pages/CityNewsPage.jsx` feed labels (3 sites) plus not-found `h1`
   - Change: all three `scd-feed-label` divs become `h2 className="scd-section-rule"` with matching `id`s; drop the 3 inline `marginTop` styles; not-found `h1` becomes `scd-intro-title` inside `scd-page` (keep existing `scd-more` return link).
   - Preserve: section order (Latest, Planning, Police), empty-state `scd-empty` block verbatim.
   - Verify: no inline `style=` remains in the file.
3. `src/components/news/news.css` dead owners
   - Change: delete the `scd-section-label, scd-feed-label` rule block.
   - Preserve: `scd-section-rule` and its responsive override untouched.
   - Verify: ownerless-name grep below returns empty.

## Scope

- Inherit: all 4 city routes and the not-found branch receive the change automatically (single file).
- Verify: HomePage and SponsorPage section headers (shared `scd-section-rule` owner, must not shift); dark theme via vars.
- Exclude: `NoticeCard` internals; feed filtering logic; Seo tags; the separate tracker empty-state/card-view work.

## Validation

- Product: open `/news/st-catharines`, `/news/welland`, `/news/thorold`, `/news/niagara-falls` plus a bad slug; header, three ruled sections, and not-found branch all render on-system.
- Interface: desktop 1240px and 390px mobile; zero-result city still shows the `scd-empty` recovery block.
- System: no new color, font, or spacing value; no new shared class.
- Repository: `grep -rhoE "\.(scd-kicker|scd-kicker-dot|scd-hero-title|scd-hero-lead|scd-side-text|scd-city-row|scd-city-chip|scd-layout|scd-feed-label|scd-section-label)\b" src --include="*.jsx" --include="*.css"` → only `scd-sponsor-kicker` (unrelated) or empty; `grep -rn "style={{" src/pages/CityNewsPage.jsx` → empty; `npm test` green; `npm run build` exit 0; `grep -o 'scd-intro-title' dist/news/st-catharines/index.html` → hit.

## Stop conditions

- Stop if the city-chip row cannot be expressed with badges/eyebrow text without inventing a new component (escalate, do not invent).
- Stop if `scd-section-label` gains a second consumer before execution (reconcile instead).

## Design documentation

- None. After acceptance, no doc update required (`HOMEPAGE_REDESIGN.md` is superseded and stays untouched).
