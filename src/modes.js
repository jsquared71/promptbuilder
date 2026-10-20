import { graphical } from './data/modes/graphical.js';
import { software } from './data/modes/software.js';
import { writing } from './data/modes/writing.js';
import { analysis } from './data/modes/analysis.js';
import { assistant } from './data/modes/assistant.js';
import { image } from './data/modes/image.js';

/**
 * A mode is one kind of prompt: graphical apps, writing, data analysis and so
 * on. Each mode owns its categories, sections, terms and presets, plus an
 * `opening` function that turns the picks in its `core` section into the
 * first sentence of the prompt.
 *
 * Mode definitions are plain data. compileMode builds the lookup tables the
 * rest of the app needs and validates the data, so a typo in a term id or a
 * preset fails at import instead of silently doing nothing.
 */

export const DEFAULT_MODE_ID = 'graphical';

function compileMode(def) {
  const where = `mode "${def.id}"`;
  const categoriesById = new Map(def.categories.map((c) => [c.id, c]));

  const terms = def.terms.flatMap(([category, list]) => {
    if (!categoriesById.has(category)) throw new Error(`${where}: terms for unknown category "${category}"`);
    return list.map((term) => ({ conflictsWith: [], suggests: [], appliesTo: null, ...term, category }));
  });

  const termsById = new Map();
  for (const term of terms) {
    if (termsById.has(term.id)) throw new Error(`${where}: duplicate term id "${term.id}"`);
    termsById.set(term.id, term);
  }

  const termsByCategory = new Map(def.categories.map((c) => [c.id, []]));
  for (const term of terms) termsByCategory.get(term.category).push(term);

  for (const term of terms) {
    for (const ref of [...term.conflictsWith, ...term.suggests]) {
      if (!termsById.has(ref)) throw new Error(`${where}: term "${term.id}" references unknown term id "${ref}"`);
    }
    for (const ref of term.appliesTo ?? []) {
      if (termsById.get(ref)?.category !== def.filterCategory) {
        throw new Error(`${where}: term "${term.id}" applies to "${ref}", which is not a ${def.filterCategory} term`);
      }
    }
  }

  // Conflicts are declared on one side only but apply in both directions.
  const conflicts = new Map(terms.map((t) => [t.id, new Set(t.conflictsWith)]));
  for (const term of terms) {
    for (const other of term.conflictsWith) conflicts.get(other).add(term.id);
  }

  if (!def.sections.some((s) => s.id === 'core')) throw new Error(`${where}: needs a section with id "core"`);
  for (const section of def.sections) {
    for (const categoryId of section.categories) {
      if (!categoriesById.has(categoryId)) throw new Error(`${where}: section "${section.id}" lists unknown category "${categoryId}"`);
    }
  }

  for (const preset of def.presets) {
    for (const id of preset.terms) {
      if (!termsById.has(id)) throw new Error(`${where}: preset "${preset.id}" lists unknown term "${id}"`);
    }
  }

  return Object.freeze({
    openingUsesNote: false,
    closing: null,
    ...def,
    categoriesById,
    sectionIds: def.sections.map((s) => s.id),
    terms,
    termsById,
    termsByCategory,
    termOrder: new Map(terms.map((t, i) => [t.id, i])),
    conflicts,
    presetsById: new Map(def.presets.map((p) => [p.id, p])),
  });
}

export const MODES = [graphical, software, writing, analysis, assistant, image].map(compileMode);
export const MODES_BY_ID = new Map(MODES.map((m) => [m.id, m]));

/** Unknown or missing ids fall back to the default mode, which keeps old shared links working. */
export function getMode(id) {
  return MODES_BY_ID.get(id) ?? MODES_BY_ID.get(DEFAULT_MODE_ID);
}

/** Whether a term should show, given the term picked in the mode's filter category (if any). */
export function appliesToFilter(term, filterId) {
  return !term.appliesTo || !filterId || term.appliesTo.includes(filterId);
}
