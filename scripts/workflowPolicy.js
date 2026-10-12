const pinnedAction = /@[0-9a-f]{40}$/
const strictShell = 'bash --noprofile --norc -euo pipefail {0}'
const mainGuard = "github.ref == 'refs/heads/main'"
const releaseGuard = "steps.eligibility.outputs.publish == 'true'"
const operational = new Set(['deploy.yml', 'collect-official-news.yml', 'create-new-project.yml', 'd1-backup.yml', 'send-planning-digest.yml', 'purge-cache.yml'])

export function auditWorkflow(name, workflow) {
  const errors = []
  const fail = message => errors.push(`${name}: ${message}`)
  if (!workflow || typeof workflow !== 'object') return [`${name}: missing workflow definition`]
  const composite = workflow.runs?.using === 'composite'
  if (!composite) {
    if (!workflow.permissions || typeof workflow.permissions !== 'object') fail('explicit token permissions are required')
    if (Object.hasOwn(workflow.on || {}, 'pull_request_target')) fail('pull_request_target must not run project code with privileged credentials')
    if (!workflow.concurrency?.group) fail('bounded concurrency group is required')
    if (workflow.defaults?.run?.shell !== strictShell) fail('strict Bash defaults are required')
    if (['ci.yml', 'deploy.yml'].includes(name) && workflow.on?.push?.['paths-ignore']) fail('main pushes must not skip audited document changes')
  }
  const jobs = composite ? { composite: { steps: workflow.runs.steps } } : workflow.jobs || {}
  for (const [id, job] of Object.entries(jobs)) {
    if (job.uses) {
      if (!job.uses.startsWith('./') && !pinnedAction.test(job.uses)) fail(`${id} reusable workflow must use an exact action revision`)
      continue
    }
    if (!composite) {
      if (job['runs-on'] !== 'ubuntu-24.04') fail(`${id} must use the reviewed ubuntu-24.04 runner`)
      if (!Number.isInteger(job['timeout-minutes']) || job['timeout-minutes'] < 1 || job['timeout-minutes'] > 180) fail(`${id} must have a bounded timeout`)
      if (operational.has(name) && job.if !== mainGuard) fail(`${id} operational job must be restricted to main`)
      if (job['continue-on-error'] && !(name === 'ci.yml' && id === 'monetization-report')) fail(`${id} required checks must not continue on error`)
    }
    for (const step of job.steps || []) {
      if (step.uses && !step.uses.startsWith('./') && !pinnedAction.test(step.uses)) fail(`${id} action must be pinned to a commit: ${step.uses}`)
      if (step.run && (step.shell || workflow.defaults?.run?.shell) !== strictShell) fail(`${id} run steps must use strict Bash`)
      if (step['continue-on-error'] && !(step.id === 'dependency-cache' && step.uses?.startsWith('actions/cache@'))) fail(`${id} required step must not continue on error`)
      if (/npm ci\b/.test(step.run || '')) fail(`${id} must use the shared bounded dependency installer`)
      if (name === 'send-planning-digest.yml' && /--retry/.test(step.run || '')) fail('mail submission must not be blindly retried')
      if (step.uses?.startsWith('actions/upload-artifact@') && name === 'd1-backup.yml') {
        const paths = String(step.with?.path || '').split('\n')
        if (paths.some(file => file.trim().endsWith('.sql'))) fail('backup upload must not include plaintext database exports')
      }
    }
  }
  if (name === 'deploy.yml') {
    const steps = jobs.deploy?.steps || []
    const configuration = steps.findIndex(step => step.id === 'configuration')
    const checks = steps.slice(0, configuration)
    for (const command of ['npm run lint', 'npm run typecheck', 'npm run audit:identity', 'npm run content:audit', 'npm run audit:metrics', 'npm run audit:archives', 'npm run test:coverage', 'npm run audit:build', 'npm run audit:schema', 'npm run verify:prerender', 'npm run audit:visual', 'npm run test:browser']) {
      if (!checks.some(step => step.if === releaseGuard && step.run?.split('\n').some(line => line.trim() === command))) fail(`production must pass ${command} before configuration/publication`)
    }
    if (!checks.some(step => step.if === releaseGuard && step.uses === './.github/actions/check-workflows')) fail('production must validate workflow definitions before publication')
    if (configuration < 0 || !steps.some(step => step.id === 'current' && step.run === 'bash scripts/release-head.sh')) fail('production must recheck the current main revision before publication')
  }
  if (name === 'ci.yml') {
    if (!jobs.browser || jobs.browser.needs !== 'build' || !jobs['ci-success']?.needs?.includes('browser')) fail('CI must require browser verification of the built artifact')
    const download = jobs.browser?.steps?.find(step => step.uses?.startsWith('actions/download-artifact@'))
    if (!download || download.with?.name !== 'dist-node22' || download.with['run-id'] || download.with.repository) fail('CI browser checks must use the build artifact from this workflow run')
  }
  return errors
}
