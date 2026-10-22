import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { parse } from 'yaml';
import { runPublishCandidate, MAIN_REPOSITORY_SSH, GITHUB_SSH_FINGERPRINTS } from './publish-candidate.js';

const FAKE_KEY = '-----BEGIN OPENSSH PRIVATE KEY-----\ndGVzdC1rZXk=\n-----END OPENSSH PRIVATE KEY-----\n';

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'deploy-key-publish-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const remote = path.join(root, 'remote.git');
  const work = path.join(root, 'work');
  mkdirSync(work);
  const run = (args, cwd = work) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  run(['init', '--bare', remote]);
  run(['init', '-b', 'main']);
  run(['config', 'user.name', 'Test']);
  run(['config', 'user.email', 'test@example.com']);
  run(['remote', 'add', 'origin', remote]);
  writeFileSync(path.join(work, 'base.txt'), 'base');
  run(['add', '.']);
  run(['commit', '-m', 'base']);
  const base = run(['rev-parse', 'HEAD']);
  run(['push', 'origin', 'main']);
  run(['switch', '-c', 'candidate']);
  writeFileSync(path.join(work, 'candidate.txt'), 'validated');
  run(['add', '.']);
  run(['commit', '-m', 'candidate']);
  const candidate = run(['rev-parse', 'HEAD']);
  const git = async args => {
    try { return run(args); } catch (error) { error.code = error.status; throw error; }
  };
  return { base, candidate, git, run, remote, work };
}

function quoteArg(command, flag) {
  const match = command.match(new RegExp(`${flag} ?('[^']*')`));
  assert.ok(match, `${flag} missing from ${command}`);
  return match[1].slice(1, -1).replaceAll(`'\\''`, `'`);
}

test('publication to main refuses a missing deploy key before any push', async () => {
  let calls = 0;
  await assert.rejects(
    () => runPublishCandidate({ base: 'a'.repeat(40), candidate: 'b'.repeat(40), env: {}, git: () => { calls += 1; } }),
    /COLLECTOR_DEPLOY_KEY is missing[\s\S]*private[\s\S]*deploy key[\s\S]*GITHUB_TOKEN[\s\S]*ruleset/,
  );
  await assert.rejects(
    () => runPublishCandidate({ base: 'a'.repeat(40), candidate: 'b'.repeat(40), env: { COLLECTOR_DEPLOY_KEY: ' \n ' }, git: () => { calls += 1; } }),
    /COLLECTOR_DEPLOY_KEY is missing/,
  );
  await assert.rejects(
    () => runPublishCandidate({ base: 'a'.repeat(40), candidate: 'b'.repeat(40), env: { COLLECTOR_DEPLOY_KEY: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFakePublicKeyOnly' }, git: () => { calls += 1; } }),
    /private OpenSSH key/,
  );
  assert.equal(calls, 0);
});

test('publication to main pushes the verified SHA over SSH and removes the key', async t => {
  const f = fixture(t);
  const seen = [];
  let keyPath = '';
  const result = await runPublishCandidate({
    base: f.base,
    candidate: f.candidate,
    env: { COLLECTOR_DEPLOY_KEY: FAKE_KEY.replaceAll('\n', '\\n') },
    git: async (args, options = {}) => {
      seen.push(args[0]);
      if (args[0] !== 'push') {
        assert.equal(options.env, undefined);
        if (args[0] === 'fetch') assert.deepEqual(args, ['fetch', 'origin', 'main']);
        return f.git(args);
      }
      assert.deepEqual(args, ['push', MAIN_REPOSITORY_SSH, `${f.candidate}:refs/heads/main`]);
      const command = options.env.GIT_SSH_COMMAND;
      assert.match(command, /IdentitiesOnly=yes/);
      assert.match(command, /BatchMode=yes/);
      assert.match(command, /StrictHostKeyChecking=yes/);
      keyPath = quoteArg(command, '-i');
      const knownHosts = quoteArg(command, 'UserKnownHostsFile=');
      assert.equal(statSync(keyPath).mode & 0o777, 0o600);
      assert.equal(statSync(path.dirname(keyPath)).mode & 0o777, 0o700);
      assert.equal(readFileSync(keyPath, 'utf8'), FAKE_KEY);
      const hosts = readFileSync(knownHosts, 'utf8');
      const fingerprints = execFileSync('ssh-keygen', ['-lf', knownHosts], { encoding: 'utf8' });
      for (const fingerprint of Object.values(GITHUB_SSH_FINGERPRINTS)) {
        assert.equal(fingerprints.includes(`SHA256:${fingerprint}`), true);
        assert.equal(hosts.includes('github.com '), true);
      }
      assert.equal(hosts.includes('ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl'), true);
      return f.git(['push', f.remote, `${f.candidate}:refs/heads/main`]);
    },
  });
  assert.equal(result, true);
  assert.deepEqual(seen.filter(name => name === 'push'), ['push']);
  assert.equal(seen.includes('fetch'), true);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), f.candidate);
  assert.equal(statSync(keyPath, { throwIfNoEntry: false }), undefined);
});

test('a lost deploy-key acknowledgement still leaves the verified SHA on main', async t => {
  const f = fixture(t);
  let pushes = 0;
  const result = await runPublishCandidate({
    base: f.base,
    candidate: f.candidate,
    env: { COLLECTOR_DEPLOY_KEY: FAKE_KEY },
    git: async (args, options = {}) => {
      if (args[0] !== 'push') return f.git(args);
      pushes += 1;
      assert.equal(args[1], MAIN_REPOSITORY_SSH);
      assert.match(options.env.GIT_SSH_COMMAND, /StrictHostKeyChecking=yes/);
      await f.git(['push', f.remote, `${f.candidate}:refs/heads/main`]);
      throw new Error('Lost acknowledgement');
    },
  });
  assert.equal(result, true);
  assert.equal(pushes, 1);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), f.candidate);
});

test('an ordinary push failure is not described as a ruleset bypass problem', async t => {
  const f = fixture(t);
  await assert.rejects(() => runPublishCandidate({
    base: f.base,
    candidate: f.candidate,
    env: { COLLECTOR_DEPLOY_KEY: FAKE_KEY },
    git: async args => {
      if (args[0] !== 'push') return f.git(args);
      throw new Error('Permission denied (publickey)');
    },
  }), error => /not on main/.test(error.message) && !/DeployKey/.test(error.message));
});

test('a ruleset refusal explains the deploy-key bypass and does not publish', async t => {
  const f = fixture(t);
  await assert.rejects(() => runPublishCandidate({
    base: f.base,
    candidate: f.candidate,
    env: { COLLECTOR_DEPLOY_KEY: FAKE_KEY },
    git: async args => {
      if (args[0] !== 'push') return f.git(args);
      const error = new Error('Command failed: git push');
      error.stderr = 'remote: error: GH013: Repository rule violations found for refs/heads/main.';
      throw error;
    },
  }), /GH013[\s\S]*DeployKey[\s\S]*bypass/);
  assert.equal(f.run(['rev-parse', 'refs/heads/main'], f.remote), f.base);
});

test('collector publication cannot retrigger itself or a second deploy', () => {
  const collector = parse(readFileSync(new URL('../.github/workflows/collect-official-news.yml', import.meta.url), 'utf8'));
  const committed = ['src/data/generated/discovery.json', 'PITCH_DECK.md', 'INCOME_PRIORITY_PLAN.md'];
  for (const file of committed) assert.equal(collector.on.push.paths.includes(file), false);
  const step = collector.jobs.collect.steps.find(item => item.name === 'Verify candidate before publishing discovery update');
  assert.equal(step.env.COLLECTOR_DEPLOY_KEY, '${{ secrets.COLLECTOR_DEPLOY_KEY }}');
  assert.match(step.run, /COLLECTOR_DEPLOY_KEY is missing/);
  assert.match(step.run, /git push origin "\$candidate:refs\/heads\/\$branch"/);
  assert.doesNotMatch(step.run, /git push[^\n]*refs\/heads\/main/);
  assert.equal(step.run.split('git commit -m').length - 1, 1);
  assert.match(step.run, /git commit -m "\$1" -m "\[skip ci\]"/);
  assert.equal(step.run.split('publish_commit "').length - 1, 2);
  const publishAt = step.run.indexOf('scripts/publish-candidate.js');
  assert.ok(publishAt > step.run.indexOf('for workflow in ci.yml content-integrity.yml'));
  assert.ok(publishAt > step.run.indexOf('watch-workflow.js'));
  const deploy = parse(readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8'));
  const ci = parse(readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8'));
  const integrity = parse(readFileSync(new URL('../.github/workflows/content-integrity.yml', import.meta.url), 'utf8'));
  for (const workflow of [deploy, ci, integrity, collector]) {
    assert.equal(workflow.on.push.branches.includes('main'), true);
  }
  assert.match(collector.jobs.collect.steps.find(item => item.name === 'Ensure the latest snapshot is public').run, /gh workflow run deploy\.yml --ref main/);
  for (const name of ['deploy.yml', 'ci.yml', 'content-integrity.yml']) {
    const source = readFileSync(new URL(`../.github/workflows/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /git push/);
  }
});
