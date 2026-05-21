import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const routes = [
  '/',
  '/services',
  '/services/website-design',
  '/services/technical-seo',
  '/services/gbp-optimization',
  '/services/web-design-for-plumbers',
  '/services/web-design-for-hvac',
  '/services/web-design-for-electricians',
  '/services/local-seo-for-service-businesses',
  '/about',
  '/contact',
  '/success',
  '/blog',
  '/blog/local-seo-checklist-2026',
  '/blog/how-to-get-more-leads-from-website',
  '/blog/technical-seo-explained',
  '/what-to-expect',
  '/404' // Render 404 page separately
]

async function run() {
  console.log('--- Starting Static Prerendering (SSG) ---')

  // 1. Build the server-side bundle
  console.log('Building SSR bundle...')
  execSync('npx vite build --ssr src/entry-server.jsx --outDir dist-ssr', {
    cwd: rootDir,
    stdio: 'inherit'
  })

  // 2. Load the render function and template
  const templatePath = path.resolve(rootDir, 'dist/index.html')
  if (!fs.existsSync(templatePath)) {
    throw new Error('Client-side build index.html not found! Run npm run build first.')
  }
  const template = fs.readFileSync(templatePath, 'utf8')

  const serverEntryPath = path.resolve(rootDir, 'dist-ssr/entry-server.js')
  const { render } = await import(`file://${serverEntryPath}`)

  // 3. Render each route
  for (const url of routes) {
    console.log(`Prerendering route: ${url}`)
    const helmetContext = {}
    const { html } = render(url === '/404' ? '/404-not-found-route-trigger' : url, helmetContext)
    const { helmet } = helmetContext

    // Collect head tags
    let headTags = ''
    if (helmet) {
      headTags = [
        helmet.title?.toString(),
        helmet.meta?.toString(),
        helmet.link?.toString(),
        helmet.script?.toString()
      ].filter(Boolean).join('\n')
    }

    // Inject content into template
    let pageHtml = template
      .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

    if (headTags) {
      // Inject tags right before </head>
      pageHtml = pageHtml.replace('</head>', `${headTags}\n</head>`)
    }

    // Determine output file path
    let outputDir = path.resolve(rootDir, 'dist')
    let outputFileName = 'index.html'

    if (url === '/404') {
      outputFileName = '404.html'
    } else if (url !== '/') {
      // Remove leading slash and split
      const relativePath = url.replace(/^\//, '')
      outputDir = path.resolve(outputDir, relativePath)
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
    }

    const outputPath = path.resolve(outputDir, outputFileName)
    fs.writeFileSync(outputPath, pageHtml, 'utf8')
    console.log(`Saved: ${outputPath}`)
  }

  // 4. Clean up SSR build folder
  console.log('Cleaning up temporary SSR build directory...')
  fs.rmSync(path.resolve(rootDir, 'dist-ssr'), { recursive: true, force: true })

  console.log('--- Prerendering Complete! ---')
}

run().catch((err) => {
  console.error('Prerendering failed:', err)
  process.exit(1)
})
