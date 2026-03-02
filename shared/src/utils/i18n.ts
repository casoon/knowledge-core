export const defaultLocale = 'en' as const;
export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];

/** Type-safe translation dictionary */
export type Translations = Record<string, string>;

/**
 * Get locale from URL pathname.
 * Returns the locale prefix if present, otherwise the default locale.
 */
export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return defaultLocale;
}

/**
 * Build a locale-prefixed path.
 * For the default locale, no prefix is added (clean URLs).
 */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean}`;
}

/**
 * Get the alternate path for switching locale.
 * Strips current locale prefix (if any) and adds the new one.
 */
export function switchLocalePath(pathname: string, newLocale: Locale): string {
  const currentLocale = getLocaleFromPath(pathname);
  let basePath = pathname;

  // Strip current locale prefix
  if (currentLocale !== defaultLocale) {
    basePath = pathname.replace(`/${currentLocale}`, '') || '/';
  }

  return localePath(basePath, newLocale);
}

/**
 * Create a typed translation helper.
 * Usage: const t = useTranslations(translations.de);
 */
export function useTranslations(dict: Translations) {
  return (key: string): string => {
    return dict[key] ?? key;
  };
}
