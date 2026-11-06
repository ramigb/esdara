import type { CollectionEntry } from 'astro:content';
import type { Release } from './data.ts';
import { genres } from './genres.ts';
import { href, ui, type Lang } from './i18n.ts';

// Serialized for an inline <script>: escaping < keeps the JSON from ending the script early.
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

// Home page: tells search engines the site's name.
export const websiteLd = (site: URL, lang: Lang) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ui[lang].site,
  url: new URL(href(lang, '/'), site).href,
});

// Artist page: the group, then each release — an album (with its track list) or a single recording.
export const artistLd = (artist: CollectionEntry<'artists'>, releases: Release[], pageUrl: string, lang: Lang) => {
  const { name, links = {}, genres: g } = artist.data;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        '@id': pageUrl,
        name: name[lang],
        ...(name.ar !== name.en && { alternateName: name[lang === 'ar' ? 'en' : 'ar'] }),
        genre: g.map((genre) => genres[genre][lang]),
        url: pageUrl,
        sameAs: Object.values(links),
      },
      ...releases.map((r) => releaseLd(r, pageUrl, lang)),
    ],
  };
};

const releaseLd = (r: Release, pageUrl: string, lang: Lang) => {
  const base = {
    '@id': `${pageUrl}#${r.anchor}`,
    name: r.title[lang],
    url: `${pageUrl}#${r.anchor}`,
    datePublished: r.released.toISOString().slice(0, 10),
    byArtist: { '@id': pageUrl },
  };
  return r.single
    ? { '@type': 'MusicRecording', ...base }
    : {
        '@type': 'MusicAlbum',
        ...base,
        numTracks: r.songs.length,
        track: r.songs.map((s, i) => ({
          '@type': 'MusicRecording',
          position: s.data.track ?? i + 1,
          name: s.data.title[lang],
          url: `${pageUrl}#${s.anchor}`,
        })),
      };
};
