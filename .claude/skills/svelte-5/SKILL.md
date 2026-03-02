---
name: svelte-5
description: Svelte 5 Runes guidelines for reactive islands in this Astro monorepo. Use this skill for creating or modifying Svelte components.
---

# Svelte 5 Skill

## Role in This Project

Svelte 5 is used for **interactive islands** hydrated via Astro's `client:*` directives. All Svelte components live in `shared/src/components/` and are shared across apps.

Current component: `ThemeToggle.svelte` (dark mode toggle).

## Runes API (Svelte 5)

Svelte 5 replaces stores and reactive declarations with Runes:

```svelte
<script lang="ts">
// Reactive state (replaces `let x = 0` reactive declarations)
let count = $state(0);

// Derived values (replaces `$: doubled = count * 2`)
let doubled = $derived(count * 2);

// Side effects (replaces `$: { ... }` reactive blocks)
$effect(() => {
  console.log('count changed:', count);
});
</script>
```

### Runes Reference

| Svelte 4 | Svelte 5 | Notes |
|---|---|---|
| `let x = 0` (reactive) | `let x = $state(0)` | Explicit reactivity |
| `$: doubled = x * 2` | `let doubled = $derived(x * 2)` | Computed values |
| `$: { sideEffect() }` | `$effect(() => { sideEffect() })` | Side effects |
| `export let prop` | `let { prop } = $props()` | Component props |
| `$$restProps` | `let { ...rest } = $props()` | Rest props |
| `on:click={handler}` | `onclick={handler}` | Event handlers |
| `on:input={handler}` | `oninput={handler}` | All DOM events |
| `createEventDispatcher()` | Callback props | Custom events |
| `writable()` store | `$state()` in .svelte.ts | Shared state |

## Component Patterns

### Basic Interactive Component

```svelte
<script lang="ts">
let { label, variant = 'default' }: { label: string; variant?: 'default' | 'primary' } = $props();
let active = $state(false);
</script>

<button
  onclick={() => active = !active}
  class="btn"
  class:active
  type="button"
>
  {label}
</button>

<style>
  .btn { /* scoped styles */ }
  .active { /* active state */ }
</style>
```

### Component with Side Effects (DOM Access)

```svelte
<script lang="ts">
let isDark = $state(false);

$effect(() => {
  // Runs after mount and on dependency changes
  isDark = document.documentElement.classList.contains('dark');
});
</script>
```

### Shared Reactive State (.svelte.ts)

```typescript
// shared/src/state/counter.svelte.ts
let count = $state(0);
export function getCount() { return count; }
export function increment() { count++; }
```

## Astro Integration

### Hydration Directives

```astro
<!-- Immediate hydration (navigation, toggles) -->
<ThemeToggle client:load />

<!-- Hydrate when browser is idle -->
<Newsletter client:idle />

<!-- Hydrate when visible in viewport -->
<Comments client:visible />

<!-- Never hydrate (static render only) -->
<StaticChart />
```

### Configuration

```javascript
// astro.config.mjs
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    svelte({ compilerOptions: { runes: true } }),
  ],
});
```

The `runes: true` compiler option is set globally — all `.svelte` files use Runes mode.

## Styling in Svelte

- Use `<style>` blocks for component-scoped CSS
- Reference design tokens via CSS custom properties: `var(--color-text)`
- Tailwind utility classes work in the template section
- `:global()` selectors for styling slotted/external content

```svelte
<style>
  .toggle {
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--button-radius);
    transition: background-color var(--transition-fast);
  }
  .toggle:hover {
    background: var(--color-bg-secondary);
  }
</style>
```

## Common Mistakes to Avoid

- **Don't use `on:click`** — Use `onclick` (lowercase, no colon)
- **Don't use `export let`** — Use `$props()` destructuring
- **Don't use `$:` reactive declarations** — Use `$derived()` or `$effect()`
- **Don't use stores** — Use `$state()` in `.svelte.ts` files
- **Don't use `createEventDispatcher`** — Pass callback props instead
- **Don't forget `lang="ts"`** on `<script>` tags
