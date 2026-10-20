import test from 'node:test';
import assert from 'node:assert/strict';

import { MODES, getMode, DEFAULT_MODE_ID } from '../src/modes.js';
import { buildPrompt } from '../src/promptBuilder.js';
import { toggleTerm, applyPreset, encodeState, decodeState, createStore } from '../src/state.js';

const ids = (set) => [...set].sort();

test('every mode has a core section, presets and terms', () => {
  assert.ok(MODES.length >= 6);
  for (const mode of MODES) {
    assert.ok(mode.sectionIds.includes('core'), mode.id);
    assert.ok(mode.presets.length > 0, mode.id);
    assert.ok(mode.terms.length > 20, mode.id);
  }
});

test('every non-core category has a lead with a {list} slot', () => {
  for (const mode of MODES) {
    const core = new Set(mode.sections.find((s) => s.id === 'core').categories);
    for (const category of mode.categories) {
      if (core.has(category.id)) continue;
      assert.match(category.lead ?? '', /\{list\}/, `${mode.id}/${category.id}`);
    }
  }
});

test('every preset applies in full and produces a prompt', () => {
  for (const mode of MODES) {
    for (const preset of mode.presets) {
      const selected = applyPreset(preset.id, mode.id);
      // Nothing in a preset should be dropped by conflicts or filtering.
      assert.deepEqual(ids(selected), ids(new Set(preset.terms)), `${mode.id}/${preset.id}`);
      assert.ok(buildPrompt(selected, {}, mode.id).length > 50, `${mode.id}/${preset.id}`);
    }
  }
});

test('unknown modes fall back to the default', () => {
  assert.equal(getMode('nope').id, DEFAULT_MODE_ID);
  assert.equal(getMode(undefined).id, DEFAULT_MODE_ID);
});

test('software: kind and stack form the opening', () => {
  assert.equal(
    buildPrompt(['crud-app', 'power-apps'], {}, 'software'),
    'Build an internal business app for creating, viewing and updating records using a Power Apps canvas app with Power Fx formulas.',
  );
  assert.equal(buildPrompt(['python'], {}, 'software'), 'Write the code using Python 3.');
});

test('software: stacks are filtered by what you are building', () => {
  let selected = toggleTerm(new Set(), 'crud-app', 'software');
  selected = toggleTerm(selected, 'power-apps', 'software');
  selected = toggleTerm(selected, 'script', 'software');
  assert.deepEqual(ids(selected), ['script']);
});

test('writing: tasks wrap the kind of writing', () => {
  assert.equal(buildPrompt(['email', 'draft'], {}, 'writing'), 'Write an email.');
  assert.equal(buildPrompt(['faq'], {}, 'writing'), 'Write an FAQ.');
  assert.equal(
    buildPrompt(['email', 'rewrite'], {}, 'writing'),
    'Rewrite the email below to make it clearer and more effective.\n\nDraft:\n[paste it here]',
  );
});

test('writing: tasks read sensibly without a kind', () => {
  assert.equal(buildPrompt(['summarize'], {}, 'writing'), 'Summarize the text below.\n\nText:\n[paste it here]');
  assert.match(buildPrompt(['proofread'], {}, 'writing'), /^Proofread the text below\./);
});

test('writing: single-select length replaces, lead sentence reads as prose', () => {
  let selected = toggleTerm(new Set(), 'short', 'writing');
  selected = toggleTerm(selected, 'medium', 'writing');
  assert.equal(buildPrompt(selected, {}, 'writing'), 'Keep it to about 250 words.');
});

test('analysis: task template takes the data source', () => {
  assert.equal(
    buildPrompt(['trends', 'spreadsheet'], {}, 'analysis'),
    'Analyze the attached spreadsheet to find trends and changes over time.',
  );
  assert.equal(
    buildPrompt(['pasted'], {}, 'analysis'),
    'Analyze the data below.\n\nData:\n[paste it here]',
  );
});

test('assistant: the opening is written in the second person', () => {
  assert.match(buildPrompt(['tutor'], {}, 'assistant'), /^You are a patient tutor/);
});

test('image: the subject note is folded into the opening sentence', () => {
  assert.equal(
    buildPrompt(['photo'], { core: 'Students in a library.' }, 'image'),
    'Create a photograph of students in a library.',
  );
  assert.equal(buildPrompt([], { core: 'ECU campus at dusk' }, 'image'), 'Create an image of ECU campus at dusk.');
  assert.equal(buildPrompt(['icon'], {}, 'image'), 'Create a simple icon.');
});

test('ids from another mode are ignored', () => {
  assert.equal(buildPrompt(['2d-game', 'email'], {}, 'writing'), 'Write an email.');
});

test('the mode is encoded, except for the default mode', () => {
  assert.equal(encodeState({ mode: 'graphical', selected: ['2d-game'] }), 't=2d-game');
  const fragment = encodeState({ mode: 'writing', selected: ['email'], notes: { core: 'printers' } });
  assert.match(fragment, /^m=writing&/);
  const decoded = decodeState(fragment);
  assert.equal(decoded.mode, 'writing');
  assert.deepEqual(ids(decoded.selected), ['email']);
  assert.deepEqual(decoded.notes, { core: 'printers' });
});

test('links shared before modes existed still open in the graphical mode', () => {
  const decoded = decodeState('#t=particle-sim,boids,canvas-2d');
  assert.equal(decoded.mode, 'graphical');
  assert.deepEqual(ids(decoded.selected), ['boids', 'canvas-2d', 'particle-sim']);
});

test('the store keeps separate work for each mode', () => {
  const store = createStore();
  store.toggle('2d-game');
  store.setMode('writing');
  assert.deepEqual(ids(store.getState().selected), []);
  store.toggle('email');
  store.setNote('core', 'printers');
  store.setMode('graphical');
  assert.deepEqual(ids(store.getState().selected), ['2d-game']);
  store.setMode('writing');
  assert.deepEqual(ids(store.getState().selected), ['email']);
  assert.equal(store.getState().notes.core, 'printers');
});

test('clear only empties the current mode', () => {
  const store = createStore();
  store.toggle('2d-game');
  store.setMode('image');
  store.toggle('photo');
  store.clear();
  store.setMode('graphical');
  assert.deepEqual(ids(store.getState().selected), ['2d-game']);
});

test('serialized work round-trips into a new store', () => {
  const store = createStore();
  store.toggle('2d-game');
  store.setMode('analysis');
  store.toggle('survey');

  const saved = store.serialize();
  assert.equal(saved.mode, 'analysis');
  const workspaces = Object.fromEntries(Object.entries(saved.workspaces).map(([m, f]) => [m, decodeState(f)]));
  const restored = createStore({ mode: saved.mode, workspaces });
  assert.deepEqual(ids(restored.getState().selected), ['survey']);
  restored.setMode('graphical');
  assert.deepEqual(ids(restored.getState().selected), ['2d-game']);
});

test('setMode to the same mode does not notify', () => {
  const store = createStore();
  let updates = 0;
  store.subscribe(() => { updates += 1; });
  store.setMode('graphical');
  assert.equal(updates, 0);
  store.setMode('image');
  assert.equal(updates, 1);
});
