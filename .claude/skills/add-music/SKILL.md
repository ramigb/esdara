---
name: add-music
description: Add or update an independent Arabic artist, album or song in Esdara's content/artists/ folder and prepare a pull request. Use when asked to add an artist, add a release or song, fix artist info, or contribute music to Esdara.
---

# Add music to Esdara

Read `AGENTS.md` (rules) and `CONTRIBUTING.md` (folder layout and front matter) first. The schema that the
build enforces is in `src/content.config.ts`; allowed genres are the keys in `src/genres.ts`.

## Steps

1. **Check it's new.** `ls content/artists/` and grep for the artist's name in both scripts
   (`grep -ril "<name>" content/artists`). If the artist exists, edit their folder instead of making a new one.
2. **Find official sources.** The artist's own Spotify or YouTube profile, plus a public
   source for the bio (official site, interview, Wikipedia). Confirm they are an independent Arabic artist.
   If you can't verify something, leave it out. Never invent URLs, IDs, dates or facts.
3. **Pick the slug.** Lowercase Latin transliteration with dashes, e.g. `content/artists/al-mithal/`.
4. **Artist page** `index.md`: `name: { ar, en }`, `country` (ISO alpha-2, uppercase), `genres` (1-3 keys from
   `src/genres.ts`), optional `photo: ./photo.jpg` and `links` (https only). Body: 1-3 neutral, factual
   sentences in Arabic. Optional `index.en.md` with the English bio (front matter can be empty: `---\n---`).
5. **Releases.** An album is a folder with `index.md` (`title: { ar, en }`, `released: YYYY-MM-DD`, optional
   `cover: ./cover.jpg`) and one `.md` per song with `track`. Songs not on an album go in `singles/`, each
   with an optional `cover`. Every song needs `title`, `released` and at least one link, copied exactly from
   the service (Spotify `/track/` links, YouTube watch links). No SoundCloud or Suno links.
6. **Images** (optional, usually skip): only images the artist sent or published under a license that allows reuse, with their permission noted in the PR. Never download photos or cover art from streaming platforms, social media or search results. Square, at least 480×480,
   under 1 MB, saved next to the `.md` that references it.
7. **Validate:** `npm test && npm run build`. Fix every schema error the build reports.
8. **Open the PR**, one artist per PR. Title: `Add <Artist name>` or `Update <Artist name>`. In the
   description list the source links you used, and say the PR was made with an AI agent (name the tool).

## Example

```
content/artists/al-mithal/index.md
---
name: { ar: "فرقة المثال", en: "Al-Mithal" }
country: EG
genres: [indie-rock]
links:
  spotify: https://open.spotify.com/artist/...
---

فرقة روك مستقلة من القاهرة تأسست عام ٢٠١٥.

content/artists/al-mithal/singles/madina.md
---
title: { ar: "مدينة", en: "Madina" }
released: 2026-09-12
links:
  spotify: https://open.spotify.com/track/...
  youtube: https://www.youtube.com/watch?v=...
---
```
