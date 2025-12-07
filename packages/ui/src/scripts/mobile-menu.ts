/**
 * Mobile menu toggle functionality
 */

export function initMobileMenu(): void {
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuButton || !mobileMenu) return;

  const menuIcon = mobileMenuButton.querySelector(".menu-icon");
  const closeIcon = mobileMenuButton.querySelector(".close-icon");

  mobileMenuButton.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    const isOpen = !isHidden;

    // Update ARIA attributes
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Menü schließen" : "Menü öffnen",
    );

    // Toggle icons
    if (menuIcon && closeIcon) {
      menuIcon.classList.toggle("hidden", isOpen);
      closeIcon.classList.toggle("hidden", !isOpen);
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.setAttribute("aria-label", "Menü öffnen");
      if (menuIcon && closeIcon) {
        menuIcon.classList.remove("hidden");
        closeIcon.classList.add("hidden");
      }
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileMenu);
} else {
  initMobileMenu();
}
