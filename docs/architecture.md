# Architecture

Everything is a file in git. A build turns the files into a static site plus a SQLite index, and the
result is uploaded to Cloudflare Pages (free plan). No backend, no database server, no accounts.

```
contributor PR ──► Check workflow (schema, link domains, tests, file limits) ──► merge to main
                                                                                    │
            every 3 h: Deploy workflow ── live /version.txt == main? ──yes──► skip  │
                                                   │ no                             │
                              npm run build on GitHub Actions ◄─────────────────────┘
                                                   │
                              wrangler pages deploy dist  ──►  Cloudflare Pages
```

The 3-hour schedule is paused for now: the Deploy workflow runs by hand (Actions → Deploy → Run workflow)
until the feeder's update rhythm is settled. Re-enable it by uncommenting `schedule` in `deploy.yml`.

## Content

```
content/artists/<artist>/index.md          artist: name {ar,en}, country (ISO code), genres, links; body = Arabic bio
content/artists/<artist>/index.en.md       optional English bio
content/artists/<artist>/<album>/index.md  album: title {ar,en}, released, optional cover (./cover.jpg)
content/artists/<artist>/<album>/<song>.md song: title {ar,en}, released, links, optional track, genres
content/artists/<artist>/singles/<song>.md songs that aren't on an album; optional cover
```

The schema lives in `src/content.config.ts`, and genres are a fixed list in `src/genres.ts`. Song links
must be https and on the service's own domain.

## Pages

Arabic is served at `/` and English under `/en/` (the `[...lang]` routes). There is one page per artist;
albums and songs are sections and anchors on it (`/artists/<artist>/#<album>--<song>`), not pages of their
own, so the file count grows with artists, not songs.

The home page is a cover grid of releases (an album, or a single). Filters are pre-rendered pages, one per
value and language (`/country/eg/`, `/genre/indie-rock/`, `/service/spotify/`), so they work without
JavaScript. Covers are resized at build to one 480px WebP each (one file per cover); releases without a
cover get a generated gradient with their initial. The font (Readex Pro) is downloaded from Google Fonts at
build time and served from our own domain.

Feeds are paginated 48 releases per page (`/page/2/`, `/genre/jazz/page/2/`). On artist pages each song
has a play button that loads the YouTube (no-cookie) or Spotify player only when tapped
(`src/embed.ts`), so no third-party requests happen until a visitor asks to listen.

Site pages such as the FAQ live in `content/pages/`: `<slug>.md` (Arabic, with a `title` in its frontmatter)
and an optional `<slug>.en.md`, served at `/<slug>/` and `/en/<slug>/` and linked from every footer. A slug
must not clash with an existing route (`search`, `page`, `artists`).

For search engines, `src/layouts/Base.astro` sets each page's description, canonical URL, Arabic/English
alternates and link-preview tags (artist pages use their bio and photo). `@astrojs/sitemap` writes
`sitemap-index.xml`, which `public/robots.txt` points to. `src/pages/404.astro` matters on Cloudflare Pages:
without a `404.html`, unknown URLs get the home page with a 200 status.

`src/site.ts` holds the GitHub repository URL used for "Add your music" (`CONTRIBUTING.md`) and the
per-artist "Edit this page on GitHub" links.

## Index

`/esdara.sqlite` (`src/pages/esdara.sqlite.ts`) is generated from the same validated collections. It
holds metadata, a normalized `search` column (`src/normalize.ts`) and each entry's source `path`; no body
text. The site works without it; only `/search/` loads it, with sql.js (about 300 KB compressed, once),
for free-text search combined with country, genre and platform filters. Searches are shareable URLs
(`/search/?q=...&genre=...`).

## Cloudflare free plan constraints

| Limit | How we stay under it |
|---|---|
| 500 builds/month | Builds run on GitHub Actions, not Cloudflare. The cron caps deploys at 8/day (~248/month) and skips when nothing changed. |
| 20,000 files per deploy | One page per artist per language, one file per cover, filter pages per value. `scripts/check-dist.mjs` fails the build at 19,000. |
| 25 MiB per file | Same check; the index holds metadata only. |
| No video or large-file hosting | We link and embed; audio and video stay on YouTube and Spotify. |

## One-time setup

1. Create the Pages project with Direct Upload: `npx wrangler pages project create esdara --production-branch=main`.
2. In GitHub repo settings, add the secrets `CLOUDFLARE_API_TOKEN` (permission: Cloudflare Pages: Edit) and
   `CLOUDFLARE_ACCOUNT_ID`, and the variable `SITE_URL` (`https://esdara.org`, the same as `site` in `astro.config.mjs`).
3. Run the Deploy workflow by hand once.
4. In the Pages project, under Custom domains, add `esdara.org` (and `www.esdara.org`, which can redirect to it).
   With the domain's DNS on Cloudflare, the records are created for you.

Don't connect the Git repo in the Cloudflare dashboard: that builds on every push and uses the
Cloudflare build quota.
