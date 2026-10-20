import type { APIRoute } from 'astro';
import { getPosts, newsPath, postLang, postSlug } from '../i18n/news';
import { defaultLang, languages, langs, links, ui } from '../i18n/ui';
import { localizedPath } from '../i18n/utils';

/**
 * /llms.txt (https://llmstxt.org): Markdown overview of the site for LLMs and AI tools.
 * Generated at build time, so new news posts are listed automatically.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const posts = await getPosts();
  // Default language first
  const order = [defaultLang, ...langs.filter((lang) => lang !== defaultLang)];

  const pages = order.flatMap((lang) => [
    `- [${ui[lang]['nav.home']} (${languages[lang]})](${url(localizedPath(lang))}): ${ui[lang]['home.description']}`,
    `- [${ui[lang]['news.title']} (${languages[lang]})](${url(newsPath(lang))}): ${ui[lang]['news.description']}`,
    `- [${ui[lang]['legal.heading']} (${languages[lang]})](${url(localizedPath(lang, 'legal'))}): ${ui[lang]['legal.description']}`,
  ]);

  const postSections = order.flatMap((lang) => {
    const list = posts.filter((post) => postLang(post) === lang);
    if (!list.length) return [];
    return [
      `## News (${languages[lang]})`,
      '',
      ...list.map(
        (post) => `- [${post.data.title}](${url(newsPath(lang, postSlug(post)))}): ${post.data.description}`,
      ),
      '',
    ];
  });

  const body = [
    '# Tech 4 Fertility',
    '',
    `> ${ui.en['site.tagline']} Tech 4 Fertility is a French non-profit association (loi 1901). This website is bilingual: every page exists in English (/en/) and French (/fr/).`,
    '',
    'Search engines and AI systems are welcome: indexing, caching, text and data mining and AI training are explicitly permitted.',
    'When reusing information from this site, please credit Tech 4 Fertility with a link to the original page.',
    '',
    '## Pages',
    '',
    ...pages,
    '',
    '## Projects',
    '',
    `- [moncycle.app](${links.moncycle}): free, ad-free, open-source web app for tracking the menstrual cycle with natural family planning methods. Source code: ${links.moncycleSource}`,
    '',
    ...postSections,
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
