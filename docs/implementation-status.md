# Remaining newsroom release checklist

Baseline: c685fc8558cd079eef371cd4ff84886e71c146d2.
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
- [x] Observe remote full test suite and production build.
- [x] Verify deployment through commit eff40ccecd6eb47e65e124519ec7ce1490b0ebc3.
- [x] Run the collector against all five approved sources and inspect 78 candidates.
- [x] Filter obvious navigation, contact and archive pages from future discovery snapshots.

## Outstanding release blockers
- [x] Replace unsigned alert credentials with scoped expiring credentials.
- [x] Require authenticated unsubscribe and provide private preference links.
- [x] Persist newsletter consent, topics and provider-delivery state in D1.
- [x] Add encrypted production backup workflow and a non-production restore rehearsal procedure.
- [x] Validate provider acceptance using the authorized newsletter recipient.
- [ ] Confirm receipt in the authorized recipient's inbox.
- [x] Add delivery ledger and consent-preserving reconciliation reporting.

## Remaining product work
- [ ] Consolidated design system and mobile/light/dark verification.
- [ ] Permanent article/project routes, broad search, and real RSS feeds.
- [ ] Verified seeded reporting, projects, meetings, and elections.
- [ ] Community and events records before section promotion.
- [x] Secret-protected editorial desk and D1-backed moderated submissions.
- [x] Stop publishing invented build-time sitemap modification dates.
- [ ] Add verified per-record sitemap dates and complete structured-data review.
- [ ] Accessibility, performance, route restoration and error-state audit.
- [ ] Sponsorship/membership promises matched to working services.

Guides remain removed. No fabricated reporting, inferred candidate positions,
invented dates, or unverified automated articles are approved by this release.
A production newsletter subscription request was accepted by D1 and the email provider.
Inbox receipt has not been independently confirmed. Planning alerts remain unavailable
until `ALERT_TOKEN_SECRET` is configured in the deployment environment.
