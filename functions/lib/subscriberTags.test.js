import { describe, expect, it } from 'vitest'
import { mergeTags, tagsFromSignup } from './subscriberTags'

describe('newsletter signup tags', () => {
  it('tags a Council Record signup on the existing list and ignores any other list name', () => {
    expect(tagsFromSignup({ source: 'council-record' })).toEqual(['council-record'])
    expect(tagsFromSignup({ tag: 'council-record', placement: 'home' })).toEqual(['council-record'])
    expect(tagsFromSignup({ placement: 'council-record' })).toEqual(['council-record'])
    expect(tagsFromSignup({ tags: ['council-record', 'second-list'], source: 'other-list' })).toEqual(['council-record'])
    expect(tagsFromSignup({ source: 'second-list' })).toEqual([])
    expect(mergeTags('["council-record","planning"]', [])).toEqual(['council-record'])
    expect(mergeTags('[]', ['council-record'])).toEqual(['council-record'])
    expect(mergeTags('not-json', ['council-record'])).toEqual(['council-record'])
  })
})
