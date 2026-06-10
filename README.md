# app101 — almanya101 Mobil Uygulaması

Almanya'da yaşayan veya taşınmayı planlayan Türk kullanıcılar için Android öncelikli
Expo (React Native + TypeScript) uygulaması. Haberler, Türkçe hizmet rehberi,
vatandaşlık testi, maaş hesaplayıcı (beta) ve iş ilanları gibi modülleri içerir.

Kaynak web platformu (`last101`, Next.js) yeniden çizilmez; veri modeli ve saf
TypeScript iş kuralları kontrollü biçimde yeniden kullanılır.

## Teknoloji

- Expo SDK 56, React Native 0.85, Expo Router
- TypeScript (strict)
- `@supabase/supabase-js` (public read, publishable key + RLS)
- TanStack Query + AsyncStorage persister (kalıcı cache)
- Zod (form / env doğrulama)
- Jest + jest-expo (unit test)

## Kurulum

```bash
npm install
npm run env:sync     # .secret -> .env.local (yalnızca allowlist public değerler)
npm start            # expo start
```

`.secret` dosyası repo kökünde tutulur, **asla commit edilmez**. Örnek için
`.secret.example` dosyasına bakın. Yalnızca üç public değer mobil bundle'a girer:

```
SUPABASE_URL              -> EXPO_PUBLIC_SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY  -> EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
WEB_API_BASE_URL          -> EXPO_PUBLIC_WEB_API_BASE_URL
```

`service_role`, secret key, admin şifresi ve salt değerleri mobil uygulamaya
hiçbir koşulda girmez.

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run env:sync` | `.secret` → `.env.local` (allowlist) |
| `npm run security:check` | Yasak credential taraması |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest unit testleri |
| `npm run verify` | security:check + typecheck + test |

## Güvenlik

Tüm yazma işlemleri mevcut web API endpointlerine gider; mobil istemci doğrudan
ayrıcalıklı anahtarla Supabase'e yazmaz. Detaylar için `AGENTS.md`.

## Lisans

Bkz. `LICENSE`.
