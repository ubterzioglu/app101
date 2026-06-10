// Safe URL helpers. External links must be validated before opening
// (security checklist §18 / UX §17).

import * as Linking from 'expo-linking';

const SAFE_SCHEMES = new Set(['http:', 'https:']);

/**
 * Returns a normalized, openable https/http URL or null if unsafe/invalid.
 * Adds https:// when the value clearly looks like a bare domain.
 */
export function toSafeExternalUrl(value: string | null | undefined): string | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  let candidate = raw;
  if (/^www\./i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!SAFE_SCHEMES.has(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Opens an external URL in the system browser, only if it is safe. */
export async function openExternalUrl(value: string | null | undefined): Promise<boolean> {
  const safe = toSafeExternalUrl(value);
  if (!safe) return false;
  try {
    await Linking.openURL(safe);
    return true;
  } catch {
    return false;
  }
}

/** Builds a tel: URL from a phone number (digits, +, spaces, dashes only). */
export function toPhoneUrl(phone: string | null | undefined): string | null {
  const raw = String(phone ?? '').trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (cleaned.length < 3) return null;
  return `tel:${cleaned}`;
}

/** Opens the native dialer for a phone number, if valid. */
export async function openDialer(phone: string | null | undefined): Promise<boolean> {
  const url = toPhoneUrl(phone);
  if (!url) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
