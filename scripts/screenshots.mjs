// Screenshots and quick checks against a static server of dist/ (python3 -m http.server -d dist 4321).
// Usage: CHROME=/path/to/chrome node scripts/screenshots.mjs [baseUrl]
// Writes screenshots/<page>-<width>-top.png (viewport at scrollY 0, after the load sequence) and
// screenshots/<page>-<width>-mid.png (viewport scrolled to a mid-page element).
// Prints horizontal overflow per page, and checks that reduced motion shows the finished hero at once.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME });

// [name, path, selector to scroll to for the mid shot]
const pages = [
  ['home', '/', '#hl-title'],
  ['projects', '/projects/', '#ai-security'],
  ['case-terminal-digital-twin', '/projects/terminal-digital-twin/', '#approach'],
  ['about', '/about/', '#langs'],
  ['404', '/404.html', null],
];

for (const width of [360, 1440]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [name, path, mid] of pages) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3800); // the hero's load sequence finishes by ~3.5 s
    await page.screenshot({ path: `${out}${name}-${width}-top.png` });
    if (mid) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
      }, mid);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}${name}-${width}-mid.png` });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(`${name} ${width}: horizontal overflow ${overflow}px`);
  }
  await ctx.close();
}

// Reduced motion: the route and robot are in their final state at load.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const state = await page.evaluate(() => ({
    animations: document.getAnimations().length,
    nameOpacity: getComputedStyle(document.querySelector('.name span')).opacity,
  }));
  console.log('reduced motion:', JSON.stringify(state));
  await ctx.close();
}
// No JS: the page is CSS-only, so content must be present and visible.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3800);
  const op = await page.$eval('.lede', (e) => getComputedStyle(e).opacity);
  console.log('no JS: tagline opacity after load', op);
  await ctx.close();
}
await browser.close();
