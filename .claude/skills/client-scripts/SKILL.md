---
name: client-scripts
description: Client-side script patterns for Astro components. Use this skill when adding or reviewing <script> tags in .astro files to ensure correct bundling, deduplication, and avoid common pitfalls.
---

# Client Scripts Skill

## Core Rule: Prefer Scoped `<script>` Over `is:inline`

Astro's default `<script>` (without `is:inline`) is a **module script** that gets:
- Bundled, deduplized, and tree-shaken by Vite
- TypeScript support in script blocks
- No global function name collisions
- Automatic `defer` (no `DOMContentLoaded` wrapper needed)

**Always use `<script>` unless you have a specific reason for `is:inline`.**

## Migration Pattern: `is:inline` → Scoped `<script>`

### Before (anti-pattern)

```html
<script is:inline>
  function initMyComponent() {
    const el = document.querySelector('.my-el');
    // ...logic...
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMyComponent);
  } else {
    initMyComponent();
  }
</script>
```

### After (correct)

```html
<script>
  const el = document.querySelector('.my-el');
  if (el) {
    // ...logic directly here, no wrapper function needed...
  }
</script>
```

### Steps

1. Remove `is:inline`
2. Unwrap `initXyz()` wrapper function → code runs at top-level
3. Remove `DOMContentLoaded` check (modules are deferred by default)
4. Add TypeScript casts for DOM elements (`as HTMLElement`, `as TouchEvent`)
5. Remove `typeof window` checks (modules only run in browser)

## When `is:inline` IS Required

Only use `is:inline` when one of these applies:

### 1. Theme/FOUC prevention scripts in `<head>`

Must execute **synchronously before paint** to avoid flash of unstyled content:

```html
<!-- BaseLayout.astro — CORRECT use of is:inline -->
<head>
  <script is:inline>
    function applyTheme() {
      document.documentElement.classList.remove('no-js');
      if (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    applyTheme();
    document.addEventListener('astro:after-swap', applyTheme);
  </script>
</head>
```

### 2. Scripts using `define:vars`

`define:vars` requires `is:inline` — this is an Astro limitation:

```html
<script is:inline define:vars={{ baseColor, endpoint }}>
  // Server variables are available here
  console.log(baseColor, endpoint);
</script>
```

### 3. Third-party snippets that must not be bundled

Analytics, tracking pixels, or external scripts that expect to run as classic scripts:

```html
<script is:inline src="https://analytics.example.com/script.js"></script>
```

## ClientRouter (SPA) Considerations

When using `<ClientRouter />` (Astro v6 SPA transitions):

- **`is:inline` scripts re-run** on every navigation by default
- **Module `<script>` tags run once** and persist across navigations
- Use `astro:after-swap` event for code that must re-run after SPA navigation
- Use `astro:page-load` event for code that should run on every page (including initial)

```html
<!-- For interactive components that need re-initialization after SPA navigation -->
<script>
  document.addEventListener('astro:page-load', () => {
    const el = document.querySelector('.my-el');
    if (el) {
      // Re-initialize on every navigation
    }
  });
</script>
```

## Prefer Svelte Islands for Interactivity

For anything beyond simple DOM manipulation, prefer Svelte 5 components with Runes:

```svelte
<!-- ThemeToggle.svelte — reactive island instead of inline script -->
<script lang="ts">
  let dark = $state(document.documentElement.classList.contains('dark'));

  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>

<button onclick={toggle} aria-label="Toggle theme">
  {dark ? '☀️' : '🌙'}
</button>
```

Use with hydration directive:
```astro
<ThemeToggle client:load />
```

## Decision Tree

```
Need client-side JS?
├─ Simple DOM query/manipulation → <script> (no is:inline)
├─ Reactive state/complex UI → Svelte 5 island (client:load/idle/visible)
├─ Must run before paint (theme/FOUC) → <script is:inline> in <head>
├─ Needs define:vars → <script is:inline define:vars={...}>
└─ Third-party snippet → <script is:inline src="...">
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| `is:inline` everywhere "just to be safe" | Remove it — Astro modules are better in every way |
| `DOMContentLoaded` wrapper in module script | Remove — modules are deferred automatically |
| `typeof window !== 'undefined'` in module | Remove — browser-only by definition |
| Global function names in `is:inline` | Use scoped `<script>` or IIFE to avoid collisions |
| Multiple `is:inline` scripts that could merge | Combine into one scoped `<script>` |
| `is:inline` for Astro event listeners | OK for `astro:after-swap` in head, otherwise use module |
