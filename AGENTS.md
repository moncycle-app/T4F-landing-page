# AGENTS.md

Guide for AI agents (and humans) working on this repository.

## Project

Website of the **Tech4Fertility** association (https://tech4fertility.org), statically generated with
[Astro](https://astro.build) 7. Bilingual French / English: every page lives under a language prefix,
`/fr/…` and `/en/…`. For now: an "under construction" home page and a blog.

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
  images/                     All images (favicons, logo, blog images) → dist/images/
src/
  assets/fonts/               Figtree variable font (inlined into the CSS at build time)
  content.config.ts           "blog" collection schema
  content/blog/fr/*.md        French posts
  content/blog/en/*.md        English posts
  i18n/ui.ts                  Languages + every UI string (fr/en)
  i18n/utils.ts               Helpers: useTranslations, localizedPath, formatDate…
  i18n/blog.ts                Blog helpers: getPosts, postLang, postSlug
  layouts/BaseLayout.astro    <head> (SEO, hreflang), header, footer
  components/                 Logo, language picker, anti-spam e-mail button
  pages/index.astro           Root "/": redirects to /fr/ or /en/ (saved choice > browser > English)
  pages/[lang]/index.astro    Home page
  pages/[lang]/blog/          Post list and post page
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
- New pages go under `src/pages/[lang]/` and export `getStaticPaths = langStaticPaths`.
- By default the language picker points to the same path in the other language. If the URLs differ
  (blog posts), pass `alternates` to `BaseLayout`.

## Blog

One post = one Markdown file (`.md`) in its language folder. The file name becomes the URL slug:
`src/content/blog/en/my-post.md` → `/en/blog/my-post/`.

```md
---
title: Post title
description: Summary shown in the post list and in SEO metadata.
pubDate: 2026-10-20
updatedDate: 2026-11-02     # optional
translationKey: my-post     # same value in both languages
draft: false                # true = only visible in dev
---

Markdown content…
```

- Both translations of a post share the same `translationKey` (slugs may differ, e.g.
  `fr/bienvenue.md` and `en/welcome.md`). The language picker and the `hreflang` tags then link the two
  versions. Without a translation, the picker falls back to the blog list.
- Post images: put them in `public/images/blog/` and reference them as `/images/blog/my-image.jpg`.

## Conventions

- Everything in the codebase is written in **English**: code, comments, docs, commit messages.
  French only appears as site content (French UI strings in `ui.ts`, posts in `content/blog/fr/`).
- 100% static site (`output: "static"`), no server adapter.
- Accessibility: keep the `aria-*` attributes, visible focus styles and `prefers-reduced-motion` support.
- The e-mail address never appears in clear text in the HTML: use the `ContactButton` component.
- Colors: only through the CSS variables in `:root` (light and dark themes).
