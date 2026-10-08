import { readFileSync, statSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export function validateBuild({ directory, revision, publication, routes, photos = [] }) {
  const root = realpathSync(directory);
  const checked = new Set();
  function file(relative) {
    if (typeof relative !== 'string' || path.isAbsolute(relative) || relative.split(/[\\/]/).includes('..')) throw new Error('Unsafe build asset path');
    const resolved = path.resolve(root, relative);
    if (!resolved.startsWith(root + path.sep)) throw new Error('Build asset escapes output directory');
    if (!checked.has(relative)) {
      let actual, stat;
      try { actual = realpathSync(resolved); stat = statSync(actual); }
      catch { throw new Error(`Missing build file: ${relative}`); }
      if (!actual.startsWith(root + path.sep) || !stat.isFile() || stat.size === 0) throw new Error(`Invalid or empty build file: ${relative}`);
      checked.add(relative);
    }
    return resolved;
  }
  const json = name => JSON.parse(readFileSync(file(name), 'utf8'));
  const release = json('release.json');
  const context = json('render-context.json');
  if (!/^[0-9a-f]{40}$/.test(revision) || release.sha !== revision) throw new Error('Build release revision does not match checkout');
  if (!Number.isFinite(Date.parse(release.renderedAt)) || release.renderedAt !== context.renderedAt) throw new Error('Build render context is invalid or inconsistent');
  const snapshot = createHash('sha256').update(JSON.stringify(publication)).digest('hex');
  if (release.snapshotHash !== snapshot || release.records !== publication.length) throw new Error('Build publication snapshot does not match source records');
  const manifest = json('.vite/manifest.json');
  if (!manifest['index.html']?.isEntry) throw new Error('Client build entry is missing');
  for (const [key, entry] of Object.entries(manifest)) {
    file(entry.file);
    for (const asset of [...(entry.css || []), ...(entry.assets || [])]) file(asset);
    for (const dependency of [...(entry.imports || []), ...(entry.dynamicImports || [])]) {
      if (!Object.hasOwn(manifest, dependency)) throw new Error(`Unresolved build dependency: ${key} -> ${dependency}`);
    }
  }
  for (const route of routes) {
    if (!route.startsWith('/') || route.includes('..')) throw new Error('Invalid prerender route');
    const relative = route === '/' ? 'index.html' : route === '/404' ? '404.html' : route.slice(1) + '/index.html';
    const html = readFileSync(file(relative), 'utf8');
    if (!html.includes(`data-prerender-route="${route}"`) || /\/src\/main\.jsx|vite-error-overlay/.test(html)) throw new Error(`Invalid prerender output: ${route}`);
    if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Prerender route needs exactly one main heading: ${route}`);
    for (const match of html.matchAll(/(?:src|href)=["']\/(assets\/[^"'?#]+|images\/[^"'?#]+)(?:[?#][^"']*)?["']/g)) file(match[1]);
  }
  for (const photo of photos) {
    file(photo.src.replace(/^\//, ''));
    for (const candidate of (photo.srcSet || '').split(',').filter(Boolean)) file(candidate.trim().split(/\s+/)[0].replace(/^\//, ''));
  }
  for (const required of ['_headers', 'sitemap.xml', 'planning-alert-feed.json', 'site.webmanifest']) file(required);
  return { files: checked.size, routes: routes.length, records: publication.length };
}
