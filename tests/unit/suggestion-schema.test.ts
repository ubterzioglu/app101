import { providerSuggestionSchema } from '@/features/providers/suggestion-schema';

describe('providerSuggestionSchema', () => {
  it('accepts a valid minimal payload', () => {
    const r = providerSuggestionSchema.safeParse({
      type: 'doctor',
      displayName: 'Dr. Yılmaz',
      city: 'Berlin',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a disallowed type (gastronomy not allowed)', () => {
    const r = providerSuggestionSchema.safeParse({
      type: 'restaurant',
      displayName: 'Anadolu',
      city: 'Köln',
    });
    expect(r.success).toBe(false);
  });

  it('requires displayName and city', () => {
    const r = providerSuggestionSchema.safeParse({ type: 'lawyer', displayName: 'A', city: '' });
    expect(r.success).toBe(false);
  });

  it('allows optional fields to be empty strings', () => {
    const r = providerSuggestionSchema.safeParse({
      type: 'berber',
      displayName: 'Salon Star',
      city: 'Hamburg',
      address: '',
      phone: '',
      website: '',
      note: '',
    });
    expect(r.success).toBe(true);
  });
});
