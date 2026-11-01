import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalize } from './normalize.ts';

test('folds Arabic spelling variants', () => {
  assert.equal(normalize('أَحْمَد'), normalize('احمد'));
  assert.equal(normalize('إيمان'), 'ايمان');
  assert.equal(normalize('آمال'), 'امال');
  assert.equal(normalize('مدرسة'), 'مدرسه');
  assert.equal(normalize('مصطفى'), 'مصطفي');
  assert.equal(normalize('جـــميل'), 'جميل');
});

test('folds Latin case and accents', () => {
  assert.equal(normalize('Café BAND'), 'cafe band');
});
