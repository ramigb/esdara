---
title: How Esdara works
description: "How Esdara runs without a server: text files, Git, Astro, Cloudflare and in-browser SQLite search, in plain words."
---

Esdara looks like an ordinary website, but under the hood it's built a little differently: there's no server running code, no database server and no accounts. One person builds it on weekend nights and it costs almost nothing to run. Here's how, in plain words. If something here makes you curious, that's the point: every piece is free to learn, and [all the code is public](https://github.com/ramigb/esdara).

## 1. Everything is a text file

Every artist, album and song on Esdara is a small text file written in **Markdown**, a simple format you can read even if you've never seen it before. The top of each file holds the facts in a format called **YAML**:

```yaml
---
title: { ar: "مدينة", en: "Madina" }
released: 2026-09-12
links:
  spotify: https://open.spotify.com/track/...
---
```

Folders mirror the music: one folder per artist, one per album, one file per song. No hidden database: if you can open a text file, you can read the whole directory.

## 2. Git remembers every change

All those files live in a **Git** repository on **GitHub**. Git is a tool programmers use to keep the full history of a project: who changed what, when, and why. Nothing is ever really lost.

To add a song, you don't log in anywhere. You propose a change, called a **pull request**. A robot (a **GitHub Actions** workflow) checks it right away: are the dates real dates? Are the links really Spotify or YouTube links? If something is wrong, it tells you. Then a human looks at it and merges it.

## 3. The build: cooking once instead of for every guest

Most websites build each page the moment you ask for it, like a restaurant cooking every order. Esdara cooks everything in advance. A tool called **Astro** reads all the text files and turns them into finished web pages (**HTML**) in a few seconds. This is called a **static site**.

While it builds, it also shrinks every photo and album cover into the modern **WebP** image format, so pages load fast even on a weak mobile connection.

## 4. Served from near you

The finished pages are uploaded to **Cloudflare Pages**, a **CDN** (content delivery network). Copies of the site sit in data centers all over the world, so when you open Esdara, it comes from one close to you.

We use the free plan, which has limits, for example at most 20,000 files per upload. Working well inside limits like that is a big part of real engineering: that's why albums and songs are sections of the artist page instead of pages of their own.

## 5. Search without a server

Search usually needs a server. Ours runs inside your browser. During the build we also create a small **SQLite** database, the same kind of database that lives inside almost every phone. When you open the search page, your browser downloads it once and searches it with **sql.js**: SQLite compiled to **WebAssembly**, a way to run fast, non-JavaScript programs inside a web page.

## 6. Two languages, two directions

Arabic is read right to left, English left to right. The site uses **logical CSS** (saying "start" and "end" instead of "left" and "right"), so one design flips correctly for both languages.

A fun detail: English has two forms for counting (1 track, 2 tracks). Arabic has six: zero, one, two, a few, many and other (أغنية واحدة، أغنيتان، ٣ أغانٍ، ١١ أغنية). The browser's built-in **Intl.PluralRules** picks the right one.

## 7. Players load only when you press play

The YouTube and Spotify players are **embeds**: small windows into those sites. They only load when you press play. Until then, your browser doesn't talk to them at all, which keeps pages fast and your visit private.

## 8. Where the data comes from: AI and humans

Finding new releases by hand would take forever, so AI models help organize public information about artists and releases, and the code itself was written with the help of Claude Opus 5.5.

AI is a powerful helper, but it makes mistakes. That's why every artist page says its information was compiled automatically, why every change is a reviewable pull request, and why anyone can fix an error.

## 9. What it costs

Almost nothing: the domain name. GitHub hosts the code and runs the robots for free, and Cloudflare serves the site for free. Picking the right tools can make a real project nearly free to run.

## Want to learn this yourself?

- [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development): HTML, CSS and JavaScript from zero, free.
- [Astro's tutorial](https://docs.astro.build/en/tutorial/0-introduction/): build your own blog with the same tool as this site.
- [GitHub Skills](https://skills.github.com/): short, hands-on courses on Git and pull requests.
- Or start right here: read [our code](https://github.com/ramigb/esdara), then send your first pull request. Fixing a typo counts.
- Got a question or stuck somewhere? Reach out to Rami GB at [ramigb.com](https://www.ramigb.com); happy to help.
