# Workflow reliability

The October 8 failures in [CI](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/37774745436), [deployment](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/37774745408) and [collection](https://github.com/galaxycoils/computerexpress-darius-site/actions/runs/37764540635) all reached the same three failing application tests. Those tests assumed no future meetings existed and that a particular bridge notice remained scheduled. Subsequent desk updates legitimately changed those records.

Algorithm tests now use controlled notices, explicit clocks and Toronto-time boundaries. The homepage test proves that a meeting visible at prerender time disappears when the visitor's clock passes it. Actual newsroom content remains covered by the content-integrity audit.

## Workflow changes

- Use Ubuntu 24.04 and the supported Node 22 runtime. The unsupported Node 20 build is removed; the unit, collector, content, coverage and production-build gates remain.
- Lock Wrangler to 4.148.0 in the npm lockfile and deployment action. Local CLI calls require the installed version instead of fetching a moving release. npm installation has bounded registry retries.
- Validate all workflows with checksum-verified actionlint, including expressions, reusable workflows and shell scripts. The check runs on pushes and pull requests.
- Update artifact upload to its Node 24-compatible v6 action. Keep encrypted-backup plaintext cleanup active even when encryption fails, and report missing backup configuration by name.
- Bound production deployment and manual setup/purge jobs with timeouts. Serialize backups and project setup. Browser checks cancel superseded runs.
- Do not submit an empty editorial admin token when only individual editorial accounts are configured.
- Check the current main revision through Git before deploying. Project setup checks for the existing Pages project and reuses the normal production workflow for tests, migrations, configuration and live-release verification.
- Honor either Cloudflare API-token secret name in manual project and cache workflows. Retry safe project lookups and cache purges within bounded limits.
- Retry read-only live-page/RSS verification on transient failures and stale content, with fresh request timeouts. Permanent authorization errors fail immediately; exhausted retries remain failures.
- Require the digest response to report zero failed deliveries. Automatic retries of the email POST are removed because a lost response may follow an accepted send. Review delivery records before manually retrying a partial delivery.

## Additional release safeguards

- Pin all external Actions to reviewed commit SHAs. Run shell steps with Bash error and pipeline handling, and lint the shared release guard.
- Reject stale releases before installation, before configuration or migrations, and immediately before deployment. Required Cloudflare account/project access is checked before the build.
- Audit release revision, frozen render time, publication hash, every manifest chunk and asset, responsive photos, and every prerender route. CI artifacts include the hidden Vite manifest. RSS is a Pages Function and remains covered by the live RSS verification.
- Observe dispatched runs by their exact candidate revision or unique deployment title and dispatch time. Once discovered, follow only that run ID. Recover from transient read failures with bounded backoff; failed, cancelled, skipped or timed-out runs remain failures.
- Publish candidates with ordinary fast-forward pushes. Reconcile a lost acknowledgement against remote Git history; concurrent main updates require revalidation. Recollect conflicted generated content on the new main and remove owned temporary branches on success or failure.
- Rebuild release metadata after committing a candidate, and rebuild when the local artifact revision differs from main. Deploy requests include the collector attempt so reruns cannot observe an older release request.
- Decrypt and compare each new encrypted backup before upload. Include ciphertext checksums and timestamp/revision metadata while keeping plaintext out of artifacts. Existing decryption parameters remain compatible.

## Validation

- 123 application tests pass, including elapsed-meeting, future-meeting and closure-status cases.
- 57 offline regression checks pass, including simulated connection reset, HTTP 503, stale content, permanent authorization failure and retry exhaustion.
- The existing three-file critical-logic coverage gate remains at 100%.
- Workflow syntax and shell checks, clean lockfile installation, production build, structured-data audit and content-integrity audit pass. The content audit still reports the three existing source-adapter review warnings.

External outages, expired credentials and actual regressions must still fail visibly. Required secrets are not generated, replaced or silently ignored by these fixes. Scheduled email delivery and backup export were not manually dispatched as part of validation.
