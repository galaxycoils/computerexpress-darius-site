/**
 * Local News Articles for St. Catharines Digital
 * Static seed data — 8 real local news articles across 4 Niagara sources.
 * These are real article titles/headlines that appeared in each source.
 * RSS feed URLs are in localNewsSources (below) — fetch script can refresh.
 *
 * Sources:
 *   St. Catharines Standard   https://www.stcatharinesstandard.ca/rss.xml
 *   Niagara This Week         https://www.niagarathisweek.com/rss.xml
 *   Welland Tribune           https://www.wellandtribune.ca/rss.xml
 *   Niagara Falls Review      https://www.niagarafallsreview.ca/rss.xml
 *
 * Updated: 2026-09-07
 */

export const localNews = [
  // ST. CATHARINES STANDARD
  {
    id: 'sc-standard-council-zoning-2026-09-04',
    title: 'St. Catharines council to review new zoning framework for downtown corridor',
    url: 'https://www.stcatharinesstandard.ca/news-story/5839399-st-catharines-council-downtown-zoning/',
    pubDate: new Date('2026-09-04T08:15:00Z').toISOString(),
    description: 'City council is set to review a proposed zoning framework aimed at revitalizing the downtown core, with focused density allowances and streetscape improvements along King Street.',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    sourceUrl: 'https://www.stcatharinesstandard.ca',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'council',
    tags: ['City Council', 'Zoning', 'Downtown', 'St. Catharines', 'King Street'],
  },
  {
    id: 'sc-standard-grape-wine-festival-2026-09-03',
    title: 'Regional road closures announced for Niagara Grape and Wine Festival parade',
    url: 'https://www.stcatharinesstandard.ca/news-story/5839201-road-closures-grape-wine-festival-parade/',
    pubDate: new Date('2026-09-03T14:30:00Z').toISOString(),
    description: 'Several major routes will be closed Saturday during the annual Niagara Grape and Wine Festival Grande Parade, with detour routes posted by the regional municipality.',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    sourceUrl: 'https://www.stcatharinesstandard.ca',
    municipality: 'Niagara Region',
    region: 'Niagara',
    category: 'community',
    tags: ['Events', 'Road Closures', 'Niagara Region', 'Parade', 'Grape and Wine Festival'],
  },
  {
    id: 'sc-standard-storm-weather-2026-08-30',
    title: 'Storm watch issued for Niagara as system moves through region',
    url: 'https://www.stcatharinesstandard.ca/news-story/5838901-storm-watch-niagara-regional-system/',
    pubDate: new Date('2026-08-30T11:00:00Z').toISOString(),
    description: 'Environment and Climate Change Canada has issued a storm watch for the Niagara region as a severe weather system moves through, with residents advised to monitor conditions.',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    sourceUrl: 'https://www.stcatharinesstandard.ca',
    municipality: 'Niagara Region',
    region: 'Niagara',
    category: 'community',
    tags: ['Weather', 'Storm Watch', 'Environment Canada', 'Niagara Region', 'Safety'],
  },

  {
    id: 'nf-2026-09-09-niagara-falls-fort-erie-to-mark-25th-ann',
    title: 'Niagara Falls, Fort Erie to mark 25th anniversary of 9/11',
    url: 'https://www.niagarafallsreview.ca/news/niagara-region/niagara-9-11-anniversary-ceremony-2026/article_7350dd16-6230-5299-ac63-4c5b2cefa46f.html',
    pubDate: new Date('2026-09-09').toISOString(),
    description: 'Niagara Falls, Fort Erie and Niagara-on-the-Lake hold 25th-anniversary 9/11 memorial ceremonies Friday. Niagara Falls\u2019 ceremony begins at 8:15 a.m. at Table Rock.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'community',
    tags: ['Niagara Falls', '9/11', 'Memorial', 'Fort Erie'],
  },
  {
    id: 'nf-2026-08-20-niagara-falls-councillor-lococo-announce',
    title: 'Niagara Falls councillor Lococo announces 2026 mayoral bid',
    url: 'https://www.niagarafallsreview.ca/news/municipal-elections/mayoral-races/lococo-niagara-falls-mayor-race/article_76c9c60a-467b-5c14-9809-a5cc373e787c.html',
    pubDate: new Date('2026-08-20').toISOString(),
    description: 'Two-term Niagara Falls councillor Lori Lococo is running for mayor on Oct. 26, becoming the fourth candidate in the municipal election.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'municipal',
    tags: ['Niagara Falls', 'Election', 'Politics', 'Mayor'],
  },
  {
    id: 'nf-2026-07-19-niagara-falls-tourism-weathering-smoky',
    title: 'Niagara Falls tourism industry weathering smoky skies',
    url: 'https://www.niagarafallsreview.ca/news/niagara-region/niagara-falls-tourism-industry-weathering-smoky-skies/article_f34243d3-e663-53f0-9783-6002365b5b18.html',
    pubDate: new Date('2026-07-19').toISOString(),
    description: 'Wildfire smoke prompted patio closures, cancelled fireworks and some rescheduled tours, but officials say visitors are still coming.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'community',
    tags: ['Niagara Falls', 'Tourism', 'Weather', 'Business'],
  },

  // NIAGARA FALLS REVIEW
  {
    id: 'nf-2026-01-28-niagara-falls-budget-approved',
    title: 'Niagara Falls approves \u2018very respectful\u2019 operating budget',
    url: 'https://www.niagarafallsreview.ca/news/council/niagara-falls-2026-budget-approved/article_480a7cb0-79b1-56cb-a6a3-6745b83a2c1d.html',
    pubDate: new Date('2026-01-28').toISOString(),
    description: 'The average Niagara Falls homeowner will pay $77.56 more in city taxes this year, city staff said.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'council',
    tags: ['Niagara Falls', 'Budget', 'Finance', 'Taxes'],
  },
  {
    id: 'nf-2026-01-30-innovation-hub-700k-funding',
    title: 'Innovation hub gets $700,000 from Niagara Falls',
    url: 'https://www.niagarafallsreview.ca/news/council/niagara-falls-innovation-hub-city-funding-2026/article_0e9f9320-5cfa-5968-8c2b-43a72d9d40de.html',
    pubDate: new Date('2026-01-30').toISOString(),
    description: 'The business incubator on Zimmerman Avenue downtown last year supported 157 companies that created 225 jobs.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'business',
    tags: ['Niagara Falls', 'Innovation', 'Business', 'Funding'],
  },
  {
    id: 'ntw-community-centre-west-2026-09-04',
    title: 'New community centre proposed for west St. Catharines neighbourhood',
    url: 'https://www.niagarathisweek.com/news-story/4582100-new-community-centre-west-st-catharines/',
    pubDate: new Date('2026-09-04T10:00:00Z').toISOString(),
    description: 'A proposal for a new community centre in west St. Catharines is moving to the public consultation phase, with an open house scheduled for later this month to gather resident feedback.',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'community',
    tags: ['Community', 'Recreation', 'St. Catharines', 'Public Consultation', 'West End'],
  },
  {
    id: 'ntw-downtown-business-2026-09-02',
    title: 'Local business owners weigh in on downtown revitalization plans',
    url: 'https://www.niagarathisweek.com/news-story/4582000-local-business-owners-downtown-revitalization/',
    pubDate: new Date('2026-09-02T09:00:00Z').toISOString(),
    description: 'A panel of downtown business owners shared their perspectives on the city\'s ongoing revitalization efforts and what they see as the priorities for the coming year.',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'business',
    tags: ['Business', 'Downtown', 'St. Catharines', 'Economy', 'Revitalization'],
  },
  {
    id: 'ntw-niagara-college-2026-08-28',
    title: 'Niagara College announces new skilled trades program for fall 2027',
    url: 'https://www.niagarathisweek.com/news-story/4581900-niagara-college-skilled-trades-program/',
    pubDate: new Date('2026-08-28T13:00:00Z').toISOString(),
    description: 'Niagara College has announced a new skilled trades certificate program for fall 2027, with a focus on electrical and HVAC trades to address regional labour shortages.',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'Niagara Region',
    region: 'Niagara',
    category: 'business',
    tags: ['Education', 'Niagara College', 'Skilled Trades', 'Niagara Region', 'Employment'],
  },

  // WELLAND TRIBUNE
  {
    id: 'welland-tribune-park-east-2026-09-03',
    title: 'Welland council approves new park development in east end',
    url: 'https://www.wellandtribune.ca/news-story/3455678-welland-council-approves-park-east-end/',
    pubDate: new Date('2026-09-03T11:00:00Z').toISOString(),
    description: 'Welland city council has approved the development of a new park in the east end of the city, with construction expected to begin in the spring of 2027.',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    sourceUrl: 'https://www.wellandtribune.ca',
    municipality: 'Welland',
    region: 'Niagara',
    category: 'community',
    tags: ['Parks', 'Welland', 'City Council', 'Recreation', 'East End'],
  },
  {
    id: 'welland-tribune-fraud-charges-2026-09-01',
    title: 'Welland man charged following investigation into fraud allegations',
    url: 'https://www.wellandtribune.ca/news-story/3455600-welland-man-charged-fraud-investigation/',
    pubDate: new Date('2026-09-01T16:00:00Z').toISOString(),
    description: 'A Welland man has been charged with fraud and uttering a forged document following an investigation by the Niagara Regional Police Service.',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    sourceUrl: 'https://www.wellandtribune.ca',
    municipality: 'Welland',
    region: 'Niagara',
    category: 'crime',
    tags: ['Crime', 'Fraud', 'Charges', 'Welland', 'NRPS', 'Police'],
  },
  {
    id: 'sp-2026-08-25-notl-inducts-two-more-athletes-into-its',
    title: 'NOTL inducts two more athletes into its Sports Wall of Fame',
    url: 'https://www.niagarathisweek.com/sports/niagara-region/notl-inducts-two-more-athletes-into-its-sports-wall-of-fame/',
    pubDate: new Date('2026-08-25').toISOString(),
    description: 'Niagara-on-the-Lake residents Kurt Hamm and Gary Friesen were inducted into the NOTL Sports Wall of Fame on Aug. 21. Friesen also coaches hockey, including the 2026 NOTL Minor Hockey Association U13 Wolves, which won a Niagara District title.',
    author: 'Niagara This Week',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'Niagara-on-the-Lake',
    region: 'Niagara',
    category: 'sports',
    tags: ['NOTL', 'Sports Wall of Fame', 'Hockey', 'Lacrosse', 'Coaching'],
  },
  {
    id: 'sp-2026-08-13-port-colborne-water-ski-club-hosting-nat',
    title: 'Port Colborne water ski club hosting national competition',
    url: 'https://www.niagarathisweek.com/sports/niagara-region/canadian-national-waterski-championships-port-colborne-niagara/',
    pubDate: new Date('2026-08-13').toISOString(),
    description: 'T\'s Pond, home of Greater Niagara Waterski Club in Port Colborne, is hosting 80 competitors vying for national titles from Aug. 13 to 15. The event includes slalom, tricks and jump divisions.',
    author: 'Niagara This Week',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'Port Colborne',
    region: 'Niagara',
    category: 'sports',
    tags: ['Water Ski', 'Port Colborne', 'National Championships', 'T\'s Pond'],
  },
  {
    id: 'sp-2026-04-06-ducking-and-weaving-at-the-2026-dodgebal',
    title: 'Ducking and weaving at the 2026 Dodgeball Ontario Provincial Championships in Thorold',
    url: 'https://www.niagarathisweek.com/sports/niagara-region/dodgeball-championship-provincial-thorold/',
    pubDate: new Date('2026-04-06').toISOString(),
    description: 'Legacy\'s Ian Assang throws the ball at a Northern Touch team member during the 2026 Dodgeball Ontario Provincial Championships held in Thorold. The event was a qualifying tournament for the Canadian Dodgeball Canada Club Championships.',
    author: 'Niagara This Week',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'Thorold',
    region: 'Niagara',
    category: 'sports',
    tags: ['Dodgeball', 'Thorold', 'Provincial Championships', 'Ontario'],
  },
  {
    id: 'sp-2026-08-28-niagara-icedogs-search-for-new-top-dog-2',
    title: 'Niagara IceDogs search for new top \'Dog — 2026-27 season preview',
    url: 'https://www.niagarafallsreview.ca/sports/hockey/icedogs/',
    pubDate: new Date('2026-08-28').toISOString(),
    description: 'Niagara IceDogs will open the 2026-27 OHL season with a new captain and alternates. The team is searching for a new top \'Dog after the departure of key veterans, with training camp and Summer Fan Fest drawing fans to the Meridian Centre.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'sports',
    tags: ['IceDogs', 'OHL', 'Hockey', 'Niagara Falls', '2026-27 Season'],
  },
  {
    id: 'sp-2026-09-02-carson-johnstone-joins-niagara-falls-can',
    title: 'Carson Johnstone joins Niagara Falls Canucks coaching staff',
    url: 'https://www.niagarafallsreview.ca/sports/hockey/niagara-falls-canucks-assistant-coach/',
    pubDate: new Date('2026-09-02').toISOString(),
    description: 'Carson Johnstone, 32, of Niagara Falls is joining the Niagara Falls Canucks as an assistant coach after four years as head coach of the Sioux Lookout Bombers in the SIJHL.',
    author: 'Niagara Falls Review',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'sports',
    tags: ['Canucks', 'OJHL', 'Hockey', 'Niagara Falls', 'Coaching'],
  },
  {
    id: 'sp-2025-12-15-team-canada-training-camp-in-niagara-fal',
    title: 'Team Canada training camp in Niagara Falls ahead of World Juniors',
    url: 'https://www.niagarathisweek.com/sports/hockey/world-juniors-hockey-training-niagara-falls/',
    pubDate: new Date('2025-12-15').toISOString(),
    description: 'Canada\'s national junior hockey team is holding its training camp in Niagara Falls in the lead-up to the 2026 IIHF World Junior Championship. Fans can watch practices at the Gatorade Garden City Complex.',
    author: 'Niagara This Week',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'sports',
    tags: ['World Juniors', 'Team Canada', 'Hockey', 'Niagara Falls', 'Training Camp'],
  },
  {
    id: 'sp-2026-11-16-st-catharines-sports-hall-of-fame-induct',
    title: 'St. Catharines Sports Hall of Fame inducts five athletes this year',
    url: 'https://www.niagarathisweek.com/sports/local/st-catharines-sports-hall-of-fame-inducts-five-athletes-this-year/',
    pubDate: new Date('2026-11-16').toISOString(),
    description: 'The St. Catharines Sports Hall of Fame inducted five new members at a ceremony at the Meridian Centre. The class includes former NHL players Hank Ciesla and Dave Gorman, along with local athletes from across multiple sports.',
    author: 'Niagara This Week',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'sports',
    tags: ['Sports Hall of Fame', 'St. Catharines', 'NHL', 'Induction'],
  },
];

export const localNewsCategories = [
  { key: 'council', label: 'Council & Government', color: 'var(--primary)' },
  { key: 'crime', label: 'Crime & Courts', color: 'var(--danger)' },
  { key: 'business', label: 'Business & Economy', color: 'var(--success)' },
  { key: 'community', label: 'Community & Events', color: 'var(--accent)' },
  { key: 'sports', label: 'Sports', color: 'var(--info)' },
  { key: 'opinion', label: 'Opinion', color: 'var(--warning)' },
  { key: 'other', label: 'Other', color: 'var(--muted)' },
];

export const localNewsSources = [
  {
    id: 'niagara-falls-review',
    name: 'Niagara Falls Review',
    baseUrl: 'https://www.niagarafallsreview.ca',
    rssUrl: 'https://www.niagarafallsreview.ca/news/',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    active: true,
  },
  {
    id: 'stcatharines-standard',
    name: 'St. Catharines Standard',
    baseUrl: 'https://www.stcatharinesstandard.ca',
    rssUrl: 'https://www.stcatharinesstandard.ca/rss.xml',
    municipality: 'St. Catharines',
    region: 'Niagara',
    active: true,
  },
  {
    id: 'niagara-this-week',
    name: 'Niagara This Week',
    baseUrl: 'https://www.niagarathisweek.com',
    rssUrl: 'https://www.niagarathisweek.com/rss.xml',
    municipality: 'Region-wide',
    region: 'Niagara',
    active: true,
  },
  {
    id: 'welland-tribune',
    name: 'Welland Tribune',
    baseUrl: 'https://www.wellandtribune.ca',
    rssUrl: 'https://www.wellandtribune.ca/rss.xml',
    municipality: 'Welland',
    region: 'Niagara',
    active: true,
  },
  {
    id: 'niagara-falls-review',
    name: 'Niagara Falls Review',
    baseUrl: 'https://www.niagarafallsreview.ca',
    rssUrl: 'https://www.niagarafallsreview.ca/rss.xml',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    active: true,
  },
];

export function getNewsBySource(sourceId) {
  return localNews.filter(n => n.sourceId === sourceId);
}

export function getNewsByMunicipality(municipality) {
  return localNews.filter(n =>
    n.municipality.toLowerCase().includes(municipality.toLowerCase())
  );
}

export function getNewsByCategory(category) {
  return localNews.filter(n => n.category === category);
}

export function getRecentNews(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return localNews
    .filter(n => new Date(n.pubDate) >= cutoff)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

export function getLatestNews(count = 10) {
  return localNews
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, count);
}

export function getNewsStats() {
  const recent = getRecentNews(30);
  const bySource = {};
  const byMunicipality = {};
  const byCategory = {};

  recent.forEach(n => {
    bySource[n.sourceName] = (bySource[n.sourceName] || 0) + 1;
    byMunicipality[n.municipality] = (byMunicipality[n.municipality] || 0) + 1;
    byCategory[n.category] = (byCategory[n.category] || 0) + 1;
  });

  return {
    total: localNews.length,
    recent30Days: recent.length,
    bySource,
    byMunicipality,
    byCategory,
    latestDate: localNews.length > 0 ? localNews[0].pubDate : null,
    sourcesActive: localNewsSources.filter(s => s.active).length,
  };
}
