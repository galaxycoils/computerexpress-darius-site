// Performance metric - measures critical path only
import { execFile } from 'child_process';
import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

// Total gzip budget for the homepage critical path, aligned with the limits in
// scripts/check-bundle-budget.js (JS 125 KB + CSS 22 KB) plus the HTML document.
// Current baseline is ~133 KB, which scores 25.
const BUDGETS = [
  { maxKB: 150, score: 25 },
  { maxKB: 175, score: 22 },
  { maxKB: 200, score: 18 },
  { maxKB: 250, score: 14 },
  { maxKB: 300, score: 10 },
  { maxKB: 400, score: 6 },
];

// 1. Bundle size - only what the homepage actually downloads (0-25 pts)
//
// Measures gzip transfer size, not raw bytes. This previously summed raw file
// sizes against thresholds of 200-800 KB, which reported 6/25 for a homepage
// that ships ~107 KB of JavaScript and passed the real budget check. Raw size is
// a poor proxy for what a reader downloads: the same 193 KB chunk compresses to
// 43 KB. Scoring raw bytes invited "optimising" toward a number nobody feels.
function bundleScore() {
  try {
    const homeHtmlPath = join(DIST, 'index.html');
    const homeHtml = readFileSync(homeHtmlPath, 'utf-8');

    const scriptSrcs = [...homeHtml.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
    const preloadHrefs = [...homeHtml.matchAll(/<link[^>]*rel=["'](?:modulepreload|preload)["'][^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);
    const cssLinks = [...homeHtml.matchAll(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);

    const allScripts = [...new Set([...scriptSrcs, ...preloadHrefs])];

    const gzipKB = (file) => {
      try {
        return gzipSync(readFileSync(file)).length / 1024;
      } catch {
        return 0;
      }
    };

    const localFile = (href) => join(DIST, 'assets', href.split('/').pop());
    const exists = (file) => {
      try {
        statSync(file);
        return true;
      } catch {
        return false;
      }
    };

    // Sort preloads by extension. `rel="modulepreload"` covers the entry scripts
    // *and* the preloaded webfonts, and the previous version summed everything
    // into the JavaScript bucket — adding 93 KB of woff2 to the JS figure and
    // making it look far worse than the transfer actually is.
    const sum = (hrefs, test) => {
      let raw = 0;
      let gzip = 0;
      let count = 0;
      for (const href of hrefs) {
        const file = localFile(href);
        if (!exists(file) || !test(href)) continue;
        raw += statSync(file).size / 1024;
        gzip += gzipKB(file);
        count++;
      }
      return { raw, gzip, count };
    };

    const js = sum(allScripts, (href) => /\.m?js$/i.test(href));
    const fonts = sum(allScripts, (href) => /\.(woff2?|ttf|otf)$/i.test(href));
    const css = sum(cssLinks, (href) => /\.css$/i.test(href));

    const htmlKB = gzipKB(homeHtmlPath);
    const criticalKB = htmlKB + js.gzip + css.gzip;

    const band = BUDGETS.find((entry) => criticalKB < entry.maxKB);
    const score = band ? band.score : 3;

    return {
      score,
      metric: 'gzip transfer for the homepage critical path',
      htmlKB: Math.round(htmlKB),
      jsKB: Math.round(js.gzip),
      cssKB: Math.round(css.gzip),
      criticalKB: Math.round(criticalKB),
      // Fonts are preloaded but are not part of the JS/CSS budget; reported so
      // the number is visible rather than silently folded into another bucket.
      fontsKB: Math.round(fonts.gzip),
      rawKB: { js: Math.round(js.raw), css: Math.round(css.raw) },
      scriptsLoaded: js.count,
    };
  } catch (e) {
    return { score: 0, error: e.message };
  }
}

// 2. Core Web Vitals via Lighthouse (0-75 pts)
function cwvScore() {
  return new Promise((resolve) => {
    try {
      const chromePath = process.env.CHROME_PATH || process.env.CHROMIUM_PATH;
      const args = [
        'https://stcatharinesdigital.ca/',
        '--chrome-flags=--headless --no-sandbox --window-size=1440,900',
        '--port=9222',
        '--output=json',
        '--quiet',
        '--no-upload',
        ...(chromePath ? [`--chrome-path=${chromePath}`] : [])
      ];
      
      execFile(join(ROOT, 'node_modules/.bin/lighthouse'), args, {
        cwd: ROOT,
        timeout: 90000,
        encoding: 'utf-8',
        maxBuffer: 100 * 1024 * 1024
      }, (error, stdout) => {
        try {
          if (error) throw error;
          const json = JSON.parse(stdout);
          const a = json.audits;
          const lcp = a?.['largest-contentful-paint']?.numericValue || 0;
          const tbt = a?.['total-blocking-time']?.numericValue || 0;
          const cls = a?.['cumulative-layout-shift']?.numericValue || 0;
          const si = a?.['speed-index']?.numericValue || 0;
          const perfScore = json.categories?.performance?.score || 0;
          
          const lcpPts = lcp < 2500 ? 25 : lcp < 4000 ? 15 : lcp < 6000 ? 8 : 3;
          const tbtPts = tbt < 200 ? 20 : tbt < 600 ? 12 : tbt < 1000 ? 6 : 2;
          const clsPts = cls < 0.1 ? 15 : cls < 0.25 ? 10 : cls < 0.5 ? 5 : 2;
          const siPts = si < 3400 ? 15 : si < 5800 ? 10 : si < 8000 ? 5 : 2;
          
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
