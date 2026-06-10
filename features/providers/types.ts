// Hizmet rehberi + gastronomi tipleri. Ported from web lib/rehber/types.ts.

export type ProviderType =
  // Hizmet Rehberi
  | 'doctor' | 'lawyer' | 'terapist' | 'ebe' | 'nakliyat'
  | 'sigorta' | 'vergi_danismani' | 'berber' | 'kuafor' | 'surucu_kursu'
  | 'tamirci_otomobil' | 'tamirci_tesisat' | 'tamirci_boyaci' | 'tamir'
  // Gastronomi Rehberi
  | 'restaurant' | 'market' | 'kasap' | 'cafe' | 'bakery'
  | 'all';

export type ProviderStatus = 'active' | 'pending' | 'inactive';

export interface ProviderRow {
  id: string;
  type: ProviderType;
  city: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  status: ProviderStatus;
  created_at: string;
  updated_at: string;
  name?: string | null;
  display_name?: string | null;
  description?: string | null;
  notes_public?: string | null;
  provider_tags?: { tag_id: string }[];
  gastronomy_provider_tags?: { tag_id: string }[];
}

// Normalized model shown in the UI (plan §12.4). Users never see the
// service/gastronomy table split.
export interface Provider {
  id: string;
  source: 'service' | 'gastronomy';
  type: ProviderType;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

export interface ProviderCategory {
  id: ProviderType;
  label: string;
  icon: string;
  group: 'services' | 'gastronomy';
}

export const GASTRONOMY_TYPES: ProviderType[] = ['restaurant', 'market', 'kasap', 'cafe', 'bakery'];

export const TAMIR_TYPES: ProviderType[] = ['tamirci_otomobil', 'tamirci_tesisat', 'tamirci_boyaci'];

export const PROVIDER_CATEGORIES: ProviderCategory[] = [
  { id: 'doctor', label: 'Doktor', icon: '👨‍⚕️', group: 'services' },
  { id: 'lawyer', label: 'Avukat', icon: '⚖️', group: 'services' },
  { id: 'terapist', label: 'Terapist', icon: '🧠', group: 'services' },
  { id: 'ebe', label: 'Ebe/Hemşire', icon: '👩‍⚕️', group: 'services' },
  { id: 'tamir', label: 'Tamirci', icon: '🔧', group: 'services' },
  { id: 'nakliyat', label: 'Nakliyat', icon: '🚚', group: 'services' },
  { id: 'sigorta', label: 'Sigortacı', icon: '🛡️', group: 'services' },
  { id: 'vergi_danismani', label: 'Vergi Danışmanı', icon: '📊', group: 'services' },
  { id: 'berber', label: 'Berber', icon: '✂️', group: 'services' },
  { id: 'kuafor', label: 'Kuaför', icon: '💇‍♀️', group: 'services' },
  { id: 'surucu_kursu', label: 'Sürücü Kursu', icon: '🚗', group: 'services' },
  { id: 'restaurant', label: 'Restoran', icon: '🍽️', group: 'gastronomy' },
  { id: 'cafe', label: 'Kafe', icon: '☕', group: 'gastronomy' },
  { id: 'market', label: 'Market', icon: '🛒', group: 'gastronomy' },
  { id: 'kasap', label: 'Kasap', icon: '🥩', group: 'gastronomy' },
  { id: 'bakery', label: 'Fırın/Pastane', icon: '🥐', group: 'gastronomy' },
];

export const PROVIDER_SELECT = '*';
