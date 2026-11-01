# Esdara · إصدارة

A directory of new releases by independent Arabic artists, live at [esdara.org](https://esdara.org).
We link to music on YouTube and Spotify; we never host it.

دليل لأحدث إصدارات الفنانين العرب المستقلين، على [esdara.org](https://esdara.org).
نضع روابط للموسيقى على يوتيوب وسبوتيفاي، ولا نستضيف أي أغنية.

## Add music · أضف موسيقى

Every artist, album and song is a Markdown file under `content/artists/`. See
[CONTRIBUTING.md](CONTRIBUTING.md). AI-made pull requests are welcome: see [AGENTS.md](AGENTS.md).

كل فنان وألبوم وأغنية ملف Markdown داخل `content/artists/`. التفاصيل في [CONTRIBUTING.md](CONTRIBUTING.md).

## Develop

A static [Astro](https://astro.build) site, deployed to Cloudflare Pages. See
[docs/architecture.md](docs/architecture.md).

```sh
nvm use
npm ci
npm run dev    # http://localhost:4321
npm test
npm run build
```

## License

Code and site texts: [AGPL-3.0-or-later](LICENSE). The music, images and artist content belong to their
owners and are not licensed by us; see [NOTICE](NOTICE).
