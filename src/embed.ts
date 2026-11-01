// Player iframe for a song link, or null when the link has no embeddable form (e.g. a channel link).
// Only YouTube and Spotify: SoundCloud and Suno were dropped over their terms (2026-11-01).
// `height` is omitted for video, which is shown at 16:9.
export type Embed = { src: string; height?: number };

const youtubeId = (link: string) => {
  const url = new URL(link);
  const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : (url.searchParams.get('v') ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1]);
  return id && /^[\w-]{11}$/.test(id) ? id : null;
};

export function embed(service: string, link: string): Embed | null {
  if (service === 'youtube') {
    const id = youtubeId(link);
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` } : null;
  }
  if (service === 'spotify') {
    const m = new URL(link).pathname.match(/^(?:\/intl-[a-z-]+)?\/(track|album)\/([A-Za-z0-9]+)/);
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

// One YouTube player that plays these songs in order ("Play all" on feeds); null when none is on YouTube.
// The first video goes in the queue too: without it YouTube starts from the second.
// shortcut: capped at 50 videos to keep the embed URL short; feeds show 48 releases, so this rarely bites.
export function playlist(youtubeLinks: string[]): string | null {
  const ids = [...new Set(youtubeLinks.map(youtubeId).filter((id) => id !== null))].slice(0, 50);
  return ids.length ? `https://www.youtube-nocookie.com/embed/${ids[0]}?autoplay=1&playlist=${ids.join(',')}` : null;
}
