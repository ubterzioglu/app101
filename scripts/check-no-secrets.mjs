#!/usr/bin/env node
// scripts/check-no-secrets.mjs
//
// Fails the build if any forbidden credential pattern is found in source,
// or if .secret / .env.local were accidentally staged into git.
//
// Checks:
//  1. Hardcoded `SUPABASE_SERVICE_ROLE_KEY=` in bundle-bound source.
//  2. `sb_secret_` prefix in bundle-bound files.
//  3. `.secret` accidentally added to the git index.
//  4. `.env.local` accidentally added to the git index.
//  5. Admin password / salt values exposed via an EXPO_PUBLIC_* prefix.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Directories we scan for source-level leaks.
const SCAN_DIRS = ['app', 'components', 'features', 'lib', 'constants', 'providers', 'scripts'];
const SCAN_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json']);

// This script itself legitimately mentions forbidden key names; skip it.
const SELF = resolve(ROOT, 'scripts', 'check-no-secrets.mjs');
const SYNC = resolve(ROOT, 'scripts', 'sync-local-env.mjs');

/** @type {{ pattern: RegExp, message: string }[]} */
const FORBIDDEN_PATTERNS = [
  {
    pattern: /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*['"`][^'"`]+['"`]/,
    message: 'Hardcoded SUPABASE_SERVICE_ROLE_KEY value found',
  },
  {
    pattern: /SUPABASE_SERVICE_KEY\s*[:=]\s*['"`][^'"`]+['"`]/,
    message: 'Hardcoded SUPABASE_SERVICE_KEY value found',
  },
  {
    pattern: /SUPABASE_SECRET_KEY\s*[:=]\s*['"`][^'"`]+['"`]/,
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
];

/** @type {string[]} */
const violations = [];

function walk(dir) {
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
      walk(full);
    } else if (SCAN_EXTS.has(extname(entry))) {
      scanFile(full);
    }
  }
}

function scanFile(file) {
  if (file === SELF || file === SYNC) return;
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    return;
  }
  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      violations.push(`${message} -> ${file.replace(ROOT, '.')}`);
    }
  }
}

function checkGitIndex() {
  try {
    const tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const file of tracked) {
      if (file === '.secret' || file.startsWith('.secret.') && file !== '.secret.example') {
        violations.push(`.secret file is tracked by git: ${file}`);
      }
      if (file === '.env.local' || (file.startsWith('.env') && file.endsWith('.local'))) {
        violations.push(`.env.local file is tracked by git: ${file}`);
      }
    }
  } catch {
    // Not a git repo yet — skip the index check, source scan still runs.
    console.log('[security:check] git index kontrolü atlandı (git reposu yok).');
  }
}

function main() {
  for (const dir of SCAN_DIRS) {
    const full = resolve(ROOT, dir);
    if (existsSync(full)) walk(full);
  }
  checkGitIndex();

  if (violations.length > 0) {
    console.error('\n[security:check] GÜVENLİK İHLALİ tespit edildi:\n');
    for (const v of violations) console.error(`  ✗ ${v}`);
    console.error('\nForbidden credential değerleri mobil source/bundle içine giremez.\n');
    process.exit(1);
  }

  console.log('[security:check] OK — yasak credential deseni bulunamadı.');
}

main();
