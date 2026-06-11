# Android Permissions Audit

Generated manifest kaynağı:

- Komut: `npx expo prebuild --platform android --clean`
- İnceleme: `android/app/src/main/AndroidManifest.xml`

## İzin envanteri

| Permission | Kaynak paket veya neden | Uygulamada gerçekten gerekli mi? | Data Safety etkisi | Aksiyon |
|---|---|---:|---|---|
| `android.permission.INTERNET` | Expo Android temel manifesti ve uzak içerik/API erişimi | Evet | Ağ erişimi; tek başına ek kişisel veri beyanı gerektirmez | Korundu |
| `android.permission.READ_EXTERNAL_STORAGE` | `expo-image` manifesti; uygulama uzak görseller gösteriyor, yerel galeri erişimi kullanmıyor | Hayır | Kullanıcı dosyalarına erişim algısı yaratabilir | `app.json > android.blockedPermissions` ile bloklandı |
| `android.permission.WRITE_EXTERNAL_STORAGE` | Expo Android şablonu / `expo-file-system` tarafı; uygulama dosya yazma özelliği sunmuyor | Hayır | Gereksiz depolama erişimi beyanı riski | `app.json > android.blockedPermissions` ile bloklandı |
| `android.permission.SYSTEM_ALERT_WINDOW` | Expo Android şablonundaki varsayılan opsiyonel izin | Hayır | Yüksek riskli sistem izni algısı | `app.json > android.blockedPermissions` ile bloklandı |
| `android.permission.VIBRATE` | Expo Android şablonundaki varsayılan opsiyonel izin | Hayır | Düşük; ancak uygulama titreşim özelliği kullanmıyor | `app.json > android.blockedPermissions` ile bloklandı |

## Son durum

Prebuild sonrası `AndroidManifest.xml` içinde gereksiz izinler `tools:node="remove"` ile işaretlenmiştir.
Bu, release manifest birleşiminde ilgili izinlerin kaldırılmasını hedefler.

## Target API doğrulaması

- Generated Gradle dosyasında uygulama `targetSdkVersion rootProject.ext.targetSdkVersion` kullanıyor.
- Sayısal target API değeri generated dosyalarda sabit olarak çözülmedi.
- Bu nedenle AAB yüklendikten sonra Play Console `App Bundle Explorer` içinde hedef API seviyesi manuel
  olarak doğrulanmalıdır.
- Release gate: yeni uygulama yüklemesi için hedef Android 15 / API 35 veya üzeri olmalıdır.
