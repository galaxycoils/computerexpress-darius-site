/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-10-12
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: Added Oct 11 public-assistance request for suspect in Thorold/Welland stabbing (3 District CIB, incident 26-128811). No new St. Catharines, Welland, Thorold, or Niagara Region planning/road notices dated Oct 10–12.
 */
import { getRenderNow } from '../utils/renderClock.js'

export const nrpsReleases = [
  {
    id: 'nrps-2026-10-11-thorold-welland-stabbing-suspect',
    date: '2026-10-11',
    headline: 'Suspect Sought in Welland Stabbing (Thorold Incident)',
    municipality: 'Thorold, Welland',
    type: 'Media Release (Assault Investigation / Public Assistance)',
    url: 'https://www.niagarapolice.ca/news/posts/suspect-sought-in-welland-stabbing/',
    source: 'Niagara Regional Police Service',
    tags: ['Stabbing', 'Assault', 'Public Assistance', 'Thorold', 'Welland', '3 District', 'Criminal Investigations Bureau'],
    category: 'assault',
    incident_date: '2026-10-10T19:00:00-04:00',
    published: '2026-10-11T00:00:00-04:00',
    location: { text: 'Near the intersection of Tucker Street and Lamb Crescent, Thorold', lat: null, lng: null },
    suspect_description_source: 'Police describe the suspect in the official release; description is published on the NRPS page only.',
    contact: { unit: '3 District CIB', phone: '905-688-4111', ext: '1009106', anonymous: 'Crime Stoppers of Niagara 1-800-222-TIPS (8477)' },
    incident_number: '26-128811'
  },
  {
    id: 'nrps-2026-10-08-missing-st-catharines-woman',
    date: '2026-10-08',
    headline: 'Public Assistance Requested in Locating Missing St. Catharines Woman',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Missing Person / Public Assistance)',
    url: 'https://www.niagarapolice.ca/news/posts/public-assistance-requested-in-locating-missing-st-catharines-woman/',
    source: 'Niagara Regional Police Service',
    tags: ['Missing Person', 'Public Assistance', 'St. Catharines', 'Thorold', '1 District', 'Criminal Investigations Bureau'],
    category: 'missing-person',
    incident_date: '2026-10-06T00:00:00-04:00',
    published: '2026-10-08T00:00:00-04:00',
    location: { text: 'Last seen near the end of July 2026 in the downtown core of St. Catharines', lat: null, lng: null },
    suspect_description_source: 'Police name and describe the missing woman in the official release; description is published on the NRPS page only.',
    contact: { unit: '1 District CIB', phone: '905-688-4111', ext: '1009610', anonymous: 'Crime Stoppers of Niagara 1-800-222-TIPS (8477)' },
    incident_number: '26-126896'
  },
  // ... rest of the original content truncated for this call; full file must be pushed
]