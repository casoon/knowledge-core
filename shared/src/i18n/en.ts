export const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.docs': 'Documentation',
  'nav.courses': 'Courses',

  // Search
  'search.placeholder': 'Search...',
  'search.label': 'Search documentation',

  // Pagination
  'pagination.prev': 'Previous',
  'pagination.next': 'Next',

  // Page actions
  'page.edit': 'Edit this page',

  // Sidebar
  'sidebar.on_this_page': 'On this page',

  // Content status
  'status.stable': 'Stable',
  'status.beta': 'Beta',
  'status.deprecated': 'Deprecated',

  // Course UI
  'course.start': 'Start Course',
  'course.continue': 'Continue',
  'course.content': 'Course Content',
  'course.level.beginner': 'Beginner',
  'course.level.intermediate': 'Intermediate',
  'course.level.advanced': 'Advanced',
  'course.no_lessons': 'This course has no lessons yet.',
  'course.no_courses': 'No courses available yet.',
  'lesson.complete': 'Mark as complete',
  'lesson.minutes': '{n} min',

  // Progress
  'progress.total': 'Total Progress',
  'progress.lessons': '{completed} of {total} lessons',

  // Common
  'common.loading': 'Loading...',
  'common.close': 'Close',
  'common.open_menu': 'Open menu',
  'common.theme_toggle': 'Toggle theme',
  'common.font_size': 'Font size',
  'common.show_quizzes': 'Show quizzes',
  'common.sync': 'Sync',
};

export type TranslationKey = keyof typeof en;
