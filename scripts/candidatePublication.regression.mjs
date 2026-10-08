import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { publishCandidate } from './candidatePublication.js';
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'publication-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const remote = path.join(root, 'remote.git');
  const work = path.join(root, 'work');mkdirSync(work);
  const run = (args, cwd = work) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  run(['init', '--bare', remote]);run(['init', '-b', 'main']);
  run(['config', 'user.name', 'Test']);run(['config', 'user.email', 'test@example.com']);
  run(['remote', 'add', 'origin', remote]);
  writeFileSync(path.join(work, 'base.txt'), 'base');run(['add', '.']);run(['commit', '-m', 'base']);
  const base = run(['rev-parse', 'HEAD']);run(['push', 'origin', 'main']);
  run(['switch', '-c', 'candidate']);
  writeFileSync(path.join(work, 'candidate.txt'), 'validated');run(['add', '.']);run(['commit', '-m', 'candidate']);
  const candidate = run(['rev-parse', 'HEAD']);
  const git = async args => {
    try { return run(args); } catch (error) { error.code = error.status; throw error; }
  };
  const advance = () => {
    const second = path.join(root, 'other');run(['clone', '-b', 'main', remote, second]);
    run(['config', 'user.name', 'Other'], second);run(['config', 'user.email', 'other@example.com'], second);
    writeFileSync(path.join(second, 'other.txt'), 'concurrent');run(['add', '.'], second);run(['commit', '-m', 'other'], second);run(['push', 'origin', 'main'], second);
    return run(['rev-parse', 'HEAD'], second);
  };
  return { base, candidate, git, run, advance, remote, root, work };
}
test('publication reconciles a lost push response without duplicating the commit', async t => {
  const f = fixture(t);let pushes = 0;
  const result = await publishCandidate(f, async args => {
    const value = await f.git(args);
    if (args[0] === 'push') { pushes++; throw new Error('Lost acknowledgement'); }
    return value;
  });
  assert.equal(result, true);assert.equal(pushes, 1);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), f.candidate);
});
test('publication never overwrites a main update that arrived during its push', async t => {
  const f = fixture(t);let other;
  const result = await publishCandidate(f, async args => {
    if (args[0] === 'push') other = f.advance();
    return f.git(args);
  });
  assert.equal(result, false);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), other);
});
test('publication requests revalidation when main has already advanced', async t => {
  const f = fixture(t);f.advance();let pushes = 0;
  assert.equal(await publishCandidate(f, async args => { if (args[0] === 'push') pushes++; return f.git(args); }), false);
  assert.equal(pushes, 0);
});
test('publication recognizes a candidate already present on main', async t => {
  const f = fixture(t);f.run(['push', 'origin', `${f.candidate}:main`]);
  assert.equal(await publishCandidate(f, async args => { assert.notEqual(args[0], 'push');return f.git(args); }), true);
});
test('publication preserves a real push failure when remote never accepted the candidate', async t => {
  const f = fixture(t);
  await assert.rejects(publishCandidate(f, async args => { if (args[0] === 'push') throw new Error('Permission denied');return f.git(args); }), /not on main/);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), f.base);
});
test('publication refuses a checkout that changed after validation', async t => {
  const f = fixture(t);f.run(['switch', 'main']);
  await assert.rejects(publishCandidate(f, f.git), /Checkout changed/);
});

test('release guard accepts only the current remote revision and reports superseded releases', t => {
  const f = fixture(t);
  const output = path.join(f.root, 'output');
  const summary = path.join(f.root, 'summary');
  const guard = path.resolve('scripts/release-head.sh');
  function check(revision) {
    writeFileSync(output, '');writeFileSync(summary, '');
    execFileSync('bash', [guard], { cwd: f.work, env: { ...process.env, RELEASE_SHA: revision, GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary }, stdio: 'pipe' });
    return readFileSync(output, 'utf8').trim();
  }
  assert.equal(check(f.base), 'publish=true');
  assert.equal(check(f.candidate), 'publish=false');
  assert.match(readFileSync(summary, 'utf8'), /superseded/);
  const newer = f.advance();
  assert.equal(check(f.base), 'publish=false');
  assert.equal(check(newer), 'publish=true');
  assert.throws(() => check('main'), /Command failed/);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), newer);
});
