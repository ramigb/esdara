# AGENTS.md

Instructions for AI coding agents (and humans) contributing to Esdara (إصدارة), a static directory of new
releases by independent Arabic artists, live at https://esdara.org. AI-made pull requests are welcome.

## What this repo is

- Astro static site. Every artist, album and song is a Markdown file with YAML front matter under
  `content/artists/`. No backend, no database server, no accounts.
- Arabic is the default language, served at `/`; English is under `/en/`. Every user-facing string exists in both.
- We link to and embed music on YouTube and Spotify only. We never host audio, video or
  anything we don't have rights to.
- Deployed to Cloudflare Pages (free plan) from GitHub Actions. Read `docs/architecture.md` before changing
  routes, build or deploy.

## Commands

```sh
nvm use        # Node version from .nvmrc
npm ci
npm test       # unit tests (node --test)
npm run build  # validates every content file against the schema, then checks Cloudflare file limits
npm run dev    # local server at http://localhost:4321
```

`npm test && npm run build` must pass before you open a PR; the Check workflow runs the same on every PR.

## Adding or editing music (most PRs)

Follow `CONTRIBUTING.md` for the folder layout and front matter. In Claude Code, the `add-music` skill
(`.claude/skills/add-music/SKILL.md`) walks through it; other agents can read that file directly.

Rules that the build won't catch for you:

- Only independent Arabic artists. Don't guess: if you can't find the artist's official profile, skip them.
- Every link must point to the real song or profile. Never invent or "fix up" URLs, IDs or release dates;
  copy them from the service. If unsure, leave the field out (optional fields) or leave the song out.
- Both `ar` and `en` names/titles are required. Use the artist's own spelling; if the name is the same in
  both languages, write it twice. Don't machine-translate song titles into meaning: transliterate.
- Folder and file names: lowercase Latin letters, digits and dashes (`al-mithal`, `layl-tawil`).
- `country` is an ISO 3166-1 alpha-2 code (`EG`, `PS`, `LB`). `genres` must be keys from `src/genres.ts`;
  don't add genres in a content PR, open an issue instead.
- Bios: short, factual, neutral, sourced from public information. Arabic bio in `index.md`'s body, optional
  English bio in `index.en.md`. No opinions, rankings or politics.
- Images: only images the artist sent or published under a license that allows reuse, with their permission noted in the PR. Never download photos or cover art from streaming platforms, social media or search results. Square, at least 480×480, under 1 MB. No image is fine: the site shows a generated tile.
- One artist per PR keeps reviews easy.
- Don't edit `content/picks.json` (editors' picks on the home page): only the maintainer chooses them, and the
  Check workflow fails PRs from anyone else that touch it. It lists release ids in display order: an album
  `<artist>/<album>`, a single `<artist>/singles/<song>`.

## Changing code

- Keep it static: no server code, no runtime API calls, no trackers beyond the consented analytics in
  `src/layouts/Base.astro`. Third-party players load only when a visitor presses play.
- UI strings live in `src/i18n.ts`, in both `ar` and `en`. Layouts must work right-to-left; use logical CSS
  properties (`margin-inline`, `inset-inline`), not left/right.
- Content schema: `src/content.config.ts`. Schema changes affect the external feeder that writes
  `content/artists/`, so call them out in the PR.
- Stay under the Cloudflare free plan limits in `docs/architecture.md` (20,000 files per deploy): albums and
  songs are sections of the artist page, not pages of their own.
- Small, focused diffs. Add a `*.test.ts` next to new logic in `src/`.

## Pull requests

- Code and site texts are AGPL-3.0-or-later (`LICENSE`); `content/artists/` is not ours and is not licensed
  by us (`NOTICE`). Your contribution is accepted under the same terms.
- Say in the description what you changed and where your data came from (links to the sources).
- If an AI agent made the PR, say so and name the tool. That's fine; it helps reviewers.
- Site pages such as the FAQ are in `content/pages/` (`<slug>.md` Arabic, `<slug>.en.md` English).
