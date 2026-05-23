import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const artifacts = path.join(root, 'artifacts')
const url = 'http://127.0.0.1:4173/'
const budgets = {
  performance: 0.9,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 1,
}

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
      const res = await fetch(url)
      if (res.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error('Preview server did not start.')
}

function readScores(file) {
  const report = JSON.parse(fs.readFileSync(file, 'utf8'))
  return Object.fromEntries(Object.entries(budgets).map(([category]) => [
    category,
    report.categories[category]?.score ?? 0,
  ]))
}

function assertScores(label, scores) {
  const failures = Object.entries(budgets)
    .filter(([category, min]) => scores[category] < min)
    .map(([category, min]) => `${label} ${category}: ${Math.round(scores[category] * 100)} < ${Math.round(min * 100)}`)

  if (failures.length) {
    throw new Error(`Lighthouse budget failed:\n${failures.map(f => `- ${f}`).join('\n')}`)
  }
}

const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: 'ignore',
})

try {
  await waitForPreview()
  const mobileOut = path.join(artifacts, 'lighthouse-home-mobile.json')
  const desktopOut = path.join(artifacts, 'lighthouse-home-desktop.json')

  const commonArgs = ['--quiet', '--throttling-method=provided', '--output=json', '--chrome-flags=--headless=new']
  await run('npx', ['lighthouse', url, ...commonArgs, `--output-path=${mobileOut}`], { env: { CI: '1' } })
  await run('npx', ['lighthouse', url, '--preset=desktop', ...commonArgs, `--output-path=${desktopOut}`], { env: { CI: '1' } })

  const mobile = readScores(mobileOut)
  const desktop = readScores(desktopOut)
  assertScores('mobile', mobile)
  assertScores('desktop', desktop)
  console.log('Lighthouse audit passed.', { mobile, desktop })
} finally {
  server.kill('SIGTERM')
}
