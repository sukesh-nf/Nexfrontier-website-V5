import pw from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = join(process.cwd(), 'out');
const pages = [
  '/', '/the-shift', '/hyper-accelerating-markets', '/intelligence',
  '/enterprise-value', '/foundation-customers', '/about',
  '/reading-the-shift', '/leadership-pulse', '/market-enquiry',
  '/investor-proof', '/where-nexfrontier-fits', '/privacy', '/terms',
  '/intelligence/the-brain', '/intelligence/orbit', '/intelligence/amct',
  '/intelligence/intent-threads', '/intelligence/human-in-the-lead',
  '/intelligence/enterprise-capability',
  '/enterprise-value/quiet-loss', '/enterprise-value/adaptive-value',
  '/enterprise-value/value-translation-framework', '/enterprise-value/calculator',
];
const widths = [
  { label: 'desktop', width: 1440 },
  { label: 'tablet', width: 768 },
  { label: 'mobile', width: 390 },
];
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain',
  '.xml': 'text/xml',
};

const server = createServer((req, res) => {
  let urlPath = (req.url || '/').split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';
  const tryPaths = [urlPath, `${urlPath}.html`, `${urlPath}/index.html`];
  for (const candidate of tryPaths) {
    try {
      const file = join(root, candidate);
      const body = readFileSync(file);
      res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      res.end(body);
      return;
    } catch {}
  }
  res.writeHead(404);
  res.end('Not found');
});

await new Promise((resolve) => server.listen(3298, resolve));

const browser = await pw.chromium.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const results = [];

for (const { label, width } of widths) {
  for (const path of pages) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('requestfailed', (req) => {
      failedRequests.push(`${req.url()} ${req.failure()?.errorText || ''}`);
    });

    const response = await page.goto(`http://127.0.0.1:3298${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const metrics = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        h1Count: document.querySelectorAll('h1').length,
        title: document.title,
        bodyText: document.body?.innerText?.length || 0,
      };
    });

    const overflow = metrics.scrollWidth > metrics.clientWidth + 2;

    results.push({
      viewport: label,
      width,
      path,
      status: response?.status() ?? 0,
      overflow,
      scrollWidth: metrics.scrollWidth,
      clientWidth: metrics.clientWidth,
      h1Count: metrics.h1Count,
      title: metrics.title,
      consoleErrors: consoleErrors.length,
      pageErrors: pageErrors.length,
      failedRequests: failedRequests.length,
      consoleErrorSamples: consoleErrors.slice(0, 3),
      pageErrorSamples: pageErrors.slice(0, 3),
      failedRequestSamples: failedRequests.slice(0, 3),
    });

    await context.close();
  }
}

await browser.close();
server.close();

// Print summary
let hasIssues = false;
for (const r of results) {
  const issues = [];
  if (r.overflow) issues.push('HORIZONTAL_OVERFLOW');
  if (r.consoleErrors > 0) issues.push(`${r.consoleErrors} console errors`);
  if (r.pageErrors > 0) issues.push(`${r.pageErrors} page errors`);
  if (r.failedRequests > 0) issues.push(`${r.failedRequests} failed requests`);
  if (r.h1Count === 0) issues.push('NO H1');
  if (r.h1Count > 1) issues.push(`${r.h1Count} H1 tags`);
  if (r.status !== 200) issues.push(`HTTP ${r.status}`);

  const status = issues.length === 0 ? 'OK' : issues.join(', ');
  if (issues.length > 0) hasIssues = true;
  console.log(`${r.viewport.padEnd(8)} ${r.path.padEnd(35)} ${status}`);
  if (r.consoleErrorSamples.length > 0) console.log(`  console: ${r.consoleErrorSamples.join(' | ')}`);
  if (r.pageErrorSamples.length > 0) console.log(`  pageErr: ${r.pageErrorSamples.join(' | ')}`);
  if (r.failedRequestSamples.length > 0) console.log(`  failed: ${r.failedRequestSamples.join(' | ')}`);
}

console.log(`\n${results.length} pages tested across ${widths.length} viewports`);
console.log(hasIssues ? 'ISSUES FOUND' : 'ALL CLEAN');
