import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, chmodSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

test('installed pre-push hook rejects placeholder commits and unstaged repairs before remote publication', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'source-push-'))
  const run = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8' })
  const git = (...args) => { const r = run(...args); assert.equal(r.status, 0, r.stderr); return r.stdout.trim() }
  try {
    mkdirSync(path.join(dir, 'scripts'))
    mkdirSync(path.join(dir, '.githooks'))
    for (const script of ['check-push.mjs', 'install-git-hooks.mjs']) copyFileSync(new URL(script, import.meta.url), path.join(dir, 'scripts', script))
    copyFileSync(new URL('../.githooks/pre-push', import.meta.url), path.join(dir, '.githooks/pre-push'))
    chmodSync(path.join(dir, '.githooks/pre-push'), 0o755)
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'module', scripts: {
      'content:audit': 'node data.js', 'audit:archives': 'node data.js', 'audit:metrics': 'node data.js', test: 'node data.js',
    } }))
    writeFileSync(path.join(dir, 'data.js'), 'export const records = [];\n')
    git('init', '-q'); git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Test')
    git('add', '.'); git('commit', '-qm', 'valid baseline')
    git('init', '--bare', '-q', path.join(dir, 'remote.git'))
    git('remote', 'add', 'origin', path.join(dir, 'remote.git'))
    const installed = spawnSync(process.execPath, ['scripts/install-git-hooks.mjs'], { cwd: dir, encoding: 'utf8' })
    assert.equal(installed.status, 0, installed.stderr)
    git('push', 'origin', 'HEAD:main')
    const published = git('ls-remote', 'origin', 'refs/heads/main')
    writeFileSync(path.join(dir, 'data.js'), 'PLACEHOLDER\n')
    git('add', 'data.js'); git('commit', '-qm', 'corrupt source')
    assert.notEqual(run('push', 'origin', 'HEAD:main').status, 0)
    assert.equal(git('ls-remote', 'origin', 'refs/heads/main'), published)
    writeFileSync(path.join(dir, 'data.js'), 'export const records = [];\n')
    assert.notEqual(run('push', 'origin', 'HEAD:main').status, 0, 'working-tree repair does not validate a broken commit')
    assert.equal(git('ls-remote', 'origin', 'refs/heads/main'), published)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
