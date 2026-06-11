# EAS Environment Kurulumu

Bu uygulama için EAS Cloud Build sırasında aşağıdaki üç değişken gereklidir:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_WEB_API_BASE_URL`

Önemli:

- Bu üç değişken client bundle içine gireceği için teknik olarak public kabul edilir.
- Bu alanlara `service-role`, private key, admin şifresi veya salt değeri yazılamaz.
- `.secret` yalnızca yerel geliştirme içindir.
- EAS Cloud Build için değerler EAS Environment üzerinden tanımlanmalıdır.

## Development ortamı

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<DEGER>" --environment development --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "<DEGER>" --environment development --visibility plaintext
eas env:create --name EXPO_PUBLIC_WEB_API_BASE_URL --value "<DEGER>" --environment development --visibility plaintext
```

## Preview ortamı

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<DEGER>" --environment preview --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "<DEGER>" --environment preview --visibility plaintext
eas env:create --name EXPO_PUBLIC_WEB_API_BASE_URL --value "<DEGER>" --environment preview --visibility plaintext
```

## Production ortamı

```powershell
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "<DEGER>" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY --value "<DEGER>" --environment production --visibility plaintext
eas env:create --name EXPO_PUBLIC_WEB_API_BASE_URL --value "<DEGER>" --environment production --visibility plaintext
```

## Kontrol komutları

```powershell
eas env:list --environment development
eas env:list --environment preview
eas env:list --environment production
```

## Not

Yerelde `npm run env:sync` komutu `.secret` içinden yalnızca allowlist public değerleri `.env.local`
dosyasına taşır. EAS sunucusunda aynı işi EAS Environment üstlenir; `.env.local` dosyası cloud build'e
yüklenmemelidir.
