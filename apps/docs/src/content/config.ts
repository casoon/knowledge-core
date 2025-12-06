import { defineCollection } from 'astro:content';
import { docsFrontmatterSchema } from '@knowledge-core/content-model';

const docsCollection = defineCollection({
  type: 'content',
  schema: docsFrontmatterSchema,
});

export const collections = {
  docs: docsCollection,
};
