import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { validateBuild } from './buildIntegrity.js';
import { getPublication } from '../src/data/publication.js';
import { prerenderRoutes } from '../src/data/routeManifest.js';
import { localPhotos } from '../src/data/localPhotos.js';
import { getReleaseRenderNow } from './releaseVerification.js';
const release = JSON.parse(readFileSync('dist/release.json', 'utf8'));
const result = validateBuild({
  directory: 'dist',
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  publication: getPublication(getReleaseRenderNow(release)),
  routes: prerenderRoutes,
  photos: Object.values(localPhotos),
});
console.log(`Build integrity passed: ${result.files} files, ${result.routes} prerendered routes, ${result.records} source records.`);
