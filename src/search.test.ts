import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { schema, search, type Row } from './search.ts';
import { normalize } from './normalize.ts';

const db = new DatabaseSync(':memory:');
db.exec(schema);
const add = (table: string, ...v: (string | number | null)[]) =>
  db.prepare(`INSERT INTO ${table} VALUES (${v.map(() => '?').join(', ')})`).run(...v);
add('artists', 'nai', 'ناي البرغوثي', 'Nai Barghouti', 'PS', null, 'p', normalize('ناي البرغوثي Nai Barghouti'));
add('artists', 'shehab', 'شهاب', 'Shehab', 'EG', null, 'p', normalize('شهاب Shehab'));
add('songs', 'nai/singles/a', 'nai', null, 'a', 'أَحلام', 'Ahlam', '2026-01-02', 'PS', null, 1, 'p', normalize('أَحلام Ahlam ناي البرغوثي Nai Barghouti'));
add('songs', 'shehab/singles/b', 'shehab', null, 'b', 'ليل', 'Layl', '2026-03-01', 'EG', null, 1, 'p', normalize('ليل Layl شهاب Shehab'));
add('song_genres', 'nai/singles/a', 'jazz');
add('song_genres', 'shehab/singles/b', 'hip-hop');
add('song_links', 'nai/singles/a', 'youtube', 'https://youtu.be/x');
add('song_links', 'nai/singles/a', 'spotify', 'https://open.spotify.com/track/y');
add('song_links', 'shehab/singles/b', 'spotify', 'https://open.spotify.com/track/z');

const rows = (sql: string, args: (string | number)[]) => db.prepare(sql).all(...args) as Row[];
const ids = (r: Row[]) => r.map((x) => x.id);

test('no query: all songs, newest first, no artists', () => {
  const { songs, artists } = search(rows, {});
  assert.deepEqual(ids(songs), ['shehab/singles/b', 'nai/singles/a']);
  assert.deepEqual(artists, []);
});

test('text matches normalized Arabic and Latin, every term must match', () => {
  assert.deepEqual(ids(search(rows, { q: 'احلام' }).songs), ['nai/singles/a']);
  assert.deepEqual(ids(search(rows, { q: 'nai ahlam' }).songs), ['nai/singles/a']);
  assert.deepEqual(ids(search(rows, { q: 'nai layl' }).songs), []);
  assert.deepEqual(ids(search(rows, { q: 'SHEHAB' }).artists), ['shehab']);
});

test('filters, limit and links', () => {
  assert.deepEqual(ids(search(rows, { country: 'EG' }).songs), ['shehab/singles/b']);
  assert.deepEqual(ids(search(rows, { genre: 'jazz' }).songs), ['nai/singles/a']);
  assert.deepEqual(ids(search(rows, { service: 'youtube' }).songs), ['nai/singles/a']);
  assert.deepEqual(ids(search(rows, {}, 1).songs), ['shehab/singles/b']);
  const [song] = search(rows, { q: 'nai' }).songs;
  assert.deepEqual(JSON.parse(String(song.links)), { youtube: 'https://youtu.be/x', spotify: 'https://open.spotify.com/track/y' });
});
