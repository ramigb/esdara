import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stack } from './stack.ts';

const feed = (ids: string) => [...ids].map((id, n) => ({ n, artist: { id } }));
const show = (items: ReturnType<typeof stack<{ n: number; artist: { id: string } }>>) =>
  items.map((r) => r.artist.id + (r.more ? `+${r.more}` : '')).join(' ');

test('runs of 3+ collapse into the newest release; runs of 1-2 stay', () => {
  assert.equal(show(stack(feed('aaabbcaaaa'))), 'a+2 b b c a+3');
  assert.equal(stack(feed('aaab'))[0].n, 0); // the newest of the run is the one shown
});

test('edges: empty, all one artist, no runs', () => {
  assert.deepEqual(stack([]), []);
  assert.equal(show(stack(feed('aaaaa'))), 'a+4');
  assert.equal(show(stack(feed('abab'))), 'a b a b');
});
