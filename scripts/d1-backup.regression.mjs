import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { parse } from 'yaml'
import { verifyD1Export } from './d1Backup.js'
import { auditWorkflow } from './workflowPolicy.js'

const backup = () => parse(readFileSync(new URL('../.github/workflows/d1-backup.yml', import.meta.url), 'utf8'))
const valid = `PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE alerts(id TEXT PRIMARY KEY, email TEXT);
CREATE TABLE delivery(alert_id TEXT REFERENCES alerts(id));
INSERT INTO alerts VALUES('one', 'sensitive@example.invalid');
INSERT INTO delivery VALUES('one');
COMMIT;`

test('SQL backup restore accepts a complete dump with data and foreign keys', () => {
  assert.deepEqual(verifyD1Export(valid), { tables: 2 })
})

test('SQL backup restore rejects malformed, empty, orphaned and uncommitted exports without logging data', () => {
  for (const sql of ['', 'SELECT 1;', valid.replace('COMMIT;', ''), valid.replace("VALUES('one');", "VALUES('missing');"), valid + "\nINSERT INTO alerts VALUES('broken', 'sensitive@example.invalid'", 'CREATE TABLE alerts (id TEXT']) {
    assert.throws(() => verifyD1Export(sql), error => /refusing to publish/.test(error.message) && !error.message.includes('sensitive@'))
  }
})

test('backup workflow publishes only restore-verified encrypted files and cleans plaintext for invalid SQL', t => {
  for (const [sql, expectedStatus] of [[valid, 0], [valid + '\nINSERT INTO alerts VALUES(', 1]]) {
    const root = mkdtempSync(path.join(tmpdir(), 'backup-restore-'))
    t.after(() => rmSync(root, { recursive: true, force: true }))
    mkdirSync(path.join(root, 'bin'))
    symlinkSync(new URL('./', import.meta.url).pathname, path.join(root, 'scripts'), 'dir')
    const fixture = path.join(root, 'fixture.sql')
    writeFileSync(fixture, sql)
    writeFileSync(path.join(root, 'bin/npx'), '#!/bin/sh\ncase "$*" in *--skip-confirmation*) ;; *) exit 9 ;; esac\ncp "$BACKUP_FIXTURE" backup/stcatharinesdigital.sql\n', { mode: 0o755 })
    const command = backup().jobs.backup.steps.find(step => step.name === 'Export and encrypt D1 data').run
    const result = spawnSync('bash', ['-euo', 'pipefail', '-c', command], {
      cwd: root, encoding: 'utf8', timeout: 30000,
      env: { ...process.env, PATH: `${root}/bin:${process.env.PATH}`, RUNNER_TEMP: root, BACKUP_FIXTURE: fixture,
        CLOUDFLARE_API_TOKEN: 'fixture', CLOUDFLARE_ACCOUNT_ID: 'fixture', D1_BACKUP_PASSPHRASE: 'fixture-passphrase', GITHUB_SHA: 'a'.repeat(40) },
    })
    assert.equal(result.status, expectedStatus, result.stdout + result.stderr)
    assert.equal(existsSync(path.join(root, 'backup/stcatharinesdigital.sql')), false)
    assert.equal(existsSync(path.join(root, 'backup-verify.sql')), false)
    assert.equal(existsSync(path.join(root, 'backup/stcatharinesdigital.sql.enc')), expectedStatus === 0)
    assert.equal((result.stdout + result.stderr).includes('sensitive@example.invalid'), false)
    if (expectedStatus === 0) {
      const metadata = JSON.parse(readFileSync(path.join(root, 'backup/metadata.json'), 'utf8'))
      assert.equal(metadata.verified_restore, true)
      assert.equal(metadata.verified_roundtrip, true)
      const checksum = spawnSync('sha256sum', ['--check', 'SHA256SUMS'], { cwd: path.join(root, 'backup'), encoding: 'utf8' })
      assert.equal(checksum.status, 0, checksum.stderr)
    } else assert.match(result.stderr, /failed local restore validation/)
  }
})

test('backup policy rejects interactive export, missing restore checks and plaintext directory uploads', () => {
  assert.deepEqual(auditWorkflow('d1-backup.yml', backup()), [])
  for (const mutate of [
    w => { w.jobs.backup.steps.find(step => step.run).run = w.jobs.backup.steps.find(step => step.run).run.replace('--skip-confirmation ', '') },
    w => { w.jobs.backup.steps.find(step => step.run).run = w.jobs.backup.steps.find(step => step.run).run.replace('node scripts/verify-d1-backup.mjs backup/stcatharinesdigital.sql', 'echo skipped') },
    w => { w.jobs.backup.steps.at(-1).with.path = 'backup/' },
    w => { w.jobs.backup.steps.at(-1).if = 'always()' },
    w => { w.jobs.backup.steps.pop() },
    w => { w.jobs.backup.steps.find(step => step.run).run = w.jobs.backup.steps.find(step => step.run).run.replace('cmp backup/stcatharinesdigital.sql "$RUNNER_TEMP/backup-verify.sql"', 'echo skipped') },
  ]) {
    const copy = backup()
    mutate(copy)
    assert.match(auditWorkflow('d1-backup.yml', copy).join(), /backup must|plaintext|successful export/)
  }
})
