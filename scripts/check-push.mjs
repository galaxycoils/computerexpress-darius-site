import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status || 1)
}
const refs = readFileSync(0, 'utf8').trim().split('\n').filter(Boolean)
const updates = refs.map(line => line.split(/\s+/)).filter(parts => !/^0+$/.test(parts[1] || ''))
if (refs.length && !updates.length) process.exit(0) // Branch deletion has no source to publish.
if (updates.length) {
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim()
  if (updates.some(parts => parts[1] !== head)) {
    console.error('Push blocked: check out the revision being pushed so it can be validated.')
    process.exit(1)
  }
}
// Validate exactly the tracked tree being pushed, not unstaged repair edits.
run('git', ['diff', '--exit-code', '--quiet', 'HEAD', '--', '.'])
for (const script of ['content:audit', 'audit:archives', 'audit:metrics', 'test']) {
  run('npm', ['run', script])
}
