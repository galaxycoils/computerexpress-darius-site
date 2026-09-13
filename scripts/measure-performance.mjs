// Performance metric for stcatharinesdigital
import { execFile } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = '/Users/cmd/workspace/stcatharinesdigital-site';
const DIST = join(ROOT, 'dist');

// 1. Bundle size based on what homepage actually loads (0-25 pts)
function bundleScore() {
  try {
    // Read the prerendered homepage to find which scripts are actually loaded
    const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');
    
    // Extract all script src attributes
    const scriptSrcs = [...homeHtml.matchAll(/<script[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
    // Extract all modulepreload/preload links
    const preloadHrefs = [...homeHtml.matchAll(/<link[^>]*href=["']([^"']+\.js)["']/gi)].map(m => m[1]);
    
    const allScripts = [...new Set([...scriptSrcs, ...preloadHrefs])];
    
    let jsKB = 0;
    let cssKB = 0;
    let htmlKB = statSync(join(DIST, 'index.html')).size / 1024;
    
    for (const script of allScripts) {
      const fileName = script.split('/').pop();
      const filePath = join(DIST, 'assets', fileName);
      try {
        jsKB += statSync(filePath).size / 1024;
      } catch {}
    }
    
    // Extract CSS links
    const cssLinks = [...homeHtml.matchAll(/<link[^>]*href=["']([^"']+\.css)["']/gi)].map(m => m[1]);
    for (const css of cssLinks) {
      const fileName = css.split('/').pop();
      const filePath = join(DIST, 'assets', fileName);
      try {
        cssKB += statSync(filePath).size / 1024;
      } catch {}
    }
    
    const criticalKB = htmlKB + jsKB + cssKB;
    let score = 0;
    if (criticalKB < 200) score = 25;
    else if (criticalKB < 300) score = 22;
    else if (criticalKB < 400) score = 18;
    else if (criticalKB < 500) score = 14;
    else if (criticalKB < 600) score = 10;
    else if (criticalKB < 800) score = 6;
    else score = 3;
    
    return { 
      score, 
      htmlKB: Math.round(htmlKB), 
      jsKB: Math.round(jsKB), 
      cssKB: Math.round(cssKB), 
      criticalKB: Math.round(criticalKB),
      scriptsLoaded: allScripts.length
    };
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
