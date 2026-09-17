// Local News Seeds for St. Catharines Digital
//
// Static fallback data for when the D1-backed API is unavailable during SSR/prerender.
// Not the primary data source — see functions/cron/fetch-local-news.js for the live RSS fetcher
// and functions/api/local-news.js for the D1 API.

export const localNewsSeeds = [
  {
    id: 'stcatharines-standard-council-2026-01-15',
    title: 'St. Catharines City Council approves 2026 budget',
    url: 'https://www.stcatharinesstandard.ca/news/local-st-catharines/council-approves-budget-1234567',
    sourceId: 'stcatharines-standard',
    sourceName: 'St. Catharines Standard',
    sourceUrl: 'https://www.stcatharinesstandard.ca',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'council',
    description: 'City council voted unanimously to approve the 2026 operating and capital budgets, with a 3.2% tax increase for residents.',
    pubDate: '2026-01-15T14:30:00.000Z',
    tags: ['council', 'St. Catharines'],
  },
  {
    id: 'niagara-this-week-police-2026-01-14',
    title: 'NRPS investigates break-in at local business on Felicity Drive',
    url: 'https://www.niagarathisweek.com/news/crime/nrps-investigates-break-in-7654321',
    sourceId: 'niagara-this-week',
    sourceName: 'Niagara This Week',
    sourceUrl: 'https://www.niagarathisweek.com',
    municipality: 'St. Catharines',
    region: 'Niagara',
    category: 'crime',
    description: 'Police are seeking information after a break-in at a local business on Felicity Drive late Saturday night.',
    pubDate: '2026-01-14T09:15:00.000Z',
    tags: ['crime', 'St. Catharines'],
  },
  {
    id: 'welland-tribune-community-2026-01-13',
    title: 'Welland goes green: New community garden opens on Young Street',
    url: 'https://www.wellandtribune.ca/news/welland/goes-green-new-community-garden-8765432',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    sourceUrl: 'https://www.wellandtribune.ca',
    municipality: 'Welland',
    region: 'Niagara',
    category: 'community',
    description: 'A new community garden is sprouting up in downtown Welland, offering residents a green space to grow their own vegetables.',
    pubDate: '2026-01-13T16:00:00.000Z',
    tags: ['community', 'Welland'],
  },
  {
    id: 'niagara-falls-review-business-2026-01-12',
    title: 'Niagara Falls Review — Border services changes could affect tourism',
    url: 'https://www.niagarafallsreview.ca/news/business/border-changes-tourism-9876543',
    sourceId: 'niagara-falls-review',
    sourceName: 'Niagara Falls Review',
    sourceUrl: 'https://www.niagarafallsreview.ca',
    municipality: 'Niagara Falls',
    region: 'Niagara',
    category: 'business',
    description: 'Changes to border services protocols at the Peace Bridge may impact tourism numbers heading into peak season.',
    pubDate: '2026-01-12T11:45:00.000Z',
    tags: ['business', 'Niagara Falls'],
  },
  {
    id: 'niagara-region-planning-2026-01-11',
    title: 'Niagara Region council debates new landfill site proposal',
    url: 'https://www.niagararegion.ca/news/regional-council/landfill-debate-ABCDEFGH',
    sourceId: 'niagara-region',
    sourceName: 'Niagara Region',
    sourceUrl: 'https://www.niagararegion.ca',
    municipality: 'Niagara Region',
    region: 'Niagara',
    category: 'council',
    description: 'Regional councillors heard presentations from two companies proposing new waste management sites in the province.',
    pubDate: '2026-01-11T09:30:00.000Z',
    tags: ['council', 'Niagara Region'],
  },
  {
    id: 'welland-tribune-sports-2026-01-10',
    title: 'Welland Trophy Centre hosts annual hockey tournament',
    url: 'https://www.wellandtribune.ca/news/sports/trophy-centre-tournament-2468135',
    sourceId: 'welland-tribune',
    sourceName: 'Welland Tribune',
    sourceUrl: 'https://www.wellandtribune.ca',
    municipality: 'Welland',
    region: 'Niagara',
    category: 'sports',
    description: 'Over 20 teams from across Niagara competed in the annual Welland Trophy Centre hockey tournament this weekend.',
    pubDate: '2026-01-10T18:00:00.000Z',
    tags: ['sports', 'Welland'],
  },
];

/**
 * Get news by source ID
 */
export function getNewsBySource(sourceId) {
  return localNewsSeeds.filter(n => n.sourceId === sourceId);
}

/**
 * Get news by municipality
 */
export function getNewsByMunicipality(municipality) {
  return localNewsSeeds.filter(n => 
    n.municipality.toLowerCase().includes(municipality.toLowerCase())
  );
}

/**
 * Get news by category
 */
export function getNewsByCategory(category) {
  return localNewsSeeds.filter(n => n.category === category);
}

/**
 * Get recent news (last N days)
 */
export function getRecentNews(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return localNewsSeeds
    .filter(n => new Date(n.pubDate) >= cutoff)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}

/**
 * Get latest news (most recent N items)
 */
export function getLatestNews(count = 10) {
  return localNewsSeeds
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .slice(0, count);
}

/**
 * Get news statistics
 */
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
    total: localNewsSeeds.length,
    recent30Days: recent.length,
    bySource,
    byMunicipality,
    byCategory,
    latestDate: localNewsSeeds.length > 0 ? localNewsSeeds[0].pubDate : null,
  };
}
