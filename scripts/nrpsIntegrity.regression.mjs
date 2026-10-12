import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, copyFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { auditNrpsModule } from './nrpsIntegrity.js'
import * as archive from '../src/data/nrpsReleases.js'

function fixture() {
  const verifiedNrpsReleases = Array.from({ length: 20 }, (_, index) => ({
    id: `release-${index}`, headline: `Release ${index}`, date: '2026-10-01',
    url: `https://www.niagarapolice.ca/news/posts/release-${index}/`,
  }))
  return {
    nrpsReleases: [...verifiedNrpsReleases, { id: 'quarantined', unverified: true }],
    verifiedNrpsReleases,
    getLatestNrpsReleases: () => verifiedNrpsReleases,
    getNrpsReleasesByMunicipality: () => verifiedNrpsReleases,
    getNrpsReleasesByCategory: () => verifiedNrpsReleases,
    getNrpsStats: () => ({ total: verifiedNrpsReleases.length }),
  }
}

test('daily update retains the historical archive, quarantine boundary and reader API', () => {
  assert.deepEqual(auditNrpsModule(archive), [])
  // Last working archive held 58 records. Daily additions must preserve it.
  assert.ok(archive.nrpsReleases.length >= 58)
  assert.ok(archive.nrpsReleases.some(release => release.id === 'nrps-2026-10-11-thorold-welland-stabbing-suspect'))
  const historical = 'nrps-2026-10-03-thorold-fatal-single-vehicle'
  assert.ok(archive.getNrpsReleasesByMunicipality('Thorold').some(release => release.id === historical))
  assert.ok(archive.getNrpsReleasesByCategory('collision').some(release => release.id === historical))
  assert.ok(archive.getLatestNrpsReleases(20, 30, new Date('2026-10-12T12:00:00Z')).some(release => release.id === historical))
})

test('audit diagnoses truncated updates and every missing named export without throwing', () => {
  assert.deepEqual(auditNrpsModule(fixture()), [])
  for (const name of Object.keys(fixture())) {
    const nrps = fixture()
    delete nrps[name]
    assert.match(auditNrpsModule(nrps).join(), new RegExp(name))
  }
  const nrps = fixture()
  nrps.verifiedNrpsReleases = nrps.verifiedNrpsReleases.slice(0, 2)
  assert.match(auditNrpsModule(nrps).join(), /unexpectedly truncated/)
})

test('audit blocks omitted verified records and accidental publication of quarantined records', () => {
  const nrps = fixture()
  nrps.nrpsReleases.push({ ...nrps.nrpsReleases[0], id: 'omitted' })
  assert.match(auditNrpsModule(nrps).join(), /preserve all verified/)
  nrps.verifiedNrpsReleases = nrps.nrpsReleases
  assert.match(auditNrpsModule(nrps).join(), /exclude quarantined/)
})

test('audit rejects corrupt records, duplicate identities, insecure sources and incomplete releases', () => {
  for (const mutation of [
    release => { release.id = 'release-1' },
    release => { release.url = 'http://www.niagarapolice.ca/news/posts/release-0/' },
    release => { release.url = 'https://www.niagarapolice.ca/news/posts/release-1/' },
    release => { release.headline = '' },
    release => { release.date = '' },
  ]) {
    const nrps = fixture()
    mutation(nrps.nrpsReleases[0])
    assert.ok(auditNrpsModule(nrps).length)
  }
  const nrps = fixture()
  nrps.nrpsReleases.push(null)
  assert.match(auditNrpsModule(nrps).join(), /invalid record/)
  nrps.nrpsReleases.pop()
  nrps.verifiedNrpsReleases = [...nrps.verifiedNrpsReleases.slice(1), null]
  assert.match(auditNrpsModule(nrps).join(), /invalid record/)
})

test('audit reports broken statistics instead of crashing', () => {
  const nrps = fixture()
  nrps.getNrpsStats = () => ({ total: 2 })
  assert.match(auditNrpsModule(nrps).join(), /does not match/)
  nrps.getNrpsStats = () => { throw new Error('broken helper') }
  assert.match(auditNrpsModule(nrps).join(), /statistics failed: broken helper/)
})

test('content audit checks module exports before importing their consumers', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'nrps-audit-'))
  try {
    await mkdir(path.join(root, 'scripts'))
    await mkdir(path.join(root, 'src/data'), { recursive: true })
    await writeFile(path.join(root, 'package.json'), '{"type":"module"}')
    for (const name of ['content-audit.js', 'nrpsIntegrity.js', 'discoveryIntegrity.js']) {
      await copyFile(new URL(name, import.meta.url), path.join(root, 'scripts', name))
    }
    for (const source of ['export const nrpsReleases = []', 'export const nrpsReleases = [']) {
      await writeFile(path.join(root, 'src/data/nrpsReleases.js'), source)
      const result = spawnSync(process.execPath, ['scripts/content-audit.js'], { cwd: root, encoding: 'utf8' })
      assert.equal(result.status, 1)
      const report = JSON.parse(result.stderr)
      assert.match(report.errors.join(), /NRPS module/)
      assert.doesNotMatch(result.stderr, /ERR_MODULE_NOT_FOUND/)
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
