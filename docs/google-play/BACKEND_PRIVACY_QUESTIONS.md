# Backend Privacy Questions

`DATA_SAFETY_INVENTORY.md` içindeki `TBD — web backend doğrulanmalı` notlarının tamamı
aşağıdaki sorulardan türer. Bunlar **mobil koddan görülemez**; web/backend (Supabase + API
+ hosting) tarafından doğrulanmalıdır. Her soruyu yanıtla, sonra
`DATA_SAFETY_INVENTORY.md` ve Play Console **Data safety** formunu buna göre güncelle.

> Durum işaretleri: `[ ]` açık · `[x]` yanıtlandı. Yanıtı `Yanıt:` satırına yaz.

---

## A. Veri saklama (Data Safety: "Collected" + "Stored")

- [ ] **Provider suggestion kayıtları hangi tabloda saklanıyor? Kalıcı mı?**
  Yanıt:
  → Data Safety etkisi: kalıcıysa "Personal info / Messages — Collected & Stored" işaretle.

- [ ] **Broken-link report kayıtları hangi tabloda saklanıyor? Kalıcı mı?**
  Yanıt:
  → Data Safety etkisi: kalıcıysa ilgili kategori "Collected & Stored" işaretlenir.

- [ ] **Form kayıtları ne kadar süre saklanıyor? (retention)**
  Yanıt:
  → `DATA_SAFETY_INVENTORY.md` "Saklama süreleri" maddesini günceller.

## B. Loglama (Data Safety: "Collected" — otomatik toplanan)

- [ ] **API veya hosting katmanında IP adresi loglanıyor mu? Süre?**
  Yanıt:
  → Loglanıyorsa Data Safety'de "App activity / Device or other IDs" değerlendirilmeli.

- [ ] **Request header / user-agent bilgileri loglanıyor mu?**
  Yanıt:

## C. Paylaşım ve konum (Data Safety: "Shared" + bölge)

- [ ] **Veriler üçüncü taraf servis sağlayıcılarla paylaşılıyor mu? (analytics, CDN, vb.)**
  Yanıt:
  → "Shared" yalnızca veri *başka bir şirkete* aktarılıyorsa işaretlenir; salt Supabase barındırma
    "processor" sayılır ve genelde "Shared" değildir.

- [ ] **Supabase bölgesi ve hosting bölgesi nerede? (ör. EU)**
  Yanıt:

## D. Silme (Data Safety: "Data deletion" + URL)

- [ ] **Silme talebi geldiğinde hangi yöntemle siliniyor? Self-service mi, manuel mi?**
  Yanıt:
  → `DATA_SAFETY_INVENTORY.md` "Silme talebi kanalı" maddesini ve Play Console'daki
    veri silme URL'sini netleştirir. Mobil uygulama kullanıcıyı iletişim sayfasına yönlendiriyor.

## E. İçerik atfı ve gelecek SDK'lar

- [ ] **Haber kaynaklarının orijinal yayıncı bilgisi kullanıcıya gösteriliyor mu?**
  Yanıt: (Mobil tarafta kaynak adı/linki gösteriliyor — bu satır web/News policy teyidi içindir.)

- [ ] **İleride analytics, reklam, crash-reporting veya push SDK paketi eklenecek mi?**
  Yanıt:
  → Eklenecekse Data Safety formu ve `STORE_LISTING_DRAFT.md` Ads beyanı yeniden gözden geçirilmeli.

---

## Kapanış kontrolü

Tüm sorular yanıtlandığında:

- [ ] `DATA_SAFETY_INVENTORY.md` içindeki tüm `TBD — web backend doğrulanmalı` notları gerçek değerle değiştirildi
- [ ] Play Console **Data safety** formu envanterle birebir tutarlı dolduruldu
- [ ] `PLAY_STORE_RELEASE_CHECKLIST.md` → "Manuel release gate" maddeleri işaretlendi
