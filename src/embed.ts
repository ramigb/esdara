// Player iframe for a song link, or null when the link has no embeddable form (e.g. a channel link).
// Only YouTube and Spotify: SoundCloud and Suno were dropped over their terms (2026-11-01).
// `height` is omitted for video, which is shown at 16:9.
export type Embed = { src: string; height?: number };

export function embed(service: string, link: string): Embed | null {
  const url = new URL(link);
  const path = url.pathname;
  if (service === 'youtube') {
    const id = url.hostname === 'youtu.be' ? path.slice(1) : (url.searchParams.get('v') ?? path.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]);
    return id && /^[\w-]{11}$/.test(id) ? { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` } : null;
  }
  if (service === 'spotify') {
    const m = path.match(/^(?:\/intl-[a-z-]+)?\/(track|album)\/([A-Za-z0-9]+)/);
    return m ? { src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, height: 152 } : null;
  }
  return null;
}

// Every link on the song that can be played on the page, in this order; the first is the default.
export const preferred = ['youtube', 'spotify'];
export const embeds = (links: Record<string, string | undefined>) =>
  preferred.flatMap((service) => {
    const e = links[service] ? embed(service, links[service]) : null;
    return e ? [{ service, ...e }] : [];
  });
