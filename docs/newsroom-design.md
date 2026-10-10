# Newsroom design

The shared direction is a modern newspaper: warm paper, serif headlines, readable sans-serif body text and restrained blue actions. Public routes use the same masthead, section navigation, page rhythm, controls and light/dark themes.

## Palette and type

| Role | Light | Dark |
| --- | --- | --- |
| Paper | `#f7f4ed` | `#172128` |
| Secondary paper | `#eeebe3` | `#202f38` |
| Raised surface | `#fffdf8` | `#233640` |
| Ink | `#172128` | `#f7f4ed` |
| Supporting text | `#57626a` | `#b9c6cb` |
| Action blue | `#234bb5` | `#a9c1ff` |
| Rule | `#d8d6cd` | `#40505a` |

Headlines use locally served Fraunces Variable. Body text, navigation and form labels use locally served Source Sans 3 Variable. Section titles share a responsive 36–56px scale; article text is 20px with generous line spacing and a maximum reading measure of 65 characters.

## Layout and components

- Keep content within 1280px, with 40px desktop, 24px tablet and 18px phone gutters. Use an 8px spacing rhythm.
- Use `PageHeading` for an eyebrow, one main heading, descriptive copy and optional contextual links. Separate the heading from content with an ink rule.
- Use paper and thin rules for structure. Reserve blue for actions, links, selected controls and short section labels. Reader-service cards share one surface; newsletter panels use secondary paper.
- Keep section navigation visible during reading. Phones show three primary sections and an accessible menu containing the complete navigation, saved stories and city editions.
- Give form controls visible labels, at least 46px height and 16px text. Keep search fields wide enough to read entered addresses. Put statistics above filters with separate numbers and captions.
- Offer both table and card views for public records. Preserve source links, publication dates, applied filters and clear empty states.

## Reader behaviour

Keyboard focus is visible. Escape closes the mobile menu and returns focus to its button. Long menus scroll within the viewport. Anchor targets allow space for the sticky section bar. Light/dark preferences and saved stories retain their existing persistence. Printing uses black ink on white paper even when the reader selected dark mode.

Before publishing design changes, run lint, type checking, application tests, the production artifact/prerender checks and browser journeys. Check phone, tablet and desktop layouts in both themes, including keyboard navigation, form labels, contrast, overflow and hydration.
