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
  vite: {
    build: {
      // Embed fonts in the CSS as data URIs, like the original single-file landing page
      assetsInlineLimit: (file) => (file.endsWith('.woff2') ? true : undefined),
    },
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: {
      // Every page is prefixed: /fr/… and /en/…
      prefixDefaultLocale: true,
      // The root "/" is handled by src/pages/index.astro (language detection)
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    // Language alternates are declared by each page's hreflang tags.
    // The root (a noindex redirect) is excluded.
    sitemap({ filter: (page) => page !== 'https://tech4fertility.org/' }),
  ],
});
