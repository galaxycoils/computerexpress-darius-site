import { createSitemapXml } from '../src/data/routeManifest.js'

function sitemapResponse() {
  return new Response(createSitemapXml(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}

export const onRequestGet = sitemapResponse
export const onRequestHead = sitemapResponse
