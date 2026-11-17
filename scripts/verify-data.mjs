// Checks that src/data/projects.json only quotes what the repos say.
//  - every number in a metric's value must appear in one of the files named in its `source`
//    (README.md is always also searched, since the content rules allow README numbers);
//  - every code excerpt must match its file verbatim at the stated line range.
// Usage: node scripts/verify-data.mjs [dir-with-github-only-clones]
// Featured repos are read from ../<repo>; the others from the clone dir (default /tmp/claude-1000/portfolio-src).
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

const data = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url)));
const cloneDir = process.argv[2] ?? '/tmp/claude-1000/portfolio-src';
const localRoot = new URL('../../', import.meta.url).pathname;

const repoDir = (p) => {
  const name = basename(new URL(p.github).pathname);
  const local = join(localRoot, name);
  return existsSync(local) ? local : join(cloneDir, name);
};

// "results/throughput*.txt" style globs, single directory level only.
const expand = (dir, rel) => {
  if (!rel.includes('*')) return [join(dir, rel)];
  const d = join(dir, dirname(rel));
  const re = new RegExp('^' + basename(rel).replace(/[.]/g, '\\.').replace(/\*/g, '.*') + '$');
  return existsSync(d) ? readdirSync(d).filter((f) => re.test(f)).map((f) => join(d, f)) : [];
};

const sourceFiles = (dir, source) => {
  const rels = [...source.matchAll(/[\w./*-]+\.(?:md|csv|json|txt)/g)].map((m) => m[0]);
  return [...new Set(['README.md', ...rels])].flatMap((r) => expand(dir, r)).filter(existsSync);
};

// Numbers as written ("1,904", "0.588", "6.72"); also accept them without thousands separators.
const numbers = (value) => [...value.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => m[0]);

let failures = 0;
const fail = (msg) => { failures++; console.log('FAIL', msg); };

const checkMetric = (p, m, where) => {
  const dir = repoDir(p);
  const files = sourceFiles(dir, m.source);
  if (!files.length) return fail(`${p.name} ${where}: no readable source in "${m.source}"`);
  const text = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  for (const n of numbers(m.value)) {
    if (!text.includes(n) && !text.includes(n.replace(/,/g, ''))) fail(`${p.name} ${where}: "${n}" (from "${m.value}") not in ${m.source}`);
  }
};

for (const p of data.featured) {
  p.metrics.forEach((m, i) => checkMetric(p, m, `metric ${i + 1}`));
  p.detail?.results.forEach((m, i) => checkMetric(p, m, `detail result ${i + 1}`));
  const v = p.visual;
  if (v.kind === 'code') {
    const [a, b] = v.lines.split(/[–-]/).map(Number);
    const file = join(repoDir(p), v.path);
    const lines = readFileSync(file, 'utf8').split('\n').slice(a - 1, b).join('\n');
    if (lines !== v.code) fail(`${p.name}: code excerpt differs from ${v.path}:${v.lines}`);
    if (b - a + 1 > 15) fail(`${p.name}: code excerpt longer than 15 lines`);
  }
}
for (const o of data.other) {
  if (o.note && o.source) checkMetric(o, { value: o.note, source: o.source }, 'note');
}

const page = JSON.stringify(data);
if (/@[\w-]+\.\w+/.test(page.replace(/https?:\/\/\S+/g, ''))) fail('something that looks like an email address');

console.log(failures ? `${failures} problem(s)` : 'projects.json: all numbers and excerpts trace to their sources');
process.exit(failures ? 1 : 0);
