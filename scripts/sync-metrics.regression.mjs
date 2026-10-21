import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { METRIC_FILES, metricTemplates, syncMetricText } from './sync-metrics-docs.js'

const metrics = {
  police: 3,
  policeTotal: 4,
  planning: 5,
  civic: 6,
  sources: 2,
  total: 14,
  label: '3 police + 5 planning + 6 civic = 14 verified records',
}

test('marked count lines are rewritten from derived metrics', () => {
  const templates = metricTemplates(metrics)
  const source = Object.keys(templates)
    .map(id => `<!-- metrics:${id} -->stale<!-- /metrics:${id} -->`)
    .join('\n')
  const synced = syncMetricText(source, metrics)
  assert.match(synced, /3 verified police \+ \*\*5\*\* planning \+ \*\*6\*\* civic = \*\*14 verified records\*\*/)
  assert.match(synced, /Police feed \(3 verified releases\), Planning tracker \(5 notices\), Council calendar \(6 civic events\)/)
  assert.match(synced, /3 of 4 held NRPS releases/)
  assert.match(synced, /3 of 4 held releases are source-verified/)
  assert.equal(syncMetricText(synced, metrics), synced)
})

test('an unknown metrics block fails instead of being left stale', () => {
  assert.throws(
    () => syncMetricText('<!-- metrics:not-a-count -->9<!-- /metrics:not-a-count -->', metrics),
    /Unknown metrics block: not-a-count/,
  )
})

test('tracked documents already match the live metrics', () => {
  const root = path.resolve(import.meta.dirname, '..')
  for (const relative of METRIC_FILES) {
    const text = readFileSync(path.join(root, relative), 'utf8')
    assert.equal(syncMetricText(text), text, relative)
  }
  const audit = spawnSync(process.execPath, ['scripts/audit-metrics.js'], { cwd: root, encoding: 'utf8' })
  assert.equal(audit.status, 0, audit.stderr)
})

test('check mode reports drift without rewriting the source file', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'metrics-sync-'))
  const file = path.join(directory, 'sample.md')
  writeFileSync(file, '<!-- metrics:income-civic-live -->1 civic records are live<!-- /metrics:income-civic-live -->\n')
  try {
    const drifted = syncMetricText(readFileSync(file, 'utf8'), metrics)
    assert.match(drifted, /6 civic records are live/)
    assert.match(readFileSync(file, 'utf8'), /1 civic records are live/)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
