import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { publishCandidate } from './candidatePublication.js';
const [base, candidate] = process.argv.slice(2);
if (!/^[0-9a-f]{40}$/.test(base || '') || !/^[0-9a-f]{40}$/.test(candidate || '')) throw new Error('Exact validated base and candidate revisions are required');
const execute = promisify(execFile);
const published = await publishCandidate({ base, candidate }, async args => {
  const { stdout } = await execute('git', args, { timeout: 60_000, maxBuffer: 1024 * 1024 });
  return stdout.trim();
});
console.log(published ? 'Validated candidate is present on main.' : 'Main advanced; candidate needs fresh validation.');
if (!published) process.exitCode = 2;
