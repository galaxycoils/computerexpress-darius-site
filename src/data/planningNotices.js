/**
 * Planning & Development Notices for St. Catharines Digital
 * Sourced exclusively from official municipal documents:
 * - stcatharines.ca
 * - welland.ca
 * - thorold.ca
 * - niagararegion.ca
 *
 * Updated: 2026-09-19
 * Note: added Welland CoA 777-803 Niagara St (sign variances, Oct 14 hearing); added Thorold temporary closures at Sullivan/Towpath, Alexandria Dr, and Bridge 11 (Hwy 20).
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
    status: 'Hearing Complete',
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
    type: 'Consent (Committee of Adjustment)',
    title: '12 Stepney Street — Consent to Sever',
    description: 'Consent B-20/26SC to sever 293.13 sq m (12A Stepney St) for a semi-detached dwelling under construction; 293.14 sq m remnant retained for the second unit.',
    fileNumber: 'B-20/26SC',
    status: 'Hearing Complete',
    meetingDate: '2026-09-16T17:00:00',
    meetingLocation: 'Council Chambers, 50 Church St',
    publishedDate: '2026-08-25',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/public-hearing-12-stepney-street/',
    category: 'consent-application',
    tags: ['Consent', 'Stepney Street', 'Semi-detached']
  },
  {
    id: 'stc-60-thomas-st',
    municipality: 'St. Catharines',
    type: 'Minor Variance (Committee of Adjustment)',
    title: '60 Thomas Street — Front Yard and Parking Width',
    description: 'Variance A-51/26 to reduce front yard setback from 3 m to 2.3 m and increase maximum parking area width from 5.5 m to 6.0 m for a detached dwelling.',
    fileNumber: 'A-51/26',
    status: 'Hearing Complete',
    meetingDate: '2026-09-16T17:00:00',
    meetingLocation: 'Council Chambers, 50 Church St',
    publishedDate: '2026-08-25',
    sourceUrl: 'https://www.stcatharines.ca/news/posts/notice-of-hearing-60-thomas-street/',
    category: 'minor-variance',
    tags: ['Minor Variance', 'Thomas Street', 'Setback', 'Parking']
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
    id: 'welland-coa-niagara-forks-clare-clifford',
    municipality: 'Welland',
    type: 'Committee of Adjustment Hearing',
    title: '373 Niagara St, 112-116 Forks Rd, 657-661 Clare Ave, 37-39 Clifford Ave — Consents and Variances',
    description: 'Welland Committee of Adjustment hearing on multiple consent and minor variance applications: new lot at 373 Niagara St; lot creation and lot-area relief for existing semis at 112-116 Forks Rd; lot creation for semis under construction at 657-661 Clare Ave; lot-boundary adjustment and related variances at 37-39 Clifford Ave.',
    fileNumber: 'PLCON202600172 / PLCON202600181 / PLCON202600201 / PLCON202600199',
    status: 'Hearing Complete',
    meetingDate: '2026-09-16T17:00:00',
    meetingLocation: 'Civic Square Council Chambers, 60 East Main St, Welland',
    submissionDeadline: '2026-09-10T00:00:00',
    submissionEmail: 'cofa@welland.ca',
    publishedDate: '2026-08-20',
    sourceUrl: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance/',
    category: 'consent-application',
    tags: ['Consent', 'Minor Variance', 'Welland', 'Niagara Street', 'Forks Road', 'Clare Avenue', 'Clifford Avenue']
  },
  {
    id: 'welland-coa-777-803-niagara-st',
    municipality: 'Welland',
    type: 'Committee of Adjustment Hearing',
    title: '777-803 Niagara Street — Ground Sign Height and Area Variances',
    description: 'Minor variance PLMV202600222 for two ground signs on the commercial property at 777-803 Niagara Street, each proposed at 10.5 m height (7.5 m maximum) and 34.6 sq m area (10 sq m maximum) under Sign By-law 2005-21.',
    fileNumber: 'PLMV202600222',
    status: 'Hearing Scheduled',
    meetingDate: '2026-10-14T17:00:00',
    meetingLocation: 'Civic Square Council Chambers, 60 East Main St, Welland',
    submissionDeadline: '2026-10-08T00:00:00',
    submissionEmail: 'cofa@welland.ca',
    publishedDate: '2026-09-24',
    sourceUrl: 'https://www.welland.ca/news/posts/notice-of-public-hearing-application-for-minor-variance-777-803-niagara-street/',
    category: 'minor-variance',
    tags: ['Minor Variance', 'Welland', 'Niagara Street', 'Sign By-law']
  },
  {
    id: 'welland-coa-first-st-37-40',
    municipality: 'Welland',
    type: 'Committee of Adjustment Hearing',
    title: '37-40 First Street — Consents and Access Aisle Variances',
    description: 'Consent applications to create new lots at 37-39 and 38-40 First Street for future multiple dwellings, with reciprocal access easements, plus variances to reduce required access aisle width from 6 m to 3 m on severed and retained lots.',
    fileNumber: 'PLCON202600193 / PLCON202600195',
    status: 'Hearing Scheduled',
    meetingDate: '2026-09-28T17:00:00',
    meetingLocation: 'Civic Square Council Chambers, 60 East Main St, Welland',
    submissionDeadline: '2026-09-22T00:00:00',
    submissionEmail: 'cofa@welland.ca',
    publishedDate: '2026-09-02',
    sourceUrl: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/',
    category: 'consent-application',
    tags: ['Consent', 'Minor Variance', 'Welland', 'First Street']
  },
  {
    id: 'thorold-sullivan-towpath-closure',
    municipality: 'Thorold',
    type: 'Temporary Road Closure',
    title: 'Sullivan Avenue and Towpath Street — Intersection Closure',
    description: 'Sullivan Avenue and Towpath Street intersection scheduled to close Monday, September 21, 2026 at 6:00 a.m. for approximately two weeks while the contractor replaces aging underground infrastructure and reconstructs the roadway in downtown Thorold.',
    status: 'Scheduled',
    effectiveDate: '2026-09-21',
    publishedDate: '2026-09-17',
    sourceUrl: 'https://www.thorold.ca/news/news/temporary-road-closures-at-sullivan-ave-and-towpath-st-starting-september-21/',
    category: 'road-closure',
    tags: ['Road Closure', 'Sullivan Avenue', 'Towpath Street', 'Thorold', 'Construction']
  },
  {
    id: 'thorold-alexandria-dr-closure-sep22',
    municipality: 'Thorold',
    type: 'Temporary Road Closure',
    title: 'Alexandria Drive — Temporary Closure September 22',
    description: 'Temporary road closure on Alexandria Drive on Tuesday, September 22, 2026 from 7:00 a.m. to 5:00 p.m. between Kottmeier Road and Legacy Lane.',
    status: 'Scheduled',
    effectiveDate: '2026-09-22',
    endDate: '2026-09-22',
    publishedDate: '2026-09-18',
    sourceUrl: 'https://www.thorold.ca/news/news/temporary-road-closure-alexandria-drive-september-22/',
    category: 'road-closure',
    tags: ['Road Closure', 'Alexandria Drive', 'Thorold']
  },
  {
    id: 'thorold-bridge-11-hwy20-closure',
    municipality: 'Thorold',
    type: 'Temporary Road Closure',
    title: 'Bridge 11 (Highway 20) — Closure September 23–24',
    description: 'Bridge 11 (Hwy 20) closed Wednesday, September 23 and Thursday, September 24, 2026 from 9 a.m. to 4 p.m. for bridge and road maintenance. All vehicle and pedestrian traffic prohibited during the work windows.',
    status: 'Scheduled',
    effectiveDate: '2026-09-23',
    endDate: '2026-09-24',
    publishedDate: '2026-09-18',
    sourceUrl: 'https://www.thorold.ca/news/news/bridge-11-hwy-20-closure-september-23-to-24/',
    category: 'bridge-repair',
    tags: ['Road Closure', 'Bridge 11', 'Highway 20', 'Thorold', 'Maintenance']
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
  },
  {
    id: 'thorold-crompton-blvd-closure',
    municipality: 'Thorold',
    type: 'Temporary Road Closure',
    title: 'Crompton Boulevard — Temporary Closure from Richmond Street',
    description: 'Crompton Boulevard closed to through traffic from Richmond Street to the south end of Crompton Boulevard starting September 9, 2026 for construction. Bolton Avenue remains open through the intersection; Richmond Street and Queen Street remain open. Local access maintained where possible.',
    status: 'Active',
    effectiveDate: '2026-09-09',
    publishedDate: '2026-09-02',
    sourceUrl: 'https://www.thorold.ca/news/news/temporary-road-closure-crompton-blvd-starting-september-9/',
    engageUrl: 'https://letstalk.thorold.ca/crompton-boulevard-bolton-avenue-cunningham-street-mccormack-drive',
    category: 'road-closure',
    tags: ['Road Closure', 'Crompton Boulevard', 'Thorold', 'Construction']
  },
  {
    id: 'thorold-pamela-dr-watermain',
    municipality: 'Thorold',
    type: 'Project Commencement',
    title: 'Pamela Drive Watermain Replacement — Lawrence to Sullivan',
    description: 'Demar Construction to start Pamela Drive watermain replacement between Lawrence Drive and Sullivan Avenue. Work includes new watermain, valves, hydrants, service reconnections, and surface restoration. Pre-construction property surveys by Pre-Con Inspection Services precede construction.',
    status: 'Pre-construction',
    publishedDate: '2026-09-03',
    sourceUrl: 'https://www.thorold.ca/news/news/notice-of-project-commencement-pamela-drive-watermain-replacement/',
    engageUrl: 'https://letstalk.thorold.ca/pamela-watermain-replacement',
    category: 'sewage-infrastructure',
    tags: ['Watermain', 'Pamela Drive', 'Thorold', 'Construction']
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
