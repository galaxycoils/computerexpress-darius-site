# ComputerExpress — Component Architecture & Design System Audit

> Generated: UI Design System + Senior Frontend Audit
> Project: ComputerExpress (React + Vite)

---

## Table of Contents
1. [Component Inventory](#1-component-inventory)
2. [Props & State Reference](#2-props--state-reference)
3. [Architecture Map & Data Flow](#3-architecture-map--data-flow)
4. [Patterns & Conventions](#4-patterns--conventions)
5. [Architecture Issues & Recommendations](#5-architecture-issues--recommendations)
6. [Prioritized Action Plan](#6-prioritized-action-plan)

---

## 1. Component Inventory

### 1.1 `Layout.jsx` — Root Shell
| Aspect | Details |
|---|---|
| **Path** | `src/components/Layout.jsx` |
| **Type** | Layout (wraps page content via `<Outlet />`) |
| **Props** | None |
| **Dependencies** | `react-router-dom` (Link, NavLink, Outlet) |
| **Used by** | `App.jsx` (as root route element) |

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
- Enhanced footer with 4-column grid, newsletter form, social links

---

### 1.2 `Icons.jsx` — SVG Icon Library
| Aspect | Details |
|---|---|
| **Path** | `src/components/Icons.jsx` |
| **Type** | Pure presentational (no state, no effects) |
| **Pattern** | Named exports for each icon |

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
| `HeroIllustration` | — | Complex SVG hero graphic (no size prop, uses `className`) |

**Props Interface (consistent across all):**
```jsx
{ size = 22 }  // or 16 for small icons
```
Exception: `HeroIllustration` takes `{ className = '' }`

---

### 1.3 `ContactForm.jsx` — Audit Request Form
| Aspect | Details |
|---|---|
| **Path** | `src/components/ContactForm.jsx` |
| **Type** | Compound form with async submission |
| **Props** | None |
| **Dependencies** | Fetch API → Formspree (`https://formspree.io/f/xpwzgkby`) |

**Internal State:**
| State | Type | Default | Purpose |
|---|---|---|---|
| `submitted` | boolean | `false` | Toggles between form and success view |
| `loading` | boolean | `false` | Disables button during submission |
| `focused` | string \| null | `null` | Tracks focused field name for styling |

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
- **Loading**: Button shows "Sending..." with disabled state
- **Submitted**: Success message with checkmark icon (rendered inline)
- **Error**: Caught but only logged to console (no user-facing error state)

---

### 1.4 `AnimatedCounter.jsx` — Scroll-Triggered Number Animation
| Aspect | Details |
|---|---|
| **Path** | `src/components/AnimatedCounter.jsx` |
| **Type** | Presentation + animation |
| **Props** | `value`, `suffix`, `prefix`, `label` |

**Props Interface:**
```jsx
{ value, suffix = '', prefix = '', label }
```

**Internal Mechanism:**
- Custom hook `useCountUp(target, suffix, prefix, duration=2000)`
- Uses `IntersectionObserver` (threshold: 0.3) to trigger once
- Animation: `requestAnimationFrame` with `easeOutExpo` easing
- Duration defaults to 2000ms
- Returns `{ value, ref }` — ref attaches to the DOM element

**States:**
- **Pre-intersection**: Shows 0 (not yet visible)
- **Animating**: Counts up from 0 to target value
- **Complete**: Shows final target value

---

### 1.5 `Seo.jsx` — Meta Tags & Structured Data
| Aspect | Details |
|---|---|
| **Path** | `src/components/Seo.jsx` |
| **Type** | Pure — no state, renders `<Helmet>` |
| **Props** | `title`, `description`, `path`, `image`, `type`, `jsonLd` |
| **Dependencies** | `react-helmet-async` |

**Props Interface:**
```jsx
{
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  path = '/',
  image = '/og-card.svg',
  type = 'website',
  jsonLd,
}
```

**Rendered Tags:**
- `<title>`, `<meta name="description">`
- Open Graph: `og:site_name`, `og:title`, `og:description`, `og:type`, `og:image`, `og:url`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Canonical `<link>` (conditional on `base` being set)
- JSON-LD `<script>` (conditional on `jsonLd` prop)

---

## 2. Shared Patterns (Duplicated Across Pages)

### 2.1 `useInView` Hook (duplicated 4×)
Defined identically in:
- `HomePage.jsx`
- `ServicesPage.jsx`
- `AboutPage.jsx`
- `ContactPage.jsx`

```jsx
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}
```

### 2.2 `AnimatedSection` Component (duplicated 4×)
```jsx
function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useInView()
  return (
    <div ref={ref} className={`animate-on-scroll ${className}`}
         style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
```

### 2.3 Shared Data (duplicated)

| Data Set | Defined In | Also Duplicated In |
|---|---|---|
| `services` array | `HomePage.jsx` | `ServicesPage.jsx` |
| `ServiceIcon` function | `HomePage.jsx` | `ServicesPage.jsx` |
| `packages` array | `HomePage.jsx` | `ServicesPage.jsx` |
| `steps` array | `HomePage.jsx` | `AboutPage.jsx` |

---

## 3. Architecture Map

```
main.jsx
 └─ HelmetProvider
     └─ App.jsx
         └─ RouterProvider
             └─ Layout.jsx          ← Header, Footer, scroll progress
                 ├─ Outlet → HomePage.jsx     ← Services, pricing, FAQ, portfolio, testimonials
                 │              ├─ Seo.jsx
                 │              ├─ AnimatedCounter.jsx
                 │              └─ Icons.jsx
                 │
                 ├─ Outlet → ServicesPage.jsx  ← Services detail + pricing
                 │              └─ Seo.jsx
                 │
                 ├─ Outlet → AboutPage.jsx     ← Values, process
                 │              └─ Seo.jsx
                 │
                 ├─ Outlet → ContactPage.jsx   ← Contact info + form
                 │              ├─ Seo.jsx
                 │              └─ ContactForm.jsx
                 │
                 └─ Outlet → SuccessPage.jsx   ← (Unused — no route triggers it)
                                └─ Seo.jsx
```

---

## 4. Architectural Issues

### 🔴 Critical

#### A1. Duplicated `useInView` / `AnimatedSection` (4 files)
The exact same hook and component are copy-pasted in every page file. This is the most impactful refactoring target — extract to a shared module.

#### A2. Duplicated Data Arrays (Webpack/import cost + maintenance burden)
- `services` + `ServiceIcon`: 2 copies
- `packages`: 2 copies
- `steps`: 2 copies
All should be extracted to a shared data file.

#### A3. AnimatedCounter Easing Bug
```jsx
// Current (buggy):
const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
setValue(Math.round(from + (to - eased * to)))

// Expected (correct):
// setValue(Math.round(from + (to - from) * eased))
// Or simply since from=0: setValue(Math.round(to * eased))
```
This causes the counter to overshoot and show incorrect intermediate values during animation.

### 🟡 Medium

#### B1. Dead Code in Seo.jsx
```jsx
const base = ''  // Always empty
const url = base ? `${base}${path}` : undefined  // url is always undefined
const img = base ? `${base}${image}` : image  // img === image
```
The `url`-based conditionals (`{url && ...}`) never render. Either remove or configure `base`.

#### B2. No User-Facing Error State in ContactForm
Catch block only logs to console. If Formspree fails, the user sees a permanently loading button with no feedback. Should show an error message and re-enable the form.

#### B3. Inline Styles > CSS Classes
Multiple components use inline styles where CSS classes would be more maintainable:
- `ContactForm.jsx` success state (extensive inline styles)
- `AboutPage.jsx` value cards
- `SuccessPage.jsx` success icon
- Various pages use `style={{ marginBottom: '...' }}` for spacing

#### B4. Duplicate Scroll Listeners in Layout.jsx
Two separate `useEffect` hooks each add a scroll listener:
- Lines 25-32: Tracks `scrollProgress` AND `scrolled`
- Lines 42-44: Tracks `scrolled` only
The second effect (lines 42-44) is redundant.

### 🟢 Low

#### C1. Unused SuccessPage.jsx
SuccessPage exists as a route but is never navigated to — `ContactForm` handles success inline. Either wire the form to redirect, or remove the page.

#### C2. No TypeScript / PropTypes
No type validation on any component props. As the project grows, adding PropTypes (quick win) or TypeScript (bigger lift) would prevent bugs.

#### C3. Inconsistent Imports in Layout.jsx
```jsx
import { useState, useEffect, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Link, NavLink } from 'react-router-dom'
```
`Outlet` is imported separately from `Link`/`NavLink` — could be a single import line.

---

## 5. Recommendations

### Phase 1 — Quick Wins (Low Risk, High Impact)
| # | Action | Files Affected | Est. Effort |
|---|---|---|---|
| 1 | Extract `useInView` + `AnimatedSection` to `src/hooks/useInView.js` + `src/components/AnimatedSection.jsx` | 4 page files, 2 new files | 15 min |
| 2 | Extract shared data (`services`, `packages`, `steps`) to `src/data/` | 2–3 page files, 2–3 new data files | 15 min |
| 3 | Fix AnimatedCounter easing bug | 1 file (1 line change) | 2 min |
| 4 | Remove redundant scroll listener in Layout.jsx | 1 file | 2 min |
| 5 | Consolidate `react-router-dom` imports in Layout.jsx | 1 file | 1 min |

### Phase 2 — Polish
| # | Action | Est. Effort |
|---|---|---|
| 6 | Add error state UI to ContactForm (show error message, re-enable button) | 30 min |
| 7 | Move inline styles to CSS classes (contact form success, about value cards, success page) | 45 min |
| 8 | Wire ContactForm to redirect to `/success` page (or remove SuccessPage) | 15 min |

### Phase 3 — Structural
| # | Action | Est. Effort |
|---|---|---|
| 9 | Add PropTypes to all components | 30 min |
| 10 | Enable `base` URL via environment variable for canonical/og:url | 15 min |
| 11 | Consider TypeScript migration for type safety | 2–4 hrs |

---

## 6. Design Tokens Reference

The current `styles.css` defines the following design tokens in `:root`:

### Color Palette
| Token | Value (Dark) | Light Override |
|---|---|---|
| `--bg` | `#060d1b` | `#f0f4f8` |
| `--bg-soft` | `#0a1628` | `#e2e8f0` |
| `--bg-card` | `#0d1b30` | `#ffffff` |
| `--primary` | `#12d6ff` | (same) |
| `--highlight` | `#7df9ff` | (same) |
| `--accent` | `#a78bfa` | (same) |
| `--success` | `#34d399` | (same) |

### Typography
- Font: Inter (300–900 weights)
- Scale: CSS clamp() for responsive sizing (no formal type scale)
- Line heights: 1.05–1.7

### Spacing
- Grid: 8pt system (values: 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- Container max: 1200px

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
| `--transition-fast` | 150ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-base` | 300ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-slow` | 500ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-bounce` | 500ms cubic-bezier(0.34, 1.56, 0.64, 1) |

---

*End of Component Architecture Document*
