/**
 * Approved public-record entries for Hate & Extremism in Niagara.
 * Dariush's first batch, 17 Oct 2026. Unreviewed case, response, and
 * NRPS-statistic records are not in this module.
 */

const REVIEWED = '2026-10-17'

function record(entry) {
  return {
    dateAdded: REVIEWED,
    lastReviewed: REVIEWED,
    corrections: [],
    namedIndividuals: [],
    correctionRequest: `/corrections?entry=${entry.id}`,
    ...entry,
  }
}

const CBC_RALLY = {
  outlet: 'CBC News',
  title: "Niagara rally by masked members of men's 'nationalist club' raises fears of growing extremism",
  url: 'https://www.cbc.ca/news/canada/hamilton/second-sons-rally-in-niagara-1.7628162',
  date: '2025-09-09',
}

const STANDARD_RALLY = {
  outlet: 'St. Catharines Standard',
  title: "'Public and open with their hate': Masked white nationalist group marches at popular Niagara monument",
  url: 'https://www.stcatharinesstandard.ca/news/niagara-region/public-and-open-with-their-hate-masked-white-nationalist-group-marches-at-popular-niagara-monument/article_e197d7cf-445b-5e9e-9bb5-36dd4986ac0e.html',
  date: '2025-09-04',
}

const CAHN_DIAGOLON = {
  outlet: 'Canadian Anti-Hate Network',
  title: "Diagolon: Canada's Homegrown White Nationalist Network",
  url: 'https://www.antihate.ca/diagolon_canada_homegrown_white_nationalist_network',
  date: '2025 (verify exact day)',
}

const MACKENZIE_SOURCES = [CBC_RALLY.url, STANDARD_RALLY.url]

export const hateExtremismEntries = [
  record({
    id: 'grp-second-sons',
    type: 'group',
    scope: 'niagara',
    title: 'Second Sons (Second Sons Canada)',
    summary: 'Described by CBC as a "self-described \'Canadian men\'s nationalist\' group". Experts quoted by CBC call it "an active club in all but name." The St. Catharines Standard called it "one of Canada\'s emerging white nationalist clubs." CBC reported members training in the Hamilton and Niagara area. Held a masked rally at Brock\'s Monument, Niagara-on-the-Lake, Labour Day weekend 2025. CAHN says Diagolon\'s leaders created it as "a new organization with membership requirements."',
    location: 'Niagara-on-the-Lake',
    status: 'reported active',
    eventDateLabel: 'Labour Day weekend 2025',
    namedIndividuals: [
      {
        name: 'Jeremy MacKenzie',
        basis: 'self-identified-leader',
        qualifies: true,
        quotedDescription: '"Second Sons leader Jeremy MacKenzie is also the founder of Diagolon" (CBC, 2025-09-09); "launched Second Sons Canada earlier this year and led the march at Queenston Heights" (St. Catharines Standard)',
        sources: MACKENZIE_SOURCES,
      },
    ],
    sources: [
      {
        outlet: 'CBC News',
        title: "Tracking Canada's fascist fight clubs",
        url: 'https://www.cbc.ca/newsinteractives/features/fascist-fight-club',
        date: '2025-07-18',
      },
      CBC_RALLY,
      STANDARD_RALLY,
      CAHN_DIAGOLON,
    ],
  }),
  record({
    id: 'grp-diagolon',
    type: 'group',
    scope: 'niagara',
    title: 'Diagolon',
    summary: 'The RCMP calls it an "extremist, militia-like organization" (via CBC). CAHN: "one of the largest and most active white nationalist networks in Canada". GPAHE calls it a "white supremacist Canadian movement". The Standard reports the Niagara Region Anti-Racism Association said people linked with Diagolon showed up to disrupt local events. NOT on Public Safety Canada\'s listed-entities list (checked 2026-10-17).',
    location: 'Niagara Region',
    status: 'reported',
    namedIndividuals: [
      {
        name: 'Jeremy MacKenzie',
        basis: 'self-identified-leader',
        qualifies: true,
        quotedDescription: 'founder of Diagolon (CBC 2025-09-09; St. Catharines Standard)',
        sources: MACKENZIE_SOURCES,
      },
    ],
    sources: [
      CBC_RALLY,
      STANDARD_RALLY,
      CAHN_DIAGOLON,
      {
        outlet: 'GPAHE',
        title: 'Canadian White Supremacist Diagolon Movement Increasingly Targets the LGBTQ+ Community',
        url: 'https://globalextremism.org/post/diagolon-lgbtq/',
        date: '2023 (verify exact day)',
      },
      {
        outlet: 'GPAHE',
        title: 'White Supremacist Diagolon Movement Now Calling for Deportation of All Indians',
        url: 'https://globalextremism.org/post/white-supremacist-diagolon-movement-now-calling-for-deportation-of-all-indians/',
        date: '2024 (verify exact day)',
      },
      {
        outlet: 'Public Safety Canada',
        title: 'Currently listed entities',
        url: 'https://www.publicsafety.gc.ca/cnt/ntnl-scrt/cntr-trrrsm/lstd-ntts/crrnt-lstd-ntts-en.aspx',
        date: 'last amended 2026-06-04',
      },
    ],
  }),
  record({
    id: 'inc-brocks-monument-2025',
    type: 'incident',
    scope: 'niagara',
    title: "Second Sons masked rally at Brock's Monument, Niagara-on-the-Lake",
    summary: 'About 50 masked men marched to Queenston Heights on Labour Day weekend 2025. CBC reported Aug. 31 and Niagara Parks gave Aug. 30, so this record does not assign a single day. CBC said it prompted "concerns about rising anti-immigrant sentiment." Niagara Parks: "no incidents were reported."',
    location: 'Niagara-on-the-Lake',
    status: 'documented',
    eventDateLabel: 'Labour Day weekend 2025',
    sources: [
      CBC_RALLY,
      STANDARD_RALLY,
      {
        outlet: 'Niagara This Week',
        title: "Lord mayor condemns white nationalist rally at Brock's Monument",
        url: 'https://www.niagarathisweek.com/news/niagara-region/lord-mayor-condemns-white-nationalist-rally-at-brocks-monument/article_df4f1fc4-1461-5f66-b6ac-0c7e97d3e369.html',
        date: '2025-09-11',
      },
    ],
  }),
  record({
    id: 'inc-stats-statcan',
    type: 'statistic',
    scope: 'niagara',
    title: 'Police-reported hate crimes, St. Catharines-Niagara CMA, 2022-2024',
    summary: 'StatCan: 33 (2022, 6.5/100k), 34 (2023, 6.5/100k), 33 (2024, 6.1/100k). Note: includes suspected incidents.',
    location: 'St. Catharines-Niagara',
    status: 'official statistic',
    methodologyNote: 'includes suspected incidents',
    sources: [
      {
        outlet: 'Statistics Canada',
        title: 'Table 5: Number and rate of police-reported hate crimes, by CMA, 2022 to 2024',
        url: 'https://www150.statcan.gc.ca/n1/daily-quotidien/260330/t005a-eng.htm',
        date: '2026-03-30',
      },
    ],
  }),
  record({
    id: 'ctx-ns13',
    type: 'group',
    scope: 'regional-context',
    title: 'Nationalist-13 (NS13), Hamilton-based active club',
    summary: 'CBC: "A CBC visual investigation recently found Second Sons and active club Nationalist-13 to be training in martial arts studios, gyms and parks in the Hamilton and Niagara area." CBC also calls it "Hamilton-based".',
    location: 'Hamilton',
    status: 'regional context',
    sources: [
      {
        outlet: 'CBC News',
        title: "Tracking Canada's fascist fight clubs",
        url: 'https://www.cbc.ca/newsinteractives/features/fascist-fight-club',
        date: '2025-07-18',
      },
      CBC_RALLY,
    ],
  }),
]

/**
 * Support resources. NRPS numbers were read from the Report Hate page on
 * 17 Oct 2026. Each URL below returned HTTP 200 the same day. No unverified
 * phone number is published.
 */
export const hateExtremismSupport = [
  {
    id: 'res-nrps',
    title: 'Niagara Regional Police: report hate',
    summary: 'Emergency: 911. Non-emergency hate crime or incident: (905) 688-4111 for St. Catharines, Thorold, Niagara Falls and NOTL; (905) 871-2300 for Fort Erie; (905) 945-2211 for Grimsby, Lincoln and West Lincoln; (905) 735-7811 for Welland, Wainfleet, Pelham and Port Colborne. EDI@niagarapolice.ca.',
    status: 'active',
    lastReviewed: REVIEWED,
    sources: [
      {
        outlet: 'Niagara Regional Police Service',
        title: 'Report Hate',
        url: 'https://www.niagarapolice.ca/what-we-do/equity-diversity-and-inclusion/report-hate/',
        date: 'undated page (accessed 2026-10-17)',
      },
      {
        outlet: 'Niagara Regional Police Service',
        title: 'Equity, Diversity, and Inclusion',
        url: 'https://www.niagarapolice.ca/what-we-do/equity-diversity-and-inclusion/',
        date: 'undated page (accessed 2026-10-17)',
      },
    ],
  },
  {
    id: 'res-nrara',
    title: 'Niagara Region Anti-Racism Association (NRARA)',
    summary: 'Accepts reports of racism or hate. Offers to report to police on a person\'s behalf. Contact info@nrara.org.',
    status: 'active',
    lastReviewed: REVIEWED,
    sources: [
      {
        outlet: 'NRARA',
        title: 'Niagara Region Anti-Racism Association',
        url: 'https://nrara.org/',
        date: 'undated (accessed 2026-10-17)',
      },
      {
        outlet: 'NRARA',
        title: 'What can I do if I see RACISM?',
        url: 'https://nrara.org/wp-content/uploads/2023/07/NRARA-what-to-do-about-racism-230727.pdf',
        date: '2023-07-27',
      },
    ],
  },
  {
    id: 'res-legal-clinic',
    title: 'Niagara Community Legal Clinic: human rights',
    summary: 'Free legal help for low-income people, including discrimination claims under the Ontario Human Rights Code.',
    status: 'active',
    lastReviewed: REVIEWED,
    sources: [
      {
        outlet: 'Niagara Community Legal Clinic',
        title: 'Human Rights',
        url: 'https://www.niagaracommunitylegalclinic.com/legal-topic/human-rights/',
        date: 'undated (accessed 2026-10-17)',
      },
      {
        outlet: 'NRARA',
        title: 'What can I do if I see RACISM?',
        url: 'https://nrara.org/wp-content/uploads/2023/07/NRARA-what-to-do-about-racism-230727.pdf',
        date: '2023-07-27',
      },
    ],
  },
  {
    id: 'res-pride-niagara',
    title: 'Pride Niagara',
    summary: '2SLGBTQ+ community organization.',
    status: 'active',
    lastReviewed: REVIEWED,
    sources: [
      {
        outlet: 'Pride Niagara',
        title: 'Home',
        url: 'https://www.prideniagara.com/',
        date: 'undated (accessed 2026-10-17)',
      },
    ],
  },
]

export const hateReportContacts = [
  { label: 'Emergency', value: '911', href: 'tel:911' },
  { label: 'St. Catharines, Thorold, Niagara Falls and Niagara-on-the-Lake', value: '(905) 688-4111', href: 'tel:9056884111' },
  { label: 'Fort Erie', value: '(905) 871-2300', href: 'tel:9058712300' },
  { label: 'Grimsby, Lincoln and West Lincoln', value: '(905) 945-2211', href: 'tel:9059452211' },
  { label: 'Welland, Wainfleet, Pelham and Port Colborne', value: '(905) 735-7811', href: 'tel:9057357811' },
  { label: 'Equity, diversity and inclusion desk', value: 'EDI@niagarapolice.ca', href: 'mailto:EDI@niagarapolice.ca' },
]
