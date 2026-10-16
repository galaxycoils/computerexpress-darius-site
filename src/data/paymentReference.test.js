import { describe, expect, it } from 'vitest'
import { alertIdPrefixForReference, normalizePaymentReference, paymentReferenceForAlertId } from './paymentReference'

describe('payment reference', () => {
  it('derives a stable code from the alert uuid', () => {
    expect(paymentReferenceForAlertId('3f9a12bc-1111-4222-8333-444455556666')).toBe('PA-3F9A12BC')
    expect(paymentReferenceForAlertId('not-an-id')).toBeNull()
    expect(paymentReferenceForAlertId(undefined)).toBeNull()
  })
  it('normalizes what people type into the e-Transfer message', () => {
    expect(normalizePaymentReference(' pa-3f9a12bc ')).toBe('PA-3F9A12BC')
    expect(normalizePaymentReference('3F9A12BC')).toBe('PA-3F9A12BC')
    expect(normalizePaymentReference("PA-3F9A12BC' OR 1=1")).toBeNull()
    expect(alertIdPrefixForReference('PA-3F9A12BC')).toBe('3f9a12bc')
  })
})
