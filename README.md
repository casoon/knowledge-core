# Knowledge Core

[![CI](https://github.com/casoon/knowledge-core/actions/workflows/ci.yml/badge.svg)](https://github.com/casoon/knowledge-core/actions/workflows/ci.yml)
[![GitHub Template](https://img.shields.io/badge/GitHub-Template-blue?logo=github)](https://github.com/casoon/knowledge-core/generate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

> Modern monorepo template for documentation and course platforms

A production-ready template based on **Astro v6**, **MDX**, **Tailwind CSS v4**, and **pnpm Workspaces** - optimized for creating technical documentation and interactive learning platforms.

## Live Previews

- **Docs App:** [kc-docs.casoon.dev](https://kc-docs.casoon.dev)
- **Courses App:** [kc-courses.casoon.dev](https://kc-courses.casoon.dev)

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 6.3 | Framework — Vite Environment API, Content Collections, ClientRouter |
| [MDX](https://mdxjs.com) | 5.0 | Markdown with interactive components |
| [Tailwind CSS](https://tailwindcss.com) | 4.3 | CSS-first config, Vite plugin, design tokens |
| [Biome](https://biomejs.dev) | 2.4 | Linting, formatting, a11y, security & complexity checks |
| [Zod](https://zod.dev) | 4.x | Runtime validation for content schemas |
| [TypeScript](https://www.typescriptlang.org) | 6.0 | Strict mode throughout |
| [pnpm](https://pnpm.io) | 9.x | Workspaces with catalog for centralized dependency management |
| Node.js | >= 22.12 | Runtime |

## Features

- **Shared Components** — Reusable UI components across apps
- **Interactive Courses** — Quiz, exercises, progress tracking
- **Dark Mode** — With theme persistence via ClientRouter
- **Cloud Sync** — Sync learning progress across devices
- **Pre-Commit Hooks** — Husky + lint-staged with Biome auto-fix
- **Post-Build Audit** — SEO & a11y checks via @casoon/astro-post-audit
- **Configurable Sidebar** — `defineSidebar()` with autogenerate, groups, manual links, and badges
- **Extended Frontmatter** — `draft`, `editUrl`, `pagefind`, `sidebar.badge`, `prev/next` (Starlight-inspired)
- **Pagefind-Optimized** — NavBar/Footer excluded from index; per-page `pagefind: false` support
- **Unit Tests** — Vitest for content schemas (`docs`, `courses`, `sidebar`) and i18n utils
- **Link Validation** — `pnpm linkcheck` checks all internal HTML links after build

## Use Cases

- **Technical Documentation** — API references, guides, tutorials
- **Course Platforms** — Interactive learning paths with quizzes and exercises
- **Knowledge Bases** — Internal documentation for teams
- **Developer Portals** — Developer resources and guides

## Quick Start

### Prerequisites

- Node.js >= 22.12.0
- pnpm >= 9.0.0
- Volta (recommended)

### Installation

**Option 1: Use GitHub Template (recommended)**

1. Click "Use this template" at the top of the GitHub page
2. Give your project a name
3. Clone your new repository:
   ```bash
   git clone https://github.com/yourusername/your-project.git
   cd your-project
   ```

**Option 2: Direct Clone**

```bash
git clone https://github.com/casoon/knowledge-core.git
cd knowledge-core
```

### After Installation

```bash
# 1. Install dependencies
pnpm install

# 2. (Optional) Customize package names
# Change @knowledge-core/* to your own scope in:
# - package.json files (all packages)
# - Import statements in apps

# 3. Start the project
pnpm dev
```

### Development

```bash
# Start both apps
pnpm dev

# Documentation only
pnpm dev:docs
# -> http://localhost:4321

# Courses only
pnpm dev:courses
# -> http://localhost:4322
```

### Build

```bash
# Build all apps
pnpm build

# Build individual app
pnpm build:docs
pnpm build:courses
```

## Project Structure

```
knowledge-core/
├── apps/
│   ├── docs/              # Documentation app
│   │   ├── src/
│   │   │   ├── content/   # MDX files
│   │   │   ├── layouts/   # Astro layouts
│   │   │   └── pages/     # Pages & routing
│   │   └── package.json
│   │
│   └── courses/           # Course platform app
│       ├── src/
│       │   ├── content/
│       │   │   ├── courses/  # Course definitions
│       │   │   └── lessons/  # Lessons (MDX)
│       │   ├── layouts/
│       │   └── pages/
│       └── package.json
│
├── packages/
│   ├── ui/                # Shared UI components
│   ├── styles/            # Tailwind v4 + design tokens
│   ├── content-model/     # Zod v4 content schemas
│   └── config/            # Shared configs (TypeScript, Biome)
│
├── shared/                # Shared layouts, SEO, utilities
├── package.json           # Root package
└── pnpm-workspace.yaml
```

## Creating Content

### Documentation Page

Create an MDX file in `apps/docs/src/content/docs/`:

```mdx
---
title: My Page
description: Description
category: guides
order: 1
tags: [tutorial]
status: stable
# Optional Starlight-inspired fields:
draft: false           # true = excluded from build
editUrl: https://github.com/org/repo/edit/main/docs/my-page.mdx
pagefind: true         # false = excluded from search index
sidebar:
  badge:
    variant: tip       # note | tip | danger | caution | success
    text: New
prev:
  link: /docs/intro
  label: Introduction
next: false            # disable next link
---

import { Callout } from '@knowledge-core/ui';

# My Page

<Callout type="info">Important information!</Callout>
```

### Creating a Course

1. **Course definition** in `apps/courses/src/content/courses/my-course.json`:

```json
{
  "title": "My Course",
  "slug": "my-course",
  "description": "Course description",
  "level": "beginner",
  "estimatedTotalMinutes": 120,
  "tags": ["programming"],
  "published": true
}
```

2. **Lesson** in `apps/courses/src/content/lessons/`:

```mdx
---
courseSlug: my-course
title: Lesson 1
module: Basics
orderInModule: 1
estimatedMinutes: 15
goals:
  - Goal 1
  - Goal 2
---

import { Quiz, Exercise } from '@knowledge-core/ui';

# Lesson 1

<Exercise title="Exercise" difficulty="easy">
  Task here...
</Exercise>

<Quiz
  questions={[
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      correctAnswer: 1
    }
  ]}
/>
```

## Available Components

### Content Components

- **Callout** - Info, Warning, Error, Success
- **CodeBlock** - Syntax highlighting with copy button
- **Card** - Content cards
- **Tabs** / **TabPanel** - Tab navigation

### Course Components

- **Quiz** - Interactive quizzes with feedback
- **Exercise** - Exercise blocks with difficulty levels
- **Hint** - Collapsible hints
- **ProgressBar** - Progress indicator
- **CourseCard** - Course overview cards
- **LessonNav** - Lesson navigation sidebar
- **LessonComplete** - Mark lessons as complete
- **TotalProgress** - Overall progress display
- **SyncProgress** - Cloud sync for progress

### Navigation Components

- **NavBar** - Main navigation with mobile support & ClientRouter
- **SearchBar** - Full-text search (Pagefind)
- **FontSizeControl** - Accessibility font size control
- **QuizToggle** - Show/hide quizzes

## Theming

### Design Tokens

Edit `packages/styles/src/tokens.css`:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #f8fafc;
  /* ... */
}

.dark {
  --color-primary: #818cf8;
  /* ... */
}
```

### Tailwind v4 Theme

Tailwind v4 uses CSS-first configuration in `packages/styles/src/global.css`:

```css
@import "tailwindcss";
@import "./tokens.css";

@theme {
  --color-primary: var(--color-primary);
  --color-surface: var(--color-surface);
  /* ... */
}

@custom-variant dark (&:where(.dark, .dark *));
```

## Code Quality

Biome handles linting, formatting, and code analysis in a single tool. The base configuration lives in `packages/config/biome.base.json` and is extended by the root `biome.json`.

### Enabled Rule Groups

| Group | Scope |
|---|---|
| **correctness** | Unused variables/imports, exhaustive deps |
| **suspicious** | No `any`, no `var`, no `==`, no assignment in expressions |
| **style** | `const` required, template literals, no non-null assertions |
| **complexity** | Cognitive complexity limit, `for...of` over `forEach`, `flatMap` |
| **performance** | No accumulating spread, no `delete` |
| **security** | No `dangerouslySetInnerHTML` |
| **a11y** | ARIA, alt text, button types, valid anchors |

### Commands

```bash
pnpm check               # Biome lint + format check
pnpm check:fix           # Biome auto-fix
pnpm format              # Format all files
pnpm lint                # Lint only
pnpm type-check          # TypeScript check
pnpm test                # Vitest unit tests (content-model + i18n utils)
pnpm linkcheck           # Build docs + validate all HTML links
```

### Pre-Commit Hook

Husky + lint-staged runs `biome check --write` on staged files automatically.

## Scripts

```bash
# Development
pnpm dev                 # All apps
pnpm dev:docs            # Docs only
pnpm dev:courses         # Courses only

# Build
pnpm build               # All apps
pnpm build:docs          # Docs only
pnpm build:courses       # Courses only

# Preview
pnpm preview             # All apps
pnpm preview:docs        # Docs only
pnpm preview:courses     # Courses only

# Quality
pnpm test                # Vitest unit tests
pnpm linkcheck           # Build docs + check all HTML links
pnpm type-check          # TypeScript check
pnpm check               # Biome lint + format
pnpm check:fix           # Biome auto-fix

# Clean
pnpm clean               # Remove all build artifacts
```

## Sidebar Configuration

The docs sidebar is configured declaratively in `apps/docs/src/config/sidebar.ts`:

```ts
import { defineSidebar } from '@knowledge-core/content-model/sidebar';

export const sidebar = defineSidebar([
  { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
  { label: 'Guides', autogenerate: { directory: 'guides' } },
  {
    label: 'Reference',
    collapsed: true,
    items: [
      { slug: 'api/overview' },
      { slug: 'api/endpoints', badge: { variant: 'tip', text: 'New' } },
    ],
  },
  { label: 'GitHub', link: 'https://github.com/casoon/knowledge-core' },
]);
```


## Deployment

### Cloudflare Pages

1. Build Command: `pnpm build:docs`
2. Build output directory: `apps/docs/dist`

### Vercel

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Select root directory
4. Build Command: `pnpm build:docs` or `pnpm build:courses`
5. Output Directory: `apps/docs/dist` or `apps/courses/dist`

### Netlify

```toml
# netlify.toml
[build]
  command = "pnpm build:docs"
  publish = "apps/docs/dist"
```

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup guide and customization
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE)

## Credits

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), [MDX](https://mdxjs.com), [Biome](https://biomejs.dev), and [pnpm](https://pnpm.io).

---

**Made with care for developers and educators**
