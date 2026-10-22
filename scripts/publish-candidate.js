import { execFile } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import { publishCandidate } from './candidatePublication.js';

export const MAIN_REPOSITORY_SSH = 'git@github.com:galaxycoils/computerexpress-darius-site.git';

// Published GitHub host keys and SHA256 fingerprints from https://api.github.com/meta.
export const GITHUB_SSH_FINGERPRINTS = {
  SHA256_ECDSA: 'p2QAMXNIC1TJYWeIOttrVc98/R1BUFWu3/LiyKgUfQM',
  SHA256_ED25519: '+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU',
  SHA256_RSA: 'uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s',
};

const GITHUB_SSH_KNOWN_HOSTS = `github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
`;

const MISSING_DEPLOY_KEY = 'COLLECTOR_DEPLOY_KEY is missing. Publishing the verified candidate to main requires the private half of the write-enabled ed25519 deploy key in that repository secret. Candidate branches still use GITHUB_TOKEN. Allow only that DeployKey actor to bypass the main ruleset.';

function shellQuote(value) {
  return `'${String(value).replaceAll("'", `'\\''`)}'`;
}

function deployKeyMaterial(env = process.env) {
  const raw = env.COLLECTOR_DEPLOY_KEY;
  if (typeof raw !== 'string' || raw.trim() === '') throw new Error(MISSING_DEPLOY_KEY);
  let material = raw;
  if (!material.includes('\n') && material.includes('\\n')) material = material.replaceAll('\\n', '\n');
  if (!material.endsWith('\n')) material += '\n';
  if (/^\s*ssh-(?:ed25519|rsa|dss)\s/.test(material)) {
    throw new Error('COLLECTOR_DEPLOY_KEY must be the private OpenSSH key. The configured value is the public deploy key.');
  }
  if (!material.includes('PRIVATE KEY')) {
    throw new Error('COLLECTOR_DEPLOY_KEY is not an OpenSSH private key. Paste the private half, including the BEGIN and END lines, into the repository secret.');
  }
  return material;
}

function openDeployKey(material) {
  const directory = mkdtempSync(path.join(tmpdir(), 'collector-deploy-key-'));
  const keyPath = path.join(directory, 'collector_deploy_key');
  const knownHostsPath = path.join(directory, 'known_hosts');
  try {
    writeFileSync(keyPath, material, { mode: 0o600 });
    chmodSync(keyPath, 0o600);
    chmodSync(directory, 0o700);
    writeFileSync(knownHostsPath, GITHUB_SSH_KNOWN_HOSTS, { mode: 0o644 });
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }
  const command = [
    'ssh',
    '-i', shellQuote(keyPath),
    '-o', 'IdentitiesOnly=yes',
    '-o', 'BatchMode=yes',
    '-o', 'StrictHostKeyChecking=yes',
    '-o', `UserKnownHostsFile=${shellQuote(knownHostsPath)}`,
  ].join(' ');
  return {
    command,
    cleanup() { rmSync(directory, { recursive: true, force: true }); },
  };
}

function failureText(error) {
  const parts = [];
  const visit = (value, depth) => {
    if (!value || depth > 4) return;
    if (typeof value === 'string') {
      parts.push(value);
      return;
    }
    if (typeof value.message === 'string') parts.push(value.message);
    for (const stream of ['stderr', 'stdout']) {
      if (typeof value[stream] === 'string') parts.push(value[stream]);
      else if (value[stream]) parts.push(String(value[stream]));
    }
    visit(value.cause, depth + 1);
  };
  visit(error, 0);
  return parts.join('\n');
}

export async function runPublishCandidate({ base, candidate, env = process.env, git }) {
  const material = deployKeyMaterial(env);
  const ssh = openDeployKey(material);
  try {
    return await publishCandidate({ base, candidate, pushRemote: MAIN_REPOSITORY_SSH }, async (args, options = {}) => {
      if (args[0] === 'push' && args[1] !== MAIN_REPOSITORY_SSH) {
        throw new Error('Refusing to publish main without the deploy-key remote');
      }
      const childEnv = { ...env, GIT_SSH_COMMAND: ssh.command };
      delete childEnv.COLLECTOR_DEPLOY_KEY;
      const gitOptions = args[0] === 'push' ? { ...options, env: childEnv } : options;
      return git(args, gitOptions);
    });
  } catch (error) {
    if (/GH013|repository rule violations/i.test(failureText(error))) {
      throw new Error('Publication to main was refused (GH013). COLLECTOR_DEPLOY_KEY must be the private half of a write-enabled deploy key, and the main ruleset must allow that DeployKey actor to bypass required pull requests and status checks. Pushes with GITHUB_TOKEN or a personal token are refused on purpose.', { cause: error });
    }
    throw error;
  } finally {
    ssh.cleanup();
  }
}

function invokedAsCli() {
  const entry = process.argv[1];
  return Boolean(entry) && import.meta.url === pathToFileURL(entry).href;
}

if (invokedAsCli()) {
  const [base, candidate] = process.argv.slice(2);
  if (!/^[0-9a-f]{40}$/.test(base || '') || !/^[0-9a-f]{40}$/.test(candidate || '')) {
    console.error('Exact validated base and candidate revisions are required');
    process.exitCode = 1;
  } else {
    const execute = promisify(execFile);
    try {
      const published = await runPublishCandidate({
        base,
        candidate,
        git: async (args, options = {}) => {
          const { stdout } = await execute('git', args, {
            timeout: 60_000,
            maxBuffer: 1024 * 1024,
            env: options.env,
          });
          return stdout.trim();
        },
      });
      console.log(published ? 'Validated candidate is present on main.' : 'Main advanced; candidate needs fresh validation.');
      if (!published) process.exitCode = 2;
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}
