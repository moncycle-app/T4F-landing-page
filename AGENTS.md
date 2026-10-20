# AGENTS.md

Guide for AI agents (and humans) working on this repository.

## Project

Website of the **Tech 4 Fertility** association (https://tech4fertility.org), statically generated with
[Astro](https://astro.build) 7. Bilingual French / English: every page lives under a language prefix,
`/fr/…` and `/en/…`. For now: an "under construction" home page and a news section
("News" in English, "Actualités" in French).

How to write a news post (for non-developers) is explained in `README.md`.

## Commands

| Task                         | Command                                       |
| ---------------------------- | --------------------------------------------- |
| Dev server (live reload)     | `npm run dev` → http://localhost:4321/fr/     |
| Production build (`./dist`)  | `npm run build`                               |
| Preview the production build | `npm run preview`                             |
| Type check only              | `npx astro check`                             |

- `npm run build` runs `astro check` then `astro build`: **a passing build means types are valid**.
  Run it before considering a task done.
- `package-lock.json` is committed; only change it through `npm install`.
- `@astrojs/check` does not support TypeScript 7 yet: keep `typescript` on `^6`.

## Structure

```
public/                       Copied as-is to dist/
  images/                     All images (favicons, logo, news images) → dist/images/
src/
  assets/fonts/               Figtree variable font (inlined into the CSS at build time)
  content.config.ts           "news" collection schema
  content/news/fr/*.md        French news posts
  content/news/en/*.md        English news posts
  i18n/ui.ts                  Languages, UI strings (fr/en), home section anchors, shared external links
  i18n/utils.ts               Helpers: useTranslations, localizedPath, formatDate…
  i18n/news.ts                News helpers: newsSegment, newsPath, getPosts, postLang, postSlug
  layouts/BaseLayout.astro    <head> (SEO, hreflang), header, footer
  components/                 Logo, language picker, anti-spam e-mail button, home page sections
                              (*Section.astro: projects and team members are data arrays inside)
  pages/index.astro           Root "/": redirects to /fr/ or /en/ (saved choice > browser > English)
  pages/[lang]/index.astro    Home page: hero + association, projects, team, donate, contact sections
  pages/[lang]/legal.astro    Legal notice (mentions légales); renders the page language's half of LICENSE.md
  pages/llms.txt.ts           /llms.txt: Markdown overview of the site for LLMs (pages + news posts)
  pages/[lang]/[news]/        News list and post page (/en/news/…, /fr/actualites/…)
  pages/404.astro             Bilingual error page
  styles/global.css           Global styles (color variables, light/dark theme)
```

## Build output

- CSS and the font are **inlined** into every HTML page (`build.inlineStylesheets: 'always'` and
  `vite.build.assetsInlineLimit` in `astro.config.mjs`), so styling never depends on an absolute URL.
- Images are served from `/images/…` and internal links are absolute (`/fr/…`): the `dist` folder is
  meant to be served by a web server at the domain root (use `npm run preview` locally).
  Opening HTML files directly from disk shows the styled page, but images and navigation won't work.
- Put every image in `public/images/` (sub-folders allowed) and reference it as `/images/…`.

## Internationalization

- English is the default language (`defaultLang` in `src/i18n/ui.ts`, `i18n.defaultLocale` in
  `astro.config.mjs`): used by the root redirect fallback, with or without JavaScript.
- Languages are declared in `src/i18n/ui.ts` (`languages`) **and** in `astro.config.mjs` (`i18n.locales`):
  keep both in sync.
- No hard-coded UI text in components: add a key to `ui.fr` **and** `ui.en`, then use `t('my.key')`.
  The `UiKey` type flags missing keys.
- Build internal links with `localizedPath(lang, 'path')` (trailing slash included).
- Home section anchors are translated (`sectionIds` in `src/i18n/ui.ts`, e.g. `/fr/#projets`, `/en/#projects`):
  link to them with `sectionPath(lang, 'projects')`.
- New pages go under `src/pages/[lang]/` and export `getStaticPaths = langStaticPaths`.
  Also list them in `src/pages/llms.txt.ts` (news posts are listed automatically).
- By default the language picker points to the same path in the other language. If the URLs differ
  (news section, news posts), pass `alternates` to `BaseLayout`.

## News

One post = one Markdown file (`.md`) in its language folder. The file name becomes the URL slug:
`src/content/news/en/my-post.md` → `/en/news/my-post/`, `src/content/news/fr/mon-article.md` →
`/fr/actualites/mon-article/`.

- The section's URL segment is translated (`newsSegment` in `src/i18n/news.ts`): always build news
  URLs with `newsPath(lang, slug?)`, never with `localizedPath(lang, 'news')`.
- In code and file names the section is called `news`; in the UI it is "News" / "Actualités"
  (`news.*` keys in `ui.ts`). Never call it "blog".

```md
---
title: Post title
description: Target 160 characters, 300 max. News list, SEO metadata, RSS feed and /latest-news.json.
pubDate: 2026-10-20
updatedDate: 2026-11-02     # optional
translationKey: my-post     # same value in both languages
draft: false                # true = only visible in dev
---

Markdown content…
```

- Both translations of a post share the same `translationKey` (slugs may differ, e.g.
  `fr/bienvenue.md` and `en/welcome.md`). The language picker and the `hreflang` tags then link the two
  versions. Without a translation, the picker falls back to the news list.
- RSS: one feed per language, `/en/news/rss.xml` and `/fr/actualites/rss.xml` (`[lang]/[news]/rss.xml.ts`,
  `@astrojs/rss`), built from `getPosts` (so drafts are excluded in production) and each post's `description`.
  Build its URL with `newsRssPath(lang)`. It is advertised in `BaseLayout` (`<link rel="alternate">`),
  the footer and `llms.txt`.
- `/latest-news.json` (`src/pages/latest-news.json.ts`): metadata (no content) of the latest published post of
  each language, under the `en` and `fr` keys, for other sites and apps to notify their users. Keep its
  fields stable: external consumers depend on them. Not language-prefixed, as it covers both languages.
- Post images: put them in `public/images/news/` and reference them as `/images/news/my-image.jpg`.
- The home page hero shows a "New" banner linking to the latest post of its language for 30 days after
  `pubDate` (`LatestNews.astro`). Expiry is checked in the browser, so it disappears without a rebuild.

## Conventions

- Everything in the codebase is written in **English**: code, comments, docs, commit messages.
  French only appears as site content (French UI strings in `ui.ts`, posts in `content/news/fr/`).
- 100% static site (`output: "static"`), no server adapter.
- Accessibility: keep the `aria-*` attributes, visible focus styles and `prefers-reduced-motion` support.
- The e-mail address never appears in clear text in the HTML: use the `ContactButton` component
  (defaults to the association address; pass `user`/`domain` for another one).
- Colors: only through the CSS variables in `:root` (light and dark themes).
- License: all rights reserved, see `LICENSE.md` (English + French). Information may be reused with a
  link to the source; search engines and AI systems are explicitly allowed. Keep `LICENSE.md`, the
  legal page, `public/robots.txt` and `src/pages/llms.txt.ts` consistent. The legal page renders `LICENSE.md`
  directly and expects its `## English` and `## Français` headings.
