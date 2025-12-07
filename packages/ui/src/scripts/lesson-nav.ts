/**
 * Lesson navigation sidebar toggle functionality
 */

import { safeGetItem, safeSetItem } from './storage';

export function initLessonNav(): void {
  const nav = document.getElementById('lesson-nav');
  const toggle = document.getElementById('lesson-nav-toggle');

  if (!nav || !toggle) return;

  // Load state from localStorage
  const isOpen = safeGetItem('lessonNavOpen') === 'true';
  if (isOpen) {
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    const nowOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(nowOpen));
    safeSetItem('lessonNavOpen', String(nowOpen));
  });

  // Scroll active lesson into view
  const activeLink = nav.querySelector('.lesson-link.active');
  if (activeLink) {
    setTimeout(() => {
      activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLessonNav);
} else {
  initLessonNav();
}
