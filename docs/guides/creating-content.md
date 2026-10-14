---
title: Writing docs and lessons
description: Add a documentation page, a course and its lessons. Frontmatter is checked against the content schemas when the site builds.
order: 1
---

## A documentation page

Create an MDX file under `apps/docs/src/content/docs/<category>/`. The category must be one of
`getting-started`, `guides`, `api`, `cookbook` or `components`.

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

<Callout type="info">Important information!</Callout>
```

Optional fields, all defined in `packages/content-model/src/docs.ts`:

| Field           | Effect                                                  |
| --------------- | ------------------------------------------------------- |
| `draft`         | `true` excludes the page from the build                 |
| `editUrl`       | link target for "edit this page"                        |
| `pagefind`      | `false` marks the page body as excluded from search     |
| `sidebar.badge` | badge next to the sidebar entry (`note`, `tip`, `danger`, `caution`, `success`) |
| `prev`, `next`  | `false` hides the link, `{ link, label }` overrides it  |

## The sidebar

`apps/docs/src/config/sidebar.ts` declares the sidebar with `defineSidebar()`. A group can list a
directory to fill itself (`autogenerate`), list entries by hand, start collapsed, and carry
badges; plain `{ label, link }` entries add external links.

```ts
import { defineSidebar } from '@knowledge-core/content-model/sidebar';

export const sidebar = defineSidebar([
  { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
  {
    label: 'Reference',
    collapsed: true,
    items: [{ slug: 'api/overview' }, { slug: 'api/endpoints', badge: { variant: 'tip', text: 'New' } }],
  },
  { label: 'GitHub', link: 'https://github.com/casoon/knowledge-core' },
]);
```

## A course

A course is one JSON file in `apps/courses/src/content/courses/`:

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

`level` is `beginner`, `intermediate` or `advanced`. `track`, `prerequisites` and `thumbnail` are
optional.

## A lesson

Lessons are MDX files in `apps/courses/src/content/lessons/`. `courseSlug` ties a lesson to its
course; `module` and `orderInModule` place it in the course outline.

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

<Exercise title="Exercise" difficulty="easy">
  Task here...
</Exercise>

<Quiz
  questions={[
    { question: 'What is 2 + 2?', options: ['3', '4', '5'], correctAnswer: 1 },
  ]}
/>
```

`type` is `text` (default), `video`, `quiz` or `project`. `correctAnswer` is a zero-based index.

The full field lists are in the [content schemas reference](../../reference/content-schemas/).
