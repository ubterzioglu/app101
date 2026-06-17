# MAIN_PROMPT.md — almanya101 Mobile App Modern Design Upgrade

You are a senior React Native / Expo mobile UI engineer, product designer, and design-system architect.

Your task is to modernize the visual design and user experience of the `ubterzioglu/app101` repository.

The goal is to transform the current almanya101 mobile app from a simple MVP-style app into a polished, modern, premium-looking Android mobile app while preserving the existing architecture, routes, data flow, business logic, security rules, and Turkish content.

---

## 1. Project Context

Repository:

```text
ubterzioglu/app101
```

Product:

```text
almanya101
```

Target users:

```text
Turkish speakers living in Germany or planning to move to Germany.
```

Product promise:

```text
Almanya’da yaşayan veya Almanya’ya taşınmayı planlayan Türk kullanıcı; haberleri takip edebilmeli, Türkçe hizmet veren uzmanları arayabilmeli, temel rehber araçlarını kullanabilmeli ve vatandaşlık testine hazırlanabilmelidir.
```

Brand motto:

```text
Yalnız değilsin. almanya101 seninle.
```

The app should feel:

```text
modern
trustworthy
premium
mobile-first
friendly
energetic
useful
slightly futuristic
community-oriented
Germany-focused
Turkish diaspora-focused
```

---

## 2. Technical Context

This is an Expo / React Native app.

Use the current architecture. Do not rewrite the app from scratch.

Known stack:

```text
Expo SDK 56
React Native
React 19
TypeScript
Expo Router
TanStack Query
Supabase
expo-image
react-native-safe-area-context
react-native-gesture-handler
react-native-reanimated
StyleSheet-based styling
```

The app uses:

```text
expo-router/entry
```

The project already has shared design tokens:

```text
theme/colors.ts
theme/tokens.ts
theme/index.ts
```

The project already has reusable UI components:

```text
components/ui/AppCard.tsx
components/ui/AppButton.tsx
components/ui/AppTextInput.tsx
components/ui/AppSelect.tsx
components/ui/EmptyState.tsx
components/ui/ErrorState.tsx
components/ui/LoadingCard.tsx
components/ui/OfflineBanner.tsx
```

The project already has layout components:

```text
components/layout/ScreenContainer.tsx
components/layout/AppHeader.tsx
```

Existing main tabs:

```text
app/(tabs)/index.tsx
app/(tabs)/haberler.tsx
app/(tabs)/rehber.tsx
app/(tabs)/araclar.tsx
app/(tabs)/daha-fazla.tsx
```

Existing route structure must be preserved.

Do not rename routes unless absolutely necessary.

Do not break existing imports using `@/`.

Do not break Expo Router typed routes.

---

## 3. Core Design Goal

Upgrade the app visually without breaking functionality.

The app should no longer feel like a basic MVP list app.

It should feel like a polished modern Android app with:

```text
dark premium visual identity
strong yellow/black/white brand system
modern dashboard-style home screen
premium card components
better bottom navigation
modern filter chips
better typography hierarchy
more breathing room
subtle glow effects
clean editorial news layout
modern service directory search experience
clear tool-center structure
consistent section headers
better empty/error/loading states
```

---

## 4. Visual Direction

Use the existing black/yellow/white identity, but make it richer.

Avoid flat pure-black-only screens.

Use:

```text
deep graphite backgrounds
layered dark surfaces
warm yellow accents
soft yellow glow
subtle borders
elevated cards
rounded corners
large readable titles
clean secondary text
modern pill chips
CTA blocks
dashboard-style sections
```

Design inspiration:

```text
modern fintech app
premium dark-mode dashboard
German efficiency + Turkish warmth
community platform
AI-era mobile app
```

Do not make it childish.

Do not make it too cartoonish.

Do not overuse emoji. Existing emoji icons may remain where useful, but the UI should not depend only on emoji to look good.

---

## 5. Dependency Rules

Prefer the current StyleSheet approach.

Do not add a heavy UI framework.

Do not add NativeWind unless absolutely required.

Do not add a full icon framework unless already available or Expo-compatible.

If gradients are needed, use Expo-compatible linear gradients:

```bash
npx expo install expo-linear-gradient
```

If icons are needed, prefer Expo-compatible vector icons only if already available through Expo or safely installable.

Do not add libraries that create build instability.

---

## 6. Hard Constraints

Do not:

```text
rewrite the app from scratch
replace screens with WebView
remove existing routes
break Supabase queries
break TanStack Query hooks
change database schema
hardcode secrets
commit .secret or .env values
expose service_role keys
change security model
introduce login/auth
introduce admin features
add unfinished broken routes
add fake backend logic
remove accessibility labels
make text unreadable
hide content behind bottom tabs
ignore TypeScript errors
```

Preserve:

```text
existing navigation
existing screen names
existing data hooks
existing business logic
existing Turkish text where already present
existing environment handling
existing offline/error/loading behavior
existing tests
```

---

## 7. Design System Upgrade

Upgrade `theme/colors.ts`.

Keep existing token names working:

```ts
surface0
surface1
surface2
surface3
surface4
border
borderStrong
textPrimary
textSecondary
textMuted
textInverse
background
surface
accent
accentPressed
error
success
warning
yellow
yellowLight
yellowDim
black
white
```

Add useful new tokens if needed:

```ts
surfaceElevated
surfaceGlass
surfaceOverlay
accentSoft
accentMuted
yellowGlow
blueAccent
greenAccent
redAccent
orangeAccent
shadowColor
overlay
```

Suggested design direction:

```ts
background: '#050505'
surface0: '#050505'
surface1: '#101010'
surface2: '#171717'
surface3: '#202020'
surface4: '#2A2A2A'
accent: '#F5C518'
accentSoft: 'rgba(245, 197, 24, 0.14)'
yellowGlow: 'rgba(245, 197, 24, 0.28)'
textPrimary: '#FFFFFF'
textSecondary: '#C9C9C9'
textMuted: '#777777'
border: 'rgba(255,255,255,0.08)'
borderStrong: 'rgba(245,197,24,0.35)'
```

Upgrade `theme/tokens.ts`.

Keep current token names working:

```ts
spacing
radius
fontSize
fontWeight
lineHeight
MIN_TOUCH_TARGET
MAX_CONTENT_WIDTH
```

Expand safely:

```ts
spacing.xxxl
radius.xxl
fontSize.display
iconSize
cardPadding
shadow/elevation presets
```

Use consistent spacing across all screens.

---

## 8. Shared UI Components

Create or upgrade the following components.

### 8.1 AppCard / ModernCard

Either upgrade `AppCard` while preserving its existing props, or create a new `ModernCard`.

Must support:

```text
pressable and non-pressable modes
existing children prop
existing onPress prop
existing accentColor prop
existing style prop
existing accessibilityLabel prop
elevated visual style
subtle border
rounded corners
pressed feedback
optional glow/accent style
```

Do not break existing `AppCard` imports.

### 8.2 SectionHeader

Create:

```text
components/ui/SectionHeader.tsx
```

Props:

```ts
title: string
subtitle?: string
icon?: string
actionLabel?: string
onActionPress?: () => void
```

Use it across Home, Haberler, Rehber, Araçlar, Daha Fazla where useful.

### 8.3 ModernChip

Create:

```text
components/ui/ModernChip.tsx
```

Props:

```ts
label: string
icon?: string
active?: boolean
onPress?: () => void
variant?: 'yellow' | 'green' | 'blue' | 'neutral'
```

Use it for:

```text
news category filters
provider category filters
tool badges where useful
```

### 8.4 InfoBadge

Create:

```text
components/ui/InfoBadge.tsx
```

Props:

```ts
label: string
icon?: string
variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'muted'
```

Use it for:

```text
Beta
Aktif
Yakında
category
reading time
source
date
```

### 8.5 HeroPanel

Create:

```text
components/ui/HeroPanel.tsx
```

Purpose:

```text
Reusable premium hero section for the home screen and possibly tools screen.
```

Should support:

```ts
title: string
subtitle?: string
description?: string
primaryActionLabel?: string
secondaryActionLabel?: string
onPrimaryAction?: () => void
onSecondaryAction?: () => void
image?: React.ReactNode
```

Use subtle dark/yellow premium styling.

If using gradients, use `expo-linear-gradient`.

### 8.6 QuickActionCard

Create:

```text
components/ui/QuickActionCard.tsx
```

Props:

```ts
icon: string
title: string
subtitle?: string
accentColor?: string
onPress: () => void
```

Use it on the home screen.

---

## 9. Home Screen Upgrade

File:

```text
app/(tabs)/index.tsx
```

Current home screen is too basic.

Replace it with a modern dashboard home.

Use `ScrollView`.

Keep safe-area behavior.

Use `ScreenContainer`.

Use existing `TOOL_LINKS` and `QUICK_ACTIONS` from:

```text
constants/navigation.ts
```

### Required Home Layout

#### 9.1 Hero Section

Create a premium hero section with:

```text
almanya101 logo
title: almanya101
subtitle: Yalnız değilsin. almanya101 seninle.
description: Almanya’daki hayatını kolaylaştıran haberler, rehberler, araçlar ve topluluk bağlantıları.
```

Use:

```text
assets/images/logoandroid.png
```

Add CTA buttons:

```text
Vatandaşlık Testine Başla -> /araclar/vatandaslik-testi
Hizmet Rehberi -> /(tabs)/rehber
```

Visual style:

```text
large rounded hero card
dark elevated background
soft yellow glow
decorative circles/orbs
premium logo placement
strong title hierarchy
```

#### 9.2 Quick Actions

Section title:

```text
Hızlı Başlangıç
```

Subtitle:

```text
En çok kullanılan alanlara tek dokunuşla ulaş.
```

Use `QUICK_ACTIONS`.

Render 2-column cards.

Each card should have:

```text
icon
label
short helper text
accent detail
pressed feedback
```

Suggested helper texts:

```text
Maaşımı Hesapla -> Brüt/net hesabı için hızlı başlangıç.
Vatandaşlık Testi -> Almanca ve Türkçe sorularla hazırlan.
Türkçe Hizmet Bul -> Şehir ve kategoriye göre uzman ara.
Haberleri Oku -> Almanya gündemini Türkçe takip et.
```

#### 9.3 Popular Tools

Section title:

```text
Popüler Araçlar
```

Show selected tools from `TOOL_LINKS`:

```text
Vatandaşlık Testi
Maaş Hesaplayıcı
İş İlanları
Banka Seçim Aracı
Sigorta Seçim Aracı
```

Use horizontal cards or a clean 2-column grid.

Each item should show:

```text
icon
title
phase badge
chevron
```

#### 9.4 Community Block

Add a modern CTA block:

Title:

```text
Almanya’da yolunu birlikte bulalım
```

Text:

```text
Haberler, rehberler ve pratik araçlarla günlük kararlarını daha kolay ver.
```

CTA:

```text
Topluluğa Katıl -> /topluluk
```

#### 9.5 News Teaser

If existing news hooks can be reused safely, show the latest 2 or 3 news items.

If this risks breaking the screen, show a polished CTA card instead:

Title:

```text
Son Haberler
```

Text:

```text
Almanya, Türkiye, Avrupa ve Dünya gündeminden seçilen Türkçe içerikler.
```

CTA:

```text
Haberleri Aç -> /(tabs)/haberler
```

Do not create broken data fetching.

---

## 10. Bottom Tab Navigation Upgrade

File:

```text
app/(tabs)/_layout.tsx
```

Keep all tabs and names.

Improve the tab bar visually.

Target design:

```text
premium dark floating tab bar
slightly elevated
soft top border
rounded feel
active tab yellow
inactive tab muted grey
better label spacing
safe area support
no content overlap
```

Current emoji icons may remain if no icon library is added, but improve presentation.

If using active icon bubble:

```text
active icon inside subtle yellow translucent rounded background
inactive icon normal
```

Do not break tab routing.

---

## 11. App Header Upgrade

File:

```text
components/layout/AppHeader.tsx
```

Preserve props:

```ts
title
showBack
rightSlot
```

Improve:

```text
modern elevated dark header
subtle bottom border
better title typography
better back button
larger touch target
support long titles with numberOfLines
rightSlot still works
```

Optional:

```ts
subtitle?: string
```

Only add subtitle if it does not break existing usage.

---

## 12. Haberler Screen Upgrade

File:

```text
app/(tabs)/haberler.tsx
```

Preserve:

```text
useNewsList
splitHeroArticle
category filter
pull-to-refresh
pagination
loading state
error state
empty state
detail routing
```

Improve layout:

```text
add intro area below header
modern category chips using ModernChip
premium hero news card
better news list cards
better image placeholders
metadata badges
cleaner spacing
```

Intro text:

```text
Almanya ve dünyadan seçilen güncel haberleri Türkçe takip et.
```

Modernize:

```text
components/news/NewsCard.tsx
components/news/NewsHeroCard.tsx
```

News card should show:

```text
image or branded placeholder
category badge
title
excerpt
source
date
reading time
```

Hero card should feel editorial and premium.

Do not break detail route:

```text
/haberler/[slug]
```

---

## 13. Rehber Screen Upgrade

File:

```text
app/(tabs)/rehber.tsx
```

Preserve:

```text
useCities
useProviders
filterProvidersByQuery
category state
city state
query state
provider detail routing
loading/error/empty states
```

Improve:

```text
modern intro section
premium search panel
better AppTextInput styling
better AppSelect styling
ModernChip category filters
more attractive provider cards
```

Intro text:

```text
Almanya’da Türkçe hizmet veren uzmanları, işletmeleri ve topluluk kaynaklarını keşfet.
```

Modernize:

```text
components/providers/ProviderFilters.tsx
components/providers/ProviderCard.tsx
```

Provider card should show:

```text
category icon
provider name
category label
city
description
small detail hint: Detayları gör
```

Keep accessibility.

Keep keyboard behavior safe.

---

## 14. Araçlar Screen Upgrade

File:

```text
app/(tabs)/araclar.tsx
```

Current list is too flat.

Redesign as a modern tool center.

Required structure:

```text
Header
Hero/introduction block
Öne Çıkan Araçlar
Diğer Araçlar
```

Hero title:

```text
Almanya araç kutun
```

Hero text:

```text
Maaş, vatandaşlık, iş ve günlük hayat kararları için pratik araçlar.
```

Use `TOOL_LINKS`.

Separate by phase:

```text
p0 -> Öne Çıkan Araçlar
p1 -> Diğer Araçlar
```

Each tool card should show:

```text
icon
label
short explanation
badge: Aktif / Beta / Yakında
chevron
```

Suggested helper texts:

```text
Vatandaşlık Testi -> Sorularla sınava hazırlan.
Maaş Hesaplayıcı -> Brüt/net tahmini hesapla.
İş İlanları -> Almanya odaklı kaynakları keşfet.
Banka Seçim Aracı -> Banka seçeneklerini karşılaştır.
Sigorta Seçim Aracı -> Sigorta kararını kolaylaştır.
Para Transferi Aracı -> Transfer seçeneklerini incele.
Vize Seçim Aracı -> Vize sürecinde yön bul.
Tatil Planlayıcı Türkiye -> Türkiye tatilini planla.
Tatil Planlayıcı Almanya -> Almanya içi tatil fikirleri bul.
StepStone Karşılaştırma -> Maaş ve kariyer verilerini karşılaştır.
```

Do not create broken navigation.

If a route exists, keep it clickable.

If a route does not exist, either keep current behavior only if already working, or show disabled/coming-soon state.

---

## 15. Daha Fazla Screen Upgrade

File:

```text
app/(tabs)/daha-fazla.tsx
```

Modernize as a grouped menu.

Use existing `MORE_LINKS`.

Suggested structure:

```text
Header
Community CTA card
Content & Guides group
Support & Contact group
Legal & App group
External website CTA
```

Cards should be modern list rows with:

```text
icon
title
optional subtitle
chevron
```

External links should still open correctly.

Do not break current link behavior.

---

## 16. Detail Screens

Do not fully rewrite all detail screens unless simple and safe.

Apply design-system improvements where obvious.

Candidate screens:

```text
app/haberler/[slug].tsx
app/rehber/[id].tsx
app/yazi-dizisi/index.tsx
app/yazi-dizisi/[slug].tsx
app/yazi-dizisi/yazar/[slug].tsx
app/topluluk.tsx
app/tatil.tsx
app/almanyada-yasam.tsx
app/araclar/vatandaslik-testi.tsx
app/araclar/maas-hesaplama.tsx
```

Improve:

```text
spacing
headers
cards
badges
CTA buttons
readability
dark surfaces
section hierarchy
```

Do not change business logic.

---

## 17. Loading, Error, Empty, Offline States

Upgrade existing states visually.

Files:

```text
components/ui/LoadingCard.tsx
components/ui/EmptyState.tsx
components/ui/ErrorState.tsx
components/ui/OfflineBanner.tsx
```

Make them:

```text
more polished
consistent with dark/yellow theme
clear
not too large
not too flat
accessible
```

Offline banner should be visible but not ugly.

---

## 18. Inputs and Selects

Upgrade:

```text
components/ui/AppTextInput.tsx
components/ui/AppSelect.tsx
```

Target:

```text
modern rounded input
dark elevated surface
clear placeholder
strong focus state if possible
yellow accent border on focus
comfortable height
readable text
```

Do not break existing props.

---

## 19. Buttons

Upgrade:

```text
components/ui/AppButton.tsx
```

Target:

```text
premium yellow primary button
dark outline secondary button
comfortable height
rounded pill or large radius
clear disabled state
pressed feedback
fullWidth still works
```

Do not break existing variants.

---

## 20. Motion and Interaction

Use subtle interaction only.

Allowed:

```text
pressed opacity
pressed scale
small card feedback
subtle hero decorative motion if safe
```

Avoid:

```text
heavy loops
performance-heavy animations
complex gesture interactions
animations that break Android performance
```

If using Reanimated, keep it simple.

---

## 21. Accessibility Rules

Ensure:

```text
minimum touch target 48
readable color contrast
large enough text
all pressable cards have accessibilityRole button
important icons have accessible text nearby
no information conveyed by color only
screen content not hidden behind bottom tab
safe area respected
```

Do not make grey text too dark.

---

## 22. Language Rules

Keep UI language Turkish.

Use natural Turkish.

Do not over-formalize.

Do not introduce English labels in user-facing UI unless already part of a technical term.

Preferred phrases:

```text
Ana Sayfa
Haberler
Rehber
Araçlar
Daha Fazla
Hızlı Başlangıç
Popüler Araçlar
Almanya araç kutun
Topluluğa Katıl
Detayları gör
Daha fazla yükle
Yakında
Aktif
Beta
```

---

## 23. Code Quality Rules

Use TypeScript properly.

Avoid `any`.

Avoid duplicate styles.

Prefer reusable components.

Keep files readable.

Use existing path alias:

```ts
@/
```

Do not create circular imports.

Keep StyleSheet objects close to components unless a shared component needs shared tokens.

---

## 24. Validation Commands

After changes, run:

```bash
npm run typecheck
npm run lint
npm test
npm run security:check
```

If available and safe, also run:

```bash
npm run verify
```

Fix all errors.

Do not ignore TypeScript errors.

Do not suppress errors with `// @ts-ignore` unless absolutely unavoidable and explained.

---

## 25. Expected Output

After implementation, provide a final summary with:

```text
changed files
new components created
theme improvements
screens modernized
dependencies added, if any
validation command results
remaining issues, if any
```

---

## 26. Success Criteria

The result is successful when:

```text
the app looks significantly more modern
home screen feels like a real mobile dashboard
bottom tabs feel premium
cards have consistent modern styling
news screen feels editorial
service guide feels searchable and useful
tools screen feels like a practical tool center
dark/yellow almanya101 identity is stronger
existing routes still work
existing data logic still works
typecheck passes
lint passes
tests pass
security check passes
```

The final app should feel ready for a public Android MVP release, not like a temporary prototype.
