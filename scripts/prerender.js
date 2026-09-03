import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { createSitemapXml, prerenderRoutes } from '../src/data/routeManifest.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const allRoutes = prerenderRoutes

/**
 * Strip stale SEO tags that the client build baked into dist/index.html
 * before we inject the SSR-produced <title>/<meta>/<link>/<script> from
 * react-helmet-async. Otherwise crawlers see the first tag (client build)
 * and ignore the SSR-injected one, so the homepage meta shows old copy.
 */
function stripStaleHeadTags(html) {
  // Remove any existing <title>...</title>
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>\s*/gi, '')
  // Remove any existing <meta name="description" ...>
  html = html.replace(/<meta\s+[^>]*name=["']description["'][^>]*>\s*/gi, '')
  // Remove any existing <meta property="og:title" ...>
  html = html.replace(/<meta\s+[^>]*property=["']og:title["'][^>]*>\s*/gi, '')
  // Remove any existing <meta property="og:description" ...>
  html = html.replace(/<meta\s+[^>]*property=["']og:description["'][^>]*>\s*/gi, '')
  return html
}

async function run() {
  console.log('--- Starting Static Prerendering (SSG) ---')
  console.log(`Discovered ${allRoutes.length} total routes to render.`)

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
  let template = fs.readFileSync(templatePath, 'utf8')

  // Remove stale SEO tags baked into the client build so SSR tags win.
  template = stripStaleHeadTags(template)

  const serverEntryPath = path.resolve(rootDir, 'dist-ssr/entry-server.js')
  const { render } = await import(`file://${serverEntryPath}`)

  // 3. Render each route
  for (const url of allRoutes) {
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


    // DEBUG: dump helmet output for homepage
    if (url === '/' || url === '/') {
      const fs2 = await import('node:fs')
      const debugPath = path.resolve(rootDir, 'dist/_debug_homepage_helmet.txt')
      fs2.writeFileSync(debugPath, [
        'HELMET TITLE:', String(helmet.title),
        '\nHELMET META:', String(helmet.meta),
        '\nHELMET LINK:', String(helmet.link),
        '\nHELMET SCRIPT:', String(helmet.script),
        '\n--- raw meta toString ---',
        String(helmet.meta?.toString())
      ].join('\n'), 'utf8')
      console.log('DEBUG homepage helmet dumped to dist/_debug_homepage_helmet.txt')
    }

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
  }

  // 4. Generate dynamic sitemap
  console.log('Generating dynamic sitemap.xml...')
  const sitemapXml = createSitemapXml(allRoutes)
  fs.writeFileSync(path.resolve(rootDir, 'dist/sitemap.xml'), sitemapXml, 'utf8')

  // 5. Clean up SSR build folder
  console.log('Cleaning up temporary SSR build directory...')
  fs.rmSync(path.resolve(rootDir, 'dist-ssr'), { recursive: true, force: true })

  console.log('--- Prerendering Complete! ---')
}

run().catch((err) => {
  console.error('Prerendering failed:', err)
  process.exit(1)
})
