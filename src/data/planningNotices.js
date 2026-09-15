/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-09-15
 * Note: marked Sep 14 STC legislated public meetings complete; added Thorold McMillan Park PIC (Sep 28).
 * Next review: Weekly
 */

export const planningNotices = [
  {
    id: 'stc-ontario-st-corridor',
    municipality: 'St. Catharines',
    type: 'Official Plan Amendment (City-initiated)',
    title: 'Ontario Street Corridor Secondary Plan',
    description: 'City-initiated Official Plan amendment to adopt the Ontario Street Corridor Secondary Plan (QEW to Welland Ave, including 282 and 285 Ontario St).',
    fileNumber: '26 111925 OP',
    status: 'Meeting Complete',
    meetingDate: '2026-09-14T18:00:00',
    meetingLocation: 'Council Chambers, 50 Church St',
    submissionDeadline: '2026-09-11T12:00:00',
    submissionEmail: 'clerks@stcatharines.ca',
    publishedDate: '2026-08-25',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/notice-of-legislated-public-meeting-ontario-street-corridor-secondary-plan/',
    category: 'official-plan-amendment',
    tags: ['OPA', 'Ontario Street', 'Secondary Plan', 'QEW', 'Welland Ave']
  },
  {
    id: 'stc-455-welland-ave',
    municipality: 'St. Catharines',
    type: 'Minor Variance (Committee of Adjustment)',
    title: '455 Welland Avenue — Parking Variance',
    description: 'Variance to reduce minimum parking from 1.25 to 0.85 spaces/unit for 248 residential + 12 commercial units.',
    fileNumber: 'A-20/26',
    status: 'Hearing Scheduled',
    meetingDate: '2026-09-16T17:00:00',
    meetingLocation: 'Council Chambers, 50 Church St',
    publishedDate: '2026-08-25',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/notice-of-hearing-455-welland-avenue/',
    category: 'minor-variance',
    tags: ['Minor Variance', 'Parking', 'Welland Avenue', 'Residential', 'Commercial']
  },
  {
    id: 'stc-12-stepney-st',
    municipality: 'St. Catharines',
    type: 'Committee of Adjustment Hearing',
    title: '12 Stepney Street — Minor Variance',
    description: 'Minor Variance application.',
    status: 'Hearing Scheduled',
    meetingDate: '2026-09-16T17:00:00',
    meetingLocation: 'Council Chambers, 50 Church St',
    publishedDate: '2026-08',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/public-hearing-12-stepney-street/',
    category: 'minor-variance',
    tags: ['Minor Variance', 'Stepney Street']
  },
  {
    id: 'stc-cip-strategic-sites',
    municipality: 'St. Catharines',
    type: 'Community Improvement Plan',
    title: 'Community Improvement Plan for Strategic Sites',
    description: 'City-initiated site-specific CIP for long-term remediation and redevelopment of 282 Ontario St, 285 Ontario St, and 142 Queenston St.',
    status: 'Meeting Complete',
    meetingDate: '2026-09-14T18:00:00',
    meetingLocation: 'Council Chambers, 3rd Floor City Hall, 50 Church St',
    publishedDate: '2026-08-24',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/city-of-st-catharines-notice-of-public-meeting-community-improvement-plan-for-strategic-sites/',
    category: 'community-improvement-plan',
    tags: ['CIP', 'Strategic Sites', 'Community Improvement Plan', 'Ontario Street', 'Queenston Street']
  },
  {
    id: 'thorold-mcmillan-park-pic',
    municipality: 'Thorold',
    type: 'Public Information Centre',
    title: 'McMillan Park Project — Public Information Centre',
    description: 'City of Thorold PIC to gather resident feedback on proposed McMillan Park improvements. Project materials and comments also available on Let\'s Talk Thorold.',
    status: 'PIC Scheduled',
    meetingDate: '2026-09-28T17:00:00',
    meetingLocation: 'City Hall, 3540 Schmon Pkwy, Thorold',
    publishedDate: '2026-09-11',
    sourceUrl: 'https://www.thorold.ca/news/news/notice-of-public-information-centre-mcmillan-park-project/',
    engageUrl: 'https://letstalk.thorold.ca/mcmillan-park-project',
    category: 'public-information-centre',
    tags: ['PIC', 'McMillan Park', 'Thorold', 'Parks']
  }
]

export const noticeCategories = [
  { key: 'official-plan-amendment', label: 'Official Plan Amendment', color: 'var(--primary)' },
  { key: 'minor-variance', label: 'Minor Variance', color: 'var(--accent)' },
  { key: 'zoning-bylaw-amendment', label: 'Zoning By-law Amendment', color: 'var(--warning)' },
  { key: 'community-improvement-plan', label: 'Community Improvement Plan', color: 'var(--success)' },
  { key: 'draft-plan-subdivision', label: 'Draft Plan of Subdivision', color: 'var(--info)' },
  { key: 'official-plan-update', label: 'Official Plan Update', color: 'var(--primary)' },
  { key: 'consent-application', label: 'Consent Application', color: 'var(--accent)' },
  { key: 'road-closure', label: 'Road Closure / Lane Restriction', color: 'var(--danger)' },
  { key: 'public-information-centre', label: 'Public Information Centre', color: 'var(--info)' },
  { key: 'bridge-repair', label: 'Bridge Repair / Pre-construction', color: 'var(--warning)' },
  { key: 'sewage-infrastructure', label: 'Sewage Infrastructure', color: 'var(--success)' }
]

export const municipalities = [
  { key: 'st-catharines', label: 'St. Catharines', region: 'Niagara' },
  { key: 'welland', label: 'Welland', region: 'Niagara' },
  { key: 'thorold', label: 'Thorold', region: 'Niagara' },
  { key: 'niagara-region', label: 'Niagara Region', region: 'Niagara' }
]

export function getNoticesByMunicipality(municipality) {
  return planningNotices.filter(n => n.municipality.toLowerCase().includes(municipality.toLowerCase()))
}

export function getNoticesByCategory(category) {
  return planningNotices.filter(n => n.category === category)
}

export function getUpcomingMeetings() {
  const now = new Date()
  return planningNotices
    .filter(n => n.meetingDate && new Date(n.meetingDate) > now)
    .sort((a, b) => new Date(a.meetingDate) - new Date(b.meetingDate))
}

export function getActiveNotices() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  return planningNotices.filter(n => {
    const completedStatuses = [
      'Approved', 'Complete', 'Meeting Complete', 'Hearing Complete',
      'Open House Complete', 'Application Complete', 'Passed', 'By-law Passed'
    ]
    if (completedStatuses.includes(n.status)) return false
    if (n.meetingDate && new Date(n.meetingDate) < now) {
      if (!['Active', 'Under Construction', 'Pre-construction'].includes(n.status)) {
        return false
      }
    }
    if (n.endDate && new Date(n.endDate) < now) return false
    if (n.effectiveDate && !n.endDate && n.category === 'road-closure' && new Date(n.effectiveDate) < thirtyDaysAgo) {
      return false
    }
    return true
  })
}

export function getNoticeStats() {
  const active = getActiveNotices()
  const byMunicipality = {}
  const byCategory = {}
  active.forEach(n => {
    byMunicipality[n.municipality] = (byMunicipality[n.municipality] || 0) + 1
    byCategory[n.category] = (byCategory[n.category] || 0) + 1
  })
  return {
    total: planningNotices.length,
    active: active.length,
    byMunicipality,
    byCategory,
    upcomingMeetings: getUpcomingMeetings().length
  }
}
