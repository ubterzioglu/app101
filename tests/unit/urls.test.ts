import { toMailtoUrl, toSafeExternalUrl, toPhoneUrl } from '@/lib/urls';

describe('toSafeExternalUrl', () => {
  it('accepts https urls', () => {
    expect(toSafeExternalUrl('https://almanya101.de')).toBe('https://almanya101.de/');
  });

  it('accepts http urls', () => {
    expect(toSafeExternalUrl('http://example.com/path')).toBe('http://example.com/path');
  });

  it('prefixes https for bare www domains', () => {
    expect(toSafeExternalUrl('www.example.com')).toBe('https://www.example.com/');
  });

  it('rejects javascript: scheme', () => {
    expect(toSafeExternalUrl('javascript:alert(1)')).toBeNull();
  });

  it('rejects file: scheme', () => {
    expect(toSafeExternalUrl('file:///etc/passwd')).toBeNull();
  });

  it('returns null for empty/garbage', () => {
    expect(toSafeExternalUrl('')).toBeNull();
    expect(toSafeExternalUrl(null)).toBeNull();
    expect(toSafeExternalUrl('not a url')).toBeNull();
  });
});

describe('toPhoneUrl', () => {
  it('builds tel: from a formatted number', () => {
    expect(toPhoneUrl('+49 30 1234-567')).toBe('tel:+49301234567');
  });

  it('returns null for too-short input', () => {
    expect(toPhoneUrl('12')).toBeNull();
    expect(toPhoneUrl('')).toBeNull();
    expect(toPhoneUrl(null)).toBeNull();
  });
});

describe('toMailtoUrl', () => {
  it('builds mailto: for a valid email address', () => {
    expect(toMailtoUrl('info@almanya101.de')).toBe('mailto:info@almanya101.de');
  });

  it('rejects invalid email values', () => {
    expect(toMailtoUrl('not-an-email')).toBeNull();
    expect(toMailtoUrl('')).toBeNull();
    expect(toMailtoUrl(null)).toBeNull();
  });
});
