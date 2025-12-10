/**
 * SyncManager - Manages cloud synchronization for learning progress
 */

const STORAGE_KEY = "sync-code";

interface SyncElements {
  modal: HTMLElement;
  backdrop: HTMLElement | null;
  syncButton: HTMLElement;
  closeButton: HTMLElement | null;
  statusNone: HTMLElement | null;
  statusActive: HTMLElement | null;
  loadingState: HTMLElement | null;
  errorState: HTMLElement | null;
  errorMessage: HTMLElement | null;
  createButton: HTMLElement | null;
  loadButton: HTMLElement | null;
  codeInput: HTMLInputElement | null;
  codeDisplay: HTMLElement | null;
  copyButton: HTMLElement | null;
  saveNowButton: HTMLElement | null;
  disconnectButton: HTMLElement | null;
  lastUpdatedSpan: HTMLElement | null;
}

function getElements(): SyncElements | null {
  const modal = document.getElementById("sync-modal");
  const syncButton = document.getElementById("sync-button");

  if (!modal || !syncButton) return null;

  return {
    modal,
    syncButton,
    backdrop: document.getElementById("sync-backdrop"),
    closeButton: document.getElementById("sync-close"),
    statusNone: document.getElementById("sync-status-none"),
    statusActive: document.getElementById("sync-status-active"),
    loadingState: document.getElementById("sync-loading"),
    errorState: document.getElementById("sync-error"),
    errorMessage: document.getElementById("sync-error-message"),
    createButton: document.getElementById("sync-create"),
    loadButton: document.getElementById("sync-load"),
    codeInput: document.getElementById(
      "sync-code-input",
    ) as HTMLInputElement | null,
    codeDisplay: document.getElementById("sync-code-display"),
    copyButton: document.getElementById("sync-copy"),
    saveNowButton: document.getElementById("sync-save-now"),
    disconnectButton: document.getElementById("sync-disconnect"),
    lastUpdatedSpan: document.getElementById("sync-last-updated"),
  };
}

function getAllProgress(): Record<string, unknown> {
  const progress: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("course-progress-")) {
        progress[key] = JSON.parse(localStorage.getItem(key) || "{}");
      }
    }
  } catch {
    // Ignore errors
  }
  return progress;
}

function setAllProgress(progress: Record<string, unknown>): void {
  try {
    for (const [key, value] of Object.entries(progress)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore errors
  }
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function showState(
  elements: SyncElements,
  state: "none" | "active" | "loading",
): void {
  elements.statusNone?.classList.add("hidden");
  elements.statusActive?.classList.add("hidden");
  elements.loadingState?.classList.add("hidden");
  elements.errorState?.classList.add("hidden");

  if (state === "none") elements.statusNone?.classList.remove("hidden");
  else if (state === "active")
    elements.statusActive?.classList.remove("hidden");
  else if (state === "loading")
    elements.loadingState?.classList.remove("hidden");
}

function showError(elements: SyncElements, message: string): void {
  elements.errorState?.classList.remove("hidden");
  if (elements.errorMessage) {
    elements.errorMessage.textContent = message;
  }
}

function hideError(elements: SyncElements): void {
  elements.errorState?.classList.add("hidden");
}

function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore errors
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

export function initSyncManager(): void {
  const elements = getElements();
  if (!elements) return;

  const {
    modal,
    backdrop,
    syncButton,
    closeButton,
    createButton,
    loadButton,
    codeInput,
    codeDisplay,
    copyButton,
    saveNowButton,
    disconnectButton,
    lastUpdatedSpan,
  } = elements;

  // Modal functions
  function openModal(): void {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    hideError(elements);

    const savedCode = safeGetItem(STORAGE_KEY);
    if (savedCode && codeDisplay) {
      codeDisplay.textContent = savedCode;
      showState(elements, "active");
    } else {
      showState(elements, "none");
    }
  }

  function closeModal(): void {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // Event listeners
  syncButton.addEventListener("click", openModal);
  closeButton?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Create new sync
  createButton?.addEventListener("click", async () => {
    showState(elements, "loading");
    hideError(elements);

    try {
      const response = await fetch("/api/sync/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: getAllProgress() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating sync");
      }

      safeSetItem(STORAGE_KEY, data.code);
      safeSetItem(STORAGE_KEY + "-updated", new Date().toISOString());
      if (codeDisplay) codeDisplay.textContent = data.code;
      if (lastUpdatedSpan)
        lastUpdatedSpan.textContent = formatDate(new Date().toISOString());
      showState(elements, "active");
    } catch (error) {
      showState(elements, "none");
      showError(
        elements,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  });

  // Load existing sync
  loadButton?.addEventListener("click", async () => {
    const code = codeInput?.value.toUpperCase().trim() || "";
    if (code.length !== 8) {
      showError(elements, "Please enter an 8-character code.");
      return;
    }

    showState(elements, "loading");
    hideError(elements);

    try {
      const response = await fetch(`/api/sync/${code}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Code not found");
      }

      setAllProgress(data.progress);
      safeSetItem(STORAGE_KEY, code);
      safeSetItem(STORAGE_KEY + "-updated", data.updatedAt);
      if (codeDisplay) codeDisplay.textContent = code;
      if (lastUpdatedSpan)
        lastUpdatedSpan.textContent = formatDate(data.updatedAt);
      showState(elements, "active");

      // Reload page to show progress
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      showState(elements, "none");
      showError(
        elements,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  });

  // Save now
  saveNowButton?.addEventListener("click", async () => {
    const code = safeGetItem(STORAGE_KEY);
    if (!code) return;

    showState(elements, "loading");
    hideError(elements);

    try {
      const response = await fetch("/api/sync/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, progress: getAllProgress() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error saving");
      }

      safeSetItem(STORAGE_KEY + "-updated", data.updatedAt);
      if (lastUpdatedSpan)
        lastUpdatedSpan.textContent = formatDate(data.updatedAt);
      showState(elements, "active");
    } catch (error) {
      showState(elements, "active");
      showError(
        elements,
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  });

  // Copy code
  copyButton?.addEventListener("click", () => {
    const code = codeDisplay?.textContent || "";
    navigator.clipboard.writeText(code).then(() => {
      if (copyButton) {
        copyButton.innerHTML =
          '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        setTimeout(() => {
          copyButton.innerHTML =
            '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>';
        }, 2000);
      }
    });
  });

  // Disconnect
  disconnectButton?.addEventListener("click", () => {
    safeRemoveItem(STORAGE_KEY);
    safeRemoveItem(STORAGE_KEY + "-updated");
    if (codeInput) codeInput.value = "";
    showState(elements, "none");
  });

  // Format code input
  codeInput?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    target.value = target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  });

  // Load last updated
  const savedUpdated = safeGetItem(STORAGE_KEY + "-updated");
  if (savedUpdated && lastUpdatedSpan) {
    lastUpdatedSpan.textContent = formatDate(savedUpdated);
  }
}
