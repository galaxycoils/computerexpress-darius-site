import { spawnSync } from 'node:child_process'

const inside = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' })
if (inside.status === 0 && inside.stdout.trim() === 'true') {
  const existing = spawnSync('git', ['config', '--get', 'core.hooksPath'], { encoding: 'utf8' }).stdout?.trim()
  if (existing && existing !== '.githooks') {
    console.warn(`Existing Git hooks are configured at ${existing}; run npm run check:push before pushing.`)
  } else {
    const result = spawnSync('git', ['config', '--local', 'core.hooksPath', '.githooks'], { stdio: 'inherit' })
    if (result.status !== 0) process.exit(result.status || 1)
    console.log('Installed Git pre-push source and test checks.')
  }
}
