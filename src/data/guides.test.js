import { describe, expect, it } from 'vitest'
import { getGuideBySlug, guides } from './guides'

describe('guides', () => {
  it('returns a published guide only for an exact slug', () => {
    expect(getGuideBySlug('st-catharines-ontario-street-corridor-plan')).toMatchObject({
      city: 'St. Catharines',
      primarySource: expect.stringContaining('stcatharines.ca'),
    })
    expect(getGuideBySlug('does-not-exist')).toBeNull()
  })

  it('gives every guide a unique slug and official source', () => {
    expect(new Set(guides.map((guide) => guide.slug)).size).toBe(guides.length)
    expect(guides.every((guide) => guide.primarySource.startsWith('https://www.'))).toBe(true)
  })
})