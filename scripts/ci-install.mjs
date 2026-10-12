import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { installLockedDependencies } from './ciInstall.js'

const execute = promisify(execFile)
const caches = []
try {
  await installLockedDependencies({
    wait: ms => new Promise(resolve => setTimeout(resolve, ms)),
    async install({ freshCache }) {
      const args = ['ci', '--no-audit', '--no-fund', '--fetch-retries=3', '--fetch-retry-mintimeout=1000', '--fetch-retry-maxtimeout=10000']
      if (freshCache) {
        const cache = await mkdtemp(path.join(tmpdir(), 'ci-npm-cache-'))
        caches.push(cache)
        args.push('--cache', cache, '--prefer-online')
      }
      try {
        const result = await execute('npm', args, { timeout: 120_000, maxBuffer: 4 * 1024 * 1024 })
        process.stdout.write(result.stdout)
        process.stderr.write(result.stderr)
        return { code: 0 }
      } catch (error) {
        const output = `${error.stdout || ''}\n${error.stderr || ''}`
        process.stderr.write(output)
        return { code: error.code || 1, timedOut: error.killed === true, output }
      }
    },
  })
} catch (error) {
  console.error(`::error::${error.message}`)
  process.exitCode = 1
} finally {
  for (const cache of caches) await rm(cache, { recursive: true, force: true })
}
