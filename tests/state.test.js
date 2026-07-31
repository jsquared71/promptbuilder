import test from 'node:test';
import assert from 'node:assert/strict';

import {
  toggleTerm,
  prune,
  suggestionsFor,
  applyPreset,
  encodeState,
  decodeState,
  createStore,
} from '../src/state.js';

const ids = (set) => [...set].sort();

test('toggling adds and removes', () => {
  const once = toggleTerm(new Set(), 'gravity');
  assert.deepEqual(ids(once), ['gravity']);
  assert.deepEqual(ids(toggleTerm(once, 'gravity')), []);
});

test('toggling does not mutate the input set', () => {
  const before = new Set(['gravity']);
  toggleTerm(before, 'wind');
  assert.deepEqual(ids(before), ['gravity']);
});

test('single-select categories replace rather than accumulate', () => {
  let selected = toggleTerm(new Set(), 'canvas-2d');
  selected = toggleTerm(selected, 'three-js');
  assert.deepEqual(ids(selected), ['three-js']);
});

test('multi-select categories accumulate', () => {
  let selected = toggleTerm(new Set(), 'pixel-art');
  selected = toggleTerm(selected, 'neon');
  assert.deepEqual(ids(selected), ['neon', 'pixel-art']);
});

test('conflicts resolve whichever term is clicked second', () => {
  let forwards = toggleTerm(new Set(), 'three-js');
  forwards = toggleTerm(forwards, 'no-libraries');
  assert.deepEqual(ids(forwards), ['no-libraries']);

  let backwards = toggleTerm(new Set(), 'no-libraries');
  backwards = toggleTerm(backwards, 'three-js');
  assert.deepEqual(ids(backwards), ['three-js']);
});

test('switching app type drops genres that no longer apply', () => {
  let selected = toggleTerm(new Set(), '2d-game');
  selected = toggleTerm(selected, 'platformer');
  selected = toggleTerm(selected, 'pixel-art');
  assert.ok(selected.has('platformer'));

  selected = toggleTerm(selected, '3d-game');
  assert.deepEqual(ids(selected), ['3d-game', 'pixel-art']);
});

test('terms without an app type restriction survive the switch', () => {
  let selected = toggleTerm(new Set(), 'physics-sim');
  selected = toggleTerm(selected, 'gravity');
  selected = toggleTerm(selected, 'data-viz');
  assert.ok(selected.has('gravity'));
});

test('prune ignores ids that are not real terms', () => {
  assert.deepEqual(ids(prune(new Set(['gravity', 'made-up']))), ['gravity']);
});

test('suggestions surface related terms without selecting them', () => {
  const selected = toggleTerm(new Set(), 'coyote-time');
  const suggestions = suggestionsFor(selected);
  assert.ok(suggestions.has('gravity'));
  assert.ok(suggestions.has('collision'));
  assert.ok(!suggestions.has('coyote-time'));
});

test('already-selected terms are not suggested', () => {
  let selected = toggleTerm(new Set(), 'coyote-time');
  selected = toggleTerm(selected, 'gravity');
  assert.ok(!suggestionsFor(selected).has('gravity'));
});

test('presets apply cleanly and respect the selection rules', () => {
  const selected = applyPreset('arcade-platformer');
  assert.ok(selected.has('platformer'));
  assert.ok(selected.has('canvas-2d'));
  // Exactly one term from each single-select category.
  assert.equal([...selected].filter((id) => ['canvas-2d', 'three-js', 'p5-js'].includes(id)).length, 1);
});

test('an unknown preset yields an empty selection', () => {
  assert.deepEqual(ids(applyPreset('nope')), []);
});

test('state survives an encode/decode round trip', () => {
  const original = {
    selected: ['2d-game', 'platformer', 'pixel-art'],
    notes: { core: 'a cat delivering mail', visuals: 'three shades of teal' },
  };
  const decoded = decodeState(encodeState(original));
  assert.deepEqual(ids(decoded.selected), ids(new Set(original.selected)));
  assert.deepEqual(decoded.notes, original.notes);
});

test('encoding survives characters that need escaping', () => {
  const decoded = decodeState(encodeState({ selected: [], notes: { core: 'a & b = c #1' } }));
  assert.equal(decoded.notes.core, 'a & b = c #1');
});

test('decoding tolerates junk', () => {
  const decoded = decodeState('#t=gravity,made-up,&n.nosuchsection=x');
  assert.deepEqual(ids(decoded.selected), ['gravity']);
  assert.deepEqual(decoded.notes, {});
});

test('empty notes are left out of the encoding', () => {
  assert.equal(encodeState({ selected: [], notes: { core: '   ' } }), '');
});

test('the store notifies subscribers on every change', () => {
  const store = createStore();
  let updates = 0;
  store.subscribe(() => { updates += 1; });

  store.toggle('gravity');
  assert.equal(updates, 1);
  assert.ok(store.isSelected('gravity'));

  store.setNote('behavior', 'faster over time');
  assert.equal(store.getState().notes.behavior, 'faster over time');

  store.usePreset('emergent-sim');
  assert.ok(store.isSelected('boids'));
  assert.deepEqual(store.getState().notes, {});

  store.clear();
  assert.deepEqual(ids(store.getState().selected), []);
  assert.equal(updates, 4);
});

test('the store reports the current app type', () => {
  const store = createStore();
  assert.equal(store.appType(), null);
  store.toggle('3d-game');
  assert.equal(store.appType(), '3d-game');
});
