export interface LessonLike {
  id: string;
  data: {
    module: string;
    orderInModule: number;
  };
}

export interface LessonNavigation<T extends LessonLike> {
  firstLesson: T | null;
  prevLesson: T | null;
  nextLesson: T | null;
  currentIndex: number;
}

export function sortLessons<T extends LessonLike>(lessons: T[]): T[] {
  return [...lessons].sort((a, b) => {
    const modCmp = a.data.module.localeCompare(b.data.module);
    if (modCmp !== 0) return modCmp;
    return a.data.orderInModule - b.data.orderInModule;
  });
}

export function groupLessonsByModule<T extends LessonLike>(lessons: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const lesson of lessons) {
    const mod = lesson.data.module;
    if (!groups[mod]) groups[mod] = [];
    groups[mod].push(lesson);
  }
  return groups;
}

export function getLessonNavigation<T extends LessonLike>(
  sortedLessons: T[],
  currentLessonId: string
): LessonNavigation<T> {
  const currentIndex = sortedLessons.findIndex((l) => l.id === currentLessonId);
  return {
    firstLesson: sortedLessons[0] ?? null,
    prevLesson: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null,
    nextLesson:
      currentIndex >= 0 && currentIndex < sortedLessons.length - 1
        ? sortedLessons[currentIndex + 1]
        : null,
    currentIndex,
  };
}
