---
title: Content schemas
description: The Zod schemas in packages/content-model that every docs page, course and lesson is validated against.
order: 3
---

The schemas are wired into the content collections in `apps/docs/src/content.config.ts` and
`apps/courses/src/content.config.ts`. A file that does not match fails the build.

## Docs page

`docsFrontmatterSchema` in `packages/content-model/src/docs.ts`:

| Field           | Type                                                            | Default  |
| --------------- | --------------------------------------------------------------- | -------- |
| `title`         | string                                                          | required |
| `description`   | string                                                          | –        |
| `category`      | `getting-started`, `guides`, `api`, `cookbook`, `components`    | required |
| `order`         | number                                                          | `0`      |
| `sidebarGroup`  | string                                                          | –        |
| `tags`          | string[]                                                        | `[]`     |
| `status`        | `stable`, `beta`, `deprecated`                                  | `stable` |
| `lastUpdated`   | date                                                            | –        |
| `author`        | string                                                          | –        |
| `draft`         | boolean                                                         | `false`  |
| `editUrl`       | string                                                          | –        |
| `pagefind`      | boolean                                                         | `true`   |
| `sidebar.badge` | `{ variant, text }`, variant `note`, `tip`, `danger`, `caution`, `success` | – |
| `prev`, `next`  | boolean or `{ link, label }`                                    | –        |

## Course

`courseFrontmatterSchema` in `packages/content-model/src/courses.ts`:

| Field                   | Type                                   | Default  |
| ----------------------- | -------------------------------------- | -------- |
| `title`                 | string                                 | required |
| `slug`                  | string                                 | required |
| `description`           | string                                 | required |
| `level`                 | `beginner`, `intermediate`, `advanced` | required |
| `estimatedTotalMinutes` | number                                 | required |
| `tags`                  | string[]                               | `[]`     |
| `track`                 | string                                 | –        |
| `prerequisites`         | string[]                               | `[]`     |
| `thumbnail`             | string                                 | –        |
| `published`             | boolean                                | `true`   |

## Lesson

`lessonFrontmatterSchema`, same file:

| Field                | Type                                   | Default  |
| -------------------- | -------------------------------------- | -------- |
| `courseSlug`         | string                                 | required |
| `title`              | string                                 | required |
| `module`             | string                                 | required |
| `orderInModule`      | number                                 | required |
| `estimatedMinutes`   | number                                 | required |
| `requiresExperience` | boolean                                | `false`  |
| `type`               | `video`, `text`, `quiz`, `project`     | `text`   |
| `goals`              | string[]                               | –        |
| `resources`          | `{ title, url }[]`                     | –        |

## Sidebar

`defineSidebar()` from `@knowledge-core/content-model/sidebar` accepts groups with `label` plus
either `autogenerate: { directory }` or `items` and an optional `collapsed`. Entries inside
`items` are page references `{ slug, badge? }`, links `{ label, link, badge? }` or further groups.
