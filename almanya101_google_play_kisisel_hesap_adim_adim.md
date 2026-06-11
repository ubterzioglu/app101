# almanya101 Android Uygulaması — Google Play Kişisel Hesap Başvuru ve Yayın Rehberi

**Proje:** `ubterzioglu/app101`  
**Android paket adı:** `de.almanya101.app`  
**Hesap tipi:** Google Play Console kişisel geliştirici hesabı  
**Hazırlanma tarihi:** 11 Haziran 2026

---

## Bu rehberin amacı

Bu dosya Google Play Console üzerinde kişisel geliştirici hesabı açarak almanya101 Android uygulamasını önce test kullanıcılarına, daha sonra production ortamına yayınlamak için izlemen gereken sırayı açıklar.

Uygulama Expo / React Native tabanlıdır. Google Play için production çıktısı APK değil, **AAB** dosyası olacaktır. APK dosyası yalnızca telefona doğrudan kurulum ve hızlı test amacıyla kullanılacaktır.

---

# 1. Başlamadan önce hazırla

Aşağıdaki maddeleri kayıt sürecine başlamadan önce hazır et:

| Gerekli bilgi veya araç | Açıklama |
|---|---|
| Google hesabı | Kişisel Play Console hesabının sahibi olacak Google hesabı |
| Resmî kimlik belgesi | Google Payments profilin doğrulanmamışsa istenebilir |
| Yasal ad ve adres | Google Payments profiliyle uyumlu olmalı |
| İletişim telefonu | Google iletişimi için SMS veya sesli arama ile doğrulanabilir |
| Geliştirici e-postası | Google Play mağazasında kullanıcıların görebileceği doğrulanmış e-posta |
| Fiziksel Android telefon | Root edilmemiş ve en az Android 10 çalıştıran telefon |
| Web sitesi | `https://almanya101.de` |
| Gizlilik politikası sayfası | `https://almanya101.de/gizlilik` adresinin giriş gerektirmeden açıldığını kontrol et |
| İletişim sayfası | `https://almanya101.de/iletisim` adresinin giriş gerektirmeden açıldığını kontrol et |
| Test kullanıcıları | En az 12 zorunlu; güvenli marj için 15–20 kişi önerilir |
| Test kullanıcılarının e-postaları | Gmail veya Google Workspace hesabı olmalı |
| Expo hesabı | EAS Build için gerekli |

## Önemli kişisel hesap kuralı

13 Kasım 2023 sonrasında açılan yeni kişisel geliştirici hesaplarında production erişimi hemen açılmaz. Önce uygulamayı **kapalı testte en az 12 opted-in tester ile en az 14 gün kesintisiz** test etmen gerekir.

Burada yalnızca e-posta eklemek yeterli değildir. Tester, Google Play opt-in bağlantısını açmalı, teste katılmalı ve en az 14 gün boyunca testten çıkmamalıdır.

Bu nedenle 12 kişi yerine 15–20 kişi davet et. Birkaç kişi yanlışlıkla testten ayrılırsa production başvurun gecikmez.

---

# 2. Google Play Console kişisel geliştirici hesabını aç

## Adım 2.1 — Play Console kayıt ekranına gir

Google hesabınla Google Play Console kayıt ekranına gir:

```text
https://play.google.com/console/signup
```

## Adım 2.2 — Hesap tipini seç

Hesap tipi sorulduğunda:

```text
Personal / Kişisel
```

seçeneğini seç.

Bu seçim senin belirttiğin kullanım senaryosuna uygundur. Organizasyon hesabı seçme; organizasyon hesabında ek kurumsal doğrulamalar ve D-U-N-S numarası istenebilir.

## Adım 2.3 — Google Payments profilini bağla

- Mevcut kişisel Google Payments profilini seç veya yeni kişisel profil oluştur.
- Yasal adını ve adresini kimlik belgenle uyumlu yaz.
- Kayıt ekranında gösterilen tek seferlik geliştirici kayıt ücretini öde.
- Google doğrulama isterse resmî kimlik belgeni yükle.

## Adım 2.4 — İletişim bilgilerini doğrula

Google tarafından kullanılacak iletişim bilgilerini tamamla:

- Contact email
- Contact phone number

Telefonu uluslararası formatta yaz:

```text
+49...
```

Google SMS veya sesli arama ile 6 haneli doğrulama kodu gönderebilir.

## Adım 2.5 — Mağazada görünecek geliştirici e-postasını doğrula

Google Play kullanıcılarının görebileceği geliştirici e-posta adresini ayrıca doğrula.

Bu adres için düzenli kontrol edilen bir e-posta kullan. Kişisel ana e-posta hesabını herkese açık hale getirmek istemiyorsan uygulama için ayrı bir destek e-postası oluştur.

---

# 3. Fiziksel Android cihaz doğrulamasını tamamla

Yeni kişisel hesaplarda production erişimi için gerçek Android cihaz doğrulaması gerekir.

## Adım adım cihaz doğrulaması

1. Bilgisayarda Play Console hesabına hesap sahibi olarak giriş yap.
2. `Home` sayfasına git.
3. `Verify that you have access to an Android mobile device` görevini bul.
4. `View details` seçeneğine bas.
5. Ekrandaki QR kodu Android telefonunla tara.
6. Telefona Play Console mobil uygulamasını kur veya aç.
7. Aynı Google hesabıyla giriş yap.
8. Kişisel geliştirici hesabını seç.
9. `Verify` seçeneğine bas ve ekrandaki adımları tamamla.

Kullanacağın cihaz:

- Fiziksel telefon olmalı
- Root edilmemiş olmalı
- En az Android 10 çalıştırmalı

Emülatör kullanma.

---

# 4. Play Console içinde almanya101 uygulamasını oluştur

## Adım 4.1 — Yeni uygulama oluştur

Play Console içinde:

```text
Home > Create app
```

seçeneğine gir.

## Adım 4.2 — Temel seçimleri yap

Önerilen başlangıç değerleri:

| Alan | Seçim |
|---|---|
| App name | `almanya101` |
| Default language | Türkçe |
| App or game | App |
| Free or paid | Free |
| Contact email | Düzenli kontrol edilen destek e-postası |

## Adım 4.3 — Beyanları kabul et

Aşağıdaki beyanları kabul et:

- Developer Program Policies
- US export laws
- Play App Signing Terms of Service

Ardından:

```text
Create app
```

seçeneğine bas.

## Kritik paket adı notu

Mobil repoda paket adı şu şekilde tanımlıdır:

```text
de.almanya101.app
```

Bu paket adı değiştirilmemelidir. Google Play üzerinde ilk AAB yüklendiğinde paket adı sabitlenir. Paket adları benzersiz ve kalıcıdır; silinip yeniden kullanılamaz.

---

# 5. Repoyu Google Play build için hazırla

Önce diğer MD dosyasında verilen ayrıntılı repo promptunu Claude Code veya benzeri kodlama ajanına uygulat:

```text
almanya101_app101_repo_google_play_prompt.md
```

Kod değişiklikleri tamamlandıktan sonra repo kökünde PowerShell aç.

## Adım 5.1 — Temel kontrolleri çalıştır

```powershell
npm install
npm run verify
npm run release:check
npx expo-doctor
npx expo config --type public
```

Hata varsa AAB üretmeden önce düzelt.

## Adım 5.2 — EAS CLI kur ve Expo hesabına giriş yap

```powershell
npm install --global eas-cli
eas login
eas whoami
```

## Adım 5.3 — EAS production public environment değerlerini tanımla

Aşağıdaki değerler `.secret` içinde yerel olarak bulunabilir. EAS cloud build sırasında `.env.local` Git dışında kaldığı için production ortamında EAS Environment üzerinden de tanımlanmalıdır.

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<SUPABASE_URL>" --environment production --visibility plaintext

eas env:create --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "<SUPABASE_PUBLISHABLE_KEY>" --environment production --visibility plaintext

eas env:create --name EXPO_PUBLIC_WEB_API_BASE_URL --value "<WEB_API_BASE_URL>" --environment production --visibility plaintext
```

Preview build kullanacaksan aynı üç public değişkeni `preview` ortamında da tanımla:

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<SUPABASE_URL>" --environment preview --visibility plaintext

eas env:create --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "<SUPABASE_PUBLISHABLE_KEY>" --environment preview --visibility plaintext

eas env:create --name EXPO_PUBLIC_WEB_API_BASE_URL --value "<WEB_API_BASE_URL>" --environment preview --visibility plaintext
```

## Güvenlik notu

Aşağıdaki değerleri `EXPO_PUBLIC_*` olarak tanımlama:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
ADMIN_PANEL_PASSWORD
IP_HASH_SALT
GOOGLE_PLACES_API_KEY
Google Play service-account JSON private key
```

`EXPO_PUBLIC_*` ile başlayan değişkenler mobil uygulama bundle içinde okunabilir durumdadır.

---

# 6. Önce APK ile telefonda hızlı test yap

Google Play AAB yüklemesinden önce telefona doğrudan kurulabilir preview APK oluştur:

```powershell
eas build --platform android --profile preview
```

Build tamamlandıktan sonra Expo tarafından verilen indirme bağlantısından APK dosyasını telefona kur.

## Telefonda kontrol et

```text
[ ] Uygulama açılıyor
[ ] Ana sayfa açılıyor
[ ] Haberler açılıyor
[ ] Haber kaynak linkleri çalışıyor
[ ] Türkçe hizmet rehberi açılıyor
[ ] Hizmet sağlayıcı önerme formu çalışıyor
[ ] Kırık bağlantı bildirimi çalışıyor
[ ] Vatandaşlık testi çalışıyor
[ ] Maaş hesaplayıcı beta uyarısı görünüyor
[ ] İş ilanları açılıyor
[ ] Harici web linkleri güvenli biçimde açılıyor
[ ] Gizlilik Politikası ekranı açılıyor
[ ] Tam Gizlilik Politikası web bağlantısı açılıyor
[ ] İletişim ekranı açılıyor
[ ] Android geri tuşu doğru çalışıyor
[ ] İnternet kapalıyken uygulama kontrollü hata mesajı gösteriyor
[ ] Daha Fazla ekranında app version ve build bilgisi görünüyor
```

---

# 7. Google Play için production AAB üret

Telefon testleri başarılıysa production AAB oluştur:

```powershell
eas build --platform android --profile production
```

EAS build tamamlandığında `.aab` dosyasını indir.

## AAB ve APK farkı

| Dosya | Kullanım |
|---|---|
| APK | Telefona doğrudan kurulum ve hızlı test |
| AAB | Google Play Console yüklemesi |

Google Play’e APK değil, production AAB yükle.

---

# 8. İlk AAB dosyasını manuel olarak Internal Testing kanalına yükle

Expo EAS Submit otomasyonu daha sonra kurulabilir. İlk Google Play yüklemesini manuel yap.

## Adım adım internal test release

Play Console içinde:

```text
Testing > Internal testing
```

sayfasına gir.

Ardından:

1. `Create new release` seçeneğine bas.
2. İlk release ise Play App Signing adımlarını tamamla.
3. EAS tarafından üretilen `.aab` dosyasını yükle.
4. Release name alanında build sürümünü kullanabilirsin.
5. Türkçe release notes yaz.
6. `Save as draft` seçeneğine bas.
7. `Next` seçeneğine bas.
8. Error summary varsa hataları çöz.
9. Release’i internal test kanalında yayınla.

## Önerilen ilk release notes

```text
almanya101 Android uygulamasının ilk test sürümü.
Haberler, Türkçe hizmet rehberi, vatandaşlık testi, maaş hesaplayıcı ve iş ilanları modülleri test edilmektedir.
```

Internal testing zorunlu değildir fakat önerilir. Google internal test kanalında hızlı dağıtım sağlar ve en fazla 100 tester ekleyebilirsin.

## Kendini internal tester olarak ekle

```text
Testing > Internal testing > Testers
```

altında:

1. Bir e-posta listesi oluştur.
2. Kendi Gmail hesabını ekle.
3. Feedback e-posta adresini ekle.
4. Shareable link bağlantısını kopyala.
5. Telefonda bağlantıyı aç.
6. Teste katıl.
7. Google Play üzerinden uygulamayı yükle.

Bu adım AAB dosyasının Google Play dağıtımında çalıştığını doğrular.

---

# 9. Zorunlu Closed Testing kanalını başlat

Yeni kişisel geliştirici hesabında production erişimi için kapalı test zorunludur.

## Önemli tester ayrımı

Internal testte bulunan bir kullanıcı closed test sürümünü alamaz. Aynı kişiyi closed testte kullanmak istiyorsan önce internal testten çıkması, ardından closed test opt-in bağlantısından katılması gerekir.

Pratik öneri:

- Internal test için yalnızca kendini ve 1–2 yakın tester kullan.
- Closed test için ayrı 15–20 kişilik liste oluştur.

## Adım 9.1 — Closed testing track aç

Play Console içinde:

```text
Testing > Closed testing
```

sayfasına gir.

Ardından:

1. Başlangıç closed track seçeneğine gir veya yeni track oluştur.
2. Track adı olarak örneğin `almanya101-beta` kullan.
3. `Manage track` seçeneğine gir.
4. `Testers` sekmesine geç.
5. `Create email list` seçeneğine bas.
6. Liste adı olarak `almanya101-closed-beta` yaz.
7. En az 15–20 tester Gmail veya Google Workspace adresini ekle.
8. Feedback e-posta adresini veya feedback URL adresini ekle.
9. Shareable opt-in bağlantısını kopyala.

## Adım 9.2 — Closed test release oluştur

Closed testing track içinde:

1. `Create new release` seçeneğine bas.
2. Internal testte kullandığın AAB dosyasını bundle library üzerinden seç veya yeni production AAB yükle.
3. Release notes ekle.
4. `Next` seçeneğine bas.
5. Hataları kontrol et.
6. Closed test rollout işlemini başlat.

## Adım 9.3 — Tester mesajını gönder

Tester grubuna aşağıdaki metni gönderebilirsin:

```text
Merhaba,

almanya101 Android uygulamasının kapalı test sürecine katılmak için aşağıdaki bağlantıyı Android telefonunuzda Google hesabınız açıkken açabilir misiniz?

<OPT-IN-LINK>

Bağlantıyı açtıktan sonra teste katılmanız ve uygulamayı Google Play üzerinden yüklemeniz gerekiyor.

Önemli rica: Google Play production başvurusu için testten en az 14 gün boyunca çıkmamanız gerekiyor. Uygulamayı farklı ekranlarda deneyip gördüğünüz hataları bana iletebilirsiniz.

Teşekkürler.
```

## 14 günlük kritik takip

Tester sayısını her gün kontrol et:

```text
Testing > Closed testing > Manage track > Testers
```

Takip tablosu:

| Gün | Opted-in tester sayısı | Aktif hata | Yeni build yüklendi mi? | Not |
|---|---:|---|---:|---|
| Gün 1 |  |  |  |  |
| Gün 2 |  |  |  |  |
| Gün 3 |  |  |  |  |
| Gün 4 |  |  |  |  |
| Gün 5 |  |  |  |  |
| Gün 6 |  |  |  |  |
| Gün 7 |  |  |  |  |
| Gün 8 |  |  |  |  |
| Gün 9 |  |  |  |  |
| Gün 10 |  |  |  |  |
| Gün 11 |  |  |  |  |
| Gün 12 |  |  |  |  |
| Gün 13 |  |  |  |  |
| Gün 14 |  |  |  |  |

En az 12 tester 14 gün kesintisiz opted-in kalmalıdır. Bir tester ayrılırsa toplam sayının yine en az 12 olduğundan emin ol.

---

# 10. Store Listing bilgilerini tamamla

Play Console içinde:

```text
Grow users > Store presence > Main store listing
```

sayfasına git.

## Temel metinler

| Alan | Sınır |
|---|---:|
| App name | 30 karakter |
| Short description | 80 karakter |
| Full description | 4000 karakter |

## Önerilen kısa açıklama taslağı

```text
Almanya'daki Türkler için haberler, rehberler ve pratik araçlar.
```

Yüklemeden önce karakter sayısını kontrol et.

## Grafik dosyaları

| Varlık | Zorunluluk | Gereksinim |
|---|---|---|
| App icon | Zorunlu | 512 × 512 px, 32-bit PNG, en fazla 1024 KB |
| Feature graphic | Zorunlu | 1024 × 500 px, JPEG veya 24-bit PNG, alpha yok |
| Telefon screenshot | Zorunlu | Minimum 2; önerilen en az 4 adet 1080 × 1920 portrait |
| Preview video | Opsiyonel | YouTube public veya unlisted URL |

## Önerilen screenshot sırası

1. Ana sayfa
2. Haberler
3. Türkçe hizmet rehberi
4. Vatandaşlık testi
5. Maaş hesaplayıcı
6. İş ilanları

Screenshot üzerinde yanıltıcı ifade kullanma:

```text
En iyi
1 numara
Hemen indir
Ücretsiz indir
Milyonlarca kullanıcı
```

Alt text alanlarını doldur.

---

# 11. Store Settings bilgilerini tamamla

Play Console içinde:

```text
Grow users > Store presence > Store settings
```

sayfasına git.

Doldur:

| Alan | Değer |
|---|---|
| Category | Öncelikle `Lifestyle` seçeneğini değerlendir |
| Tags | Uygulamanın gerçek içeriğine uygun etiketler |
| Contact email | Zorunlu destek e-postası |
| Website | `https://almanya101.de` |
| Phone | İstersen ekle |

## Neden Lifestyle değerlendirilmeli?

almanya101 yalnızca haber uygulaması değildir. Haberler yanında Türkçe hizmet rehberi, vatandaşlık testi, maaş hesaplayıcı ve iş ilanları gibi araçlar sunar. Bu nedenle yaşam platformu olarak konumlandırmak daha doğru olabilir.

Ancak mağaza açıklamasında veya kategoride uygulamayı `News` veya `Magazine` olarak sınıflandırırsan News & Magazine self-declaration doldurman gerekir. Böyle bir sınıflandırma kullanırsan haberlerde orijinal yayıncı veya kaynak bilgisi, düzenli güncelleme ve güncel iletişim bilgisi gösterilmelidir.

---

# 12. App Content beyanlarını tamamla

Play Console içinde:

```text
Policy and programs > App content
```

sayfasına git.

## Adım 12.1 — Privacy Policy

```text
Privacy Policy > Start
```

URL alanına şunu gir:

```text
https://almanya101.de/gizlilik
```

Kaydetmeden önce sayfanın:

- Herkese açık olduğunu
- Login gerektirmediğini
- Mobil tarayıcıda açıldığını
- Uygulama veri akışlarını doğru anlattığını

kontrol et.

## Adım 12.2 — Ads

İlk sürümde uygulamaya reklam veya reklam SDK paketi eklenmediyse:

```text
No
```

seç.

İleride banner, native ad, sponsorlu feed veya reklam SDK paketi eklersen bu beyanı güncelle.

## Adım 12.3 — App access

İlk sürümde genel kullanıcı login sistemi yoksa bütün ekranların erişilebilir olduğunu belirt.

İleride login, üyelik, konuma bağlı erişim veya başka kısıt eklenirse reviewer için test hesabı ve erişim talimatı girmen gerekir.

## Adım 12.4 — Target audience and content

Uygulamanın gerçek hedef kitlesine göre seçim yap.

almanya101; haberler, Almanya yaşam rehberleri, vatandaşlık testi, maaş hesaplayıcı ve iş ilanları sunduğu için yetişkin kullanıcılara yöneliktir. Ürünü çocuklara yönelik olarak konumlandırmıyorsan çocuk yaş gruplarını seçme. Çocukları hedef kitleye dahil etmek ek Families Policy yükümlülükleri getirir.

## Adım 12.5 — Content rating

Content rating anketini eksiksiz doldur.

Uygulama haber içeriği gösterdiği için anket sorularını gerçek içeriğe göre yanıtla. Yanlış biçimde `Unrated` kalmasına izin verme.

## Adım 12.6 — Data Safety

Data Safety formunu yalnızca repo dokümanındaki envanteri ve backend cevaplarını kontrol ettikten sonra doldur:

```text
docs/google-play/DATA_SAFETY_INVENTORY.md
docs/google-play/BACKEND_PRIVACY_QUESTIONS.md
```

Özellikle kontrol et:

- Hizmet sağlayıcı önerisi formunda gönderilen alanlar
- Kırık bağlantı bildiriminde gönderilen alanlar
- Backend saklama süresi
- API veya hosting IP logları
- Supabase davranışı
- Kullanılan üçüncü taraf SDK paketleri
- Android izinleri
- Verilerin silinmesi için iletişim yöntemi

Data Safety formunda yalnızca doğrudan kendi kodunu değil, kullandığın SDK paketlerini ve sunucu davranışını da dikkate al.

## Hesap silme notu

İlk sürümde kullanıcı hesabı oluşturma özelliği yoksa hesap silme ekranı zorunlu değildir.

İleride uygulama içinden kullanıcı hesabı oluşturulabilirse Google Play şu iki özelliği zorunlu tutar:

1. Uygulama içinde hesap silme yolu
2. Uygulama dışında erişilebilen web tabanlı hesap silme talep bağlantısı

Auth eklenen ilk release öncesinde bu iki madde tamamlanmalıdır.

## Adım 12.7 — News and Magazine apps

Uygulamayı `Lifestyle` kategorisinde genel yaşam platformu olarak yayınlıyorsan haber modülünün varlığını saklama fakat uygulamayı yanlış biçimde yalnızca haber uygulaması olarak beyan etme.

Play Console ekranında News & Magazine self-declaration zorunlu görünürse uygulamanın gerçek konumlandırmasına göre dürüst yanıt ver. News veya Magazine olarak sınıflandırırsan haber kaynaklarının kullanıcıya açık biçimde gösterildiğini kontrol et.

---

# 13. AAB sonrasında teknik kontrolleri yap

AAB yükledikten sonra Play Console içinde:

```text
Test and release > App bundle explorer
```

sayfasına gir.

Kontrol et:

```text
[ ] Paket adı de.almanya101.app
[ ] Version code artmış
[ ] Target API en az API 35
[ ] Gereksiz hassas Android izni yok
[ ] App Bundle işlenmiş
[ ] Download size normal
[ ] Pre-launch report kritik hata göstermiyor
```

Google Play’in güncel resmi kuralına göre yeni uygulamalar Android 15, yani API 35 veya üzerini hedeflemelidir.

---

# 14. Closed test sırasında geri bildirim topla

Tester geri bildirimlerini kayıt altına al. Production erişimi başvurusunda Google senden test sürecini ve yapılan iyileştirmeleri açıklamanı isteyecektir.

Önerilen tablo:

| Tarih | Tester | Cihaz | Android sürümü | App version | Build | Senaryo | Sonuç | Hata | Yapılan düzeltme |
|---|---|---|---|---|---|---|---|---|---|

En az aşağıdaki senaryoları farklı testerlarla denetle:

```text
[ ] Ana sayfa
[ ] Haber listesi
[ ] Haber detayı ve kaynak linki
[ ] Türkçe hizmet rehberi filtreleri
[ ] Hizmet sağlayıcı önerisi formu
[ ] Kırık link bildirme
[ ] Vatandaşlık testi
[ ] Maaş hesaplama beta davranışı
[ ] İş ilanları
[ ] Harici URL açma
[ ] Offline kullanım
[ ] Yavaş internet
[ ] Android geri tuşu
[ ] Küçük ekran
[ ] Büyük ekran
```

Closed test sırasında hata düzeltip yeni AAB yükleyebilirsin. Testerların opt-in durumunu kesintiye uğratma.

---

# 15. 14 gün sonunda production erişimine başvur

En az 12 tester 14 gün kesintisiz opted-in kaldıktan sonra Play Console Dashboard üzerinde:

```text
Apply for production
```

seçeneği açılır.

Google senden üç bölümde bilgi ister:

## Bölüm 1 — About your closed test

Hazırla:

- Testerları nasıl buldun?
- Testerlar uygulamanın hangi özelliklerini kullandı?
- Test kullanımı gerçek kullanıcı davranışına benzedi mi?
- Hangi geri bildirimleri aldın?
- Geri bildirimleri nasıl topladın?

## Bölüm 2 — About your app

Hazırla:

- Hedef kullanıcı kitlesi kim?
- Uygulama kullanıcıya nasıl değer sağlıyor?
- İlk yılda beklenen yaklaşık indirme aralığı nedir?

Örnek değer önerisi:

```text
almanya101, Almanya'da yaşayan veya Almanya'ya taşınmayı planlayan Türkçe konuşan kullanıcılara haberler, Türkçe hizmet rehberi, vatandaşlık testi, maaş hesaplama aracı ve iş ilanları sunarak günlük bilgiye tek noktadan erişim sağlar.
```

## Bölüm 3 — Production readiness

Hazırla:

- Kapalı testten sonra hangi hataları düzelttin?
- Hangi kullanıcı deneyimi iyileştirmelerini yaptın?
- Uygulamanın production ortamına hazır olduğuna nasıl karar verdin?

Production erişim başvurusunu gönder.

Google başvuruyu inceler. Resmî yardım sayfasında bu incelemenin genellikle 7 gün veya daha kısa sürdüğü, zaman zaman daha uzun sürebileceği belirtilir.

---

# 16. Production release oluştur

Production erişimin kabul edildiğinde:

```text
Test and release > Production
```

sayfasına gir.

Ardından:

1. `Create new release` seçeneğine bas.
2. Son onaylı production AAB dosyasını seç veya yeni AAB yükle.
3. Release notes ekle.
4. Ülke veya bölge dağıtımını kontrol et.
5. Fiyatın `Free` olduğunu kontrol et.
6. App content beyanlarının güncel olduğunu kontrol et.
7. Store listing varlıklarının güncel olduğunu kontrol et.
8. Error summary varsa çöz.
9. Preview and confirm ekranını kontrol et.
10. Production rollout işlemini başlat.

İlk production yayınında kontrollü hareket et. Büyük değişiklikleri aynı anda eklemek yerine stabil test buildini yayınla.

---

# 17. İlk manuel yüklemeden sonra EAS Submit otomasyonu opsiyonel

İlk Google Play yüklemesi manuel yapılmalıdır. Daha sonraki sürümlerde EAS Submit otomasyonu kullanılabilir.

Bunun için Google Cloud service-account JSON key gerekir. Bu dosya kesinlikle:

```text
GitHub reposuna commit edilmemeli
EXPO_PUBLIC environment içine konulmamalı
WhatsApp veya herkese açık kanallarda paylaşılmamalı
```

Daha sonra EAS credentials içine yüklemek için:

```powershell
eas credentials --platform android
```

Komutunu kullanabilir ve production profili altında Google Service Account seçeneğine ilerleyebilirsin.

Otomatik submit komutu:

```powershell
eas submit --platform android --profile production
```

İlk yayın için bu aşama zorunlu değildir. Önce manuel yayın sürecini tamamlamak daha basittir.

---

# 18. Kısa kontrol listesi

## Hesap

```text
[ ] Personal Play Console hesabı açıldı
[ ] Google Payments profili bağlandı
[ ] Kimlik doğrulaması tamamlandı veya gerekli olmadığı doğrulandı
[ ] Contact email doğrulandı
[ ] Contact phone doğrulandı
[ ] Store üzerinde görünecek geliştirici e-postası doğrulandı
[ ] Fiziksel Android cihaz doğrulaması tamamlandı
```

## Repo ve build

```text
[ ] Repo hazırlık promptundaki değişiklikler uygulandı
[ ] npm run verify başarılı
[ ] npm run release:check başarılı
[ ] npx expo-doctor kritik hata vermiyor
[ ] EAS production public environment değerleri tanımlandı
[ ] Preview APK telefonda test edildi
[ ] Production AAB üretildi
[ ] İlk AAB manuel yüklendi
[ ] Paket adı de.almanya101.app
[ ] Target API en az 35
```

## Store Listing

```text
[ ] App name girildi
[ ] Short description girildi
[ ] Full description girildi
[ ] 512 × 512 ikon yüklendi
[ ] 1024 × 500 feature graphic yüklendi
[ ] En az 4 önerilen telefon screenshot yüklendi
[ ] Screenshot alt text alanları dolduruldu
[ ] Website girildi
[ ] Support email girildi
[ ] Category seçildi
```

## App Content

```text
[ ] Privacy Policy URL girildi
[ ] Ads beyanı doğru girildi
[ ] App access beyanı doğru girildi
[ ] Target audience doğru girildi
[ ] Content rating anketi tamamlandı
[ ] Data Safety backend doğrulaması sonrası tamamlandı
[ ] News and Magazine kararı dürüst biçimde verildi
```

## Closed test

```text
[ ] Closed testing track oluşturuldu
[ ] 15–20 tester davet edildi
[ ] En az 12 tester opted-in oldu
[ ] En az 12 tester 14 gün kesintisiz opted-in kaldı
[ ] Tester geri bildirimleri kaydedildi
[ ] Hatalar düzeltildi
[ ] Production access başvurusu gönderildi
```

## Production

```text
[ ] Production erişimi kabul edildi
[ ] Son AAB seçildi
[ ] Release notes girildi
[ ] Ülke dağıtımı kontrol edildi
[ ] Production rollout başlatıldı
```

---

# Resmî kaynaklar

- Google Play kişisel hesap test zorunluluğu: https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- Google Play geliştirici kimlik doğrulaması: https://support.google.com/googleplay/android-developer/answer/10841920?hl=en
- Google Play cihaz doğrulaması: https://support.google.com/googleplay/android-developer/answer/14316361?hl=en
- Google Play uygulama oluşturma: https://support.google.com/googleplay/android-developer/answer/9859152?hl=en
- Google Play release oluşturma: https://support.google.com/googleplay/android-developer/answer/9859348?hl=en
- Google Play test kanalları: https://support.google.com/googleplay/android-developer/answer/9845334?hl=en
- Google Play review hazırlığı: https://support.google.com/googleplay/android-developer/answer/9859455?hl=en
- Google Play Data Safety: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- Google Play hesap silme gereksinimi: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- Google Play target API seviyesi: https://developer.android.com/google/play/requirements/target-sdk
- Google Play preview assets: https://support.google.com/googleplay/android-developer/answer/9866151?hl=en
- Google Play News & Magazines: https://support.google.com/googleplay/android-developer/answer/9935326?hl=en
- Expo EAS Build başlangıç: https://docs.expo.dev/build/setup/
- Expo Android APK ve AAB farkı: https://docs.expo.dev/build-reference/apk/
- Expo EAS environment variables: https://docs.expo.dev/eas/environment-variables/
- Expo Android Google Play submit: https://docs.expo.dev/submit/android/
