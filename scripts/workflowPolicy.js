const pinnedAction = /@[0-9a-f]{40}$/
const strictShell = 'bash --noprofile --norc -euo pipefail {0}'
const mainGuard = "github.ref == 'refs/heads/main'"
const releaseGuard = "steps.eligibility.outputs.publish == 'true'"
const operational = new Set(['deploy.yml', 'collect-official-news.yml', 'create-new-project.yml', 'd1-backup.yml', 'send-planning-digest.yml', 'purge-cache.yml'])
const hasCommand = (step, command) => step.run?.split('\n').some(line => line.trim() === command)

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
    if (['ci.yml', 'deploy.yml'].includes(name)) {
      if (!workflow.on?.push?.branches?.includes('main') || workflow.on.push.paths || workflow.on.push['paths-ignore']) fail('main pushes must not skip audited document changes')
    }
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
      if (step.uses?.startsWith('actions/checkout@') && name !== 'collect-official-news.yml' && step.with?.['persist-credentials'] !== false) fail(`${id} read-only checkout must not persist credentials`)
      if (step.run && (step.shell || workflow.defaults?.run?.shell) !== strictShell) fail(`${id} run steps must use strict Bash`)
      if (step['continue-on-error'] && !(step.id === 'dependency-cache' && step.uses?.startsWith('actions/cache@'))) fail(`${id} required step must not continue on error`)
      if (/npm ci\b/.test(step.run || '')) fail(`${id} must use the shared bounded dependency installer`)
      if (name === 'send-planning-digest.yml' && /--retry/.test(step.run || '')) fail('mail submission must not be blindly retried')
      if (step.uses?.startsWith('actions/upload-artifact@') && name === 'd1-backup.yml') {
        const allowed = new Set(['backup/stcatharinesdigital.sql.enc', 'backup/SHA256SUMS', 'backup/metadata.json'])
        const paths = String(step.with?.path || '').split('\n').map(file => file.trim()).filter(Boolean)
        if (paths.length !== allowed.size || paths.some(file => !allowed.delete(file)) || allowed.size) fail('backup upload must allow only ciphertext, checksum and metadata; plaintext exports must never be included')
        if (step.if || step.with?.['if-no-files-found'] !== 'error') fail('backup upload must require a successful export and verified files')
      }
    }
  }
  if (name === 'deploy.yml') {
    const steps = jobs.deploy?.steps || []
    const configuration = steps.findIndex(step => step.id === 'configuration')
    const checks = steps.slice(0, configuration)
    for (const command of ['npm run lint', 'npm run typecheck', 'npm run audit:identity', 'npm run content:audit', 'npm run audit:metrics', 'npm run audit:archives', 'node --test scripts/*.regression.mjs', 'npm test', 'npm run test:coverage', 'npm run build', 'npm run budget:bundle', 'npm run audit:build', 'npm run audit:schema', 'npm run verify:prerender', 'npm run audit:visual', 'npm run test:browser']) {
      if (!checks.some(step => step.if === releaseGuard && hasCommand(step, command))) fail(`production must pass ${command} before configuration/publication`)
    }
    if (!checks.some(step => step.if === releaseGuard && step.uses === './.github/actions/check-workflows')) fail('production must validate workflow definitions before publication')
    const current = steps.findIndex(step => step.id === 'current' && step.if === "steps.configuration.outputs.publish == 'true'" && step.run === 'bash scripts/release-head.sh')
    const publication = steps.findIndex(step => step.id === 'deploy' && step.if === "steps.current.outputs.publish == 'true'" && step.uses?.startsWith('cloudflare/wrangler-action@'))
    if (configuration < 0 || steps[configuration]?.if !== releaseGuard || steps[configuration]?.run !== 'bash scripts/release-head.sh' || current <= configuration || publication <= current) fail('production must recheck the current main revision before configuration and publication')
    if (!steps.slice(publication + 1).some(step => step.if === "steps.current.outputs.publish == 'true'" && step.run === 'node scripts/verify-release.js')) fail('production must verify the live revision after publication')
  }
  if (name === 'ci.yml') {
    const commands = ['npm test', 'npm run test:coverage', 'node --test scripts/*.regression.mjs', 'npm run content:audit', 'npm run audit:metrics', 'npm run audit:identity', 'npm run lint', 'npm run typecheck', 'npm run audit:workflows', 'npm run audit:archives']
    const matrix = jobs.test?.strategy?.matrix?.include || []
    if (commands.some(command => !matrix.some(suite => suite.command === command)) || jobs.test?.if || !jobs.test?.steps?.some(step => !step.if && step.run === '${{ matrix.command }}')) fail('CI must run every mandatory quality suite without conditional skips')
    for (const id of ['build', 'browser']) {
      if (!jobs[id] || jobs[id].if) fail(`CI ${id} must not conditionally skip required checks`)
    }
    for (const command of ['npm run build', 'npm run audit:build', 'npm run budget:bundle', 'npm run verify:prerender', 'npm run audit:schema']) {
      if (!jobs.build?.steps?.some(step => !step.if && hasCommand(step, command))) fail(`CI build must pass ${command}`)
    }
    for (const command of ['npm run audit:build', 'npm run audit:visual', 'npm run test:browser']) {
      if (!jobs.browser?.steps?.some(step => !step.if && hasCommand(step, command))) fail(`CI browser must pass ${command}`)
    }
    if (jobs.build?.needs !== 'test' || jobs['ci-success']?.if !== 'always()' || !['test', 'build', 'browser'].every(id => jobs['ci-success']?.needs?.includes(id))) fail('CI aggregate must always require every mandatory stage')
    if (!jobs.browser || jobs.browser.needs !== 'build' || !jobs['ci-success']?.needs?.includes('browser')) fail('CI must require browser verification of the built artifact')
    const download = jobs.browser?.steps?.find(step => step.uses?.startsWith('actions/download-artifact@'))
    if (!download || download.with?.name !== 'dist-node22' || download.with['run-id'] || download.with.repository) fail('CI browser checks must use the build artifact from this workflow run')
  }
  if (name === 'd1-backup.yml') {
    const steps = jobs.backup?.steps || []
    const exportStep = steps.find(step => step.name === 'Export and encrypt D1 data')
    const lines = exportStep?.run?.split('\n').map(line => line.trim()) || []
    const restore = lines.indexOf('node scripts/verify-d1-backup.mjs backup/stcatharinesdigital.sql')
    const encryption = lines.findIndex(line => line.startsWith('openssl enc -aes-256-cbc '))
    if (exportStep?.if || !lines.includes('npx --no-install wrangler d1 export stcatharinesdigital_d1 --remote --skip-confirmation --output backup/stcatharinesdigital.sql') || restore < 0 || encryption <= restore) fail('backup must export noninteractively and verify SQL restore before encryption')
    const decryption = lines.findIndex(line => line.startsWith('openssl enc -d -aes-256-cbc '))
    const comparison = lines.indexOf('cmp backup/stcatharinesdigital.sql "$RUNNER_TEMP/backup-verify.sql"')
    if (decryption <= encryption || comparison <= decryption) fail('backup must verify decryption against the restored export')
    const uploads = steps.filter(step => step.uses?.startsWith('actions/upload-artifact@'))
    if (uploads.length !== 1 || steps.indexOf(uploads[0]) <= steps.indexOf(exportStep)) fail('backup must publish exactly one encrypted artifact after verification')
  }
  if (name === 'send-planning-digest.yml') {
    const steps = jobs.send?.steps || []
    const schedule = steps.findIndex(step => step.id === 'schedule' && !step.if && step.run === 'node scripts/check-digest-schedule.mjs')
    const submission = steps.findIndex(step => step.name === 'Submit planning digest' && step.if === "steps.schedule.outputs.send == 'true'")
    if (schedule < 0 || submission <= schedule) fail('digest must check the delivery window and receipts before submission')
    if (workflow.env?.CRON_SECRET || jobs.send?.env?.CRON_SECRET || steps.some(step => step.name !== 'Submit planning digest' && step.env?.CRON_SECRET)) fail('digest credentials must be scoped only to submission')
  }
  return errors
}
