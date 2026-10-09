import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectWorkflowRun, watchWorkflow } from './workflowWatcher.js';
const since = '2026-10-08T12:00:00Z';
const criteria = { sha: 'expected', since, timeoutMs: 10_000, pollMs: 1000 };
const run = { databaseId: 42, event: 'workflow_dispatch', headSha: 'expected', createdAt: since, status: 'completed', conclusion: 'success', displayTitle: 'owned dispatch' };
function harness(extra = {}) {
  let time = 0;
  return { listRuns: async () => [run], getRun: async () => run, now: () => time, wait: async ms => { time += ms; }, log: () => {}, ...extra };
}
test('run lookup rejects old dispatches, wrong revisions, other events and unrelated titles', () => {
  const records = [
    { ...run, databaseId: 100, createdAt: '2026-10-08T11:59:59Z' },
    { ...run, databaseId: 101, headSha: 'other' },
    { ...run, databaseId: 102, event: 'push' },
    { ...run, databaseId: 103, displayTitle: 'unrelated' },
    run, { ...run, databaseId: 43 },
  ];
  assert.equal(selectWorkflowRun(records, { ...criteria, title: 'owned dispatch' }).databaseId, 43);
});
test('run lookup validates the dispatch timestamp', () => {
  assert.throws(() => selectWorkflowRun([run], { since: 'invalid' }), /timestamp/);
});
test('watcher finds a delayed run and then survives a lost connection to that exact run', async () => {
  let lists = 0, reads = 0;
  const result = await watchWorkflow(criteria, harness({
    listRuns: async () => ++lists === 1 ? [] : [{ ...run, status: 'in_progress', conclusion: null }],
    getRun: async id => { assert.equal(id, 42); if (++reads === 1) throw new Error('connection reset'); return run; },
  }));
  assert.equal(result.conclusion, 'success');
  assert.equal(lists, 2);
  assert.equal(reads, 2);
});
for (const conclusion of ['failure', 'cancelled', 'skipped', 'timed_out', 'neutral', null]) {
  test(`watcher rejects completed ${conclusion} runs instead of treating them as success`, async () => {
    await assert.rejects(watchWorkflow(criteria, harness({ listRuns: async () => [{ ...run, conclusion }] })), /did not succeed/);
  });
}
test('watcher rejects a changed revision after choosing a run', async () => {
  await assert.rejects(watchWorkflow(criteria, harness({
    listRuns: async () => [{ ...run, status: 'in_progress' }],
    getRun: async () => ({ ...run, headSha: 'wrong' }),
  })), /revision changed/);
});
test('watcher limits missing runs and permanently queued runs', async () => {
  await assert.rejects(watchWorkflow(criteria, harness({ listRuns: async () => [] })), /No matching/);
  await assert.rejects(watchWorkflow(criteria, harness({ listRuns: async () => [{ ...run, status: 'queued' }], getRun: async () => ({ ...run, status: 'queued' }) })), /observation deadline/);
});
test('watcher caps consecutive API failures and immediately rejects authorization errors', async () => {
  let calls = 0;
  await assert.rejects(watchWorkflow({ ...criteria, timeoutMs: 120_000 }, harness({ listRuns: async () => { calls++; throw new Error('offline'); } })), /bounded retries/);
  assert.equal(calls, 5);
  calls = 0;
  await assert.rejects(watchWorkflow(criteria, harness({ listRuns: async () => { calls++; const error = new Error('unauthorized'); error.permanent = true; throw error; } })), /bounded retries/);
  assert.equal(calls, 1);
});
test('watcher rejects unbounded or ambiguous configuration before calling the API', async () => {
  await assert.rejects(watchWorkflow({ since }, harness()), /Expected revision/);
  await assert.rejects(watchWorkflow({ ...criteria, timeoutMs: 0 }, harness()), /Positive polling/);
});
