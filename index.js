import { appTypes } from './appTypes.js';
import { genres } from './genres.js';
import { tech } from './tech.js';
import { visualStyle, colorLight } from './visuals.js';
import { mechanics } from './mechanics.js';
import { motion } from './motion.js';
import { controls, hud, params } from './interaction.js';
import { audio, data } from './output.js';
import { constraints } from './constraints.js';

/**
 * Graphical-mode term lists, keyed by category id. src/modes.js stamps the
 * category onto each term, builds the lookup tables and validates references,
 * so the term files stay free of boilerplate.
 */
export const SOURCES = [
  ['app-type', appTypes],
  ['genre', genres],
  ['tech', tech],
  ['visual-style', visualStyle],
  ['color-light', colorLight],
  ['mechanics', mechanics],
  ['motion', motion],
  ['controls', controls],
  ['hud', hud],
  ['params', params],
  ['audio', audio],
  ['data', data],
  ['constraints', constraints],
];
