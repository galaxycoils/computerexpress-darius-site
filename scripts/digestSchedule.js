const clock = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit',
  weekday: 'short', hour: '2-digit', hourCycle: 'h23',
})

// GitHub cron can start hours late. Allow Thursday 06:00 through Friday 05:59
// Toronto time, while treating both UTC/DST slots as one weekly submission.
export function digestWindow(now) {
  const parts = Object.fromEntries(clock.formatToParts(now).map(part => [part.type, part.value]))
  if (!((parts.weekday === 'Thu' && Number(parts.hour) >= 6) || (parts.weekday === 'Fri' && Number(parts.hour) < 6))) return null
  const day = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)))
  if (parts.weekday === 'Fri') day.setUTCDate(day.getUTCDate() - 1)
  return day.toISOString().slice(0, 10)
}

export function alreadySubmitted(jobs, window) {
  return jobs.some(job => job.steps?.some(step =>
    step.name === 'Submit planning digest' && step.conclusion === 'success' &&
    step.started_at && digestWindow(new Date(step.started_at)) === window,
  ))
}

export function uncertainSubmission(jobs, window) {
  return jobs.some(job => job.steps?.some(step =>
    step.name === 'Submit planning digest' && step.started_at &&
    !['success', 'skipped'].includes(step.conclusion) &&
    digestWindow(new Date(step.started_at)) === window,
  ))
}

export async function scheduledDigestDecision({ now, runId, runAttempt = 1, repository, read }) {
  const window = digestWindow(now)
  if (!window) {
    const parts = Object.fromEntries(clock.formatToParts(now).map(part => [part.type, part.value]))
    if (parts.weekday === 'Thu' && Number(parts.hour) < 6) return { send: false, reason: 'Early DST slot; the Toronto 6 AM window has not opened.' }
    throw new Error('Scheduled digest missed its 24-hour delivery window. Inspect delivery records before a manual invocation.')
  }
  const runs = await read(['run', 'list', '--workflow', 'send-planning-digest.yml', '--event', 'schedule', '--limit', '20', '--json', 'databaseId,createdAt,status'])
  for (const run of runs) {
    const ownRerun = String(run.databaseId) === runId && Number(runAttempt) > 1
    if ((!ownRerun && (String(run.databaseId) === runId || run.status !== 'completed')) || run.createdAt < window) continue
    const response = await read(['api', `repos/${repository}/actions/runs/${run.databaseId}/jobs?filter=all&per_page=100`])
    if (uncertainSubmission(response.jobs || [], window)) throw new Error(`Digest ${window} was already attempted by run ${run.databaseId} without confirmed completion. Inspect delivery records before a manual retry.`)
    if (alreadySubmitted(response.jobs || [], window)) return { send: false, reason: `Weekly digest ${window} was already submitted successfully by run ${run.databaseId}.` }
  }
  return { send: true, reason: `Eligible weekly digest window: ${window}.` }
}
