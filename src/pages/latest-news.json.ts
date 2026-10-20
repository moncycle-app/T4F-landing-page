import type { APIRoute } from 'astro';
import { getPosts, newsPath, postSlug } from '../i18n/news';
import { langs } from '../i18n/ui';

/**
 * /latest-news.json: metadata of the latest published news post in each language that has `showInThirdParty` on (no content),
 * for other websites and apps to tell their users there is something new to read.
 * A language without any post gets `null`. Drafts are left out of production builds (see getPosts).
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;

  const entries = await Promise.all(
    langs.map(async (lang) => {
      const post = (await getPosts(lang)).find((p) => p.data.showInThirdParty);
      if (!post) return [lang, null] as const;
      const { title, description, pubDate, updatedDate, translationKey } = post.data;
      return [
        lang,
        {
          title,
          description,
          url: url(newsPath(lang, postSlug(post))),
          slug: postSlug(post),
          translationKey,
          pubDate: pubDate.toISOString(),
          updatedDate: updatedDate?.toISOString() ?? null,
          feed: url(`${newsPath(lang)}rss.xml`),
        },
      ] as const;
    }),
  );

  return new Response(JSON.stringify(Object.fromEntries(entries), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
