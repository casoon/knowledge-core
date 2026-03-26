import { describe, expect, it } from 'vitest';
import { docsFrontmatterSchema } from './docs';

const base = {
  title: 'Test Doc',
  category: 'guides' as const,
};

describe('docsFrontmatterSchema', () => {
  it('parses required fields', () => {
    const result = docsFrontmatterSchema.parse(base);
    expect(result.title).toBe('Test Doc');
    expect(result.category).toBe('guides');
  });

  it('applies defaults', () => {
    const result = docsFrontmatterSchema.parse(base);
    expect(result.order).toBe(0);
    expect(result.tags).toEqual([]);
    expect(result.status).toBe('stable');
    expect(result.draft).toBe(false);
    expect(result.pagefind).toBe(true);
  });

  it('accepts draft: true', () => {
    const result = docsFrontmatterSchema.parse({ ...base, draft: true });
    expect(result.draft).toBe(true);
  });

  it('accepts editUrl', () => {
    const result = docsFrontmatterSchema.parse({
      ...base,
      editUrl: 'https://github.com/org/repo/edit/main/docs/test.mdx',
    });
    expect(result.editUrl).toBe('https://github.com/org/repo/edit/main/docs/test.mdx');
  });

  it('accepts pagefind: false', () => {
    const result = docsFrontmatterSchema.parse({ ...base, pagefind: false });
    expect(result.pagefind).toBe(false);
  });

  it('accepts sidebar badge', () => {
    const result = docsFrontmatterSchema.parse({
      ...base,
      sidebar: { badge: { variant: 'tip', text: 'New' } },
    });
    expect(result.sidebar?.badge?.variant).toBe('tip');
    expect(result.sidebar?.badge?.text).toBe('New');
  });

  it('rejects invalid sidebar badge variant', () => {
    expect(() =>
      docsFrontmatterSchema.parse({
        ...base,
        sidebar: { badge: { variant: 'invalid', text: 'x' } },
      })
    ).toThrow();
  });

  it('accepts prev as boolean false', () => {
    const result = docsFrontmatterSchema.parse({ ...base, prev: false });
    expect(result.prev).toBe(false);
  });

  it('accepts next as object with link and label', () => {
    const result = docsFrontmatterSchema.parse({
      ...base,
      next: { link: '/docs/other', label: 'Other Page' },
    });
    expect(result.next).toEqual({ link: '/docs/other', label: 'Other Page' });
  });

  it('accepts all valid status values', () => {
    for (const status of ['stable', 'beta', 'deprecated'] as const) {
      const result = docsFrontmatterSchema.parse({ ...base, status });
      expect(result.status).toBe(status);
    }
  });

  it('rejects missing title', () => {
    expect(() => docsFrontmatterSchema.parse({ category: 'guides' })).toThrow();
  });

  it('rejects invalid category', () => {
    expect(() => docsFrontmatterSchema.parse({ ...base, category: 'unknown' })).toThrow();
  });

  it('coerces lastUpdated string to Date', () => {
    const result = docsFrontmatterSchema.parse({ ...base, lastUpdated: '2024-01-15' });
    expect(result.lastUpdated).toBeInstanceOf(Date);
  });
});
