# Maintaining source data

These modules are persistent archives and application APIs, not disposable daily snapshots.

- Make targeted edits. Never replace an archive with a sample, `PLACEHOLDER`, ellipsis, or a comment promising omitted content.
- Preserve every existing record ID and exported helper. Keep invalid or unverified police records quarantined with `unverified: true`; do not delete historical records.
- Let the planning status helpers derive expired dates. Preserve their Toronto-time and render-clock behavior.
- After editing records, run `npm run metrics:sync` so marked count lines in `PITCH_DECK.md` and `INCOME_PRIORITY_PLAN.md` match `src/data/metrics.js`, then `npm run content:audit`, `npm run audit:archives`, `npm run audit:metrics`, and `npm test`.
- Do not weaken an audit or convert a failure into a successful skip to publish an update. Restore complete content and fix the cause.
