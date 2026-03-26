import { describe, expect, it } from 'vitest';
import { courseFrontmatterSchema, lessonFrontmatterSchema } from './courses';

describe('courseFrontmatterSchema', () => {
  const base = {
    title: 'Intro to TypeScript',
    slug: 'intro-typescript',
    description: 'Learn TypeScript from scratch',
    level: 'beginner' as const,
    estimatedTotalMinutes: 120,
  };

  it('parses required fields', () => {
    const result = courseFrontmatterSchema.parse(base);
    expect(result.title).toBe('Intro to TypeScript');
    expect(result.slug).toBe('intro-typescript');
    expect(result.level).toBe('beginner');
  });

  it('applies defaults', () => {
    const result = courseFrontmatterSchema.parse(base);
    expect(result.tags).toEqual([]);
    expect(result.prerequisites).toEqual([]);
    expect(result.published).toBe(true);
  });

  it('accepts published: false', () => {
    const result = courseFrontmatterSchema.parse({ ...base, published: false });
    expect(result.published).toBe(false);
  });

  it('accepts all level values', () => {
    for (const level of ['beginner', 'intermediate', 'advanced'] as const) {
      const result = courseFrontmatterSchema.parse({ ...base, level });
      expect(result.level).toBe(level);
    }
  });

  it('rejects invalid level', () => {
    expect(() => courseFrontmatterSchema.parse({ ...base, level: 'expert' })).toThrow();
  });

  it('accepts optional fields', () => {
    const result = courseFrontmatterSchema.parse({
      ...base,
      track: 'frontend',
      thumbnail: '/img/thumb.png',
      tags: ['ts', 'web'],
      prerequisites: ['intro-js'],
    });
    expect(result.track).toBe('frontend');
    expect(result.thumbnail).toBe('/img/thumb.png');
    expect(result.tags).toEqual(['ts', 'web']);
    expect(result.prerequisites).toEqual(['intro-js']);
  });
});

describe('lessonFrontmatterSchema', () => {
  const base = {
    courseSlug: 'intro-typescript',
    title: 'Variables and Types',
    module: 'Basics',
    orderInModule: 1,
    estimatedMinutes: 15,
  };

  it('parses required fields', () => {
    const result = lessonFrontmatterSchema.parse(base);
    expect(result.courseSlug).toBe('intro-typescript');
    expect(result.title).toBe('Variables and Types');
    expect(result.module).toBe('Basics');
    expect(result.orderInModule).toBe(1);
  });

  it('applies defaults', () => {
    const result = lessonFrontmatterSchema.parse(base);
    expect(result.requiresExperience).toBe(false);
    expect(result.type).toBe('text');
  });

  it('accepts all lesson types', () => {
    for (const type of ['video', 'text', 'quiz', 'project'] as const) {
      const result = lessonFrontmatterSchema.parse({ ...base, type });
      expect(result.type).toBe(type);
    }
  });

  it('accepts goals and resources', () => {
    const result = lessonFrontmatterSchema.parse({
      ...base,
      goals: ['Understand let vs const'],
      resources: [{ title: 'MDN Docs', url: 'https://developer.mozilla.org' }],
    });
    expect(result.goals).toEqual(['Understand let vs const']);
    expect(result.resources?.[0].title).toBe('MDN Docs');
  });

  it('rejects invalid lesson type', () => {
    expect(() => lessonFrontmatterSchema.parse({ ...base, type: 'blog' })).toThrow();
  });
});
