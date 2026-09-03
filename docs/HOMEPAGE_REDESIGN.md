# Homepage redesign — Planning Alert primary

## What changed

`src/pages/HomePage.jsx` rewritten so the homepage now reflects what the team is actually building: the Planning Alert free weekly digest of official municipal planning notices.

## New page structure

1. **Hero** — Planning Alert is the lead. "Official municipal planning notices, tracked and delivered." Inline email capture form (POSTs to `/api/newsletter`) is the sole primary CTA. Trust badges shift from "Technical SEO audit" to "Official sources only", "4 municipalities", and active-notice count.
2. **Live Notice Preview** — aside in the hero shows up to 4 deduplicated active/upcoming notices pulled from `planningNotices.js` via `getActiveNotices()` + `getUpcomingMeetings()`. Secondary CTA: "Browse active notices" → `/planning-tracker`.
3. **Trust bar, stats bar** — rewritten for the Planning Alert positioning (active notices count, upcoming meetings, municipalities, "no paywalls behind official notices").
4. **What the Planning Alert is** — three cards: what we track, how it arrives, how it stays independent (editorial firewall).
5. **Live notices — proof of inventory** — up to 6 active notice cards with municipality, type, title, description, meeting date, and source link back to the official municipal URL.
6. **Services** — demoted to secondary, compact exhibition list (web design, technical SEO, GBP), link to `/services`.
7. **Process, testimonials, guarantee, pricing, FAQ** — preserved from the old homepage, trimmed/updated where needed.
8. **Sponsor CTA** — bottom-of-page only. "Sponsor the Planning Alert" with media-kit link. No sponsor pricing appears above the proof-of-inventory.

## Acceptance criteria (from @revenue-monetization-strategist)

- Planning Alert is the sole primary CTA ✅
- No sponsor price or legacy agency pitch above the proof-of-inventory ✅
- Inline email capture in the hero posts to `/api/newsletter` ✅
- `npm run build` passes ✅ (44 routes prerendered, sitemap, `/planning-tracker` in build)
- 9 vitest tests passing: hero capture submission, live-notice rendering, CTA destinations, empty/failed submission states, sponsor-pricing gate, services link ✅

## Tests added

`src/pages/HomePage.test.jsx` — 9 tests covering:
- hero renders Planning Alert as lead
- hero CTA is inline email capture with correct button label
- empty submission rejected
- valid email POSTs to `/api/newsletter`
- failed submission shows error state
- live active notices render
- "Browse active notices" links to `/planning-tracker`
- no sponsor pricing above the proof-of-inventory
- services link goes to `/services`

## Supporting files

- `src/setupTests.js` — jsdom polyfills for `matchMedia` and `IntersectionObserver` so `useInView` and scroll effects do not crash during test renders.
- `vitest.config.js` — jsdom environment, `@testing-library/jest-dom` setup.
- `package.json` — `test` and `test:watch` scripts added; `@testing-library/react`, `jsdom`, `vitest` already present.
- `src/components/Seo.jsx` — default `/` title/description updated to the Planning Alert positioning.

## Bug fixed during implementation

`featuredNotices` was built by concatenating `.slice(0, 3)` of `activeNotices` and `.slice(0, 1)` of `upcomingMeetings`. When the same notice (e.g. the Ontario Street Corridor public meeting) appears in both arrays, React throws a duplicate-key warning. Fixed by deduplicating on `id` with a `Set` as we build `featuredNotices`.

## Deployment status

`wrangler pages deploy dist --project-name=stcatharinesdigital` was run. 47 files uploaded; a final fetch step failed. The deploy outcome is **unverified** until the live production homepage is probed — see next step.

## Next

Probe production `/` and `/planning-tracker` to confirm the new homepage is live. If the deploy did not land, diagnose the empty `CLOUDFLARE_API_TOKEN` environment (token is set but zero-length) or fall back to `git push` auto-deploy if the repo is wired to Cloudflare Pages git integration.
