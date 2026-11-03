import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';
import { loadReleases } from '../data';
import { normalize } from '../normalize';

// Same transforms as Cover.astro and the artist photo, so these URLs reuse the files the pages already ship.
const thumb = async (src: ImageMetadata | undefined, size: number) =>
  src ? (await getImage({ src, width: size, height: size, fit: 'cover' })).src : null;

// Metadata-only index for in-browser search and combined filters. Bios and other text stay in the
// .md files; `path` points at them. Built from the validated collections, so it can't drift from the site.
export async function GET() {
  const tmp = mkdtempSync(join(tmpdir(), 'esdara-'));
  const file = join(tmp, 'esdara.sqlite');
  const db = new DatabaseSync(file);
  db.exec(`
    CREATE TABLE artists (id TEXT PRIMARY KEY, name_ar TEXT, name_en TEXT, country TEXT, photo TEXT, path TEXT, search TEXT);
    CREATE TABLE albums (id TEXT PRIMARY KEY, artist_id TEXT, title_ar TEXT, title_en TEXT, released TEXT, path TEXT);
    CREATE TABLE songs (id TEXT PRIMARY KEY, artist_id TEXT, album_id TEXT, anchor TEXT, title_ar TEXT, title_en TEXT,
                        released TEXT, country TEXT, cover TEXT, hue INTEGER, path TEXT, search TEXT);
    CREATE TABLE song_genres (song_id TEXT, genre TEXT);
    CREATE TABLE song_links (song_id TEXT, service TEXT, url TEXT);
    CREATE INDEX songs_released ON songs (released DESC);
    CREATE INDEX song_genres_song ON song_genres (song_id, genre);
    CREATE INDEX song_links_song ON song_links (song_id, service);
  `);

  const day = (d: Date) => d.toISOString().slice(0, 10);
  const artist = db.prepare('INSERT INTO artists VALUES (?, ?, ?, ?, ?, ?, ?)');
  const album = db.prepare('INSERT INTO albums VALUES (?, ?, ?, ?, ?, ?)');
  const song = db.prepare('INSERT INTO songs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const genre = db.prepare('INSERT INTO song_genres VALUES (?, ?)');
  const link = db.prepare('INSERT INTO song_links VALUES (?, ?, ?)');

  const [artists, releases] = await Promise.all([getCollection('artists'), loadReleases()]);
  const rows = await Promise.all(releases.map(async (r) => ({ r, cover: await thumb(r.cover, 480) })));
  const photos = await Promise.all(artists.map((a) => thumb(a.data.photo, 320)));

  db.exec('BEGIN');
  artists.forEach((a, i) => {
    const { name, country } = a.data;
    artist.run(a.id, name.ar, name.en, country, photos[i], a.filePath!, normalize(`${name.ar} ${name.en}`));
  });
  for (const { r, cover } of rows) {
    if (!r.single) album.run(r.id, r.artist.id, r.title.ar, r.title.en, day(r.released), r.path);
    for (const s of r.songs) {
      const { title, released, links } = s.data;
      const { name, country, genres } = s.artist.data;
      const search = normalize(`${title.ar} ${title.en} ${name.ar} ${name.en}`);
      song.run(s.id, s.artist.id, s.albumId, s.anchor, title.ar, title.en, day(released), country, cover, r.hue, s.filePath!, search);
      for (const g of s.data.genres ?? genres) genre.run(s.id, g);
      for (const [service, url] of Object.entries(links)) link.run(s.id, service, url!);
    }
  }
  db.exec('COMMIT');
  db.close();

  const bytes = readFileSync(file);
  rmSync(tmp, { recursive: true });
  return new Response(bytes, { headers: { 'Content-Type': 'application/vnd.sqlite3' } });
}
