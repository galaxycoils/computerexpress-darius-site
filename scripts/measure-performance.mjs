// Performance metric for stcatharinesdigital
import { execFile } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/cmd/workspace/stcatharinesdigital-site';
const DIST = join(ROOT, 'dist');

// 1. Bundle size (0-25 pts)
function bundleScore() {
  try {
    const files = readdirSync(DIST, { recursive: true, withFileTypes: true });
    let totalKB = 0;
    let jsKB = 0;
    let cssKB = 0;
    const breakdown = {};
    
    for (const f of files) {
      if (f.isFile()) {
        const p = join(f.parentPath, f.name);
        try {
          const size = statSync(p).size;
          const ext = f.name.split('.').pop()?.toLowerCase();
          const kb = size / 1024;
          totalKB += kb;
          if (ext === 'js') jsKB += kb;
          if (ext === 'css') cssKB += kb;
          if (['js', 'css', 'html', 'svg', 'png', 'webp', 'woff2'].includes(ext)) {
            breakdown[ext] = (breakdown[ext] || 0) + kb;
          }
        } catch {}
      }
    }
    
    const criticalKB = jsKB + cssKB;
    let score = 0;
    if (criticalKB < 100) score = 25;
    else if (criticalKB < 150) score = 22;
    else if (criticalKB < 200) score = 18;
    else if (criticalKB < 250) score = 14;
    else if (criticalKB < 300) score = 10;
    else if (criticalKB < 400) score = 6;
    else score = 3;
    
    return { score, totalKB: Math.round(totalKB), jsKB: Math.round(jsKB), cssKB: Math.round(cssKB), criticalKB: Math.round(criticalKB), breakdown };
  } catch (e) {
    return { score: 0, error: e.message };
  }
}

// 2. Core Web Vitals via Lighthouse (0-75 pts)
function cwvScore() {
  return new Promise((resolve) => {
    try {
      const chromePath = '/tmp/puppeteer-cache/chrome/mac_arm-153.0.8010.36/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
      const args = [
        'https://stcatharinesdigital.ca/',
        '--chrome-flags=--headless --no-sandbox',
        '--port=9222',
        '--output=json',
        '--quiet',
        '--no-upload',
        `--chrome-path=${chromePath}`
      ];
      
      execFile(join(ROOT, 'node_modules/.bin/lighthouse'), args, {
        cwd: ROOT,
        timeout: 90000,
        encoding: 'utf-8',
        maxBuffer: 50 * 1024 * 1024
      }, (error, stdout) => {
        try {
          const json = JSON.parse(stdout);
          const lhr = json.lhr || json;
          
          const lcp = lhr.audits?.['largest-contentful-paint']?.numericValue || 0;
          const tbt = lhr.audits?.['total-blocking-time']?.numericValue || 0;
          const cls = lhr.audits?.['cumulative-layout-shift']?.numericValue || 0;
          const si = lhr.audits?.['speed-index']?.numericValue || 0;
          const perfScore = lhr.categories?.performance?.score || 0;
          
          let lcpPts = lcp < 2500 ? 25 : lcp < 4000 ? 15 : lcp < 6000 ? 8 : 3;
          let tbtPts = tbt < 200 ? 20 : tbt < 600 ? 12 : tbt < 1000 ? 6 : 2;
          let clsPts = cls < 0.1 ? 15 : cls < 0.25 ? 10 : cls < 0.5 ? 5 : 2;
          let siPts = si < 3400 ? 15 : si < 5800 ? 10 : si < 8000 ? 5 : 2;
          
          resolve({
            score: lcpPts + tbtPts + clsPts + siPts,
            lcp: Math.round(lcp),
            tbt: Math.round(tbt),
            cls: cls.toFixed(3),
            si: Math.round(si),
            perfScore: (perfScore * 100).toFixed(0)
          });
        } catch (e) {
          resolve({ score: 0, error: e.message });
        }
      });
    } catch (e) {
      resolve({ score: 0, error: e.message });
    }
  });
}

async function main() {
  const bundle = bundleScore();
  let cwv = { score: 0, skipped: true, reason: 'Use --full for CWV' };
  
  if (process.argv.includes('--full')) {
    cwv = await cwvScore();
  }
  
  const total = bundle.score + cwv.score;
  console.log(JSON.stringify({
    total, bundle, cwv,
    breakdown: { bundle: `${bundle.score}/25`, cwv: `${cwv.score}/75` }
  }, null, 2));
}

main();
