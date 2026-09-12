/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-09-12
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: added Sep 9 Welland break-and-enter arrests; Sep 11 NRPS officer impaired-operation investigation (1 District responded).
 */

export const nrpsReleases = [
  // SEP 11, 2026
  {
    id: 'nrps-2026-09-11-officer-impaired-operation',
    date: '2026-09-11',
    headline: 'NRPS Officer Charged in Impaired Operation Investigation',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Impaired Operation Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/nrps-officer-charged-in-impaired-operation-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Impaired Operation', 'St. Catharines', 'Thorold', '1 District', 'Investigation'],
    category: 'impaired-driving',
  },
  // SEP 9, 2026
  {
    id: 'nrps-2026-09-09-welland-bne-arrests',
    date: '2026-09-09',
    headline: 'Two Arrested in Welland Break and Enter Investigation',
    municipality: 'Welland',
    type: 'Media Release (Break & Enter Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/two-arrested-in-welland-break-and-enter-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Break & Enter', 'Welland', 'Arrest', 'Investigation'],
    category: 'break-and-enter',
  },
  // SEP 7, 2026
  {
    id: 'nrps-2026-09-07-fort-erie-collision',
    date: '2026-09-07',
    headline: 'Detectives Investigating Serious Collision in Fort Erie',
    municipality: 'Fort Erie',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/detectives-investigating-serious-collision-in-fort-erie/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Serious Injuries', 'Fort Erie', 'Investigation'],
    category: 'collision',
  },
  {
    id: 'nrps-2026-09-07-ride-checks',
    date: '2026-09-07',
    headline: 'NRPS RIDE Checks Result in Impaired Driving Arrests and Licence Suspensions',
    municipality: 'Fort Erie',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/nrps-ride-checks-result-in-impaired-driving-arrests-and-licence-suspensions/',
    source: 'Niagara Regional Police Service',
    tags: ['RIDE', 'Impaired Driving', 'Arrests', 'Licence Suspensions', 'Fort Erie', 'Public Safety'],
    category: 'impaired-driving',
  },
  {
    id: 'nrps-2026-09-07-welland-escooter-collision',
    date: '2026-09-07',
    headline: 'Police Investigating Serious E-Scooter Collision in Welland',
    municipality: 'Welland',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/police-investigating-serious-e-scooter-collision-in-welland/',
    source: 'Niagara Regional Police Service',
    tags: ['E-Scooter', 'Collision', 'Serious Injuries', 'Welland', 'Investigation'],
    category: 'collision',
  },
  // SEP 4, 2026
  {
    id: 'nrps-2026-09-04-wellandport-bne',
    date: '2026-09-04',
    headline: 'Suspects to Identify in Wellandport Break and Enter',
    municipality: 'Wellandport (Niagara Region)',
    type: 'Media Release (Break & Enter Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/suspects-to-identify-in-wellandport-break-and-enter/',
    source: 'Niagara Regional Police Service',
    tags: ['Break & Enter', 'Wellandport', 'Investigation'],
    category: 'break-and-enter',
  },
  // SEP 3, 2026
  {
    id: 'nrps-2026-09-03-safe-start',
    date: '2026-09-03',
    headline: '"Project Safe Start" to Run for Back-to-School Week',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/project-safe-start-to-run-for-back-to-school-week/',
    source: 'Niagara Regional Police Service',
    tags: ['Community Notification', 'Public Safety', 'Back to School', 'Region-wide'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-09-03-welland-child-sexual-abuse',
    date: '2026-09-03',
    headline: '24-Year-Old Welland Man Arrested for Child Sexual Abuse and Exploitation Material',
    municipality: 'Welland',
    type: 'Media Release (ICE Unit Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/24-year-old-welland-man-arrested-for-child-sexual-abuse-and-exploitation-material/',
    source: 'Niagara Regional Police Service',
    tags: ['ICE Unit', 'Child Sexual Abuse', 'Child Exploitation Material', 'Welland', 'Arrest'],
    category: 'child-safety',
  },
  // AUG 26, 2026
  {
    id: 'nrps-2026-08-26-st-catharines-collision-arrest',
    date: '2026-08-26',
    headline: 'Update 1 – Arrest Made: Male Pedestrian Struck in Fail-to-Remain Collision in St. Catharines',
    municipality: 'St. Catharines',
    type: 'Media Release (Collision Reconstruction Unit)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-arrest-made-male-pedestrian-struck-in-fail-to-remain-collision-in-st-catharines/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Fail to Remain', 'Pedestrian', 'St. Catharines', 'Arrest', 'Collision Reconstruction'],
    category: 'collision',
  },
  // SEP 2, 2026 (previously reported, still current)
  {
    id: 'nrps-2026-09-02-thorold-welland-drug',
    date: '2026-09-02',
    headline: 'Mississauga Male Arrested Following Thorold & Welland Search Warrants',
    municipality: 'Thorold, Welland',
    type: 'Media Release (Drug Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/mississauga-male-arrested-in-thorold-and-welland-search-warrants/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Investigation', 'Thorold', 'Welland', 'Search Warrants', 'Arrest'],
    category: 'drug-investigation',
  },
  // SEP 1, 2026
  {
    id: 'nrps-2026-09-01-thorold-collision-witnesses',
    date: '2026-09-01',
    headline: 'Single Vehicle Collision Results in Serious Injuries – Witnesses Sought – Thorold',
    municipality: 'Thorold',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/single-vehicle-collision-results-in-serious-injuries-witnesses-sought-thorold/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Serious Injuries', 'Witnesses Sought', 'Thorold'],
    category: 'collision',
  },
  // AUG 31, 2026
  {
    id: 'nrps-2026-08-31-welland-traffic-cannabis-22kg',
    date: '2026-08-31',
    headline: 'Welland Traffic Stop Leads to Seizure of 22kg of Cannabis',
    municipality: 'Welland',
    type: 'Media Release (Traffic/Drug Seizure)',
    url: 'https://www.niagarapolice.ca/news/posts/welland-traffic-stop-leads-to-seizure-of-22kg-of-cannabis/',
    source: 'Niagara Regional Police Service',
    tags: ['Traffic Stop', 'Drug Seizure', 'Cannabis', 'Welland'],
    category: 'drug-seizure',
  },
  {
    id: 'nrps-2026-08-31-drug-trafficking-update1',
    date: '2026-08-31',
    headline: 'Update 1 – Wanted Male Still Outstanding: Five People Charged in Region-Wide Drug Trafficking Investigation',
    municipality: 'Region-wide',
    type: 'Media Release (Update)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-wanted-male-still-outstanding-five-people-charged-and-one-person-outstanding-in-region-wide-drug-trafficking-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Region-wide', 'Charges', 'Wanted', 'Update'],
    category: 'drug-investigation',
  },
  // AUG 27, 2026
  {
    id: 'nrps-2026-08-27-welland-port-colborne-bne',
    date: '2026-08-27',
    headline: 'Suspect Vehicle to Identify in Two Break and Enter Incidents in Welland and Port Colborne',
    municipality: 'Welland, Port Colborne',
    type: 'Media Release (Break & Enter)',
    url: 'https://www.niagarapolice.ca/news/posts/suspect-vehicle-to-identify-in-two-break-and-enter-incidents-in-welland-and-port-colborne/',
    source: 'Niagara Regional Police Service',
    tags: ['Break & Enter', 'Welland', 'Port Colborne', 'Suspect Vehicle'],
    category: 'break-and-enter',
  },
  {
    id: 'nrps-2026-08-27-welland-sexual-offences-children',
    date: '2026-08-27',
    headline: 'Welland Man Arrested for Several Sexual Related Offences Against Children',
    municipality: 'Welland',
    type: 'Media Release (Sexual Offences)',
    url: 'https://www.niagarapolice.ca/news/posts/welland-man-arrested-for-several-sexual-related-offences-against-children/',
    source: 'Niagara Regional Police Service',
    tags: ['Sexual Offences', 'Children', 'Welland', 'Arrest'],
    category: 'child-safety',
  },
];

export function getLatestNrpsReleases(count = 10, days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return nrpsReleases
    .filter(r => new Date(r.date) >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
}

export function getNrpsReleasesByMunicipality(municipality) {
  const key = municipality.toLowerCase();
  return nrpsReleases.filter(r =>
    r.municipality.toLowerCase().includes(key) ||
    r.tags.some(t => t.toLowerCase().includes(key))
  );
}

export function getNrpsReleasesByCategory(category) {
  return nrpsReleases.filter(r => r.category === category);
}

export function getNrpsStats() {
  const recent = getLatestNrpsReleases(20, 30);
  const byCategory = {};
  const byMunicipality = {};
  let latestDate = null;

  recent.forEach(r => {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    const primaryMuni = r.municipality.split(',')[0].trim();
    byMunicipality[primaryMuni] = (byMunicipality[primaryMuni] || 0) + 1;
    if (!latestDate || r.date > latestDate) latestDate = r.date;
  });

  return {
    total: nrpsReleases.length,
    recent7Days: getLatestNrpsReleases(20, 7).length,
    recent30Days: recent.length,
    byCategory,
    byMunicipality,
    latestDate,
  };
}
