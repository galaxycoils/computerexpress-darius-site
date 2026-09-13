/**
 * Verified content registry for St. Catharines Digital.
 *
 * Every entry must be backed by an official municipal primary source.
 * Discovery leads (Google News, secondary outlets, social media) are
 * NEVER added here. Before committing, confirm each `primarySource`
 * URL returns HTTP 200 on the official domain.
 *
 * Updated: 2026-09-12
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
]

export function getPublishableContent() {
  return contentRegistry.filter(
    (item) =>
      item.status === 'verified' &&
      !!item.primarySource &&
      /^\d{4}-\d{2}-\d{2}$/.test(item.publishedDate),
  )
}