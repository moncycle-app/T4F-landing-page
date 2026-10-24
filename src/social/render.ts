import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

/**
 * Renders a link preview image (og:image / twitter:image): 1200×630 JPEG under 300 KB.
 * Same design as the site's dark theme: Figtree, brand yellow, T4F logo, warm gradient.
 * Content is centred so apps that crop to a square thumbnail keep the essentials.
 */

export const WIDTH = 1200;
export const HEIGHT = 630;
/** WhatsApp ignores images of 300 KB or more: aim for 200 KB, never reach 300 KB */
const TARGET_BYTES = 200 * 1024;
const MAX_BYTES = 300 * 1024;

const colors = { accent: '#e3b607', bg: '#15130d', text: '#f2f0e8', muted: '#b5b0a1' };

const logo =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="48" fill="#e3b607"/>' +
      '<path fill="#1f1c14" d="M92.1 343.8V205.3H41V168.2H183.5V205.3H132.3V343.8ZM354.6 343.8V168.2H471V205.3H395V239.2H456.5V276.1H395V343.8Z"/>' +
      '<path fill="#5e4802" d="M268.8 343.8V313H186.7V280.6L263.5 168.2H306.9V278.6H335V313H306.9V343.8ZM227.1 278.6H268.8V217.6Z"/></svg>',
  ).toString('base64');

export interface ImageContent {
  /** Small grey text next to the logo */
  badge: string;
  /** Large heading. Without it: "Tech 4 Fertility" in the brand style. */
  heading?: string;
  /** Text under the heading */
  tagline?: string;
}

// Satori reads static WOFF files (not the site's variable WOFF2): one file per weight
const require = createRequire(import.meta.url);
let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 700 | 800 }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    ([500, 600, 700, 800] as const).map(async (weight) => ({
      name: 'Figtree',
      weight,
      data: await readFile(require.resolve(`@fontsource/figtree/files/figtree-latin-${weight}-normal.woff`)),
    })),
  );
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown> } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, props = {}): Node => ({
  type,
  props: { ...props, style, children },
});

/** Heading size: as large as possible, never under 48px (readable as a thumbnail) */
function headingSize(text: string): number {
  if (text.length <= 30) return 84;
  if (text.length <= 50) return 72;
  if (text.length <= 80) return 60;
  return 52;
}

function tree({ badge, heading, tagline }: ImageContent): Node {
  const title = heading
    ? h('div', { marginTop: 36, fontSize: headingSize(heading), fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', textAlign: 'center', textWrap: 'balance', maxWidth: 1040, lineClamp: 4 }, heading)
    : h('div', { display: 'flex', marginTop: 36, fontSize: 128, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.035em' }, [
        h('span', {}, 'Tech'),
        h('span', { color: colors.accent, padding: '0 38px 0 20px' }, '4'),
        h('span', {}, 'Fertility'),
      ]);

  return h(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // No padding (Satori would add it to the width): the 80px side margins come from each block's maxWidth
      backgroundColor: colors.bg,
      backgroundImage: 'radial-gradient(circle at 100% 100%, rgba(227, 182, 7, 0.2), rgba(227, 182, 7, 0) 55%)',
      color: colors.text,
      fontFamily: 'Figtree',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 24 }, [
        h('img', { width: 88, height: 88 }, undefined, { src: logo, width: 88, height: 88 }),
        h('div', { fontSize: 28, fontWeight: 600, letterSpacing: '0.02em', color: colors.muted }, badge),
      ]),
      title,
      tagline
        ? h('div', { marginTop: 32, maxWidth: 940, fontSize: 44, fontWeight: 500, lineHeight: 1.22, textAlign: 'center', textWrap: 'balance' }, tagline)
        : null,
      // Kept clear of the 15px X crops at the top and bottom (2:1 card)
      h('div', { position: 'absolute', bottom: 48, fontSize: 30, fontWeight: 700, color: colors.accent }, 'tech4fertility.org'),
    ].filter(Boolean),
  );
}

export async function renderImage(content: ImageContent): Promise<Buffer> {
  const svg = await satori(tree(content) as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts: await loadFonts(),
  });
  const png = new Resvg(svg, { fitTo: { mode: 'original' } }).render().asPng();
  // Lower the JPEG quality until the file reaches the target weight
  let jpeg = Buffer.alloc(0);
  for (let quality = 85; quality >= 50; quality -= 5) {
    jpeg = await sharp(png).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (jpeg.length <= TARGET_BYTES) break;
  }
  if (jpeg.length >= MAX_BYTES) throw new Error(`Link preview image too heavy: ${jpeg.length} bytes`);
  return jpeg;
}
