// Screenshots and quick checks against a running preview server (npm run preview).
// Usage: CHROME=/path/to/chrome node scripts/screenshots.mjs [baseUrl]
// Writes screenshots/*.png and prints: horizontal overflow per page/width, reduced-motion media sources,
// and the first few elements reached with Tab plus whether each shows a focus outline.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] ?? 'http://localhost:4321';
const out = new URL('../screenshots/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME });
const pages = [
  ['home', '/'],
  ['detail-terminal-digital-twin', '/projects/terminal-digital-twin/'],
  ['detail-agentic-threat-hunter', '/projects/agentic-threat-hunter/'],
];

for (const width of [360, 1440]) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    for (const [name, path] of pages) {
      if (scheme === 'dark' && name !== 'home') continue;
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Load lazy images so full-page shots show them.
      for (const el of await page.$$('img[loading="lazy"]')) await el.scrollIntoViewIfNeeded();
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
      await page.evaluate(() => window.scrollTo(0, 0));
      if (name === 'home') {
        for (const id of ['mapf-fleet-planner', 'agentic-threat-hunter']) {
          await page.locator(`#${id}`).screenshot({ path: `${out}sheet-${id}-${width}-${scheme}.png` });
        }
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      console.log(`${name} ${width}px ${scheme}: horizontal overflow ${overflow}px`);
      await page.screenshot({ path: `${out}${name}-${width}-${scheme}.png`, fullPage: true });
      // Above-the-fold view too, which is what a visitor sees first.
      if (name === 'home') await page.screenshot({ path: `${out}${name}-${width}-${scheme}-fold.png` });
    }
    await ctx.close();
  }
}

// Reduced motion: animated media should resolve to their stills.
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  // Lazy images only resolve a source once near the viewport.
  for (const el of await page.$$('picture img')) await el.scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  const srcs = await page.$$eval('picture img', (imgs) => imgs.map((i) => i.currentSrc).filter((s) => /replay|demo/.test(s)));
  console.log('reduced motion sources:', srcs.map((s) => new URL(s).pathname).join(', '));
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
