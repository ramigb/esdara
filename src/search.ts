import { normalize } from './normalize.ts';

// Tables of /esdara.sqlite: written by src/pages/esdara.sqlite.ts, read by search() below.
export const schema = `
  CREATE TABLE artists (id TEXT PRIMARY KEY, name_ar TEXT, name_en TEXT, country TEXT, photo TEXT, path TEXT, search TEXT);
  CREATE TABLE albums (id TEXT PRIMARY KEY, artist_id TEXT, title_ar TEXT, title_en TEXT, released TEXT, path TEXT);
  CREATE TABLE songs (id TEXT PRIMARY KEY, artist_id TEXT, album_id TEXT, anchor TEXT, title_ar TEXT, title_en TEXT,
                      released TEXT, country TEXT, cover TEXT, hue INTEGER, path TEXT, search TEXT);
  CREATE TABLE song_genres (song_id TEXT, genre TEXT);
  CREATE TABLE song_links (song_id TEXT, service TEXT, url TEXT);
  CREATE INDEX songs_released ON songs (released DESC);
  CREATE INDEX song_genres_song ON song_genres (song_id, genre);
  CREATE INDEX song_links_song ON song_links (song_id, service);
`;

export type Row = Record<string, string | number | null>;
export type Rows = (sql: string, args: (string | number)[]) => Row[];
export type Query = { q?: string; country?: string; genre?: string; service?: string };

// Free text (every term must match) plus filters, newest songs first. Used by /search/ and the WebMCP tool.
// `links` on each song is a JSON object string, {"youtube": "https://...", ...}.
export function search(rows: Rows, { q = '', country = '', genre, service }: Query, limit = 100) {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  country = country.toLowerCase();
  const where = terms.map(() => 'instr(s.search, ?) > 0');
  const args: (string | number)[] = [...terms];
  if (country) where.push('lower(s.country) = ?'), args.push(country);
  if (genre) where.push('EXISTS (SELECT 1 FROM song_genres g WHERE g.song_id = s.id AND g.genre = ?)'), args.push(genre);
  if (service) where.push('EXISTS (SELECT 1 FROM song_links l WHERE l.song_id = s.id AND l.service = ?)'), args.push(service);
  const songs = rows(
    `SELECT s.*, a.name_ar, a.name_en,
            (SELECT json_group_object(service, url) FROM song_links l WHERE l.song_id = s.id) AS links
     FROM songs s JOIN artists a ON a.id = s.artist_id
     ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY s.released DESC LIMIT ?`,
    [...args, limit],
  );
  const artists = terms.length
    ? rows(
        `SELECT * FROM artists WHERE ${terms.map(() => 'instr(search, ?) > 0').join(' AND ')}
         ${country ? 'AND lower(country) = ?' : ''} ORDER BY name_en LIMIT 20`,
        country ? [...terms, country] : terms,
      )
    : [];
  return { artists, songs };
}
