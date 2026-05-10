import { describe, expect, it } from 'vitest';
import { getLessonNavigation, groupLessonsByModule, sortLessons } from './lesson-utils';

function makeLessons(data: Array<{ id: string; module: string; order: number }>) {
  return data.map(({ id, module, order }) => ({
    id,
    data: { module, orderInModule: order },
  }));
}

describe('sortLessons', () => {
  it('sorts by module name then orderInModule', () => {
    const lessons = makeLessons([
      { id: 'c', module: 'B', order: 1 },
      { id: 'a', module: 'A', order: 2 },
      { id: 'b', module: 'A', order: 1 },
    ]);
    expect(sortLessons(lessons).map((l) => l.id)).toEqual(['b', 'a', 'c']);
  });

  it('does not mutate the input array', () => {
    const lessons = makeLessons([
      { id: 'a', module: 'B', order: 1 },
      { id: 'b', module: 'A', order: 1 },
    ]);
    const original = lessons.map((l) => l.id);
    sortLessons(lessons);
    expect(lessons.map((l) => l.id)).toEqual(original);
  });

  it('returns stable order for lessons in the same module', () => {
    const lessons = makeLessons([
      { id: 'a', module: 'M', order: 3 },
      { id: 'b', module: 'M', order: 1 },
      { id: 'c', module: 'M', order: 2 },
    ]);
    expect(sortLessons(lessons).map((l) => l.id)).toEqual(['b', 'c', 'a']);
  });
});

describe('groupLessonsByModule', () => {
  it('groups lessons by their module key', () => {
    const lessons = makeLessons([
      { id: 'a', module: 'M1', order: 1 },
      { id: 'b', module: 'M2', order: 1 },
      { id: 'c', module: 'M1', order: 2 },
    ]);
    const groups = groupLessonsByModule(lessons);
    expect(Object.keys(groups)).toEqual(['M1', 'M2']);
    expect(groups.M1.map((l) => l.id)).toEqual(['a', 'c']);
    expect(groups.M2.map((l) => l.id)).toEqual(['b']);
  });

  it('returns an empty object for an empty input', () => {
    expect(groupLessonsByModule([])).toEqual({});
  });
});

describe('getLessonNavigation', () => {
  const lessons = makeLessons([
    { id: 'a', module: 'M1', order: 1 },
    { id: 'b', module: 'M1', order: 2 },
    { id: 'c', module: 'M2', order: 1 },
  ]);

  it('returns correct nav for the first lesson', () => {
    const nav = getLessonNavigation(lessons, 'a');
    expect(nav.firstLesson?.id).toBe('a');
    expect(nav.prevLesson).toBeNull();
    expect(nav.nextLesson?.id).toBe('b');
    expect(nav.currentIndex).toBe(0);
  });

  it('returns correct nav for a middle lesson', () => {
    const nav = getLessonNavigation(lessons, 'b');
    expect(nav.prevLesson?.id).toBe('a');
    expect(nav.nextLesson?.id).toBe('c');
    expect(nav.currentIndex).toBe(1);
  });

  it('returns correct nav for the last lesson', () => {
    const nav = getLessonNavigation(lessons, 'c');
    expect(nav.prevLesson?.id).toBe('b');
    expect(nav.nextLesson).toBeNull();
    expect(nav.currentIndex).toBe(2);
  });

  it('returns -1 and nulls for an unknown lesson id', () => {
    const nav = getLessonNavigation(lessons, 'unknown');
    expect(nav.currentIndex).toBe(-1);
    expect(nav.prevLesson).toBeNull();
    expect(nav.nextLesson).toBeNull();
    expect(nav.firstLesson?.id).toBe('a');
  });
});
