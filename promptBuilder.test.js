import test from 'node:test';
import assert from 'node:assert/strict';

import { buildPrompt, joinList, promptStats } from '../src/promptBuilder.js';

test('joinList reads as English', () => {
  assert.equal(joinList([]), '');
  assert.equal(joinList(['gravity']), 'gravity');
  assert.equal(joinList(['gravity', 'wind']), 'gravity and wind');
  assert.equal(joinList(['gravity', 'wind', 'drag']), 'gravity, wind, and drag');
});

test('an empty selection produces no prompt', () => {
  assert.equal(buildPrompt([]), '');
  assert.equal(buildPrompt([], { core: '   ' }), '');
});

test('app type and genre combine into one opening sentence', () => {
  const prompt = buildPrompt(['2d-game', 'platformer']);
  assert.equal(prompt, 'Build a 2D browser game: a side-scrolling platformer.');
});

test('rendering technology becomes its own sentence', () => {
  const prompt = buildPrompt(['2d-game', 'canvas-2d']);
  assert.equal(prompt, 'Build a 2D browser game. Implement it with the HTML5 Canvas 2D API.');
});

test('a genre without an app type still opens sensibly', () => {
  assert.equal(buildPrompt(['boids']), 'Build a boids flocking simulation.');
});

test('technology alone falls back to a generic opening', () => {
  assert.equal(
    buildPrompt(['three-js']),
    'Build an interactive graphical web app. Implement it with Three.js.',
  );
});

test('each category contributes its own lead sentence', () => {
  const prompt = buildPrompt(['pixel-art', 'gravity', 'keyboard']);
  assert.equal(
    prompt,
    'The visual style should be pixel art with nearest-neighbour scaling and no blurring.\n\n' +
      'Implement these behaviors: gravity.\n\n' +
      'Controls: keyboard movement with both WASD and the arrow keys.',
  );
});

test('terms within a category are joined as prose in data order, not click order', () => {
  const clickedBackwards = buildPrompt(['high-contrast', 'pastel', 'dark-bg']);
  assert.equal(
    clickedBackwards,
    'For color and lighting, use a near-black background so bright elements pop, ' +
      'a soft pastel palette, and strong contrast so every element stays legible.',
  );
});

test('categories in the same section share a paragraph', () => {
  const prompt = buildPrompt(['pixel-art', 'dark-bg']);
  assert.equal(prompt.split('\n\n').length, 1);
  assert.match(prompt, /^The visual style should be .+\. For color and lighting, use .+\.$/);
});

test('paragraphs follow section order regardless of selection order', () => {
  const prompt = buildPrompt(['single-file', 'keyboard', '2d-game', 'pixel-art']);
  const paragraphs = prompt.split('\n\n');
  assert.match(paragraphs[0], /^Build a 2D browser game\./);
  assert.match(paragraphs[1], /^The visual style/);
  assert.match(paragraphs[2], /^Controls:/);
  assert.match(paragraphs[3], /^Requirements:/);
});

test('notes join their section as a proper sentence', () => {
  const prompt = buildPrompt(['2d-game'], { core: 'the player is a cat' });
  assert.equal(prompt, 'Build a 2D browser game. The player is a cat.');
});

test('a note that already ends in punctuation keeps it', () => {
  const prompt = buildPrompt(['2d-game'], { core: 'why not?' });
  assert.equal(prompt, 'Build a 2D browser game. Why not?');
});

test('a note alone is enough to produce a paragraph', () => {
  assert.equal(buildPrompt([], { behavior: 'enemies speed up over time' }),
    'Enemies speed up over time.');
});

test('unknown ids are ignored rather than crashing', () => {
  assert.equal(buildPrompt(['not-a-real-term', '2d-game']), 'Build a 2D browser game.');
});

test('promptStats counts words and terms', () => {
  const selected = ['2d-game', 'platformer'];
  const stats = promptStats(buildPrompt(selected), selected);
  assert.equal(stats.terms, 2);
  assert.equal(stats.words, 8);
});
