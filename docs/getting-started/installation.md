---
title: Installation
description: Create a project from the template, install the workspace and start the apps.
order: 1
---

## Requirements

Taken from `engines` in the root `package.json`:

| Tool    | Minimum   | Pinned via Volta |
| ------- | --------- | ---------------- |
| Node.js | `22.12.0` | `24.11.0`        |
| pnpm    | `9.0.0`   | `9.15.4`         |

Volta is recommended but not required.

## Create the project

Knowledge Core is a GitHub template repository. Either click **Use this template** on
[GitHub](https://github.com/casoon/knowledge-core) and clone the new repository, or clone the
template directly:

```sh
git clone https://github.com/casoon/knowledge-core.git
cd knowledge-core
```

## Install

One install at the root covers every app and package of the workspace:

```sh
pnpm install
```

The `prepare` script then installs the Husky Git hooks.

## Start

```sh
# all apps in parallel
pnpm dev

# or one at a time
pnpm dev:docs      # http://localhost:4321
pnpm dev:courses   # http://localhost:4322
```

`pnpm dev` also starts the chat worker with `wrangler dev` on `http://localhost:8787`. During
local development the sites use that endpoint automatically.

## Build

```sh
pnpm build           # docs, courses, then a dry-run bundle of the chat worker
pnpm build:docs
pnpm build:courses
```

Continue with the [project structure](../project-structure/).
