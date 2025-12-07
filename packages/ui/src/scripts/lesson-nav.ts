/**
 * Lesson navigation sidebar toggle functionality
 */

import { safeGetItem, safeSetItem } from "./storage";
import { getCourseProgress } from "./progress";

export function initLessonNav(): void {
  const nav = document.getElementById("lesson-nav");
  const toggle = document.getElementById("lesson-nav-toggle");

  if (!nav || !toggle) return;

  // Load state from localStorage
  const isOpen = safeGetItem("lessonNavOpen") === "true";
  if (isOpen) {
    nav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    const nowOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(nowOpen));
    safeSetItem("lessonNavOpen", String(nowOpen));
  });

  // Scroll active lesson into view
  const activeLink = nav.querySelector(".lesson-link.active");
  if (activeLink) {
    setTimeout(() => {
      activeLink.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 100);
  }

  // Update completion status from localStorage
  updateCompletionStatus(nav);

  // Listen for lesson completion events
  window.addEventListener("lesson-completed", () => {
    updateCompletionStatus(nav);
  });
}

function updateCompletionStatus(nav: HTMLElement): void {
  // Get course slug from current URL
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (pathParts.length < 2 || pathParts[0] !== "courses") return;

  const courseSlug = pathParts[1];
  const progress = getCourseProgress(courseSlug);
  const completedLessons = progress.completedLessons;

  // Update each lesson link
  nav.querySelectorAll(".lesson-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const lessonSlug = href.split("/").pop();

    if (lessonSlug && completedLessons.includes(lessonSlug)) {
      link.classList.add("completed");

      // Update the lesson number to show checkmark
      const lessonNumber = link.querySelector(".lesson-number");
      if (lessonNumber && !lessonNumber.querySelector("svg")) {
        lessonNumber.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>`;
      }
    }
  });

  // Update progress bar
  const allLessons = nav.querySelectorAll(".lesson-link").length;
  const completedCount = completedLessons.length;
  const progressPercent =
    allLessons > 0 ? Math.round((completedCount / allLessons) * 100) : 0;

  const progressBar = nav.querySelector(".progress-bar-fill") as HTMLElement;
  const progressText = nav.querySelector(".progress-text");

  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  if (progressText) {
    progressText.textContent = `${completedCount} von ${allLessons} erledigt`;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLessonNav);
} else {
  initLessonNav();
}
