/**
 * NRPS Police Media Releases for St. Catharines Digital
 * Sourced exclusively from https://www.niagarapolice.ca/news/posts/
 * Official Niagara Regional Police Service media releases & community notifications.
 * Updated: 2026-10-09
 * Next review: Daily (cron) — refresh from niagarapolice.ca
 * Note: Added Oct 8 public-assistance request for a missing St. Catharines woman (1 District CIB, incident 26-126896). Oct 5–9 Niagara Falls, Fonthill, and Port Colborne releases left out of coverage.
 */
import { getRenderNow } from '../utils/renderClock.js'

export const nrpsReleases = [
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
  {
    id: 'nrps-2026-10-03-thorold-fatal-single-vehicle',
    date: '2026-10-03',
    headline: 'Fatal Single Motor Vehicle Collision in Thorold',
    municipality: 'Thorold, St. Catharines',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/fatal-single-motor-vehicle-collision/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Fatal', 'Thorold', 'St. Catharines', '1 District', 'Collision Reconstruction', 'Merrittville Highway'],
    category: 'collision',
    incident_date: '2026-10-03T02:48:00-04:00',
    published: '2026-10-03T00:00:00-04:00',
    location: { text: 'Area of Merrittville Highway and Seburn Road, Thorold', lat: null, lng: null },
    contact: { unit: 'Collision Reconstruction Unit', phone: '905-688-4111', ext: '1009769', anonymous: 'Crime Stoppers of Niagara 1-800-222-8477 (TIPS)' },
    incident_number: '26-125359'
  },
  {
    id: 'nrps-2026-10-02-thorold-drug-trafficking-arrest',
    date: '2026-10-02',
    headline: 'Thorold Man Arrested in Drug Trafficking Investigation',
    municipality: 'Thorold, St. Catharines',
    type: 'Media Release (Drug Trafficking Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/thorold-man-arrested-in-drug-trafficking-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Arrest', 'Thorold', 'St. Catharines', '1 District', 'Street Crime Unit', 'Search Warrants', 'Fentanyl', 'Cocaine'],
    category: 'drug-investigation',
    incident_date: '2026-10-01T00:00:00-04:00',
    published: '2026-10-02T15:17:00-04:00',
    location: { text: 'Investigation originated from an address on Queenston Street in St. Catharines; arrest in the area of Duke Street and Wellington Court', lat: null, lng: null },
    charges: [
      { name: 'Possession of a Schedule I Substance for the Purpose of Trafficking (3 counts)', accused: 'As named in the official release', age: null, city: 'Thorold', status: 'in custody' },
      { name: 'Possession of Proceeds of Property Obtained by Crime Under $5000', accused: 'As named in the official release', age: null, city: 'Thorold', status: 'in custody' }
    ],
    court: [
      { label: 'Bail hearing', date: '2026-10-02', venue: 'Robert S. K. Welch Courthouse', address: '59 Church Street, St. Catharines' }
    ],
    contact: { unit: '1 District Street Crime Unit', phone: '(905) 688-4111', ext: '1009558', anonymous: 'Crime Stoppers of Niagara 1-800-222-8477 (TIPS)' },
    incident_number: '26-124563'
  },
  {
    id: 'nrps-2026-10-02-missing-st-catharines-male',
    date: '2026-10-02',
    headline: 'Public Assistance Requested in Locating a Missing St. Catharines Male',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Missing Person / Public Assistance)',
    url: 'https://www.niagarapolice.ca/news/posts/public-assistance-requested-in-locating-a-missing-st-catharines-male/',
    source: 'Niagara Regional Police Service',
    tags: ['Missing Person', 'Public Assistance', 'St. Catharines', 'Thorold', '1 District', 'Criminal Investigations Bureau'],
    category: 'missing-person',
    incident_date: '2026-08-06T00:00:00-04:00',
    published: '2026-10-02T12:46:00-04:00',
    location: { text: 'Last seen at some point during the last week of July 2026 in St. Catharines', lat: null, lng: null },
    suspect_description_source: 'Police describe the missing male in the official release; description is published on the NRPS page only.',
    contact: { unit: '1 District CIB', phone: '905-688-4111', ext: '1029865', anonymous: 'Crime Stoppers of Niagara 1-800-222-TIPS (8477)' },
    incident_number: '26-98460'
  },
  {
    id: 'nrps-2026-09-25-nf-homicide-update-2-fitzgerald',
    date: '2026-09-25',
    headline: 'Update #2: Second Suspect Arrested in Niagara Falls Homicide Investigation',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Update / Homicide)',
    url: 'https://www.niagarapolice.ca/news/posts/update-2-second-suspected-arrested-two-niagara-falls-men-wanted-in-homicide-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Homicide', 'Arrest', 'Niagara Falls', 'Homicide Unit', 'Update', 'St. Catharines'],
    category: 'homicide',
  },
  {
    id: 'nrps-2026-09-25-nf-motorcycle-collision',
    date: '2026-09-25',
    headline: 'Male Deceased in Motorcycle Collision in Niagara Falls',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/male-deceased-in-motorcycle-collision-in-niagara-falls/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Motorcycle', 'Niagara Falls', 'Collision Reconstruction', '2 District', 'Public Assistance'],
    category: 'collision',
  },
  {
    id: 'nrps-26-122451',
    date: '2026-09-26',
    headline: 'Female Arrested in Downtown St. Catharines Assault — Second Male Suspect Outstanding',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Assault Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-female-arrested-in-downtown-st-catharines-assault-male-suspect-outstanding/',
    source: 'Niagara Regional Police Service',
    tags: ['Assault', 'Arrest', 'St. Catharines', 'Thorold', '1 District', 'Public Assistance', 'Hate-Motivated Investigation', 'EDIU'],
    category: 'assault',
    // Enhanced fields from official NRPS release
    incident_date: '2026-09-26T20:50:00-04:00',
    published: '2026-09-29T00:00:00-04:00',
    location: { text: 'Area of St. Paul St & Bond St, St. Catharines', lat: null, lng: null },
    charges: [
      {
        name: 'Assault Causing Bodily Harm',
        accused: 'Samantha JACOBS',
        age: 41,
        city: 'St. Catharines',
        status: 'in custody'
      },
      {
        name: 'Aggravated Assault',
        accused: 'William RIDER',
        age: 36,
        city: 'St. Catharines',
        status: 'in custody'
      }
    ],
    victim: { age: 25, city: 'Welland', injuries: 'serious', transported: 'local hospital' },
    suspects_outstanding: [],
    hate_motivated_investigation: true,
    edi_engaged_with_victim: true,
    court: [
      {
        label: 'Bail hearing',
        date: '2026-09-27',
        venue: 'Robert S. K. Welch Courthouse',
        address: '59 Church St, St. Catharines'
      }
    ],
    contact: {
      unit: '1 District',
      phone: '905-688-4111',
      ext: '1024233',
      anonymous: 'Crime Stoppers of Niagara — online or 1-800-222-TIPS (8477)'
    },
    updates: [
      {
        label: 'Update #1',
        date: '2026-09-30',
        text: 'Detectives identified the second involved male as 36-year-old William Rider of St. Catharines and charged him with aggravated assault. Rider remained in custody for a bail hearing on September 30, 2026, at the Robert S. K. Welch Courthouse, 59 Church Street. The update page title still says a male suspect is outstanding.'
      }
    ],
    source_url: 'https://www.niagarapolice.ca/news/posts/female-arrested-in-downtown-st-catharines-assault-male-suspect-outstanding/',
    update_url: 'https://www.niagarapolice.ca/news/posts/update-1-female-arrested-in-downtown-st-catharines-assault-male-suspect-outstanding/',
    nrps_incident_number: '26-122451',
    feed_published: '2026-09-30T09:00:00-04:00'
  },
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
  // Historical official releases retained from the prior archive.
  {
    id: 'nrps-2026-09-21-robbery-suspect-stc',
    date: '2026-09-21',
    headline: 'Detectives Requesting Public Assistance in Identifying Robbery Suspect',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Public Assistance / Robbery)',
    url: 'https://www.niagarapolice.ca/news/posts/detectives-requesting-public-assistance-in-identifying-robbery-suspect/',
    source: 'Niagara Regional Police Service',
    tags: ['Robbery', 'Public Assistance', 'St. Catharines', 'Thorold', '1 District', 'Knife', 'Investigation'],
    category: 'public-assistance',
  },
  {
    id: 'nrps-2026-08-17-police-service-board-meeting-advisory',
    date: '2026-08-17',
    headline: 'NOTICE OF SPECIAL VIRTUAL MEETING – NIAGARA POLICE SERVICE BOARD',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Community Notification / Public Notice',
    url: 'https://www.niagarapolice.ca/news/posts/notice-of-special-virtual-meeting-niagara-police-service-board/',
    source: 'Niagara Regional Police Service',
    tags: ['Police Service Board', 'Public Meeting', 'Region-wide', 'Advisory', 'Virtual Meeting', 'CSPA'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-09-18-community-safety-survey',
    date: '2026-09-18',
    headline: 'NRPS Releases Results of 2026 Community Safety Survey',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/nrps-releases-results-of-2026-community-safety-survey/',
    source: 'Niagara Regional Police Service',
    tags: ['Community Safety Survey', 'Strategic Plan', 'Public Consultation', 'Region-wide'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-08-27-homicide-update-7',
    date: '2026-08-27',
    headline: 'Update #7: Homicide Unit Investigating Niagara Falls Shooting',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Update / Homicide)',
    url: 'https://www.niagarapolice.ca/news/posts/update-7-homicide-unit-investigating-niagara-falls-shooting/',
    source: 'Niagara Regional Police Service',
    tags: ['Homicide', 'Niagara Falls', 'Investigation', 'Arrest', 'Update', 'Homicide Unit'],
    category: 'homicide',
  },
  {
    id: 'nrps-2026-08-26-street-to-source-drug',
    date: '2026-08-26',
    headline: 'Street to Source Drug Trafficking Initiative – 1 District CORE',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Drug Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/street-to-source-drug-trafficking-initiative-1-district-core/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'CORE', '1 District', 'St. Catharines', 'Thorold', 'Street Crime Unit'],
    category: 'drug-investigation',
    unverified: true
  },
  {
    id: 'nrps-2026-08-26-fentanyl-handgun-seized',
    date: '2026-08-26',
    headline: '$83,000 of Fentanyl and Loaded Handgun Seized by Street Crime Unit',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Media Release (Drug / Firearms Seizure)',
    url: 'https://www.niagarapolice.ca/news/posts/83-000-of-fentanyl-and-loaded-handgun-seized-by-street-crime-unit/',
    source: 'Niagara Regional Police Service',
    tags: ['Fentanyl', 'Handgun', 'Seizure', 'Street Crime Unit', '2 District', 'Niagara Falls', 'Drug Trafficking', 'St. Catharines', 'Welland', 'Thorold'],
    category: 'drug-seizure',
    unverified: true
  },
  {
    id: 'nrps-2026-08-25-2-district-traffic-stop',
    date: '2026-08-25',
    headline: '2 District Traffic Stop Results in Drug Trafficking Arrest',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Media Release (Drug Investigation / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/2-district-traffic-stop-results-in-drug-trafficking-arrest/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Traffic Stop', 'Arrest', '2 District', 'Niagara Falls', 'St. Catharines', 'Welland', 'Thorold'],
    category: 'drug-investigation',
    unverified: true
  },
  {
    id: 'nrps-2026-08-25-indecent-act-fort-erie',
    date: '2026-08-25',
    headline: 'Male Suspect to Identify in an Indecent Act Investigation in Fort Erie',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Public Assistance / Indecent Act)',
    url: 'https://www.niagarapolice.ca/news/posts/male-suspect-to-identify-in-an-indecent-act-investigation-in-fort-erie/',
    source: 'Niagara Regional Police Service',
    tags: ['Indecent Act', 'Suspect Identification', 'Fort Erie', 'Public Assistance', 'Region-wide'],
    category: 'public-assistance',
    unverified: true
  },
  {
    id: 'nrps-2026-08-24-1-district-cib-stabbing',
    date: '2026-08-24',
    headline: '1 District CIB Investigating St Catharines Stabbing',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Assault Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/1-district-cib-investigating-st-catharines-stabbing/',
    source: 'Niagara Regional Police Service',
    tags: ['Stabbing', 'CIB', '1 District', 'St. Catharines', 'Thorold', 'Investigation'],
    category: 'assault',
    unverified: true
  },
  {
    id: 'nrps-2026-08-24-proactive-traffic-welland',
    date: '2026-08-24',
    headline: 'Proactive Traffic Stop Results in Drug Trafficking Arrest - Welland',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Media Release (Drug Investigation / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/proactive-traffic-stop-results-in-drug-trafficking-arrest-welland/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Traffic Stop', 'Arrest', '3 District', 'Welland', 'St. Catharines', 'Thorold'],
    category: 'drug-investigation',
    unverified: true
  },
  {
    id: 'nrps-2026-08-24-horses-cruelty-update',
    date: '2026-08-24',
    headline: 'Update 1 – Investigation into Horses Targeted in Animal Cruelty Incident in Welland Remains Unsolved',
    municipality: 'Welland, Thorold',
    type: 'Media Release (Update / Animal Cruelty)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-investigation-into-horses-targeted-in-animal-cruelty-incident-in-welland-remains-unsolved/',
    source: 'Niagara Regional Police Service',
    tags: ['Animal Cruelty', 'Horses', 'Welland', 'Unsolved', 'Update', 'Investigation'],
    category: 'animal-cruelty',
    unverified: true
  },
  {
    id: 'nrps-2026-08-21-male-pedestrian-struck',
    date: '2026-08-21',
    headline: 'Male Pedestrian Struck in Fail to Remain Collision in St. Catharines',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/male-pedestrian-struck-in-fail-to-remain-collision-in-st-catharines/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Fail to Remain', 'Pedestrian', 'St. Catharines', 'Welland', 'Thorold', 'Investigation'],
    category: 'collision',
    unverified: true
  },
  {
    id: 'nrps-2026-08-21-female-pedestrian-struck',
    date: '2026-08-21',
    headline: 'Female Pedestrian Struck in Fail to Remain Collision in St. Catharines',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/female-pedestrian-struck-in-fail-to-remain-collision-in-st-catharines/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Fail to Remain', 'Pedestrian', 'St. Catharines', 'Thorold', 'Investigation'],
    category: 'collision',
    unverified: true
  },
  {
    id: 'nrps-2026-08-21-female-pedestrian-update',
    date: '2026-08-21',
    headline: 'Update #1: Female Pedestrian Struck in Fail to Remain Collision in St. Catharines',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Update / Collision Reconstruction)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-female-pedestrian-struck-in-fail-to-remain-collision-in-st-catharines/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Fail to Remain', 'Pedestrian', 'St. Catharines', 'Thorold', 'Collision Reconstruction', 'Update', 'Arrest'],
    category: 'collision',
    unverified: true
  },
  {
    id: 'nrps-2026-08-18-loaded-shotgun-stc',
    date: '2026-08-18',
    headline: 'Loaded Shotgun Seized in St Catharines Firearms Investigation',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Firearms Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/loaded-shotgun-seized-in-st-catharines-firearms-investigation/',
    source: 'Niagara Regional Police Service',
    tags: ['Firearms', 'Shotgun', 'Seizure', 'Search Warrant', '1 District', 'St. Catharines', 'Thorold', 'Street Crime Unit'],
    category: 'firearms',
  },
  {
    id: 'nrps-2026-08-17-west-lincoln-collision-update',
    date: '2026-08-17',
    headline: 'Update #1 - Serious Motor Vehicle Collision - West Lincoln',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Update / Collision Reconstruction)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-serious-motor-vehicle-collision-west-lincoln/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'West Lincoln', 'Fatality', 'Collision Reconstruction', 'Update', 'Region-wide'],
    category: 'collision',
  },
  {
    id: 'nrps-2026-08-15-firearms-seizure-nightclub',
    date: '2026-08-15',
    headline: 'Firearms Seizure at St. Catharines Nightclub',
    municipality: 'St. Catharines, Thorold',
    type: 'Media Release (Firearms Seizure)',
    url: 'https://www.niagarapolice.ca/news/posts/firearms-seizure-at-st-catharines-nightclub/',
    source: 'Niagara Regional Police Service',
    tags: ['Firearms', 'Seizure', 'Nightclub', 'St. Catharines', 'Thorold', '1 District', 'Proactive Patrol'],
    category: 'firearms',
  },
  {
    id: 'nrps-2026-08-12-historic-homicide-leblanc',
    date: '2026-08-12',
    headline: 'Historic Homicide Investigation - Brenda LeBlanc',
    municipality: 'St. Catharines',
    type: 'Media Release (Homicide / Public Assistance)',
    url: 'https://www.niagarapolice.ca/news/posts/historic-homicide-investigation-brenda-leblanc/',
    source: 'Niagara Regional Police Service',
    tags: ['Homicide', 'Historic', 'Public Assistance', 'Niagara Falls', 'St. Catharines', 'Homicide Unit', 'Human Remains'],
    category: 'homicide',
  },
  {
    id: 'nrps-2026-08-12-niagara-falls-weapons',
    date: '2026-08-12',
    headline: 'Niagara Falls Weapons Investigation Results in Seizure of 3 Firearms, 4 Arrested',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Media Release (Firearms Investigation / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/niagara-falls-weapons-investigation-results-in-seizure-of-3-firearms-4-arrested/',
    source: 'Niagara Regional Police Service',
    tags: ['Firearms', 'Weapons', 'Seizure', 'Arrest', '2 District', 'Niagara Falls', 'Street Crime Unit', 'St. Catharines', 'Welland', 'Thorold'],
    category: 'firearms',
  },
  {
    id: 'nrps-2026-08-11-robbery-public-assistance',
    date: '2026-08-11',
    headline: 'Detectives Seeking Public Assistance in Robbery Investigation - Niagara Falls',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Media Release (Public Assistance / Robbery)',
    url: 'https://www.niagarapolice.ca/news/posts/detectives-seeking-public-assistance-in-robbery-investigation-niagara-falls/',
    source: 'Niagara Regional Police Service',
    tags: ['Robbery', 'Public Assistance', 'Niagara Falls', 'Investigation', 'Region-wide'],
    category: 'public-assistance',
  },
  {
    id: 'nrps-2026-06-01-annual-report',
    date: '2026-06-01',
    headline: '2025 NRPS Annual Report',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Community Notification / Annual Report',
    url: 'https://www.niagarapolice.ca/news/posts/2025-nrps-annual-report/',
    source: 'Niagara Regional Police Service',
    tags: ['Annual Report', '2025', 'Community Partnerships', 'Innovation', 'Region-wide'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-03-05-ng911-live',
    date: '2026-03-05',
    headline: 'Next Generation 9-1-1 is now live',
    municipality: 'St. Catharines',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/next-generation-9-1-1-is-now-live/',
    source: 'Niagara Regional Police Service',
    tags: ['Next Generation 9-1-1', 'NG9-1-1', 'St. Catharines', 'Niagara Parks Police', 'St. Catharines Fire Services', 'Public Safety'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-02-27-ng911-implementation',
    date: '2026-02-27',
    headline: 'Niagara Regional Police Service Goes Live with Next Generation 9-1-1',
    municipality: 'St. Catharines',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/niagara-regional-police-service-goes-live-with-next-generation-9-1-1/',
    source: 'Niagara Regional Police Service',
    tags: ['Next Generation 9-1-1', 'NG9-1-1', 'Implementation', 'St. Catharines', 'Niagara Parks Police', 'St. Catharines Fire Services', 'Niagara Region'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-09-18-four-arrested-drug-trafficking-2-district',
    date: '2026-09-18',
    headline: 'Four Arrested in Drug Trafficking Investigation by 2 District Street Crime Unit',
    municipality: 'St. Catharines, Thorold, Welland',
    type: 'Media Release (Drug Investigation / Arrest)',
    url: 'https://www.niagarapolice.ca/news/posts/four-arrested-in-drug-trafficking-investigation-by-2-district-street-crime-unit/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Trafficking', 'Arrest', 'Street Crime Unit', '2 District', '1 District', '3 District', 'St. Catharines', 'Thorold', 'Welland', 'Fentanyl', 'Methamphetamine'],
    category: 'drug-investigation',
  },
  // SEP 17, 2026
  {
    id: 'nrps-2026-09-17-police-service-board-meeting-advisory',
    date: '2026-09-17',
    headline: 'ADVISORY: Niagara Police Service Board Meeting – September 24, 2026',
    municipality: 'St. Catharines, Welland, Thorold',
    type: 'Community Notification / Public Notice',
    url: 'https://www.niagarapolice.ca/news/posts/advisory-niagara-police-service-board-meeting-september-24-2026/',
    source: 'Niagara Regional Police Service',
    tags: ['Police Service Board', 'Public Meeting', 'Region-wide', 'Advisory'],
    category: 'community-notification',
  },
  {
    id: 'nrps-2026-09-17-stc-warrants-arrest',
    date: '2026-09-17',
    headline: '41-year-old St Catharines Male Arrested on 19 Outstanding Warrants',
    municipality: 'St. Catharines',
    type: 'Media Release (Warrants / Street Crime Unit)',
    url: 'https://www.niagarapolice.ca/news/posts/41-year-old-st-catharines-male-arrested-on-19-outstanding-warrants/',
    source: 'Niagara Regional Police Service',
    tags: ['Warrants', 'Arrest', 'St. Catharines', 'Street Crime Unit'],
    category: 'arrest',
  },
  {
    id: 'nrps-2026-09-17-update-mississauga-male-arrested-thorold-welland',
    date: '2026-09-17',
    headline: 'Update #1: Mississauga Male Arrested in Thorold and Welland Search Warrants',
    municipality: 'St. Catharines, Thorold, Welland',
    type: 'Media Release (Update)',
    url: 'https://www.niagarapolice.ca/news/posts/update-1-mississauga-male-arrested-in-thorold-and-welland-search-warrants/',
    source: 'Niagara Regional Police Service',
    tags: ['Drug Investigation', 'St. Catharines', 'Thorold', 'Welland', 'Search Warrants', 'Arrest', 'Update', '1 District', 'Street Crime Unit'],
    category: 'drug-investigation',
  },
  {
    id: 'nrps-2026-09-17-notl-missing-person-update-7',
    date: '2026-09-17',
    headline: 'MISSING PERSON - Male in Niagara-on-the-Lake - UPDATE 7',
    municipality: 'Niagara-on-the-Lake',
    type: 'Media Release (Missing Person Update)',
    url: 'https://www.niagarapolice.ca/news/posts/missing-person-male-in-niagara-on-the-lake-update-7/',
    source: 'Niagara Regional Police Service',
    tags: ['Missing Person', 'Niagara-on-the-Lake', 'Homicide Unit', 'Update', 'Public Appeal'],
    category: 'missing-person',
  },
  {
    id: 'nrps-2026-09-17-west-lincoln-vehicle-dismantling',
    date: '2026-09-17',
    headline: 'Motor Vehicle Dismantling Operation Shutdown by 8 District Detectives - $174,000 in Stolen Goods Recovered',
    municipality: 'West Lincoln',
    type: 'Media Release (Auto Theft / Property Crime)',
    url: 'https://www.niagarapolice.ca/news/posts/motor-vehicle-dismantling-operation-shutdown-by-8-district-detectives-174-000-in-stolen-goods-recovered/',
    source: 'Niagara Regional Police Service',
    tags: ['Auto Theft', 'West Lincoln', '8 District', 'Stolen Goods', 'Arrest'],
    category: 'property-crime',
  },
  // SEP 15, 2026
  {
    id: 'nrps-2026-09-15-project-safe-start-results',
    date: '2026-09-15',
    headline: 'Hundreds of Traffic Stops Reported During Project Safe Start – Niagara',
    municipality: 'Region-wide (St. Catharines, Welland, Thorold included)',
    type: 'Community Notification / Public Safety',
    url: 'https://www.niagarapolice.ca/news/posts/hundreds-of-traffic-stops-reported-during-project-safe-start-niagara/',
    source: 'Niagara Regional Police Service',
    tags: ['Project Safe Start', 'Traffic', 'Back to School', 'Region-wide', 'Public Safety'],
    category: 'community-notification',
  },
  // SEP 14, 2026
  {
    id: 'nrps-2026-09-14-pelham-road-rage-assault',
    date: '2026-09-14',
    headline: 'Road Rage Incident Turned Assault Leads to Charges – Pelham',
    municipality: 'Pelham, Welland, St. Catharines',
    type: 'Media Release (Assault Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/road-rage-incident-turned-assault-leads-to-charges-pelham/',
    source: 'Niagara Regional Police Service',
    tags: ['Assault', 'Road Rage', 'Pelham', 'Welland', 'St. Catharines', 'Charges'],
    category: 'assault',
  },
  // SEP 12, 2026
  {
    id: 'nrps-2026-09-12-welland-motorcycle-fatalities',
    date: '2026-09-12',
    headline: 'Motorcycle Collision Results in Two Fatalities - Welland',
    municipality: 'Welland',
    type: 'Media Release (Collision Investigation)',
    url: 'https://www.niagarapolice.ca/news/posts/motorcycle-collision-results-in-two-fatalities-welland/',
    source: 'Niagara Regional Police Service',
    tags: ['Collision', 'Motorcycle', 'Fatalities', 'Welland', 'Investigation'],
    category: 'collision',
  },
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
    unverified: true
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
    unverified: true
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
    unverified: true
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
    unverified: true
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
    unverified: true
  },
];

// Filter out unverified records — source links return 404 on niagarapolice.ca
const verifiedNrpsReleases = nrpsReleases.filter(r => !r.unverified)

export { verifiedNrpsReleases }

export function getLatestNrpsReleases(count = 10, days = 7, now = getRenderNow()) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return verifiedNrpsReleases
    .filter(r => new Date(r.date) >= cutoff)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
}

export function getNrpsReleasesByMunicipality(municipality) {
  const key = municipality.toLowerCase();
  return verifiedNrpsReleases.filter(r =>
    r.municipality.toLowerCase().includes(key) ||
    r.tags.some(t => t.toLowerCase().includes(key))
  );
}

export function getNrpsReleasesByCategory(category) {
  return verifiedNrpsReleases.filter(r => r.category === category);
}

export function getNrpsStats(now = getRenderNow()) {
  const recent = getLatestNrpsReleases(20, 30, now);
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
    total: verifiedNrpsReleases.length,
    recent7Days: getLatestNrpsReleases(20, 7, now).length,
    recent30Days: recent.length,
    byCategory,
    byMunicipality,
    latestDate,
  };
}
