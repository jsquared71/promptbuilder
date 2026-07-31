import { CATEGORIES_BY_ID, SECTIONS } from './data/categories.js';
import { TERMS, TERMS_BY_ID } from './data/terms/index.js';

/** Position of each term in the data files, so output order is stable and sensible. */
const TERM_ORDER = new Map(TERMS.map((term, i) => [term.id, i]));

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

function selectedIn(categoryId, selected) {
  return [...selected]
    .map((id) => TERMS_BY_ID.get(id))
    .filter((term) => term && term.category === categoryId)
    .sort((a, b) => TERM_ORDER.get(a.id) - TERM_ORDER.get(b.id));
}

function buildOpening(selected) {
  const [appType] = selectedIn('app-type', selected);
  const [genre] = selectedIn('genre', selected);
  const [tech] = selectedIn('tech', selected);
  if (!appType && !genre && !tech) return [];

  const sentences = [];
  if (appType && genre) {
    sentences.push(`Build ${appType.promptText}: ${genre.promptText}.`);
  } else if (appType) {
    sentences.push(`Build ${appType.promptText}.`);
  } else if (genre) {
    sentences.push(`Build ${genre.promptText}.`);
  } else {
    sentences.push('Build an interactive graphical web app.');
  }
  if (tech) sentences.push(`Implement it with ${tech.promptText}.`);
  return sentences;
}

/**
 * Turns a selection into prose. Pure — the UI passes state in and gets a string
 * back, which is what makes this the easy part of the app to test.
 *
 * @param {Iterable<string>} selectedIds
 * @param {Record<string, string>} notes  free text keyed by section id
 * @returns {string} the assembled prompt, or '' when nothing is selected
 */
export function buildPrompt(selectedIds, notes = {}) {
  const selected = new Set(selectedIds);
  const paragraphs = [];

  for (const section of SECTIONS) {
    const sentences = [];

    if (section.id === 'core') {
      sentences.push(...buildOpening(selected));
    } else {
      for (const categoryId of section.categories) {
        const terms = selectedIn(categoryId, selected);
        if (!terms.length) continue;
        const category = CATEGORIES_BY_ID.get(categoryId);
        const list = joinList(terms.map((t) => t.promptText));
        sentences.push(category.lead.replace('{list}', list));
      }
    }

    const note = asSentence(notes[section.id] ?? '');
    if (note) sentences.push(note);

    if (sentences.length) paragraphs.push(sentences.join(' '));
  }

  return paragraphs.join('\n\n');
}

/** Rough guide shown next to the prompt so users can see it growing. */
export function promptStats(prompt, selectedIds) {
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  return { words, terms: new Set(selectedIds).size };
}
