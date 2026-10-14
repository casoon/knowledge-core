---
title: Deployment
description: Both sites build to static files. Build commands and output directories per host.
order: 4
---

| Site    | Build command        | Output directory     |
| ------- | -------------------- | -------------------- |
| Docs    | `pnpm build:docs`    | `apps/docs/dist`     |
| Courses | `pnpm build:courses` | `apps/courses/dist`  |

Set `PUBLIC_CHAT_ENDPOINT` in the build environment if the [AI assistant](../ai-chat/) is in use.

## Cloudflare Pages

Use the build commands above, or deploy a local build:

```sh
wrangler pages deploy apps/docs/dist --project-name=knowledge-core-docs
wrangler pages deploy apps/courses/dist --project-name=knowledge-core
```

## Vercel

Import the repository and set the build command and output directory from the table, with the
repository root as root directory.

## Netlify

```toml
# netlify.toml
[build]
  command = "pnpm build:docs"
  publish = "apps/docs/dist"
```

## Chat worker

The worker deploys separately to Cloudflare Workers:

```sh
pnpm --filter chat-worker run deploy
```
