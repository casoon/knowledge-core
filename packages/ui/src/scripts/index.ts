/**
 * UI Scripts - Central export for all client-side functionality
 */

export { initCopyButtons } from './copy-code';
export { initLessonNav } from './lesson-nav';
export { initMobileMenu } from './mobile-menu';
export {
  type CourseProgress,
  exportProgress,
  getAllProgress,
  getCourseProgress,
  importProgress,
  isLessonCompleted,
  markLessonCompleted,
  markLessonVisited,
  saveCourseProgress,
} from './progress';
export { safeGetItem, safeRemoveItem, safeSetItem } from './storage';
