import { defineCollection } from 'astro:content';
import { courseFrontmatterSchema, lessonFrontmatterSchema } from '@knowledge-core/content-model';

const coursesCollection = defineCollection({
  type: 'data',
  schema: courseFrontmatterSchema,
});

const lessonsCollection = defineCollection({
  type: 'content',
  schema: lessonFrontmatterSchema,
});

export const collections = {
  courses: coursesCollection,
  lessons: lessonsCollection,
};
