import test from 'node:test'
import assert from 'node:assert/strict'
import { canonicalizeLink, extractCandidates, fetchHtml, decodeEntities, parseArgs } from './collect-official-news.js'
import { sourceRegistry, sourceById } from '../src/data/sourceRegistry.js'

const source = { id: 'test', name: 'Official source', city: 'Test', kind: 'official-notice', url: 'https://city.example/news/' }

test('rejects off-origin URLs, credentials, ports and insecure schemes', () => {
  for (const url of ['https://other.example/news/a', 'http://city.example/news/a', 'https://city.example:444/news/a', 'https://user@city.example/news/a', 'javascript:alert(1)']) {
    assert.equal(canonicalizeLink(url, source.url), null)
  }
})
test('normalizes tracking links and HTML-encoded query parameters', () => {
  assert.equal(canonicalizeLink('/news/posts/a?id=1&utm_source=x#top', source.url), 'https://city.example/news/posts/a?id=1')
})
test('deduplicates candidates without inventing publication dates', () => {
  const html = '<a href="/news/posts/a">Council meeting notice</a><a href="/news/posts/a?utm_source=x">Council meeting notice</a>'
  const items = extractCandidates(html, source)
  assert.equal(items.length, 1)
  assert.equal(items[0].sourcePublishedAt, null)
  assert.equal(items[0].reviewRequired, true)
})
test('ignores links embedded inside scripts', () => {
  assert.equal(extractCandidates('<script><a href="/news/posts/a">Not a visible news item</a></script>', source).length, 0)
})
test('malformed numeric entities do not crash collection', () => {
  assert.equal(decodeEntities('&#999999999; &#xD800;'), '\uFFFD \uFFFD')
})
test('requires an explicit source argument', () => {
  assert.throws(() => parseArgs(['--source']), /Missing source/)
  assert.throws(() => parseArgs(['--source', '--write']), /Missing source/)
  assert.equal(parseArgs([]).write, false)
})
test('fetch disables redirects and enforces streamed byte limit', async () => {
  const original = globalThis.fetch
  let cancelled = false
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options.redirect, 'error')
      return new Response(new ReadableStream({
        start(controller) { controller.enqueue(new Uint8Array(2_000_001)) },
        cancel() { cancelled = true },
      }), { headers: { 'content-type': 'text/html' } })
    }
    await assert.rejects(fetchHtml(source), /size limit/)
    assert.equal(cancelled, true)
  } finally {
    globalThis.fetch = original
  }
})
test('accepts bounded HTML responses', async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () => new Response('<html>ok</html>', { headers: { 'content-type': 'text/html' } })
    assert.equal(await fetchHtml(source), '<html>ok</html>')
  } finally {
    globalThis.fetch = original
  }
})

test('ignores listing filters and navigation pages on a news index', () => {
  const indexSource = { ...source, url: 'https://city.example/news/default.aspx' }
  const html = [
    '<a href="/news/default.aspx?q=Council">Government and Council</a>',
    '<a href="/news/contacts.aspx">Media Contacts</a>',
    '<a href="/news/article.aspx?id=42">Council approves 2027 capital budget</a>',
  ].join('')
  const items = extractCandidates(html, indexSource)
  assert.deepEqual(items.map(item => item.title), ['Council approves 2027 capital budget'])
})

test('rejects author pages, category indexes, and nav-label titles', () => {
  const html = [
    '<a href="/news/authors/city-of-st-catharines/">City of St. Catharines</a>',
    '<a href="/news?category=News">News releases</a>',
    '<a href="/news/">All Categories</a>',
    '<a href="/news/media-releases/">Media Releases</a>',
    '<a href="/news/public-notices/">Public Notices</a>',
    '<a href="/news/events.aspx">Upcoming Events</a>',
    '<a href="/news/posts/notice-of-hearing-455-welland-avenue/">Notice of Hearing: 455 Welland Avenue</a>',
  ].join('')
  const items = extractCandidates(html, source)
  assert.deepEqual(items.map(item => item.title), ['Notice of Hearing: 455 Welland Avenue'])
  assert.match(items[0].url, /\/news\/posts\//)
})

test('accepts municipal post paths and region notice.aspx articles', () => {
  const region = { ...source, url: 'https://www.niagararegion.ca/news/notices/default.aspx' }
  const cityHtml = [
    '<a href="/news/posts/hundreds-of-traffic-stops/">Hundreds of Traffic Stops Reported</a>',
    '<a href="/news/news/notice-of-public-information-centre-mcmillan-park-project/">Notice of Public Information Centre</a>',
    '<a href="/news/notices/default.aspx">Public Notices</a>',
  ].join('')
  const regionHtml = [
    '<a href="notice.aspx?q=1024">Quaker Road sanitary trunk sewer upgrade in Welland and Pelham</a>',
    '<a href="/news/notices/default.aspx">Public Notices</a>',
    '<a href="https://createsend.com/t/t-abc">External campaign link is ignored</a>',
  ].join('')
  const fromCity = extractCandidates(cityHtml, source)
  const fromRegion = extractCandidates(regionHtml, region)
  assert.deepEqual(fromCity.map(i => i.title).sort(), [
    'Hundreds of Traffic Stops Reported',
    'Notice of Public Information Centre',
  ].sort())
  assert.equal(fromRegion.length, 1)
  assert.equal(fromRegion[0].url.includes('notice.aspx?q=1024'), true)
  assert.equal(fromRegion.some(i => /Public Notices/i.test(i.title)), false)
})

test('source registry points Niagara Region at same-origin public notices', () => {
  const region = sourceById['niagara-region-news']
  assert.ok(region)
  assert.equal(region.enabled, true)
  assert.equal(region.reviewRequired, true)
  assert.match(region.url, /^https:\/\/www\.niagararegion\.ca\/news\/notices\//)
  assert.equal(sourceRegistry.filter(s => s.enabled).length >= 5, true)
})
