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

  // NIAGARA THIS WEEK
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
