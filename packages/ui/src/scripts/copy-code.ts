/**
 * Code block copy functionality with clipboard API
 */

export function initCopyButtons(): void {
  document.querySelectorAll('[data-copy-button]').forEach((button) => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block')?.querySelector('code');
      if (!codeBlock) return;

      const code = codeBlock.textContent || '';

      try {
        await navigator.clipboard.writeText(code);

        // Visual feedback - Success
        const originalHTML = button.innerHTML;
        button.innerHTML = `<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>`;

        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      } catch {
        // Fallback for older browsers or missing permissions
        const originalHTML = button.innerHTML;
        button.innerHTML = `<svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>`;

        setTimeout(() => {
          button.innerHTML = originalHTML;
        }, 2000);
      }
    });
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
  initCopyButtons();
}
