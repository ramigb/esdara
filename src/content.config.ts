import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { genres, type Genre } from './genres';

const base = './content/artists';
// "x/index.md" -> "x", "x/index.en.md" -> "x", "x/album/song.md" -> "x/album/song"
const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '').replace(/\/index(\.en)?$/, '');

const text = z.object({ ar: z.string().min(1), en: z.string().min(1) });
const genreList = z.array(z.enum(Object.keys(genres) as [Genre, ...Genre[]])).min(1);
// PR content becomes links on the site: allow only https, and only the service's own domains.
const https = (hostname?: RegExp) => z.url({ protocol: /^https$/, hostname });

const artists = defineCollection({
  loader: glob({ base, pattern: '*/index.md', generateId }),
  schema: ({ image }) => z.object({
    name: text,
    country: z.string().regex(/^[A-Z]{2}$/, 'ISO 3166-1 alpha-2 code, e.g. EG'),
    genres: genreList,
    photo: image().optional(), // e.g. `photo: ./photo.jpg`, shown as a circle
    links: z.record(z.string(), https()).optional(),
  }),
});

// Optional English bio; the Arabic bio is the body of index.md.
const artistsEn = defineCollection({
  loader: glob({ base, pattern: '*/index.en.md', generateId }),
  schema: z.object({}),
});

// Covers are image files next to the .md (e.g. `cover: ./cover.jpg`), resized to one 480px WebP at build.
const albums = defineCollection({
  loader: glob({ base, pattern: '*/*/index.md', generateId }),
  schema: ({ image }) => z.object({ title: text, released: z.coerce.date(), cover: image().optional() }),
});

const songs = defineCollection({
  loader: glob({ base, pattern: ['*/*/*.md', '!*/*/index.md'], generateId }),
  schema: ({ image }) => z.object({
    title: text,
    released: z.coerce.date(),
    track: z.number().int().positive().optional(), // order within the album
    cover: image().optional(), // singles only; album songs use the album cover
    genres: genreList.optional(), // defaults to the artist's genres
    links: z
      .object({
        youtube: https(/^((www|m|music)\.)?youtube\.com$|^youtu\.be$/),
        spotify: https(/^open\.spotify\.com$/),
      })
      .partial()
      .strict() // a SoundCloud, Suno or other link fails the build instead of vanishing silently
      .refine((l) => Object.keys(l).length > 0, 'at least one link is required'),
  }),
});

// Site pages (FAQ, about...): content/pages/<slug>.md is Arabic, optional <slug>.en.md is English.
const pages = defineCollection({
  loader: glob({ base: './content/pages', pattern: '*.md', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({ title: z.string().min(1), description: z.string().optional() }), // description: search results and link previews
});

export const collections = { artists, artistsEn, albums, songs, pages };
