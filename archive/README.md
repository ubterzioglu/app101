# archive/

Bu klasör, geliştirme sürecinde kullanılmış ancak artık aktif olarak gerekmeyen
dokümanları ve tek seferlik prompt/rehber dosyalarını saklar. Geçmişe referans
amacıyla repoda tutulur; uygulama kodu bu dosyalara **bağımlı değildir** ve EAS
build paketine dahil **edilmez** (`.easignore` → `/archive`).

> Aktif Google Play yayın dökümanları `docs/google-play/` altındadır ve
> `npm run release:check` tarafından zorunlu tutulur — bunlar arşive taşınmaz.

## İçerik

| Dosya | Açıklama |
|---|---|
| `start.md` | İlk MVP E2E geliştirme planı (tamamlandı) |
| `Bautufy_Main_Prompt.md` | Modern tasarım yükseltme prompt'u (`feat/modern-design-upgrade` ile tamamlandı) |
| `almanya101_app101_repo_google_play_prompt.md` | Tek seferlik repo hazırlık ajan prompt'u |
| `almanya101_google_play_kisisel_hesap_adim_adim.md` / `.html` | Google Play kişisel hesap başvuru rehberi |
| `nextsteps.html` | Eski Google Play tam yayın rehberi (HTML) |
| `almanya101-news-pipeline-admin-panel-teknik-dokuman.html` | Web admin paneli teknik dökümanı (mobil repoya ait değil) |
| `repo-digest.md` | Tek seferlik repo özet analizi |
| `last101-gap-analysis.md` | last101 web ↔ app101 mobil gap analizi |
