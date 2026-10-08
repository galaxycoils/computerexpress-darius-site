import { describe, expect, it } from 'vitest'
import { getUpcomingMeetings, getActiveNotices, getNoticeStatus, planningNotices, noticeCategories, municipalities, getNoticeStats } from './planningNotices.js'

// Algorithm tests use controlled records; newsroom updates must not change their expectations.
const hearing = { id: 'hearing', status: 'Hearing Scheduled', meetingDate: '2026-09-28T18:00:00', municipality: 'Welland', category: 'Planning' }
const closure = { id: 'closure', status: 'Active', endDate: '2026-09-29', municipality: 'Thorold', category: 'Roads' }

describe('planning tracker data', () => {
  it('offers filters for every current category and municipality', () => {
    expect(noticeCategories.map(({ key }) => key).sort()).toEqual([...new Set(planningNotices.map(({ category }) => category))].sort())
    expect(municipalities.map(({ label }) => label)).toEqual(['St. Catharines', 'Welland', 'Thorold', 'Niagara Region'])
    expect(getNoticeStats().total).toBe(planningNotices.length)
  })
})

describe('getUpcomingMeetings', () => {
  const now = new Date('2026-09-20T12:00:00Z')
  const fixtures = [
    { id: 'before', meetingDate: '2026-09-20T07:59:59' },
    { id: 'start', meetingDate: '2026-09-20T08:00:00' },
    { id: 'end', meetingDate: '2026-09-27T08:00:00' },
    { id: 'after', meetingDate: '2026-09-27T08:00:01' },
    { id: 'later', meetingDate: '2026-09-29T18:00:00' },
    { id: 'undated' },
    { id: 'invalid', meetingDate: 'invalid' },
  ]
  it('includes both seven-day boundaries using Toronto civil time', () => {
    expect(getUpcomingMeetings(7, now, fixtures).map(n => n.id)).toEqual(['start', 'end'])
  })
  it('includes later events when the caller requests a wider range', () => {
    expect(getUpcomingMeetings(10, now, fixtures).map(n => n.id)).toEqual(['start', 'end', 'after', 'later'])
  })
})

describe('time-sensitive notice status', () => {
  const now = new Date('2026-09-29T12:00:00Z')
  it('does not count past scheduled hearings as active or upcoming', () => {
    expect(getActiveNotices(now, [hearing])).toEqual([])
    expect(getNoticeStats(now, [hearing]).upcomingMeetings).toBe(0)
  })
  it('continues counting genuinely future meetings', () => {
    const future = { ...hearing, meetingDate: '2026-09-30T18:00:00' }
    expect(getNoticeStats(now, [hearing, future])).toMatchObject({ total: 2, active: 1, upcomingMeetings: 1 })
  })
  it('returns the published status when it is already a final outcome', () => {
    expect(getNoticeStatus({ ...hearing, status: 'Meeting Complete' }, now)).toBe('Meeting Complete')
  })
  it('expires an open call after its listed deadline', () => {
    expect(getNoticeStatus({ status: 'Open', submissionDeadline: '2026-10-16' }, new Date('2026-10-17T12:00:00Z'))).toBe('Submission deadline passed — check source')
  })
  it('stops calling a road closure active after its expected end', () => {
    expect(getNoticeStatus(closure, now)).toBe('Expected end passed — check source')
    expect(getActiveNotices(now, [closure])).toEqual([])
  })
  it('marks a scheduled closure window for source verification as it begins', () => {
    expect(getNoticeStatus({ status: 'Scheduled', effectiveDate: '2026-10-06' }, new Date('2026-10-06T12:00:00Z'))).toBe('Scheduled window underway — check source')
  })
  it('preserves a source-confirmed active status within its window', () => {
    expect(getNoticeStatus({ status: 'Active', effectiveDate: '2026-10-06', endDate: '2026-10-30' }, new Date('2026-10-08T12:00:00Z'))).toBe('Active')
  })
})
