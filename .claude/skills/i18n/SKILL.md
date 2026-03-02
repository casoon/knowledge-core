---
name: i18n
description: Internationalization patterns for this Astro monorepo. Use this skill when adding translations, new locales, or language-aware pages.
---

# i18n Skill

## Architecture

Two-layer i18n:

1. **Astro i18n routing** — URL prefixing (`/de/contact`)
2. **App-level translations** — `t('key')` function per locale

### Supported Locales

- `en` (default, no prefix): `/`, `/contact`, `/blog/welcome`
- `de` (prefixed): `/de/`, `/de/contact`

## Astro i18n Config

```javascript
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,  // EN at root, DE at /de/
    },
  },
});
```

## Shared Utilities (`@astro-v6/shared/utils/i18n`)

```typescript
import { localePath, getLocaleFromPath, switchLocalePath, useTranslations } from '@astro-v6/shared/utils/i18n';
import type { Locale, Translations } from '@astro-v6/shared/utils/i18n';

// Build locale-prefixed path
localePath('/contact', 'en')  // → '/contact'
localePath('/contact', 'de')  // → '/de/contact'

// Detect locale from URL
getLocaleFromPath('/de/contact')  // → 'de'
getLocaleFromPath('/contact')     // → 'en'

// Switch locale in current path
switchLocalePath('/de/contact', 'en')  // → '/contact'
switchLocalePath('/contact', 'de')     // → '/de/contact'

// Create translation helper
const t = useTranslations(dictionary);
t('nav.home')  // → 'Home'
```

## Translation Files

Each app has its own translations in `src/i18n/`:

```
apps/starter/src/i18n/
  en.ts         # English translations
  de.ts         # German translations
  index.ts      # t() helper
```

### Translation File Format

```typescript
// src/i18n/en.ts
export default {
  'nav.home': 'Home',
  'nav.contact': 'Contact',
  'home.title': 'Astro v6 Starter',
  'contact.title': 'Contact',
  'contact.send': 'Send',
  '404.title': '404 - Page Not Found',
} as const;
```

### Translation Helper

```typescript
// src/i18n/index.ts
import type { Locale, Translations } from '@astro-v6/shared/utils/i18n';
import { useTranslations } from '@astro-v6/shared/utils/i18n';
import de from './de.js';
import en from './en.js';

const translations: Record<Locale, Translations> = { en, de };

export function t(locale: Locale) {
  return useTranslations(translations[locale]);
}
```

## Page Pattern

Each locale needs its own page file:

```
pages/
  index.astro           # EN homepage
  contact.astro         # EN contact
  de/
    index.astro         # DE homepage
    contact.astro       # DE contact
```

### Page Template

```astro
---
import { localePath } from '@astro-v6/shared/utils/i18n';
import { t } from '@/i18n';

const locale = 'de';  // or 'en'
const tr = t(locale);

const links = [
  { href: localePath('/', locale), label: tr('nav.home') },
  { href: localePath('/contact', locale), label: tr('nav.contact') },
];
---

<BaseLayout title={tr('home.title')} lang={locale}>
  <Navbar slot="header" links={links}>
    <!-- Language switcher: link to other locale -->
    <a href="/contact">EN</a>
  </Navbar>
  <h1>{tr('home.title')}</h1>
</BaseLayout>
```

## Adding a New Page (Both Locales)

1. Create `pages/newpage.astro` with `const locale = 'en'`
2. Create `pages/de/newpage.astro` with `const locale = 'de'`
3. Add translation keys to both `en.ts` and `de.ts`
4. Add nav links using `localePath('/newpage', locale)`
5. Add OG image entry in `scripts/generate-og.ts` for both locales

## Adding a New Locale

1. Add locale to `astro.config.mjs`: `locales: ['en', 'de', 'fr']`
2. Add type to `shared/src/utils/i18n.ts`: `export const locales = ['en', 'de', 'fr'] as const`
3. Create translation file: `src/i18n/fr.ts`
4. Register in `src/i18n/index.ts`
5. Create page directory: `pages/fr/`
6. Duplicate all DE pages into `pages/fr/` with `const locale = 'fr'`
7. Update sitemap i18n config: `locales: { en: 'en', de: 'de', fr: 'fr' }`
8. Add OG image entries in `scripts/generate-og.ts`

## Sitemap i18n

The sitemap integration generates `hreflang` attributes:

```javascript
sitemap({
  i18n: {
    defaultLocale: 'en',
    locales: { en: 'en', de: 'de' },
  },
}),
```

## Language Switcher Pattern

```astro
<!-- In EN page: link to DE version -->
<a href="/de/contact" class="text-xs font-medium text-text-secondary hover:text-text no-underline">DE</a>

<!-- In DE page: link to EN version -->
<a href="/contact" class="text-xs font-medium text-text-secondary hover:text-text no-underline">EN</a>
```
