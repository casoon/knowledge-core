---
name: biome
description: Biome linting and formatting configuration for this monorepo. Use this skill for lint errors, formatting, pre-commit hooks, and code quality tasks.
---

# Biome Skill

## Overview

Biome is the **single tool** for linting and formatting in this project — no ESLint, no Prettier.

## Configuration (`biome.json`)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.4/schema.json",
  "files": {
    "includes": ["**/*.js", "**/*.ts", "**/*.mjs", "**/*.cjs",
                  "**/*.json", "**/*.astro", "**/*.svelte", "**/*.css"]
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "rules": {
      "recommended": true,
      "correctness": { "noUnusedVariables": "warn", "noUnusedImports": "warn" },
      "suspicious": { "noExplicitAny": "warn", "noVar": "error" },
      "style": { "useConst": "error" }
    }
  },
  "javascript": {
    "formatter": { "quoteStyle": "single", "trailingCommas": "es5", "semicolons": "always" }
  },
  "json": {
    "formatter": { "trailingCommas": "none" }
  },
  "css": {
    "parser": { "cssModules": false, "tailwindDirectives": true },
    "formatter": { "enabled": true },
    "linter": { "enabled": true }
  }
}
```

## Commands

```bash
pnpm check          # Lint + format check (no changes)
pnpm check:fix      # Auto-fix lint + format issues
pnpm format          # Format only (with write)
```

## Pre-Commit Hook

Husky + lint-staged runs Biome on staged files:

```json
// package.json
"lint-staged": {
  "*.{js,mjs,cjs,ts,tsx,json,astro,svelte,css}": [
    "biome check --write --no-errors-on-unmatched"
  ]
}
```

## Known Quirks

### Tailwind CSS Directives

`tailwindDirectives: true` in the CSS parser config is required. Without it, Biome reports errors on `@source`, `@theme`, `@apply` and other Tailwind-specific at-rules.

### `@source` Ordering

Biome's `noInvalidPositionAtImportRule` requires `@source` to appear **after** all `@import` statements:

```css
/* Correct */
@import "tailwindcss";
@import "@astro-v6/shared/styles/global";
@import "@astro-v6/shared/styles/theme";
@import "@fontsource/inter/latin-400.css";

@source "../../../shared/src";

/* Wrong — Biome error */
@source "../../../shared/src";
@import "@fontsource/inter/latin-400.css";
```

### False Positive Unused Imports in .astro Files

Biome cannot see template usage of imports in `.astro` files. Imports used only in the template section (not in the frontmatter script) may trigger `noUnusedImports` warnings. These are false positives — the imports are used in the Astro template below the `---` fence.

This is why `noUnusedImports` is set to `"warn"` (not `"error"`).

### .svelte File Support

Biome supports `.svelte` files for formatting and linting. Svelte-specific syntax (Runes, `{#if}` blocks) is handled correctly.

## Code Style Rules

| Rule | Setting | Meaning |
|---|---|---|
| Quotes | Single (`'`) | `import x from 'y'` |
| Semicolons | Always | `const x = 1;` |
| Trailing commas | ES5 | In arrays, objects, parameters |
| Indent | 2 spaces | No tabs |
| Line width | 100 | Max characters per line |
| `const` | Required | `useConst: "error"` |
| `var` | Forbidden | `noVar: "error"` |
| `any` | Warned | `noExplicitAny: "warn"` |

## Fixing Common Issues

```bash
# Fix all auto-fixable issues
pnpm check:fix

# Check specific file
npx biome check apps/starter/src/pages/index.astro

# Format specific file
npx biome format --write apps/starter/src/pages/index.astro
```
