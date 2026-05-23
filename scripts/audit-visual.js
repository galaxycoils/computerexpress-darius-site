import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const artifacts = path.join(root, 'artifacts/visual')
const baseUrl = 'http://127.0.0.1:4173'
const routes = ['/', '/free-audit', '/contact', '/services/gbp-optimization', '/service-areas/web-design/grimsby']
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 },
]

fs.mkdirSync(artifacts, { recursive: true })

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: false,
      stdio: options.silent ? 'pipe' : 'inherit',
      env: { ...process.env, ...options.env },
    })
    let output = ''
    if (options.silent) {
      child.stdout.on('data', chunk => { output += chunk.toString() })
      child.stderr.on('data', chunk => { output += chunk.toString() })
    }
    child.on('close', code => {
      if (code === 0) resolve(output)
      else reject(new Error(`${command} ${args.join(' ')} exited ${code}\n${output}`))
    })
  })
}

async function waitForPreview() {
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    try {
      const res = await fetch(baseUrl)
      if (res.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error('Preview server did not start.')
}

const testFile = path.join(root, 'scripts/.audit-visual.spec.mjs')
fs.writeFileSync(testFile, `
import { test, expect } from '@playwright/test'

const routes = ${JSON.stringify(routes)}
const viewports = ${JSON.stringify(viewports)}
const baseUrl = ${JSON.stringify(baseUrl)}
const artifacts = ${JSON.stringify(artifacts)}

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })
    for (const route of routes) {
      test(route, async ({ page }) => {
        await page.goto(baseUrl + route, { waitUntil: 'networkidle' })
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow).toBeLessThanOrEqual(1)
        const name = route === '/' ? 'home' : route.replace(/^\\//, '').replaceAll('/', '-')
        await page.screenshot({ path: artifacts + '/' + viewport.name + '-' + name + '.png', fullPage: true })
      })
    }
  })
}
`, 'utf8')

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: 'ignore',
})

try {
  await waitForPreview()
  await run('npx', ['-y', 'playwright', 'test', testFile, '--browser=chromium'], { env: { CI: '1' } })
  console.log(`Visual audit passed. Screenshots: ${artifacts}`)
} finally {
  server.kill('SIGTERM')
  fs.rmSync(testFile, { force: true })
}
