import {
  GASTRONOMY_TYPES,
  TAMIR_TYPES,
  type Provider,
  type ProviderRow,
  type ProviderType,
} from './types';

// Normalize a raw row into the unified Provider model. Ported from web
// lib/rehber/data.ts normalizeProviders().
export function normalizeProvider(
  row: ProviderRow,
  source: 'service' | 'gastronomy'
): Provider {
  return {
    id: row.id,
    source,
    type: row.type,
    name: row.name ?? row.display_name ?? '',
    city: row.city ?? '',
    address: row.address ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    description: row.description ?? row.notes_public ?? undefined,
  };
}

export function normalizeProviders(
  rows: ProviderRow[] | null | undefined,
  source: 'service' | 'gastronomy'
): Provider[] {
  if (!rows) return [];
  return rows.map((row) => normalizeProvider(row, source));
}

/** True when a category is read from the gastronomy_providers table. */
export function isGastronomyCategory(category: ProviderType): boolean {
  return GASTRONOMY_TYPES.includes(category);
}

/** The `tamir` filter combines three repair subtypes. */
export function isTamirCategory(category: ProviderType): boolean {
  return category === 'tamir';
}

export { TAMIR_TYPES };

/** Client-side text search over normalized providers. */
export function filterProvidersByQuery(providers: Provider[], query: string): Provider[] {
  const q = query.trim().toLocaleLowerCase('tr-TR');
  if (!q) return providers;
  return providers.filter((p) =>
    [p.name, p.city, p.description, p.address]
      .filter(Boolean)
      .some((field) => String(field).toLocaleLowerCase('tr-TR').includes(q))
  );
}
