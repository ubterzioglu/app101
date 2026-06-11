#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP_JSON_PATH = resolve(ROOT, 'app.json');
const EAS_JSON_PATH = resolve(ROOT, 'eas.json');
const LINKS_PATH = resolve(ROOT, 'constants', 'external-links.ts');
const MANIFEST_PATH = resolve(ROOT, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const REQUIRED_DOCS = [
  'docs/google-play/README.md',
  'docs/google-play/PLAY_STORE_RELEASE_CHECKLIST.md',
  'docs/google-play/DATA_SAFETY_INVENTORY.md',
  'docs/google-play/BACKEND_PRIVACY_QUESTIONS.md',
  'docs/google-play/CLOSED_TEST_PLAN.md',
  'docs/google-play/STORE_LISTING_DRAFT.md',
  'docs/google-play/EXTERNAL_DEPENDENCIES.md',
  'docs/google-play/PERMISSIONS_AUDIT.md',
  'docs/google-play/EAS_ENV_SETUP.md',
];
const DANGEROUS_PERMISSIONS = new Set([
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
  'android.permission.GET_ACCOUNTS',
  'android.permission.READ_CALL_LOG',
  'android.permission.WRITE_CALL_LOG',
  'android.permission.PROCESS_OUTGOING_CALLS',
  'android.permission.READ_SMS',
  'android.permission.SEND_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.RECEIVE_MMS',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.MANAGE_EXTERNAL_STORAGE',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.BODY_SENSORS',
]);

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readText(path) {
  return readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function extractLink(key) {
  const content = readText(LINKS_PATH);
  const origin = content.match(/const WEBSITE_ORIGIN = '([^']+)'/)?.[1] ?? '';

  if (key === 'website') {
    return origin;
  }

  const inlineMatch = content.match(new RegExp(`${key}:\\s*'([^']+)'`));
  if (inlineMatch?.[1]) {
    return inlineMatch[1];
  }

  const templateMatch = content.match(new RegExp(`${key}:\\s*` + '`\\$\\{WEBSITE_ORIGIN\\}([^`]+)`'));
  if (origin && templateMatch?.[1]) {
    return `${origin}${templateMatch[1]}`;
  }

  return '';
}

function isNonPlaceholderHttpsUrl(value) {
  return /^https:\/\//.test(value) && !/[<>{}]/.test(value) && !/tbd|example/i.test(value);
}

function checkAppConfig() {
  const appConfig = readJson(APP_JSON_PATH).expo ?? {};
  const easConfig = readJson(EAS_JSON_PATH);
  const website = extractLink('website');
  const privacyPolicy = extractLink('privacyPolicy');
  const contact = extractLink('contact');

  assert(appConfig.android?.package === 'de.almanya101.app', 'Android package de.almanya101.app olmalı.');
  assert(
    easConfig.build?.production?.android?.buildType === 'app-bundle',
    'Production profili Android app-bundle üretmeli.'
  );
  assert(
    easConfig.build?.production?.environment === 'production',
    'Production profili environment=production kullanmalı.'
  );
  assert(
    easConfig.build?.preview?.android?.buildType === 'apk',
    'Preview profili Android APK üretmeli.'
  );
  assert(easConfig.cli?.appVersionSource === 'remote', 'cli.appVersionSource=remote korunmalı.');
  assert(
    easConfig.build?.production?.autoIncrement === true,
    'production.autoIncrement=true korunmalı.'
  );
  assert(isNonPlaceholderHttpsUrl(privacyPolicy), 'Gizlilik politikası URL adresi geçerli bir https URL olmalı.');
  assert(isNonPlaceholderHttpsUrl(contact), 'İletişim URL adresi geçerli bir https URL olmalı.');
  assert(isNonPlaceholderHttpsUrl(website), 'Web sitesi URL adresi geçerli bir https URL olmalı.');

  const configuredPermissions = appConfig.android?.permissions;
  if (Array.isArray(configuredPermissions)) {
    const unexpectedDangerous = configuredPermissions.filter((permission) =>
      DANGEROUS_PERMISSIONS.has(permission)
    );
    assert(
      unexpectedDangerous.length === 0,
      `app.json içinde gereksiz tehlikeli izin tanımlı: ${unexpectedDangerous.join(', ')}`
    );
  }
}

function checkDocs() {
  for (const relativePath of REQUIRED_DOCS) {
    assert(existsSync(resolve(ROOT, relativePath)), `Zorunlu release dokümanı eksik: ${relativePath}`);
  }
}

function checkGeneratedManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    warnings.push('AndroidManifest.xml henüz üretilmemiş; tehlikeli izin kontrolü prebuild sonrası tekrar çalıştırılmalı.');
    return;
  }

  const manifest = readText(MANIFEST_PATH);
  const permissions = [...manifest.matchAll(/<uses-permission[^>]+android:name="([^"]+)"[^>]*>/g)]
    .filter((match) => !match[0].includes('tools:node="remove"'))
    .map((match) => match[1]);
  const dangerousFound = permissions.filter((permission) => DANGEROUS_PERMISSIONS.has(permission));
  warn(
    dangerousFound.length === 0,
    `Generated manifest içinde gözden geçirilmesi gereken izinler var: ${dangerousFound.join(', ')}`
  );
}

function main() {
  checkAppConfig();
  checkDocs();
  checkGeneratedManifest();

  if (warnings.length > 0) {
    console.warn('\n[release:check] UYARI:\n');
    for (const warning of warnings) {
      console.warn(`  ! ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error('\n[release:check] HATA:\n');
    for (const error of errors) {
      console.error(`  ✗ ${error}`);
    }
    process.exit(1);
  }

  console.log('[release:check] OK — statik Android release kontrolleri geçti.');
}

main();
