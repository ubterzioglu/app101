# Data Safety Inventory

Bu envanter yalnızca mobil repo kod denetimine dayanır. Web/backend davranışı görülmeyen noktalarda
kesin yorum yapılmamış, `TBD — web backend doğrulanmalı` notu bırakılmıştır.

## Veri akışları

| Akış | Alan | Cihaz dışına gönderiliyor mu? | Saklanıyor mu? | Amaç | Üçüncü taraf paylaşımı | Data Safety kararı | Doğrulama durumu |
|---|---|---:|---:|---|---|---|---|
| Public Supabase read | Halka açık içerik alanları: haber başlığı, özet, kategori, içerik, kaynak adı/linki, rehber kayıtları, vatandaşlık soruları | Evet | TBD | Uygulama içeriğini göstermek | Koddan yalnızca Supabase public read istemcisi görülebiliyor | Muhtemelen uygulama işlevselliği için içerik çekimi; kullanıcıdan doğrudan kişisel veri alınmıyor | Kısmi doğrulandı |
| Hizmet sağlayıcı önerisi | `type`, `displayName`, `city`, `address`, `phone`, `website`, `tagLabels`, `googleMapsUrl`, `note` | Evet | TBD | Kullanıcı önerilerini değerlendirmek | TBD — web backend doğrulanmalı | Kullanıcı tarafından sağlanan içerik / iletişim bilgisi olabilir | Mobil istek doğrulandı, backend saklama bilinmiyor |
| Kırık bağlantı bildirimi | `agencyId`, `agencyName`, `reportText` | Evet | TBD | Hatalı linkleri incelemek | TBD — web backend doğrulanmalı | Kullanıcı tarafından sağlanan içerik olabilir | Mobil istek doğrulandı, backend saklama bilinmiyor |

## Public Supabase read

- Amaç: halka açık içerikleri göstermek
- Kimlik doğrulama: `publishable key + RLS`
- Kullanıcıdan alınan kişisel veri: kod denetiminde bu akış için kullanıcıdan form alanı alınmadı

## SDK envanteri

- Expo / React Native çekirdeği
- `expo-application`
- `expo-image`
- `expo-linking`
- `expo-secure-store`
- `@supabase/supabase-js`
- `@tanstack/react-query`

Kod denetiminde görünmeyenler:

- Analytics SDK paketi
- Reklam SDK paketi
- Firebase
- Push notification SDK paketi
- Genel kullanıcı auth akışı

## Android permission envanteri

- Ayrıntılı tablo: `PERMISSIONS_AUDIT.md`

## IP logları

- TBD — web backend doğrulanmalı

## Hosting logları

- TBD — web backend doğrulanmalı

## Saklama süreleri

- TBD — web backend doğrulanmalı

## Silme talebi kanalı

- Mobil uygulama, kullanıcıyı iletişim sayfasına yönlendiriyor.
- Uygulanacak gerçek silme süreci: `TBD — web backend doğrulanmalı`

## Gelecekte auth eklenirse

- Genel kullanıcı auth eklenirse Google Play hesap silme yükümlülüğü ayrıca ele alınmalıdır.

## Gelecekte yeni SDK eklenirse

- Analytics, crash reporting, reklam veya push notification eklendiğinde Data Safety formu yeniden gözden geçirilmelidir.
