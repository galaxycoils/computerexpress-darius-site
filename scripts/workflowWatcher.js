const terminalFailures = new Set(['failure', 'cancelled', 'timed_out', 'action_required', 'startup_failure', 'skipped', 'stale', 'neutral']);

export function selectWorkflowRun(runs, { sha, title, since }) {
  const cutoff = Date.parse(since);
  if (!Number.isFinite(cutoff)) throw new Error('A valid dispatch timestamp is required');
  return runs.filter(run =>
    run.event === 'workflow_dispatch' &&
    Date.parse(run.createdAt) >= cutoff &&
    (!sha || run.headSha === sha) &&
    (!title || run.displayTitle === title),
  ).sort((a, b) => Number(b.databaseId) - Number(a.databaseId))[0];
}

// Poll one exact run after discovery; a dropped connection never means the job failed.
export async function watchWorkflow({ sha, title, since, timeoutMs = 45 * 60_000, pollMs = 10_000 }, {
  listRuns,
  getRun,
  now = Date.now,
  wait = ms => new Promise(resolve => setTimeout(resolve, ms)),
  log = console.log,
}) {
  if ((!sha && !title) || !Number.isFinite(Date.parse(since))) throw new Error('Expected revision or title and dispatch timestamp are required');
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0 || !Number.isFinite(pollMs) || pollMs <= 0) throw new Error('Positive polling and timeout limits are required');
  const deadline = now() + timeoutMs;
  let selected;
  let failures = 0;
  let previousStatus;
  while (now() < deadline) {
    let run;
    try {
      run = selected ? await getRun(selected.databaseId) : selectWorkflowRun(await listRuns(), { sha, title, since });
      failures = 0;
    } catch (error) {
      if (error.permanent || ++failures >= 5) throw new Error('Unable to read workflow status after bounded retries', { cause: error });
      await wait(Math.max(0, Math.min(30_000, 5000 * 2 ** (failures - 1), deadline - now())));
      continue;
    }
    if (run) {
      if (!selected) selected = run;
      if (sha && run.headSha !== sha) throw new Error('Workflow revision changed while waiting');
      if (run.status !== previousStatus) {
        log(`Workflow ${selected.databaseId}: ${run.status}`);
        previousStatus = run.status;
      }
      if (run.status === 'completed') {
        if (run.conclusion !== 'success') {
          const detail = terminalFailures.has(run.conclusion) ? run.conclusion : 'unexpected conclusion';
          throw new Error(`Workflow ${selected.databaseId} did not succeed: ${detail}`);
        }
        return run;
      }
    }
    await wait(Math.max(0, Math.min(pollMs, deadline - now())));
  }
  throw new Error(selected ? `Workflow ${selected.databaseId} exceeded its observation deadline` : 'No matching workflow run appeared before the deadline');
}
