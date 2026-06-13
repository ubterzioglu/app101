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
    slug: null,
    category: null,
    title: null,
    summary: null,
    content: null,
    cover_image_url: null,
    cover_image_alt: null,
    source_name: null,
    source_url: null,
    source_published_at: null,
    status: 'published',
    is_featured: null,
    featured_rank: null,
    reading_time_minutes: null,
    reading_minutes: null,
    whatsapp_share_text: null,
    published_at: null,
    created_at: '2026-01-02T00:00:00Z',
  };

  it('falls back to defaults for null fields', () => {
    const a = mapRowToArticle(base);
    expect(a.title).toBe('Başlıksız haber');
    expect(a.slug).toBe('basliksiz-haber--x1');
    expect(a.categoryKey).toBe('almanya');
    expect(a.categoryLabel).toBe('Almanya');
    expect(a.readingMinutes).toBe(3);
    expect(a.image).toBeNull();
    expect(a.imageAlt).toBe('Başlıksız haber');
    expect(a.sourceName).toBeUndefined();
    expect(a.whatsAppShareText).toBeNull();
  });

  it('uses provided slug and new reading_time_minutes field', () => {
    const a = mapRowToArticle({
      ...base,
      title: 'Haber',
      slug: 'hazir-slug',
      reading_time_minutes: 5,
      cover_image_url: 'https://x/y.jpg',
      cover_image_alt: 'Alt metin',
      whatsapp_share_text: 'Paylaş',
      is_featured: true,
      featured_rank: 1,
      category: 'avrupa',
    });

    expect(a.title).toBe('Haber');
    expect(a.slug).toBe('hazir-slug');
    expect(a.categoryKey).toBe('avrupa');
    expect(a.categoryLabel).toBe('Avrupa');
    expect(a.readingMinutes).toBe(5);
    expect(a.image).toBe('https://x/y.jpg');
    expect(a.imageAlt).toBe('Alt metin');
    expect(a.whatsAppShareText).toBe('Paylaş');
    expect(a.isFeatured).toBe(true);
    expect(a.featuredRank).toBe(1);
  });

  it('falls back to legacy reading_minutes when the new field is missing', () => {
    const a = mapRowToArticle({ ...base, reading_minutes: 7 });

    expect(a.readingMinutes).toBe(7);
  });

  it('treats zero reading time as missing and defaults to three minutes', () => {
    const a = mapRowToArticle({ ...base, reading_time_minutes: 0, reading_minutes: 0 });

    expect(a.readingMinutes).toBe(3);
  });
});
