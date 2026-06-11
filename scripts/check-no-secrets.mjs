#!/usr/bin/env node
// scripts/check-no-secrets.mjs
//
// Fails the build if forbidden credential patterns or sensitive release files
// are found in tracked files or bundle-bound source.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BUNDLE_SCAN_DIRS = ['app', 'components', 'constants', 'features', 'lib', 'providers', 'scripts'];
const BUNDLE_SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json']);
const TRACKED_TEXT_EXTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.txt',
  '.yml',
  '.yaml',
  '.toml',
  '.env',
]);

const SELF = normalizePath(relative(ROOT, resolve(ROOT, 'scripts', 'check-no-secrets.mjs')));
const IGNORED_CONTENT_SCAN = new Set([
  SELF,
  'scripts/sync-local-env.mjs',
  'tests/unit/env-allowlist.test.ts',
]);

const SECRET_VALUE_PATTERN =
  /['"`]?(?!your_|example|placeholder|changeme|dummy|sample|test_|<)(?:sb_secret_[A-Za-z0-9_-]{10,}|eyJ[A-Za-z0-9._-]{20,}|[A-Za-z0-9._-]{24,})['"`]?/i;

/** @type {{ pattern: RegExp, message: string }[]} */
const CONTENT_PATTERNS = [
  {
    pattern: new RegExp(`SUPABASE_SERVICE_ROLE_KEY\\s*[:=]\\s*${SECRET_VALUE_PATTERN.source}`, 'i'),
    message: 'Hardcoded SUPABASE_SERVICE_ROLE_KEY value found',
  },
  {
    pattern: new RegExp(`SUPABASE_SERVICE_KEY\\s*[:=]\\s*${SECRET_VALUE_PATTERN.source}`, 'i'),
    message: 'Hardcoded SUPABASE_SERVICE_KEY value found',
  },
  {
    pattern: new RegExp(`SUPABASE_SECRET_KEY\\s*[:=]\\s*${SECRET_VALUE_PATTERN.source}`, 'i'),
    message: 'Hardcoded SUPABASE_SECRET_KEY value found',
  },
  {
    pattern: /sb_secret_[A-Za-z0-9_-]+/,
    message: 'Supabase secret key (sb_secret_) found in source',
  },
  {
    pattern: /EXPO_PUBLIC_[A-Z_]*(ADMIN|PASSWORD|SECRET|SERVICE_ROLE|SALT|SERVICE_KEY)/,
    message: 'Server-only value exposed via an EXPO_PUBLIC_* prefix',
  },
  {
    pattern: /-----BEGIN PRIVATE KEY-----/,
    message: 'Private key block found',
  },
  {
    pattern: /-----BEGIN RSA PRIVATE KEY-----/,
    message: 'RSA private key block found',
  },
  {
    pattern: /"type"\s*:\s*"service_account"/,
    message: 'Google service-account JSON marker found',
  },
  {
    pattern: /"private_key"\s*:/,
    message: 'Private key field found',
  },
  {
    pattern: /"private_key_id"\s*:/,
    message: 'Private key id field found',
  },
  {
    pattern: /AIza[0-9A-Za-z_-]{20,}/,
    message: 'Google API key-like value found',
  },
];

/** @type {{ pattern: RegExp, message: string }[]} */
const TRACKED_FILE_PATTERNS = [
  { pattern: /(^|\/)\.secret(\.[^/]+)?$/i, message: '.secret file is tracked by git' },
  { pattern: /(^|\/)\.env[^/]*\.local$/i, message: '.env.local file is tracked by git' },
  {
    pattern: /(^|\/)play-service-account[^/]*\.json$/i,
    message: 'Google Play service-account JSON tracked by git',
  },
  {
    pattern: /(^|\/)google-play-service-account[^/]*\.json$/i,
    message: 'Google Play service-account JSON tracked by git',
  },
  {
    pattern: /(^|\/)service-account[^/]*\.json$/i,
    message: 'Service-account JSON tracked by git',
  },
  {
    pattern: /(^|\/)[^/]*service-account-key[^/]*\.json$/i,
    message: 'Service-account key JSON tracked by git',
  },
  { pattern: /\.jks$/i, message: 'Java keystore file tracked by git' },
  { pattern: /\.keystore$/i, message: 'Keystore file tracked by git' },
  { pattern: /\.p8$/i, message: 'P8 private key tracked by git' },
  { pattern: /\.p12$/i, message: 'P12 private key tracked by git' },
  { pattern: /\.pem$/i, message: 'PEM private key tracked by git' },
];

/** @type {string[]} */
const violations = [];
const scanned = new Set();

function normalizePath(value) {
  return String(value).replace(/\\/g, '/');
}

function relativePath(file) {
  return normalizePath(relative(ROOT, file));
}

function isIgnoredContentFile(file) {
  return IGNORED_CONTENT_SCAN.has(relativePath(file));
}

function isTrackedTextFile(file) {
  const ext = extname(file).toLowerCase();
  return TRACKED_TEXT_EXTS.has(ext) || !ext;
}

function recordViolation(message, file) {
  violations.push(`${message} -> ${file}`);
}

function scanContentFile(file) {
  const rel = relativePath(file);
  if (scanned.has(rel) || isIgnoredContentFile(file)) return;
  scanned.add(rel);

  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    return;
  }

  for (const { pattern, message } of CONTENT_PATTERNS) {
    if (pattern.test(content)) {
      recordViolation(message, rel);
    }
  }
}

function walkBundleDir(dir) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }

    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === '.expo' || entry === 'dist') continue;
      walkBundleDir(full);
      continue;
    }

    if (BUNDLE_SCAN_EXTS.has(extname(entry).toLowerCase())) {
      scanContentFile(full);
    }
  }
}

function getTrackedFiles() {
  try {
    return execSync('git ls-files -z', { cwd: ROOT, encoding: 'utf8' })
      .split('\0')
      .map((line) => normalizePath(line.trim()))
      .filter(Boolean);
  } catch {
    console.log('[security:check] git index kontrolü atlandı (git reposu yok).');
    return [];
  }
}

function checkTrackedFiles(trackedFiles) {
  for (const file of trackedFiles) {
    if (file === '.secret.example') continue;

    for (const { pattern, message } of TRACKED_FILE_PATTERNS) {
      if (pattern.test(file)) {
        recordViolation(message, file);
      }
    }

    const absolutePath = resolve(ROOT, file);
    if (existsSync(absolutePath) && isTrackedTextFile(absolutePath)) {
      scanContentFile(absolutePath);
    }
  }
}

function main() {
  const trackedFiles = getTrackedFiles();
  checkTrackedFiles(trackedFiles);

  for (const dir of BUNDLE_SCAN_DIRS) {
    const absolute = resolve(ROOT, dir);
    if (existsSync(absolute)) {
      walkBundleDir(absolute);
    }
  }

  if (violations.length > 0) {
    console.error('\n[security:check] GÜVENLİK İHLALİ tespit edildi:\n');
    for (const violation of violations) {
      console.error(`  ✗ ${violation}`);
    }
    console.error('\nForbidden credential değerleri mobil source veya release paketine giremez.\n');
    process.exit(1);
  }

  console.log('[security:check] OK — yasak credential deseni bulunamadı.');
}

main();
