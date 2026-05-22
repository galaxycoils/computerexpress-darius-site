import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const BASE_URL = 'https://stcatharinesdigital.pages.dev'

const baseRoutes = [
  '/',
  '/services',
  '/services/website-design',
  '/services/technical-seo',
  '/services/gbp-optimization',
  '/services/web-design-for-plumbers',
  '/services/web-design-for-hvac',
  '/services/web-design-for-electricians',
  '/services/web-design-for-landlords',
  '/services/local-seo-for-service-businesses',
  '/about',
  '/contact',
  '/success',
  '/blog',
  '/blog/local-seo-checklist-2026',
  '/blog/how-to-get-more-leads-from-website',
  '/blog/technical-seo-explained',
  '/blog/google-business-profile-tips-local-seo',
  '/blog/how-to-rank-1-on-google-maps',
  '/blog/website-speed-optimization-tips',
  '/blog/how-much-does-local-seo-cost',
  '/blog/service-business-website-examples',
  '/case-studies/plumber-case-study',
  '/case-studies/hvac-case-study',
  '/case-studies/legal-case-study',
  '/what-to-expect',
  '/free-audit',
  '/404' // Render 404 page separately
]

// Programmatic SEO Generation
const CITIES = ['st-catharines', 'niagara-falls', 'welland', 'grimsby', 'thorold', 'fort-erie']
const SERVICES = ['web-design', 'local-seo']

const programmaticRoutes = []
for (const service of SERVICES) {
  for (const city of CITIES) {
    programmaticRoutes.push(`/service-areas/${service}/${city}`)
  }
}

const allRoutes = [...baseRoutes, ...programmaticRoutes]

function generateSitemap(routes) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  const today = new Date().toISOString().split('T')[0]

  for (const route of routes) {
    if (route === '/404') continue

    // Determine priority and changefreq based on route type
    let priority = '0.7'
    let changefreq = 'monthly'

    if (route === '/') {
      priority = '1.0'
      changefreq = 'weekly'
    } else if (route === '/services' || route === '/contact' || route === '/free-audit') {
      priority = '0.9'
      changefreq = 'monthly'
    } else if (route.startsWith('/services/')) {
      priority = '0.8'
    } else if (route.startsWith('/service-areas/')) {
      priority = '0.8'
      changefreq = 'monthly'
    }

    const loc = `${BASE_URL}${route === '/' ? '' : route}`
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`
  }

  xml += `</urlset>`
  return xml
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
  const template = fs.readFileSync(templatePath, 'utf8')

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
  const sitemapXml = generateSitemap(allRoutes)
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
