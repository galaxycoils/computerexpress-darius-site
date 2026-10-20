# Publishing changes

Read `src/data/AGENTS.md` before editing source archives. Daily desk updates must merge complete records by ID and retain every exported helper and existing record. Never commit abbreviated examples or placeholders.

Run `npm install` or `npm ci` to install the repository's pre-push checks. Before pushing, commit a complete candidate, run `npm run check:push < /dev/null`, and fix every reported failure. Keep these checks enabled. Do not change a required check into a skip or success to publish broken data.

A direct API write can bypass local hooks. For API-based source updates, use a pull request with passing CI and content-integrity checks. Repository administrators should require `CI matrix passed` and `Content integrity passed` on `main`; these settings require GitHub administration access.
