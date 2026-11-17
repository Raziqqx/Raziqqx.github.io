// Copies each featured repo's media into public/media/<repo>/, makes still versions of animated
// media (for prefers-reduced-motion), shrinks anything over the size budget, and writes
// src/data/media-meta.json with pixel sizes so the pages can reserve space (no layout shift).
// Run from the repo root after the sibling project folders exist: node scripts/prepare-media.mjs
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = new URL('../', import.meta.url).pathname;
const projects = join(root, '..');
const BUDGET = 1.5 * 1024 * 1024;

// repo -> files to copy (paths inside the repo)
const media = {
  'terminal-digital-twin': ['docs/screenshot.png', 'results/m2_policy_comparison.png'],
  'mapf-fleet-planner': ['docs/replay.svg', 'results/bench_success.png'],
  'ros2-autonomy-stack': ['docs/demo.gif'],
  'lidar-perception-pipeline': ['docs/viewer.png'],
  'core-banking-ledger': ['docs/grafana-dashboard.png', 'docs/swagger-ui.png'],
  'research-rag-platform': ['docs/screenshot-ask.png'],
  'agent-redteam-eval': ['docs/report_screenshot.png'],
};

const meta = {};
const record = async (pub) => {
  const file = join(root, 'public', pub);
  if (pub.endsWith('.svg')) {
    const m = readFileSync(file, 'utf8').match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    meta[pub] = { width: Number(m[1]), height: Number(m[2]) };
  } else {
    const { width, height } = await sharp(file).metadata();
    meta[pub] = { width, height };
  }
  meta[pub].bytes = statSync(file).size;
};

for (const [repo, files] of Object.entries(media)) {
  const outDir = join(root, 'public/media', repo);
  mkdirSync(outDir, { recursive: true });
  for (const rel of files) {
    const src = join(projects, repo, rel);
    if (!existsSync(src)) throw new Error(`missing ${src}`);
    const name = rel.split('/').pop();
    const dest = join(outDir, name);
    if (statSync(src).size > BUDGET && name.endsWith('.png')) {
      await sharp(src).resize({ width: 1600, withoutEnlargement: true }).png({ compressionLevel: 9, palette: true }).toFile(dest);
    } else {
      copyFileSync(src, dest);
    }
    await record(`/media/${repo}/${name}`);
  }
}

// Stills for reduced motion.
// 1) The MAPF replay is SMIL: dropping the <animate> elements leaves every agent at its start cell.
const svg = readFileSync(join(root, 'public/media/mapf-fleet-planner/replay.svg'), 'utf8');
writeFileSync(join(root, 'public/media/mapf-fleet-planner/replay-still.svg'), svg.replace(/<animate\b[^>]*\/>/g, ''));
await record('/media/mapf-fleet-planner/replay-still.svg');
// 2) The ROS 2 GIF: sharp reads the first frame by default.
await sharp(join(root, 'public/media/ros2-autonomy-stack/demo.gif')).png().toFile(join(root, 'public/media/ros2-autonomy-stack/demo-still.png'));
await record('/media/ros2-autonomy-stack/demo-still.png');

for (const [k, v] of Object.entries(meta)) {
  if (v.bytes > BUDGET) throw new Error(`${k} is ${v.bytes} bytes, over budget`);
}
writeFileSync(join(root, 'src/data/media-meta.json'), JSON.stringify(meta, null, 2) + '\n');
console.log(Object.entries(meta).map(([k, v]) => `${k} ${v.width}x${v.height} ${(v.bytes / 1024).toFixed(0)} KiB`).join('\n'));
