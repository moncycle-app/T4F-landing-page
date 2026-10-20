import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPosts, newsPath, newsSegment, postSlug } from '../../../i18n/news';
import { langs, type Lang } from '../../../i18n/ui';
import { useTranslations } from '../../../i18n/utils';

/**
 * RSS feed of the news, one per language: /en/news/rss.xml, /fr/actualites/rss.xml.
 * Drafts are left out of production builds (see getPosts).
 */
export function getStaticPaths() {
  return langs.map((lang) => ({ params: { lang, news: newsSegment[lang] } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  const lang = params.lang as Lang;
  const t = useTranslations(lang);
  const posts = await getPosts(lang);

  return rss({
    title: `${t('news.title')} | ${t('site.title')}`,
    description: t('news.description'),
    site: site!,
    customData: `<language>${lang}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: newsPath(lang, postSlug(post)),
    })),
  });
};
