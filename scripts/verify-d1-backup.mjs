import { readFileSync } from 'node:fs'
import { verifyD1Export } from './d1Backup.js'

try {
  if (process.argv.length !== 3) throw new Error('One database export path is required')
  const result = verifyD1Export(readFileSync(process.argv[2], 'utf8'))
  console.log(`Database export restore verified: ${result.tables} tables; SQLite integrity and foreign keys passed.`)
} catch {
  console.error('::error::Database export failed local restore validation; refusing to publish a backup.')
  process.exitCode = 1
}
