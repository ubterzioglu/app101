# Google Play Release Paketi

Bu klasör, `almanya101` Android uygulamasını Google Play kapalı test ve production yayınına
hazırlamak için repo içinde oluşturulan dokümanları içerir.

## İçerik

- `EAS_ENV_SETUP.md` — EAS Cloud Build için public environment değişkenleri kurulumu
- `PERMISSIONS_AUDIT.md` — generated Android manifest izin denetimi
- `DATA_SAFETY_INVENTORY.md` — Data Safety formu için kod denetimi tabanlı envanter
- `BACKEND_PRIVACY_QUESTIONS.md` — web/backend ekiplerinden doğrulanması gereken gizlilik soruları
- `EXTERNAL_DEPENDENCIES.md` — repo dışı manuel doğrulama maddeleri
- `CLOSED_TEST_PLAN.md` — kişisel Play Console hesabı için kapalı test planı
- `STORE_LISTING_DRAFT.md` — mağaza listeleme taslağı
- `PLAY_STORE_RELEASE_CHECKLIST.md` — yayın öncesi son kontrol listesi

## Repo içi komutlar

```powershell
npm run verify
npm run release:check
npm run doctor
npx expo config --type public
npx expo prebuild --platform android --clean
Select-String -Path ".\android\app\src\main\AndroidManifest.xml" -Pattern "<uses-permission"
```

## Sonraki build komutları

```powershell
eas build --platform android --profile preview
eas build --platform android --profile production
```

Notlar:

- `preview` profili APK üretir.
- `production` profili AAB üretir.
- EAS Cloud Build için `.env.local` değil, EAS Environment kullanılmalıdır.
- Generated `android/` klasörü denetim için üretildi; Git'e commit edilmemelidir.
