import { supabase } from '@/lib/supabase';
import {
  isGastronomyCategory,
  isTamirCategory,
  normalizeProviders,
  TAMIR_TYPES,
} from './mapper';
import { GASTRONOMY_TYPES, type Provider, type ProviderRow, type ProviderType } from './types';

async function queryServiceProviders(type: ProviderType, city?: string): Promise<Provider[]> {
  let q = supabase
    .from('providers')
    .select('*, provider_tags(tag_id)')
    .eq('type', type)
    .eq('status', 'active');
  if (city && city !== 'all') q = q.eq('city', city);
  const { data, error } = await q;
  if (error) throw new Error('Hizmet rehberi yüklenemedi.');
  return normalizeProviders(data as ProviderRow[], 'service');
}

async function queryAllServiceProviders(city?: string): Promise<Provider[]> {
  let q = supabase.from('providers').select('*, provider_tags(tag_id)').eq('status', 'active');
  if (city && city !== 'all') q = q.eq('city', city);
  const { data, error } = await q;
  if (error) throw new Error('Hizmet rehberi yüklenemedi.');
  return normalizeProviders(data as ProviderRow[], 'service');
}

async function queryGastronomyProviders(type: ProviderType, city?: string): Promise<Provider[]> {
  let q = supabase
    .from('gastronomy_providers')
    .select('*, gastronomy_provider_tags(tag_id)')
    .eq('type', type)
    .eq('status', 'active');
  if (city && city !== 'all') q = q.eq('city', city);
  const { data, error } = await q;
  if (error) throw new Error('Gastronomi rehberi yüklenemedi.');
  return normalizeProviders(data as ProviderRow[], 'gastronomy');
}

async function queryAllGastronomyProviders(city?: string): Promise<Provider[]> {
  let q = supabase
    .from('gastronomy_providers')
    .select('*, gastronomy_provider_tags(tag_id)')
    .eq('status', 'active');
  if (city && city !== 'all') q = q.eq('city', city);
  const { data, error } = await q;
  if (error) throw new Error('Gastronomi rehberi yüklenemedi.');
  return normalizeProviders(data as ProviderRow[], 'gastronomy');
}

async function queryTamirciProviders(city?: string): Promise<Provider[]> {
  let q = supabase
    .from('providers')
    .select('*, provider_tags(tag_id)')
    .in('type', TAMIR_TYPES)
    .eq('status', 'active');
  if (city && city !== 'all') q = q.eq('city', city);
  const { data, error } = await q;
  if (error) throw new Error('Hizmet rehberi yüklenemedi.');
  return normalizeProviders(data as ProviderRow[], 'service');
}

/** Providers by category, combining service + gastronomy tables (plan §12.4). */
export async function fetchProvidersByCategory(
  category: ProviderType | 'all',
  city?: string
): Promise<Provider[]> {
  if (category === 'all') {
    const [services, gastronomy] = await Promise.all([
      queryAllServiceProviders(city),
      queryAllGastronomyProviders(city),
    ]);
    return [...services, ...gastronomy];
  }
  if (isGastronomyCategory(category)) return queryGastronomyProviders(category, city);
  if (isTamirCategory(category)) return queryTamirciProviders(city);
  return queryServiceProviders(category, city);
}

/** Distinct active cities across both tables for the city filter. */
export async function fetchAvailableCities(): Promise<string[]> {
  const [services, gastronomy] = await Promise.all([
    supabase.from('providers').select('city').eq('status', 'active').order('city'),
    supabase.from('gastronomy_providers').select('city').eq('status', 'active').order('city'),
  ]);
  if (services.error || gastronomy.error) throw new Error('Şehirler yüklenemedi.');
  const cities = [
    ...(services.data?.map((r) => r.city as string) ?? []),
    ...(gastronomy.data?.map((r) => r.city as string) ?? []),
  ];
  return [...new Set(cities)].filter(Boolean).sort();
}

/** Single provider by id; searches the service table then gastronomy. */
export async function fetchProviderById(id: string): Promise<Provider | null> {
  const svc = await supabase
    .from('providers')
    .select('*, provider_tags(tag_id)')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();
  if (svc.data) return normalizeProviders([svc.data as ProviderRow], 'service')[0] ?? null;

  const gastro = await supabase
    .from('gastronomy_providers')
    .select('*, gastronomy_provider_tags(tag_id)')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();
  if (gastro.data) return normalizeProviders([gastro.data as ProviderRow], 'gastronomy')[0] ?? null;

  return null;
}

export { GASTRONOMY_TYPES };
