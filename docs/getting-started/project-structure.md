---
title: Project structure
description: Where content, components, styles and schemas live, and which way dependencies point.
order: 2
---

```text
knowledge-core/
├── apps/
│   ├── docs/              # documentation site
│   │   └── src/
│   │       ├── config/sidebar.ts
│   │       ├── content/docs/   # MDX pages
│   │       ├── layouts/
│   │       └── pages/
│   ├── courses/           # course platform
│   │   └── src/
│   │       ├── content/courses/  # course definitions (JSON)
│   │       ├── content/lessons/  # lessons (MDX)
│   │       ├── layouts/
│   │       └── pages/
│   └── chat-worker/       # Cloudflare Worker: embed → search → generate → stream
├── packages/
│   ├── ui/                # shared Astro components
│   ├── styles/            # Tailwind CSS 4 and design tokens
│   ├── content-model/     # Zod schemas
│   └── config/            # TypeScript and Biome base configs
├── shared/                # i18n dictionaries and helpers
├── scripts/               # ingest-content.ts, update-badges.sh
└── pnpm-workspace.yaml
```

## Dependency rules

From the project's `CLAUDE.md`:

- Apps import from `@knowledge-core/ui`, `@knowledge-core/styles`,
  `@knowledge-core/content-model` and `@knowledge-core/shared`.
- Apps never import from each other.

## One version per dependency

`pnpm-workspace.yaml` holds a `catalog` with the versions of Astro, Tailwind CSS, TypeScript, Zod,
Biome, Vitest and the other shared tools. Packages reference them as `"catalog:"`, so an update in
one place reaches every app.

## Languages

Both sites are configured for `en` (default, no prefix) and `de` (under `/de/`). The UI strings
live in `shared/src/i18n/en.ts` and `shared/src/i18n/de.ts`.
