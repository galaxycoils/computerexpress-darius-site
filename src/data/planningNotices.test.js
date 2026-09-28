import { describe, expect, it } from 'vitest'
import { getUpcomingMeetings, planningNotices, noticeCategories, municipalities, getNoticeStats } from './planningNotices.js'

describe('planning tracker data', () => {
  it('offers filters for every current category and municipality', () => {
    expect(noticeCategories.map(({ key }) => key).sort()).toEqual([...new Set(planningNotices.map(({ category }) => category))].sort())
    expect(municipalities.map(({ label }) => label)).toEqual(['St. Catharines', 'Welland', 'Thorold', 'Niagara Region'])
    expect(getNoticeStats().total).toBe(planningNotices.length)
  })
})

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
