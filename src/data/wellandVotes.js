// Welland Votes 2026 — single source of truth for the voter guide.
// Names, order, and contact facts mirror the Clerk's certified registry
// (https://www.welland.ca/city-hall/municipal-elections/registered-candidates/).
// Platform condensations are the candidates' own words, verified against
// their campaign sites Sept 13 2026. Office histories from city, regional,
// and police-board records plus on-record reporting. Neutral, equal weight.

export const CITY_ELECTIONS = 'https://www.welland.ca/city-hall/municipal-elections/'
export const CITY_CANDIDATES = 'https://www.welland.ca/city-hall/municipal-elections/registered-candidates/'
export const CITY_VOTERS = 'https://www.welland.ca/city-hall/municipal-elections/information-for-voters/'
export const CITY_WARDS = 'https://www.welland.ca/city-hall/municipal-elections/ward-boundary-changes/'
export const CHAMBER_DEBATE = 'https://southniagaracc.com/event/municipal-debate-welland/'

export const MAYORAL_CANDIDATES = [
  {
    name: 'Natashia Bergen',
    office: 'Newcomer — no municipal office held',
    site: 'https://www.natashiabergen.com/platform',
    label: 'natashiabergen.com',
    points: [
      'Food security: community food programs, urban agriculture, fewer barriers for small vendors',
      'Housing First approach to affordable and supportive housing',
      'Keep the Welland hospital open; mobile clinics and community health hubs',
      'Mental-health, addiction, anti-trafficking, and accessibility initiatives',
    ],
  },
  {
    name: 'Pat Chiocchio',
    office: 'Regional councillor; 14+ years on council including vice-mayor; police board chair roles',
    site: 'https://patformayor.ca/#/issues',
    label: 'patformayor.ca',
    points: [
      'Accountable government: public KPIs and spending tied to outcomes',
      'Lower, predictable taxes via efficiency audit and zero-based budgeting',
      'Public safety: police collaboration, expanded CORE crisis response, visible patrols',
      'Housing aligned with infrastructure plus mental-health and addiction supports',
      'Save Welland Hospital campaign; treatment and HART Hub expansion',
    ],
  },
  {
    name: 'David Clow',
    office: 'No municipal office held — ran for mayor in 2018; community arts activist',
    site: null,
    label: null,
    points: [],
  },
  {
    name: 'Gary Graziani',
    office: 'Newcomer — building inspector; no elected office held',
    site: 'https://www.garygraziani.ca/policies',
    label: 'garygraziani.ca',
    points: [
      'Affordability: best value from existing spending before new taxes',
      'Accountability and plain-language explanations for overruns',
      'Transparency in why decisions are made',
      'Infrastructure first: roads, sidewalks, parks, sewers, beautification',
      'Hospital advocacy; evidence-led shelter decisions with regional partnership',
    ],
  },
  {
    name: 'April Jeffs',
    office: 'Ex-mayor of Wainfleet (2010–2018); not on Welland council',
    site: 'https://apriljeffs.ca/',
    label: 'apriljeffs.ca',
    points: [
      'Property tax relief and a record of low increases cited from Wainfleet tenure',
      'Rein in city spending and budgets described as out of control',
      'Alleviate homelessness blocking downtown potential',
      'A council described as ineffective brought back on track',
    ],
  },
  {
    name: 'David McLeod',
    office: 'Ward 2 councillor since 2014; budget chair; former vice-mayor',
    site: null,
    label: null,
    points: [],
  },
  {
    name: 'Brandon Simon',
    office: 'Newcomer — never held political office',
    site: 'https://mayorsimon.ca/plan',
    label: 'mayorsimon.ca',
    points: [
      'Tax increases kept below inflation; four-year freeze of the mayor salary',
      'Affordable-housing tax incentives tied to below-market rents; anti-renoviction work',
      '24-hour Work-to-Live housing, employment, and supports program',
      'MyWelland citizen app with verified voting and issue reporting',
      'Livestreamed town halls; biennial rental inspections; downtown conversion incentives',
    ],
  },
  {
    name: 'Graham Speck',
    office: 'Ward 5 councillor since 2018',
    site: 'https://grahamspeck.ca/a-vision-for-welland/',
    label: 'grahamspeck.ca',
    points: [
      'Cut wasteful spending; amendments against tax increases deemed unnecessary',
      'Challenge regional tax growth and question service value',
      'Shelter policy that works for residents, neighbours, and businesses',
      'Protect farmland; build where services exist',
      'Fight for Welland hospital services; 1.1 parking spaces per new unit',
    ],
  },
]

export const KEY_DATES = [
  { date: 'May 1, 2026', text: 'Nomination period opened for all offices.' },
  { date: 'August 21, 2026', text: 'Nomination Day — last day to file or withdraw before 2 p.m.' },
  { date: 'August 24, 2026', text: 'Nominations certified by the Clerk at 4 p.m. Ballot set.' },
  { date: 'October 5 – 9, 2026', text: 'Advance voting, 10 a.m. to 6 p.m. — Civic Square, 60 East Main Street.' },
  { date: 'October 17 – 25, 2026', text: 'Advance voting, 10 a.m. to 5 p.m. — Seaway Mall and Welland Public Library, 800 Niagara Street.' },
  { date: 'October 26, 2026', text: 'Voting Day, 10 a.m. to 8 p.m. One mayor elected at large.' },
  { date: 'March 30, 2027', text: 'Deadline for candidates and third parties to file financial statements.' },
]

export const DOWN_BALLOT = [
  { office: 'Ward 1 – 2 councillors', detail: '5 certified candidates' },
  { office: 'Ward 2 – 2 councillors', detail: '6 certified candidates' },
  { office: 'Ward 3 – 2 councillors', detail: '5 certified candidates' },
  { office: 'Ward 4 – 2 councillors', detail: '7 certified candidates' },
  { office: 'Ward 5 – 2 councillors', detail: '6 certified candidates' },
  { office: 'Ward 6 – 2 councillors', detail: '7 certified candidates' },
  { office: 'English Public trustee – 1', detail: '2 certified candidates' },
  { office: 'English Separate trustee – 1', detail: '3 certified candidates' },
  { office: 'French Public trustee – 1', detail: '3 certified candidates' },
]

export const RELATED_COVERAGE = [
  { id: 'welland-op-update', title: 'Welland Official Plan Update — Statutory Public Meeting', dek: 'The document that will shape what the next council votes on.' },
  { id: 'welland-opa-55', title: 'Proposed Planning Applications (PPI-01-23-2025)', dek: 'Active files moving through the planning department.' },
  { id: 'welland-draft-subdivision', title: 'Proposed Draft Plan of Subdivision (PN-05-22-2025)', dek: 'Growth pressure the next mayor inherits.' },
  { id: 'welland-first-st-coa-2026-09-28', title: '37-40 First Street — Consents and Access-Aisle Variances', dek: 'Before committee September 28.' },
]
