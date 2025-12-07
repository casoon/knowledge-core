/**
 * Course progress tracking utilities
 */

import { safeGetItem, safeSetItem } from './storage';

export interface CourseProgress {
  completedLessons: string[];
  lastVisited?: string;
  updatedAt: string;
}

/**
 * Get progress for a specific course
 */
export function getCourseProgress(courseSlug: string): CourseProgress {
  const key = `course-progress-${courseSlug}`;
  const data = safeGetItem(key);

  if (!data) {
    return { completedLessons: [], updatedAt: new Date().toISOString() };
  }

  try {
    const parsed = JSON.parse(data);
    // Handle legacy format (just an array)
    if (Array.isArray(parsed)) {
      return { completedLessons: parsed, updatedAt: new Date().toISOString() };
    }
    return parsed;
  } catch {
    return { completedLessons: [], updatedAt: new Date().toISOString() };
  }
}

/**
 * Save progress for a specific course
 */
export function saveCourseProgress(courseSlug: string, progress: CourseProgress): boolean {
  const key = `course-progress-${courseSlug}`;
  progress.updatedAt = new Date().toISOString();
  return safeSetItem(key, JSON.stringify(progress));
}

/**
 * Mark a lesson as completed
 */
export function markLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const progress = getCourseProgress(courseSlug);

  if (!progress.completedLessons.includes(lessonSlug)) {
    progress.completedLessons.push(lessonSlug);
  }
  progress.lastVisited = lessonSlug;

  return saveCourseProgress(courseSlug, progress);
}

/**
 * Check if a lesson is completed
 */
export function isLessonCompleted(courseSlug: string, lessonSlug: string): boolean {
  const progress = getCourseProgress(courseSlug);
  return progress.completedLessons.includes(lessonSlug);
}

/**
 * Mark current lesson as visited (for auto-tracking)
 */
export function markLessonVisited(courseSlug: string, lessonSlug: string): void {
  const progress = getCourseProgress(courseSlug);
  progress.lastVisited = lessonSlug;
  saveCourseProgress(courseSlug, progress);
}

/**
 * Get all course progress (for export)
 */
export function getAllProgress(): Record<string, CourseProgress> {
  const allProgress: Record<string, CourseProgress> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('course-progress-')) {
        const courseSlug = key.replace('course-progress-', '');
        allProgress[courseSlug] = getCourseProgress(courseSlug);
      }
    }
  } catch {
    // localStorage not available
  }

  return allProgress;
}

/**
 * Import progress data
 */
export function importProgress(data: Record<string, CourseProgress>): boolean {
  try {
    for (const [courseSlug, progress] of Object.entries(data)) {
      saveCourseProgress(courseSlug, progress);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Export progress as JSON string
 */
export function exportProgress(): string {
  return JSON.stringify(getAllProgress(), null, 2);
}
