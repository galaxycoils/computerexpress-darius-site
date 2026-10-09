import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { watchWorkflow } from './workflowWatcher.js';
const execute = promisify(execFile);
const allowed = new Set(['workflow', 'branch', 'sha', 'title', 'since']);
const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  const name = process.argv[index].replace(/^--/, '');
  const value = process.argv[index + 1];
  if (!allowed.has(name) || !value || Object.hasOwn(options, name)) throw new Error('Invalid workflow watcher arguments');
  options[name] = value;
}
if (!options.workflow || !options.branch) throw new Error('Workflow and branch are required');
async function read(args) {
  try {
    const { stdout } = await execute('gh', args, { timeout: 30_000, maxBuffer: 1024 * 1024 });
    return JSON.parse(stdout);
  } catch (error) {
    const detail = error.stderr || '';
    const rateLimited = /rate limit|secondary limit/i.test(detail);
    error.permanent = !rateLimited && /HTTP (?:401|403)|authentication|Resource not accessible|Bad credentials/i.test(detail);
    throw error;
  }
}
const run = await watchWorkflow(options, {
  listRuns: () => read(['run', 'list', '--workflow', options.workflow, '--branch', options.branch, '--event', 'workflow_dispatch', '--limit', '50', '--json', 'databaseId,headSha,displayTitle,createdAt,event,status,conclusion,url']),
  getRun: id => read(['run', 'view', String(id), '--json', 'databaseId,headSha,status,conclusion,url']),
});
console.log(`Verified successful workflow: ${run.url}`);
