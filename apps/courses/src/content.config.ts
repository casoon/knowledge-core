import { defineCollection } from 'astro:content';
import {
  courseFrontmatterSchema,
  lessonFrontmatterSchema,
} from '@knowledge-core/content-model/courses';
import { glob } from 'astro/loaders';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/courses' }),
  schema: courseFrontmatterSchema,
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: lessonFrontmatterSchema,
});

export const collections = { courses, lessons };
