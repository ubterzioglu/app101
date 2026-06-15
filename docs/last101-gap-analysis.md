# last101 Public Gap Analizi

Tarih: 2026-06-15
Kapsam: `Mobil Public`
Referans: `referans/last101`

Bu doküman, `last101` web reposundaki kullanıcıya açık yüzeylerle `app101` mobil uygulamasının
mevcut durumunu karşılaştırır. Admin, devuser ve web'e özgü SEO yüzeyleri parity kapsamına dahil
edilmemiştir.

## Public Route Durumu

| Web route | Mobil durumu | Not |
|---|---|---|
| `/` | `kısmi` | Temel ana sayfa var; `Keşfet` ve ek CTA yüzeyi eksik. |
| `/haberler` | `var` | Liste ve detay ekranları mevcut. |
| `/hizmet-rehberi` / `/rehber` | `var` | Liste, filtre ve detay akışı mevcut. |
| `/hizmet-rehberi/oneri` | `var` | Öneri formu mevcut. |
| `/is-ilanlari` | `var` | Statik veri yaklaşımıyla mevcut. |
| `/maas-hesaplama` | `var` | Native araç mevcut. |
| `/vatandaslik-testi` | `var` | Native araç mevcut. |
| `/banka-secim` | `var` | Native araç mevcut. |
| `/sigorta-secim` | `var` | Native araç mevcut. |
| `/para-transferi` | `var` | Native araç mevcut. |
| `/vize-secim` | `var` | Native araç mevcut. |
| `/stepstone-karsilastirma` | `var` | Native araç mevcut. |
| `/tatil/almanya` | `var` | Native araç mevcut. |
| `/tatil/turkiye` | `var` | Native araç mevcut. |
| `/tatil` | `eksik` | Yeni native giriş/hub ekranı gerekli. |
| `/belgeler` | `kısmi` | Mobilde placeholder/web yönlendirmesi var; tam katalog eksik. |
| `/yazi-dizisi` | `var` | Liste ve yazı detayı mevcut. |
| `/[authorSlug]` | `eksik` | Köşe yazarı profil ekranı ve yazı listesi eksik. |
| `/topluluk` | `eksik` | Native topluluk bilgi ekranı eksik. |
| `/almanyada-yasam` | `eksik` | Native bilgi/hub ekranı eksik. |
| `/ekibimize-katil` | `eksik` | Native katkı/gönüllülük ekranı eksik. |
| `/iletisim` | `kısmi` | Temel iletişim ekranı var; zengin kanal kartları eksik. |
| `/hakkimizda` | `var` | Ekran mevcut. |
| `/gizlilik` | `var` | Ekran mevcut. |
| `/software-hub` | `bilinçli olarak kapsam dışı` | Webde `devuser` yüzeyine yönleniyor. |

## Bilinçli Olarak Kapsam Dışı

- `app/admin/*`
- `app/api/admin*`
- `devuser` ve `software-hub`
- Genel kullanıcı auth, dashboard ve yönetim panelleri
- Web SEO yüzeyleri: `robots`, `sitemap`, metadata, structured data

## Hedef Mobil Karşılıklar

- `/belgeler`
  - Typed statik katalog + kategori accordion + belge kartları
- `/topluluk`
  - Native bilgi ekranı + WhatsApp / Telegram / İletişim CTA'ları
- `/almanyada-yasam`
  - Native bilgi hub'ı + `İkamet`, `Sağlık`, `Dil` blokları
- `/ekibimize-katil`
  - Gönüllülük/katkı ekranı + iletişim CTA'ları
- `/tatil`
  - `Tatil Almanya` ve `Tatil Türkiye` araçlarına giriş
- `author public page`
  - `/yazi-dizisi/yazar/[slug]` route'u + public author query + yazı listesi

## Uygulama Notları

- Referans repo `referans/last101` altında lokal ve read-only tutulur.
- Mobil tarafta yalnızca mevcut public read sınırları kullanılacaktır.
- Dış bağlantıların tamamı `lib/urls.ts` üzerinden doğrulanarak açılacaktır.
