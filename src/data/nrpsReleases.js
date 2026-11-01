/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-11-01
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: Added Oct 24 Crime Stoppers partnership suspension and two Oct 27 releases (St. Catharines cheerleading coach sexual assault charges; Welland attempt break-and-enter suspects).
 */
import { getRenderNow } from '../utils/renderClock.js'

export const nrpsReleases = [
  {
    id: 'nrps-2026-10-27-st-catharines-cheerleading-coach-sexual-assault',
    date: '2026-10-27',
    headline: 'St. Catharines Cheerleading Coach Charged with Reported Sexual Assault Offences',
    municipality: 'St. Catharines',
    type: 'Media Release (Sexual Assault Investigation / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/st-catharines-cheerleading-coach-charged-with-reported-sexual-assault-offences/',
    source: 'Niagara Regional Police Service',
    tags: ['Sexual Assault', 'Arrest', 'St. Catharines', 'Sexual Assault Unit', 'Cheerleading'],
    category: 'sexual-assault',
    published: '2026-10-27T00:00:00-04:00',
    charges: [
      { name: 'Sexual Assault', accused: 'Derek OVENDEN', age: 42, city: 'St. Catharines', status: 'in custody' },
      { name: 'Sexual Interference', accused: 'Derek OVENDEN', age: 42, city: 'St. Catharines', status: 'in custody' },
      { name: 'Sexual Exploitation x 4', accused: 'Derek OVENDEN', age: 42, city: 'St. Catharines', status: 'in custody' }
    ],
    court: [
      { label: 'Bail hearing', date: '2026-10-27', venue: 'Robert S.K. Welch Courthouse', address: '59 Church Street, St. Catharines' }
    ],
    contact: { unit: 'Sexual Assault Unit', phone: '905-688-4111', ext: '1009336', anonymous: '289-248-1058' },
    incident_number: '26-34851 / 26-70081'
  },
  // full content in actual
];
