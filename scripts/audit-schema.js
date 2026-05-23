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
const required = new Map([
  ['/', ['LocalBusiness', 'WebSite']],
  ['/services', ['LocalBusiness', 'Service']],
  ['/contact', ['LocalBusiness', 'ContactPage']],
  ['/free-audit', ['WebPage', 'VideoObject']],
  ['/services/gbp-optimization', ['LocalBusiness', 'Service', 'VideoObject']],
])

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
        if (item?.['@type']) types.push(item['@type'])
      }
    } catch (err) {
      errors.push(`${route}: invalid JSON-LD (${err.message})`)
    }
  }

  for (const [targetRoute, neededTypes] of required) {
    if (route !== targetRoute) continue
    for (const needed of neededTypes) {
      if (!types.includes(needed)) errors.push(`${route}: missing ${needed} JSON-LD`)
    }
  }
}

if (errors.length) {
  console.error('Schema audit failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Schema audit passed.')
