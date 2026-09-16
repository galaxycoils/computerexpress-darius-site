const TOKEN_TTL_MS = {
  verify: 24 * 60 * 60 * 1000,
  manage: 90 * 24 * 60 * 60 * 1000,
}
const FUTURE_SKEW_MS = 5 * 60 * 1000

function base64url(value) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function decodeBase64url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const binary = atob(padded)
  return new Uint8Array([...binary].map(char => char.charCodeAt(0)))
}

async function signature(payload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return base64url(String.fromCharCode(...new Uint8Array(bytes)))
}

async function verifySignature(payload, encoded, secret) {
  if (!secret || !encoded) return false
  const expected = await signature(payload, secret)
  const actualBytes = decodeBase64url(encoded)
  const expectedBytes = decodeBase64url(expected)
  if (actualBytes.length !== expectedBytes.length) return false
  let difference = 0
  for (let index = 0; index < actualBytes.length; index += 1) difference |= actualBytes[index] ^ expectedBytes[index]
  return difference === 0
}

export async function createAlertToken(id, createdAt, secret, scope = 'verify', issuedAt = Date.now()) {
  if (!secret) throw new Error('ALERT_TOKEN_SECRET is required')
  if (!TOKEN_TTL_MS[scope]) throw new Error('Unsupported alert-token scope')
  const payload = JSON.stringify({ id, createdAt, scope, issuedAt })
  return base64url(payload) + '.' + await signature(payload, secret)
}

export async function verifyAlertToken(token, secret, options = {}) {
  if (!secret || typeof token !== 'string') return null
  const normalizedOptions = typeof options === 'number' ? { now: options } : options
  const now = normalizedOptions.now ?? Date.now()
  const expectedScope = normalizedOptions.expectedScope ?? 'verify'
  const parts = token.split('.')
  if (parts.length !== 2) return null
  let payload
  try {
    payload = new TextDecoder().decode(decodeBase64url(parts[0]))
  } catch {
    return null
  }
  if (!await verifySignature(payload, parts[1], secret)) return null
  let claims
  try {
    claims = JSON.parse(payload)
  } catch {
    const separator = payload.lastIndexOf(':')
    if (expectedScope !== 'verify' || separator <= 0) return null
    claims = {
      id: payload.slice(0, separator),
      createdAt: Number(payload.slice(separator + 1)),
      scope: 'verify',
      issuedAt: Number(payload.slice(separator + 1)),
    }
  }
  const { id, createdAt, scope, issuedAt } = claims
  if (!/^[0-9a-f-]{20,}$/i.test(id) || !Number.isSafeInteger(createdAt) || !Number.isSafeInteger(issuedAt)) return null
  if (scope !== expectedScope || !TOKEN_TTL_MS[scope]) return null
  if (issuedAt > now + FUTURE_SKEW_MS || now - issuedAt > TOKEN_TTL_MS[scope]) return null
  return { id, createdAt, scope, issuedAt }
}
