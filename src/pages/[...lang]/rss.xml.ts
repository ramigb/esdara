// RSS feed of the newest releases: /rss.xml (Arabic) and /en/rss.xml. Handwritten; the format is small enough.
import type { APIContext } from 'astro';
import { loadReleases } from '../../data';
import { country, href, langPaths, toLang, ui } from '../../i18n';

export const getStaticPaths = langPaths;

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

export async function GET({ params, site }: APIContext) {
  const lang = toLang(params.lang);
  const abs = (path: string) => new URL(href(lang, path), site).href;
  const releases = (await loadReleases()).slice(0, 50);
  const items = releases.map(
    (r) => `<item>
  <title>${esc(`${r.artist.data.name[lang]} – ${r.title[lang]}`)}</title>
  <link>${esc(abs(`/artists/${r.artist.id}/#${r.anchor}`))}</link>
  <guid isPermaLink="false">${esc(r.id)}</guid>
  <pubDate>${r.released.toUTCString()}</pubDate>
  <description>${esc(`${country(lang, r.artist.data.country)} · ${r.single ? ui[lang].single : ui[lang].tracks(r.songs.length)}`)}</description>
</item>`,
  );
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(`${ui[lang].site} · ${ui[lang].latest}`)}</title>
<link>${abs('/')}</link>
<atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
<description>${esc(ui[lang].intro)}</description>
<language>${lang}</language>
${releases[0] ? `<lastBuildDate>${releases[0].released.toUTCString()}</lastBuildDate>` : ''}
${items.join('\n')}
</channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
