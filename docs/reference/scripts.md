---
title: Root scripts
description: Every script in the root package.json, grouped by purpose.
order: 1
---

## Develop

| Script             | Runs                                                 |
| ------------------ | ---------------------------------------------------- |
| `pnpm dev`         | every app in `apps/` in parallel (docs, courses, chat worker) |
| `pnpm dev:docs`    | the docs site on port 4321                           |
| `pnpm dev:courses` | the courses site on port 4322                        |

## Build and preview

| Script                 | Runs                                             |
| ---------------------- | ------------------------------------------------ |
| `pnpm build`           | `build:docs`, `build:courses`, `build:worker` in that order |
| `pnpm build:docs`      | `astro build` in `apps/docs`                     |
| `pnpm build:courses`   | `astro build` in `apps/courses`                  |
| `pnpm build:worker`    | `wrangler deploy --dry-run --outdir dist` for the chat worker |
| `pnpm preview`         | preview of every app                             |
| `pnpm preview:docs`    | preview of the docs site                         |
| `pnpm preview:courses` | preview of the courses site on port 4322         |

## Check

| Script            | Runs                                                        |
| ----------------- | ----------------------------------------------------------- |
| `pnpm check`      | `biome check .`: lint and format check                      |
| `pnpm check:fix`  | `biome check --write .`                                     |
| `pnpm format`     | `biome format --write .`                                    |
| `pnpm lint`       | `biome lint .`                                              |
| `pnpm type-check` | `astro check` for docs and courses, the worker's types and `tsc`, then `type-check:scripts` |
| `pnpm test`       | Vitest in `@knowledge-core/content-model`, `@knowledge-core/shared` and `chat-worker` |
| `pnpm test:watch` | the same tests in watch mode                                |
| `pnpm linkcheck`  | builds the docs site and checks its internal links with `check-html-links` |

## Other

| Script        | Runs                                                      |
| ------------- | --------------------------------------------------------- |
| `pnpm ingest` | `scripts/ingest-content.ts`: content into Vectorize, see [AI assistant](../../guides/ai-chat/) |
| `pnpm clean`  | `clean` in every package, then removes `node_modules`     |

Husky runs lint-staged before each commit, which applies `biome check --write` to staged
`js`, `mjs`, `cjs`, `ts`, `tsx`, `json`, `astro` and `css` files.
