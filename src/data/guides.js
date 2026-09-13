/**
 * Verified local search guides for St. Catharines Digital.
 *
 * Each entry is derived from the corresponding entry in
 * `src/data/contentRegistry.js`. Copy constraints:
 * - State only what the municipal notice says; never infer approval,
 *   denial, or a project timeline.
 * - Link readers to the primary document for the complete application.
 * - Never copy a secondary publisher's text.
 */

export const guides = [
  {
    slug: 'st-catharines-ontario-street-corridor-plan',
    city: 'St. Catharines',
    type: 'planning',
    title: 'Ontario Street Corridor Secondary Plan: what the public meeting covers',
    description: 'What the legislated public meeting for the Ontario Street Corridor Secondary Plan covers, and where to read the primary notice.',
    publishedDate: '2026-08-25',
    updatedDate: '2026-09-12',
    primarySource: 'https://www.stcatharines.ca/news/posts/notice-of-legislated-public-meeting-ontario-street-corridor-secondary-plan/',
    whatItMeans: [
      'The City of St. Catharines has initiated an Official Plan amendment to adopt the Ontario Street Corridor Secondary Plan, covering the area from the QEW to Welland Avenue, including 282 and 285 Ontario Street.',
      'The notice is a legislated public meeting notice, not a decision notice. The meeting is the forum for the public to make representations; a council decision has not yet been made.',
      'File reference: 26 111925 OP.',
    ],
    whatToWatch: [
      'Public meeting scheduled for September 14, 2026 at 6:00 p.m. in Council Chambers, 50 Church St.',
      'Submissions must be received by September 11, 2026 at 12:00 p.m. and sent to clerks@stcatharines.ca.',
      'Watch for any subsequent staff report, council agenda item, or revised notice published by the municipality.',
    ],
    relatedTrackerTerms: ['Ontario Street', 'Secondary Plan', 'OPA'],
    newsletterPlacement: 'guide_inline',
  },
  {
    slug: 'welland-first-street-consent-variance',
    city: 'Welland',
    type: 'planning',
    title: '37–40 First Street in Welland: consent and minor-variance hearing guide',
    description: 'What the public hearing for 37–40 First Street in Welland covers, and where to read the primary notice.',
    publishedDate: '2026-09-02',
    updatedDate: '2026-09-12',
    primarySource: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/',
    whatItMeans: [
      'The City of Welland has scheduled a public hearing for consent applications and minor variances at 37–39 and 38–40 First Street.',
      'The applications propose to create new lots for future multiple dwellings with reciprocal access easements, and to permit 3 m access aisles instead of the standard 6 m.',
      'The notice states that existing semi-detached dwellings and accessory buildings are proposed to be demolished. The hearing is the forum for the public to make representations; a decision has not yet been made.',
      'File references: PLCON202600193 and PLCON202600195.',
    ],
    whatToWatch: [
      'Hearing scheduled for September 28, 2026 at 5:00 p.m. in Council Chambers, Civic Square, 60 East Main St.',
      'Submissions must be received by September 22, 2026 and sent to cofa@welland.ca.',
      'Watch for any subsequent Committee of Adjustment decision, revised application, or notice published by the municipality.',
    ],
    relatedTrackerTerms: ['First Street', 'Consent', 'Minor Variance'],
    newsletterPlacement: 'guide_inline',
  },
  {
    slug: 'thorold-pamela-drive-watermain',
    city: 'Thorold',
    type: 'infrastructure',
    title: 'Pamela Drive watermain replacement in Thorold: project information',
    description: 'What the project commencement notice for the Pamela Drive watermain replacement covers, and where to read the primary notice.',
    publishedDate: '2026-09-03',
    updatedDate: '2026-09-12',
    primarySource: 'https://www.thorold.ca/news/news/notice-of-project-commencement-pamela-drive-watermain-replacement',
    whatItMeans: [
      'The City of Thorold has issued a notice of project commencement for watermain replacement on Pamela Drive, between Lawrence Drive and Sullivan Avenue.',
      'Pre-construction inspections are being conducted by Pre-Con Inspection Services Inc.',
      'This is a project commencement notice, not a construction-start notice. A construction start date has not yet been published.',
    ],
    whatToWatch: [
      'Watch for the subsequent construction-start notice, which will state the actual start date and any road closure or lane restriction details.',
      'Watch for any revised notice published by the municipality.',
    ],
    relatedTrackerTerms: ['Pamela Drive', 'Watermain', 'Project Commencement'],
    newsletterPlacement: 'guide_inline',
  },
]

export function getGuideBySlug(slug) {
  return guides.find((guide) => guide.slug === slug) || null
}