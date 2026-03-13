# Knowledge Core - Project Guidelines

## Project Purpose

Monorepo template for documentation and course platforms. Built with Astro v6, MDX, Tailwind CSS v4, and TypeScript.

## Architecture

### Monorepo Structure
```
apps/
  docs/       # Documentation platform
  courses/    # Interactive learning platform with progress tracking

packages/
  ui/             # Reusable Astro components
  styles/         # Tailwind config & CSS variables
  content-model/  # TypeScript/Zod schemas for content validation
  config/         # Shared TypeScript configuration

shared/           # v6 template shared library (layouts, SEO, utils)
```

### Dependency Rules
- Apps import from `@knowledge-core/ui`, `@knowledge-core/styles`, `@knowledge-core/content-model`
- Apps can also import from `@knowledge-core/shared` for v6 shared components
- NO cross-imports between apps/

## Tech Stack

- **Astro v6** (Stable) - Vite Environment API, Live Collections, CSP
- **Node >= 22.12.0** - Required for Astro v6
- **Tailwind v4** - CSS-first, Vite plugin (`@tailwindcss/vite`)
- **Zod v4** - `z.optional(z.string())` instead of `z.string().optional()`, `z.coerce.date()`
- **Biome** - Single tool for linting + formatting (no ESLint/Prettier)
- **pnpm** - Workspaces with catalog for centralized dependency management

## Code Conventions

### TypeScript
- Strict mode always enabled
- No `any` types (warn level)
- Export `interface Props` in Astro components
- Zod v4 syntax: `z.optional()` wrapper, `z.coerce.date()`

### Astro v6 Breaking Changes
- `render(entry)` instead of `entry.render()` for Content Collections
- `getEntry()` instead of `getEntryBySlug()`
- `entry.id` instead of `entry.slug`
- `src/content.config.ts` instead of `src/content/config.ts`
- Loader API: `glob()` loader for local collections
- `<ClientRouter />` instead of `<ViewTransitions />`
- `import { z } from 'astro/zod'` (not from `astro:content`)
- `@tailwindcss/vite` instead of `@astrojs/tailwind`

### Components
- PascalCase for file names
- Semantic HTML (nav, main, article, section)
- WCAG 2.2 Level AA compliance
- Mobile-first, dark mode support

### Styling
- Prefer Tailwind utility classes
- CSS custom properties for design tokens
- Scoped styles in Astro only when necessary

### Biome (no ESLint/Prettier)
- `biome check .` for lint + format
- `biome check --write .` for autofix

## Claude Skills

Detailed development guidelines are available as skills under `.claude/skills/`:

- **astro-v6** — Astro v6 API, Content Collections, Zod v4, component patterns
- **client-scripts** — `<script>` vs `is:inline`, bundling, FOUC prevention, SPA events
- **tailwind-v4** — Tailwind v4 syntax, design tokens, dark mode, CSS-first config
- **svelte-5** — Runes API ($state, $derived, $effect), event handlers, props
- **cloudflare** — Workers deploy, wrangler, KV bindings
- **biome** — Lint/format config, pre-commit hooks
- **mdx-content** — Content Collections, Loader API, blog posts
- **seo** — OG images, PageSEO component, sitemap, JSON-LD
- **local-business-seo** — LocalBusiness JSON-LD, geo meta tags, areaServed, regionale Keywords
- **wcag-a11y** — WCAG 2.2 AA patterns: landmarks, forms, focus, contrast, ARIA, motion, dialogs, checklists
- **i18n** — Translations, locale routing, adding pages/locales
- **playwright** — E2E test patterns, axe-core a11y, multi-project config
- **post-audit** — Post-build SEO/a11y audit integration
