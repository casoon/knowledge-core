---
title: Make it your own
description: Rename the package scope, replace branding and sample content, and adjust the design tokens.
order: 3
---

## Package scope

The workspace packages are named `@knowledge-core/*`. To use your own scope, change the `name` in
`packages/ui`, `packages/styles`, `packages/content-model` and `packages/config` and update the
imports in the apps. On macOS or Linux in one go:

```sh
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.astro" -o -name "*.mdx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/@knowledge-core/@my-project/g' {} +
```

(`sed -i ''` is the BSD form; on GNU sed use `sed -i`.) Run `pnpm install` afterwards so the
workspace links are renamed too.

## Branding

- **Navigation:** `NavBar` takes `logo`, `logoSrc` and `logoHref`. It is used in the landing and
  index pages and in the layouts of both apps.
- **Footer:** `packages/ui/src/components/layout/Footer.astro` has a `projectName` prop that
  defaults to `Knowledge Core`.
- **Landing pages:** `apps/docs/src/pages/index.astro` and `apps/courses/src/pages/index.astro`.
- **Repository data:** `name`, `description`, `repository` and `author` in the root
  `package.json`, and the README.

## Design tokens

Colours, light and dark, are CSS custom properties in `packages/styles/src/tokens.css`:

```css
:root {
  --color-primary: hsl(245 90% 60%);
  --color-primary-hover: hsl(245 90% 50%);
  /* … */
}
```

`packages/styles/src/global.css` imports Tailwind CSS 4 and the tokens and maps them into the
Tailwind theme with `@theme`. Dark mode is class-based (`.dark`).

## Sample content

Replace or delete:

- `apps/docs/src/content/docs/`: the sample pages in `getting-started`, `guides` and
  `components`.
- `apps/courses/src/content/courses/getting-started.json` and the lessons in
  `apps/courses/src/content/lessons/`.

If you add a docs category, extend `docsCategorySchema` in `packages/content-model/src/docs.ts`.
