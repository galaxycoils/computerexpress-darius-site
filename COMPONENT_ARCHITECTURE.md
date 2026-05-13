# ComputerExpress — Component Architecture & Design System Audit

> Last updated: May 13, 2026
> Project: ComputerExpress v0.4.0 (React + Vite + React Router 7)
> Live: computerexpress.pages.dev

---

## Table of Contents
1. [Component Inventory](#1-component-inventory)
2. [Shared Modules](#2-shared-modules)
3. [Architecture Map](#3-architecture-map)
4. [Design Tokens](#4-design-tokens)
5. [Known Issues & TODOs](#5-known-issues--todos)

---

## 1. Component Inventory

### 1.1 `Layout.jsx` — Root Shell
| Aspect | Details |
|---|---|
| **Path** | `src/components/Layout.jsx` |
| **Type** | Layout (wraps page content via `<Outlet />`) |
| **Props** | None |

**Internal State:**
| State | Type | Default | Purpose |
|---|---|---|---|
| `menuOpen` | boolean | `false` | Mobile nav toggle |
| `scrolled` | boolean | `false` | Sticky header style trigger (>20px scroll) |
| `theme` | `'dark' \| 'light'` | from `getInitialTheme()` | Dark/light mode |
| `scrollProgress` | number | `0` | Reading progress bar (0–100) |

**Sub-structure:**
- Scroll progress bar (`div.scroll-progress`)
- Sticky header with brand logo, nav-toggle hamburger, theme toggle, nav links
- `<main>` with `<Outlet />` for routed pages
- Enhanced footer: 4-col grid, newsletter form, social links (X, LinkedIn, GitHub)

---

### 1.2 `Icons.jsx` — SVG Icon Library
| Aspect | Details |
|---|---|
| **Path** | `src/components/Icons.jsx` |
| **Type** | Pure presentational (no state, no effects) |

**Exported Components:**

| Component | Default `size` | Description |
|---|---|---|
| `IconWeb` | 22 | Globe icon |
| `IconSearch` | 22 | Magnifying glass |
| `IconMap` | 22 | Map pin |
| `IconRocket` | 22 | Rocket |
| `IconShield` | 22 | Shield with check |
| `IconChart` | 22 | Trending up chart |
| `IconCode` | 22 | Code brackets |
| `IconZap` | 22 | Lightning bolt |
| `IconArrowRight` | 16 | Arrow right |
| `IconCheck` | 16 | Checkmark |
| `IconStar` | 16 | Star (filled) |
| `HeroIllustration` | — | Complex SVG hero graphic (browser window + floating elements) |

All icons accept `{ size }` prop. `HeroIllustration` accepts `{ className }`.

---

### 1.3 `ContactForm.jsx` — Audit Request Form
| Aspect | Details |
|---|---|
| **Path** | `src/components/ContactForm.jsx` |
| **Type** | Compound form with async submission |
| **Props** | `onSuccess` (callback) |
| **Endpoint** | Formspree (`https://formspree.io/f/xpwzgkby`) |

**Internal State:**
| State | Type | Default | Purpose |
|---|---|---|---|
| `submitted` | boolean | `false` | Toggles between form and success view |
| `loading` | boolean | `false` | Disables button during submission |
| `error` | string \| null | `null` | Error message from API or network |
| `focused` | string \| null | `null` | Tracks focused field name |

**Form Fields:**
| Name | Type | Required | Placeholder |
|---|---|---|---|
| `businessName` | text | ✓ | "Your Company" |
| `email` | email | ✓ | "you@example.com" |
| `website` | url | — | "https://your-site.com" |
| `serviceInterest` | select | — | Options: website, seo, local, full, other |
| `goals` | textarea | ✓ | "More leads, better rankings..." |

**States:**
- **Default**: Form with all fields + submit button
- **Loading**: Button shows "Sending..." with `is-loading` class
- **Error**: Red error banner with icon, form re-enabled
- **Submitted**: Success message with checkmark icon → auto-redirects to `/success` after 1.5s

---

### 1.4 `AnimatedCounter.jsx` — Scroll-Triggered Number Animation
| Aspect | Details |
|---|---|
| **Path** | `src/components/AnimatedCounter.jsx` |
| **Props** | `value` (e.g. "100+", "98", "4x", "24h"), `label` |

**Mechanism:**
- Custom hook `useCountUp(target, duration=2000)`
- `IntersectionObserver` (threshold: 0.3) triggers once
- `requestAnimationFrame` with `easeOutExpo` easing
- Auto-extracts numeric prefix from compound values ("50+" → 50, "+")

---

### 1.5 `Seo.jsx` — Meta Tags & Structured Data
| Aspect | Details |
|---|---|
| **Path** | `src/components/Seo.jsx` |
| **Props** | `title`, `description`, `path`, `image`, `type`, `jsonLd` |
| **Dependencies** | `react-helmet-async` |

---

## 2. Shared Modules

### 2.1 `src/hooks/useInView.jsx`
Exports:
- `useInView(threshold)` — hook returning a ref that adds 'visible' class on intersection
- `AnimatedSection` — wrapper component with `children`, `className`, `delay` props

Used by: HomePage, ServicesPage, AboutPage, ContactPage

### 2.2 `src/data/siteData.js`
Exports: `services`, `packages`, `steps`, `testimonials`, `faqItems`, `portfolioItems`, `stats`, `trustItems`

---

## 3. Architecture Map

```
main.jsx
 └─ HelmetProvider
     └─ App.jsx
         └─ RouterProvider
             └─ Layout.jsx              ← Header, scroll progress, theme toggle, footer
                 ├─ Outlet → HomePage.jsx       ← Stats, services, portfolio, process, testimonials, pricing, FAQ, CTA
                 │              ├─ AnimatedCounter.jsx
                 │              ├─ Icons.jsx (HeroIllustration)
                 │              └─ useInView.jsx (AnimatedSection)
                 │
                 ├─ Outlet → ServicesPage.jsx    ← Services detail + pricing
                 ├─ Outlet → AboutPage.jsx       ← Values, process
                 ├─ Outlet → ContactPage.jsx     ← Contact info + ContactForm
                 └─ Outlet → SuccessPage.jsx     ← Success confirmation (navigated to after form submit)
```

---

## 4. Design Tokens

### Color Palette
| Token | Dark Value | Light Override |
|---|---|---|
| `--bg` | `#060d1b` | `#f0f4f8` |
| `--bg-soft` | `#0a1628` | `#e2e8f0` |
| `--bg-card` | `#0d1b30` | `#ffffff` |
| `--primary` | `#12d6ff` | (same) |
| `--highlight` | `#7df9ff` | (same) |
| `--accent` | `#a78bfa` | (same) |
| `--success` | `#34d399` | (same) |

### Typography
- Font: Inter (300–900 weights) via Google Fonts
- Scale: CSS `clamp()` for responsive sizing
- Line heights: 1.05–1.7

### Spacing
- Container max: 1200px
- Section padding: 6rem (standard), 7rem (with CTA)

### Radii
| Token | Value |
|---|---|
| `--radius-sm` | 8px |
| `--radius-md` | 12px |
| `--radius-lg` | 20px |
| `--radius-xl` | 28px |

### Transitions
| Token | Timing |
|---|---|
| `--transition-fast` | 150ms ease |
| `--transition-base` | 300ms ease |
| `--transition-slow` | 500ms ease |
| `--transition-bounce` | 500ms cubic-bezier(0.34, 1.56, 0.64, 1) |

---

## 5. Known Issues & TODOs

### Resolved ✅
- ~~Duplicated `useInView`/`AnimatedSection` across 4 pages~~ → Extracted to `src/hooks/useInView.jsx`
- ~~Duplicated data arrays~~ → Extracted to `src/data/siteData.js`
- ~~AnimatedCounter easing bug~~ → Fixed to proper easeOutExpo
- ~~Duplicate scroll listener in Layout~~ → Merged into single listener
- ~~No error state in ContactForm~~ → Added error banner + network error handling
- ~~Inline styles~~ → Replaced with CSS classes
- ~~SuccessPage not wired~~ → Form now redirects to `/success` after 1.5s
- ~~FAQ answers always visible~~ → Conditional rendering
- ~~Stats showing "0"~~ → Fixed counter suffix extraction, updated to 100+/4x

### Remaining
- **Seo.jsx `base` URL**: `base = ''` means canonical/og:url tags never render. Needs env variable.
- **No PropTypes**: No runtime prop validation on any component.
- **Placeholder content**: Testimonials and portfolio items are fictional. Need real client work.
- **No TypeScript**: Could migrate for type safety.
- **Visual verification**: Vision tool unavailable; can't verify pixel-perfect rendering.
- **Performance**: No Lighthouse audit done. CSS is ~30KB (6KB gzipped) -- acceptable.
- **No page transitions**: Route changes are instant cuts. Framer Motion would add polish.
- **No blog/content section**: Agency site without content marketing.
