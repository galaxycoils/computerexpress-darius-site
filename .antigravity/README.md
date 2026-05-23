# Antigravity Subagents

This workspace defines the St. Catharines Digital specialist subagent team in `.antigravity/subagents/`.

## New Agents

- `Vitruvius` (`ui-ux-pro`): UI/UX, mobile polish, accessibility, conversion flow, and interaction quality.
- `Seshat` (`seo-expert`): technical SEO, local SEO, GBP/Maps alignment, schema, canonical metadata, and proof-safe copy.
- `Ariadne` (`site-growth-orchestrator`): coordinates `Helmholtz`, `Cicero`, `Mendel`, `Vitruvius`, and `Seshat`.

## Existing Antigravity Agents

- `Helmholtz` (`test-engineer`)
- `Cicero` (`search-specialist`)
- `Mendel` (`explorer`)

## Dry Run Prompt

```text
Ariadne, review the live St. Catharines Digital site using Mendel, Cicero, Vitruvius, Seshat, and Helmholtz, then return a ranked action plan only.
```

## Registration Note

The Antigravity UI showed the existing agents as runtime-managed entries rather than repo-backed config files. These workspace specs provide a durable import/registration source without modifying site source files or generated `dist/` output.
