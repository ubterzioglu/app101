# Release Runbook — almanya101 Android (Google Play)

Bu doküman, uygulamayı sıfırdan Google Play kapalı testine ve sonrasında production'a
götürmek için **uçtan uca, sırayla izlenecek** adımları içerir. Komutlar PowerShell içindir.

> Paket adı: `de.almanya101.app` · versionCode kaynağı: EAS remote (`appVersionSource: remote`)
> · production `autoIncrement: true` (her build versionCode'u otomatik artırır).

İlgili dokümanlar: [EAS_ENV_SETUP.md](EAS_ENV_SETUP.md) ·
[PLAY_STORE_RELEASE_CHECKLIST.md](PLAY_STORE_RELEASE_CHECKLIST.md) ·
[STORE_LISTING_DRAFT.md](STORE_LISTING_DRAFT.md) ·
[DATA_SAFETY_INVENTORY.md](DATA_SAFETY_INVENTORY.md) ·
[BACKEND_PRIVACY_QUESTIONS.md](BACKEND_PRIVACY_QUESTIONS.md)

---

## 0. Strateji özeti — neden "partial / track" yaklaşımı

Google Play **kişisel (bireysel) geliştirici hesabıyla** production'a çıkış için
**en az 12 tester'ın 14 gün kesintisiz kapalı testte (closed testing) opted-in kalması**
zorunludur. Bu 14 gün **inceleme süresi değil**, production başvurusunu *açabilmek* için
ön koşuldur ve gerçek darboğazdır.

Bu yüzden sıra şudur (her track ayrı bir "partial" yayın katmanıdır):

```
Internal testing  →  Closed testing (14 gün sayaç)  →  Production
   (anında)            (12+ tester, zorunlu pencere)      (tam yayın)
```

**Review süresini kısaltan faktörler** (ilk gönderimde hepsini eksiksiz ver):
- Data Safety formu, içerik derecelendirme anketi, gizlilik politikası URL'si eksiksiz/tutarlı
- İzinler minimumda (bkz. `android.blockedPermissions`, [PERMISSIONS_AUDIT.md](PERMISSIONS_AUDIT.md))
- Reklam kimliği / analytics / push SDK yok → otomatik incelemeye yakın kalır

---

## 1. Build öncesi kalite kapısı (lokal)

```powershell
npm run release:check   # security:check + typecheck + test + doctor + statik Android kontrolleri
```

Çıktı `OK` ve `EXIT 0` olmalı, **hiç UYARI olmamalı**. Kırmızıysa build alma.

---

## 2. EAS hesabı ve environment (ilk sefer)

```powershell
npm install -g eas-cli       # yüklü değilse
eas login                    # Expo hesabıyla giriş
eas whoami                   # doğrula
```

EAS Cloud Build, `.env.local` kullanmaz; üç public değişken EAS Environment'a tanımlanmalıdır
(detay ve komutlar: [EAS_ENV_SETUP.md](EAS_ENV_SETUP.md)). Kontrol:

```powershell
eas env:list --environment production
```

---

## 3. Build alma (AAB / APK)

| Profil | Çıktı | Amaç |
|---|---|---|
| `preview` | APK | Cihaza elden kurup hızlı duman testi |
| `production` | AAB (app-bundle) | Play Console'a yüklenecek gerçek artifact |

```powershell
# Hızlı elde test için (opsiyonel):
eas build --platform android --profile preview

# Play Console'a gidecek production AAB:
eas build --platform android --profile production
```

Build bitince EAS bir indirme linki verir. `production` AAB'yi Play Console'a bu adımda
**Internal testing** track'ine yükle.

---

## 4. Track 1 — Internal testing (anında doğrulama)

Play Console → **Test and release → Testing → Internal testing**:

1. **Create new release** → AAB'yi yükle (veya `eas submit` ile, aşağıya bak).
2. Release notes gir (taslak: [STORE_LISTING_DRAFT.md](STORE_LISTING_DRAFT.md)).
3. **Internal testers** listesi oluştur, kendi e-postanı (`ubterzioglu@gmail.com`) ekle.
4. **Review and roll out** → birkaç dakikada erişilebilir olur.
5. Opt-in linkiyle test cihazında kur, [CLOSED_TEST_PLAN.md](CLOSED_TEST_PLAN.md)
   senaryolarını hızlıca doğrula.

### (Opsiyonel) eas submit ile otomatik yükleme

`eas submit` için bir Google Play **service-account JSON** anahtarı gerekir
(Play Console → Setup → API access). Bu dosya **Git'e ve EAS upload paketine ASLA girmez**
(`.gitignore`/`.easignore` zaten `service-account*.json` kalıbını bloklar).

```powershell
eas submit --platform android --profile production --path <AAB_DOSYA_YOLU>
```

> Not: İlk yüklemeyi Play Console UI üzerinden manuel yapmak en güvenlisidir; `eas submit`
> sonraki güncellemeler için otomasyon sağlar. Otomasyon kullanılacaksa `eas.json` →
> `submit.production` içine `serviceAccountKeyPath` veya `EXPO_*` env referansı eklenmelidir.

---

## 5. Track 2 — Closed testing (14 günlük zorunlu pencere) ⏱️ EN KRİTİK

Bu sayacı **mümkün olan en erken** başlat; production'a çıkışın tek gerçek bekleme süresidir.

Play Console → **Testing → Closed testing → (yeni track veya "Alpha")**:

1. **Create track** (veya hazır "Closed testing"i kullan).
2. **Testers** sekmesinde bir **email list** oluştur ve **en az 12** (güvenli marj için
   **15–20**) tester e-postası ekle. Herkes farklı Google hesabı olmalı.
3. **Create new release** → aynı `production` AAB'yi bu track'e yükle.
4. **Roll out**.
5. **Her tester opt-in linkine tıklayıp uygulamayı kurmalı** (sadece e-posta listede olmak
   yetmez — *opted-in* olmaları gerekir). Bu kurulumla **14 günlük sayaç o tester için başlar**.
6. 14 gün boyunca **en az 12 tester kesintisiz opted-in kalmalı** (uygulamayı kaldırmasınlar).

### Closed test sırasında

- [CLOSED_TEST_PLAN.md](CLOSED_TEST_PLAN.md) senaryolarını test ettir, geri bildirim tablosunu doldur.
- Bulunan hataları gider → yeni `production` build al → **aynı closed track'e** yeni release it.
  Bu güncellemelerin incelemesi hızlıdır ve **14 günlük sayacı sıfırlamaz** (testerlar opted-in kaldıkça).
- versionCode otomatik artar (`autoIncrement: true`), elle dokunma gerekmez.

---

## 6. Track 3 — Production (14 gün dolunca)

Ön koşullar (Play Console "Dashboard" sizi uyarır):
- [ ] 12+ tester, 14 gün kesintisiz opted-in tamamlandı
- [ ] **App content** bölümü tamamen dolu:
  - [ ] Privacy policy URL: `https://almanya101.de/gizlilik`
  - [ ] Data safety formu ([DATA_SAFETY_INVENTORY.md](DATA_SAFETY_INVENTORY.md) ile teyitli)
  - [ ] Content rating anketi
  - [ ] Target audience & content (yetişkin/genel)
  - [ ] Ads beyanı: **reklam yok**
- [ ] Store listing eksiksiz (görseller, açıklama, destek e-postası)

Sonra: **Production → Create new release** → AAB'yi (closed'da doğrulanan build) promote et →
**Review and roll out**. İlk production incelemesi genelde birkaç gün sürer; sonraki
güncellemeler çok daha hızlıdır.

---

## 7. Yayın sonrası

- Play Console → **App bundle explorer** ile target API seviyesini doğrula.
- Crash/ANR oranlarını **Android vitals**'tan izle.
- Güncellemeler: `eas build --profile production` → ilgili track'e yeni release → promote.
