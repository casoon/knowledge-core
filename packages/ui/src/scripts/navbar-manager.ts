/**
 * NavBarManager - Manages Mobile Menu and Theme Toggle
 * Uses AbortController to prevent listener accumulation on ClientRouter navigation.
 */

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage not available
  }
}

let mobileMenuController: AbortController | null = null;

/**
 * Initializes the Mobile Menu Toggle
 */
export function initMobileMenu(): void {
  mobileMenuController?.abort();
  mobileMenuController = new AbortController();
  const { signal } = mobileMenuController;

  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuButton || !mobileMenu) return;

  // Ensure menu is closed on navigation
  mobileMenu.classList.add('hidden');
  mobileMenuButton.setAttribute('aria-expanded', 'false');

  const menuIcon = mobileMenuButton.querySelector('.menu-icon');
  const closeIcon = mobileMenuButton.querySelector('.close-icon');

  mobileMenuButton.addEventListener(
    'click',
    () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      const isOpen = !isHidden;

      mobileMenuButton.setAttribute('aria-expanded', String(isOpen));
      mobileMenuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

      if (menuIcon && closeIcon) {
        menuIcon.classList.toggle('hidden', isOpen);
        closeIcon.classList.toggle('hidden', !isOpen);
      }
    },
    { signal }
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'Open menu');
        if (menuIcon && closeIcon) {
          menuIcon.classList.remove('hidden');
          closeIcon.classList.add('hidden');
        }
      }
    },
    { signal }
  );
}

let mobileTriggersController: AbortController | null = null;

/**
 * Initializes the Mobile Menu Triggers for Search and Sync Modals
 */
export function initMobileTriggers(): void {
  mobileTriggersController?.abort();
  mobileTriggersController = new AbortController();
  const { signal } = mobileTriggersController;

  const mobileSearchTrigger = document.getElementById('mobile-search-trigger');
  const mobileSyncTrigger = document.getElementById('mobile-sync-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const syncModal = document.getElementById('sync-modal');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileSearchTrigger && searchModal) {
    mobileSearchTrigger.addEventListener(
      'click',
      () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
        searchModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (searchInput) (searchInput as HTMLInputElement).focus();
      },
      { signal }
    );
  }

  if (mobileSyncTrigger && syncModal) {
    mobileSyncTrigger.addEventListener(
      'click',
      () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
        syncModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      },
      { signal }
    );
  }
}

/**
 * Creates the Theme Toggle Button
 */
export function initThemeToggle(): void {
  const container = document.getElementById('theme-toggle-container');
  if (!container) return;

  // Prevent duplicate buttons on ClientRouter navigation
  const existing = container.querySelector('#theme-toggle') as HTMLButtonElement | null;

  const updateIcon = (btn: HTMLButtonElement): void => {
    const isDark = document.documentElement.classList.contains('dark');
    btn.innerHTML = isDark
      ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`
      : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>`;
  };

  if (existing) {
    updateIcon(existing);
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-ghost p-2';
  button.setAttribute('aria-label', 'Toggle theme');
  button.id = 'theme-toggle';

  button.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    safeSetItem('theme', isDark ? 'dark' : 'light');
    updateIcon(button);
  });

  updateIcon(button);
  container.appendChild(button);
}

/**
 * Initializes all NavBar functionality
 */
export function initNavBar(options: { showThemeToggle?: boolean } = {}): void {
  initMobileMenu();
  initMobileTriggers();

  if (options.showThemeToggle !== false) {
    initThemeToggle();
  }
}
