const permanent = /\b(?:EUSAGE|ERESOLVE|EBADENGINE|E401|E403|E404)\b|\b(?:401 Unauthorized|403 Forbidden|404 Not Found)\b/i
const transient = /\b(?:ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|ECONNREFUSED|EINTEGRITY|TAR_BAD_ARCHIVE|E429|E502|E503|E504)\b|\b429 Too Many|\b(?:500|502|503|504)\s+(?:Internal|Bad|Service|Gateway)/i

// Retry dependency transport/cache failures only. Invalid locks, incompatible
// engines and authorization errors must remain immediate failures.
export async function installLockedDependencies({ install, wait, log = console.log, attempts = 3 }) {
  if (!Number.isInteger(attempts) || attempts < 1 || attempts > 3) throw new Error('Install attempts must be between one and three')
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const result = await install({ attempt, freshCache: attempt > 1 })
    if (result.code === 0) return
    const detail = result.output || ''
    if (attempt === attempts || permanent.test(detail) || !(result.timedOut || transient.test(detail))) {
      throw new Error(`Locked dependency installation failed on attempt ${attempt}`, { cause: result })
    }
    log(`Dependency transport/cache failure; retrying with an isolated cache (${attempt + 1}/${attempts}).`)
    await wait(1000 * 2 ** (attempt - 1))
  }
}
