---
title: Overview
description: What Knowledge Core contains, what it leaves to you, and how this documentation is organised.
order: 0
---

Knowledge Core is a pnpm monorepo you start a project from, not a package you install. It contains
two Astro 7 sites, one for documentation and one for courses, the packages they share, and a
Cloudflare Worker that answers visitor questions from the content of both sites.

The template's own sites run at [kc-docs.casoon.dev](https://kc-docs.casoon.dev) and [kc-courses.casoon.dev](https://kc-courses.casoon.dev).

## What is in the repository

| Path                    | Contents                                                              |
| ----------------------- | --------------------------------------------------------------------- |
| `apps/docs`             | Documentation site: MDX pages, configurable sidebar, English and German |
| `apps/courses`          | Course platform: course definitions in JSON, lessons in MDX, progress |
| `apps/chat-worker`      | Cloudflare Worker behind the AI assistant (RAG over Vectorize)        |
| `packages/ui`           | Astro components shared by both sites, including `ChatWidget`         |
| `packages/styles`       | Tailwind CSS 4 setup and design tokens                                |
| `packages/content-model`| Zod schemas for docs, courses, lessons and the sidebar                |
| `packages/config`       | Shared TypeScript and Biome configuration                             |
| `shared`                | i18n dictionaries and helpers                                         |
| `scripts`               | `ingest-content.ts` (content → Vectorize) and `update-badges.sh`      |

## What it leaves to you

- **Your content.** The sample docs pages, the `getting-started` course and its five lessons are
  there to be replaced.
- **Your branding.** Package scope, logo, footer and colours are set in a handful of files, see
  [Make it your own](guides/customizing/).
- **Hosting.** The sites build to static files; the README describes Cloudflare Pages, Vercel and
  Netlify. The AI assistant needs a Cloudflare account and is optional.

## How the docs are organised

- **Getting started**: requirements, installation and a tour of the project structure.
- **Guides**: writing docs pages and lessons, setting up the AI assistant, rebranding, deploying.
- **Reference**: root scripts, the shared components and the content schemas.
