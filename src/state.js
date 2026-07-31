import { CATEGORIES_BY_ID, SECTION_IDS } from './data/categories.js';
import { CONFLICTS, TERMS_BY_ID, appliesToAppType } from './data/terms/index.js';
import { PRESETS_BY_ID } from './data/presets.js';

const STORAGE_KEY = 'promptbuilder.v1';

/* ------------------------------------------------------------------ *
 * Pure selection logic
 * ------------------------------------------------------------------ */

function currentAppType(selected) {
  for (const id of selected) {
    const term = TERMS_BY_ID.get(id);
    if (term?.category === 'app-type') return id;
  }
  return null;
}

/**
 * Drops selections that no longer make sense — genre terms belonging to an app
 * type the user has since switched away from.
 */
export function prune(selected) {
  const appType = currentAppType(selected);
  const next = new Set();
  for (const id of selected) {
    const term = TERMS_BY_ID.get(id);
    if (!term) continue;
    if (!appliesToAppType(term, appType)) continue;
    next.add(id);
  }
  return next;
}

/**
 * Toggling a term, with the two rules that make the chips behave predictably:
 * single-select categories replace rather than accumulate, and conflicting
 * terms deselect each other whichever one is clicked second.
 *
 * @returns {Set<string>} a new set — the input is not modified
 */
export function toggleTerm(selected, id) {
  const term = TERMS_BY_ID.get(id);
  if (!term) return new Set(selected);

  const next = new Set(selected);
  if (next.has(id)) {
    next.delete(id);
    return prune(next);
  }

  const category = CATEGORIES_BY_ID.get(term.category);
  if (category?.selectMode === 'single') {
    for (const other of [...next]) {
      if (TERMS_BY_ID.get(other)?.category === term.category) next.delete(other);
    }
  }
  for (const conflicting of CONFLICTS.get(id) ?? []) {
    next.delete(conflicting);
  }

  next.add(id);
  return prune(next);
}

/**
 * Terms the current selection hints at but the user hasn't picked. Shown as a
 * soft highlight rather than auto-selected — suggesting beats deciding.
 */
export function suggestionsFor(selected) {
  const appType = currentAppType(selected);
  const suggestions = new Set();
  for (const id of selected) {
    for (const suggested of TERMS_BY_ID.get(id)?.suggests ?? []) {
      if (selected.has(suggested)) continue;
      const term = TERMS_BY_ID.get(suggested);
      if (!term || !appliesToAppType(term, appType)) continue;
      if (CONFLICTS.get(suggested)?.size && [...CONFLICTS.get(suggested)].some((c) => selected.has(c))) continue;
      suggestions.add(suggested);
    }
  }
  return suggestions;
}

export function applyPreset(presetId) {
  const preset = PRESETS_BY_ID.get(presetId);
  if (!preset) return new Set();
  // Run the terms through toggleTerm so preset data can't smuggle in a
  // combination the rules would otherwise forbid.
  let selected = new Set();
  for (const id of preset.terms) selected = toggleTerm(selected, id);
  return selected;
}

/* ------------------------------------------------------------------ *
 * Serialization
 * ------------------------------------------------------------------ */

/** @returns {string} a URL query fragment, without the leading '#' */
export function encodeState({ selected = [], notes = {} } = {}) {
  const paramList = new URLSearchParams();
  const ids = [...selected].filter((id) => TERMS_BY_ID.has(id));
  if (ids.length) paramList.set('t', ids.join(','));
  for (const [section, text] of Object.entries(notes)) {
    if (text && text.trim()) paramList.set(`n.${section}`, text.trim());
  }
  return paramList.toString();
}

export function decodeState(fragment = '') {
  const paramList = new URLSearchParams(fragment.replace(/^#/, ''));
  const ids = (paramList.get('t') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((id) => TERMS_BY_ID.has(id));

  const notes = {};
  for (const [key, value] of paramList.entries()) {
    if (!key.startsWith('n.')) continue;
    const section = key.slice(2);
    if (SECTION_IDS.includes(section)) notes[section] = value;
  }
  return { selected: prune(new Set(ids)), notes };
}

/* ------------------------------------------------------------------ *
 * Store
 * ------------------------------------------------------------------ */

export function createStore(initial = {}) {
  let selected = prune(new Set(initial.selected ?? []));
  let notes = { ...(initial.notes ?? {}) };
  const listeners = new Set();

  function emit() {
    const snapshot = getState();
    for (const listener of listeners) listener(snapshot);
  }

  function getState() {
    return { selected: new Set(selected), notes: { ...notes }, suggestions: suggestionsFor(selected) };
  }

  return {
    getState,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    isSelected: (id) => selected.has(id),
    appType: () => currentAppType(selected),
    toggle(id) {
      selected = toggleTerm(selected, id);
      emit();
    },
    setNote(section, text) {
      notes[section] = text;
      emit();
    },
    usePreset(presetId) {
      selected = applyPreset(presetId);
      notes = {};
      emit();
    },
    clear() {
      selected = new Set();
      notes = {};
      emit();
    },
    replace(next) {
      selected = prune(new Set(next.selected ?? []));
      notes = { ...(next.notes ?? {}) };
      emit();
    },
  };
}

/* ------------------------------------------------------------------ *
 * Browser persistence (no-ops outside a browser, so tests can import this)
 * ------------------------------------------------------------------ */

export function readInitialState() {
  if (typeof window === 'undefined') return { selected: [], notes: {} };

  if (window.location.hash.length > 1) {
    const fromUrl = decodeState(window.location.hash);
    if (fromUrl.selected.size || Object.keys(fromUrl.notes).length) return fromUrl;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) return decodeState(stored);
  } catch {
    // Private browsing and blocked storage are fine; just start empty.
  }
  return { selected: [], notes: {} };
}

export function persist(state) {
  if (typeof window === 'undefined') return;
  const fragment = encodeState(state);
  try {
    window.localStorage.setItem(STORAGE_KEY, fragment);
  } catch {
    // Ignore — persistence is a convenience, not a requirement.
  }
  const url = `${window.location.pathname}${window.location.search}${fragment ? `#${fragment}` : ''}`;
  window.history.replaceState(null, '', url);
}
