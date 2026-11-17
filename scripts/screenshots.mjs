// Screenshots and quick checks against a static server of dist/ (python3 -m http.server -d dist 4321).
// Usage: CHROME=/path/to/chrome node scripts/screenshots.mjs [baseUrl]
// Writes screenshots/*.png:
//   home-<w>-<scheme>-top.png   viewport at scrollY 0 (what a visitor sees first)
//   home-<w>-<scheme>-mid.png   viewport scrolled to a mid-page sheet, after its reveals have run
//   home-<w>-<scheme>-full.png  whole page after scrolling through it (all reveals fired)
//   case-terminal-digital-twin-<w>-<scheme>.png  case-study page, whole page
// Prints horizontal overflow, reveal state with reduced motion and with JS off, and the first Tab stops.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME });
const settle = (page, ms = 900) => page.waitForTimeout(ms);
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

// Scroll down in steps so lazy images load and every reveal fires.
async function scrollThrough(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await settle(page);
}

for (const width of [360, 1440]) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const tag = `${width}-${scheme}`;

    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await settle(page);
    await page.screenshot({ path: `${out}home-${tag}-top.png` });

    // Mid-page: bring a sheet near the top of the viewport and let its reveals play.
    await page.evaluate(() => {
      const el = document.getElementById('ros2-autonomy-stack');
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 24);
    });
    await page.waitForFunction(() => [...document.querySelectorAll('#ros2-autonomy-stack img')].every((i) => i.complete));
    await settle(page);
    await page.screenshot({ path: `${out}home-${tag}-mid.png` });

    await scrollThrough(page);
    const hidden = await page.$$eval('[data-reveal]:not(.is-in)', (els) => els.length);
    console.log(`home ${tag}: overflow ${await overflow(page)}px, unrevealed after scroll ${hidden}`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}home-${tag}-full.png`, fullPage: true });

    await page.goto(base + '/projects/terminal-digital-twin/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await scrollThrough(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    console.log(`case ${tag}: overflow ${await overflow(page)}px`);
    await page.screenshot({ path: `${out}case-terminal-digital-twin-${tag}.png`, fullPage: true });
    await ctx.close();
  }
}

// Reduced motion: reveal targets are visible at load, animated media resolve to stills.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const faded = await page.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  console.log('reduced motion: reveal targets not fully visible at load:', faded);
  for (const el of await page.$$('picture img')) await el.scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const srcs = await page.$$eval('picture img', (imgs) => imgs.map((i) => i.currentSrc).filter((s) => /replay|demo/.test(s)));
  console.log('reduced motion sources:', srcs.map((s) => new URL(s).pathname).join(', '));
  await ctx.close();
}

// No JavaScript: nothing may be hidden.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const faded = await page.$$eval('[data-reveal]', (els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  console.log('no JS: reveal targets not fully visible:', faded);
  await ctx.close();
}

// Keyboard: tab through the first stops and screenshot one focused element.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  for (let i = 1; i <= 6; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return `${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 30)}" outline=${cs.outlineStyle} ${cs.outlineWidth}`;
    });
    console.log(`tab ${i}: ${info}`);
    if (i === 1) await page.screenshot({ path: `${out}focus-skip-link-1440.png`, clip: { x: 0, y: 0, width: 700, height: 200 } });
    if (i === 5) await page.screenshot({ path: `${out}focus-index-link-1440.png` });
  }
  await ctx.close();
}

await browser.close();
