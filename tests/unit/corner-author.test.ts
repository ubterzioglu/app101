import {
  buildAuthorHref,
  mapAuthorProfileRow,
  mapPostSummaryRow,
} from '@/features/corner/mapper';
import type { CornerAuthorRow, CornerPostRow } from '@/features/corner/types';

describe('corner author helpers', () => {
  it('builds a stable author profile href', () => {
    expect(buildAuthorHref('mehmet-yazar')).toBe('/yazi-dizisi/yazar/mehmet-yazar');
  });

  it('maps an author row to a public author profile', () => {
    const row: CornerAuthorRow = {
      id: 'author-1',
      slug: 'mehmet-yazar',
      display_name: 'Mehmet Yazar',
      short_bio: 'Kısa biyografi',
      bio_content: 'Uzun biyografi',
      avatar_image_url: 'https://example.com/avatar.jpg',
      display_order: 3,
      updated_at: '2026-06-15T12:00:00Z',
    };

    expect(mapAuthorProfileRow(row)).toEqual({
      id: 'author-1',
      slug: 'mehmet-yazar',
      displayName: 'Mehmet Yazar',
      shortBio: 'Kısa biyografi',
      bioContent: 'Uzun biyografi',
      avatarImageUrl: 'https://example.com/avatar.jpg',
      displayOrder: 3,
      href: '/yazi-dizisi/yazar/mehmet-yazar',
    });
  });

  it('maps a corner post row to an author summary card', () => {
    const row: CornerPostRow = {
      id: 'post-1',
      author_id: 'author-1',
      title: 'Merhaba Dünya',
      summary: 'Özet içerik',
      content: 'Uzun içerik',
      cover_image_url: 'https://example.com/cover.jpg',
      reading_minutes: 5,
      published_at: '2026-06-15T12:00:00Z',
      created_at: '2026-06-14T12:00:00Z',
      updated_at: '2026-06-15T12:00:00Z',
    };

    expect(mapPostSummaryRow(row)).toEqual({
      id: 'post-1',
      slug: 'merhaba-dunya--post-1',
      title: 'Merhaba Dünya',
      summary: 'Özet içerik',
      coverImageUrl: 'https://example.com/cover.jpg',
      readingMinutes: 5,
      publishedAt: '2026-06-15T12:00:00Z',
      dateLabel: expect.any(String),
    });
  });
});
