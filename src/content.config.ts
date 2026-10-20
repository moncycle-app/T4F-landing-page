import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts: src/content/blog/<lang>/<slug>.md
 * An entry's id is "<lang>/<slug>".
 * Both translations of a post share the same `translationKey` value.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    translationKey: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
