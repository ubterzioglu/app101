# Repo Digest

Tarih: 2026-06-11
Repo: `app101`

## Genel Durum

- Çalışma ağacı inceleme anında temizdi (`git status --short` boş).
- Sağlık kontrolleri başarılı:
  - `npm run security:check`
  - `npm run typecheck`
  - `npm test -- --runInBand`
- Test sonucu: 11 suite geçti, 1 suite skip, 90 test geçti.

## Mimari Özeti

- Platform: Expo SDK 56 + React Native + TypeScript + Expo Router.
- Giriş noktası: `app/_layout.tsx`
- Tab navigasyonu: `app/(tabs)/_layout.tsx`
- Sağlayıcı katmanı:
  - `providers/AppProviders.tsx`
  - `providers/NetworkProvider.tsx`
- Ortak altyapı:
  - `lib/env.ts`
  - `lib/supabase.ts`
  - `lib/api-client.ts`
  - `lib/query-client.ts`

## Yapısal Gözlem

- Route katmanı ince tutulmuş.
- İş mantığı çoğunlukla `features/` altında ayrıştırılmış.
- UI bileşenleri `components/` altında toparlanmış.
- Tema ve token yapısı `theme/` altında merkezi.
- Testler özellikle saf iş mantığı ve güvenlik kontratlarına odaklı.

## Veri ve Güvenlik Sınırları

- Mobil bundle içine yalnızca üç public env değeri giriyor:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_WEB_API_BASE_URL`
- Public read işlemleri publishable key + RLS ile yapılıyor.
- Kontrollü write işlemleri doğrudan ayrıcalıklı Supabase yazımı yerine web API endpoint’lerine gidiyor:
  - `/api/provider-submissions`
  - `/api/broken-link-reports`
- Secret sızıntısına karşı iki koruma var:
  - `scripts/sync-local-env.mjs`
  - `scripts/check-no-secrets.mjs`

## Öne Çıkan Feature Alanları

- `features/news`
- `features/providers`
- `features/citizenship`
- `features/salary`
- `features/recommendations`
- `features/jobs`
- `features/corner`

## Test ve Kalite Notları

- Env allowlist davranışı test ile korunuyor.
- Provider mapper, recommendation engine, citizenship quiz, salary parity ve URL güvenliği için birim testler mevcut.
- Query cache kalıcı ve offline-first davranış düşünülmüş.

## Dikkat Notları

- Repo kuralları gereği kullanıcıya görünen metinler Türkçe kalmalı.
- WebView tabanlı yaklaşım yasak; native ekran yaklaşımı korunmalı.
- Yeni saf iş mantığı için unit test beklentisi var.
- Her anlamlı faz sonunda `npm run verify` çalıştırılmalı.

## İlk Yargı

Repo MVP aşaması için düzenli, sınırları net ve güvenlik açısından bilinçli kurulmuş. Özellikle env allowlist, read/write ayrımı ve domain mantığının `features/` altında toplanması güçlü taraflar.
