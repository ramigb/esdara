# Add your music · أضف موسيقاك

Esdara (إصدارة) lists new releases by independent Arabic artists. Every artist, album and song is a
Markdown file in this repository, so adding your music is a pull request. We only link to your music
on YouTube or Spotify; the rights stay with you.

إصدارة دليل للإصدارات الجديدة من الفنانين العرب المستقلين. كل فنان وألبوم وأغنية هو ملف Markdown في
هذا المستودع، لذلك تُضاف موسيقاك عبر طلب سحب (Pull Request). نحن نضع روابط لموسيقاك فقط، والحقوق تبقى لك.

Using an AI coding agent? AI-made PRs are welcome: point it at [AGENTS.md](AGENTS.md), or in Claude Code
run the `add-music` skill.

تستخدم وكيل ذكاء اصطناعي؟ طلبات السحب المصنوعة بالذكاء الاصطناعي مرحب بها: وجّهه إلى [AGENTS.md](AGENTS.md).

## Steps · الخطوات

1. Fork this repository (or click "Edit this page on GitHub" on your artist page).
2. Add or edit files under `content/artists/<your-name>/` as shown below.
3. Open a pull request. A check runs automatically and tells you if anything is wrong.
4. Once merged, your release appears on the site with the next update.

١. انسخ المستودع (Fork)، أو اضغط «عدّل هذه الصفحة على GitHub» في صفحتك.
٢. أضف ملفاتك داخل `content/artists/<اسمك>/` كما في الأمثلة أدناه.
٣. افتح طلب سحب. يتحقق فحص تلقائي من الملفات ويخبرك بأي خطأ.
٤. بعد الدمج تظهر إصداراتك على الموقع مع التحديث التالي.

## Folder layout · ترتيب المجلدات

Use lowercase Latin letters, numbers and dashes for folder and file names (`al-mithal`, `layl-tawil`).

```
content/artists/al-mithal/
  index.md            your artist page (Arabic bio in the body)
  index.en.md         optional English bio
  photo.jpg           optional photo you own or may share, square works best
  layl-tawil/         one folder per album
    index.md          album details
    cover.jpg         optional album cover you own or may share, square, at least 480×480
    layl.md           one file per song
  singles/            songs that aren't on an album
    madina.md
    madina.jpg        optional cover for the single, same rule
```

## Artist · الفنان (`index.md`)

```yaml
---
name: { ar: "فرقة المثال", en: "Al-Mithal" }
country: EG                 # two-letter country code
genres: [indie-rock]        # from src/genres.ts
photo: ./photo.jpg          # optional, only if it's yours or you have permission
links:                      # optional, https only
  instagram: https://www.instagram.com/...
---

نبذة عن الفنان بالعربية.
```

## Album · الألبوم (`<album>/index.md`)

```yaml
---
title: { ar: "ليل طويل", en: "Layl Tawil" }
released: 2026-09-12
cover: ./cover.jpg          # optional
---
```

## Song · الأغنية (`<album>/<song>.md` or `singles/<song>.md`)

```yaml
---
title: { ar: "ليل", en: "Layl" }
released: 2026-09-12
track: 1                    # order within the album
cover: ./madina.jpg         # singles only, optional
genres: [indie-pop]         # optional, defaults to the artist's genres
links:                      # at least one
  youtube: https://www.youtube.com/watch?v=...
  spotify: https://open.spotify.com/track/...
---
```

## Rules · القواعد

- Both Arabic and English names are required. If your name is the same in both, write it twice.
- Song links must be https YouTube or Spotify links on the service's own domain, and get a player on your
  page. Other services (SoundCloud, Suno…) aren't accepted.
- Missing a genre? Open an issue; genres are a fixed list so filters stay clean.
- Only submit music you own or are authorized to list. You keep all rights to it; see [NOTICE](NOTICE).

- الاسم بالعربية والإنجليزية مطلوب. إن كان اسمك واحدًا فاكتبه مرتين.
- الروابط يجب أن تبدأ بـ https وأن تكون على موقع المنصة نفسها.
- لا تجد نوعك الموسيقي؟ افتح Issue، فقائمة الأنواع ثابتة لتبقى التصفية مرتبة.
- أضف فقط موسيقى تملكها أو مخوّل بإدراجها.

## Check locally (optional) · فحص محلي (اختياري)

```sh
nvm use && npm ci && npm run build
```
