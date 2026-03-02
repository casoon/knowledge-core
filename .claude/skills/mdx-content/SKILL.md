---
name: mdx-content
description: MDX and Content Collections patterns for the blog app. Use this skill when adding blog posts, modifying content schemas, or working with the Loader API.
---

# MDX Content Skill

## Content Collections (Astro v6 Loader API)

### Collection Definition

```typescript
// apps/blog/src/content.config.ts (NOT src/content/config.ts!)
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(10).max(160),
    date: z.coerce.date(),
    author: z.string().default('Astro v6 Team'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

### Key v6 Changes

| v5 | v6 |
|---|---|
| `src/content/config.ts` | `src/content.config.ts` |
| `type: 'content'` | `loader: glob({...})` |
| `entry.slug` | `entry.id` |
| `entry.render()` | `render(entry)` (standalone import) |
| `getEntryBySlug()` | `getEntry()` |
| `import { z } from 'astro:content'` | `import { z } from 'astro/zod'` |

## Blog Post Structure

### Content Directory

```
apps/blog/src/content/blog/
  welcome.mdx
  tailwind-v4.mdx
```

### Frontmatter Format

```yaml
---
title: 'Welcome to the Astro v6 Blog'
description: 'The first post featuring MDX and Content Collections.'
date: 2026-02-24
author: 'Astro v6 Team'
tags: ['astro', 'v6', 'template']
draft: false
---
```

- `title`: 1-100 chars (required)
- `description`: 10-160 chars (required, used for meta description + OG)
- `date`: Coerced to Date (required)
- `author`: Defaults to 'Astro v6 Team'
- `tags`: Array of strings, defaults to `[]`
- `draft`: Boolean, defaults to `false` — draft posts are excluded from listing and sitemap

## Querying Collections

### List Posts (Excluding Drafts)

```astro
---
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
```

### Static Paths (Excluding Drafts)

```astro
---
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const posts = (await getCollection('blog')).filter((post) => !post.data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### Single Entry

```typescript
import { getEntry, render } from 'astro:content';

const post = await getEntry('blog', 'welcome');
const { Content } = await render(post);
```

## Writing MDX

MDX files support JSX components alongside Markdown:

```mdx
---
title: 'My Post'
description: 'A blog post with components.'
date: 2026-02-25
tags: ['example']
---

# Heading

Regular markdown text with **bold** and *italic*.

## Code Block

```typescript
const greeting = 'Hello, Astro v6!';
```

## Lists

- Item one
- Item two
- Item three
```

## MDX Fallstricke (remark-directive Konflikte)

Das Projekt nutzt `remark-directive`, das Text-Directives im Format `:name` erkennt. Das führt zu unerwarteten Rendering-Problemen im Fließtext.

### PROBLEM: Doppelpunkt gefolgt von Buchstabe/Zahl wird als Directive geparst

Alles im Format `:wort` oder `:zahl` im Fließtext (NICHT in Code-Blöcken) kann von remark-directive als textDirective interpretiert und falsch gerendert werden.

### Betroffene Patterns im Fließtext

| Problematisch | Sicherer Ersatz |
|---|---|
| `1:1-Gespräch` | `1-zu-1-Gespräch` |
| `4.5:1 Kontrast` | `4,5 zu 1 Kontrast` |
| `16:9 Format` | `16-zu-9-Format` oder `16∶9` (Ratio-Zeichen U+2236) |
| `2:3 Verhältnis` | `2-zu-3-Verhältnis` |
| `Uhrzeit 10:00` | In Code-Span: `` `10:00` `` oder `10.00 Uhr` |

### Sichere Kontexte (kein Escaping nötig)

- **Code-Blöcke** (` ```lang ... ``` `): remark-directive parst keine Code-Blöcke
- **Inline-Code** (`` `text` ``): Auch sicher
- **HTML-Tags** (`<p>4.5:1</p>`): Werden nicht als Markdown geparst
- **Tabellen-Zellen**: Meistens sicher, aber bei Unsicherheit Inline-Code nutzen

### Regeln beim Schreiben von MDX-Artikeln

1. **NIEMALS** `X:Y`-Verhältnisse als Fließtext schreiben — immer umschreiben oder Inline-Code nutzen
2. **Uhrzeiten** im Fließtext als `10.00 Uhr` oder `` `10:00` `` schreiben
3. **Port-Nummern** (`:3000`, `:8080`) nur in Code-Blöcken oder Inline-Code verwenden
4. **Tags** wie `tag:server` immer in Inline-Code: `` `tag:server` ``
5. **Emojis/Shortcodes** wie `:smile:` funktionieren NICHT — sie werden als Directive geparst

## MDX Styling

Blog post content is rendered inside a `.post-content` wrapper with scoped `:global()` styles:

```css
.post-content :global(h2) { font-size: 1.5rem; font-weight: 700; }
.post-content :global(h3) { font-size: 1.25rem; font-weight: 600; }
.post-content :global(p) { margin-bottom: var(--space-md); }
.post-content :global(code) { font-family: var(--font-mono); }
.post-content :global(pre) { border-radius: var(--radius-lg); }
```

## OG Image Generation

Each blog post gets an auto-generated OG image. The blog's `scripts/generate-og.ts` reads frontmatter from `src/content/blog/` and generates `public/og/blog/<slug>.png`.

When adding a new post, the OG image is generated automatically at build time (`pnpm build` runs `generate:og` first).

## Adding a New Blog Post

1. Create `apps/blog/src/content/blog/my-post.mdx`
2. Add frontmatter with required fields (`title`, `description`, `date`)
3. Write content in Markdown/MDX
4. Run `pnpm build` — OG image is auto-generated
5. Post appears at `/blog/my-post`

## RSS Feed

The RSS feed at `/rss.xml` is generated from the blog collection in `apps/blog/src/pages/rss.xml.ts`. It automatically includes all non-draft posts.
