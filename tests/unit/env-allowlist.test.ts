import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// These tests guard the security contract of the secret pipeline:
//  - only the three public values are ever mapped into the bundle env
//  - server-only values are listed as forbidden
// They read the script source so the contract cannot silently drift.

const SYNC_SRC = readFileSync(resolve(__dirname, '../../scripts/sync-local-env.mjs'), 'utf8');
const CHECK_SRC = readFileSync(resolve(__dirname, '../../scripts/check-no-secrets.mjs'), 'utf8');

const ALLOWED_PUBLIC = [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'WEB_API_BASE_URL',
];

const EXPO_PUBLIC_TARGETS = [
  'EXPO_PUBLIC_SUPABASE_URL',
  'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'EXPO_PUBLIC_WEB_API_BASE_URL',
];

const FORBIDDEN = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_SERVICE_KEY',
  'ADMIN_PANEL_PASSWORD',
  'CORNER_ADMIN_PASSWORD',
  'DEVUSER_AUTH_SECRET',
  'IP_HASH_SALT',
  'GOOGLE_PLACES_API_KEY',
];

describe('sync-local-env allowlist', () => {
  it('maps exactly the three public values to EXPO_PUBLIC_*', () => {
    for (const key of ALLOWED_PUBLIC) {
      expect(SYNC_SRC).toContain(`${key}:`);
    }
    for (const target of EXPO_PUBLIC_TARGETS) {
      expect(SYNC_SRC).toContain(`'${target}'`);
    }
  });

  it('declares all server-only values as forbidden', () => {
    for (const key of FORBIDDEN) {
      expect(SYNC_SRC).toContain(`'${key}'`);
    }
  });

  it('never maps a forbidden value to an EXPO_PUBLIC_* target', () => {
    for (const key of FORBIDDEN) {
      expect(SYNC_SRC).not.toContain(`${key}: 'EXPO_PUBLIC`);
    }
  });
});

describe('check-no-secrets scanner', () => {
  it('detects the sb_secret_ prefix', () => {
    const pattern = /sb_secret_[A-Za-z0-9_-]+/;
    expect(pattern.test('const k = "sb_secret_abc123"')).toBe(true);
    expect(pattern.test('const k = "sb_publishable_abc123"')).toBe(false);
  });

  it('flags EXPO_PUBLIC_* exposure of server-only names', () => {
    const pattern = /EXPO_PUBLIC_[A-Z_]*(ADMIN|PASSWORD|SECRET|SERVICE_ROLE|SALT|SERVICE_KEY)/;
    expect(pattern.test('EXPO_PUBLIC_ADMIN_PANEL_PASSWORD')).toBe(true);
    expect(pattern.test('EXPO_PUBLIC_SUPABASE_URL')).toBe(false);
  });

  it('scanner source references the git index checks', () => {
    expect(CHECK_SRC).toContain('git ls-files');
    expect(CHECK_SRC).toContain('.env.local');
  });

  it('guards Google Play credential file names and private key markers', () => {
    expect(CHECK_SRC).toContain('play-service-account');
    expect(CHECK_SRC).toContain('service-account');
    expect(CHECK_SRC).toContain('BEGIN PRIVATE KEY');
    expect(CHECK_SRC).toContain('private_key_id');
  });

  it('matches real-looking Google API keys without catching placeholders', () => {
    const pattern = /AIza[0-9A-Za-z_-]{20,}/;
    expect(pattern.test('AIzaSyA0123456789abcdefghijklmn')).toBe(true);
    expect(pattern.test('AIza<DEGER>')).toBe(false);
  });

  it('does not treat placeholder secret assignments as real leaked values', () => {
    const pattern =
      /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['"`]?(?!your_|example|placeholder|changeme|dummy|sample|test_|<)(?:sb_secret_[A-Za-z0-9_-]{10,}|eyJ[A-Za-z0-9._-]{20,}|[A-Za-z0-9._-]{24,})['"`]?/i;
    expect(pattern.test('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')).toBe(false);
    expect(pattern.test('SUPABASE_SERVICE_ROLE_KEY=sb_secret_abcd1234efgh5678')).toBe(true);
  });
});
