# About page token mapping

Written against: bce09db5

## Evidence chain

- Surface: `/about` trust page, `src/pages/AboutPage.jsx` lines 42-148.
- Problem: the page styles everything inline with zero stylesheet, hardcodes a blue callout (`rgba(59,130,246,0.06)` wash, `rgba(59,130,246,0.2)` border) outside the paper/ink/teal palette, references `--text-muted` (6 sites) and `--surface` (2 sites) which are defined nowhere in `theme-civic.css`, so those declarations drop and inherit, and uses undefined shell class `section-first`.
- Design evidence: palette source of truth `src/styles/theme-civic.css` (`--signal: #17675f`, `--signal-soft`, `--bg-card`, `--muted`, `--line-strong`); no-hardcoded-colors rule; `badge-status` border pattern `color-mix(in srgb, var(--primary) 30%, transparent)` in `src/styles.css`; owned `section` shell in `src/styles.css`.
- Owner: `src/pages/AboutPage.jsx`.
- Scope and affected surfaces: `/about` only. Single consumer for all off-system values.
- Uncertainty: none on token mapping; rendered side-by-side confirmation was not performed (read-only audit, no visual inspection requested).

## Design decision

Re-express every off-system value with the existing token that already does its job, because the palette and surfaces are fully specified and the page is the only outlier. Copy and section order stay identical.

## Reuse

- Callout wash: `var(--signal-soft)` (light paper teal wash; dark navy gold-tint wash via vars, automatic)
- Callout border: `color-mix(in srgb, var(--signal) 30%, transparent)` (exact `badge-status` pattern, `src/styles.css`)
- Body text: `var(--muted)` for all 6 `--text-muted` sites
- Card surfaces: `var(--bg-card)` for both `--surface` sites; borders already use `var(--border)` (keep)
- Shell: owned `section` for the `section-first` site (keep its `container`)
- Exemplar: `src/pages/SponsorPage.jsx` firewall note (teal left-border callout on paper)

No new primitive: all five replacements already exist.

## Changes

1. `src/pages/AboutPage.jsx` callout article (lines 125-148)
   - Change: background to `var(--signal-soft)`; border to the `color-mix` signal pattern above; heading keeps `var(--primary)`.
   - Preserve: public-safety copy verbatim including the niagarapolice.ca link.
   - Verify: callout reads as teal-on-paper in light mode and legible in dark mode with no new value.
2. `src/pages/AboutPage.jsx` dead variable refs (lines 63-122)
   - Change: `--text-muted` becomes `--muted` (6 sites); `--surface` becomes `--bg-card` (2 sites); `section-first` becomes `section` (1 site).
   - Preserve: all inline font-size/line-height/max-width numbers (typography scale is out of scope).
   - Verify: computed color of body copy equals `--muted` instead of inherited text color.

## Scope

- Inherit: `/about` only.
- Verify: dark theme (signal-soft tint shift is by design); footer/nav untouched.
- Exclude: typography scale and spacing numbers (deliberately left inline to keep the change to one decision); page copy; Seo/JsonLd.

## Validation

- Product: open `/about`; three articles render as paper cards, callout teal-tinted, no unstyled fallback text.
- Interface: 390px and 1240px; dark-mode toggle keeps callout legible.
- System: no hex, rgba, or Oracle-new variable anywhere in the file.
- Repository: `grep -n "59,130,246\|text-muted\|--surface\|section-first" src/pages/AboutPage.jsx` → empty; `npm test` green; `npm run build` exit 0; `grep -o 'signal-soft' dist/assets/*.css` → still bundled (no-op sanity).

## Stop conditions

- Stop if the dark-mode signal-soft wash fails legibility against the callout copy (escalate with a screenshot; do not invent a dark-only override value).
- Stop if typography must change to make the page cohere (re-scope as a separate finding; do not expand this plan).

## Design documentation

- None. No doc update required.
