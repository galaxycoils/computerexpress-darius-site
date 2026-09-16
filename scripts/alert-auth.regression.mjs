import test from 'node:test'
import assert from 'node:assert/strict'
import { createAlertToken, verifyAlertToken } from '../functions/api/alerts/_auth.js'

test('signed alert tokens verify and expose only their identity metadata', async () => {
  const token = await createAlertToken('12345678-1234-1234-1234-123456789012', 1700000000000, 'test-secret', 'verify', 1700000000000)
  assert.deepEqual(await verifyAlertToken(token, 'test-secret', 1700000001000), {
    id: '12345678-1234-1234-1234-123456789012',
    createdAt: 1700000000000,
    scope: 'verify',
    issuedAt: 1700000000000,
  })
  assert.equal(await verifyAlertToken(token, 'wrong-secret', 1700000001000), null)
})
test('tampered and expired alert tokens are rejected', async () => {
  const token = await createAlertToken('12345678-1234-1234-1234-123456789012', 1700000000000, 'test-secret', 'verify', 1700000000000)
  const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A')
  assert.equal(await verifyAlertToken(tampered, 'test-secret', 1700000001000), null)
  assert.equal(await verifyAlertToken(token, 'test-secret', 1700000000000 + 24 * 60 * 60 * 1000 + 1), null)
})

test('management tokens are scoped and remain valid for 90 days', async () => {
  const token = await createAlertToken('12345678-1234-1234-1234-123456789012', 1700000000000, 'test-secret', 'manage', 1700000000000)
  assert.equal(await verifyAlertToken(token, 'test-secret', { expectedScope: 'verify', now: 1700000001000 }), null)
  assert.equal((await verifyAlertToken(token, 'test-secret', { expectedScope: 'manage', now: 1700000001000 }))?.scope, 'manage')
  assert.equal(await verifyAlertToken(token, 'test-secret', { expectedScope: 'manage', now: 1700000000000 + 90 * 24 * 60 * 60 * 1000 + 1 }), null)
})
