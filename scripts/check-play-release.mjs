#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP_JSON_PATH = resolve(ROOT, 'app.json');
const EAS_JSON_PATH = resolve(ROOT, 'eas.json');
const PACKAGE_JSON_PATH = resolve(ROOT, 'package.json');
const LINKS_PATH = resolve(ROOT, 'constants', 'external-links.ts');
const EASIGNORE_PATH = resolve(ROOT, '.easignore');
const STORE_LISTING_DRAFT_PATH = resolve(ROOT, 'docs', 'google-play', 'STORE_LISTING_DRAFT.md');
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
const REQUIRED_EASIGNORE_PATTERNS = [
  '.secret',
  '.env.*',
  '*.jks',
  '*.keystore',
  'play-service-account*.json',
  'google-play-service-account*.json',
  'service-account*.json',
  '*service-account-key*.json',
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
  const packageJson = readJson(PACKAGE_JSON_PATH);
  const website = extractLink('website');
  const privacyPolicy = extractLink('privacyPolicy');
  const contact = extractLink('contact');
  const versionCode = appConfig.android?.versionCode;
  const adaptiveIcon = appConfig.android?.adaptiveIcon ?? {};

  assert(appConfig.android?.package === 'de.almanya101.app', 'Android package de.almanya101.app olmalı.');
  assert(Number.isInteger(versionCode) && versionCode > 0, 'Android versionCode pozitif tam sayı olmalı.');
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
  assert(
    packageJson.scripts?.doctor === 'npx expo-doctor',
    'package.json içinde doctor scripti npx expo-doctor olmalı.'
  );
  assert(
    typeof packageJson.scripts?.['release:check'] === 'string' &&
      packageJson.scripts['release:check'].includes('npm run doctor'),
    'release:check komutu expo-doctor çalıştırmalı.'
  );
  assert(isNonPlaceholderHttpsUrl(privacyPolicy), 'Gizlilik politikası URL adresi geçerli bir https URL olmalı.');
  assert(isNonPlaceholderHttpsUrl(contact), 'İletişim URL adresi geçerli bir https URL olmalı.');
  assert(isNonPlaceholderHttpsUrl(website), 'Web sitesi URL adresi geçerli bir https URL olmalı.');
  assert(existsSync(resolve(ROOT, appConfig.icon ?? '')), 'Uygulama icon dosyası mevcut olmalı.');
  assert(
    existsSync(resolve(ROOT, adaptiveIcon.foregroundImage ?? '')),
    'Android adaptive icon foreground dosyası mevcut olmalı.'
  );
  assert(
    existsSync(resolve(ROOT, adaptiveIcon.backgroundImage ?? '')),
    'Android adaptive icon background dosyası mevcut olmalı.'
  );
  assert(
    existsSync(resolve(ROOT, adaptiveIcon.monochromeImage ?? '')),
    'Android adaptive icon monochrome dosyası mevcut olmalı.'
  );

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

function checkEasIgnore() {
  assert(existsSync(EASIGNORE_PATH), '.easignore dosyası mevcut olmalı.');
  const easignore = readText(EASIGNORE_PATH);

  for (const pattern of REQUIRED_EASIGNORE_PATTERNS) {
    assert(easignore.includes(pattern), `.easignore içinde zorunlu pattern eksik: ${pattern}`);
  }
}

function checkStoreListingDraft() {
  assert(existsSync(STORE_LISTING_DRAFT_PATH), 'Store listing taslağı mevcut olmalı.');
  const draft = readText(STORE_LISTING_DRAFT_PATH);

  assert(/Free \/ paid:\s*`Free`/i.test(draft), 'Store listing taslağında Free / paid alanı Free olmalı.');
  assert(
    /Destek e-postası:\s*`[^`@]+@[^`]+\.[^`]+`/i.test(draft) || /Destek e-postası:\s*`TBD`/i.test(draft),
    'Store listing taslağında destek e-postası alanı bulunmalı.'
  );
  assert(
    !/TBD\s*—\s*son mağaza metni hazırlanacak/i.test(draft),
    'Store listing taslağında uzun açıklama placeholder olmamalı.'
  );
  warn(!/Destek e-postası:\s*`TBD`/i.test(draft), 'Store listing taslağında destek e-postası hâlâ TBD.');
  warn(!/Alt text alanları:\s*`TBD`/i.test(draft), 'Store listing taslağında alt text alanları hâlâ TBD.');
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
  checkEasIgnore();
  checkStoreListingDraft();
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
