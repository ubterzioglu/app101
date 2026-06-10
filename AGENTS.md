# app101 — AI Coding Agent Rules

almanya101 mobil uygulaması (Expo SDK 56 + React Native + TypeScript + Expo Router).
Android öncelikli, kontrollü mobil yeniden yazım. Kaynak web repo: `last101` (Next.js).

## Mutlak Kurallar

1. Kullanıcıya görünen tüm metinler **Türkçe** olmalıdır.
2. Uygulama **WebView tabanlı kurulmaz**. Native mobil ekranlar yazılır.
3. Kaynak web UI birebir kopyalanmaz; **iş mantığı ve veri kontratı** taşınır.
4. `.secret` dosyası repo kökündedir ve **Git'e commit edilmez**.
5. `.secret` içindeki değerlerin tamamını mobil env'e aktarmak **yasaktır**.
6. Yalnızca allowlist public değerler `.env.local` içine yazılır (`npm run env:sync`).
7. `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, admin şifreleri ve salt değerleri
   mobil source code içinde **hiçbir şekilde bulunamaz**.
8. Public read işlemleri **publishable key + RLS** ile yapılır.
9. Kontrollü write işlemleri mevcut **web API endpointlerine** gönderilir
   (`/api/provider-submissions`, `/api/broken-link-reports`).
10. Her yeni özellik **loading, error ve empty state** içermelidir.
11. Her yeni saf iş mantığı için **unit test** yazılmalıdır.
12. Her faz sonunda `npm run verify` çalıştırılmalıdır.
13. TypeScript **strict mode** korunmalıdır.
14. `any` kullanımından kaçınılmalıdır.
15. Harici linkler **güvenli şekilde doğrulanarak** açılmalıdır (`lib/urls.ts`).
16. **Android ilk önceliktir**; iOS uyumluluğunu bilerek bozacak kod yazılmaz.
17. Maaş hesaplayıcı **beta uyarısı kaldırılamaz**; BMF doğrulaması ayrı issue
    tamamlanmadan kesinlik iddiası kullanılamaz.
18. İş ilanları ekranı ilk sürümde **statik veri** kullanır.
19. Genel kullanıcı auth, admin panel ve `devuser` dashboard MVP kapsamına **eklenmez**.
20. Her anlamlı faz **ayrı commit** olmalıdır.

## Komutlar

```
npm run env:sync        # .secret -> .env.local (allowlist only)
npm run security:check  # yasak credential taraması
npm run typecheck       # tsc --noEmit
npm test                # jest
npm run verify          # security:check + typecheck + test
npm start               # expo start
```

## Mimari

- `app/` — Expo Router rotaları (tabs + stack)
- `components/ui`, `components/layout` — yeniden kullanılabilir bileşenler
- `features/*` — alan bazlı veri katmanı (api/hooks/mapper/types) ve saf engine'ler
- `lib/` — env, supabase, query-client, api-client, urls, storage
- `theme/` — colors + tokens (StyleSheet tabanlı, NativeWind yok)
- `constants/` — navigasyon, statik veri
- `providers/` — AppProviders, NetworkProvider
