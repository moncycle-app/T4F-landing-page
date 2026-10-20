import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * News posts: src/content/news/<lang>/<slug>.md
 * An entry's id is "<lang>/<slug>".
 * Both translations of a post share the same `translationKey` value.
 */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // Target 160 characters (search engines cut there), 300 at most
    description: z.string().max(300),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    translationKey: z.string(),
    draft: z.boolean().default(false),
    // false = not announced by other websites and apps (skipped in /latest-news.json); no effect on this site
    showInThirdParty: z.boolean().default(true),
  }),
});

export const collections = { news };
