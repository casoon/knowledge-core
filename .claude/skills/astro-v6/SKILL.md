---
name: astro-v6
description: Astro v6 development guidelines for this monorepo. Use this skill for all Astro-related tasks - components, pages, Content Collections, API routes, configuration.
---

# Astro v6 Skill

## Project Structure

This template is a pnpm monorepo:

```
apps/starter/    → Landing page + contact + API
apps/blog/       → Blog with MDX + Content Collections + RSS
shared/          → Design tokens, components, layouts, SEO, utilities
```

## Astro v6 API (Breaking Changes from v5)

### Content Collections - Loader API

```typescript
// src/content.config.ts (NOT src/content/config.ts!)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // Zod v4: Top-level validators
    email: z.email(),       // NOT z.string().email()
    website: z.url(),       // NOT z.string().url()
  }),
});
```

### Rendering Content

```astro
---
// v6: render() as standalone import
import { getCollection, render } from 'astro:content';

const posts = await getCollection('blog');
const { Content } = await render(post); // NOT post.render()
---

<!-- entry.id instead of entry.slug -->
<a href={`/blog/${post.id}`}>{post.data.title}</a>
```

### Zod v4 Syntax

```typescript
import { z } from 'astro/zod'; // NOT from 'astro:content' or 'astro:schema'

// Top-level validators (new in Zod v4)
z.email()          // instead of z.string().email()
z.url()            // instead of z.string().url()
z.uuid()           // instead of z.string().uuid()

// Error messages
z.string().min(5, { error: "Too short." }); // 'error' instead of 'message'

// Defaults after transforms must match output type
z.string().transform(Number).default(0); // NOT .default("0")
```

### Removed APIs

```astro
---
// Astro.glob() → import.meta.glob()
const modules = Object.values(import.meta.glob('./posts/*.md', { eager: true }));

// ViewTransitions → ClientRouter
import { ClientRouter } from 'astro:transitions';

// getEntryBySlug() → getEntry()
const post = await getEntry('blog', slug);

// emitESMImage → emitImageMetadata
import { emitImageMetadata } from 'astro/assets/utils';
---

<!-- handleForms prop removed (now default behavior) -->
<ClientRouter />
```

## Component Patterns

### Astro Component

```astro
---
export interface Props {
  title: string;
  variant?: 'default' | 'primary';
}

const { title, variant = 'default' } = Astro.props;
---

<section class="...">
  <h2>{title}</h2>
  <slot />
</section>
```

### Svelte 5 Island (Runes)

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  {count} (doubled: {doubled})
</button>
```

Hydration directives:
- `client:load` - Immediate (navbar, ThemeToggle)
- `client:idle` - Browser idle (secondary features)
- `client:visible` - In viewport (footer widgets)

### API Route

```typescript
import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { successResponse, errorResponse, validateRequest } from '@astro-v6/shared';

const schema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const result = await validateRequest(schema, data);
    if (!result.success) return errorResponse(result.error);
    return successResponse(result.data, 'Success');
  } catch {
    return errorResponse('Invalid request', 400);
  }
};
```

## Configuration

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    svelte({ compilerOptions: { runes: true } }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: { noExternal: ['@fontsource/*'] },
  },
  build: { inlineStylesheets: 'auto' },
});
```

### Imports from Packages

```astro
---
import BaseLayout from '@astro-v6/shared/layouts/BaseLayout.astro';
import Navbar from '@astro-v6/shared/components/Navbar.astro';
import PageSEO from '@astro-v6/shared/seo/PageSEO.astro';
import ThemeToggle from '@astro-v6/shared/components/ThemeToggle.svelte';
import { cn } from '@astro-v6/shared/utils/cn';
import { validateEnv, createEnvSchema } from '@astro-v6/shared/utils/env';
---
```

## Node 22+ Required

Astro v6 requires Node >= 22.12.0. Older versions are not supported.

## New Stable Features (from Experimental)

- **Live Content Collections** - Real-time data without rebuild
- **Content Security Policy** - Automatic CSP headers
- **Vite Environment API** - Dev server = production runtime
