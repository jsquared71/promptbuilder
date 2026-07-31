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
 * Term files stay free of boilerplate: the category id is stamped on here
 * rather than repeated on every entry.
 */
const SOURCES = [
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

export const TERMS = SOURCES.flatMap(([category, list]) =>
  list.map((term) => ({
    conflictsWith: [],
    suggests: [],
    appliesTo: null,
    ...term,
    category,
  })),
);

export const TERMS_BY_ID = new Map();
for (const term of TERMS) {
  if (TERMS_BY_ID.has(term.id)) {
    throw new Error(`Duplicate term id: ${term.id}`);
  }
  TERMS_BY_ID.set(term.id, term);
}

export const TERMS_BY_CATEGORY = new Map(SOURCES.map(([category]) => [category, []]));
for (const term of TERMS) {
  TERMS_BY_CATEGORY.get(term.category).push(term);
}

/** References to ids that don't exist would silently do nothing, so fail loudly instead. */
for (const term of TERMS) {
  for (const ref of [...term.conflictsWith, ...term.suggests]) {
    if (!TERMS_BY_ID.has(ref)) {
      throw new Error(`Term "${term.id}" references unknown term id "${ref}"`);
    }
  }
}

/**
 * Conflicts are declared on one side only but must apply in both directions,
 * so "no external libraries" and "Three.js" cancel each other whichever the
 * user clicks second.
 */
export const CONFLICTS = new Map(TERMS.map((t) => [t.id, new Set(t.conflictsWith)]));
for (const term of TERMS) {
  for (const other of term.conflictsWith) {
    CONFLICTS.get(other).add(term.id);
  }
}

export function getTerm(id) {
  return TERMS_BY_ID.get(id);
}

/** Terms in a category, narrowed to the chosen app type when they declare one. */
export function termsFor(categoryId, appTypeId) {
  const all = TERMS_BY_CATEGORY.get(categoryId) ?? [];
  return all.filter((t) => !t.appliesTo || !appTypeId || t.appliesTo.includes(appTypeId));
}

export function appliesToAppType(term, appTypeId) {
  return !term.appliesTo || !appTypeId || term.appliesTo.includes(appTypeId);
}
