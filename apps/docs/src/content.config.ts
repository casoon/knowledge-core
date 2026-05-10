import { defineCollection } from 'astro:content';
import { docsFrontmatterSchema } from '@knowledge-core/content-model/docs';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: docsFrontmatterSchema,
});

export const collections = { docs };
