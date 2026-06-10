import { z } from 'zod';

// Mirrors the server-side validation in /api/provider-submissions:
// type must be one of ALLOWED_TYPES (no gastronomy), displayName + city required.
export const SUGGESTION_ALLOWED_TYPES = [
  'doctor',
  'lawyer',
  'terapist',
  'ebe',
  'nakliyat',
  'sigorta',
  'vergi_danismani',
  'berber',
  'kuafor',
  'surucu_kursu',
  'tamirci_otomobil',
  'tamirci_tesisat',
  'tamirci_boyaci',
] as const;

export const SUGGESTION_TYPE_LABELS: Record<(typeof SUGGESTION_ALLOWED_TYPES)[number], string> = {
  doctor: 'Doktor',
  lawyer: 'Avukat',
  terapist: 'Terapist',
  ebe: 'Ebe/Hemşire',
  nakliyat: 'Nakliyat',
  sigorta: 'Sigortacı',
  vergi_danismani: 'Vergi Danışmanı',
  berber: 'Berber',
  kuafor: 'Kuaför',
  surucu_kursu: 'Sürücü Kursu',
  tamirci_otomobil: 'Otomobil Tamircisi',
  tamirci_tesisat: 'Tesisatçı',
  tamirci_boyaci: 'Boyacı',
};

export const providerSuggestionSchema = z.object({
  type: z.enum(SUGGESTION_ALLOWED_TYPES, {
    errorMap: () => ({ message: 'Geçerli bir tür seçin.' }),
  }),
  displayName: z.string().trim().min(2, 'Görünen ad zorunludur.').max(160),
  city: z.string().trim().min(2, 'Şehir zorunludur.').max(120),
  address: z.string().trim().max(240).optional().or(z.literal('')),
  phone: z.string().trim().max(60).optional().or(z.literal('')),
  website: z.string().trim().max(400).optional().or(z.literal('')),
  tagLabels: z.string().trim().max(240).optional().or(z.literal('')),
  googleMapsUrl: z.string().trim().max(400).optional().or(z.literal('')),
  note: z.string().trim().max(1200).optional().or(z.literal('')),
});

export type ProviderSuggestionForm = z.infer<typeof providerSuggestionSchema>;
