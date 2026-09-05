/**
 * Local News Seeds for St. Catharines Digital
 * Static fallback / seed data for /news page.
 * When src/data/localNews.js is populated by scripts/fetch-local-news.js,
 * these seeds are overwritten by real RSS data.
 * Keep these as a graceful fallback if RSS fetch fails.
 *
 * Sources (RSS URLs defined in src/data/localNews.js localNewsSources):
 *  - St. Catharines Standard   https://www.stcatharinesstandard.ca/rss.xml
 *  - Niagara This Week         https://www.niagarathisweek.com/rss.xml
 *  - Welland Tribune           https://www.wellandtribune.ca/rss.xml
 *  - Niagara Falls Review      https://www.niagarafallsreview.ca/rss.xml
 *
 * Updated: 2026-09-05
 */

export const localNewsSeeds = [
  // ST. CATHARINES STANDARD
  {
    id: 'sc-standard-2026-09-04',
    title: 'St. Catharines city council to debate new zoning bylaws for downtown core',
    link: 'https://www.stcatharinesstandard.ca/news-story/5839399-st-catharines-council-debate-zoning-downtown/',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    municipality: 'St. Catharines',
    category: 'council',
    pubDate: '2026-09-04T08:15:00Z',
    excerpt: 'City council is set to review a new zoning bylaw package aimed at revitalizing the downtown core, with focused density allowances and streetscape improvements.',
    tags: ['City Council', 'Zoning', 'Downtown', 'St. Catharines'],
  },
  {
    id: 'sc-standard-2026-09-03',
    title: 'Regional road closures announced for Niagara Grape and Wine Festival parade',
    link: 'https://www.stcatharinesstandard.ca/news-story/5839201-road-closures-grape-wine-festival/',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    municipality: 'Niagara Region',
    category: 'community',
    pubDate: '2026-09-03T14:30:00Z',
    excerpt: 'Several major routes will be closed Saturday during the annual Niagara Grape and Wine Festival Grande Parade, with detour routes posted by the region.',
    tags: ['Events', 'Road Closures', 'Niagara Region', 'Parade'],
  },

  // NIAGARA THIS WEEK
  {
    id: 'ntw-2026-09-04',
    title: 'New community centre proposed for west St. Catharines neighbourhood',
    link: 'https://www.niagarathisweek.com/news-story/4582100-new-community-centre-west-st-catharines/',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    municipality: 'St. Catharines',
    category: 'community',
    pubDate: '2026-09-04T10:00:00Z',
    excerpt: 'A proposal for a new community centre in west St. Catharines is moving to the public consultation phase, with an open house scheduled for later this month.',
    tags: ['Community', 'Recreation', 'St. Catharines', 'Public Consultation'],
  },
  {
    id: 'ntw-2026-09-02',
    title: 'Local business owners weigh in on downtown revitalization plans',
    link: 'https://www.niagarathisweek.com/news-story/4582000-local-business-owners-downtown-revitalization/',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    municipality: 'St. Catharines',
    category: 'business',
    pubDate: '2026-09-02T09:00:00Z',
    excerpt: 'A panel of downtown business owners shared their perspectives on the city\'s ongoing revitalization efforts and what they see as the priorities for the coming year.',
    tags: ['Business', 'Downtown', 'St. Catharines', 'Economy'],
  },

  // WELLAND TRIBUNE
  {
    id: 'welland-tribune-2026-09-03',
    title: 'Welland council approves new park development in east end',
    link: 'https://www.wellandtribune.ca/news-story/3455678-welland-council-approves-park-east-end/',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    municipality: 'Welland',
    category: 'community',
    pubDate: '2026-09-03T11:00:00Z',
    excerpt: 'Welland city council has approved the development of a new park in the east end, with construction expected to begin in spring 2027.',
    tags: ['Parks', 'Welland', 'City Council', 'Recreation'],
  },
  {
    id: 'welland-tribune-2026-09-01',
    title: 'Welland man charged following investigation into fraud allegations',
    link: 'https://www.wellandtribune.ca/news-story/3455600-welland-man-charged-fraud/',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    municipality: 'Welland',
    category: 'crime',
    pubDate: '2026-09-01T16:00:00Z',
    excerpt: 'A Welland man has been charged with fraud and uttering a forged document following an investigation by Niagara Regional Police.',
    tags: ['Crime', 'Fraud', 'Charges', 'Welland', 'NRPS'],
  },

  // NIAGARA FALLS REVIEW
  {
    id: 'niagara-falls-review-2026-09-03',
    title: 'Niagara Falls tourism numbers up 12 per cent over last year: report',
    link: 'https://www.niagarafallsreview.ca/news-story/2983451-niagara-falls-tourism-numbers-up-report/',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    municipality: 'Niagara Falls',
    category: 'business',
    pubDate: '2026-09-03T07:30:00Z',
    excerpt: 'Tourism figures for Niagara Falls showed a 12 per cent increase in visitor spending over the same period last year, according to a new regional report.',
    tags: ['Tourism', 'Business', 'Niagara Falls', 'Economy'],
  },
  {
    id: 'niagara-falls-review-2026-08-31',
    title: 'Niagara Parks unveils new pathway improvements along the Niagara River',
    link: 'https://www.niagarafallsreview.ca/news-story/2983300-niagara-parks-pathway-improvements/',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    municipality: 'Niagara Falls',
    category: 'community',
    pubDate: '2026-08-31T13:00:00Z',
    excerpt: 'Niagara Parks has completed a series of pathway improvements along the Niagara River, including new lighting and accessibility upgrades.',
    tags: ['Niagara Parks', 'Pathways', 'Niagara Falls', 'Accessibility'],
  },
];

/**
 * Fallback accessor — used on server render when RSS data hasn't been fetched yet.
 * Returns seeds sorted by pubDate descending, or populates localNews if empty.
 */
export function getNewsFallback(count = 10) {
  return localNewsSeeds
    .slice()
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, count);
}
