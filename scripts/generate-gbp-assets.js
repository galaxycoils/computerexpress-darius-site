import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const imageDir = path.join(root, 'public/images/gbp')
const videoDir = path.join(root, 'public/video')
const frameDir = path.join(os.tmpdir(), 'stcatharines-gbp-frames')

fs.mkdirSync(imageDir, { recursive: true })
fs.mkdirSync(videoDir, { recursive: true })
fs.rmSync(frameDir, { recursive: true, force: true })
fs.mkdirSync(frameDir, { recursive: true })

const palette = {
  bg: '#07140f',
  panel: '#0e241d',
  primary: '#12d6ff',
  accent: '#34d399',
  gold: '#f5c86b',
  text: '#f4fbf8',
  muted: '#9ab4a9',
  line: '#1c4036',
}

function svgShell({ title, subtitle, label, motif = 'map', width = 1600, height = 900 }) {
  const grid = Array.from({ length: 13 }, (_, i) => `<line x1="${i * 130}" y1="0" x2="${i * 130}" y2="${height}" />`).join('')
  const rows = Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 130}" x2="${width}" y2="${i * 130}" />`).join('')
  const pins = [
    [1160, 245, 'St. Catharines'],
    [1260, 390, 'Niagara Falls'],
    [1030, 470, 'Welland'],
    [760, 310, 'Grimsby'],
    [930, 355, 'Thorold'],
  ]
    .map(([x, y, name]) => `<g transform="translate(${x} ${y})"><circle r="18" fill="${palette.primary}" opacity=".22"/><circle r="7" fill="${palette.primary}"/><text x="18" y="5" fill="${palette.muted}" font-family="Inter,Arial" font-size="22">${name}</text></g>`)
    .join('')
  const chart = [78, 64, 88, 92, 84]
    .map((h, i) => `<rect x="${950 + i * 72}" y="${620 - h * 4}" width="42" height="${h * 4}" rx="10" fill="${i === 3 ? palette.accent : palette.primary}" opacity=".86"/>`)
    .join('')

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="glow" cx="70%" cy="30%" r="55%"><stop offset="0" stop-color="${palette.primary}" stop-opacity=".26"/><stop offset="1" stop-color="${palette.bg}" stop-opacity="0"/></radialGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.panel}"/><stop offset="1" stop-color="#0a1a16"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="${palette.bg}"/>
    <rect width="100%" height="100%" fill="url(#glow)"/>
    <g stroke="${palette.line}" stroke-width="1" opacity=".48">${grid}${rows}</g>
    <rect x="88" y="86" width="560" height="710" rx="28" fill="url(#panel)" stroke="${palette.line}" stroke-width="2"/>
    <text x="130" y="165" fill="${palette.gold}" font-family="Space Mono,monospace" font-size="24" letter-spacing="3">${label}</text>
    <text x="130" y="250" fill="${palette.text}" font-family="Playfair Display,Georgia" font-size="76" font-weight="800">${title}</text>
    <foreignObject x="130" y="298" width="450" height="180"><p xmlns="http://www.w3.org/1999/xhtml" style="margin:0;color:${palette.muted};font-family:Inter,Arial;font-size:30px;line-height:1.45">${subtitle}</p></foreignObject>
    <g transform="translate(130 570)">
      <rect width="384" height="74" rx="14" fill="${palette.primary}"/>
      <text x="32" y="47" fill="#061016" font-family="Inter,Arial" font-size="28" font-weight="800">Free Audit Walkthrough</text>
    </g>
    ${motif === 'map' ? `<path d="M760 610 C880 500 980 575 1080 430 S1280 260 1440 355" fill="none" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round" opacity=".8"/>${pins}` : ''}
    ${motif === 'audit' ? `<rect x="820" y="150" width="620" height="530" rx="26" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/><circle cx="1000" cy="330" r="126" fill="none" stroke="${palette.primary}" stroke-width="26" opacity=".9"/><text x="945" y="352" fill="${palette.text}" font-family="Inter,Arial" font-size="58" font-weight="900">92</text>${chart}` : ''}
    ${motif === 'profile' ? `<circle cx="1120" cy="370" r="190" fill="${palette.panel}" stroke="${palette.line}" stroke-width="2"/><text x="1020" y="405" fill="${palette.text}" font-family="Playfair Display,Georgia" font-size="132" font-weight="900">SCD</text><rect x="860" y="620" width="520" height="60" rx="16" fill="${palette.panel}" stroke="${palette.line}"/><text x="920" y="660" fill="${palette.accent}" font-family="Inter,Arial" font-size="28" font-weight="800">Website Designer • Niagara</text>` : ''}
  </svg>`
}

const assets = [
  ['gbp-cover.webp', svgShell({ title: 'Local Authority Lab', subtitle: 'Websites, Maps visibility, and technical SEO for Niagara service businesses.', label: 'ST. CATHARINES DIGITAL', motif: 'map' }), 1600, 900],
  ['profile-mark.webp', svgShell({ title: 'St. Catharines Digital', subtitle: 'Profile-safe brand image for Google Business Profile and local listings.', label: 'LOCAL SEARCH', motif: 'profile', width: 1200, height: 1200 }), 1200, 1200],
  ['maps-visibility.webp', svgShell({ title: 'Maps Visibility', subtitle: 'Service-area diagnostics across St. Catharines, Niagara Falls, Welland, Grimsby, Thorold, and Fort Erie.', label: 'GBP DIAGNOSTIC', motif: 'map' }), 1600, 900],
  ['audit-dashboard.webp', svgShell({ title: 'Audit Dashboard', subtitle: 'A proof-safe walkthrough of mobile speed, crawl signals, schema, and conversion paths.', label: 'FREE AUDIT', motif: 'audit' }), 1600, 900],
  ['local-seo-service.webp', svgShell({ title: 'Local SEO System', subtitle: 'Service pages, GBP alignment, and technical foundations built for local discovery.', label: 'NIAGARA SEO', motif: 'map' }), 1600, 900],
  ['audit-walkthrough-poster.webp', svgShell({ title: 'Audit Walkthrough', subtitle: 'Preview the diagnostic process before booking your screen-share review.', label: '25 SECOND PREVIEW', motif: 'audit' }), 1600, 900],
]

for (const [file, svg, width, height] of assets) {
  await sharp(Buffer.from(svg)).resize(width, height).webp({ quality: 86 }).toFile(path.join(imageDir, file))
}

const frames = assets.slice(0, 5)
for (let i = 0; i < frames.length; i += 1) {
  const [file] = frames[i]
  await sharp(path.join(imageDir, file)).resize(1280, 720).png().toFile(path.join(frameDir, `frame-${String(i).padStart(2, '0')}.png`))
}

execFileSync('ffmpeg', [
  '-y',
  '-framerate',
  '1/5',
  '-i',
  path.join(frameDir, 'frame-%02d.png'),
  '-vf',
  'format=yuv420p',
  '-r',
  '30',
  '-movflags',
  '+faststart',
  path.join(videoDir, 'audit-walkthrough.mp4'),
], { stdio: 'inherit' })

fs.rmSync(frameDir, { recursive: true, force: true })
console.log('Generated GBP images and audit video.')
