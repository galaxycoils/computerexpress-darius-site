# St. Catharines Digital

A React and Vite newsroom for Niagara. The site connects readers to official news sources, development records, civic meetings and local guides. Cloudflare Pages serves the prerendered site and Pages Functions provide the service endpoints.

## Development

Use Node 22 and the committed npm lockfile:

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 3000 --strictPort
```

In the prepared Codex cloud environment, activate the installed runtime first:

```bash
export PATH="/workspace/.toolchain/node_modules/.bin:$PATH"
cd /workspace/computerexpress-darius-site
```

Use the existing checkout; cloud tasks already run in isolation. npm's cloud cache is `/workspace/.npm-cache` when reinstalling dependencies.

## Validation

```bash
npm test
npm run test:coverage
node --test scripts/*.regression.mjs
npm run content:audit
npm run build
npm run budget:bundle
npm run audit:build
npm run audit:schema
```

`npm run build` compiles the client, prerenders routes from `src/data/routeManifest.js`, and writes release metadata to `dist/`. Generated output is ignored by Git.

For browser checks, install Playwright Chromium once, then run:

```bash
npx playwright install chromium
npm run test:browser
```

If a system Chromium is available, use `CHROME_PATH=/usr/bin/chromium npm run test:browser`. The browser runner starts a local production preview when needed, checks four viewport sizes and reader journeys, and saves screenshots and its report in `artifacts/browser/`. `QA_BASE_URL` can point it at an existing preview. The form journeys intercept API requests and do not send email.

## Content and assets

- `src/data/publication.js` builds the source-linked news feed and excludes future news publication dates.
- `src/data/searchIndex.js` adds development files, scheduled civic meetings and local guides to site search. Meeting dates are scheduled dates, not evidence that a meeting occurred.
- `src/data/routeManifest.js` defines public, private and prerendered routes.
- `src/data/localPhotos.js` retains file-photo dates, credits and licenses. Run `npm run assets:local` to recreate the 480px and 800px WebP variants from the original local assets.
- `src/styles/journal.css` provides the shared newsroom design; `src/styles/contact.css` loads with contact and reader-support pages.

Do not invent reporting, source dates, event outcomes or membership benefits. Check original documents before updating content.

## Service configuration

The local chat assistant uses Wllama and WebGPU in the reader's browser. See [local-chat.md](docs/local-chat.md) for model selection, privacy, browser requirements and the remaining real-model checks. Its messages are not sent to the legacy `/api/chat` endpoint or Vite's legacy endpoint mock. Contact, sponsorship, newsletters and planning alerts use Cloudflare Pages Functions; Vite does not emulate those services. Their browser error states and mocked success journeys can be tested locally without sending real submissions.

Live operation requires the appropriate deployed bindings, including `STC_D1`, `AI` and service-specific secrets. Keep local secrets in the ignored `.dev.vars` file or secure environment settings. Never put values in source code. The outreach script requires `AGENTMAIL_API_KEY` from its environment and sends real messages when explicitly run.

Security headers in `public/_headers` apply to static Cloudflare Pages responses. Vite preview does not apply them, and Pages Functions supply their own response headers. Verify deployment headers and configured services when releasing.

## GitHub Actions

See [workflow-reliability.md](docs/workflow-reliability.md) for the failure fixes, runtime/tool versions and retry behavior. Workflow validation runs actionlint and shell checks on every push and pull request. Required credentials and genuine test failures remain visible.
