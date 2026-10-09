import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateBuild } from './buildIntegrity.js';
function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), 'build-check-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const put = (name, data) => { const target = path.join(directory, name);mkdirSync(path.dirname(target), { recursive: true });writeFileSync(target, typeof data === 'string' ? data : JSON.stringify(data)); };
  const revision = 'a'.repeat(40), publication = [{ title: 'record' }];
  const release = { sha: revision, renderedAt: '2026-10-08T12:00:00Z', records: 1, snapshotHash: createHash('sha256').update(JSON.stringify(publication)).digest('hex') };
  put('release.json', release);put('render-context.json', { renderedAt: release.renderedAt });
  put('.vite/manifest.json', { 'index.html': { file: 'assets/main.js', isEntry: true, dynamicImports: ['lazy'] }, lazy: { file: 'assets/lazy.js' } });
  put('assets/main.js', 'client');put('assets/lazy.js', 'lazy');
  put('index.html', '<div data-prerender-route="/"><h1>Home</h1><script src="/assets/main.js"></script></div>');
  for (const name of ['_headers', 'sitemap.xml', 'planning-alert-feed.json', 'site.webmanifest']) put(name, 'content');
  return { directory, revision, publication, routes: ['/'], put, release };
}
test('complete release validates all routes, source metadata and lazy assets', t => {
  const f = fixture(t);assert.equal(validateBuild(f).routes, 1);
});
test('missing lazy chunks are rejected before deployment', t => {
  const f = fixture(t);rmSync(path.join(f.directory, 'assets/lazy.js'));
  assert.throws(() => validateBuild(f), /Missing build file/);
});
test('missing prerender pages and mismatched route markup are rejected', t => {
  const f = fixture(t);assert.throws(() => validateBuild({ ...f, routes: ['/', '/news'] }), /Missing build file/);
  f.put('index.html', '<div data-prerender-route="/news"><h1>Wrong page</h1></div>');assert.throws(() => validateBuild(f), /Invalid prerender/);
});
test('source or checkout mismatches cannot be mistaken for a valid release', t => {
  const f = fixture(t);assert.throws(() => validateBuild({ ...f, revision: 'b'.repeat(40) }), /revision/);
  assert.throws(() => validateBuild({ ...f, publication: [] }), /snapshot/);
  f.put('render-context.json', { renderedAt: '2026-10-08T13:00:00Z' });assert.throws(() => validateBuild(f), /context/);
});
test('manifest traversal and unresolved dependencies are rejected', t => {
  const f = fixture(t);f.put('.vite/manifest.json', { 'index.html': { file: '../outside.js', isEntry: true } });assert.throws(() => validateBuild(f), /Unsafe/);
  f.put('.vite/manifest.json', { 'index.html': { file: 'assets/main.js', isEntry: true, imports: ['unknown'] } });assert.throws(() => validateBuild(f), /Unresolved/);
});
test('empty assets, development HTML and duplicated headings fail validation', t => {
  const f = fixture(t);f.put('assets/main.js', '');assert.throws(() => validateBuild(f), /empty/);f.put('assets/main.js', 'client');
  f.put('index.html', '<div data-prerender-route="/"><h1>Home</h1><script src="/src/main.jsx"></script></div>');assert.throws(() => validateBuild(f), /Invalid prerender/);
  f.put('index.html', '<div data-prerender-route="/"><h1>Home</h1><h1>Duplicate</h1></div>');assert.throws(() => validateBuild(f), /one main heading/);
});
test('missing responsive photo variants fail validation', t => {
  const f = fixture(t);f.put('images/photo.webp', 'image');
  assert.throws(() => validateBuild({ ...f, photos: [{ src: '/images/photo.webp', srcSet: '/images/photo-480.webp 480w' }] }), /photo-480/);
});
