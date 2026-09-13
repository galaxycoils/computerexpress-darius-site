import { describe, expect, it } from 'vitest'
import { contentRegistry, getPublishableContent } from './contentRegistry'

describe('contentRegistry', () => {
  it('publishes only entries backed by an official source and a valid ISO date', () => {
    expect(contentRegistry.length).toBeGreaterThanOrEqual(3)
    expect(getPublishableContent()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          primarySource: expect.stringMatching(/^https:\/\/(www\.)?(stcatharines|welland|thorold|niagararegion)\.ca\//),
          publishedDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        }),
      ]),
    )
  })

  it('excludes a discovery lead that has no official primary source', () => {
    expect(getPublishableContent().every((item) => item.primarySource)).toBe(true)
  })
})