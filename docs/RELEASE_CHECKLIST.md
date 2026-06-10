# Android MVP Release Checklist

almanya101 mobil uygulaması (app101) — internal APK / Play AAB öncesi son kontrol.

## Kurulum doğruluğu

- [ ] `npm install` hatasız tamamlanıyor
- [ ] `npm run env:sync` `.secret` → `.env.local` üretiyor (yalnızca 3 public değer)
- [ ] `npm run security:check` başarılı
- [ ] `.secret` ve `.env.local` Git index'te değil (`git check-ignore .secret .env.local`)

## Fonksiyonel (cihaz / emulator)

- [ ] Uygulama açılıyor, splash sonrası ana sayfa görünüyor
- [ ] Ana sayfa hızlı aksiyon ve popüler araç kartları çalışıyor
- [ ] Bottom tab gezinme (Ana Sayfa / Haberler / Rehber / Araçlar / Daha Fazla)
- [ ] Android geri butonu beklenen davranışı gösteriyor
- [ ] Haber listesi geliyor; kategori filtresi, pull-to-refresh, sonsuz kaydırma
- [ ] Haber detayı açılıyor; kaynak linki ve Paylaş çalışıyor
- [ ] Hatalı haber slug'ı "Haber bulunamadı" ekranına gidiyor
- [ ] Rehber kategori + şehir + arama filtreleri çalışıyor
- [ ] Provider detayında telefon/website aksiyonları yalnızca veri varsa görünüyor
- [ ] Hizmet önerisi formu doğrulanıyor ve gönderiliyor (online)
- [ ] İş ilanları aranabiliyor; kırık link bildirimi gönderiliyor
- [ ] Vatandaşlık testi üç modda çalışıyor (all / state / real)
- [ ] Gerçek deneme 33 soru üretiyor; timer arka plan dönüşünde bozulmuyor
- [ ] Maaş hesaplayıcı brüt→net ve net→brüt çalışıyor; beta uyarısı görünüyor
- [ ] Banka / Sigorta / Vize / Para transferi araçları sonuç üretiyor
- [ ] Tatil (TR/DE) ve StepStone ekranları veri yılını gösteriyor
- [ ] Arkadaşın Köşesi liste + detay açılıyor
- [ ] Offline durumda OfflineBanner görünüyor; cache'li içerik gösteriliyor

## Teknik

- [ ] `npm run verify` geçiyor (security:check + typecheck + jest)
- [ ] Maestro smoke testleri geçiyor (`maestro test e2e/`)
- [ ] EAS preview APK üretiliyor (`eas build -p android --profile preview`)
- [ ] APK fiziksel cihaza kuruluyor ve açılıyor
- [ ] Bundle içinde forbidden credential yok (service_role / secret / admin / salt)
- [ ] `EXPO_PUBLIC_WEB_API_BASE_URL` production domaini doğru (almanya101.de)

## Cihaz matrisi (§16.4)

- [ ] Orta segment Android cihaz
- [ ] Modern yüksek çözünürlüklü Android cihaz
- [ ] Android emulator
- [ ] Dar ekran / büyük ekran
- [ ] İnternet kapalı senaryo
- [ ] Yavaş ağ senaryosu

## Build komutları

```powershell
# Internal APK
npm run env:sync
npm run security:check
npx eas-cli@latest build --platform android --profile preview

# Production AAB
npm run env:sync
npm run security:check
npm test
npx eas-cli@latest build --platform android --profile production
```

## Bilinen sınırlar (MVP)

- Maaş hesaplayıcı `legacy` (simplified) vergi modeli kullanır — bordro seviyesi
  kesinlik iddiası yoktur (BMF PAP doğrulaması ayrı issue).
- İş ilanları statik veri kullanır.
- Yararlı belgeler tam listesi P1; MVP'de web'e yönlendirir.
- Genel kullanıcı auth, admin panel ve devuser dashboard kapsam dışı.
