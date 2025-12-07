/**
 * UI Scripts - Central export for all client-side functionality
 */

export { safeGetItem, safeSetItem, safeRemoveItem } from "./storage";
export { initLessonNav } from "./lesson-nav";
export { initMobileMenu } from "./mobile-menu";
export { initCopyButtons } from "./copy-code";
export {
  getCourseProgress,
  saveCourseProgress,
  markLessonCompleted,
  isLessonCompleted,
  markLessonVisited,
  getAllProgress,
  importProgress,
  exportProgress,
  type CourseProgress,
} from "./progress";
