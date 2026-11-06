import { test } from 'node:test';
import assert from 'node:assert/strict';
import { artistLd, ldJson, websiteLd } from './jsonld.ts';
import type { Release } from './data.ts';

const site = new URL('https://esdara.org');

test('websiteLd: SearchAction points at the language-prefixed /search/?q=', () => {
  const ar = websiteLd(site, 'ar');
  assert.equal(ar['@type'], 'WebSite');
  assert.equal(ar.name, 'إصدارة');
  assert.equal(ar.url, 'https://esdara.org/');
  assert.equal(ar.potentialAction.target.urlTemplate, 'https://esdara.org/search/?q={search_term_string}');
  assert.equal(websiteLd(site, 'en').potentialAction.target.urlTemplate, 'https://esdara.org/en/search/?q={search_term_string}');
});

const artist = (links: Record<string, string> = {}) =>
  ({
    id: 'wegz',
    data: { name: { ar: 'ويجز', en: 'Wegz' }, country: 'EG', genres: ['hip-hop'], links },
  }) as Parameters<typeof artistLd>[0];

const release = (over: Partial<Release>): Release =>
  ({
    id: 'wegz/dorak-gai',
    anchor: 'dorak-gai',
    title: { ar: 'دورك جاي', en: 'Dorak Gai' },
    released: new Date('2025-06-01T00:00:00Z'),
    single: true,
    songs: [],
    ...over,
  }) as Release;

test('artistLd: MusicGroup with alternateName, genre and sameAs', () => {
  const ld = artistLd(artist({ YouTube: 'https://www.youtube.com/@wegz', Spotify: 'https://open.spotify.com/artist/x' }), [], 'https://esdara.org/artists/wegz/', 'ar');
  const [group] = ld['@graph'];
  assert.equal(group['@type'], 'MusicGroup');
  assert.equal(group['@id'], 'https://esdara.org/artists/wegz/');
  assert.equal(group.name, 'ويجز');
  assert.equal(group.alternateName, 'Wegz');
  assert.deepEqual(group.sameAs, ['https://www.youtube.com/@wegz', 'https://open.spotify.com/artist/x']);
});

test('artistLd: identical ar/en names drop alternateName', () => {
  const same = { id: 'x', data: { name: { ar: 'X', en: 'X' }, country: 'EG', genres: ['hip-hop'] } } as Parameters<typeof artistLd>[0];
  assert.equal(artistLd(same, [], 'https://esdara.org/artists/x/', 'en')['@graph'][0].alternateName, undefined);
});

test('artistLd: a single is a MusicRecording, an album a MusicAlbum with tracks', () => {
  const single = release({});
  const album = release({
    id: 'wegz/album',
    anchor: 'album',
    single: false,
    songs: [
      { anchor: 'album--one', data: { title: { ar: 'واحد', en: 'One' }, track: 3 } },
      { anchor: 'album--two', data: { title: { ar: 'اتنين', en: 'Two' } } },
    ] as Release['songs'],
  });
  const url = 'https://esdara.org/artists/wegz/';
  const [, s, a] = artistLd(artist(), [single, album], url, 'en')['@graph'] as any[];
  assert.equal(s['@type'], 'MusicRecording');
  assert.equal(s.url, `${url}#dorak-gai`);
  assert.equal(s.datePublished, '2025-06-01');
  assert.deepEqual(s.byArtist, { '@id': url });
  assert.equal(a['@type'], 'MusicAlbum');
  assert.equal(a.numTracks, 2);
  assert.equal(a.track[0].position, 3); // explicit track number wins
  assert.equal(a.track[1].position, 2); // missing track number falls back to order
  assert.equal(a.track[1].url, `${url}#album--two`);
});

test('ldJson: < is escaped so the script cannot be closed early', () => {
  assert.equal(ldJson({ x: '</script><b>' }), '{"x":"\\u003c/script>\\u003cb>"}');
});
