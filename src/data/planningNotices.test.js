import { describe, expect, it } from 'vitest'
import { getUpcomingMeetings } from './planningNotices.js'

describe('getUpcomingMeetings', () => {
  it('keeps the front-page calendar within its declared seven-day window', () => {
    const now = new Date('2026-09-20T12:00:00Z')
    const meetings = getUpcomingMeetings(7, now)
    expect(meetings).toEqual([])
  })

  it('includes events when the caller requests a wider range', () => {
    const now = new Date('2026-09-20T12:00:00Z')
    expect(getUpcomingMeetings(10, now).map((notice) => notice.id)).toContain('welland-coa-first-st-37-40')
  })
})
