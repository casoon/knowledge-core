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
    // Starlight-inspired fields
    draft: z.boolean().default(false),
    editUrl: z.optional(z.string()),
    pagefind: z.boolean().default(true),
    sidebar: z.optional(
      z.object({
        badge: z.optional(
          z.object({
            variant: z.enum(['note', 'tip', 'danger', 'caution', 'success']),
            text: z.string(),
          })
        ),
      })
    ),
    prev: z.optional(z.union([z.boolean(), z.object({ link: z.string(), label: z.string() })])),
    next: z.optional(z.union([z.boolean(), z.object({ link: z.string(), label: z.string() })])),
  }),
});

export const collections = { docs };
