/**
 * Approved public-record entries for Hate & Extremism in Niagara.
 * Wording and source lists follow the 17 Oct 2026 dataset.
 * Records that are still awaiting approval are not in this module.
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

const THIS_WEEK_RALLY = {
  outlet: 'Niagara This Week',
  title: "Lord mayor condemns white nationalist rally at Brock's Monument",
  url: 'https://www.niagarathisweek.com/news/niagara-region/lord-mayor-condemns-white-nationalist-rally-at-brocks-monument/article_df4f1fc4-1461-5f66-b6ac-0c7e97d3e369.html',
  date: '2025-09-11',
}

const MACKENZIE_SOURCES = [CBC_RALLY.url, STANDARD_RALLY.url]

export const hateExtremismEntries = [
  record({
    id: 'case-nf-graffiti-2026',
    type: 'court-case',
    scope: 'niagara',
    title: 'Niagara Falls graffiti investigation (2026)',
    summary: 'Niagara Daily News: police charged a man "following an investigation into hate-related graffiti across the city" after "hate speech was spray painted on several buildings in Niagara Falls" (11 incidents from March 2026). 105.7 The River: "hate speech had been spray painted on buildings." Accused not named.',
    location: 'Niagara Falls',
    status: 'charged: mischief (not charged as a hate crime); before the courts',
    sources: [
      {
        outlet: 'Niagara Daily News',
        title: 'Niagara Falls man charged following hate graffiti investigation',
        url: 'https://www.niagaradailynews.ca/news/local-news-niagara/niagara-falls-man-charged-following-hate-graffiti-investigation/',
        date: '2026-05-08',
      },
      {
        outlet: '105.7 The River',
        title: 'Senior Charged with Hate Speech Crime',
        url: 'https://www.105theriver.ca/news/local-news/senior-charged-with-hate-speech-crime/',
        date: '2026-05-11',
      },
    ],
  }),
  record({
    id: 'case-welland-graffiti-2024',
    type: 'court-case',
    scope: 'niagara',
    title: 'Welland hateful graffiti spree (youth)',
    summary: 'In May 2024, property in a Welland neighbourhood was spray-painted with what the Niagara Falls Review called "hateful and obscene graffiti." Two youths were arrested. One youth pleaded guilty to five charges, including mischief and theft, and was sentenced to two years\' probation (reported 2024-07-25). Protected by the Youth Criminal Justice Act; identifying details are omitted.',
    location: 'Welland',
    status: 'convicted (guilty plea; youth sentence)',
    sources: [
      {
        outlet: 'Niagara Falls Review',
        title: "Probation for teen who 'wreaked havoc' on Welland neighbourhood",
        url: 'https://www.niagarafallsreview.ca/news/crime/probation-for-teen-who-wreaked-havoc-on-welland-neighbourhood/article_ef86e7a7-170f-50f4-95ac-8f7f5b7ff05f.html',
        date: '2024-07-25',
      },
      {
        outlet: 'St. Catharines Standard',
        title: 'Hateful vandalism in Welland neighbourhood',
        url: 'https://www.stcatharinesstandard.ca/news/crime/hateful-vandalism-in-welland-neighbourhood/article_6d8894a4-7dbc-513b-968f-ff074dc38e06.html',
        date: '2024-05-19',
        updated: '2024-07-25',
      },
    ],
  }),
  record({
    id: 'grp-second-sons',
    type: 'group',
    scope: 'niagara',
    title: 'Second Sons (Second Sons Canada)',
    summary: 'Described by CBC as a "self-described \'Canadian men\'s nationalist\' group". Experts quoted by CBC call it "an active club in all but name." The St. Catharines Standard called it "one of Canada\'s emerging white nationalist clubs." CBC reported members training in the Hamilton and Niagara area. Held a masked rally at Brock\'s Monument, Niagara-on-the-Lake, Labour Day weekend 2025.',
    location: 'Niagara-on-the-Lake',
    status: 'reported active',
    eventDateLabel: 'Labour Day weekend 2025',
    namedIndividuals: [
      {
        name: 'Jeremy MacKenzie',
        basis: 'public-figure',
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
    ],
  }),
  record({
    id: 'grp-diagolon',
    type: 'group',
    scope: 'niagara',
    title: 'Diagolon',
    summary: 'The RCMP calls it an "extremist, militia-like organization" (via CBC). GPAHE calls it a "white supremacist Canadian movement". The Standard reports the Niagara Region Anti-Racism Association said people linked with Diagolon showed up to disrupt local events. NOT on Public Safety Canada\'s listed-entities list (checked 2026-10-17).',
    location: 'Niagara Region',
    status: 'reported',
    namedIndividuals: [
      {
        name: 'Jeremy MacKenzie',
        basis: 'public-figure',
        qualifies: true,
        quotedDescription: 'founder of Diagolon (CBC 2025-09-09; St. Catharines Standard)',
        sources: MACKENZIE_SOURCES,
      },
    ],
    sources: [
      CBC_RALLY,
      STANDARD_RALLY,
      {
        outlet: 'GPAHE',
        title: 'Canadian White Supremacist Diagolon Movement Increasingly Targets the LGBTQ+ Community',
        url: 'https://globalextremism.org/post/diagolon-lgbtq/',
        date: '2023-04-27',
      },
      {
        outlet: 'GPAHE',
        title: 'White Supremacist Diagolon Movement Now Calling for Deportation of All Indians',
        url: 'https://globalextremism.org/post/white-supremacist-diagolon-movement-now-calling-for-deportation-of-all-indians/',
        date: '2024-06-06',
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
    id: 'ctx-ns13',
    type: 'group',
    scope: 'regional-context',
    title: 'Nationalist-13 (NS13)',
    summary: 'CBC: "A CBC visual investigation recently found Second Sons and active club Nationalist-13 to be training in martial arts studios, gyms and parks in the Hamilton and Niagara area."',
    location: 'Niagara Region',
    status: 'regional context',
    sources: [
      CBC_RALLY,
      {
        outlet: 'CBC News',
        title: "Tracking Canada's fascist fight clubs",
        url: 'https://www.cbc.ca/newsinteractives/features/fascist-fight-club',
        date: '2025-07-18',
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
    sources: [CBC_RALLY, STANDARD_RALLY, THIS_WEEK_RALLY],
  }),
  record({
    id: 'inc-notl-response-2025',
    type: 'response',
    scope: 'niagara',
    title: 'Niagara-on-the-Lake Lord Mayor condemns rally (council response)',
    summary: 'Lord Mayor Gary Zalepa read a statement at a Sept. 10 2025 meeting: "this group\'s message is not supported or condoned, and this type of hate has no place in our Town." A statement, NOT a formal council motion. No regional or municipal motion found yet.',
    location: 'Niagara-on-the-Lake',
    status: 'documented',
    sources: [
      {
        outlet: 'Town of Niagara-on-the-Lake',
        title: 'A Message from Lord Mayor Zalepa Following a Recent Hate Rally in the Community',
        url: 'https://www.notl.com/recreation-community/community-news/message-lord-mayor-zalepa-following-recent-hate-rally-community',
        date: '2025-09-09',
      },
      THIS_WEEK_RALLY,
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
    id: 'inc-stats-nrps-2023',
    type: 'incident',
    scope: 'niagara',
    title: 'NRPS suspected hate incidents, 2022-2023',
    summary: 'As reported by the St. Catharines Standard, citing an NRPS board report: 30 suspected hate incidents in 2023, which led to 3 charges, none of them hate crimes. 2022 had 41 incidents and 7 charges. About 67% were graffiti or mischief.',
    location: 'Niagara Region',
    status: 'reported statistic (attributed to the Standard)',
    sources: [
      {
        outlet: 'St. Catharines Standard',
        title: 'Apathy contributing to drop in hate crimes',
        url: 'https://www.stcatharinesstandard.ca/news/crime/niagaras-police-chief-fears-hate-crimes-going-unreported/article_2e7e2b8b-e236-5a06-9685-1cd32ec68e01.html',
        date: '2024 (verify exact day)',
      },
      {
        outlet: 'St. Catharines Standard',
        title: 'More officers needed to investigate Niagara hate crimes, say police',
        url: 'https://www.stcatharinesstandard.ca/news/niagara-region/more-officers-needed-to-investigate-niagara-hate-crimes-say-police/article_61e63818-405b-5755-9d04-531b66061baf.html',
        date: '2024-03-28',
      },
    ],
  }),
]

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

/** Numbers copied from the approved NRPS support record and checked against niagarapolice.ca. */
export const hateReportContacts = [
  { label: 'Emergency', value: '911', href: 'tel:911' },
  { label: 'St. Catharines, Thorold, Niagara Falls and Niagara-on-the-Lake', value: '(905) 688-4111', href: 'tel:9056884111' },
  { label: 'Fort Erie', value: '(905) 871-2300', href: 'tel:9058712300' },
  { label: 'Grimsby, Lincoln and West Lincoln', value: '(905) 945-2211', href: 'tel:9059452211' },
  { label: 'Welland, Wainfleet, Pelham and Port Colborne', value: '(905) 735-7811', href: 'tel:9057357811' },
  { label: 'Equity, diversity and inclusion desk', value: 'EDI@niagarapolice.ca', href: 'mailto:EDI@niagarapolice.ca' },
]
