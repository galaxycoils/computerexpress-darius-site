# Remaining newsroom release checklist

Baseline: eb79acb84a3125b629558ee41e386bc61c3c7bc1.
This is an implementation status register, not a completion claim.

## This release
- [x] Reject cross-origin URLs, embedded credentials, and non-default ports.
- [x] Reject redirects during source collection.
- [x] Limit streaming responses before buffering oversized bodies.
- [x] Decode HTML entities in source URLs and handle invalid numeric entities.
- [x] Ignore anchors embedded in script/style blocks.
- [x] Preserve historical discovery records without a global truncation.
- [x] Add eight offline collector regression tests (passed locally).
- [x] Add pull-request and main-branch content integrity checks.
- [ ] Observe remote full test suite and production build.
- [ ] Verify deployment for this exact release.
- [ ] Verify collector on real approved sources and inspect generated candidates.

## Outstanding release blockers
- [ ] Replace unsigned alert credentials with scoped expiring credentials.
- [ ] Require authenticated unsubscribe; preserve working unsubscribe links.
- [ ] Persist newsletter consent/preferences and reconcile delivery contract.
- [ ] Test D1 migrations and backup/restore outside production.
- [ ] Validate email provider acceptance and authorized recipient delivery.
- [ ] Add delivery ledger and retry reconciliation.

## Remaining product work
- [ ] Consolidated design system and mobile/light/dark verification.
- [ ] Permanent article/project routes, broad search, and real RSS feeds.
- [ ] Verified seeded reporting, projects, meetings, and elections.
- [ ] Community and events records before section promotion.
- [ ] Authenticated editorial administration and moderated submissions.
- [ ] Correct sitemap modification dates and structured data.
- [ ] Accessibility, performance, route restoration and error-state audit.
- [ ] Sponsorship/membership promises matched to working services.

Guides remain removed. No fabricated reporting, inferred candidate positions,
invented dates, or unverified automated articles are approved by this release.
No test email was sent as part of this collector-only change.
