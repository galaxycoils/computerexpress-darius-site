import { readdirSync, readFileSync } from 'node:fs'
import { parseDocument } from 'yaml'
import { auditWorkflow } from './workflowPolicy.js'

const files = readdirSync('.github/workflows').filter(name => /\.ya?ml$/.test(name)).map(name => `.github/workflows/${name}`)
for (const directory of readdirSync('.github/actions', { withFileTypes: true }).filter(entry => entry.isDirectory())) files.push(`.github/actions/${directory.name}/action.yml`)
const errors = []
for (const file of files) {
  const document = parseDocument(readFileSync(file, 'utf8'), { uniqueKeys: true })
  if (document.errors.length) errors.push(...document.errors.map(error => `${file}: ${error.message}`))
  else errors.push(...auditWorkflow(file.split('/').pop(), document.toJS()))
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else console.log(`Workflow policy passed: ${files.length} workflow/action definitions.`)
