# almanya101 Android Uygulaması — Google Play Yayını Öncesi Repo Hazırlık Promptu

> Bu metni `ubterzioglu/app101` reposunun kök dizininde çalışan Claude Code, Codex veya benzeri bir kodlama ajanına doğrudan ver.
>
> Amaç: mevcut çalışan uygulamayı bozmadan Google Play kişisel geliştirici hesabı üzerinden kapalı teste ve sonrasında production yayınına hazır hale getirmek.

---

## GÖREV

`app101` reposunu ayrıntılı biçimde incele ve Google Play yayını öncesi gerekli repo değişikliklerini uygula. Android önceliklidir. Mevcut çalışan davranışı koru. Gereksiz özellik, SDK, izin veya servis ekleme.

Bu çalışma yalnızca mobil repo içindir. Web sitesinde yapılması gereken fakat bu repo kapsamı dışında kalan işleri ayrı bir dokümanda `EXTERNAL_DEPENDENCIES.md` içine yaz. Web reposunu değiştirmeye çalışma.

---

## MEVCUT PROJE HAKKINDA DOĞRULANMIŞ BAŞLANGIÇ BİLGİLERİ

Çalışmaya başlamadan önce dosyaları yeniden incele ve aşağıdaki bilgileri doğrula:

- Proje Expo SDK 56, React Native, TypeScript ve Expo Router kullanıyor.
- Android paket adı: `de.almanya101.app`
- `app.json` içinde Android adaptive icon tanımları mevcut.
- `eas.json` içinde:
  - `cli.appVersionSource = remote`
  - `preview.android.buildType = apk`
  - `production.android.buildType = app-bundle`
  - `production.autoIncrement = true`
- `.secret` ve `.env*` dosyaları Git dışında tutuluyor.
- Yerel geliştirmede `scripts/sync-local-env.mjs`, `.secret` içindeki yalnızca allowlist public değerleri `.env.local` içine yazıyor:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_WEB_API_BASE_URL`
- `scripts/check-no-secrets.mjs` Supabase secret anahtar sızıntılarını tarıyor.
- Uygulama içinde aşağıdaki mevcut ekranlar ve menü girdileri bulunuyor:
  - `app/(tabs)/daha-fazla.tsx`
  - `constants/navigation.ts`
  - `app/gizlilik.tsx`
  - `app/iletisim.tsx`
  - `app/hakkimizda.tsx`
- `app/gizlilik.tsx` içinde web gizlilik politikası URL adresi şu anda doğrudan yazılmış durumda: `https://almanya101.de/gizlilik`
- `app/iletisim.tsx` içinde iletişim URL adresi şu anda doğrudan yazılmış durumda: `https://almanya101.de/iletisim`
- MVP kapsamında genel kullanıcı hesabı, reklam SDK paketi, analytics SDK paketi, push notification, kamera, mikrofon ve konum özelliği eklenmemeli.
- Public okumalar Supabase publishable key + RLS ile yapılmalı. Ayrıcalıklı Supabase anahtarı mobil bundle içine girmemeli.
- Kontrollü yazma işlemleri mevcut web API endpointlerine gitmeli:
  - `/api/provider-submissions`
  - `/api/broken-link-reports`

Mevcut dosyalara güvenerek körlemesine işlem yapma. Repo ağacını incele, mevcut uygulamayı çalıştır, testleri çalıştır ve değişiklikleri küçük adımlarla uygula.

---

## DEĞİŞMEZ KURALLAR

1. Uygulama WebView tabanlı hale getirilemez.
2. Kullanıcıya gösterilen bütün metinler Türkçe olmalıdır.
3. `de.almanya101.app` paket adı değiştirilemez.
4. Gerçek credential, private key, Google service-account JSON dosyası veya Supabase secret anahtarı commit edilemez.
5. `EXPO_PUBLIC_*` değişkenlerinin mobil bundle içinde okunabilir olduğu unutulmamalıdır. Bu prefix altında secret saklama.
6. Kullanılmayan Android izinleri eklenemez.
7. Kamera, konum, mikrofon, rehber, SMS, arama kaydı, dosya sistemi, reklam, analytics, Firebase veya push notification entegrasyonu bu görev kapsamında eklenemez.
8. Genel kullanıcı auth sistemi eklenemez. Kullanıcı hesabı oluşturma özelliği eklenirse Google Play hesap silme kuralları da zorunlu hale gelir; bu görevde auth ekleme.
9. Maaş hesaplayıcı üzerindeki beta ve bilgilendirme uyarıları kaldırılamaz.
10. Haber modülü gizlenemez; ancak uygulama yalnızca haber uygulaması gibi yeniden konumlandırılamaz.
11. Her anlamlı faz sonunda `npm run verify` çalıştır.
12. `/android` ve `/ios` generated klasörlerini commit etme.
13. Yapamadığın veya doğrulayamadığın maddeleri gizleme; sonuç raporunda açıkça yaz.

---

# FAZ 0 — BAŞLANGIÇ DENETİMİ

Önce aşağıdaki komutları çalıştır:

```powershell
npm install
npm run verify
npx expo-doctor
npx expo config --type public
```

Ardından repo ağacını incele:

- Router yapısı
- Mevcut ekranlar
- `package.json`
- `app.json`
- `eas.json`
- `.gitignore`
- `.secret.example`
- `scripts/sync-local-env.mjs`
- `scripts/check-no-secrets.mjs`
- `lib/env.ts`
- `lib/urls.ts`
- `lib/api-client.ts`
- `lib/supabase.ts`
- Haber modülü içindeki source/publisher gösterimi
- Test klasörleri

Başlangıçta hata varsa önce ayrı başlık altında raporla. İlgisiz refactor yapma.

---

# FAZ 1 — EAS CLOUD BUILD ORTAMINI TAMAMLA

## 1.1 `eas.json` ortam eşlemesini ekle

Mevcut profil davranışını koruyarak EAS Environment eşlemelerini ekle:

```json
{
  "build": {
    "development": {
      "environment": "development"
    },
    "preview": {
      "environment": "preview"
    },
    "production": {
      "environment": "production"
    }
  }
}
```

Mevcut alanları silme:

- `developmentClient`
- `distribution`
- `preview.android.buildType = apk`
- `production.android.buildType = app-bundle`
- `production.autoIncrement = true`
- `cli.appVersionSource = remote`

Amaç: `.env.local` Git dışında olduğu için EAS cloud build sırasında gerekli public değerlerin EAS Environment üzerinden güvenilir biçimde sağlanması.

## 1.2 EAS environment kurulum dokümanı oluştur

Yeni dosya:

```text
docs/google-play/EAS_ENV_SETUP.md
```

Bu dokümanda gerçek değer yazmadan aşağıdaki üç public değişkenin `development`, `preview` ve `production` ortamları için nasıl oluşturulacağını PowerShell komutlarıyla anlat:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
EXPO_PUBLIC_WEB_API_BASE_URL
```

Örnek komut biçimi:

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<DEGER>" --environment production --visibility plaintext
```

Dokümana şu açıklamayı açıkça ekle:

- Bu üç değişken client bundle içine gireceği için teknik olarak public kabul edilir.
- Bunların içine service-role, private key, admin şifresi veya salt koyulamaz.
- `.secret` yerel geliştirme içindir; EAS cloud build için EAS Environment kullanılmalıdır.

---

# FAZ 2 — GOOGLE PLAY CREDENTIAL SIZINTISINA KARŞI KORUMA

## 2.1 `.gitignore` dosyasını genişlet

Aşağıdaki kalıpları ekle:

```gitignore
# Google Play / Google Cloud service-account credentials
play-service-account*.json
google-play-service-account*.json
service-account*.json
*service-account-key*.json

# Generated reports and coverage
coverage/
```

Genel olarak bütün JSON dosyalarını ignore etme. Uygulamanın ihtiyaç duyduğu normal JSON dosyaları commit edilebilir olmalıdır.

## 2.2 `.easignore` oluştur

Repo kökünde `.easignore` yoksa oluştur.

Kurallar:

- Önce mevcut `.gitignore` içeriğini eksiksiz kopyala.
- EAS Build sunucusuna gönderilmesi gerekmeyen aşağıdaki dizinleri ayrıca ignore et:

```gitignore
/docs
/coverage
```

- `.secret`, `.env.local`, service-account JSON dosyaları ve sertifika dosyaları hiçbir koşulda EAS upload paketine girmemeli.
- `.easignore` oluştururken `.gitignore` kurallarını eksik bırakma. `.easignore` mevcutsa EAS CLI onu `.gitignore` yerine öncelikli olarak kullanır.

## 2.3 `scripts/check-no-secrets.mjs` taramasını güçlendir

Mevcut Supabase kontrollerini koru. Aşağıdaki yeni kontrolleri ekle:

### Takip edilen hassas dosya adı kontrolleri

`git ls-files` çıktısı içinde aşağıdaki kalıplardan biri görülürse build fail olmalı:

```text
play-service-account*.json
google-play-service-account*.json
service-account*.json
*service-account-key*.json
*.jks
*.keystore
*.p8
*.p12
*.pem
```

`.secret.example` gibi yalnızca boş örnek değerler içeren mevcut sample dosyaları korunabilir.

### İçerik tabanlı credential kontrolleri

Tracked veya bundle-bound text dosyalarında aşağıdaki kalıpları ara:

```text
-----BEGIN PRIVATE KEY-----
-----BEGIN RSA PRIVATE KEY-----
"type": "service_account"
"private_key":
"private_key_id":
AIza...
```

`AIza...` için yalnızca gerçek Google API key yapısına benzeyen uzun değerleri yakala; doküman içindeki `<DEGER>` gibi placeholder metinlerde false-positive üretme.

### Script davranışı

- Gerçek credential değerini terminale yazdırma.
- Yalnızca dosya yolunu ve ihlal tipini göster.
- Script kendi içindeki regex açıklamalarını ihlal gibi görmemeli.
- Gerekirse açık bir ignore listesi kullan.

## 2.4 Release güvenlik testi ekle

`package.json` içine aşağıdaki scripti ekle veya eşdeğerini oluştur:

```json
"release:check": "npm run verify && node scripts/check-play-release.mjs"
```

Yeni dosya:

```text
scripts/check-play-release.mjs
```

Bu script en az aşağıdaki statik kontrolleri yapmalı:

- `app.json` içindeki Android package tam olarak `de.almanya101.app` olmalı.
- `eas.json` production profili `app-bundle` üretmeli.
- `eas.json` production profili `environment = production` kullanmalı.
- Preview profili APK üretmeli.
- `cli.appVersionSource = remote` korunmalı.
- `production.autoIncrement = true` korunmalı.
- Gizlilik politikası URL adresi `https://` ile başlamalı ve placeholder olmamalı.
- İletişim URL adresi `https://` ile başlamalı ve placeholder olmamalı.
- Web sitesi URL adresi `https://` ile başlamalı.
- Açıkça tanımlanmış gereksiz tehlikeli Android izinleri varsa hata veya açıklayıcı uyarı üretmeli.
- Google Play doküman klasöründeki zorunlu release dokümanları mevcut olmalı.

Script network bağlantısı gerektirmeden çalışabilmeli. URL adreslerinin gerçekten yayında olup olmadığını dokümanda manuel kontrol maddesi olarak bırak.

---

# FAZ 3 — DIŞ BAĞLANTILARI TEK MERKEZDE TOPLA

## 3.1 Merkezi sabit dosyası oluştur

Yeni dosya:

```text
constants/external-links.ts
```

Buraya aşağıdaki public bağlantıları taşı:

```ts
export const EXTERNAL_LINKS = {
  website: 'https://almanya101.de',
  privacyPolicy: 'https://almanya101.de/gizlilik',
  contact: 'https://almanya101.de/iletisim',
} as const;
```

Kurallar:

- Mevcut URL adreslerini merkezi sabit üzerinden kullan.
- Aynı URL adresini ekranların içine tekrar tekrar hard-code etme.
- URL adreslerinin gerçekten yayında olduğu repo içinden kesin olarak doğrulanamıyorsa `docs/google-play/EXTERNAL_DEPENDENCIES.md` içine manuel kontrol maddesi yaz.
- URL yerine uydurma bir yeni endpoint üretme.

## 3.2 Mevcut ekranları güncelle

Aşağıdaki dosyaları merkezi sabiti kullanacak şekilde güncelle:

```text
constants/navigation.ts
app/gizlilik.tsx
app/iletisim.tsx
app/hakkimizda.tsx
```

Mevcut UI yapısını koru.

## 3.3 İletişim bilgisi için release gate oluştur

Google Play mağaza listelemesinde kullanılacak destek e-postası henüz repo içinde doğrulanmış değilse uydurma e-posta kullanma.

Yeni dosya oluştur:

```text
docs/google-play/EXTERNAL_DEPENDENCIES.md
```

Bu dosyada aşağıdaki alanları manuel tamamlanacak biçimde listele:

```text
[ ] Gizlilik politikası URL adresi tarayıcıda giriş yapmadan açılıyor mu?
[ ] İletişim sayfası URL adresi tarayıcıda giriş yapmadan açılıyor mu?
[ ] Google Play mağaza listelemesi için kullanılacak destek e-postası belirlendi mi?
[ ] Destek e-postasına gelen mesajlar düzenli kontrol ediliyor mu?
[ ] Haberlerde orijinal yayıncı veya kaynak kullanıcıya gösteriliyor mu?
[ ] Backend form verilerinin saklama ve silme kuralları doğrulandı mı?
```

---

# FAZ 4 — UYGULAMA İÇİ GİZLİLİK VE HAKKIMIZDA EKRANLARINI YAYIN KALİTESİNE GETİR

## 4.1 Mevcut gizlilik ekranını koru ve iyileştir

`app/gizlilik.tsx` zaten mevcut. Sıfırdan ikinci bir ekran oluşturma.

İçeriği sade, doğru ve yayın kalitesinde düzenle. Kod denetimi sonucunda doğrulanabiliyorsa aşağıdaki bilgileri açıkça belirt:

- Uygulama içerik göstermek için herkese açık verileri okur.
- Kullanıcı hizmet sağlayıcı önerisi gönderirse formdaki bilgiler değerlendirme amacıyla almanya101 sunucularına iletilir.
- Kullanıcı kırık bağlantı bildirimi gönderirse bildirim içeriği almanya101 sunucularına iletilir.
- İlk sürümde genel kullanıcı hesabı bulunmaz.
- İlk sürümde reklam SDK paketi bulunmaz.
- İlk sürümde kullanıcı takibi amacıyla analytics SDK paketi bulunmaz.
- Ayrıntılı politika için web gizlilik sayfasına bağlantı bulunur.
- İletişim ve veri silme talepleri için iletişim sayfasına ulaşılabilir.

Backend davranışını görmeden kesin iddiada bulunma. IP loglama, saklama süresi veya üçüncü taraf paylaşımı doğrulanamıyorsa uygulama metninde kesin ifade kullanma; dokümana `TBD` olarak yaz.

## 4.2 İletişim ekranını iyileştir

`app/iletisim.tsx` mevcut. Web iletişim sayfasına ulaşım korunmalı.

Doğrulanmış destek e-postası daha sonra sağlanırsa merkezi sabit üzerinden doğrudan e-posta yazma butonu eklenebilmesi için uygun yapı bırak. E-posta adresi doğrulanmadan rastgele adres ekleme.

## 4.3 Sürüm ve build numarasını göster

Tester geri bildirimlerini kolaylaştırmak için `app/(tabs)/daha-fazla.tsx` ekranında:

- Kullanıcıya görünen app version
- Android build version / versionCode

bilgisini göster.

Bunun için gerekiyorsa Expo uyumlu şekilde:

```powershell
npx expo install expo-application
```

kullan.

`expo-application` ile native app version ve native build version değerlerini oku. Mevcut görünüm düzenini bozmadan örneğin şu biçimde göster:

```text
Uygulama sürümü 1.0.0 (Build 1)
```

Web platformunda değer yoksa kontrollü fallback kullan.

---

# FAZ 5 — ANDROID İZİN DENETİMİ

## 5.1 Generated manifest üret

Aşağıdaki komutları çalıştır:

```powershell
npx expo prebuild --platform android --clean
Select-String -Path ".\android\app\src\main\AndroidManifest.xml" -Pattern "<uses-permission"
```

Generated `/android` klasörünü commit etme.

## 5.2 İzin envanteri oluştur

Yeni dosya:

```text
docs/google-play/PERMISSIONS_AUDIT.md
```

Tablo biçimi:

| Permission | Kaynak paket veya neden | Uygulamada gerçekten gerekli mi? | Data Safety etkisi | Aksiyon |
|---|---|---:|---|---|

Kurallar:

- Manifestte bulunan bütün izinleri listele.
- Her izin için kaynağı araştır.
- Gereksiz izin varsa `app.json > expo.android.blockedPermissions` ile engelle.
- Körlemesine izin engelleme.
- Ağ erişimi gibi uygulamanın çalışması için gerekli izinleri yanlışlıkla kaldırma.
- Kamera, mikrofon, konum, rehber, SMS, arama kaydı veya depolama izni görünürse özellikle açıklama ve aksiyon üret.
- Sonuçları dokümana yaz.

## 5.3 Target API doğrulaması

Google Play yeni uygulamalar için Android 15 / API 35 veya üzerini kabul ediyor. Expo generated native proje ve EAS AAB sonucunda hedef API seviyesini doğrula.

- Expo config sonucunu incele.
- Generated Gradle dosyalarını incele.
- Yerel olarak kesin doğrulama mümkün değilse dokümana AAB yüklemesinden sonra Play Console App Bundle Explorer içinde kontrol edilmesi gereken release gate olarak ekle.

---

# FAZ 6 — GOOGLE PLAY RELEASE DOKÜMANLARINI OLUŞTUR

Aşağıdaki dosyaları oluştur:

```text
docs/google-play/README.md
docs/google-play/PLAY_STORE_RELEASE_CHECKLIST.md
docs/google-play/DATA_SAFETY_INVENTORY.md
docs/google-play/BACKEND_PRIVACY_QUESTIONS.md
docs/google-play/CLOSED_TEST_PLAN.md
docs/google-play/STORE_LISTING_DRAFT.md
docs/google-play/EXTERNAL_DEPENDENCIES.md
docs/google-play/PERMISSIONS_AUDIT.md
docs/google-play/EAS_ENV_SETUP.md
```

## 6.1 `DATA_SAFETY_INVENTORY.md`

Şu veri akışlarını en azından listele:

### Public Supabase read

- Amaç: halka açık içerikleri göstermek
- Kimlik doğrulama: publishable key + RLS
- Kullanıcıdan alınan kişisel veri: kod denetimi ile doğrula

### Hizmet sağlayıcı önerisi

Endpoint:

```text
/api/provider-submissions
```

Alanlar:

```text
type
displayName
city
address
phone
website
tagLabels
googleMapsUrl
note
```

### Kırık bağlantı bildirimi

Endpoint:

```text
/api/broken-link-reports
```

Alanlar:

```text
agencyId
agencyName
reportText
```

Tabloda şu sütunlar bulunmalı:

| Akış | Alan | Cihaz dışına gönderiliyor mu? | Saklanıyor mu? | Amaç | Üçüncü taraf paylaşımı | Data Safety kararı | Doğrulama durumu |
|---|---|---:|---:|---|---|---|---|

Backend bilinmiyorsa tahmin etme; `TBD — web backend doğrulanmalı` yaz.

Ayrıca şu başlıkları ekle:

- SDK envanteri
- Android permission envanteri bağlantısı
- IP logları
- Hosting logları
- Saklama süreleri
- Silme talebi kanalı
- Gelecekte auth eklenirse hesap silme zorunluluğu
- Gelecekte analytics, crash reporting, reklam veya push notification eklenirse Data Safety formunun yeniden gözden geçirilmesi gerektiği

## 6.2 `BACKEND_PRIVACY_QUESTIONS.md`

Aşağıdaki soruları checklist olarak ekle:

```text
[ ] Provider suggestion kayıtları hangi tabloda saklanıyor?
[ ] Broken-link report kayıtları hangi tabloda saklanıyor?
[ ] API veya hosting katmanında IP adresi loglanıyor mu?
[ ] Request header bilgileri loglanıyor mu?
[ ] Form kayıtları ne kadar süre saklanıyor?
[ ] Silme talebi geldiğinde hangi yöntemle siliniyor?
[ ] Veriler üçüncü taraf servis sağlayıcılarla paylaşılıyor mu?
[ ] Supabase bölgesi ve hosting bölgesi nedir?
[ ] Haber kaynaklarının orijinal yayıncı bilgisi kullanıcıya gösteriliyor mu?
[ ] İleride analytics, reklam, crash-reporting veya push SDK paketi eklenecek mi?
```

## 6.3 `CLOSED_TEST_PLAN.md`

Kişisel Play Console hesabı için test planı oluştur:

- Internal test önerisi
- Closed test zorunluluğu
- Minimum 12 opted-in tester
- En az 14 gün kesintisiz opted-in kalma şartı
- Güvenli marj için 15–20 tester önerisi
- Tester senaryoları:
  - Ana sayfa
  - Haberler
  - Haber kaynak bağlantısı
  - Türkçe hizmet rehberi
  - Hizmet sağlayıcı önerme
  - Kırık bağlantı bildirme
  - Vatandaşlık testi
  - Maaş hesaplayıcı beta uyarısı
  - İş ilanları
  - Harici link açma
  - Offline davranış
  - Android geri tuşu
  - Farklı ekran boyutları
- Geri bildirim tablosu:

| Tarih | Tester | Cihaz | Android sürümü | App version | Build | Senaryo | Sonuç | Hata | Aksiyon |
|---|---|---|---|---|---|---|---|---|---|

## 6.4 `STORE_LISTING_DRAFT.md`

Aşağıdaki başlıkları placeholder ile oluştur:

- Uygulama adı: `almanya101`
- Önerilen kategori kararı: `Lifestyle` seçeneğini değerlendir; uygulama yalnızca haber uygulaması değildir.
- Default language: Türkçe
- Free / paid: karar alanı
- Destek e-postası: `TBD`
- Web sitesi: `https://almanya101.de`
- Gizlilik politikası: `https://almanya101.de/gizlilik`
- Kısa açıklama: 80 karakter sınırı
- Uzun açıklama: 4000 karakter sınırı
- İkon: 512 × 512 PNG
- Feature graphic: 1024 × 500 PNG veya JPEG
- Telefon screenshot önerisi: en az 4 adet 1080 × 1920 portrait
- Alt text alanları
- Release notes taslağı

Kısa açıklamada emoji, gereksiz büyük harf, “en iyi”, “1 numara”, “hemen indir” gibi ifadeler kullanma.

## 6.5 Haber modülü kontrolü

Haber ekranlarını incele. Her üçüncü taraf haber içeriğinde kullanıcıya mümkün olduğunca:

- Orijinal yayıncı veya kaynak adı
- Tarih
- Kaynak bağlantısı

sunulduğunu doğrula.

Eksikse mevcut veri kontratını bozmayacak şekilde tamamla veya veri kaynağı uygun değilse dokümana açık TODO yaz.

Uygulama genel yaşam platformu olarak yayınlanacaksa `Lifestyle` kategorisi değerlendirilebilir. Ancak Play Console veya mağaza metninde uygulama “News” ya da “Magazine” olarak sınıflandırılırsa Google Play News & Magazine self-declaration ve kaynak gösterme gerekliliklerinin uygulanacağını dokümana yaz.

---

# FAZ 7 — RELEASE KONTROLÜ VE SON RAPOR

Tüm değişikliklerden sonra aşağıdaki komutları çalıştır:

```powershell
npm run verify
npm run release:check
npx expo-doctor
npx expo config --type public
npx expo prebuild --platform android --clean
Select-String -Path ".\android\app\src\main\AndroidManifest.xml" -Pattern "<uses-permission"
```

Generated `/android` klasörünü kaldır veya untracked bırak; commit etme.

EAS hesabı veya credential yoksa build çalıştırmaya zorlama. Kullanıcının daha sonra çalıştırması için aşağıdaki komutları sonuç raporuna ekle:

```powershell
eas build --platform android --profile preview
eas build --platform android --profile production
```

İlk Google Play yüklemesi manuel yapılacaktır. Service-account JSON dosyası yalnızca daha sonraki otomatik EAS Submit akışı için kullanılmalıdır ve GitHub reposuna commit edilmemelidir.

---

# BEKLENEN SONUÇ RAPORU

Çalışma sonunda Türkçe rapor ver. Raporda şu başlıklar olsun:

1. Değiştirilen dosyalar
2. Eklenen dosyalar
3. Güvenlik iyileştirmeleri
4. EAS cloud build iyileştirmeleri
5. Android permission audit sonucu
6. Data Safety için doğrulanmış bilgiler
7. Backend veya web repo tarafında manuel doğrulanması gereken maddeler
8. Çalıştırılan komutlar ve sonuçları
9. Commit önerileri
10. Kullanıcının Play Console üzerinde yapacağı sonraki işlemler

Her anlamlı fazı ayrı commit olarak hazırla. Commit mesajları kısa ve anlaşılır olsun. Örnek:

```text
chore: configure EAS environments for Android release
security: block Google Play credential leaks
refactor: centralize external legal links
docs: add Google Play release readiness package
chore: add static Play release checks
```

---

# KABUL KRİTERLERİ

Aşağıdaki maddeler sağlanmadan işi tamamlanmış sayma:

```text
[ ] npm run verify başarılı
[ ] npm run release:check başarılı
[ ] npx expo-doctor kritik hata vermiyor
[ ] Android package de.almanya101.app olarak korunmuş
[ ] Preview APK, production AAB mantığı korunmuş
[ ] Production profili EAS production environment kullanıyor
[ ] .secret ve .env.local Git ve EAS upload dışında
[ ] Google Play service-account JSON dosyaları Git ve EAS upload dışında
[ ] check-no-secrets Google private key sızıntısını yakalıyor
[ ] Gizlilik, iletişim ve web URL adresleri tek merkezden okunuyor
[ ] Uygulama içinde gizlilik ekranı erişilebilir
[ ] Uygulama içinde sürüm ve build bilgisi görülebiliyor
[ ] Permissions audit dokümanı oluşturulmuş
[ ] Data Safety inventory oluşturulmuş
[ ] Backend privacy soruları açıkça listelenmiş
[ ] Closed test planı oluşturulmuş
[ ] Store listing taslağı oluşturulmuş
[ ] Auth, analytics, reklam, push, Firebase veya gereksiz izin eklenmemiş
[ ] Generated android ve ios klasörleri commit edilmemiş
```

---

## RESMİ REFERANS KAYNAKLAR

- Expo EAS environment variables: https://docs.expo.dev/eas/environment-variables/
- Expo environment variables güvenliği: https://docs.expo.dev/guides/environment-variables/
- Expo Android Google Play submit: https://docs.expo.dev/submit/android/
- Expo Android APK ve AAB farkı: https://docs.expo.dev/build-reference/apk/
- Expo permissions: https://docs.expo.dev/guides/permissions/
- Expo app version management: https://docs.expo.dev/build-reference/app-versions/
- Expo `.easignore`: https://docs.expo.dev/build-reference/easignore/
- Google Play app setup: https://support.google.com/googleplay/android-developer/answer/9859152?hl=en
- Google Play review hazırlığı: https://support.google.com/googleplay/android-developer/answer/9859455?hl=en
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- Google Play personal account testing: https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- Google Play target API requirement: https://developer.android.com/google/play/requirements/target-sdk
- Google Play preview assets: https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
- Google Play News & Magazines: https://support.google.com/googleplay/android-developer/answer/9935326?hl=en
