# Standard Visual Register — Design Spec

**Project:** St. Catharines Digital (`stcatharinesdigital.ca`)  
**Reference:** `stcatharinesstandard.ca` — visual register only (not a CMS clone)  
**Status:** Approved, execution started (Phase 1 live)  
**Author:** @lead-orchestrator-2  
**Approved by:** @user (verbal sign-off, 2026-09-10)  
**Companion review:** @architect (scope framing), @hermes (design-language pull)

---

## 1. Goal

Re-skin St. Catharines Digital to the **visual register** of the St. Catharines Standard: paper-white surface, blue accent, masthead-with-utilities header, full-width blue nav bar with section spread, newspaper serif display headlines, sidebar density, and a multi-column lead row on the home page.

**What does NOT change:** three city hubs, editorial-sourcing rules, official-source-only content model, notice-card → official-source link behavior, all data files, all routes. This is skin + layout + typography.

---

## 2. Scope: adopt / adapt / discard

| Standard pattern | Decision | Notes |
|---|---|---|
| White paper background + blue accent | **Adopt** | Phase 1 token swap; drop dark surface for v1 |
| Blue nav bar with section spread | **Adapt** | Phase 2: rewrite nav to our real sections (§4) |
| Masthead with logo left + widget right | **Adapt** | Phase 2: restructure header grid to logo-left / utility-right |
| Serif display headlines + sans UI | **Adapt** | Phase 1: Playfair Display + Inter; Source Serif 4 body kept |
| Light cards with image-led layout | **Adapt** | Our notices are text-only from official sources — cards stay text-led, adopt Standard label/date/chip register; NO fake images |
| "Most Popular" 3-col ranked grid | **Adapt → Featured Active Notices** | Phase 3: home lead row becomes a Standard-style 3-col featured row |
| Section sidebar (Most Popular / new-from) | **Adapt → Official sources + desk shortcuts** | Phase 3/4: re-skin existing rail to Standard sidebar register |
| Sports / Life / Opinion / Obituaries / Classifieds | **Discard** | We don't run those sections. No empty nav slots. |
| Weather widget baked into header | **Discard for v1** | Out of scope; can revisit later if wanted |
| "Today's Paper" / subscription CTAs | **Discard** | Free site, no paywall |

---

## 3. Theme tokens (Phase 1 — DONE)

**Token file:** `src/styles/theme-civic.css`  
**Gate:** grep-clean for hardcoded hex accent values across `src/components`, `src/styles`, `src/pages`.

| Token | Value | Notes |
|---|---|---|
| `--paper` | `#faf8f4` | Warm near-white newsprint, not clinical `#ffffff` |
| `--paper-2` | `#f2ede3` | Softer paper for panels/rails |
| `--raised` | `#ffffff` | Card surfaces |
| `--ink` | `#111110` | Body ink |
| `--ink-2` | `#333331` | Body text |
| `--ink-3` | `#5c5a54` | Muted text |
| `--ink-4` | `#8a877e` | Muted-lite / datelines |
| `--rule` | `#e3ddd2` | Hairlines |
| `--rule-2` | `#c9c2b2` | Stronger rules |
| **`--signal` / `--primary`** | **`#0072bc`** | **Standard blue — the single most important swap** |
| `--signal-soft` | `rgba(0,114,188,0.09)` | Blue-tinted panel backgrounds |
| `--font-display` | `'Playfair Display'` | Newspaper display serif (was Fraunces) |
| `--font-body` | `'Source Serif 4'` | Body serif (unchanged) |
| `--font-ui` | `'Inter'` | UI sans (was IBM Plex Sans) |
| `--font-mono` | `'IBM Plex Mono'` | Datelines / eyebrows (unchanged) |

**Semantic aliases preserved for backward compat:** `--emerald` → `--signal`, `--accent` → `--signal`, `--danger` → `--signal`, `--info` → `--signal`. Existing component CSS that references `--emerald`, `--accent`, etc. continues to resolve to the blue accent.

**Dark surface:** dropped for v1. The theme toggle in `Layout.jsx` still flips `localStorage` key `theme-v2` between `"light"` and `"dark"`, but both states now resolve to the same paper tokens — the surface does not change. A future phase can reintroduce a dark-navy newsprint surface if desired.

**Fonts loaded:** Playfair Display (600/700/800 + italic 600/700), Source Serif 4, Inter (400/500/600/700), IBM Plex Mono — all via one Google Fonts import in `theme-civic.css`.

---

## 4. Nav structure (Phase 2 — locked, option 1)

Adapt the Standard's section-spread density to our real sections. No invented sections.

**Primary nav bar (desktop, always visible, blue bar):**
`Home` · `News ▾` (dropdown: St. Catharines / Welland / Thorold / Police releases) · `Planning` · `Police` · `Council` · `About`

**Dropdown:** Standard register — hover on desktop, click on tap. Dropdown items already exist in `Layout.jsx` as `NEWS_DROPDOWN` (`/news/st-catharines`, `/news/welland`, `/news/thorold`, `/news/police`). Phase 2 is re-skin + reorder, not new content.

**Mobile:** keep the existing drawer pattern, re-skin to Standard mobile-nav register.

**What we do NOT add:** sports, obituaries, classifieds, life, opinion. The Standard's density comes from real sections; ours comes from the city-hub dropdown plus our five real sections — enough to read as a newspaper nav without inventing coverage.

---

## 5. Header / masthead (Phase 2)

**Target shape:**
- Top bar: logo left, utility right (theme toggle + future search/weather). Restructure `.scd-mast-top` grid from centered-brand to logo-left / utility-right.
- Eyebrow/dateline: keep `.scd-dateline` (mono, uppercase, small) — already reads as a newspaper dateline.
- Below top bar: separate **blue nav bar** with white text. This is the single largest visual change in the header and the thing that most says "Standard." Current nav (`.scd-nav-row`) sits inside the mast; Phase 2 lifts it into its own bar.

**Logo:** text logotype only for v1 ("St. Catharines Digital" in Playfair Display + tag in mono). No logo asset required.

---

## 6. Home page layout (Phase 3)

**Current:** single lead column + river on the left, sidebar rail on the right (`.scd-front` grid: `minmax(0, 1.7fr) minmax(240px, 0.85fr)` at ≥900px).

**Target shape:**
- Top: blue nav bar (Phase 2) above the fold.
- **Lead row:** Standard-style multi-column lead story row. Lead story (`featured[0]`) largest; next 2–3 notices form a supporting row beneath it at smaller scale. Same hierarchy, newspaper grid. Home only.
- **Article feed:** vertical list of notice cards in the Standard's list register.
- **Sidebar:** re-skin existing `.scd-rail` (official sources panel + editorial standards + public-safety notice) to Standard sidebar register. Content unchanged.
- **City strip:** keep `.scd-sections`, re-skin to Standard strip register.

**Component logic unchanged:** `HomePage.jsx` data loading, lead/river split, JSON-LD, rail blocks. Phase 3 is markup re-skin + class renaming + blue-accent swap.

---

## 7. City hub pages (Phase 4)

**Current (`CityNewsPage.jsx`):** kicker + hero title + description + last-updated + city-row chip nav + `.scd-layout` grid (feed left, sidebar right) + three feed sections (Latest / Planning / Police) + official-sources sidebar + editorial-standards block.

**Target shape:** re-skin to Standard city-desk register — hero title in Playfair Display, blue kickers/labels, sidebar register, chip strip register, feed-label register. Structure unchanged. Last-updated line kept (editorial-standards feature).

**No structural change** — the current layout already maps cleanly onto the Standard's city-desk skeleton. Phase 4 is token + class renaming + blue-accent swap.

---

## 8. Notice card spec (Phase 5 — `NoticeCard.jsx`)

**Current:** kicker (municipality + type + date, mono, red), display-serif title with official-source link, summary dek, source link at bottom. Clean, no image.

**Standard-aligned card:**
- Kicker row: municipality chip (blue, Standard chip register) + type label + date — re-skin from red to blue.
- Title: Playfair Display, blue official-source link on hover.
- Summary dek: Source Serif 4, muted, 160-char truncation (unchanged).
- Source link: blue, mono, "Official source →" — stays prominent (core to editorial identity).
- Rule treatment: adopt Standard's light-rule card separation rather than current hairline + background treatment.

**No behavior change.** Phase 5 is token + class renaming + blue-accent swap + rule treatment.

---

## 9. Sidebar / rail spec (Phase 5)

**Current (Home):** official sources panel + "How we report" block + "Public safety" block.  
**Current (city):** official sources list + "How we report" block.

**Standard-aligned sidebar:**
- Same blocks and content (editorially correct, mission-specific).
- Re-skin: sidebar heading eyebrows (mono, uppercase, blue), rule separators, link color (blue), body serif at Standard sidebar size.
- Official-sources block is the sidebar's anchor — keep it prominent; don't bury it under editorial blurb blocks.
- Density: tighten padding, use Standard list-link register, read as a newspaper sidebar not a feature card.

---

## 10. Footer (Phase 5)

**Current (`.scd-f`):** four-column grid (brand + description / sections / city desks / official sources) + bottom bar (copyright + privacy/terms). Already close to a newspaper footer.

**Standard-aligned:** re-skin to Standard footer register — eyebrow labels, blue link register, tighter grid if denser. Content unchanged. No subscription/CTA language (free site).

---

## 11. Implementation phases

| Phase | Scope | Gate |
|---|---|---|
| **0 — Spec sign-off** | This document | @user + @architect agree scope, nav, tokens, fonts |
| **1 — Tokens** | `theme-civic.css` rewrite; drop dark surface; load fonts; grep gate | Build passes; grep clean for hardcoded hex |
| **2 — Header + nav** | `Layout.jsx` masthead restructure; blue nav bar; dropdown + drawer re-skin | Build passes; header renders desktop + mobile; all nav links resolve |
| **3 — Home page** | `HomePage.jsx` + `news.css`: lead row, river, rail, city strip re-skin | Build passes; lead/river/rail render; no breakpoint breakage |
| **4 — City pages** | `CityNewsPage.jsx` + shared classes: hero, kickers, sidebar, chips | Build passes; all three hubs render new register; last-updated intact |
| **5 — Card + sidebar + footer polish** | `NoticeCard.jsx` rules, rail/sidebar blocks, footer register | Build passes; cards/sidebars read as Standard register |
| **6 — CSS cleanup** | Remove unused old classes; resolve dark-theme question | Build passes; no dead classes; no broken token refs |
| **7 — Visual QA** | Live-site desktop + mobile breakpoint sweep across Home + 3 hubs | All pages render Standard register; nav hierarchy holds; no breakpoint breakage |

**Current state:** Phase 1 complete and committed.

---

## 12. Open decisions (resolved at sign-off)

1. **Accent blue:** `#0072bc` — confirmed.
2. **Display serif:** Playfair Display — confirmed.
3. **UI sans:** Inter — confirmed.
4. **Dark mode:** dropped for v1 — confirmed.
5. **Logo:** text logotype only, v1 — confirmed.
6. **Lead row:** 3-column featured row on Home only — confirmed.

---

## 13. What does NOT change (locked)

- Content model: official-source-only, no social-media lists for public safety.
- Three city hubs: `/news/st-catharines`, `/news/welland`, `/news/thorold`.
- All data files: `localNews.js`, `planningNotices.js`, `nrpsReleases.js`, `cities.js`, `siteConfig.js`, etc.
- All routes: no new routes, no route deletions. Nav restructure reorders/restyles existing routes.
- Editorial standards blurb + public-safety notice: stay, re-skinned.
- `NoticeCard` logic: date formatting, summary truncation, official-source linking.
- JSON-LD.
- Theme toggle behavior (subject to dark-mode decision above).
