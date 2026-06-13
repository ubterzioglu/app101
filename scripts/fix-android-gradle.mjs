#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FROM = 'gradle-9.3.1-bin.zip';
const TO = 'gradle-8.13-bin.zip';

const targets = [
  resolve(ROOT, 'node_modules', '@react-native', 'gradle-plugin', 'gradle', 'wrapper', 'gradle-wrapper.properties'),
  resolve(ROOT, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties'),
];

let touched = 0;

for (const target of targets) {
  if (!existsSync(target)) continue;

  const original = readFileSync(target, 'utf8');
  if (!original.includes(FROM)) continue;

  writeFileSync(target, original.replaceAll(FROM, TO), 'utf8');
  touched += 1;
  console.log(`[fix-android-gradle] patched ${target}`);
}

if (touched === 0) {
  console.log('[fix-android-gradle] no wrapper patch needed');
}
