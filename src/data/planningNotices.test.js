import { describe, expect, it } from 'vitest'
import { getUpcomingMeetings, getActiveNotices, getNoticeStatus, planningNotices, noticeCategories, municipalities, getNoticeStats } from './planningNotices.js'

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
    expect(meetings.map((m) => m.id)).toEqual(['thorold-sullivan-towpath-closure'])
  })

  it('includes events when the caller requests a wider range', () => {
    const now = new Date('2026-09-20T12:00:00Z')
    expect(getUpcomingMeetings(10, now).map((notice) => notice.id)).toContain('welland-coa-first-st-37-40')
  })
})

describe('time-sensitive notice status', () => {
  const now = new Date('2026-09-29T12:00:00Z')

  it('does not count past scheduled hearings as active', () => {
    expect(getActiveNotices(now).map(({ id }) => id)).not.toContain('welland-coa-first-st-37-40')
    expect(getNoticeStats(now).upcomingMeetings).toBe(0)
  })

  it('returns the published status when it is already a final outcome', () => {
    const notice = planningNotices.find(({ id }) => id === 'welland-coa-first-st-37-40')
    expect(getNoticeStatus(notice, now)).toBe('Meeting Complete')
  })

  it('expires an open call after its listed deadline', () => {
    const notice = planningNotices.find(({ id }) => id === 'stc-flood-resilience-task-force')
    expect(getNoticeStatus(notice, new Date('2026-10-17T12:00:00Z'))).toBe('Submission deadline passed — check source')
  })

  it('stops calling a road closure active after its expected end', () => {
    const notice = planningNotices.find(({ id }) => id === 'thorold-pine-sullivan-closure-sep-28')
    const after = new Date('2026-09-30T12:00:00Z')
    expect(getNoticeStatus(notice, after)).toBe('Expected end passed — check source')
    expect(getActiveNotices(after)).not.toContain(notice)
  })

  it('marks a dated closure window for source verification as it begins', () => {
    const notice = planningNotices.find(({ id }) => id === 'niagara-sixteen-mile-creek-bridge-closure')
    expect(getNoticeStatus(notice, new Date('2026-10-06T12:00:00Z'))).toBe('Scheduled window underway — check source')
  })
})
