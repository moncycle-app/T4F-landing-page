// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tech4fertility.org',
  trailingSlash: 'ignore',
  build: {
    // Inline the CSS into every page so it does not depend on an absolute /_astro/ URL
    // (pages render correctly even when opened straight from the dist folder).
    inlineStylesheets: 'always',
  },
  // Dev only: Astro's dev server answers 403 to cross-site requests (Sec-Fetch-Site) unless the Origin is allowed,
  // so /latest-news.json could not be tested from another local site. Production CORS is set by the web server
  // (see public/_headers).
  security: process.argv.includes('dev') ? { allowedDomains: [{}] } : {},
  vite: {
    // Dev only: Vite's default CORS policy also rejects other origins.
    server: { cors: true },
    build: {
      // Embed fonts in the CSS as data URIs, like the original single-file landing page
      assetsInlineLimit: (file) => (file.endsWith('.woff2') ? true : undefined),
    },
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'en',
    routing: {
      // Every page is prefixed: /fr/… and /en/…
      prefixDefaultLocale: true,
      // The root "/" is handled by src/pages/index.astro (language detection)
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    // Language alternates are declared by each page's hreflang tags.
    // The root (a noindex redirect) and the 404 pages are excluded.
    sitemap({ filter: (page) => page !== 'https://tech4fertility.org/' && !page.endsWith('/404/') }),
  ],
});
