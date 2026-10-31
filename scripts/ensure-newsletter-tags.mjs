import { readFileSync } from 'node:fs'
import { newsletterTagMigration } from './newsletterTagMigration.js'

const response = JSON.parse(readFileSync(process.argv[2], 'utf8'))
if (!Array.isArray(response) || response.some((result) => result.success === false || !Array.isArray(result.results))) {
  throw new Error('Unable to inspect the newsletter_subscribers schema')
}
const columns = response.flatMap((result) => result.results.map((column) => column.name))
process.stdout.write(newsletterTagMigration(columns))
