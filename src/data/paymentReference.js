/**
 * Per-signup Interac e-Transfer reference code, derived from the alert id
 * (a crypto.randomUUID()). Deterministic, so no schema change is needed and the
 * same code is shown on the page, in the verification email and to the admin.
 * Format: PA- + first 8 hex chars of the id, uppercase (e.g. PA-3F9A12BC).
 */
export function paymentReferenceForAlertId(id) {
  if (typeof id !== 'string') return null
  const hex = id.replace(/-/g, '').toLowerCase()
  if (!/^[0-9a-f]{8,}$/.test(hex)) return null
  return `PA-${hex.slice(0, 8).toUpperCase()}`
}

/** Normalize admin/user input like " pa-3f9a12bc " to "PA-3F9A12BC"; null if malformed. */
export function normalizePaymentReference(input) {
  if (typeof input !== 'string') return null
  const compact = input.trim().toUpperCase().replace(/\s+/g, '')
  const match = compact.match(/^(?:PA-?)?([0-9A-F]{8})$/)
  return match ? `PA-${match[1]}` : null
}

/** SQL LIKE prefix for a normalized reference against the uuid id column. */
export function alertIdPrefixForReference(reference) {
  const normalized = normalizePaymentReference(reference)
  return normalized ? normalized.slice(3).toLowerCase() : null
}
