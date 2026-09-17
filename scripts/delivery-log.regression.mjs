import test from 'node:test'
import assert from 'node:assert/strict'
import { recipientFingerprint } from '../functions/lib/emailDelivery.js'

test('delivery recipient fingerprints are stable and do not reveal the email address', async () => {
  const fingerprint = await recipientFingerprint('Reader@Example.com ')
  assert.equal(fingerprint, await recipientFingerprint('reader@example.com'))
  assert.match(fingerprint, /^[a-f0-9]{64}$/)
  assert.equal(fingerprint.includes('reader'), false)
})
