import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { archiveIds, removedArchiveIds } from './archiveHistory.js'

const configured = process.env.ARCHIVE_BASE_SHA
const base = configured && !/^0+$/.test(configured) ? configured : 'HEAD^'
if (base !== 'HEAD^' && !/^[0-9a-f]{40}$/.test(base)) throw new Error('Archive baseline must be an exact Git revision')
const git = args => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

// Validate today's modules first. A broken current file must never turn this
// gate into a successful skip. Repair commits may follow a malformed baseline;
// walk back to the most recent readable archive so its history is still checked.
for (const name of ['nrpsReleases', 'planningNotices']) {
  const file = `src/data/${name}.js`
  const current = readFileSync(file, 'utf8')
  archiveIds(current, name)
  const revisions = git(['rev-list', '--first-parent', '--max-count=100', base]).trim().split('\n')
  let previous, baseline
  for (const revision of revisions) {
    try {
      const source = git(['show', `${revision}:${file}`])
      archiveIds(source, name)
      previous = source
      baseline = revision
      break
    } catch {
      console.warn(`::warning::Malformed historical ${name} at ${revision}; checking its parent instead.`)
    }
  }
  if (previous === undefined) throw new Error(`No valid ${name} baseline found; fetch full history before auditing`)
  const removed = removedArchiveIds(previous, current, name)
  if (removed.length) {
    console.error(`::error::${name} removed ${removed.length} historical record(s): ${removed.join(', ')}. Retain records; quarantine invalid sources instead of deleting history.`)
    process.exitCode = 1
  } else {
    console.log(`Archive history passed: all ${name} records from ${baseline} retained.`)
  }
}
