import { createHash } from 'node:crypto';
import { getPosts, newsPath, postLang, postSlug } from '../i18n/news';
import { langs, type Lang } from '../i18n/ui';
import { formatDate, localizedPath, useTranslations } from '../i18n/utils';
import { renderImage, type ImageContent } from './render';

/**
 * Link preview image of each page, rendered at build time by src/pages/images/og/[image].jpg.ts.
 * File names carry a content hash (/images/og/en-news.3f9a2c1b.jpg): chat apps and social networks cache
 * previews by URL, so a changed image gets a new URL and is fetched again.
 * Pages without an entry here (404…) use their language's home page image.
 */

interface PageImage extends ImageContent {
  /** Page path, with trailing slash (/en/news/) */
  path: string;
  lang: Lang;
  alt: string;
}

async function pageImages(): Promise<PageImage[]> {
  const pages = langs.flatMap((lang): PageImage[] => {
    const t = useTranslations(lang);
    const badge = t('social.badge');
    return [
      { path: localizedPath(lang), lang, badge, tagline: t('site.tagline'), alt: t('site.imageAlt') },
      { path: newsPath(lang), lang, badge, heading: t('news.title'), tagline: t('news.description'), alt: `${t('news.title')} | ${t('site.title')}` },
      { path: localizedPath(lang, 'legal'), lang, badge, heading: t('legal.heading'), alt: `${t('legal.heading')} | ${t('site.title')}` },
    ];
  });
  const posts = (await getPosts()).map((post): PageImage => {
    const lang = postLang(post);
    const t = useTranslations(lang);
    return {
      path: newsPath(lang, postSlug(post)),
      lang,
      badge: `${t('news.title')} · ${formatDate(post.data.pubDate, lang)}`,
      heading: post.data.title,
      alt: post.data.title,
    };
  });
  return [...pages, ...posts];
}

export interface RenderedImage {
  /** File name: en-news.3f9a2c1b.jpg */
  file: string;
  data: Buffer;
  alt: string;
}

/** /en/news/welcome/ → en-news-welcome */
const baseName = (path: string) => path.replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);

// Rendered once per build (pages and the image endpoint share them)
let rendered: Promise<Map<string, RenderedImage>> | undefined;

export function getImages(): Promise<Map<string, RenderedImage>> {
  rendered ??= pageImages().then(async (pages) => {
    const entries = await Promise.all(
      pages.map(async ({ path, alt, ...content }) => {
        const data = await renderImage(content);
        const hash = createHash('sha256').update(data).digest('hex').slice(0, 8);
        return [path, { file: `${baseName(path)}.${hash}.jpg`, data, alt }] as const;
      }),
    );
    return new Map(entries);
  });
  return rendered;
}

/** Image of a page, falling back to its language's home page image. */
export async function pageImage(path: string, lang: Lang): Promise<{ path: string; alt: string }> {
  const images = await getImages();
  const image = images.get(withSlash(path)) ?? images.get(localizedPath(lang));
  if (!image) throw new Error(`No link preview image for ${path}`);
  return { path: `/images/og/${image.file}`, alt: image.alt };
}
