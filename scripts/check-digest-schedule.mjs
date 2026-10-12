import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { appendFileSync } from 'node:fs'
import { scheduledDigestDecision } from './digestSchedule.js'

const execute = promisify(execFile)
async function read(args) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await execute('gh', args, { timeout: 30000, maxBuffer: 1024 * 1024 })
      return JSON.parse(result.stdout)
    } catch (error) {
      if (attempt === 2 || /HTTP (401|403)|Bad credentials|Resource not accessible/i.test(error.stderr || '')) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt))
    }
  }
}

let decision
if (process.env.TRIGGER === 'schedule') {
  decision = await scheduledDigestDecision({ now: new Date(), runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT, repository: process.env.GITHUB_REPOSITORY, read })
} else if (process.env.TRIGGER === 'workflow_dispatch') decision = { send: true, reason: 'Manual digest invocation.' }
else throw new Error('Digest submission requires a scheduled or explicit manual invocation')
appendFileSync(process.env.GITHUB_OUTPUT, `send=${decision.send}\n`)
appendFileSync(process.env.GITHUB_STEP_SUMMARY, decision.reason + '\n')
console.log(decision.reason)
