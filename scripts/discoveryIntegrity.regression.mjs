import test from 'node:test';
import assert from 'node:assert/strict';
import { auditDiscovery } from './discoveryIntegrity.js';

const sources = [{ id: 'city', url: 'https://city.example/news/' }];
const item = { id: 'a', title: 'Council notice', sourceId: 'city', url: 'https://city.example/news/posts/a', status: 'published', reviewRequired: false, sourcePublishedAt: null };
const audit = items => auditDiscovery({ version: 2, items }, sources);

test('discovery audit accepts explicit dates, undated and retained editorial records', () => {
  for (const status of ['published', 'pending-review', 'rejected', 'withdrawn'])
    assert.deepEqual(audit([{ ...item, status }]), []);
  assert.deepEqual(audit([{ ...item, sourcePublishedAt: '2026-09-21T23:30:00-04:00' }]), []);
});
test('discovery audit rejects corrupt snapshots, missing titles and duplicate identities', () => {
  assert.equal(auditDiscovery({}, sources).length, 1);
  assert.match(audit([null]).join(), /Invalid discovery/);
  assert.match(audit([{ ...item, title: '' }]).join(), /no title/);
  const errors = audit([item, item]).join();
  assert.match(errors, /Duplicate or missing discovery ID/);
  assert.match(errors, /Duplicate discovery URL/);
});
test('discovery audit blocks unapproved sources, insecure URLs and off-origin articles', () => {
  assert.match(audit([{ ...item, sourceId: 'unknown' }]).join(), /unapproved source/);
  for (const url of ['http://city.example/news/a', 'https://other.example/news/a', 'https://user@city.example/news/a', 'https://city.example:444/news/a', 'javascript:alert(1)', 'invalid'])
    assert.match(audit([{ ...item, url }]).join(), /source URL/);
});
test('discovery audit rejects invalid publication dates and ambiguous review states', () => {
  for (const sourcePublishedAt of ['2026-02-30', '2026-13-01', 'yesterday', 42])
    assert.match(audit([{ ...item, sourcePublishedAt }]).join(), /publication date/);
  assert.match(audit([{ ...item, status: 'unknown' }]).join(), /review state/);
  assert.match(audit([{ ...item, reviewRequired: undefined }]).join(), /review state/);
});
