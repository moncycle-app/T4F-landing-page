// Checks the link preview tags of every HTML page in dist/ (run after `astro build`: `npm run test:og`).
// Fails if a tag is missing, there is more than one og:image, a URL is not absolute HTTPS, or the image
// is missing, not 1200×630, not the declared format, or 300 KB or more.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const dist = new URL('../dist/', import.meta.url).pathname;
const site = 'https://tech4fertility.org';
const MAX_BYTES = 300 * 1024;

const required = [
  'og:type', 'og:url', 'og:title', 'og:description', 'og:site_name', 'og:locale', 'og:image', 'og:image:secure_url',
  'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:card', 'twitter:image', 'twitter:image:alt',
];
const formats = { 'image/jpeg': 'jpeg', 'image/png': 'png' };

const decode = (value) =>
  value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])),
  );
  return files.flat();
}

/** All <meta property|name="…" content="…"> of the <head>, as [key, value] pairs (repeats kept) */
function metaTags(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  return [...head.matchAll(/<meta\b[^>]*>/g)].flatMap(([tag]) => {
    const key = tag.match(/\b(?:property|name)="([^"]+)"/)?.[1];
    const value = tag.match(/\bcontent="([^"]*)"/)?.[1];
    return key && value !== undefined ? [[key, decode(value)]] : [];
  });
}

const checkedImages = new Map();
async function checkImage(url, type) {
  const key = `${url} ${type}`;
  if (!checkedImages.has(key)) {
    checkedImages.set(key, (async () => {
      const errors = [];
      const { pathname, origin } = new URL(url);
      if (origin !== site) return [`image is not on ${site}: ${url}`];
      let data;
      try {
        data = await readFile(join(dist, decodeURIComponent(pathname)));
      } catch {
        return [`image not found in dist/: ${pathname}`];
      }
      const { format, width, height } = await sharp(data).metadata();
      if (width !== 1200 || height !== 630) errors.push(`${pathname} is ${width}×${height}, expected 1200×630`);
      if (format !== formats[type]) errors.push(`${pathname} is ${format}, declared ${type}`);
      if (data.length >= MAX_BYTES) errors.push(`${pathname} weighs ${Math.round(data.length / 1024)} KB (must be under 300 KB)`);
      return errors;
    })());
  }
  return checkedImages.get(key);
}

let failures = 0;
const files = (await htmlFiles(dist)).sort();
for (const file of files) {
  const tags = metaTags(await readFile(file, 'utf8'));
  const values = (key) => tags.filter(([k]) => k === key).map(([, v]) => v);
  const get = (key) => values(key)[0];
  const errors = [];

  for (const key of required) if (!get(key)) errors.push(`missing ${key}`);
  if (values('og:image').length > 1) errors.push(`${values('og:image').length} og:image tags (only one allowed)`);
  for (const key of ['og:url', 'og:image', 'og:image:secure_url', 'twitter:image']) {
    const value = get(key);
    if (value && !value.startsWith('https://')) errors.push(`${key} is not an absolute HTTPS URL: ${value}`);
  }
  if (get('twitter:card') && get('twitter:card') !== 'summary_large_image') {
    errors.push(`twitter:card is "${get('twitter:card')}", expected summary_large_image`);
  }
  for (const key of ['og:image:secure_url', 'twitter:image']) {
    if (get(key) && get(key) !== get('og:image')) errors.push(`${key} differs from og:image`);
  }
  if (get('og:image:width') && get('og:image:width') !== '1200') errors.push(`og:image:width is ${get('og:image:width')}`);
  if (get('og:image:height') && get('og:image:height') !== '630') errors.push(`og:image:height is ${get('og:image:height')}`);
  const type = get('og:image:type');
  if (type && !formats[type]) errors.push(`og:image:type ${type} is not JPEG or PNG`);
  if (get('og:image')?.startsWith('https://') && formats[type]) errors.push(...(await checkImage(get('og:image'), type)));

  const page = file.slice(dist.length - 1);
  if (errors.length) {
    failures++;
    console.error(`✗ ${page}\n${errors.map((e) => `    ${e}`).join('\n')}`);
  } else {
    console.log(`✓ ${page}  ${new URL(get('og:image')).pathname}`);
  }
}

if (!files.length) {
  console.error('No HTML page in dist/: run `astro build` first.');
  process.exit(1);
}
if (failures) {
  console.error(`\nLink previews: ${failures} page(s) out of ${files.length} failed.`);
  process.exit(1);
}
console.log(`\nLink previews: ${files.length} pages OK.`);
