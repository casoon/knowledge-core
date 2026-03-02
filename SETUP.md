# Setup Guide

Welcome to your new Knowledge Core project! Follow these steps for an optimal setup.

## Initial Steps

### 1. Install Dependencies

```bash
pnpm install
```

This installs all required packages for both apps and all shared packages.

### 2. Personalize the Project

#### Change Package Names

Replace `@knowledge-core` with your own scope (e.g., `@my-project`):

**Affected files:**

```bash
# In all package.json files:
packages/ui/package.json
packages/styles/package.json
packages/content-model/package.json
packages/config/package.json

# Change the name field:
{
  "name": "@my-project/ui",  // instead of @knowledge-core/ui
  ...
}
```

**Update import statements:**

In the apps (`apps/docs/` and `apps/courses/`) adjust all imports:

```typescript
// Before:
import { Callout } from '@knowledge-core/ui';
import '@knowledge-core/styles/global.css';

// After:
import { Callout } from '@my-project/ui';
import '@my-project/styles/global.css';
```

**Quick way - With find & replace:**

```bash
# macOS/Linux:
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.astro" -o -name "*.mdx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/@knowledge-core/@my-project/g' {} +

# Windows (PowerShell):
Get-ChildItem -Recurse -Include *.json,*.ts,*.astro,*.mdx |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object { (Get-Content $_.FullName) -replace '@knowledge-core','@my-project' | Set-Content $_.FullName }
```

#### Customize Branding

**Logo & Title:**

The NavBar component accepts `logo` and `logoSrc` props. Update the pages that use NavBar:

- `apps/docs/src/pages/index.astro`
- `apps/docs/src/pages/docs/index.astro`
- `apps/courses/src/pages/index.astro`
- `apps/courses/src/pages/courses/index.astro`

```astro
<NavBar
  logo="My Project"
  logoHref="/"
  links={navLinks}
/>
```

**Footer:**

Edit `packages/ui/src/components/layout/Footer.astro`:

```typescript
projectName = 'My Project'; // instead of 'Knowledge Core'
```

**Landing Pages:**

- `apps/docs/src/pages/index.astro`
- `apps/courses/src/pages/index.astro`

### 3. Customize Theming

#### Change Colors

Edit `packages/styles/src/tokens.css`:

```css
:root {
  /* Your primary color */
  --color-primary: 245 90% 60%; /* HSL format */

  /* More customizations... */
}
```

**Helpful Tools:**

- [HSL Color Picker](https://hslpicker.com/)
- [Tailwind Color Generator](https://uicolors.app/create)

### 4. Remove/Customize Example Content

**Documentation:**

```bash
apps/docs/src/content/docs/
├── getting-started/
│   ├── installation.mdx      # Customize
│   └── structure.mdx         # Customize
├── components/
│   └── overview.mdx          # Customize
└── guides/
    └── creating-content.mdx  # Keep or customize
```

**Courses:**

```bash
apps/courses/src/content/
├── courses/
│   └── getting-started.json  # Delete or replace
└── lessons/
    └── getting-started-*.mdx # Delete or replace
```

### 5. Update Repository Information

**package.json (Root):**

```json
{
  "name": "my-project",
  "description": "Your description",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/your-project.git"
  },
  "author": "Your Name"
}
```

**README.md:**

- Replace all references to "Knowledge Core"
- Update repository URLs
- Adjust descriptions

## Development

```bash
# Start both apps
pnpm dev

# Documentation only (Port 4321)
pnpm dev:docs

# Courses only (Port 4322)
pnpm dev:courses
```

## Build & Deploy

### Build Locally

```bash
# All apps
pnpm build

# Individual app
pnpm build:docs
pnpm build:courses
```

### Deployment

#### Vercel

1. Push to GitHub
2. Import on [Vercel](https://vercel.com)
3. Select the project
4. Vercel automatically detects Astro
5. For separate deployments:
   - **Docs**: Root Directory = `apps/docs`, Build Command = `cd ../.. && pnpm build:docs`
   - **Courses**: Root Directory = `apps/courses`, Build Command = `cd ../.. && pnpm build:courses`

#### Netlify

Create `netlify.toml`:

```toml
# For Docs
[build]
  command = "pnpm install && pnpm build:docs"
  publish = "apps/docs/dist"
```

#### Cloudflare Pages

- Build Command: `pnpm install && pnpm build:docs`
- Build output directory: `apps/docs/dist`

## Creating Content

### Documentation Page

```bash
# Create new file
apps/docs/src/content/docs/guides/my-guide.mdx
```

```mdx
---
title: My Guide
description: Description
category: guides
order: 1
tags: [tutorial]
status: stable
---

import { Callout } from '@my-project/ui';

# My Guide

<Callout type="info">Important information!</Callout>
```

### Create a Course

**1. Course Definition:**

```bash
apps/courses/src/content/courses/my-course.json
```

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

**2. Create Lesson:**

```bash
apps/courses/src/content/lessons/my-course-lesson-1.mdx
```

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

import { Quiz, Exercise, Hint } from '@my-project/ui';

# Lesson 1

Content here...

<Exercise title="Practice Exercise" difficulty="easy">
  Task description here...
</Exercise>

<Hint>
  Helpful hint for the exercise...
</Hint>

<Quiz
  questions={[
    {
      question: "What is the answer?",
      options: ["Option A", "Option B", "Option C"],
      correctAnswer: 1
    }
  ]}
/>
```

## Advanced Customizations

### Add New Components

```bash
packages/ui/src/components/
├── layout/
├── navigation/
├── content/
├── courses/
└── custom/              # Your own components
    └── MyComponent.astro
```

Don't forget to export new components in `packages/ui/src/index.ts`:

```typescript
export { default as MyComponent } from './components/custom/MyComponent.astro';
```

### Extend Tailwind

```javascript
// packages/styles/tailwind.config.js
export default {
  theme: {
    extend: {
      // Your customizations
    },
  },
};
```

### Add New Content Categories

Edit `packages/content-model/src/docs.ts` to add new categories:

```typescript
export const docsCategorySchema = z.enum([
  'getting-started',
  'guides',
  'components',
  'my-new-category', // Add here
]);
```

## Checklist

- [ ] Ran `pnpm install`
- [ ] Changed package names (@knowledge-core -> @my-project)
- [ ] Customized branding (Logo, Title, Footer)
- [ ] Personalized colors/theming
- [ ] Removed/customized example content
- [ ] Updated repository information
- [ ] Customized README.md
- [ ] Tested first `pnpm dev`
- [ ] Initialized Git and made first commit

## Troubleshooting

### Dependency Errors

```bash
# Delete everything and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

### Build Errors

```bash
# TypeScript check
pnpm check

# Linting
pnpm lint
```

### Port Already in Use

```bash
# Change the port in package.json:
"dev": "astro dev --port 4323"
```

### Content Not Showing

Make sure your content files:
- Have valid frontmatter (YAML between `---`)
- Use correct `courseSlug` matching the course JSON file
- Are in the correct directory

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [MDX Documentation](https://mdxjs.com)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

Good luck with your project!
