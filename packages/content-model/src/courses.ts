import { z } from 'zod';

export const courseLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const lessonTypeSchema = z.enum(['video', 'text', 'quiz', 'project']);

export const courseFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  level: courseLevelSchema,
  estimatedTotalMinutes: z.number(),
  tags: z.array(z.string()).default([]),
  track: z.string().optional(),
  prerequisites: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  published: z.boolean().default(true),
});

export const lessonFrontmatterSchema = z.object({
  courseSlug: z.string(),
  title: z.string(),
  module: z.string(),
  orderInModule: z.number(),
  estimatedMinutes: z.number(),
  requiresExperience: z.boolean().default(false),
  type: lessonTypeSchema.default('text'),
  goals: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
  })).optional(),
});

export type CourseLevel = z.infer<typeof courseLevelSchema>;
export type LessonType = z.infer<typeof lessonTypeSchema>;
export type CourseFrontmatter = z.infer<typeof courseFrontmatterSchema>;
export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;

export interface CourseEntry {
  slug: string;
  data: CourseFrontmatter;
}

export interface LessonEntry {
  slug: string;
  data: LessonFrontmatter;
  body: string;
}

export interface CourseModule {
  name: string;
  lessons: LessonEntry[];
}

export interface CourseProgress {
  courseSlug: string;
  completedLessons: string[];
  lastAccessed: string;
  progress: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}
