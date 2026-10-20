import { getMode } from './modes.js';

export const EMPTY_PROMPT_HINT =
  'Pick a few terms on the left and your prompt will appear here.';

/** ['a', 'b', 'c'] -> 'a, b, and c' */
export function joinList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** Free text is dropped mid-paragraph, so it needs to read as a sentence. */
function asSentence(text) {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const capitalized = trimmed[0].toUpperCase() + trimmed.slice(1);
  return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
}

/**
 * Turns a selection into prose. Pure — the UI passes state in and gets a string
 * back, which is what makes this the easy part of the app to test.
 *
 * Each section becomes a paragraph. The `core` section is written by the
 * mode's own `opening` function; every other category contributes its `lead`
 * sentence with the selected terms joined into it.
 *
 * @param {Iterable<string>} selectedIds
 * @param {Record<string, string>} notes  free text keyed by section id
 * @param {string} [modeId]  defaults to the graphical mode
 * @returns {string} the assembled prompt, or '' when nothing is selected
 */
export function buildPrompt(selectedIds, notes = {}, modeId) {
  const mode = getMode(modeId);
  const selected = new Set(selectedIds);

  /** Selected terms in a category, in data order rather than click order. */
  const pick = (categoryId) =>
    [...selected]
      .map((id) => mode.termsById.get(id))
      .filter((term) => term && term.category === categoryId)
      .sort((a, b) => mode.termOrder.get(a.id) - mode.termOrder.get(b.id));

  const paragraphs = [];

  for (const section of mode.sections) {
    const sentences = [];
    const rawNote = notes[section.id] ?? '';

    if (section.id === 'core') {
      sentences.push(...mode.opening(pick, rawNote));
    } else {
      for (const categoryId of section.categories) {
        const terms = pick(categoryId);
        if (!terms.length) continue;
        const category = mode.categoriesById.get(categoryId);
        sentences.push(category.lead.replace('{list}', joinList(terms.map((t) => t.promptText))));
      }
    }

    const noteConsumed = section.id === 'core' && mode.openingUsesNote;
    const note = noteConsumed ? '' : asSentence(rawNote);
    if (note) sentences.push(note);

    if (sentences.length) paragraphs.push(sentences.join(' '));
  }

  // Some modes end with a slot to paste source material into ("Draft: …").
  if (paragraphs.length && mode.closing) {
    const closing = mode.closing(pick);
    if (closing) paragraphs.push(closing);
  }

  return paragraphs.join('\n\n');
}

/** Rough guide shown next to the prompt so users can see it growing. */
export function promptStats(prompt, selectedIds) {
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  return { words, terms: new Set(selectedIds).size };
}
