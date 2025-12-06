# Knowledge Core

[![GitHub Template](https://img.shields.io/badge/GitHub-Template-blue?logo=github)](https://github.com/casoon/knowledge-core/generate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

> Modern monorepo template for documentation and course platforms

A production-ready template based on **Astro**, **MDX**, **Tailwind CSS**, and **pnpm Workspaces** - optimized for creating technical documentation and interactive learning platforms.

## ✨ Features

- 🚀 **Astro 5** - Fast, modern frontend framework
- 📝 **MDX** - Markdown with React components
- 🎨 **Tailwind CSS** - Utility-first CSS with dark mode
- 📦 **pnpm Workspaces** - Monorepo structure
- ⚡ **Volta** - Automatic Node version management
- 🧩 **Shared Components** - Reusable UI components
- 🎓 **Interactive Courses** - Quiz, exercises, progress tracking
- 🌙 **Dark Mode** - With theme persistence
- 🔍 **Type-Safe** - TypeScript + Zod schemas

## 🎯 Use Cases

- **Technical Documentation** - API references, guides, tutorials
- **Course Platforms** - Interactive learning paths with quizzes and exercises
- **Knowledge Bases** - Internal documentation for teams
- **Developer Portals** - Developer resources and guides

## 🚀 Quick Start

### Prerequisites

- Node.js 24 or higher
- pnpm 9 or higher
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
# → http://localhost:4321

# Courses only
pnpm dev:courses
# → http://localhost:4322
```

### Build

```bash
# Build all apps
pnpm build

# Build individual app
pnpm build:docs
pnpm build:courses
```

## 📁 Project Structure

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
│   ├── styles/            # Tailwind + theming
│   ├── content-model/     # Type definitions
│   └── config/            # Shared configs
│
├── package.json           # Root package
└── pnpm-workspace.yaml
```

## 📝 Creating Content

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
---

import { Callout } from '@knowledge-core/ui';

# My Page

<Callout type="info">
Important information!
</Callout>
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

<Quiz questions={[...]} />
```

## 🧩 Available Components

### Content Components

- **Callout** - Info, Warning, Error, Success
- **CodeBlock** - Syntax highlighting with copy button
- **Card** - Content cards
- **Tabs** / **TabPanel** - Tab navigation

### Course Components

- **Quiz** - Interactive quizzes with feedback
- **Exercise** - Exercise blocks
- **Hint** - Collapsible hints
- **ProgressBar** - Progress indicator
- **CourseCard** - Course overview cards

## 🎨 Theming

### Customize CSS Variables

Edit `packages/styles/src/tokens.css`:

```css
:root {
  --color-primary: 245 90% 60%;
  --color-secondary: 210 20% 98%;
  /* ... */
}

.dark {
  --color-primary: 245 80% 70%;
  /* ... */
}
```

### Extend Tailwind Config

Edit `packages/styles/tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Your colors
      }
    }
  }
}
```

## 🔧 Scripts

```bash
# Development
pnpm dev                 # All apps
pnpm dev:docs           # Docs only
pnpm dev:courses        # Courses only

# Build
pnpm build              # All apps
pnpm build:docs         # Docs only
pnpm build:courses      # Courses only

# Preview
pnpm preview            # All apps
pnpm preview:docs       # Docs only
pnpm preview:courses    # Courses only

# Code Quality
pnpm lint               # ESLint
pnpm format             # Prettier
pnpm check              # TypeScript + Astro check

# Clean
pnpm clean              # Remove all build artifacts
```

## 🚢 Deployment

### Vercel (recommended)

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

### Cloudflare Pages

1. Build Command: `pnpm build:docs`
2. Build output directory: `apps/docs/dist`

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup guide and customization
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Credits

Built with:
- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)
- [pnpm](https://pnpm.io)

---

**Made with ❤️ for developers and educators**
