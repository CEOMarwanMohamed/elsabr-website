// Fails the build when the catalogue data is internally inconsistent.
//
// This runs inside `npm run build` rather than as a test, because the build is
// the only step both CI and the deploy share: Workers Builds runs `npm run
// build` (wrangler.toml) and never runs vitest, so a test here would not stop a
// bad deploy.
//
// It exists because of one specific trap. `not_found_handling =
// "single-page-application"` makes the Worker serve index.html for any path it
// cannot match — including /assets/*.jpg. A missing or misspelt image therefore
// returns 200 text/html instead of 404, the browser fails to decode it, and
// ProductCard falls back to the same "الصبر" placeholder it shows for a product
// with no photo at all. The result is invisible: no 404, no console error, and a
// card that looks exactly like the 29 products that are legitimately awaiting
// photos. Nothing at runtime can catch this, so it has to be caught here.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'src/data/catalog.ts');
const assetDir = path.join(root, 'public');

const src = fs.readFileSync(source, 'utf8');
const errors = [];

// Parsing the source with regexes rather than importing it keeps this script
// dependency-free and runnable before any transpile step. The cost is that a
// change to the data's shape could silently match nothing, so each pattern's
// hit count is asserted below.
const images = [...src.matchAll(/^\s*image: "([^"]+)",$/gm)].map((m) => m[1]);
const codes = [...src.matchAll(/^\s*code: "([^"]+)",$/gm)].map((m) => m[1]);
const variantCodes = [...src.matchAll(/\{ code: "([^"]+)", size: "[^"]+" \}/g)].map(
  (m) => m[1],
);

// Guard the guard: if the file's shape changes and these stop matching, the
// checks below would all pass vacuously and report success on a broken build.
if (images.length === 0) errors.push('parsed 0 image paths — the regex no longer matches catalog.ts');
if (codes.length === 0) errors.push('parsed 0 product codes — the regex no longer matches catalog.ts');

// 1. Every referenced image is actually on disk, and is a file with content.
//
// Matched against a real directory listing rather than fs.existsSync, because
// this check has to be case-sensitive and the developer filesystem is not.
// existsSync('...-A4.jpg') is true on Windows and macOS when the file is
// actually '...-a4.jpg'; Cloudflare's asset lookup is case-sensitive, so a case
// typo would pass here and break only in production — precisely the failure
// this script exists to prevent.
const onDisk = new Set(fs.readdirSync(path.join(assetDir, 'assets')));

for (const image of images) {
  if (!image.startsWith('/assets/')) {
    errors.push(`${image} — image paths must start with /assets/`);
    continue;
  }
  const name = image.slice('/assets/'.length);
  if (!onDisk.has(name)) {
    const nearMiss = [...onDisk].find((f) => f.toLowerCase() === name.toLowerCase());
    errors.push(
      nearMiss
        ? `${image} — case does not match the file on disk (${nearMiss}); Cloudflare serves assets case-sensitively`
        : `${image} — referenced by a product but missing from public/assets/`,
    );
    continue;
  }
  if (fs.statSync(path.join(assetDir, image)).size === 0) {
    errors.push(`${image} — file exists but is empty`);
  }
}

// 2. Codes are unique across the whole catalogue, variants included. The cart
// keys lines by code (CartContext), so a duplicate would silently merge two
// different products into one order line.
const all = [...codes, ...variantCodes];
const seen = new Set();
for (const code of all) {
  if (seen.has(code)) errors.push(`${code} — duplicate product code`);
  seen.add(code);
}

if (errors.length > 0) {
  console.error('\ncatalog check failed:\n');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `catalog ok — ${images.length} images on disk, ${all.length} unique codes`,
);
