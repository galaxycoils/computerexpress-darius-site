/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-09-25
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: added Sep 24 Port Colborne cable-theft arrests (6 District); retained Sep 23 Niagara Falls robbery update and Sep 21–22 homicide wanted/update items.
 */

export const nrpsReleases = [
  {
    id: 'nrps-2026-09-24-port-colborne-cable-theft',
    date: '2026-09-24',
    headline: 'Two Males Arrested in Theft of Cable Incident in Port Colborne',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Theft / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/two-males-arrested-in-theft-of-cable-incident-in-port-colborne/',
    source: 'Niagara Regional Police Service',
    tags: ['Theft', 'Arrest', 'Port Colborne', '6 District', 'Public Assistance'],
    category: 'arrest',
  },
  {
    id: 'nrps-2026-09-23-nf-robbery-arrests-update',
    date: '2026-09-23',
    headline: 'Update 1 – Arrests Made in Robbery Investigation in Niagara Falls',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Update / Robbery)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-arrests-made-in-robbery-investigation-in-niagara-falls/',
    source: 'Niagara Regional Police Service',
    tags: ['Robbery', 'Arrest', 'Niagara Falls', '2 District', 'CIB', 'Update'],
    category: 'arrest',
  },
  {
    id: 'nrps-2026-09-22-homicide-update-1-piccirillo',
    date: '2026-09-22',
    headline: 'Update #1 - One Male Arrested, One Outstanding: Two Niagara Falls Men Wanted in Homicide Investigation',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Update / Homicide)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-one-male-arrested-one-outstanding-two-niagara-falls-men-wanted-in-homicide-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Homicide', 'Arrest', 'Niagara Falls', 'Homicide Unit', 'Update', 'Public Assistance'],
    category: 'homicide',
  },
  {
    id: 'nrps-2026-09-21-nf-homicide-wanted',
    date: '2026-09-21',
    headline: 'Two Niagara Falls Men Wanted in Homicide Investigation',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Homicide / Public Assistance)',
    url: 'https://www.niagarapolice.ca/news/posts/two-niagara-falls-men-wanted-in-homicide-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Homicide', 'Public Assistance', 'Niagara Falls', 'Homicide Unit', 'Wanted'],
    category: 'homicide',
  },
];
