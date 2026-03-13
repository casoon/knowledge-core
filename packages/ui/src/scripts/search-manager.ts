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
      'return import("/pagefind/pagefind.js")'
    ) as () => Promise<Pagefind>;
    pagefind = await importPagefind();
    await pagefind.init();
    return pagefind;
  } catch (e) {
    console.warn('Pagefind not available:', e);
    return null;
  }
}

function updateSelection(resultsContainer: HTMLElement): void {
  const items = resultsContainer.querySelectorAll('.search-result-item');
  items.forEach((item, i) => {
    if (i === selectedIndex) {
      item.classList.add('bg-primary/10', 'border-primary/30');
      item.classList.remove('border-transparent');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('bg-primary/10', 'border-primary/30');
      item.classList.add('border-transparent');
    }
  });
}

function navigateToSelected(): void {
  if (selectedIndex >= 0 && results[selectedIndex]) {
    window.location.href = results[selectedIndex].url;
  }
}

async function performSearch(query: string, resultsContainer: HTMLElement): Promise<void> {
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
  const loadedResults = await Promise.all(search.results.slice(0, 10).map((r) => r.data()));

  results = loadedResults.map((data) => ({
    url: data.url,
    title: data.meta?.title || data.url,
    excerpt: data.excerpt || '',
  }));

  resultsContainer.innerHTML = results
    .map(
      (result) => `
    <a href="${result.url}" class="search-result-item block p-3 rounded-lg border border-transparent hover:bg-primary/10 hover:border-primary/30 transition-colors">
      <div class="font-medium text-text mb-1">${result.title}</div>
      <div class="text-sm text-text-muted line-clamp-2">${result.excerpt}</div>
    </a>
  `
    )
    .join('');

  selectedIndex = 0;
  updateSelection(resultsContainer);
}

let searchController: AbortController | null = null;

export function initSearchManager(): void {
  searchController?.abort();
  searchController = new AbortController();
  const { signal } = searchController;

  const modal = document.getElementById('search-modal');
  const backdrop = document.getElementById('search-backdrop');
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const resultsContainer = document.getElementById('search-results');
  const searchButton = document.getElementById('search-button');
  const searchButtonMobile = document.getElementById('search-button-mobile');

  if (!modal || !input || !resultsContainer) return;

  const searchModal = modal;
  const searchInput = input;
  const searchResults = resultsContainer;

  function openModal(): void {
    searchModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    searchInput.focus();
    loadPagefind();
  }

  function closeModal(): void {
    searchModal.classList.add('hidden');
    document.body.style.overflow = '';
    searchInput.value = '';
    searchResults.innerHTML =
      '<div class="text-center py-8 text-text-muted text-sm">Start typing to search...</div>';
    selectedIndex = -1;
    results = [];
  }

  // Event Listeners
  searchButton?.addEventListener('click', openModal, { signal });
  searchButtonMobile?.addEventListener('click', openModal, { signal });
  backdrop?.addEventListener('click', closeModal, { signal });

  // Arrow/Enter navigation in search results
  function handleResultNavigation(e: KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (selectedIndex < results.length - 1) {
        selectedIndex++;
        updateSelection(searchResults);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (selectedIndex > 0) {
        selectedIndex--;
        updateSelection(searchResults);
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigateToSelected();
    }
  }

  // Keyboard shortcuts
  function handleKeyDown(e: KeyboardEvent): void {
    const isOpen = !searchModal.classList.contains('hidden');

    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        closeModal();
      } else {
        openModal();
      }
      return;
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    handleResultNavigation(e);
  }

  document.addEventListener('keydown', handleKeyDown, { signal });

  // Search input with debounce
  let debounceTimeout: ReturnType<typeof setTimeout>;
  searchInput.addEventListener(
    'input',
    (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        performSearch((e.target as HTMLInputElement).value, searchResults);
      }, 200);
    },
    { signal }
  );
}
