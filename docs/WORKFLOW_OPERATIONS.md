# Workflow operations

Every main push, including documentation changes, runs CI and release validation.
CI's aggregate check requires the quality matrix, the production build and
Chromium reader journeys. Browser verification downloads and validates the exact
build artifact from that run. The responsive/hydration suite also runs on main.

Production independently passes workflow validation, content and archive checks,
metrics, identity, lint, types, regression tests, required coverage, build/schema
checks, prerender checks and browser journeys before changing runtime secrets,
database schemas or publishing. It checks the current main revision before both
configuration and publication. A superseded release skips publication.

All dependency installs use the shared setup action and `scripts/ci-install.mjs`.
The download cache is optional. Up to three install attempts recover from
transport failures, rate limits or cache corruption; retries use temporary
isolated caches. Bad locks, engine incompatibilities, script failures and denied
credentials fail immediately. Tests and mail submissions are never blindly
retried.

Run these checks before pushing workflow or news-data changes:

```sh
node scripts/ci-install.mjs
npm run audit:workflows
npm run content:audit
npm run audit:archives
npm run audit:metrics
npm run audit:identity
node --test scripts/*.regression.mjs
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npm run audit:build
npm run audit:schema
npm run verify:prerender
npm run audit:visual
npm run test:browser
```

`audit:archives` compares police IDs with the previous Git revision, or the
explicit `ARCHIVE_BASE_SHA` set by CI for push/PR events. Daily additions must
retain historical records and module exports. Quarantine an invalid source with
`unverified: true` instead of deleting its record. Update tracked pitch-document
counts from the canonical metrics when adding verified data.

Operational jobs run only on main. Backup publication requires a nonempty export
with schema, a successful in-memory SQL restore with integrity/foreign-key checks,
an encrypted payload and a verified decryption round trip. Export uses explicit
`--skip-confirmation`, so a runner cannot silently decline an interactive prompt.
Only ciphertext, checksums and metadata are allowed in the backup artifact. Plaintext
exports are removed on success and failure and excluded from artifacts.
Deployment inspects the alerts table before applying entitlement columns, so
repeat deployments preserve existing grace deadlines and notification markers.
The weekly digest accepts delayed scheduled starts until Friday 6 AM Toronto.
It inspects successful submission steps from that weekly window, so an early
skipped DST slot cannot suppress delivery and a completed slot cannot send twice.
An API/status lookup failure blocks submission; mail POSTs are never blindly retried.
Malformed or incomplete receipt responses also block submission instead of being
treated as proof that no prior send occurred.

On a failed run, inspect its first failed step and retained source/browser/release
diagnostics. Retry read-only CI after a transient service outage. Fix deterministic
data, lock, policy or credential errors before rerunning. For a failed mail
submission, inspect delivery records before retrying; a lost response may follow
a successful send. A failed deployment can already have published: use the live
revision verification before deciding whether to redeploy.

`npm run audit:workflows` rejects moving action references, missing timeouts,
weakened required checks, unsafe operational branch guards and plaintext backup
uploads. Its failure-scenario regression suite runs in CI, collector checks and
workflow validation. Workflow validation also runs checksum-verified actionlint
and shellcheck.

The visual suite rejects focused `test.only`/`describe.only` tests and verifies the
expected test count before execution. Policy checks require every CI quality suite,
artifact validation and browser commands, and require production tests, build,
current-main guards and live verification in order.

These behaviors were cross-checked with Context7 against [GitHub's workflow
triggering documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow),
[deployment concurrency documentation](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments),
[Wrangler's D1 export implementation](https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/d1/export.ts)
and [Playwright's test configuration](https://github.com/microsoft/playwright/blob/main/docs/src/test-api/class-testconfig.md).
The export option was also checked against the installed Wrangler version.
