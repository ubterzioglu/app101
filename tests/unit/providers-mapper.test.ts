import {
  filterProvidersByQuery,
  isGastronomyCategory,
  isTamirCategory,
  normalizeProvider,
  TAMIR_TYPES,
} from '@/features/providers/mapper';
import type { Provider, ProviderRow } from '@/features/providers/types';

const row: ProviderRow = {
  id: 'p1',
  type: 'doctor',
  city: 'Berlin',
  status: 'active',
  created_at: '',
  updated_at: '',
  name: null,
  display_name: 'Dr. Yılmaz',
  description: null,
  notes_public: 'Türkçe konuşan',
};

describe('normalizeProvider', () => {
  it('falls back name -> display_name and description -> notes_public', () => {
    const p = normalizeProvider(row, 'service');
    expect(p.name).toBe('Dr. Yılmaz');
    expect(p.description).toBe('Türkçe konuşan');
    expect(p.source).toBe('service');
  });
});

describe('category table selection', () => {
  it('routes gastronomy categories to the gastronomy table', () => {
    expect(isGastronomyCategory('restaurant')).toBe(true);
    expect(isGastronomyCategory('market')).toBe(true);
    expect(isGastronomyCategory('doctor')).toBe(false);
  });

  it('tamir combines the three repair subtypes', () => {
    expect(isTamirCategory('tamir')).toBe(true);
    expect(TAMIR_TYPES).toEqual(['tamirci_otomobil', 'tamirci_tesisat', 'tamirci_boyaci']);
  });
});

describe('filterProvidersByQuery', () => {
  const list: Provider[] = [
    { id: '1', source: 'service', type: 'doctor', name: 'Dr. Yılmaz', city: 'Berlin' },
    { id: '2', source: 'gastronomy', type: 'restaurant', name: 'Anadolu Restoran', city: 'Köln' },
  ];

  it('matches case-insensitively across name and city (Turkish-aware)', () => {
    expect(filterProvidersByQuery(list, 'köln')).toHaveLength(1);
    expect(filterProvidersByQuery(list, 'dr.')).toHaveLength(1);
    expect(filterProvidersByQuery(list, '')).toHaveLength(2);
  });
});
