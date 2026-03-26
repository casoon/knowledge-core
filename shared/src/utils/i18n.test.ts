import { describe, expect, it } from 'vitest';
import {
  defaultLocale,
  getLocaleFromPath,
  localePath,
  locales,
  switchLocalePath,
  useTranslations,
} from './i18n';

describe('constants', () => {
  it('has en as default locale', () => {
    expect(defaultLocale).toBe('en');
  });

  it('includes en and de', () => {
    expect(locales).toContain('en');
    expect(locales).toContain('de');
  });
});

describe('getLocaleFromPath', () => {
  it('returns default locale for root path', () => {
    expect(getLocaleFromPath('/')).toBe('en');
  });

  it('returns default locale for english path without prefix', () => {
    expect(getLocaleFromPath('/docs/guide')).toBe('en');
  });

  it('returns de for /de/ prefixed paths', () => {
    expect(getLocaleFromPath('/de/docs/guide')).toBe('de');
  });

  it('returns default locale for unknown segment', () => {
    expect(getLocaleFromPath('/fr/docs')).toBe('en');
  });
});

describe('localePath', () => {
  it('returns clean path for default locale', () => {
    expect(localePath('/docs', 'en')).toBe('/docs');
  });

  it('prefixes path for non-default locale', () => {
    expect(localePath('/docs', 'de')).toBe('/de/docs');
  });

  it('handles paths without leading slash', () => {
    expect(localePath('docs', 'de')).toBe('/de/docs');
  });

  it('handles root path', () => {
    expect(localePath('/', 'de')).toBe('/de/');
  });
});

describe('switchLocalePath', () => {
  it('strips locale prefix when switching to default', () => {
    expect(switchLocalePath('/de/docs/guide', 'en')).toBe('/docs/guide');
  });

  it('adds locale prefix when switching from default', () => {
    expect(switchLocalePath('/docs/guide', 'de')).toBe('/de/docs/guide');
  });

  it('handles switching between non-default locales', () => {
    expect(switchLocalePath('/de/docs/guide', 'de')).toBe('/de/docs/guide');
  });

  it('handles root path', () => {
    expect(switchLocalePath('/', 'de')).toBe('/de/');
  });
});

describe('useTranslations', () => {
  const dict = { hello: 'Hallo', 'nav.docs': 'Dokumentation' };

  it('returns translated string for known key', () => {
    const t = useTranslations(dict);
    expect(t('hello')).toBe('Hallo');
    expect(t('nav.docs')).toBe('Dokumentation');
  });

  it('falls back to key for unknown translations', () => {
    const t = useTranslations(dict);
    expect(t('unknown.key')).toBe('unknown.key');
  });

  it('works with empty dict', () => {
    const t = useTranslations({});
    expect(t('any.key')).toBe('any.key');
  });
});
