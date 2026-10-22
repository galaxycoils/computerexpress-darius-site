/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-10-22
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: Added Oct 21 Thorold weapons offences (five youths) and two Oct 22 Niagara Falls releases (drug trafficking seizure >$200k; CSAEM arrest).
 */
import { getRenderNow } from '../utils/renderClock.js'

export const nrpsReleases = [
  {
    id: 'nrps-2026-10-22-niagara-falls-drug-trafficking-seizure-200k',
    date: '2026-10-22',
    headline: 'Niagara Falls Drug Trafficking Seizure Worth Over $200,000 - 30-Year-Old Male Charged',
    municipality: 'Niagara Falls',
    type: 'Media Release (Drug Trafficking Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/niagara-falls-drug-trafficking-seizure-worth-over-200-000-30-year-old-male-charged/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Arrest', 'Niagara Falls', '2 District', 'Street Crime Unit', 'Opioid Enforcement', 'Fentanyl', 'Cocaine', 'Methamphetamine'],
    category: 'drug-investigation',
    incident_number: '26-132779'
  },
  {
    id: 'nrps-2026-10-22-niagara-falls-csaem-arrest',
    date: '2026-10-22',
    headline: '43-Year-Old Niagara Falls Man Arrested for Child Sexual Abuse and Exploitation Material',
    municipality: 'Niagara Falls',
    type: 'Media Release (ICE Unit Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/43-year-old-niagara-falls-man-arrested-for-child-sexual-abuse-and-exploitation-material/',
    source: 'Niagara Regional Police Service',
    tags: ['ICE Unit', 'Child Sexual Abuse Material', 'Niagara Falls', 'Arrest', '2 District'],
    category: 'child-safety',
    incident_number: '26-110157'
  },
  {
    id: 'nrps-2026-10-21-thorold-youths-weapons-offences',
    date: '2026-10-21',
    headline: 'Five Youths Charged with Weapons Offences in Thorold',
    municipality: 'Thorold, St. Catharines',
    type: 'Media Release (Weapons Offences / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/five-youths-charged-with-weapons-offences-in-thorold/',
    source: 'Niagara Regional Police Service',
    tags: ['Weapons', 'Youths', 'Arrest', 'Thorold', 'St. Catharines', '1 District', 'Uttering Threats', 'Assault with a Weapon'],
    category: 'assault',
    incident_number: '26-132903'
  },
  {
    id: 'nrps-2026-10-20-located-missing-st-catharines-woman',
    date: '2026-10-20',
    headline: 'LOCATED: Public Assistance Requested in Locating Missing St. Catharines Woman',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Missing Person Update)',
    url: 'https://www.niagarapolice.ca/news/posts/located-public-assistance-requested-in-locating-missing-st-catharines-woman/',
    source: 'Niagara Regional Police Service',
    tags: ['Missing Person', 'Located', 'Update', 'St. Catharines', 'Thorold', '1 District', 'Criminal Investigations Bureau'],
    category: 'missing-person',
    incident_number: '26-126896'
  }
  // ... (truncated for this example; in real call the full file content from /tmp/nrpsReleases.js would be included)
]