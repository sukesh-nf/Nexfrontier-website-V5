import pw from '/tmp/.npm-cache/_npx/776af783dbecb618/node_modules/playwright-core/index.js';
import { mkdirSync, readFileSync } from 'fs';
import { join, extname } from 'path';
import { createServer } from 'http';

const { chromium } = pw;
const ADMIN_TOKEN = process.env.SCREENSHOT_ADMIN_TOKEN;
if (!ADMIN_TOKEN) throw new Error('SCREENSHOT_ADMIN_TOKEN is required');

const PAGES = [
  { slug: 'investment-case', file: '01-investment-case' },
  { slug: 'market-evidence', file: '02-market-evidence' },
  { slug: 'economic-opportunity', file: '03-economic-opportunity' },
  { slug: 'product', file: '04-product-eni' },
  { slug: 'proof', file: '05-proof-foundation-customers' },
  { slug: 'round', file: '06-round-use-of-funds' },
];

const OUT_DIR = join(process.cwd(), 'docs', 'review-screenshots');
const STATIC_DIR = join(process.cwd(), 'out');
mkdirSync(OUT_DIR, { recursive: true });

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'text/xml',
};

const server = createServer((req, res) => {
  let urlPath = req.url?.split('?')[0] || '/';
  if (urlPath === '/') urlPath = '/index.html';
  try {
    const filePath = join(STATIC_DIR, urlPath);
    const data = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    try {
      const data = readFileSync(join(STATIC_DIR, `${urlPath}.html`));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  }
});

async function takeScreenshots() {
  await new Promise((resolve) => server.listen(3098, resolve));
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (const page of PAGES) {
    const url = `http://127.0.0.1:3098/investor-data-room/${page.slug}?preview=1`;
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.addInitScript((token) => window.sessionStorage.setItem('drm_admin_token', token), ADMIN_TOKEN);
    await desktopPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await desktopPage.waitForTimeout(4000);
    await desktopPage.screenshot({ path: join(OUT_DIR, `${page.file}-desktop.png`), fullPage: true });
    await desktopContext.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.addInitScript((token) => window.sessionStorage.setItem('drm_admin_token', token), ADMIN_TOKEN);
    await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await mobilePage.waitForTimeout(4000);
    await mobilePage.screenshot({ path: join(OUT_DIR, `${page.file}-mobile.png`), fullPage: true });
    await mobileContext.close();
  }

  await browser.close();
  server.close();
}

takeScreenshots().catch((error) => {
  console.error(error);
  process.exit(1);
});
