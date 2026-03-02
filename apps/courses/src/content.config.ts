import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedTotalMinutes: z.number(),
    tags: z.array(z.string()).default([]),
    track: z.optional(z.string()),
    prerequisites: z.array(z.string()).default([]),
    thumbnail: z.optional(z.string()),
    published: z.boolean().default(true),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    courseSlug: z.string(),
    title: z.string(),
    module: z.string(),
    orderInModule: z.number(),
    estimatedMinutes: z.number(),
    requiresExperience: z.boolean().default(false),
    type: z.enum(['video', 'text', 'quiz', 'project']).default('text'),
    goals: z.optional(z.array(z.string())),
    resources: z.optional(
      z.array(
        z.object({
          title: z.string(),
          url: z.string(),
        })
      )
    ),
  }),
});

export const collections = { courses, lessons };
