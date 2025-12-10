/**
 * Shared constants for the learning-space UI
 * Centralizes magic strings and repeated values for better maintainability
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

/** Prefix for course progress localStorage keys */
export const STORAGE_PREFIX = 'course-progress-';

/** Key for theme preference */
export const THEME_STORAGE_KEY = 'theme';

/** Key for font size preference */
export const FONT_SIZE_STORAGE_KEY = 'fontSize';

// ============================================================================
// DIFFICULTY & LEVEL STYLING
// ============================================================================

/** Badge CSS classes for exercise difficulty levels */
export const DIFFICULTY_COLORS = {
  easy: 'badge-success',
  medium: 'badge-warning',
  hard: 'badge-error',
} as const;

/** German labels for difficulty levels */
export const DIFFICULTY_LABELS = {
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
} as const;

/** Badge CSS classes for course levels */
export const LEVEL_COLORS = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-error',
} as const;

/** German labels for course levels */
export const LEVEL_LABELS = {
  beginner: 'Anfänger',
  intermediate: 'Fortgeschritten',
  advanced: 'Experte',
} as const;

// ============================================================================
// QUIZ RESULT THRESHOLDS
// ============================================================================

/** Percentage thresholds for quiz result styling */
export const QUIZ_THRESHOLDS = {
  excellent: 80, // >= 80% = success color
  passing: 60,   // >= 60% = warning color
                 // < 60% = error color
} as const;

// ============================================================================
// SYNC SETTINGS
// ============================================================================

/** TTL for sync codes in days */
export const SYNC_CODE_TTL_DAYS = 30;

/** Length of generated sync codes */
export const SYNC_CODE_LENGTH = 8;

// ============================================================================
// ACCESSIBILITY
// ============================================================================

/** ID for main content area (used by skip link) */
export const MAIN_CONTENT_ID = 'main-content';

/** Default animation duration in ms */
export const DEFAULT_ANIMATION_DURATION = 200;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Difficulty = keyof typeof DIFFICULTY_COLORS;
export type Level = keyof typeof LEVEL_COLORS;
