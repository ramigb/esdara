// Feed grouping: a run of 3+ consecutive releases by one artist shows as its first (newest) release,
// with `more` counting the rest, so one busy artist doesn't fill the page. Runs of 2 stay as they are.
export const stack = <T extends { artist: { id: string } }>(items: T[]): (T & { more?: number })[] => {
  const out: (T & { more?: number })[] = [];
  for (let i = 0, j = 1; i < items.length; i = j++) {
    while (j < items.length && items[j].artist.id === items[i].artist.id) j++;
    out.push(...(j - i > 2 ? [{ ...items[i], more: j - i - 1 }] : items.slice(i, j)));
  }
  return out;
};
