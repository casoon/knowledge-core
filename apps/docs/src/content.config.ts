import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.optional(z.string()),
    category: z.enum(['getting-started', 'guides', 'api', 'cookbook', 'components']),
    order: z.number().default(0),
    sidebarGroup: z.optional(z.string()),
    tags: z.array(z.string()).default([]),
    status: z.enum(['stable', 'beta', 'deprecated']).default('stable'),
    lastUpdated: z.optional(z.coerce.date()),
    author: z.optional(z.string()),
  }),
});

export const collections = { docs };
