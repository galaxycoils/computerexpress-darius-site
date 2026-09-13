// Measure monetization readiness for stcatharinesdigital
// Scores 0-100 based on operational revenue paths visible to visitors
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/cmd/workspace/stcatharinesdigital-site';
const SRC = join(ROOT, 'src');
const FUNCTIONS = join(ROOT, 'functions');

function read(p) {
  try { return readFileSync(p, 'utf-8'); } catch { return ''; }
}

function exists(p) { return existsSync(p); }

function walk(dir, exts = ['.js', '.jsx', '.ts', '.tsx', '.css']) {
  const out = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(p, exts));
      else if (exts.some(e => entry.name.endsWith(e))) out.push(p);
    }
  } catch {}
  return out;
}

const allFiles = walk(SRC);
const allFunctions = walk(FUNCTIONS);
const allContent = allFiles.map(read).join('\n') + allFunctions.map(read).join('\n');

let score = 0;
const findings = [];

// 1. Sponsorship page exists and has tiers (0-15 pts)
const sponsorPage = allFiles.find(p => p.includes('Sponsor'));
if (sponsorPage) {
  const content = read(sponsorPage);
  const tierCount = (content.match(/\$[\d]+/g) || []).length;
  if (tierCount >= 3) { score += 15; findings.push(`Sponsorship page with ${tierCount} price points (+15)`); }
  else if (tierCount >= 1) { score += 8; findings.push(`Sponsorship page with ${tierCount} price point(s) (+8)`); }
} else {
  findings.push('No sponsorship page found (0)');
}

// 2. Planning alerts system (0-20 pts)
const hasAlerts = allContent.includes('/api/alerts') && allContent.includes('verify');
if (hasAlerts) {
  score += 20; findings.push('Planning alerts API with verification (+20)');
} else if (allContent.includes('planning-alerts')) {
  score += 10; findings.push('Planning alerts page exists but API incomplete (+10)');
}

// 3. eTransfer payment path (0-15 pts)
const hasEtransfer = allContent.includes('cccemt@pm.me') && allContent.includes('eTransfer');
if (hasEtransfer) { score += 15; findings.push('eTransfer payment path operational (+15)'); }
else if (allContent.includes('cccemt@pm.me')) { score += 8; findings.push('eTransfer email present but no clear CTA (+8)'); }

// 4. Newsletter capture (0-10 pts)
const hasNewsletter = allContent.includes('/api/newsletter') && allContent.includes('subscribe');
if (hasNewsletter) { score += 10; findings.push('Newsletter capture API (+10)'); }

// 5. CTA coverage on homepage (0-15 pts)
const homePage = allFiles.find(p => p.toLowerCase().includes('home') || p.toLowerCase().includes('index'));
if (homePage) {
  const content = read(homePage);
  const ctaCount = (content.match(/to\s*=\s*["']\/?(sponsor|alerts|subscribe|donate|support|member|planning-alerts|membership)/gi) || []).length;
  if (ctaCount >= 3) { score += 15; findings.push(`Homepage has ${ctaCount} monetization CTAs (+15)`); }
  else if (ctaCount >= 1) { score += 8; findings.push(`Homepage has ${ctaCount} monetization CTA(s) (+8)`); }
  else { findings.push('No monetization CTAs on homepage (0)'); }
} else {
  findings.push('No homepage found (0)');
}

// 6. Founding supporters / membership tier (0-10 pts)
const hasMembership = allContent.includes('founding') || allContent.includes('supporter') || allContent.includes('member') || allContent.includes('membership');
if (hasMembership) { score += 10; findings.push('Founding supporters / membership tier present (+10)'); }

// 6b. Membership page exists (0-5 pts)
const hasMembershipPage = allFiles.some(p => p.toLowerCase().includes('membership'));
if (hasMembershipPage) { score += 5; findings.push('Dedicated membership page (+5)'); }

// 7. Pricing page or clear pricing display (0-10 pts)
const hasPricing = allContent.includes('$49') || allContent.includes('$150') || allContent.includes('$300');
if (hasPricing) { score += 10; findings.push('Clear pricing displayed (+10)'); }

// 8. Contact/revenue email visible (0-5 pts)
const hasContact = allContent.includes('cccemt@pm.me') || allContent.includes('hello@');
if (hasContact) { score += 5; findings.push('Revenue contact email visible (+5)'); }

console.log(JSON.stringify({ score, findings }, null, 2));
