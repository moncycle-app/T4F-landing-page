import { getCollection, type CollectionEntry } from 'astro:content';
import { isLang } from './utils';
import type { Lang } from './ui';

export type BlogPost = CollectionEntry<'blog'>;

/** Language of a post, from its folder (fr/ or en/). */
export function postLang(post: BlogPost): Lang {
  const [lang] = post.id.split('/');
  if (!isLang(lang)) throw new Error(`Post "${post.id}" is not inside a language folder (fr/ or en/).`);
  return lang;
}

/** Slug of a post, without the language prefix. */
export function postSlug(post: BlogPost): string {
  return post.id.split('/').slice(1).join('/');
}

/** Published posts (drafts only visible in dev), newest first. */
export async function getPosts(lang?: Lang): Promise<BlogPost[]> {
  const posts = await getCollection(
    'blog',
    (post) => (import.meta.env.DEV || !post.data.draft) && (!lang || postLang(post) === lang),
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
