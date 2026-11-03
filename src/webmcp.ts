// WebMCP (https://webmachinelearning.github.io/webmcp/): lets an AI agent in the visitor's own browser search
// the directory. Browsers without it skip this; the index loads only when an agent calls the tool.
import { genres } from './genres';
import { search } from './search.ts';

const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
const page = (path: string) => new URL((lang === 'en' ? '/en' : '') + path, location.origin).href;

(document as any).modelContext?.registerTool({
  name: 'search_music',
  title: 'Search Esdara',
  description:
    'Search Esdara, a directory of new releases by independent Arabic artists. Matches song titles and artist ' +
    'names in Arabic or Latin script. With no query, returns the newest releases. Each song has its page on ' +
    'esdara.org and its YouTube/Spotify links.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Words from a song title or artist name, Arabic or Latin. Every word must match.' },
      country: { type: 'string', description: "Artist's country as an ISO 3166-1 alpha-2 code, e.g. EG, PS, LB." },
      genre: { type: 'string', enum: Object.keys(genres) },
      service: { type: 'string', enum: ['youtube', 'spotify'], description: 'Only songs available on this service.' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
    },
  },
  annotations: { readOnlyHint: true },
  async execute({ query, country, genre, service, limit = 20 }: Record<string, any>) {
    const { openIndex } = await import('./index-db.ts'); // sql.js stays out of every other page's bundle
    const { artists, songs } = search(await openIndex(), { q: query, country, genre, service }, Math.min(Math.max(1, Math.trunc(Number(limit) || 20)), 100));
    return JSON.stringify({
      artists: artists.map((a) => ({ name: { ar: a.name_ar, en: a.name_en }, country: a.country, url: page(`/artists/${a.id}/`) })),
      songs: songs.map((s) => ({
        title: { ar: s.title_ar, en: s.title_en },
        artist: { ar: s.name_ar, en: s.name_en },
        country: s.country,
        released: s.released,
        url: page(`/artists/${s.artist_id}/#${s.anchor}`),
        links: JSON.parse(String(s.links ?? '{}')),
      })),
    });
  },
});
