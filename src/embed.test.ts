import { test } from 'node:test';
import assert from 'node:assert/strict';
import { embed, embeds, playlist } from './embed.ts';

test('youtube: watch, short, shorts links; rejects bad ids', () => {
  const src = 'https://www.youtube-nocookie.com/embed/abcDEF12_-x?autoplay=1';
  assert.equal(embed('youtube', 'https://www.youtube.com/watch?v=abcDEF12_-x&t=3')?.src, src);
  assert.equal(embed('youtube', 'https://youtu.be/abcDEF12_-x')?.src, src);
  assert.equal(embed('youtube', 'https://youtube.com/shorts/abcDEF12_-x')?.src, src);
  assert.equal(embed('youtube', 'https://www.youtube.com/watch?v=bad'), null);
  assert.equal(embed('youtube', 'https://www.youtube.com/@channel'), null);
});

test('spotify: track and album, with or without intl prefix', () => {
  assert.equal(embed('spotify', 'https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC?si=x')?.src, 'https://open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC');
  assert.equal(embed('spotify', 'https://open.spotify.com/intl-ar/album/1abc')?.src, 'https://open.spotify.com/embed/album/1abc');
  assert.equal(embed('spotify', 'https://open.spotify.com/artist/1abc'), null);
});

test('soundcloud and suno are not embedded', () => {
  assert.equal(embed('soundcloud', 'https://soundcloud.com/user/track'), null);
  assert.equal(embed('suno', 'https://suno.com/song/1f2e-33'), null);
});

test('embeds lists every playable link in preferred order', () => {
  const list = embeds({ spotify: 'https://open.spotify.com/track/x1', youtube: 'https://youtu.be/abcDEF12_-x' });
  assert.deepEqual(list.map((e) => e.service), ['youtube', 'spotify']);
  assert.equal(list[1].height, 152);
  assert.deepEqual(embeds({ youtube: 'https://youtu.be/bad' }), []);
});

test('playlist: first video in the path and the queue, duplicates and bad links dropped', () => {
  const a = 'abcDEF12_-a', b = 'abcDEF12_-b';
  assert.equal(
    playlist([`https://youtu.be/${a}`, 'https://www.youtube.com/@channel', `https://www.youtube.com/watch?v=${b}`, `https://youtu.be/${a}`]),
    `https://www.youtube-nocookie.com/embed/${a}?autoplay=1&playlist=${a},${b}`,
  );
  assert.equal(playlist([]), null);
  const many = Array.from({ length: 60 }, (_, i) => `https://youtu.be/abcDEF12_${String(i).padStart(2, '0')}`);
  assert.equal(playlist(many)!.split('playlist=')[1].split(',').length, 50);
});
