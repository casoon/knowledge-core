---
title: AI assistant
description: Index your content in Cloudflare Vectorize and deploy the chat worker that answers visitor questions from it.
order: 2
---

The assistant is optional. Without it, both sites build and run as before; the chat widget only
renders when an endpoint is configured.

## How a question is answered

The worker in `apps/chat-worker/src/index.ts` handles `POST /chat`:

1. Checks the `Origin` header against `ALLOWED_ORIGINS` and applies the rate limit: 20 requests per
   60 seconds per origin and client IP.
2. Validates the body: at most 32,000 bytes, a message of 1 to 2,000 characters, at most 10
   history messages.
3. Embeds the question with `@cf/baai/bge-large-en-v1.5`.
4. Queries Vectorize for the top 5 chunks and keeps those with a score of at least 0.55.
5. Sends them with the question to `@cf/meta/llama-3-8b-instruct` and streams the answer back as
   server-sent events.

The system prompt asks the model to cite source paths and to say so when the documentation does
not cover a question.

## Setup

You need a Cloudflare account and `wrangler`.

### 1. Create the Vectorize index

```sh
CLOUDFLARE_ACCOUNT_ID=<your-account-id> \
  wrangler vectorize create knowledge-core \
  --preset="@cf/baai/bge-large-en-v1.5"
```

### 2. Configure credentials

```sh
cp .env.example .env
```

```ini
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token        # Workers AI + Vectorize permissions
CLOUDFLARE_VECTORIZE_INDEX=knowledge-core
PUBLIC_CHAT_ENDPOINT=https://knowledge-core-chat-worker.<subdomain>.workers.dev/chat
```

The API token needs **Workers AI: Edit** and **Vectorize: Edit** on the account. `.env` is
gitignored.

### 3. Ingest the content

```sh
pnpm run ingest
```

`scripts/ingest-content.ts` reads every `.md` and `.mdx` file under `apps/docs/src/content/docs`
and `apps/courses/src/content/lessons`, splits it into chunks of about 800 characters, embeds them
in batches of 20 and uploads the vectors. Run it again after significant content changes.

### 4. Deploy the worker

Set `ALLOWED_ORIGINS` in `apps/chat-worker/wrangler.jsonc` to the public origins of your sites,
and pick a `ratelimits[].namespace_id` that is unique in your account. Then:

```sh
pnpm --filter chat-worker run deploy
```

Set `PUBLIC_CHAT_ENDPOINT` in the build environment of both sites. In development, `AppShell`
falls back to `http://localhost:8787/chat`, where `pnpm --filter chat-worker run dev` serves the
worker.

## The widget

`ChatWidget` from `@knowledge-core/ui` takes `apiEndpoint` (required), `title` (default
`Knowledge AI Assistant`) and `placeholder` (default `Ask AI about this project...`).
