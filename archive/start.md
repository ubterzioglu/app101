# app101 — almanya101 Mobil Uygulaması E2E MVP Geliştirme Planı

**Kaynak web repo:** `https://github.com/ubterzioglu/last101`  
**Hedef mobil repo:** `https://github.com/ubterzioglu/app101`  
**Hedef platform:** İlk etapta Android  
**Teknik yaklaşım:** React Native + Expo + TypeScript ile kontrollü mobil yeniden yazım  
**Backend yaklaşımı:** Mevcut Supabase projesini ve gerekli yerlerde mevcut Next.js API endpointlerini yeniden kullanma  
**Belge amacı:** AI coding agent veya geliştirici ekibinin, boş hedef repodan başlayarak çalışan bir E2E MVP üretmesini sağlamak

---

## 1. Yönetici Özeti

`app101` reposu boş durumdadır. Bu nedenle yapılacak iş, mevcut web arayüzünü birebir kopyalamak veya WebView içine gömmek değildir. Amaç; `last101` reposundaki çalışan veri kaynaklarını, iş kurallarını ve içerik yapılarını inceleyerek Android odaklı, gerçek mobil navigasyona sahip, sürdürülebilir bir Expo uygulaması geliştirmektir.

MVP için temel kararlar:

1. Yeni mobil uygulama **Expo SDK 56**, **React Native**, **TypeScript** ve **Expo Router** ile kurulacaktır.
2. Uygulama, salt okunur public içeriklerde mevcut Supabase projesine doğrudan bağlanacaktır.
3. Mobil bundle içine yalnızca Supabase **publishable key** konulabilir. `service_role`, admin şifreleri ve server-only credential değerleri kesinlikle mobil uygulamaya taşınmayacaktır.
4. Tüm credential değerleri yerel geliştirme ortamında hedef repo kökündeki `.secret` dosyasından okunacaktır. `.secret` Git'e hiçbir zaman commit edilmeyecektir.
5. Veri yazma işlemlerinde mümkün olan yerlerde mevcut web API endpointleri kullanılacaktır. Örneğin hizmet önerileri mobil uygulamadan doğrudan tabloya yazılmayacak; mevcut `/api/provider-submissions` endpointi çağrılacaktır.
6. İlk MVP'de genel kullanıcı hesabı, topluluk platformu, admin paneli ve `devuser` dashboard mobil uygulamaya taşınmayacaktır.
7. Haberler, hizmet rehberi, vatandaşlık testi ve Arkadaşın Köşesi Supabase tabanlı mobil modüller olacaktır.
8. İş ilanları ekranı ilk sürümde web ile aynı davranışı korumak için statik veri dosyasından beslenecektir. Supabase tablosuna geçiş ayrı bir iyileştirme işi olacaktır.
9. Maaş hesaplayıcı mobil uygulamaya taşınacaktır; fakat mevcut kodda vergi hesabı legacy / simplified fallback kullandığı için MVP ekranında sonuçların referans amaçlı olduğu açıkça belirtilecektir. Bordro seviyesinde doğruluk ayrı bir kalite kapısından geçirilecektir.
10. Banka, sigorta, vize, para transferi, tatil planlayıcı ve StepStone karşılaştırma araçları fazlı biçimde taşınacaktır. İlk teslimatta en yüksek kullanıcı değerine sahip araçlar önceliklendirilecektir.

---

## 2. Kaynak Repo İncelemesinden Çıkan Gerçek Durum

### 2.1 Kaynak web uygulaması

`last101`, Next.js 15 App Router, React 19, TypeScript, TailwindCSS ve Supabase kullanan özel bir uygulamadır. WordPress veya hazır CMS tabanlı değildir.

Repo içinde dört ana alan bulunmaktadır:

- Public pazarlama ve içerik sayfaları
- İnteraktif araçlar
- `devuser` dashboard
- Admin paneli ve API route katmanı

Web tarafında mevcut araçlar:

- Brütten nete maaş hesaplama
- Vatandaşlık testi
- Banka seçim aracı
- Sigorta seçim aracı
- Para transferi seçim aracı
- Vize seçim aracı
- Türkiye ve Almanya tatil planlayıcıları
- Türk hizmet rehberi
- İş ilanları / işe alım ajansları
- StepStone maaş karşılaştırma

İçerik tarafında mevcut alanlar:

- Haberler
- Arkadaşın Köşesi / yazı dizisi
- Yararlı belgeler
- Software Hub
- Hizmet önerme formu

### 2.2 Hedef mobil repo

`app101` reposu başlangıçta boştur. Bu olumlu bir durumdur: mobil mimari web uygulamasının tarihsel yükünü taşımadan kurulabilir.

### 2.3 Veri kaynakları

Repo incelemesi sonucunda mobil uygulamada kullanılacak başlıca veri kaynakları netleşmiştir.

#### Haberler

Supabase tablosu: `news_posts`

Beklenen alanlar:

```ts
export type NewsPostRow = {
  id: string
  category: string | null
  title: string | null
  summary: string | null
  content: string | null
  cover_image_url: string | null
  source_name: string | null
  source_url: string | null
  reading_minutes: number | null
  published_at: string | null
  created_at: string | null
  show_in_carousel?: boolean | null
  status: 'published' | string
}
```

Liste sorgusu:

```ts
supabase
  .from('news_posts')
  .select('id, category, title, summary, content, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, show_in_carousel')
  .eq('status', 'published')
  .order('published_at', { ascending: false, nullsFirst: false })
  .order('created_at', { ascending: false })
```

#### Hizmet rehberi

Supabase tabloları:

- `providers`
- `provider_tags`
- `tags`
- `gastronomy_providers`
- `gastronomy_provider_tags`
- `gastronomy_tags`

Beklenen temel provider alanları:

```ts
export type ProviderRow = {
  id: string
  type: ProviderType
  city: string
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  status: 'active' | 'pending' | 'inactive'
  created_at: string
  updated_at: string
  name?: string | null
  display_name?: string | null
  description?: string | null
  notes_public?: string | null
  provider_tags?: { tag_id: string }[]
  gastronomy_provider_tags?: { tag_id: string }[]
}
```

Kategori ayrımı:

- Hizmet kategorileri `providers` tablosundan okunur.
- `restaurant`, `market`, `kasap`, `cafe`, `bakery` kategorileri `gastronomy_providers` tablosundan okunur.
- `tamir` filtresi, `tamirci_otomobil`, `tamirci_tesisat`, `tamirci_boyaci` tiplerini birleştirir.

#### Vatandaşlık testi

Supabase tablosu: `vatandaslik_sorulari`

Beklenen alanlar:

```ts
export type CitizenshipQuestion = {
  id: number
  soru_almanca: string
  soru_turkce: string
  secenekler: Record<string, string>
  dogru_cevap: string
  image_url?: string
  eyalet: string
}
```

Mevcut üç mod:

1. `all`: `eyalet = 'Genel'` havuzundan en fazla 300 soru
2. `state`: seçilen eyaletten en fazla 10 soru
3. `real`: 30 genel + 3 eyalet sorusu, toplam 33 soru, 60 dakika sayaç

#### Arkadaşın Köşesi

Supabase tabloları:

- `corner_authors`
- `corner_posts`

Beklenen public içerik davranışı:

- Aktif yazarlar: `corner_authors.is_active = true`
- Yayındaki yazılar: `corner_posts.status = 'published'`
- Yazı detayında yazar bilgisi join ile alınır.

#### İş ilanları / işe alım ajansları

Repo içinde `recruitment_agencies` tablosu ve RLS politikası bulunmaktadır. Ancak public web sayfası şu anda bu tabloyu değil, `constants/recruitment-agencies.ts` statik listesini kullanmaktadır.

MVP kararı:

- Mobil ilk sürümde statik JSON veri kullanacaktır.
- Web ile veri paritesi korunacaktır.
- Supabase tablosuna geçiş ayrı bir iyileştirme işidir.

#### Yazma endpointleri

Hizmet önerisi:

```text
POST {WEB_API_BASE_URL}/api/provider-submissions
```

Kırık iş ilanı linki bildirimi:

```text
POST {WEB_API_BASE_URL}/api/broken-link-reports
```

Hizmet önerisi endpointi server-side doğrulama yapar ve yalnızca izin verilen tipleri `provider_submissions` tablosuna `pending` statüsüyle ekler. Bu davranış mobil uygulamada korunmalıdır.

---

## 3. MVP Ürün Kapsamı

### 3.1 MVP'nin amacı

İlk yayınlanabilir Android MVP aşağıdaki kullanıcı ihtiyacını çözmelidir:

> Almanya'da yaşayan veya Almanya'ya taşınmayı planlayan Türk kullanıcı, haberleri takip edebilmeli, Türkçe hizmet veren uzmanları arayabilmeli, temel rehber araçlarını kullanabilmeli ve vatandaşlık testine hazırlanabilmelidir.

### 3.2 P0 — İlk APK içinde zorunlu modüller

#### A. Mobil uygulama iskeleti

- Splash ekranı
- Ana sayfa
- Bottom tab navigasyonu
- Drawer veya “Daha Fazla” menüsü
- Hata ekranları
- Boş durum ekranları
- İnternet bağlantısı yok durumu
- Temel erişilebilirlik

Önerilen bottom tab yapısı:

1. **Ana Sayfa**
2. **Haberler**
3. **Rehber**
4. **Araçlar**
5. **Daha Fazla**

#### B. Ana sayfa

- almanya101 logo ve motto alanı
- Öne çıkan hızlı aksiyon kartları
- Son haberler alanı
- Popüler araçlar alanı
- Hizmet rehberi hızlı arama butonu
- Vatandaşlık testi CTA
- Web sitesini aç butonu

#### C. Haberler

- Haber listesi
- Kategori filtresi
- Pull-to-refresh
- Sonsuz kaydırma veya sayfalama
- Haber görseli
- Haber tarihi ve okuma süresi
- Haber detay ekranı
- Kaynak adı ve dış bağlantı
- İlgili haberler
- Native paylaşım butonu

#### D. Türk hizmet rehberi

- Kategori filtresi
- Şehir filtresi
- Arama alanı
- Hizmet ve gastronomi kayıtlarının ortak listesi
- Provider detay ekranı
- Telefon arama butonu
- Website açma butonu
- Harita bağlantısı varsa dış uygulamada açma
- “Yeni hizmet öner” formuna yönlendirme

#### E. Vatandaşlık testi

- Üç çalışma modu
- 16 eyalet seçimi
- Almanca ve Türkçe soru görünümü
- Görselli sorular desteği
- Doğru / yanlış geri bildirimi
- İlerleme göstergesi
- Gerçek sınav modunda 60 dakika geri sayım
- Sonuç ekranı
- Yeniden başlatma
- Soruların cihazda cache edilmesi

#### F. Maaş hesaplayıcı — Beta

- Brüt → net
- Net → brüt
- Aylık / yıllık tutar
- Steuerklasse 1–6
- Eyalet
- Kilise vergisi
- Çocuk durumu
- Sağlık sigortası parametreleri
- Kesinti detayları
- “Referans amaçlı hesaplama” uyarısı

#### G. İş ilanları / işe alım ajansları

- Statik kaynak veriden liste
- Arama
- Ana kategori filtresi
- Alt kategori filtresi
- Dış website açma
- Kırık bağlantı bildirimi

#### H. Daha fazla menüsü

- Arkadaşın Köşesi
- Yararlı belgeler
- Hakkımızda
- İletişim
- Web sitesini aç
- Gizlilik politikası
- Uygulama sürümü

### 3.3 P1 — MVP'nin hemen ardından eklenecek modüller

- Banka seçim aracı
- Sigorta seçim aracı
- Vize seçim aracı
- Para transferi seçim aracı
- Türkiye tatil planlayıcı
- Almanya tatil planlayıcı
- StepStone maaş karşılaştırma
- Hizmet önerisi formu
- Arkadaşın Köşesi detay akışları
- Yararlı belgeler tam liste ve detay ekranları

Not: Geliştirme kapasitesi yeterliyse P1 araçlarının tamamı ilk APK içine alınabilir. Ancak release blocker olmamalıdır.

### 3.4 P2 — İlk MVP dışında tutulacak alanlar

- Genel topluluk platformu
- Genel kullanıcı kayıt / login akışı
- `devuser` dashboard
- Admin paneli
- Admin içerik yönetimi
- Push notification
- Realtime chat
- Kullanıcı profili
- Offline içerik indirme yönetimi
- iOS yayını
- Tablet için özel layout

---

## 4. Önerilen Teknik Mimari

### 4.1 Mimari prensip

Mobil uygulama üç farklı veri yaklaşımını birlikte kullanacaktır:

```text
1. PUBLIC READ
Mobil App -> Supabase publishable key + RLS -> Public tablolar

2. CONTROLLED WRITE
Mobil App -> Mevcut Next.js API endpoint -> Server-side validation -> Supabase

3. LOCAL BUSINESS LOGIC
Mobil App -> Saf TypeScript modülleri / statik JSON -> Cihazda hesaplama
```

### 4.2 Neden bu yaklaşım?

- Mevcut backend yeniden kullanılır.
- Yeni bir backend kurma maliyeti oluşmaz.
- Public içerik hızlı alınır.
- Server credential değerleri uygulama paketine girmez.
- Web ve mobil aynı içerik kaynağını kullanır.
- Araçlar internet olmadan da büyük ölçüde çalışabilir.

### 4.3 Önerilen teknoloji seti

| Alan | Teknoloji |
|---|---|
| Mobil framework | Expo SDK 56 |
| Dil | TypeScript |
| Navigasyon | Expo Router |
| Veri erişimi | `@supabase/supabase-js` |
| Server API çağrıları | Native `fetch` + ortak API wrapper |
| Server-state yönetimi | TanStack Query |
| Kalıcı cache | AsyncStorage + Query persister |
| Form doğrulama | Zod |
| Görseller | `expo-image` |
| Bağlantı durumu | `@react-native-community/netinfo` |
| Native dış bağlantılar | `expo-linking` |
| Paylaşım | React Native `Share` API |
| Güvenli auth saklama | Auth fazında `expo-secure-store` değerlendirilir |
| Unit test | Jest + React Native Testing Library |
| E2E smoke test | Maestro |
| Android build | EAS Build internal distribution |

### 4.4 Stil yaklaşımı

İlk MVP için NativeWind zorunlu değildir. Web Tailwind class'larını otomatik çevirmeye çalışmak yerine mobil için sade bir tema sistemi kullanılmalıdır.

Öneri:

- `StyleSheet`
- Ortak `theme/colors.ts`
- Ortak spacing, radius, typography tokenları
- Yeniden kullanılabilir mobil bileşenler

Google renk paleti korunacaktır:

```ts
export const colors = {
  blue: '#4285F4',
  red: '#EA4335',
  yellow: '#FBBC05',
  green: '#34A853',
  orange: '#FF9500',
  black: '#000000',
  white: '#FFFFFF',
}
```

NativeWind ancak ekip açıkça tercih ederse ikinci adımda eklenmelidir.

---

## 5. Credential ve `.secret` Politikası

### 5.1 Temel kural

Tüm credential değerleri hedef mobil repo kökündeki aşağıdaki dosyada bulunacaktır:

```text
app101/.secret
```

Bu dosya yalnızca yerel geliştirme ve kontrollü build hazırlığı için kullanılacaktır. Git'e commit edilmeyecektir.

### 5.2 `.secret` örnek içeriği

```dotenv
# ==========================================================
# PUBLIC MOBILE CONFIG
# Mobil bundle içine yalnızca allowlist üzerinden aktarılabilir.
# ==========================================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
WEB_API_BASE_URL=https://your-production-domain.example

# ==========================================================
# SERVER-ONLY / LOCAL TOOLING
# Mobil bundle içine ASLA aktarılmayacaktır.
# Aynı .secret dosyasında tutulabilir fakat yalnızca local tooling
# veya web backend işlemleri için kullanılabilir.
# ==========================================================
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_SECRET_KEY=your_secret_key
SUPABASE_SERVICE_KEY=your_service_key
ADMIN_PANEL_PASSWORD=your_admin_password
DEVUSER_AUTH_SECRET=your_devuser_auth_secret
IP_HASH_SALT=your_ip_hash_salt
GOOGLE_PLACES_API_KEY=your_google_places_key
```

### 5.3 Mobil bundle içine aktarılabilecek tek değerler

`.secret` dosyasından `.env.local` üretirken yalnızca aşağıdaki allowlist kullanılacaktır:

```text
SUPABASE_URL                  -> EXPO_PUBLIC_SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY      -> EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
WEB_API_BASE_URL              -> EXPO_PUBLIC_WEB_API_BASE_URL
```

### 5.4 Mobil bundle içine kesinlikle girmemesi gereken değerler

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
SUPABASE_SERVICE_KEY
ADMIN_PANEL_PASSWORD
CORNER_ADMIN_PASSWORD
DEVUSER_AUTH_SECRET
IP_HASH_SALT
GOOGLE_PLACES_API_KEY
```

### 5.5 Zorunlu güvenlik dosyaları

Hedef repo `.gitignore` içine aşağıdakiler yazılmalıdır:

```gitignore
# Credentials
.secret
.secret.*
!.secret.example
.env
.env.*
!.env.example

# Expo
.expo/
dist/
web-build/

# Dependencies
node_modules/

# EAS local
.eas/

# Debug
npm-debug.log*
yarn-debug.log*
```

### 5.6 `.secret.example`

Repo içine yalnızca placeholder içeren `.secret.example` commit edilmelidir:

```dotenv
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
WEB_API_BASE_URL=

# Server-only values are intentionally never copied into Expo public env.
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_SECRET_KEY=
SUPABASE_SERVICE_KEY=
ADMIN_PANEL_PASSWORD=
DEVUSER_AUTH_SECRET=
IP_HASH_SALT=
GOOGLE_PLACES_API_KEY=
```

### 5.7 Secret senkronizasyon scripti

Dosya:

```text
scripts/sync-local-env.mjs
```

Görevleri:

1. Repo kökünde `.secret` var mı kontrol et.
2. Gerekli public değerler var mı kontrol et.
3. Sadece allowlist değerlerini oku.
4. `.env.local` oluştur.
5. Forbidden değerlerin hiçbirini `.env.local` içine yazma.
6. Eksik değer varsa açık hata vererek işlemi durdur.
7. Log içine gerçek credential değeri yazma.

Beklenen çıktı:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
EXPO_PUBLIC_WEB_API_BASE_URL=https://your-production-domain.example
```

### 5.8 Secret tarama scripti

Dosya:

```text
scripts/check-no-secrets.mjs
```

Kontrol edilecekler:

- `SUPABASE_SERVICE_ROLE_KEY=` ifadesi source code içinde hardcoded mı?
- `sb_secret_` prefix'i bundle'a girecek dosyalarda var mı?
- `.secret` yanlışlıkla Git index'e alınmış mı?
- `.env.local` index'e alınmış mı?
- Admin şifresi veya salt değerleri public env prefix'iyle tanımlanmış mı?

Komut:

```json
{
  "scripts": {
    "env:sync": "node scripts/sync-local-env.mjs",
    "security:check": "node scripts/check-no-secrets.mjs"
  }
}
```

---

## 6. Hedef Repo Klasör Yapısı

```text
app101/
├── app/
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── index.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                  # Ana sayfa
│   │   ├── haberler.tsx               # Haber listesi
│   │   ├── rehber.tsx                 # Hizmet rehberi
│   │   ├── araclar.tsx                # Araç merkezi
│   │   └── daha-fazla.tsx             # Daha fazla menüsü
│   ├── haberler/
│   │   └── [slug].tsx                 # Haber detay
│   ├── rehber/
│   │   ├── [id].tsx                   # Provider detay
│   │   └── oneri.tsx                  # Hizmet önerisi
│   ├── araclar/
│   │   ├── vatandaslik-testi.tsx
│   │   ├── maas-hesaplama.tsx
│   │   ├── banka-secim.tsx
│   │   ├── sigorta-secim.tsx
│   │   ├── para-transferi.tsx
│   │   ├── vize-secim.tsx
│   │   ├── tatil-turkiye.tsx
│   │   ├── tatil-almanya.tsx
│   │   └── stepstone-karsilastirma.tsx
│   ├── is-ilanlari/
│   │   └── index.tsx
│   ├── yazi-dizisi/
│   │   ├── index.tsx
│   │   └── [slug].tsx
│   ├── belgeler/
│   │   ├── index.tsx
│   │   └── [slug].tsx
│   ├── hakkimizda.tsx
│   ├── iletisim.tsx
│   └── gizlilik.tsx
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/
│   │   ├── AppButton.tsx
│   │   ├── AppCard.tsx
│   │   ├── AppTextInput.tsx
│   │   ├── AppSelect.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LoadingCard.tsx
│   │   └── OfflineBanner.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   └── NewsListSkeleton.tsx
│   ├── providers/
│   │   ├── ProviderCard.tsx
│   │   ├── ProviderFilters.tsx
│   │   └── ProviderActions.tsx
│   ├── tools/
│   │   ├── ToolCard.tsx
│   │   ├── QuizOption.tsx
│   │   ├── ResultCard.tsx
│   │   └── ProgressBar.tsx
│   └── layout/
│       ├── AppHeader.tsx
│       └── ScreenContainer.tsx
├── constants/
│   ├── navigation.ts
│   ├── provider-types.ts
│   └── recruitment-agencies.ts
├── features/
│   ├── news/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── mapper.ts
│   │   └── types.ts
│   ├── providers/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── mapper.ts
│   │   └── types.ts
│   ├── citizenship/
│   │   ├── api.ts
│   │   ├── quiz-engine.ts
│   │   └── types.ts
│   ├── salary/
│   │   ├── calculator.ts
│   │   ├── company-car.ts
│   │   ├── social-insurance.ts
│   │   ├── tax-calculator.ts
│   │   └── types.ts
│   ├── corner/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   ├── jobs/
│   │   ├── filter.ts
│   │   └── types.ts
│   └── recommendations/
│       ├── bank/
│       ├── insurance/
│       ├── visa/
│       └── transfer/
├── lib/
│   ├── api-client.ts
│   ├── env.ts
│   ├── query-client.ts
│   ├── supabase.ts
│   ├── storage.ts
│   └── urls.ts
├── providers/
│   ├── AppProviders.tsx
│   └── NetworkProvider.tsx
├── scripts/
│   ├── sync-local-env.mjs
│   └── check-no-secrets.mjs
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── e2e/
│   ├── smoke-home.yaml
│   ├── smoke-news.yaml
│   ├── smoke-rehber.yaml
│   ├── smoke-citizenship.yaml
│   └── smoke-salary.yaml
├── .secret.example
├── .env.example
├── .gitignore
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Kaynak Web Repo → Mobil Repo Taşıma Haritası

| Kaynak alan | Mobil hedef | Taşıma şekli |
|---|---|---|
| `lib/public-news.ts` | `features/news/*` | Supabase sorguları ve mapper yeniden yazılacak |
| `lib/rehber/data.ts` | `features/providers/*` | Tablo ayrımı ve filtre kuralları korunacak |
| `app/(site)/vatandaslik-testi/page.tsx` | `features/citizenship/*`, mobil ekran | Query mantığı ve quiz engine ayrıştırılacak |
| `lib/salary/*` | `features/salary/*` | Saf TypeScript modülleri uyarlanacak |
| `app/(site)/banka-secim/data.ts` ve scoring | `features/recommendations/bank/*` | Veri ve scoring engine ayrıştırılacak |
| Sigorta seçim aracı data/scoring | `features/recommendations/insurance/*` | Saf iş mantığı taşınacak |
| Vize seçim aracı data/scoring | `features/recommendations/visa/*` | Saf iş mantığı taşınacak |
| Para transferi aracı data/scoring | `features/recommendations/transfer/*` | Saf iş mantığı taşınacak |
| `constants/recruitment-agencies.ts` | `constants/recruitment-agencies.ts` | İlk sürümde statik veri kopyalanacak |
| `lib/corner.ts` | `features/corner/*` | Public read sorguları mobil uyarlanacak |
| `/api/provider-submissions` | `lib/api-client.ts` | Mobil yalnızca endpoint çağıracak |
| `/api/broken-link-reports` | `lib/api-client.ts` | Mobil yalnızca endpoint çağıracak |
| Tailwind UI | Mobil component library | Birebir CSS taşıma yapılmayacak |
| Admin panel | Kapsam dışı | Taşınmayacak |
| `devuser` dashboard | Kapsam dışı | Taşınmayacak |

---

## 8. Kurulum ve Bootstrap Adımları

### Faz 0 — Repo başlatma

Hedef repo boş olduğu için PowerShell üzerinden aşağıdaki adımlarla başlanmalıdır.

```powershell
cd C:\path\to\app101
npx create-expo-app@latest . --template default@sdk-56
npm install
```

Gerekli paketler:

```powershell
npx expo install expo-image expo-linking expo-clipboard expo-secure-store @react-native-async-storage/async-storage @react-native-community/netinfo
npm install @supabase/supabase-js @tanstack/react-query @tanstack/query-async-storage-persister zod
npm install -D jest-expo @testing-library/react-native @testing-library/jest-native @types/jest prettier
```

EAS kurulumu:

```powershell
npx eas-cli@latest login
npx eas-cli@latest build:configure
```

### Faz 0 kabul kriterleri

- `npm install` hatasız tamamlanır.
- `npm run env:sync` ile `.secret` → `.env.local` dönüşümü yapılır.
- `npx expo start` çalışır.
- Android emulator veya fiziksel Android cihazda varsayılan uygulama açılır.
- `.secret` Git index'te görünmez.
- `npm run security:check` başarılı olur.

---

## 9. Çevresel Değişkenlerin Yüklenmesi

### 9.1 `lib/env.ts`

```ts
import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(10),
  EXPO_PUBLIC_WEB_API_BASE_URL: z.string().url(),
})

export const env = envSchema.parse({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  EXPO_PUBLIC_WEB_API_BASE_URL: process.env.EXPO_PUBLIC_WEB_API_BASE_URL,
})
```

### 9.2 `lib/supabase.ts`

```ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { env } from './env'

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

Not: İlk MVP'de auth kullanılmasa bile ortak Supabase client doğru biçimde hazırlanmalıdır. İleride Supabase Auth eklenirse mimari değişikliği gerektirmemelidir.

---

## 10. Navigasyon Tasarımı

### 10.1 Bottom tab

```text
Ana Sayfa | Haberler | Rehber | Araçlar | Daha Fazla
```

### 10.2 Stack ekranları

- Haber detay
- Provider detay
- Hizmet önerisi formu
- Vatandaşlık testi
- Maaş hesaplayıcı
- İş ilanları
- Arkadaşın Köşesi listesi
- Arkadaşın Köşesi yazı detayı
- Yararlı belgeler listesi
- Belge detay
- Diğer araçlar

### 10.3 Deep link hazırlığı

İlk MVP'de aşağıdaki deeplink yapıları desteklenmelidir:

```text
app101://haberler/{slug}
app101://rehber/{id}
app101://araclar/vatandaslik-testi
app101://araclar/maas-hesaplama
```

Web URL ile uygulama URL eşlemesi ikinci aşamada universal link / app link olarak eklenebilir.

---

## 11. Veri Katmanı Tasarımı

### 11.1 Query client

Önerilen cache süreleri:

| Veri | `staleTime` | Kalıcı cache | Açıklama |
|---|---:|---|---|
| Haberler | 5 dakika | Evet | Güncel içerik |
| Haber detay | 15 dakika | Evet | Tekil detay |
| Hizmet rehberi | 30 dakika | Evet | Daha yavaş değişir |
| Şehir listesi | 24 saat | Evet | Nadir değişir |
| Provider detay | 60 dakika | Evet | Nadir değişir |
| Vatandaşlık soruları | 7 gün | Evet | Offline kullanım için uygun |
| Arkadaşın Köşesi | 60 dakika | Evet | İçerik akışı |
| İş ilanları statik JSON | Uygulama paketi | Gereksiz | Bundle içinden okunur |

### 11.2 Offline davranışı

- Uygulama ilk açılışta internet varsa verileri çeker.
- Sonraki açılışlarda cache varsa ekran önce cache'i gösterir.
- İnternet geldiğinde arka planda yenileme yapılır.
- Vatandaşlık testi soruları cache üzerinden offline çalışabilir.
- Maaş hesaplama ve saf TypeScript araçları internet olmadan çalışır.
- Hizmet önerisi formu offline durumda gönderilemez; kullanıcıya açık mesaj gösterilir.

### 11.3 Network durum yönetimi

- Üstte küçük bir `OfflineBanner`
- Query retry sayısı sınırlı
- Kullanıcıya “Tekrar dene” butonu
- Teknik hata objesi doğrudan ekrana basılmaz

---

## 12. Ekran Bazlı Uygulama Planı

### 12.1 Ana sayfa

#### İçerik

- Logo ve kısa motto
- “Hızlı Başlangıç” kartları:
  - Maaşımı hesapla
  - Vatandaşlık testi çöz
  - Türkçe hizmet bul
  - Haberleri oku
- Son üç haber
- Popüler araçlar
- İş ilanları butonu
- Web sitesini aç CTA

#### Kabul kriterleri

- App açıldığında 3 saniye içinde iskelet UI görünür.
- Network yavaşsa skeleton görünür.
- Haber verisi alınamazsa diğer araç kartları çalışmaya devam eder.

### 12.2 Haber listesi

#### Sorgu

```ts
supabase
  .from('news_posts')
  .select('id, category, title, summary, content, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, show_in_carousel')
  .eq('status', 'published')
  .order('published_at', { ascending: false, nullsFirst: false })
  .order('created_at', { ascending: false })
  .range(from, to)
```

#### UI

- `FlatList`
- Haber kartı
- Kategori chipleri
- Pull-to-refresh
- Load more
- Placeholder image

#### Kabul kriterleri

- Yayında olmayan haber görünmez.
- Boş görselde fallback kullanılır.
- Bir habere tıklanınca doğru detay ekranı açılır.
- Share butonu native paylaşım ekranını açar.

### 12.3 Haber detay

#### Davranış

- Slug içinden `--{uuid}` son eki parse edilir.
- UUID ile tekil kayıt sorgulanır.
- `status = 'published'` olmayan haber açılmaz.
- İçerik sade mobil okunabilirlik ile gösterilir.
- Kaynak URL güvenli biçimde dış browser'a açılır.

#### Kabul kriterleri

- Hatalı slug için kullanıcı dostu “Haber bulunamadı” ekranı görünür.
- HTML içerik kullanılacaksa sanitize edilmiş veya kontrollü renderer kullanılmalıdır.

### 12.4 Hizmet rehberi

#### Liste davranışı

- Şehir ve kategori filtreleri
- Metin araması
- Hizmet / gastronomi ayrımını kullanıcı görmez
- Sonuçlar ortak provider modeline normalize edilir

#### Normalize örneği

```ts
export type Provider = {
  id: string
  source: 'service' | 'gastronomy'
  type: string
  name: string
  city: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
}
```

#### Kabul kriterleri

- `status = 'active'` olmayan provider görünmez.
- Tüm kategoriler filtresi iki tabloyu birleştirir.
- Restoran vb. kategoriler gastronomi tablosundan gelir.
- Tamir filtresi üç tipi birleştirir.
- Telefon numarası varsa native dialer açılır.
- Website varsa external browser açılır.

### 12.5 Hizmet önerisi

#### Endpoint

```text
POST /api/provider-submissions
```

#### Form alanları

- Tür
- Görünen ad
- Şehir
- Adres
- Telefon
- Website
- Etiketler
- Google Maps URL
- Not

#### Kritik kural

Mobil uygulama `SUPABASE_SERVICE_ROLE_KEY` kullanmayacaktır. Yalnızca mevcut web endpointine JSON gönderir.

#### Kabul kriterleri

- Zorunlu alanlar mobilde doğrulanır.
- Endpoint hata dönerse anlaşılır mesaj gösterilir.
- Başarı durumunda “Admin onayından sonra yayına alınacak” mesajı gösterilir.

### 12.6 Vatandaşlık testi

#### Quiz engine ayrıştırması

UI'dan bağımsız bir engine oluşturulmalıdır:

```ts
export type QuizMode = 'all' | 'state' | 'real'

export type QuizSession = {
  mode: QuizMode
  state?: string
  questions: CitizenshipQuestion[]
  currentIndex: number
  correctCount: number
  answered: Record<number, string>
  startedAt: number
  endsAt?: number
}
```

#### Kabul kriterleri

- `real` modda tam 33 soru gelir.
- Soru dağılımı 30 genel + 3 seçilen eyalet olur.
- Soru sırası randomize edilir.
- Timer uygulama arka plana gidip dönse bile doğru süreyi gösterir; yalnızca interval state'e güvenilmez, `endsAt` timestamp üzerinden hesap yapılır.
- Sonuç ekranında doğru sayısı ve başarı durumu görünür.
- 17 veya üzeri doğru “başarılı” olarak değerlendirilir.

### 12.7 Maaş hesaplayıcı — Beta

#### Kaynak modüller

- `calculator.ts`
- `tax-calculator.ts`
- `social-insurance.ts`
- `company-car.ts`
- `types.ts`

#### Taşıma yaklaşımı

- DOM veya Next bağımlılığı olmayan saf TS fonksiyonları mobil repoya uyarlanır.
- Unit test fixture hazırlanır.
- Web ve mobil aynı input için aynı çıktıyı vermelidir.

#### Kritik kalite uyarısı

Mevcut vergi katmanı `legacy` / simplified fallback kullanmaktadır. Bu nedenle mobil MVP'de şu metin gösterilmelidir:

> Bu hesaplama bilgilendirme ve karşılaştırma amaçlıdır. Resmî bordro veya vergi danışmanlığı yerine geçmez.

#### Kabul kriterleri

- Brüt → net ve net → brüt çalışır.
- Negatif input engellenir.
- Para formatı `de-DE`, EUR olur.
- Kesintiler ayrı ayrı gösterilir.
- En az 20 fixture ile web-mobil parity testi yapılır.
- Resmî BMF PAP doğrulaması yapılmadan “kesin sonuç” iddiası kullanılmaz.

### 12.8 İş ilanları

#### İlk sürüm kararı

Public web ekranının mevcut davranışı statik constant listesidir. Mobilde aynı liste JSON veya TS constant olarak taşınır.

#### UI

- Ajans sayısı
- İngilizce işe alan şirket sayısı
- Arama
- Ana kategori
- Alt kategori
- Dış website
- Kırık link bildirimi

#### Kabul kriterleri

- Statik veri uygulama içinde çalışır.
- Filtreleme internet olmadan çalışır.
- Kırık link bildirimi endpointine gönderilir.

### 12.9 Arkadaşın Köşesi

#### Supabase sorguları

- `corner_authors.is_active = true`
- `corner_posts.status = 'published'`

#### UI

- Yazar listesi
- Yazı listesi
- Yazı detayı
- Yazar avatarı
- Okuma süresi
- Share butonu

#### Kabul kriterleri

- Aktif olmayan yazar görünmez.
- Yayında olmayan yazı görünmez.
- Detay slug sonundaki UUID üzerinden açılır.

---

## 13. Saf TypeScript Araçlarının Mobil Uyarlaması

Araçların çoğu server zorunluluğu olmadan cihazda çalışabilir. İş mantığı ekranlardan ayrıştırılmalıdır.

### 13.1 Banka seçim aracı

Kaynak kodda skor yaklaşımı mevcuttur:

- `QUESTIONS`
- `PROFILES`
- `BANKS`
- Kullanıcının cevaplarından profil skorları
- Banka ağırlıkları
- En yüksek puanlı ilk üç öneri

Mobil hedef yapı:

```text
features/recommendations/bank/
├── data.ts
├── engine.ts
├── types.ts
└── engine.test.ts
```

### 13.2 Sigorta, vize ve para transferi

Aynı desen kullanılmalıdır:

```text
questions -> answers -> scores -> recommendation result
```

UI yalnızca engine çıktısını gösterir. Böylece iş mantığı test edilebilir olur.

### 13.3 Tatil planlayıcılar

- Hesaplama modülleri saf TS olarak taşınır.
- Yıl sabitini config dosyasına alın.
- 2027 güncellemesi tek noktadan yapılabilsin.

### 13.4 StepStone karşılaştırma

- Kaynak veri statikse versiyonlanmış JSON kullanın.
- Veri kaynağı yılı ekranda görünür olmalıdır.
- Eski veri kullanılıyorsa kullanıcıya “2026 raporu” gibi açık etiket gösterilmelidir.

---

## 14. API Wrapper Tasarımı

Dosya:

```text
lib/api-client.ts
```

Önerilen yapı:

```ts
import { env } from './env'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${env.EXPO_PUBLIC_WEB_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.error || 'İşlem tamamlanamadı.'
    throw new Error(message)
  }

  return data as T
}

export function submitProviderSuggestion(payload: ProviderSuggestionPayload) {
  return apiFetch<{ ok: true; message: string }>('/api/provider-submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitBrokenLinkReport(payload: BrokenLinkPayload) {
  return apiFetch<{ success: true }>('/api/broken-link-reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
```

---

## 15. Uygulama Fazları ve Teslimatlar

## Faz 0 — Bootstrap ve güvenlik temeli

### İşler

- Expo SDK 56 proje kurulumu
- Expo Router
- `.gitignore`
- `.secret.example`
- `env:sync`
- `security:check`
- EAS yapılandırması
- Android package name
- Splash ve icon placeholder

### Çıktı

- Çalışan boş mobil uygulama
- Güvenli credential akışı

### Definition of Done

- Android cihazda app açılır.
- `.secret` commit edilmez.
- Server-only secret mobil env dosyasına geçmez.

---

## Faz 1 — Design system ve navigasyon

### İşler

- Theme tokenları
- Bottom tabs
- Ortak header
- Loading, error, empty state
- Offline banner
- Ortak kart ve butonlar
- Ana sayfa statik ilk sürüm

### Çıktı

- Tüm ana rotalara gidilebilen mobil shell

### Definition of Done

- Navigasyon smoke testi geçer.
- Android geri butonu beklenen davranışı gösterir.
- Küçük ekranlarda taşma olmaz.

---

## Faz 2 — Supabase public read altyapısı

### İşler

- `lib/supabase.ts`
- Query provider
- Persisted cache
- NetInfo entegrasyonu
- Haber API ve hooks
- Hizmet rehberi API ve hooks
- Vatandaşlık soru API
- Corner API ve hooks

### Çıktı

- Public veriyi RLS üzerinden okuyabilen ortak veri katmanı

### Definition of Done

- Publishable key ile public tablolar okunur.
- Service role kullanılmaz.
- Offline cache testi geçer.

---

## Faz 3 — Haberler ve Arkadaşın Köşesi

### İşler

- Haber liste ekranı
- Haber detay
- Share
- Corner liste
- Corner detay

### Çıktı

- İçerik tüketim akışları

### Definition of Done

- Yayında olmayan içerik görünmez.
- Hatalı UUID kullanıcı dostu ekrana gider.

---

## Faz 4 — Hizmet rehberi ve yazma endpointleri

### İşler

- Provider filtreleri
- Provider detay
- Dialer / browser aksiyonları
- Hizmet önerisi formu
- İş ilanı listesi
- Kırık link formu

### Çıktı

- Rehber ve kontrollü form gönderimleri

### Definition of Done

- `providers` ve `gastronomy_providers` sonuçları doğru birleşir.
- Service role mobilde bulunmaz.
- Form doğrulama hem mobilde hem backendde çalışır.

---

## Faz 5 — Vatandaşlık testi

### İşler

- Quiz engine
- Üç mod
- Timer
- Cache
- Sonuç ekranı
- Offline senaryo

### Çıktı

- E2E vatandaşlık testi deneyimi

### Definition of Done

- Gerçek sınav modu 30 + 3 soru üretir.
- Timer arka plana gidip dönmede bozulmaz.
- Offline cache üzerinden test açılır.

---

## Faz 6 — Maaş hesaplayıcı beta

### İşler

- Saf salary modüllerini taşı
- Mobil form
- Sonuç breakdown
- Beta uyarısı
- Web parity fixture testleri

### Çıktı

- Offline çalışan brüt / net hesaplayıcı

### Definition of Done

- Web ile fixture parity testleri geçer.
- Kullanıcıya referans niteliği açıkça bildirilir.

---

## Faz 7 — Diğer araçlar

### İşler

- Banka
- Sigorta
- Vize
- Para transferi
- Tatil planlayıcılar
- StepStone karşılaştırma

### Çıktı

- Araç merkezinin genişletilmiş hali

### Definition of Done

- Her engine UI'dan ayrılmıştır.
- Her engine için unit test vardır.
- İnternet yokken saf araçlar çalışır.

---

## Faz 8 — Kalite, APK ve yayın hazırlığı

### İşler

- Unit test
- Integration test
- Maestro smoke test
- Android internal APK
- Fiziksel cihaz testleri
- Crash kontrolü
- Gizlilik sayfası
- Store açıklaması taslağı
- Uygulama ikonları

### Çıktı

- Dağıtılabilir internal Android APK

### Definition of Done

- EAS internal distribution APK üretir.
- Minimum smoke test paketi geçer.
- `.secret` veya server credential bundle içinde bulunmaz.

---

## 16. Test Stratejisi

### 16.1 Unit test zorunlu alanları

- Haber slug parse
- Haber row mapper
- Provider normalize
- Provider kategori tablo seçimi
- Tamir kategori birleşimi
- Vatandaşlık random session üretimi
- Gerçek sınav 30 + 3 dağılımı
- Timer timestamp hesaplaması
- Maaş hesaplayıcı fixture testleri
- Netten brüte binary search
- Banka öneri scoring engine
- Diğer recommendation engine'leri
- Env allowlist
- Secret tarayıcı

### 16.2 Integration test zorunlu alanları

Test Supabase veya fixture client kullanılarak:

- `news_posts` published filtrelemesi
- `providers` active filtrelemesi
- `gastronomy_providers` active filtrelemesi
- `vatandaslik_sorulari` eyalet filtrelemesi
- Hizmet önerisi endpoint payload doğrulaması
- Kırık link endpoint hata davranışı

### 16.3 Maestro smoke testleri

#### `smoke-home.yaml`

- App aç
- Ana sayfa görünür
- Araçlar tabına git
- Haberler tabına git
- Geri dön

#### `smoke-news.yaml`

- Haberler tabı
- İlk habere tıkla
- Detay açılır
- Paylaş butonu görünür

#### `smoke-rehber.yaml`

- Rehber tabı
- Şehir filtresi açılır
- Kategori seçilir
- Provider kartına tıklanır

#### `smoke-citizenship.yaml`

- Araçlar
- Vatandaşlık testi
- Gerçek deneme
- Eyalet seç
- İlk soruyu cevapla
- Sonraki soruya geç

#### `smoke-salary.yaml`

- Araçlar
- Maaş hesaplama
- Brüt maaş gir
- Hesapla
- Net maaş sonucu görünür

### 16.4 Fiziksel cihaz matrisi

En az:

- Bir orta segment Android cihaz
- Bir modern yüksek çözünürlüklü Android cihaz
- Android emulator
- Dar ekran
- Büyük ekran
- İnternet kapalı senaryo
- Yavaş ağ senaryosu

---

## 17. Performans ve UX Kabul Kriterleri

- İlk anlamlı ekran hızlı görünmelidir; network cevabı beklenirken skeleton gösterilmelidir.
- Listelerde `ScrollView` yerine `FlatList` kullanılmalıdır.
- Görseller `expo-image` ile cache edilmelidir.
- Haber ve provider listelerinde gereksiz tüm alanlar çekilmemelidir.
- Her ekran loading, error ve empty state içermelidir.
- Dış URL açılmadan önce URL doğrulanmalıdır.
- Telefon numarası yalnızca varsa dialer'a gönderilmelidir.
- Ekran başlıkları Türkçe olmalıdır.
- Dokunma alanları mobil erişilebilirlik için yeterli büyüklükte olmalıdır.
- Kritik butonlarda loading state bulunmalıdır.

---

## 18. Güvenlik Kontrol Listesi

### Mobil uygulama

- [ ] `.secret` Git'te yok
- [ ] `.env.local` Git'te yok
- [ ] Yalnızca `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_WEB_API_BASE_URL` bundle'a giriyor
- [ ] `service_role` yok
- [ ] Admin şifresi yok
- [ ] Google Places server key yok
- [ ] Source URL'ler açılmadan doğrulanıyor
- [ ] Form payloadları Zod ile kontrol ediliyor
- [ ] Network hata detayları kullanıcıya ham biçimde gösterilmiyor

### Supabase

- [ ] Public read tablolarında RLS açık
- [ ] Public tablolarda yalnızca gerekli SELECT politikaları var
- [ ] Yazma işlemleri mümkünse server endpoint üzerinden gidiyor
- [ ] Mobil istemci doğrudan admin tablosuna yazmıyor
- [ ] `service_role` yalnızca server ortamında

### Kaynak web repo için ayrıca açılması gereken hardening işleri

1. `lib/public-news.ts` içindeki read-client fallback listesinden `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SERVICE_KEY`, `SUPABASE_SECRET_KEY` kaldırılmalı veya yalnızca zorunlu server job kullanımına özel ayrıştırılmalıdır.
2. `lib/corner.ts` içindeki read-client fallback listesinden service-role fallback kaldırılmalıdır.
3. `/api/supabase-config` route içindeki hardcoded publishable key ve revoked key fallback yaklaşımı sadeleştirilmelidir. Publishable key gizli değildir; ancak config drift ve eski key kullanım riski yaratır.
4. RLS canary testi eklenmelidir: mobil publishable key ile yalnızca beklenen tabloların beklenen satırları okunabilmelidir.
5. Salary hesaplayıcının “legacy simplified” hesaplaması bordro seviyesi doğruluk iddiasıyla sunulmamalıdır.

---

## 19. EAS Android Build Planı

### 19.1 `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### 19.2 İlk internal APK

```powershell
npm run env:sync
npm run security:check
npx eas-cli@latest build --platform android --profile preview
```

### 19.3 Production AAB

```powershell
npm run env:sync
npm run security:check
npm test
npx eas-cli@latest build --platform android --profile production
```

---

## 20. `package.json` Script Önerisi

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "env:sync": "node scripts/sync-local-env.mjs",
    "security:check": "node scripts/check-no-secrets.mjs",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "verify": "npm run security:check && npm run lint && npm run typecheck && npm test"
  }
}
```

---

## 21. AI Coding Agent İçin Uygulama Kuralları

Aşağıdaki kurallar hedef repoda `AGENTS.md` veya `CLAUDE.md` içine yazılmalıdır:

1. Kullanıcıya görünen tüm metinler Türkçe olmalıdır.
2. Mobil uygulama WebView tabanlı kurulmayacaktır.
3. Kaynak web UI birebir kopyalanmayacaktır; iş mantığı ve veri kontratı taşınacaktır.
4. `.secret` dosyası repo kökündedir ve Git'e commit edilmez.
5. `.secret` içindeki değerlerin tamamını mobil env'e aktarmak yasaktır.
6. Yalnızca allowlist public değerler `.env.local` içine yazılır.
7. `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_SECRET_KEY`, admin şifreleri ve salt değerleri mobil source code içinde hiçbir şekilde bulunamaz.
8. Public read işlemleri publishable key + RLS ile yapılır.
9. Kontrollü write işlemleri mevcut web API endpointlerine gönderilir.
10. Her yeni özellik loading, error ve empty state içermelidir.
11. Her yeni saf iş mantığı için unit test yazılmalıdır.
12. Her faz sonunda `npm run verify` çalıştırılmalıdır.
13. TypeScript strict mode korunmalıdır.
14. `any` kullanımından kaçınılmalıdır.
15. Harici linkler güvenli şekilde doğrulanarak açılmalıdır.
16. Android ilk önceliktir; iOS uyumluluğunu bilerek bozacak kod yazılmamalıdır.
17. Maaş hesaplayıcı beta uyarısı kaldırılmamalıdır; BMF doğrulaması ayrı issue tamamlanmadan kesinlik iddiası kullanılamaz.
18. İş ilanları ekranı ilk sürümde statik veri kullanır; Supabase'e geçiş ürün kararı olmadan yapılmaz.
19. Genel kullanıcı auth, admin panel ve `devuser` dashboard MVP kapsamına eklenmez.
20. Her anlamlı faz ayrı commit olmalıdır.

---

## 22. Önerilen Commit Sırası

```text
chore: initialize expo sdk 56 app
chore: add secure local secret sync workflow
chore: add app theme and reusable mobile ui primitives
feat: add expo router tab navigation and home shell
feat: add supabase public read client and persisted query cache
feat: add news list and detail screens
feat: add provider directory and filtering
feat: add provider suggestion api flow
feat: add jobs directory and broken-link reporting
feat: add citizenship quiz with offline cache
feat: add salary calculator beta with parity fixtures
feat: add corner authors and article detail screens
feat: add recommendation tools
feat: add holiday and stepstone tools
chore: add maestro smoke suite and eas preview apk config
docs: add android mvp release checklist
```

---

## 23. Release Öncesi Son Kontrol

### Fonksiyonel

- [ ] Uygulama açılıyor
- [ ] Ana sayfa kartları çalışıyor
- [ ] Haber listesi geliyor
- [ ] Haber detay açılıyor
- [ ] Rehber filtreleri çalışıyor
- [ ] Provider detay aksiyonları çalışıyor
- [ ] Hizmet önerisi gönderiliyor
- [ ] Vatandaşlık testi üç modda çalışıyor
- [ ] Timer doğru davranıyor
- [ ] Maaş hesaplayıcı beta çalışıyor
- [ ] İş ilanları aranabiliyor
- [ ] Kırık link bildirimi gönderiliyor
- [ ] Offline durumda cache davranışı anlaşılır

### Teknik

- [ ] `npm run verify` geçiyor
- [ ] Maestro smoke testleri geçiyor
- [ ] APK fiziksel cihazda kuruluyor
- [ ] `.secret` Git'te yok
- [ ] Bundle içinde forbidden credential yok
- [ ] Public Supabase sorguları yalnızca beklenen veriyi okuyor
- [ ] API base URL production domaini doğru

---

## 24. Kullanıcıdan Netleştirilmesi Gereken Kararlar

Aşağıdaki maddeler geliştirmeyi bloke etmeden varsayımla ilerletilebilir; ancak ilk APK öncesi netleştirilmelidir.

1. **Canonical production API domaini nedir?**  
   Varsayılan öneri: `https://almanya101.de`  
   Kaynak repo bazı yerlerde `.com` varsayımı da içeriyor. Mobil endpointler için tek bir canonical origin seçilmelidir.

2. **İlk hedef yalnızca Android mi?**  
   Varsayılan öneri: Evet. Önce internal Android APK; ardından Google Play AAB. Kod mimarisi iOS uyumlu tutulur.

3. **İlk APK kapsamına hangi araçlar kesin olarak girmeli?**  
   Varsayılan öneri: Haberler, Rehber, Vatandaşlık Testi, Maaş Hesaplayıcı Beta ve İş İlanları zorunlu; diğer araçlar P1.

4. **Uygulama adı ve Android package name nedir?**  
   Varsayılan öneri: Uygulama adı `almanya101`; package name `de.almanya101.app`.

5. **Mevcut almanya101 logosu ve splash görseli mobilde aynen kullanılacak mı?**  
   Varsayılan öneri: İlk MVP'de mevcut logo, sade splash ve siyah / beyaz arka plan kullanılır.

6. **Analytics isteniyor mu?**  
   Varsayılan öneri: İlk internal APK'de eklenmez. Store sürümünden önce GDPR uyumlu ve minimal event seti belirlenir.

7. **Topluluk ve login özelliği ilk sürümde gerçekten kapsam dışı mı?**  
   Varsayılan öneri: Evet. Önce public utility app yayınlanır.

8. **`.secret` hedef repo kökünde mi bulunacak, yoksa iki repoyu kapsayan ortak workspace kökünde mi?**  
   Varsayılan öneri: `app101/.secret`. Mobil build kendi repo kökünden bağımsız çalışabilmelidir.

---

## 25. İlk Uygulama Sprinti İçin Kesin Görev Listesi

AI coding agent ilk sprintte yalnızca aşağıdaki işleri yapmalıdır:

1. Boş `app101` reposunda Expo SDK 56 projesini oluştur.
2. `.gitignore`, `.secret.example`, `scripts/sync-local-env.mjs`, `scripts/check-no-secrets.mjs` dosyalarını ekle.
3. `npm run env:sync`, `npm run security:check`, `npm run typecheck`, `npm run lint`, `npm test` scriptlerini çalışır hale getir.
4. Theme tokenları ve ortak UI primitive bileşenlerini oluştur.
5. Expo Router tab navigasyonunu kur.
6. Ana sayfa shell ekranını hazırla.
7. `lib/env.ts`, `lib/supabase.ts`, `lib/query-client.ts` ekle.
8. `features/news` veri katmanını yaz.
9. Haber liste ve detay ekranlarını hazırla.
10. Haber akışı için loading, error, empty, offline durumlarını ekle.
11. En az şu testleri ekle:
    - env allowlist
    - secret scan
    - news slug parse
    - news row mapper
12. Preview Android APK hazırlamadan önce `npm run verify` çalıştır.

İlk sprint tamamlandıktan sonra rehber ve vatandaşlık testi fazına geçilmelidir.

---

## 26. Sonuç

Bu proje için en doğru MVP stratejisi, web uygulamasını mobilde tekrar çizmekten ziyade mevcut veri modelini ve saf TypeScript iş kurallarını kontrollü biçimde yeniden kullanmaktır.

En önemli teknik sınır şudur:

> `.secret` repo kökünde tüm credential değerlerini içerebilir; ancak mobil uygulama yalnızca allowlist ile seçilen public değerleri bundle içine almalıdır. Server credential değerleri hiçbir koşulda mobil uygulamaya girmemelidir.

Bu plan uygulandığında ilk Android APK; haberler, Türk hizmet rehberi, vatandaşlık testi, maaş hesaplama beta ve iş ilanları gibi kullanıcıya doğrudan değer veren modüllerle yayınlanabilir. Topluluk ve kullanıcı hesabı gibi daha karmaşık alanlar sağlam bir public MVP sonrasında eklenebilir.

---

## 27. İncelenen Temel Kaynak Dosyalar

Kaynak repo içinde özellikle aşağıdaki dosyalar incelenmiştir:

```text
package.json
CLAUDE.md
.env.example
.gitignore
constants/navigation.ts
lib/supabase/client.ts
lib/supabase/server.ts
lib/public-news.ts
lib/rehber/data.ts
lib/corner.ts
lib/salary/calculator.ts
lib/salary/tax-calculator.ts
lib/salary/social-insurance.ts
app/(site)/vatandaslik-testi/page.tsx
app/(site)/banka-secim/BankaClient.tsx
app/(marketing)/is-ilanlari/page.tsx
components/sections/RecruitmentAgencies.tsx
app/api/provider-submissions/route.ts
app/api/broken-link-reports/route.ts
app/api/supabase-config/route.ts
supabase/migrations/20260412120000_create_recruitment_agencies.sql
```

Resmî teknik referanslar:

```text
https://docs.expo.dev/versions/latest/
https://docs.expo.dev/router/introduction/
https://docs.expo.dev/build/setup/
https://docs.expo.dev/build/internal-distribution/
https://docs.expo.dev/guides/environment-variables/
https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native
https://supabase.com/docs/guides/getting-started/api-keys
https://supabase.com/docs/guides/database/postgres/row-level-security
```
