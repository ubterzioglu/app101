# Google Play Release Checklist

## Repo ve kalite kapıları

- [ ] `npm run verify` başarılı
- [ ] `npm run release:check` başarılı
- [ ] `npm run doctor` temiz geçiyor
- [ ] `npx expo config --type public` içinde Android package `de.almanya101.app`
- [ ] `npx expo config --type public` içinde Android versionCode pozitif tam sayı
- [ ] `preview` profili APK üretmeye devam ediyor
- [ ] `production` profili AAB üretmeye devam ediyor
- [ ] `production` profili `environment = production` kullanıyor
- [ ] `cli.appVersionSource = remote` korunuyor
- [ ] `production.autoIncrement = true` korunuyor

## Güvenlik

- [ ] `.secret` ve `.env.local` Git dışında
- [ ] Google Play service-account JSON dosyaları Git dışında
- [ ] `.easignore` içinde `.secret`, `.env.local`, service-account JSON ve sertifika kalıpları var
- [ ] `scripts/check-no-secrets.mjs` private key ve service-account sızıntılarını yakalıyor
- [ ] Mobil bundle içinde `EXPO_PUBLIC_*` altında secret değer yok
- [ ] Auth, analytics, reklam, Firebase, push notification veya gereksiz SDK eklenmedi

## Uygulama içi yayın hazırlığı

- [ ] Gizlilik, iletişim ve web sitesi URL'leri merkezî sabitten okunuyor
- [ ] Gizlilik ekranı uygulama içinde erişilebilir
- [ ] İletişim ekranı veri talebi için yönlendirme içeriyor
- [ ] Daha Fazla ekranında sürüm ve build bilgisi görünüyor
- [ ] Haber kartı ve haber detayında kaynak bilgisi kullanıcıya gösteriliyor

## Android ve mağaza yayını

- [ ] Generated manifest izinleri `PERMISSIONS_AUDIT.md` ile karşılaştırıldı
- [ ] Gereksiz izinler `android.blockedPermissions` ile bloklandı
- [ ] Target API seviyesi AAB yüklendikten sonra Play Console App Bundle Explorer'da doğrulandı
- [ ] Kapalı test için yeterli tester listesi hazır
- [ ] Mağaza listeleme metinleri ve görselleri hazır
- [ ] Gizlilik politikası ve iletişim URL'leri tarayıcıda giriş yapmadan açılıyor

## Manuel release gate

- [ ] `EXTERNAL_DEPENDENCIES.md` içindeki tüm maddeler teyit edildi
- [ ] `BACKEND_PRIVACY_QUESTIONS.md` soruları web/backend tarafından yanıtlandı
- [ ] Data Safety formu `DATA_SAFETY_INVENTORY.md` ile son kez gözden geçirildi
