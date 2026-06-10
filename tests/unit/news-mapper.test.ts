import {
  buildNewsSlug,
  getIdFromNewsSlug,
  mapRowToArticle,
  slugify,
} from '@/features/news/mapper';
import type { NewsPostRow } from '@/features/news/types';

describe('news slugify', () => {
  it('transliterates Turkish characters and lowercases', () => {
    expect(slugify('Çocuk İşçi Ölümü')).toBe('cocuk-isci-olumu');
  });

  it('collapses separators', () => {
    expect(slugify('Almanya  --  Haber!!!')).toBe('almanya-haber');
  });
});

describe('news slug round-trip', () => {
  it('builds slug ending with --{id} and parses the id back', () => {
    const row = { id: 'abc-123', title: 'Önemli Haber' };
    const slug = buildNewsSlug(row);
    expect(slug).toBe('onemli-haber--abc-123');
    expect(getIdFromNewsSlug(slug)).toBe('abc-123');
  });

  it('returns empty id for malformed slug', () => {
    expect(getIdFromNewsSlug('no-separator')).toBe('');
  });

  it('handles ids that contain hyphens', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const slug = buildNewsSlug({ id, title: 'Test' });
    expect(getIdFromNewsSlug(slug)).toBe(id);
  });
});

describe('mapRowToArticle', () => {
  const base: NewsPostRow = {
    id: 'x1',
    category: null,
    title: null,
    summary: null,
    content: null,
    cover_image_url: null,
    source_name: null,
    source_url: null,
    reading_minutes: null,
    published_at: null,
    created_at: '2026-01-02T00:00:00Z',
  };

  it('falls back to defaults for null fields', () => {
    const a = mapRowToArticle(base);
    expect(a.title).toBe('Başlıksız haber');
    expect(a.category).toBe('Almanya');
    expect(a.readingMinutes).toBe(3);
    expect(a.image).toBeNull();
    expect(a.sourceName).toBeUndefined();
  });

  it('uses provided values; treats 0 reading_minutes as missing (defaults to 3)', () => {
    const a = mapRowToArticle({ ...base, title: 'Haber', reading_minutes: 0, cover_image_url: 'https://x/y.jpg' });
    expect(a.title).toBe('Haber');
    // Ported web behavior: `Number(0 || 3)` -> 3, then Math.max(1, 3) -> 3.
    expect(a.readingMinutes).toBe(3);
    expect(a.image).toBe('https://x/y.jpg');
  });

  it('clamps a provided positive reading_minutes through', () => {
    const a = mapRowToArticle({ ...base, reading_minutes: 7 });
    expect(a.readingMinutes).toBe(7);
  });
});
