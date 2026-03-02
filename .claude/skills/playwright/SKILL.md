---
name: playwright
description: Playwright E2E testing patterns for this monorepo. Use this skill when writing, running or debugging E2E tests.
---

# Playwright Skill

## Project Setup

Tests live in `e2e/` with separate directories per app:

```
e2e/
  starter/
    a11y.spec.ts        # axe-core WCAG 2.1 AA
    contact.spec.ts     # Contact form
    i18n.spec.ts        # Language switching
    navigation.spec.ts  # Page navigation
    seo.spec.ts         # OG tags, robots.txt, sitemap, JSON-LD
    theme.spec.ts       # Dark mode toggle
  blog/
    a11y.spec.ts
    i18n.spec.ts
    navigation.spec.ts
    seo.spec.ts
```

## Configuration

Two projects (starter + blog) with separate web servers serving static builds:

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  projects: [
    {
      name: 'starter',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5173' },
      testMatch: 'starter/**/*.spec.ts',
    },
    {
      name: 'blog',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5174' },
      testMatch: 'blog/**/*.spec.ts',
    },
  ],
  webServer: [
    { command: 'npx serve apps/starter/dist/client -l 5173', port: 5173, reuseExistingServer: false },
    { command: 'npx serve apps/blog/dist/client -l 5174', port: 5174, reuseExistingServer: false },
  ],
});
```

**Important:** Tests require a build first (`pnpm build`). The web servers serve the static `dist/client/` output.

## Running Tests

```bash
pnpm test:e2e                    # All 43 tests
pnpm test:e2e:starter            # Starter only
pnpm test:e2e:blog               # Blog only
playwright test --project=starter -g "SEO"  # Filter by name
```

## Test Patterns

### Navigation Test

```typescript
import { expect, test } from '@playwright/test';

test.describe('Starter – Navigation', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Astro v6/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
  });
});
```

### SEO Test

```typescript
test('homepage has OG meta tags', async ({ page }) => {
  await page.goto('/');
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute('content', /./);

  const ogImage = page.locator('meta[property="og:image"]');
  await expect(ogImage).toHaveAttribute('content', /\.png$/);
});

test('robots.txt is accessible and contains Sitemap', async ({ page }) => {
  const response = await page.goto('/robots.txt');
  expect(response?.status()).toBe(200);
  const text = await response?.text();
  expect(text).toContain('Sitemap:');
});

test('sitemap-index.xml is accessible', async ({ page }) => {
  const response = await page.goto('/sitemap-index.xml');
  expect(response?.status()).toBe(200);
  const text = await response?.text();
  expect(text).toContain('<sitemapindex');
});

test('JSON-LD structured data is present', async ({ page }) => {
  await page.goto('/');
  const jsonLd = page.locator('script[type="application/ld+json"]');
  await expect(jsonLd).toBeAttached();
  const content = await jsonLd.textContent();
  const parsed = JSON.parse(content!);
  expect(parsed['@context']).toBe('https://schema.org');
});
```

### Accessibility Test (axe-core)

```typescript
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Starter – Accessibility', () => {
  test('homepage has no a11y violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

### i18n Test

```typescript
test('German homepage has lang="de"', async ({ page }) => {
  await page.goto('/de');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('lang', 'de');
});

test('language switcher navigates to DE', async ({ page }) => {
  await page.goto('/');
  await page.click('a:has-text("DE")');
  await expect(page).toHaveURL('/de');
});
```

### Form Test

```typescript
test('contact form renders with all fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="subject"]')).toBeVisible();
  await expect(page.locator('textarea[name="message"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
```

### Theme Test

```typescript
test('clicking toggle switches dark class', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const toggle = page.locator('button[aria-label*="dark"], button[aria-label*="light"]');
  await toggle.click();
  await expect(html).toHaveClass(/dark/);
});
```

## Writing New Tests

1. Place test in `e2e/starter/` or `e2e/blog/` matching the app
2. Use descriptive `test.describe` groups: `'Starter – Feature'` or `'Blog – Feature'`
3. Always test both locales if the feature is i18n-aware
4. For SEO tests, verify OG tags, canonical URLs, and meta descriptions
5. For a11y tests, use `AxeBuilder` — zero violations expected
6. Tests run against static builds, so server-side features (Actions, sessions) are not testable this way

## Common Mistakes

- **Forgetting to build first** — Tests serve `dist/client/`, not dev server
- **Using `page.waitForNavigation()`** — Prefer `await expect(page).toHaveURL()`
- **Hardcoding ports** — Use relative URLs, `baseURL` is set per project
- **Testing server-side logic** — E2E tests run against static output only
