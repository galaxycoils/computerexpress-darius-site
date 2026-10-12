import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { removedArchiveIds } from './archiveHistory.js'

const file = 'src/data/nrpsReleases.js'
const configured = process.env.ARCHIVE_BASE_SHA
const base = configured && !/^0+$/.test(configured) ? configured : 'HEAD^'
if (base !== 'HEAD^' && !/^[0-9a-f]{40}$/.test(base)) throw new Error('Archive baseline must be an exact Git revision')
const previous = execFileSync('git', ['show', `${base}:${file}`], { encoding: 'utf8' })
const removed = removedArchiveIds(previous, readFileSync(file, 'utf8'))
if (removed.length) {
  console.error(`::error::Police archive update removed ${removed.length} historical record(s): ${removed.join(', ')}. Retain records; quarantine invalid sources instead of deleting history.`)
  process.exitCode = 1
} else {
  console.log('Archive history passed: all baseline police records retained.')
}
