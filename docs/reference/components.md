---
title: Components
description: The 25 Astro components exported from @knowledge-core/ui, by group.
order: 2
---

All components are exported from `packages/ui/src/index.ts` and imported in MDX or Astro files:

```mdx
import { Callout, Quiz } from '@knowledge-core/ui';
```

## Content

| Component     | Purpose                                                   |
| ------------- | --------------------------------------------------------- |
| `Callout`     | notice box: `info`, `success`, `warning`, `error`; optionally collapsible |
| `Card`        | content card                                              |
| `CodeBlock`   | highlighted code with copy button                         |
| `CodeExample` | code example block                                        |
| `Tabs`, `TabPanel` | tabbed content                                       |
| `ChatWidget`  | floating panel for the [AI assistant](../../guides/ai-chat/) |

## Courses

| Component        | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `Quiz`           | multiple-choice questions with feedback         |
| `Exercise`       | exercise block, difficulty `easy`, `medium` or `hard` |
| `Hint`           | collapsible hint                                |
| `ProgressBar`    | progress indicator                              |
| `CourseCard`     | course teaser                                   |
| `LessonNav`      | lesson navigation                               |
| `LessonComplete` | marks a lesson as done                          |
| `TotalProgress`  | progress across a course                        |

## Layout

`AppShell`, `Footer`, `PageHeader`, `SidebarLayout`, `TableOfContents`.

## Navigation

| Component         | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `NavBar`          | main navigation with mobile menu            |
| `SearchBar`       | search field for a Pagefind index           |
| `LanguageSelect`  | switch between English and German           |
| `FontSizeControl` | lets the reader change the font size        |
| `QuizToggle`      | shows or hides quizzes                      |

Course progress is stored in the browser with `localStorage` (`packages/ui/src/scripts/progress.ts`
and `storage.ts`). The helpers fail silently where storage is unavailable, such as in private
browsing.
