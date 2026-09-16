import test from 'node:test'
import assert from 'node:assert/strict'
import { createRssXml } from '../functions/rss.xml.js'

test('RSS feed publishes permanent sourced article URLs and escapes text', () => {
  const xml = createRssXml([{
    slug: 'example', title: 'A & B <plan>', description: 'A "quoted" record', publishedDate: '2026-09-16', type: 'Planning',
  }])
  assert.match(xml, /https:\/\/stcatharinesdigital\.ca\/articles\/example\//)
  assert.match(xml, /A &amp; B &lt;plan&gt;/)
  assert.match(xml, /A &quot;quoted&quot; record/)
})
