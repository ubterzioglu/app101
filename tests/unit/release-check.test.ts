import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RELEASE_CHECK_SRC = readFileSync(
  resolve(__dirname, '../../scripts/check-play-release.mjs'),
  'utf8'
);

describe('release check script', () => {
  it('pins the Android package name, version metadata and EAS production environment rules', () => {
    expect(RELEASE_CHECK_SRC).toContain('de.almanya101.app');
    expect(RELEASE_CHECK_SRC).toContain('Android versionCode pozitif tam sayı olmalı.');
    expect(RELEASE_CHECK_SRC).toContain("environment === 'production'");
    expect(RELEASE_CHECK_SRC).toContain("buildType === 'app-bundle'");
    expect(RELEASE_CHECK_SRC).toContain("buildType === 'apk'");
    expect(RELEASE_CHECK_SRC).toContain('package.json içinde doctor scripti npx expo-doctor olmalı.');
    expect(RELEASE_CHECK_SRC).toContain('release:check komutu expo-doctor çalıştırmalı.');
  });

  it('requires the Google Play documentation bundle and hardens EAS packaging rules', () => {
    expect(RELEASE_CHECK_SRC).toContain('docs/google-play/README.md');
    expect(RELEASE_CHECK_SRC).toContain('docs/google-play/PERMISSIONS_AUDIT.md');
    expect(RELEASE_CHECK_SRC).toContain('docs/google-play/EAS_ENV_SETUP.md');
    expect(RELEASE_CHECK_SRC).toContain('.easignore içinde zorunlu pattern eksik');
    expect(RELEASE_CHECK_SRC).toContain('Store listing taslağında uzun açıklama placeholder olmamalı.');
  });
});
