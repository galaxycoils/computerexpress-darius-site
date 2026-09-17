/**
 * Verified content registry for St. Catharines Digital.
 *
 * Every entry is backed by an official municipal or NRPS primary source.
 * Discovery automation may surface candidates; only official HTTPS URLs belong here.
 *
 * Updated: 2026-09-16 (autonomous seed expansion)
 */

export const contentRegistry = [
  {
    slug: 'st-catharines-ontario-street-corridor-plan',
    city: 'St. Catharines',
    type: 'planning',
    title: 'Ontario Street Corridor Secondary Plan: what the public meeting covers',
    description: 'What the legislated public meeting for the Ontario Street Corridor Secondary Plan covers, and where to read the primary notice.',
    publishedDate: '2026-08-25',
    primarySource: 'https://www.stcatharines.ca/news/posts/notice-of-legislated-public-meeting-ontario-street-corridor-secondary-plan/',
    status: 'verified',
    intent: 'St. Catharines Ontario Street Corridor plan',
  },
  {
    slug: 'st-catharines-455-welland-avenue-parking',
    city: 'St. Catharines',
    type: 'planning',
    title: '455 Welland Avenue parking variance before Committee of Adjustment',
    description: 'Minor variance A-20/26 seeks reduced parking for a mixed-use proposal at 455 Welland Avenue.',
    publishedDate: '2026-08-25',
    primarySource: 'https://www.stcatharines.ca/news/posts/notice-of-hearing-455-welland-avenue/',
    status: 'verified',
    intent: '455 Welland Avenue minor variance',
  },
  {
    slug: 'st-catharines-60-thomas-street-variance',
    city: 'St. Catharines',
    type: 'planning',
    title: '60 Thomas Street: front-yard and parking-width variance hearing',
    description: 'Committee of Adjustment hearing A-51/26 for setback and parking-area width relief at 60 Thomas Street.',
    publishedDate: '2026-08-25',
    primarySource: 'https://www.stcatharines.ca/news/posts/notice-of-hearing-60-thomas-street/',
    status: 'verified',
    intent: '60 Thomas Street minor variance',
  },
  {
    slug: 'st-catharines-12-stepney-consent',
    city: 'St. Catharines',
    type: 'planning',
    title: '12 Stepney Street consent to sever for semi-detached lots',
    description: 'Consent B-20/26SC to sever land for a semi-detached dwelling under construction at 12 Stepney Street.',
    publishedDate: '2026-08-25',
    primarySource: 'https://www.stcatharines.ca/news/posts/public-hearing-12-stepney-street/',
    status: 'verified',
    intent: '12 Stepney Street consent',
  },
  {
    slug: 'welland-first-street-consent-variance',
    city: 'Welland',
    type: 'planning',
    title: '37–40 First Street in Welland: consent and minor-variance hearing guide',
    description: 'What the public hearing for 37–40 First Street in Welland covers, and where to read the primary notice.',
    publishedDate: '2026-09-02',
    primarySource: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance-37-to-39-and-38-to-40-first-street/',
    status: 'verified',
    intent: 'Welland First Street development application',
  },
  {
    slug: 'welland-niagara-forks-clare-clifford-coa',
    city: 'Welland',
    type: 'planning',
    title: 'Welland Committee of Adjustment: Niagara, Forks, Clare and Clifford applications',
    description: 'Public hearing on multiple consent and variance applications across Niagara Street, Forks Road, Clare Avenue and Clifford Avenue.',
    publishedDate: '2026-08-20',
    primarySource: 'https://www.welland.ca/news/posts/notice-of-public-hearing-concerning-applications-for-consent-and-minor-variance/',
    status: 'verified',
    intent: 'Welland multi-address CoA hearing',
  },
  {
    slug: 'thorold-mcmillan-park-pic',
    city: 'Thorold',
    type: 'planning',
    title: 'McMillan Park improvements: Public Information Centre',
    description: 'City of Thorold PIC for proposed McMillan Park improvements, with materials on Let\'s Talk Thorold.',
    publishedDate: '2026-09-11',
    primarySource: 'https://www.thorold.ca/news/news/notice-of-public-information-centre-mcmillan-park-project/',
    status: 'verified',
    intent: 'Thorold McMillan Park PIC',
  },
  {
    slug: 'thorold-pamela-drive-watermain',
    city: 'Thorold',
    type: 'infrastructure',
    title: 'Pamela Drive watermain replacement in Thorold: project information',
    description: 'What the project commencement notice for the Pamela Drive watermain replacement covers, and where to read the primary notice.',
    publishedDate: '2026-09-03',
    primarySource: 'https://www.thorold.ca/news/news/notice-of-project-commencement-pamela-drive-watermain-replacement',
    status: 'verified',
    intent: 'Pamela Drive watermain replacement Thorold',
  },
  {
    slug: 'niagara-region-quaker-road-sewer',
    city: 'Niagara Region',
    type: 'infrastructure',
    title: 'Quaker Road sanitary trunk sewer upgrade notice',
    description: 'Regional public notice for Quaker Road sanitary trunk sewer work affecting Welland and Pelham.',
    publishedDate: '2026-09-14',
    primarySource: 'https://www.niagararegion.ca/news/notices/notice.aspx?q=1024',
    status: 'verified',
    intent: 'Quaker Road sewer upgrade',
  },
  {
    slug: 'nrps-project-safe-start-results',
    city: 'Niagara Region',
    type: 'public-safety',
    title: 'Project Safe Start traffic-stop results across Niagara',
    description: 'NRPS media release summarizing traffic enforcement during the back-to-school Project Safe Start campaign.',
    publishedDate: '2026-09-15',
    primarySource: 'https://www.niagarapolice.ca/news/posts/hundreds-of-traffic-stops-reported-during-project-safe-start-niagara/',
    status: 'verified',
    intent: 'NRPS Project Safe Start results',
  },
]

export function getPublishableContent() {
  return contentRegistry.filter(
    (item) =>
      item.status === 'verified' &&
      !!item.primarySource &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.publishedDate),
  )
}

export function getPublishableContentBySlug(slug) {
  return getPublishableContent().find((item) => item.slug === slug) || null
}
