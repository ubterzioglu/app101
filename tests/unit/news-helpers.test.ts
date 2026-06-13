import {
  buildWhatsAppShareText,
  buildWhatsAppShareUrl,
  filterArticlesByCategory,
  getNewsCategoryLabel,
  normalizeNewsCategory,
  splitHeroArticle,
  type NewsCategoryKey,
} from '@/features/news/helpers';
import type { NewsArticle } from '@/features/news/types';

function createArticle(overrides: Partial<NewsArticle> = {}): NewsArticle {
  return {
    id: overrides.id ?? '1',
    slug: overrides.slug ?? 'haber-1',
    title: overrides.title ?? 'Test Haber',
    excerpt: overrides.excerpt ?? 'Kısa özet',
    content: overrides.content ?? 'Detay metni',
    image: overrides.image ?? 'https://almanya101.de/image.webp',
    imageAlt: overrides.imageAlt ?? 'Kapak görseli',
    publishedAt: overrides.publishedAt ?? '2026-06-13T08:00:00Z',
    sourcePublishedAt: overrides.sourcePublishedAt ?? '2026-06-13T07:00:00Z',
    dateLabel: overrides.dateLabel ?? '13 Haziran 2026',
    categoryKey: overrides.categoryKey ?? 'almanya',
    categoryLabel: overrides.categoryLabel ?? 'Almanya',
    readingMinutes: overrides.readingMinutes ?? 4,
    sourceName: overrides.sourceName ?? 'Tagesschau',
    sourceUrl: overrides.sourceUrl ?? 'https://www.tagesschau.de/article',
    isFeatured: overrides.isFeatured ?? false,
    featuredRank: overrides.featuredRank ?? null,
    whatsAppShareText: overrides.whatsAppShareText ?? null,
  };
}

describe('getNewsCategoryLabel', () => {
  it.each<NewsCategoryKey>(['almanya', 'turkiye', 'avrupa', 'dunya'])(
    'returns a Turkish label for %s',
    (category) => {
      expect(getNewsCategoryLabel(category)).toMatch(/^[A-ZÇĞİÖŞÜ]/);
    }
  );

  it('falls back to Almanya for unsupported values', () => {
    expect(getNewsCategoryLabel('bilinmiyor')).toBe('Almanya');
  });

  it('maps legacy Turkish labels to category keys', () => {
    expect(normalizeNewsCategory('Türkiye')).toBe('turkiye');
    expect(normalizeNewsCategory('Dünya')).toBe('dunya');
  });
});

describe('filterArticlesByCategory', () => {
  it('keeps only the selected category', () => {
    const items = [
      createArticle({ id: '1', categoryKey: 'almanya', categoryLabel: 'Almanya' }),
      createArticle({ id: '2', categoryKey: 'avrupa', categoryLabel: 'Avrupa' }),
    ];

    expect(filterArticlesByCategory(items, 'avrupa').map((item) => item.id)).toEqual(['2']);
  });
});

describe('splitHeroArticle', () => {
  it('prefers the first featured article in the selected category', () => {
    const items = [
      createArticle({ id: '1', isFeatured: false }),
      createArticle({ id: '2', isFeatured: true, featuredRank: 2 }),
      createArticle({ id: '3', isFeatured: true, featuredRank: 1 }),
    ];

    const result = splitHeroArticle(items, 'almanya');

    expect(result.hero?.id).toBe('2');
    expect(result.list.map((item) => item.id)).toEqual(['1', '3']);
  });

  it('falls back to the latest article when no featured item exists', () => {
    const items = [
      createArticle({ id: '1', publishedAt: '2026-06-13T07:00:00Z' }),
      createArticle({ id: '2', publishedAt: '2026-06-13T08:00:00Z' }),
    ];

    const result = splitHeroArticle(items, 'almanya');

    expect(result.hero?.id).toBe('1');
    expect(result.list.map((item) => item.id)).toEqual(['2']);
  });

  it('returns an empty state when the category has no items', () => {
    const items = [createArticle({ id: '1', categoryKey: 'almanya' })];

    expect(splitHeroArticle(items, 'dunya')).toEqual({
      hero: null,
      list: [],
    });
  });
});

describe('WhatsApp share helpers', () => {
  it('uses backend share text when present', () => {
    const article = createArticle({ whatsAppShareText: 'Hazır paylaşım metni' });

    expect(buildWhatsAppShareText(article)).toBe('Hazır paylaşım metni');
  });

  it('builds a fallback message with summary and canonical URL', () => {
    const article = createArticle({
      title: 'Yeni düzenleme geldi',
      excerpt: 'Özet bilgi',
      slug: 'yeni-duzenleme',
      whatsAppShareText: null,
    });

    expect(buildWhatsAppShareText(article)).toBe(
      'Yeni düzenleme geldi\n\nÖzet bilgi\n\nDevamını oku:\nhttps://almanya101.de/haberler/yeni-duzenleme'
    );
  });

  it('builds a safe wa.me url', () => {
    const url = buildWhatsAppShareUrl(createArticle({ whatsAppShareText: 'Merhaba' }));

    expect(url).toBe('https://wa.me/?text=Merhaba');
  });
});
