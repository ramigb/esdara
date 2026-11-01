import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import type { Genre } from './genres';
import { stack } from './stack';

export type Song = CollectionEntry<'songs'> & {
  artist: CollectionEntry<'artists'>;
  albumId: string | null;
  anchor: string; // id of the song on its artist page
};

// An album, or a single song released on its own. This is what the feed and artist pages show.
export type Release = {
  id: string;
  anchor: string;
  title: { ar: string; en: string };
  released: Date;
  cover?: ImageMetadata;
  path: string; // source .md: the album's index.md, or the single's own file
  hue: number; // placeholder cover color when there is no cover
  single: boolean;
  artist: CollectionEntry<'artists'>;
  songs: Song[];
  genres: Genre[];
  services: string[];
  more?: number; // on feeds: how many older releases by the same artist are stacked under this one
};

// Joins songs to their artist and album by directory: <artist>/<album|singles>/<song>.md
export async function loadSongs(): Promise<Song[]> {
  const artists = new Map((await getCollection('artists')).map((a) => [a.id, a]));
  return (await getCollection('songs'))
    .map((s) => {
      const [artistId, folder, slug] = s.id.split('/');
      const artist = artists.get(artistId);
      if (!artist) throw new Error(`${s.filePath}: artist folder "${artistId}" has no index.md`);
      return { ...s, artist, albumId: folder === 'singles' ? null : `${artistId}/${folder}`, anchor: `${folder}--${slug}` };
    })
    .sort((a, b) => b.data.released.getTime() - a.data.released.getTime());
}

export async function loadReleases(): Promise<Release[]> {
  const [artists, albums, songs] = await Promise.all([getCollection('artists'), getCollection('albums'), loadSongs()]);
  const byId = new Map(artists.map((a) => [a.id, a]));
  const release = (id: string, anchor: string, artist: CollectionEntry<'artists'>, tracks: Song[], data: Pick<Release, 'title' | 'released' | 'cover' | 'path'>): Release => ({
    ...data,
    id,
    anchor,
    artist,
    songs: tracks,
    single: !albums.some((a) => a.id === id),
    hue: [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 0),
    genres: tracks.length ? [...new Set(tracks.flatMap((s) => s.data.genres ?? artist.data.genres))] : artist.data.genres,
    services: [...new Set(tracks.flatMap((s) => Object.keys(s.data.links)))],
  });
  return [
    ...albums.map((a) => {
      const tracks = songs
        .filter((s) => s.albumId === a.id)
        .sort((x, y) => (x.data.track ?? Infinity) - (y.data.track ?? Infinity) || x.id.localeCompare(y.id));
      return release(a.id, a.id.split('/')[1], byId.get(a.id.split('/')[0])!, tracks, { ...a.data, path: a.filePath! });
    }),
    ...songs.filter((s) => !s.albumId).map((s) => release(s.id, s.anchor, s.artist, [s], { ...s.data, path: s.filePath! })),
  ].sort((a, b) => b.released.getTime() - a.released.getTime());
}

// Filter dimensions for the feed: each maps a release to the URL values it can be found under.
export const facets = {
  country: (r: Release) => [r.artist.data.country.toLowerCase()],
  genre: (r: Release): string[] => r.genres,
  service: (r: Release) => r.services,
};
export type Facet = keyof typeof facets;
export const facetValues = (releases: Release[], f: Facet) => [...new Set(releases.flatMap(facets[f]))].sort();

// Feed pages: page 1 lives at the list's own URL, page n at <list>/page/<n>/. Runs by one artist are stacked first.
export const PAGE_SIZE = 48;
export const paginate = (releases: Release[]) => {
  const items = stack(releases);
  return Array.from({ length: Math.max(1, Math.ceil(items.length / PAGE_SIZE)) }, (_, i) => items.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE));
};
export const pageUrl = (base: string, n: number) => (n === 1 ? base : `${base}page/${n}/`);
