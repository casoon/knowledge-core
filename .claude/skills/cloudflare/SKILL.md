---
name: cloudflare
description: Cloudflare Workers/Pages deployment and runtime for this monorepo. Use this skill for deploy, wrangler, KV bindings, sessions, and adapter configuration.
---

# Cloudflare Skill

## Architecture

Both apps deploy to **Cloudflare Workers** via `@astrojs/cloudflare` adapter:

- **Starter** (`astro-v6-starter`) — SSR Worker with KV Sessions
- **Blog** (`astro-v6-blog`) — Fully pre-rendered static assets

Live URLs:
- Starter: https://astrov6.casoon.dev
- Blog: https://astrov6blog.casoon.dev

## Adapter Configuration

### Starter (SSR + Sessions)

```javascript
// apps/starter/astro.config.mjs
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    sessionKVBindingName: 'SESSION',
  }),
  session: {
    cookie: 'astro-session',
    ttl: 86400,
  },
});
```

### Blog (Static)

```javascript
// apps/blog/astro.config.mjs
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
});
```

The blog pre-renders all pages at build time. The adapter generates `dist/client/` only (no `dist/server/`).

## Wrangler Configuration

### Starter (`apps/starter/wrangler.toml`)

```toml
name = "astro-v6-starter"
compatibility_date = "2025-12-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "SESSION"
id = "21fa37fe76934de8afe152b0d032a845"

[observability]
enabled = true
```

### Blog (`apps/blog/wrangler.toml`)

```toml
name = "astro-v6-blog"
compatibility_date = "2025-12-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = "./dist/client"

[observability]
enabled = true
```

## Deploying

```bash
# Build first (required)
pnpm build

# Deploy starter
cd apps/starter && pnpm wrangler deploy

# Deploy blog
cd apps/blog && pnpm wrangler deploy
```

### Known Issues

**Blog deploy fails with "dist/server/wrangler.json does not exist":**
The Cloudflare adapter may create a stale `.wrangler/deploy/config.json` that references `dist/server/wrangler.json`, which doesn't exist for fully static builds. Fix:

```bash
rm -rf apps/blog/.wrangler/deploy
pnpm wrangler deploy
```

**Starter SSR Worker:** The adapter generates `dist/server/wrangler.json` which Wrangler uses as the redirected configuration. The `dist/server/` directory contains the Worker entry point.

## KV Bindings

The Starter uses Cloudflare KV for Astro Sessions:

- Binding name: `SESSION`
- Used by: `@astrojs/cloudflare` session driver
- Created via: `wrangler kv namespace create SESSION`

To add a new KV namespace:

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "MY_STORE"
id = "<namespace-id>"
```

## Compatibility Flags

`nodejs_compat` is required for both apps — enables Node.js built-in modules in Workers runtime (needed for Astro's server runtime).

## Image Service

Both apps use `noop` image service since Cloudflare Workers handle images via the `IMAGES` binding:

```javascript
image: {
  service: { entrypoint: 'astro/assets/services/noop' },
},
```

The adapter automatically configures Cloudflare Images (`env.IMAGES` binding).

## Custom Domains

Custom domains are configured in Cloudflare Dashboard (DNS + Workers Routes), not in `wrangler.toml`. The `site` URL in `astro.config.mjs` must match the production domain for correct sitemap/canonical URLs.

## Environment Variables

Access env vars in Cloudflare Workers via `Astro.locals.runtime.env`:

```typescript
// In API routes or SSR pages
const env = Astro.locals.runtime.env;
const value = env.MY_SECRET;
```

Set secrets via Wrangler:

```bash
wrangler secret put MY_SECRET
```
