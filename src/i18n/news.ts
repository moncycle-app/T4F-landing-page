import { getCollection, type CollectionEntry } from 'astro:content';
import { isLang, localizedPath } from './utils';
import type { Lang } from './ui';

export type NewsPost = CollectionEntry<'news'>;

/** URL segment of the news section in each language: /en/news/, /fr/actualites/ */
export const newsSegment = {
  fr: 'actualites',
  en: 'news',
} as const satisfies Record<Lang, string>;

/** URL of the news list, or of a post when a slug is given. */
export function newsPath(lang: Lang, slug?: string): string {
  return localizedPath(lang, slug ? `${newsSegment[lang]}/${slug}` : newsSegment[lang]);
}

/** URL of the news RSS feed: /en/news/rss.xml, /fr/actualites/rss.xml */
export function newsRssPath(lang: Lang): string {
  return `${newsPath(lang)}rss.xml`;
}

/** Language of a post, from its folder (fr/ or en/). */
export function postLang(post: NewsPost): Lang {
  const [lang] = post.id.split('/');
  if (!isLang(lang)) throw new Error(`Post "${post.id}" is not inside a language folder (fr/ or en/).`);
  return lang;
}

/** Slug of a post, without the language prefix. */
export function postSlug(post: NewsPost): string {
  return post.id.split('/').slice(1).join('/');
}

/** Published posts (drafts only visible in dev), newest first. */
export async function getPosts(lang?: Lang): Promise<NewsPost[]> {
  const posts = await getCollection(
    'news',
    (post) => (import.meta.env.DEV || !post.data.draft) && (!lang || postLang(post) === lang),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
