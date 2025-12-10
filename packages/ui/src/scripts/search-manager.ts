/**
 * SearchManager - Manages Pagefind search
 */

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
}

interface PagefindResult {
  data: () => Promise<{
    url: string;
    meta?: { title?: string };
    excerpt?: string;
  }>;
}

interface Pagefind {
  init: () => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

let pagefind: Pagefind | null = null;
let selectedIndex = -1;
let results: SearchResult[] = [];

async function loadPagefind(): Promise<Pagefind | null> {
  if (pagefind) return pagefind;
  try {
    // Dynamic import at runtime - Pagefind is only available after build
    // We use new Function to bypass Vite's static analysis
    const importPagefind = new Function(
      'return import("/pagefind/pagefind.js")',
    ) as () => Promise<Pagefind>;
    pagefind = await importPagefind();
    await pagefind!.init();
    return pagefind;
  } catch (e) {
    console.warn("Pagefind not available:", e);
    return null;
  }
}

function updateSelection(resultsContainer: HTMLElement): void {
  const items = resultsContainer.querySelectorAll(".search-result-item");
  items.forEach((item, i) => {
    if (i === selectedIndex) {
      item.classList.add("bg-primary/10", "border-primary/30");
      item.classList.remove("border-transparent");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("bg-primary/10", "border-primary/30");
      item.classList.add("border-transparent");
    }
  });
}

function navigateToSelected(): void {
  if (selectedIndex >= 0 && results[selectedIndex]) {
    window.location.href = results[selectedIndex].url;
  }
}

async function performSearch(
  query: string,
  resultsContainer: HTMLElement,
): Promise<void> {
  if (!query.trim()) {
    resultsContainer.innerHTML =
      '<div class="text-center py-8 text-text-muted text-sm">Start typing to search...</div>';
    results = [];
    selectedIndex = -1;
    return;
  }

  const pf = await loadPagefind();
  if (!pf) {
    resultsContainer.innerHTML =
      '<div class="text-center py-8 text-text-muted text-sm">Search not available</div>';
    return;
  }

  const search = await pf.search(query);
  results = [];

  if (search.results.length === 0) {
    resultsContainer.innerHTML =
      '<div class="text-center py-8 text-text-muted text-sm">No results found</div>';
    return;
  }

  // Load first 10 results
  const loadedResults = await Promise.all(
    search.results.slice(0, 10).map((r) => r.data()),
  );

  results = loadedResults.map((data) => ({
    url: data.url,
    title: data.meta?.title || data.url,
    excerpt: data.excerpt || "",
  }));

  resultsContainer.innerHTML = results
    .map(
      (result) => `
    <a href="${result.url}" class="search-result-item block p-3 rounded-lg border border-transparent hover:bg-primary/10 hover:border-primary/30 transition-colors">
      <div class="font-medium text-text mb-1">${result.title}</div>
      <div class="text-sm text-text-muted line-clamp-2">${result.excerpt}</div>
    </a>
  `,
    )
    .join("");

  selectedIndex = 0;
  updateSelection(resultsContainer);
}

export function initSearchManager(): void {
  const modal = document.getElementById("search-modal");
  const backdrop = document.getElementById("search-backdrop");
  const input = document.getElementById(
    "search-input",
  ) as HTMLInputElement | null;
  const resultsContainer = document.getElementById("search-results");
  const searchButton = document.getElementById("search-button");
  const searchButtonMobile = document.getElementById("search-button-mobile");

  if (!modal || !input || !resultsContainer) return;

  function openModal(): void {
    modal!.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    input!.focus();
    loadPagefind();
  }

  function closeModal(): void {
    modal!.classList.add("hidden");
    document.body.style.overflow = "";
    input!.value = "";
    resultsContainer!.innerHTML =
      '<div class="text-center py-8 text-text-muted text-sm">Start typing to search...</div>';
    selectedIndex = -1;
    results = [];
  }

  // Event Listeners
  searchButton?.addEventListener("click", openModal);
  searchButtonMobile?.addEventListener("click", openModal);
  backdrop?.addEventListener("click", closeModal);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Cmd/Ctrl + K to open
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      if (modal.classList.contains("hidden")) {
        openModal();
      } else {
        closeModal();
      }
    }

    // ESC to close
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }

    // Arrow navigation in results
    if (!modal.classList.contains("hidden")) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (selectedIndex < results.length - 1) {
          selectedIndex++;
          updateSelection(resultsContainer);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (selectedIndex > 0) {
          selectedIndex--;
          updateSelection(resultsContainer);
        }
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        navigateToSelected();
      }
    }
  });

  // Search input with debounce
  let debounceTimeout: ReturnType<typeof setTimeout>;
  input.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      performSearch((e.target as HTMLInputElement).value, resultsContainer);
    }, 200);
  });
}
