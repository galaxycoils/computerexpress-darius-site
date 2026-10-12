import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'
import { parse } from 'yaml'
import { installLockedDependencies } from './ciInstall.js'
import { auditWorkflow } from './workflowPolicy.js'
import { archiveIds, removedArchiveIds } from './archiveHistory.js'
import { entitlementMigration } from './alertEntitlementMigration.js'
import { digestWindow, alreadySubmitted, uncertainSubmission, scheduledDigestDecision } from './digestSchedule.js'

const workflow = name => parse(readFileSync(new URL(`../.github/workflows/${name}`, import.meta.url), 'utf8'))
const ci = workflow('ci.yml')
const deploy = workflow('deploy.yml')

test('dependency installation recovers from network and cache corruption with fresh caches', async () => {
  for (const output of ['npm error ECONNRESET', 'npm error EINTEGRITY', 'npm error TAR_BAD_ARCHIVE', 'npm error E429', 'npm error 503 Service Unavailable']) {
    const calls = [], delays = []
    await installLockedDependencies({
      log: () => {}, wait: async ms => { delays.push(ms) },
      install: async options => { calls.push(options); return calls.length === 1 ? { code: 1, output } : { code: 0 } },
    })
    assert.deepEqual(calls, [{ attempt: 1, freshCache: false }, { attempt: 2, freshCache: true }])
    assert.deepEqual(delays, [1000])
  }
})

test('dependency retries are bounded and do not conceal bad locks, scripts or credentials', async () => {
  for (const output of ['npm error EUSAGE lock mismatch', 'npm error ERESOLVE', 'npm error EBADENGINE', 'npm error E401', 'npm error E403 ECONNRESET', 'npm error E404', 'lifecycle script exited 1']) {
    let calls = 0
    await assert.rejects(installLockedDependencies({
      wait: async () => { throw new Error('must not retry') },
      install: async () => { calls++; return { code: 1, output } },
    }), /installation failed/)
    assert.equal(calls, 1)
  }
  let calls = 0
  await assert.rejects(installLockedDependencies({
    log: () => {}, wait: async () => {},
    install: async () => { calls++; return { code: 1, timedOut: true } },
  }), /attempt 3/)
  assert.equal(calls, 3)
})

test('archive retention catches deleted history even when replacement records preserve the count', () => {
  const source = ids => `export const nrpsReleases = [${ids.map(id => `{ id: '${id}' }`).join(',')}];`
  assert.deepEqual(removedArchiveIds(source(['old', 'quarantined']), source(['old', 'quarantined', 'new'])), [])
  assert.deepEqual(removedArchiveIds(source(['old', 'quarantined']), source(['old', 'new'])), ['quarantined'])
  assert.deepEqual(archiveIds("throw new Error('must never execute'); export const nrpsReleases = [{id: 'old'}];"), ['old'])
  for (const invalid of ['export const nrpsReleases = [', 'export const nrpsReleases = getData()', 'export const nrpsReleases = [{headline: "no id"}]']) {
    assert.throws(() => archiveIds(invalid), /archive/i)
  }
})

test('workflow policy rejects drift that would skip, weaken or unpin required checks', () => {
  assert.deepEqual(auditWorkflow('ci.yml', ci), [])
  assert.deepEqual(auditWorkflow('deploy.yml', deploy), [])
  for (const [mutate, expected] of [
    [w => { w.on.push['paths-ignore'] = ['**/*.md'] }, /document/],
    [w => { w.jobs.test['timeout-minutes'] = undefined }, /timeout/],
    [w => { w.jobs.test.steps[0].uses = 'actions/checkout@main' }, /pinned/],
    [w => { w.jobs.test['continue-on-error'] = true }, /continue on error/],
    [w => { w.jobs.test.if = 'false' }, /mandatory quality/],
    [w => { w.jobs.test.strategy.matrix.include = w.jobs.test.strategy.matrix.include.filter(suite => suite.command !== 'npm test') }, /mandatory quality/],
    [w => { w.jobs.test.steps[0].with['persist-credentials'] = true }, /persist credentials/],
    [w => { w.defaults.run.shell = 'bash' }, /strict Bash/],
    [w => { delete w.jobs.browser }, /browser/],
    [w => { w.jobs['ci-success'].needs = ['test', 'build'] }, /browser/],
    [w => { w.jobs['ci-success'].if = 'success()' }, /aggregate/],
    [w => { w.jobs.browser.if = 'false' }, /conditionally skip/],
    [w => { w.jobs.browser.steps.find(step => step.run?.includes('npm run test:browser')).if = 'false' }, /browser must pass/],
    [w => { w.jobs.build.steps.find(step => step.run === 'npm run audit:build').run = 'echo skipped' }, /build must pass/],
    [w => { w.jobs.browser.steps.find(step => step.uses?.startsWith('actions/download-artifact@')).with['run-id'] = 123 }, /this workflow run/],
    [w => { w.on.pull_request_target = null }, /privileged/],
  ]) {
    const copy = structuredClone(ci)
    mutate(copy)
    assert.match(auditWorkflow('ci.yml', copy).join(), expected)
  }
})

test('production cannot bypass browser, type, identity, archive or workflow gates', () => {
  for (const command of ['npm test', 'node --test scripts/*.regression.mjs', 'npm run build', 'npm run budget:bundle', 'npm run test:browser', 'npm run typecheck', 'npm run audit:identity', 'npm run audit:archives']) {
    const copy = structuredClone(deploy)
    copy.jobs.deploy.steps = copy.jobs.deploy.steps.filter(step => !step.run?.includes(command))
    assert.match(auditWorkflow('deploy.yml', copy).join(), /production must pass/)
  }
  const copy = structuredClone(deploy)
  copy.jobs.deploy.if = 'always()'
  assert.match(auditWorkflow('deploy.yml', copy).join(), /restricted to main/)
  const disabled = structuredClone(deploy)
  disabled.jobs.deploy.steps.find(step => step.run?.includes('npm run test:browser')).if = 'false'
  assert.match(auditWorkflow('deploy.yml', disabled).join(), /production must pass/)
  for (const id of ['configuration', 'current', 'deploy']) {
    const invalid = structuredClone(deploy)
    invalid.jobs.deploy.steps.find(step => step.id === id).if = 'always()'
    assert.match(auditWorkflow('deploy.yml', invalid).join(), /recheck the current main/)
  }
  const unverified = structuredClone(deploy)
  unverified.jobs.deploy.steps = unverified.jobs.deploy.steps.filter(step => step.run !== 'node scripts/verify-release.js')
  assert.match(auditWorkflow('deploy.yml', unverified).join(), /verify the live revision/)
})

test('aggregate checks fail for each failed, cancelled or skipped prerequisite', () => {
  for (const [definition, id, prerequisites] of [
    [ci, 'ci-success', ['test', 'build', 'browser']],
    [workflow('content-integrity.yml'), 'integrity-passed', ['integrity']],
  ]) {
    const statuses = [{}, ...prerequisites.flatMap(job => ['failure', 'cancelled', 'skipped'].map(result => ({ [job]: result })))]
    for (const results of statuses) {
      let command = definition.jobs[id].steps[0].run
      for (const job of prerequisites) command = command.replaceAll('${{ needs.' + job + '.result }}', results[job] || 'success')
      const result = spawnSync('bash', ['-euo', 'pipefail', '-c', command], { encoding: 'utf8', timeout: 5000 })
      assert.equal(result.status, Object.keys(results).length ? 1 : 0, result.stdout + result.stderr)
    }
  }
})

test('digest submission is main-only and cannot silently gain unsafe POST retries', () => {
  const digest = workflow('send-planning-digest.yml')
  assert.deepEqual(auditWorkflow('send-planning-digest.yml', digest), [])
  digest.jobs.send.steps.find(step => step.name === 'Submit planning digest').run += '\ncurl --retry 3 -X POST example.invalid'
  assert.match(auditWorkflow('send-planning-digest.yml', digest).join(), /blindly retried/)
})

test('digest receipt gate and submission-only credentials cannot be bypassed', () => {
  for (const mutate of [
    digest => { digest.jobs.send.steps.find(step => step.id === 'schedule').if = 'false' },
    digest => { digest.jobs.send.steps.find(step => step.name === 'Submit planning digest').if = 'always()' },
    digest => { digest.jobs.send.env = { CRON_SECRET: 'fixture' } },
    digest => { digest.jobs.send.steps[1].env = { CRON_SECRET: 'fixture' } },
  ]) {
    const digest = workflow('send-planning-digest.yml')
    mutate(digest)
    assert.match(auditWorkflow('send-planning-digest.yml', digest).join(), /receipts|scoped only/)
  }
})

test('weekly digest tolerates delayed cron and daylight saving without double submission', () => {
  assert.equal(digestWindow(new Date('2026-10-15T09:59:00Z')), null)
  assert.equal(digestWindow(new Date('2026-10-15T10:00:00Z')), '2026-10-15')
  assert.equal(digestWindow(new Date('2026-10-15T18:00:00Z')), '2026-10-15')
  assert.equal(digestWindow(new Date('2026-10-16T09:59:00Z')), '2026-10-15')
  assert.equal(digestWindow(new Date('2026-10-16T10:00:00Z')), null)
  assert.equal(digestWindow(new Date('2027-01-14T10:00:00Z')), null)
  assert.equal(digestWindow(new Date('2027-01-14T11:00:00Z')), '2027-01-14')
  const successful = { name: 'Submit planning digest', conclusion: 'success', started_at: '2026-10-15T18:00:00Z' }
  assert.equal(alreadySubmitted([{ steps: [successful] }], '2026-10-15'), true)
  assert.equal(alreadySubmitted([{ steps: [{ ...successful, conclusion: 'skipped' }] }], '2026-10-15'), false)
  assert.equal(alreadySubmitted([{ steps: [{ ...successful, conclusion: 'failure' }] }], '2026-10-15'), false)
  assert.equal(alreadySubmitted([{ steps: [{ ...successful, name: 'Select the weekly delivery window' }] }], '2026-10-15'), false)
  assert.equal(alreadySubmitted([{ steps: [successful] }], '2026-10-22'), false)
  assert.equal(uncertainSubmission([{ steps: [{ ...successful, conclusion: 'failure' }] }], '2026-10-15'), true)
  assert.equal(uncertainSubmission([{ steps: [{ ...successful, conclusion: 'cancelled' }] }], '2026-10-15'), true)
  assert.equal(uncertainSubmission([{ steps: [{ ...successful, conclusion: 'skipped' }] }], '2026-10-15'), false)
  assert.equal(uncertainSubmission([{ steps: [successful] }], '2026-10-15'), false)
})

test('digest receipt lookup permits skipped slots, prevents duplicate sends and blocks uncertain attempts', async () => {
  const options = { now: new Date('2026-10-15T18:00:00Z'), runId: '2', repository: 'fixture/repo' }
  const runs = [{ databaseId: 1, createdAt: '2026-10-15T10:00:00Z', status: 'completed' }]
  for (const [conclusion, send] of [['success', false], ['skipped', true]]) {
    const read = async args => args[0] === 'run' ? runs : { total_count: 1, jobs: [{ steps: [{ name: 'Submit planning digest', conclusion, started_at: '2026-10-15T10:00:00Z' }] }] }
    assert.equal((await scheduledDigestDecision({ ...options, read })).send, send)
  }
  await assert.rejects(scheduledDigestDecision({ ...options, read: async args => args[0] === 'run' ? runs : { total_count: 1, jobs: [{ steps: [{ name: 'Submit planning digest', conclusion: 'failure', started_at: '2026-10-15T10:00:00Z' }] }] } }), /without confirmed completion/)
  await assert.rejects(scheduledDigestDecision({ ...options, read: async () => { throw new Error('GitHub unavailable') } }), /GitHub unavailable/)
  assert.equal((await scheduledDigestDecision({ ...options, now: new Date('2027-01-14T10:00:00Z'), read: async () => { throw new Error('must not read') } })).send, false)
  await assert.rejects(scheduledDigestDecision({ ...options, now: new Date('2026-10-16T12:00:00Z'), read: async () => [] }), /missed its 24-hour/)
  const previousAttempt = async args => args[0] === 'run' ? [{ databaseId: 2, createdAt: '2026-10-15T10:00:00Z', status: 'in_progress' }] : { total_count: 1, jobs: [{ steps: [{ name: 'Submit planning digest', conclusion: 'success', started_at: '2026-10-15T10:00:00Z' }] }] }
  assert.equal((await scheduledDigestDecision({ ...options, runAttempt: 2, read: previousAttempt })).send, false)
})

test('digest submission is blocked when receipt metadata is malformed or paginated incompletely', async () => {
  const options = { now: new Date('2026-10-15T18:00:00Z'), runId: '2', repository: 'fixture/repo' }
  const runs = [{ databaseId: 1, createdAt: '2026-10-15T10:00:00Z', status: 'completed' }]
  for (const response of [null, {}, { jobs: [] }, { total_count: 1, jobs: [] }, { total_count: 1, jobs: [{}] }]) {
    await assert.rejects(scheduledDigestDecision({ ...options, read: async args => args[0] === 'run' ? runs : response }), /invalid or incomplete jobs/)
  }
  for (const response of [{}, [{ databaseId: 1, createdAt: 'invalid', status: 'completed' }], [{ databaseId: 1, createdAt: '2026-10-15T10:00:00Z', status: 'unknown' }]]) {
    await assert.rejects(scheduledDigestDecision({ ...options, read: async () => response }), /invalid workflow metadata/)
  }
  assert.equal((await scheduledDigestDecision({ ...options, read: async args => args[0] === 'run' ? runs : { total_count: 0, jobs: [] } })).send, true)
})

test('visual audit discovers its generated gitignored suite and excludes unrelated test files', t => {
  const fixtures = new URL('../.qa/', import.meta.url)
  mkdirSync(fixtures, { recursive: true })
  const directory = mkdtempSync(path.join(fixtures.pathname, 'visual-discovery-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const config = path.join(directory, 'playwright.config.mjs')
  writeFileSync(config, `import base from ${JSON.stringify(new URL('./playwright-visual.config.mjs', import.meta.url).href)}; export default { ...base, testDir: ${JSON.stringify(directory)} };`)
  writeFileSync(path.join(directory, '.audit-visual.spec.mjs'), "import { test } from '@playwright/test'; test('generated visual audit', () => {});")
  writeFileSync(path.join(directory, 'unrelated.test.mjs'), "throw new Error('Unrelated suite must not be discovered')")
  const result = spawnSync(process.execPath, [new URL('../node_modules/@playwright/test/cli.js', import.meta.url).pathname, 'test', '--config', config, '--list'], { encoding: 'utf8', timeout: 30000 })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Total: 1 test in 1 file/)
  assert.match(result.stdout, /generated visual audit/)
  writeFileSync(path.join(directory, '.audit-visual.spec.mjs'), "import { test } from '@playwright/test'; test.only('focused test', () => {});")
  const focused = spawnSync(process.execPath, [new URL('../node_modules/@playwright/test/cli.js', import.meta.url).pathname, 'test', '--config', config, '--list'], { encoding: 'utf8', timeout: 30000 })
  assert.notEqual(focused.status, 0)
  assert.match(focused.stderr + focused.stdout, /forbidOnly|test\.only/)
})

test('backup cannot publish a successful but empty export and cleans up plaintext on failure', t => {
  const root = mkdtempSync(path.join(tmpdir(), 'backup-empty-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(path.join(root, 'bin'))
  writeFileSync(path.join(root, 'bin/npx'), '#!/bin/sh\n: > backup/stcatharinesdigital.sql\n', { mode: 0o755 })
  const backup = workflow('d1-backup.yml')
  const command = backup.jobs.backup.steps.find(step => step.name === 'Export and encrypt D1 data').run
  const result = spawnSync('bash', ['-euo', 'pipefail', '-c', command], {
    cwd: root, encoding: 'utf8', env: { ...process.env, PATH: `${root}/bin:${process.env.PATH}`, RUNNER_TEMP: root,
      CLOUDFLARE_API_TOKEN: 'fixture', CLOUDFLARE_ACCOUNT_ID: 'fixture', D1_BACKUP_PASSPHRASE: 'fixture', GITHUB_SHA: 'a'.repeat(40) },
  })
  assert.equal(result.status, 1)
  assert.match(result.stdout, /refusing to publish a backup/)
  assert.equal(existsSync(path.join(root, 'backup/stcatharinesdigital.sql')), false)
  assert.equal(existsSync(path.join(root, 'backup/stcatharinesdigital.sql.enc')), false)
  const upload = backup.jobs.backup.steps.find(step => step.uses?.startsWith('actions/upload-artifact@'))
  upload.with.path += '\nbackup/stcatharinesdigital.sql'
  assert.match(auditWorkflow('d1-backup.yml', backup).join(), /plaintext/)
})

function alertDatabase(t) {
  const db = new DatabaseSync(':memory:')
  t.after(() => db.close())
  db.exec('CREATE TABLE alerts(id TEXT PRIMARY KEY, verified INTEGER, frequency TEXT, payment_status TEXT);')
  db.exec("INSERT INTO alerts VALUES('unpaid',1,'daily','pending_interac'),('paid',1,'daily','confirmed'),('unverified',0,'daily','pending_interac');")
  const columns = () => db.prepare('PRAGMA table_info(alerts)').all().map(column => column.name)
  return { db, columns }
}

test('entitlement schema upgrades once without restarting existing grace windows', t => {
  const { db, columns } = alertDatabase(t)
  db.exec(entitlementMigration(columns()))
  assert.ok(db.prepare("SELECT grace_until FROM alerts WHERE id='unpaid'").get().grace_until > Date.now())
  assert.equal(db.prepare("SELECT grace_until FROM alerts WHERE id='paid'").get().grace_until, null)
  assert.equal(db.prepare("SELECT grace_until FROM alerts WHERE id='unverified'").get().grace_until, null)
  db.exec("UPDATE alerts SET grace_until=123,grace_notified_at=456 WHERE id='unpaid'")
  db.exec(entitlementMigration(columns()))
  assert.deepEqual({ ...db.prepare("SELECT grace_until,grace_notified_at FROM alerts WHERE id='unpaid'").get() }, { grace_until: 123, grace_notified_at: 456 })
})

test('partial entitlement upgrades preserve deadlines and incomplete initial schemas fail clearly', t => {
  const { db, columns } = alertDatabase(t)
  db.exec("ALTER TABLE alerts ADD COLUMN grace_until INTEGER; UPDATE alerts SET grace_until=123 WHERE id='unpaid';")
  db.exec(entitlementMigration(columns()))
  assert.equal(db.prepare("SELECT grace_until FROM alerts WHERE id='unpaid'").get().grace_until, 123)
  assert.ok(columns().includes('grace_notified_at'))
  assert.throws(() => entitlementMigration(['id', 'verified', 'frequency']), /payment_status/)
  assert.throws(() => entitlementMigration(['id', 'verified', 'payment_status']), /frequency/)
})
