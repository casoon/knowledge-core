import { de } from './de';
import { en, type TranslationKey } from './en';

export type { TranslationKey };
export { de, en };

export const defaultLocale = 'en' as const;
export const locales = ['en', 'de'] as const;
export type SupportedLocale = (typeof locales)[number];
export type Locale = SupportedLocale;

export type Translations = Record<string, string>;

const translations: Record<SupportedLocale, typeof en> = { en, de };

/**
 * Returns a type-safe translation function for the given locale.
 * Falls back to English for missing keys.
 *
 * @example
 * const t = getTranslations(Astro.currentLocale ?? 'en');
 * t('page.edit') // → "Edit this page" or "Diese Seite bearbeiten"
 */
export function getTranslations(locale: string) {
  const dict =
    translations[
      (locale as SupportedLocale) in translations ? (locale as SupportedLocale) : defaultLocale
    ];
  return (key: TranslationKey): string => dict[key] ?? en[key] ?? key;
}

/**
 * Build locale-prefixed path. Default locale ('en') has no prefix.
 */
export function localePath(path: string, locale: SupportedLocale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}

/**
 * Switch locale in the current pathname.
 */
export function switchLocalePath(pathname: string, newLocale: SupportedLocale): string {
  const current = locales.find((l) => l !== defaultLocale && pathname.startsWith(`/${l}`));
  const base = current ? pathname.replace(`/${current}`, '') || '/' : pathname;
  return localePath(base, newLocale);
}

/**
 * Get locale from URL pathname segment.
 */
export function getLocaleFromPath(pathname: string): SupportedLocale {
  const segment = pathname.split('/')[1] as SupportedLocale;
  return locales.includes(segment) ? segment : defaultLocale;
}

/**
 * Create a translation helper from an arbitrary string dictionary.
 * Falls back to the key itself when not found.
 */
export function useTranslations(dict: Translations) {
  return (key: string): string => dict[key] ?? key;
}
