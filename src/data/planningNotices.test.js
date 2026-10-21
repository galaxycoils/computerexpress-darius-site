import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { filterEvents } from './events.js'
import { getUpcomingMeetings, getFutureMeetings, getActiveNotices, getNoticeStatus, planningNotices, noticeCategories, municipalities, getNoticeStats } from './planningNotices.js'

// Algorithm tests use controlled records; newsroom updates must not change their expectations.
const frozenNoon = new Date('2026-09-29T12:00:00Z')

function torontoStamp(dayOffset, time = '18:00:00') {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(frozenNoon.getTime() + dayOffset * 86400000))
  return `${day}T${time}`
}

const hearing = { id: 'hearing', status: 'Hearing Scheduled', meetingDate: torontoStamp(-1), municipality: 'Welland', category: 'Planning' }
const closure = { id: 'closure', status: 'Active', endDate: torontoStamp(0).slice(0, 10), municipality: 'Thorold', category: 'Roads' }

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

describe('future meetings match the civic calendar', () => {
  const noonToronto = new Date('2026-10-20T16:00:00Z')
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(noonToronto)
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  const later = { id: 'later', status: 'Hearing Scheduled', meetingDate: '2026-11-12T17:00:00', municipality: 'St. Catharines', category: 'minor-variance' }
  const elapsed = { ...later, id: 'elapsed', meetingDate: '2026-10-14T17:00:00' }

  it('counts hearings beyond seven days and drops them once the start time passes', () => {
    expect(getUpcomingMeetings(7, noonToronto, [later, elapsed])).toEqual([])
    expect(getFutureMeetings(noonToronto, [later, elapsed]).map((notice) => notice.id)).toEqual(['later'])
    expect(getNoticeStats(noonToronto, [later, elapsed]).upcomingMeetings).toBe(1)
    expect(getFutureMeetings(new Date('2026-11-12T22:00:00Z'), [later, elapsed])).toEqual([])
    expect(getNoticeStats(new Date('2026-11-12T22:00:00Z'), [later, elapsed]).upcomingMeetings).toBe(0)
  })

  it('lists the same upcoming notices as /events, including hearings more than a week away', () => {
    const calendar = filterEvents({ period: 'upcoming' }, noonToronto)
    expect(calendar.map((event) => event.id)).toEqual(expect.arrayContaining([
      'welland-1-griffith-st-public-info',
      'stc-11-13-paxton-ave-a-59-26',
      'stc-159-ontario-st-a-58-26',
    ]))
    expect(calendar.some((event) => event.startsAt.slice(0, 10) > '2026-10-27')).toBe(true)
    expect(getFutureMeetings(noonToronto).map((notice) => notice.id)).toEqual(calendar.map((event) => event.id))
    expect(getNoticeStats(noonToronto).upcomingMeetings).toBe(calendar.length)
  })
})

describe('time-sensitive notice status', () => {
  const now = frozenNoon
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('does not count past scheduled hearings as active or upcoming', () => {
    expect(getActiveNotices(now, [hearing])).toEqual([])
    expect(getNoticeStats(now, [hearing]).upcomingMeetings).toBe(0)
  })
  it('continues counting genuinely future meetings', () => {
    const future = { ...hearing, meetingDate: torontoStamp(1) }
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
