import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchVerifiedText } from './verifiedFetch.js';
const matches = text => text.includes('current content');
const options = { wait: async () => {} };

test('verification retries transport failures and uses a fresh timeout each time', async () => {
  const requests = [];
  const text = await fetchVerifiedText('https://example.com', matches, {
    ...options,
    fetchImpl: async (_, request) => {
      requests.push(request);
      if (requests.length === 1) throw new TypeError('Connection reset');
      return new Response('current content');
    },
  });
  assert.equal(text, 'current content');
  assert.equal(requests.length, 2);
  assert.notEqual(requests[0].signal, requests[1].signal);
  assert.ok(requests.every(r => r.cache === 'no-store'));
});

test('verification recovers from transient server errors and stale edge content', async () => {
  const responses = [new Response('unavailable', { status: 503 }), new Response('old content'), new Response('current content')];
  let calls = 0;
  await fetchVerifiedText('https://example.com', matches, { ...options, fetchImpl: async () => responses[calls++] });
  assert.equal(calls, 3);
});

test('verification does not retry permanent authorization errors', async () => {
  let calls = 0;
  await assert.rejects(fetchVerifiedText('https://example.com', matches, {
    ...options, fetchImpl: async () => { calls++; return new Response('forbidden', { status: 403 }); },
  }), /HTTP 403/);
  assert.equal(calls, 1);
});

test('verification remains a failure when the expected content never arrives', async () => {
  let calls = 0;
  await assert.rejects(fetchVerifiedText('https://example.com', matches, {
    ...options, fetchImpl: async () => { calls++; return new Response('stale content'); },
  }), /Expected published content missing/);
  assert.equal(calls, 3);
});

test('verification rejects invalid retry configuration before requesting anything', async () => {
  await assert.rejects(fetchVerifiedText('https://example.com', matches, { attempts: 0 }), /positive integer/);
});
