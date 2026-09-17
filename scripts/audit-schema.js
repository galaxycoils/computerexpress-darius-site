import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.isFile() && entry.name.endsWith('.html') ? [full] : []
  })
}

function routeFor(file) {
  const rel = path.relative(dist, file).replace(/^\.\//, '')
  if (rel === 'index.html') return '/'
  if (rel === '404.html') return '/404'
  if (!rel.endsWith('/index.html')) return `/${rel.replace(/\.html$/, '').replace(/\\/g, '/')}`
  const route = path.dirname(rel).replace(/\\/g, '/')
  return route === '.' ? '/' : `/${route}`
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  return scripts.map(match => match[1].trim())
}

if (!fs.existsSync(dist)) {
  console.error('dist/ missing. Run npm run build first.')
  process.exit(1)
}

const errors = []
// NewsMediaOrganization is a schema.org subtype of LocalBusiness; accept either.
const ORG_TYPES = ['LocalBusiness', 'NewsMediaOrganization']
const required = new Map([
  ['/', { org: true, web: 'WebSite' }],
  ['/contact', { org: true, web: 'ContactPage' }],
  ['/council', { web: 'WebPage' }],
])

function hasOrgType(types) {
  return ORG_TYPES.some(t => types.includes(t))
}

for (const file of walk(dist)) {
  const html = fs.readFileSync(file, 'utf8')
  const route = routeFor(file)
  const blocks = extractJsonLd(html)
  const types = []

  if (!html.includes('rel="canonical"')) errors.push(`${route}: missing canonical`)
  if (!html.includes('property="og:title"')) errors.push(`${route}: missing og:title`)

  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      for (const item of items) {
        // @graph arrays are a common way to combine multiple schema items.
        const graphItems = Array.isArray(item?.['@graph']) ? item['@graph'] : []
        const candidates = [...items, ...graphItems].flat()
        for (const candidate of candidates) {
          if (candidate?.['@type']) types.push(candidate['@type'])
        }
      }
    } catch (err) {
      errors.push(`${route}: invalid JSON-LD (${err.message})`)
    }
  }

  const spec = required.get(route)
  if (!spec) continue
  if (spec.org && !hasOrgType(types)) {
    errors.push(`${route}: missing organization JSON-LD (need one of ${ORG_TYPES.join('/')})`)
  }
  if (spec.web && !types.includes(spec.web)) {
    errors.push(`${route}: missing ${spec.web} JSON-LD`)
  }
}

if (errors.length) {
  console.error('Schema audit failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Schema audit passed.')
