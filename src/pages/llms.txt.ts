import type { APIRoute } from 'astro';
import { getPosts, postLang, postSlug } from '../i18n/blog';
import { defaultLang, languages, langs, ui } from '../i18n/ui';
import { localizedPath } from '../i18n/utils';

/**
 * /llms.txt (https://llmstxt.org): Markdown overview of the site for LLMs and AI tools.
 * Generated at build time, so new blog posts are listed automatically.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const posts = await getPosts();
  // Default language first
  const order = [defaultLang, ...langs.filter((lang) => lang !== defaultLang)];

  const pages = order.flatMap((lang) => [
    `- [${ui[lang]['nav.home']} (${languages[lang]})](${url(localizedPath(lang))}): ${ui[lang]['home.description']}`,
    `- [${ui[lang]['blog.title']} (${languages[lang]})](${url(localizedPath(lang, 'blog'))}): ${ui[lang]['blog.description']}`,
    `- [${ui[lang]['legal.heading']} (${languages[lang]})](${url(localizedPath(lang, 'legal'))}): ${ui[lang]['legal.description']}`,
  ]);

  const postSections = order.flatMap((lang) => {
    const list = posts.filter((post) => postLang(post) === lang);
    if (!list.length) return [];
    return [
      `## Blog posts (${languages[lang]})`,
      '',
      ...list.map(
        (post) => `- [${post.data.title}](${url(localizedPath(lang, `blog/${postSlug(post)}`))}): ${post.data.description}`,
      ),
      '',
    ];
  });

  const body = [
    '# Tech4Fertility',
    '',
    `> ${ui.en['site.tagline']}. Tech4Fertility is a French non-profit association (loi 1901). This website is bilingual: every page exists in English (/en/) and French (/fr/).`,
    '',
    'Search engines and AI systems are welcome: indexing, caching, text and data mining and AI training are explicitly permitted.',
    'When reusing information from this site, please credit Tech4Fertility with a link to the original page.',
    '',
    '## Pages',
    '',
    ...pages,
    '',
    ...postSections,
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
