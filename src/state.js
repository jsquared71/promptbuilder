import { MODES, DEFAULT_MODE_ID, getMode, appliesToFilter } from './modes.js';

const STORAGE_KEY = 'promptbuilder.v2';
/** Saved by the single-mode version of the app; read once so nobody loses work. */
const LEGACY_STORAGE_KEY = 'promptbuilder.v1';

/* ------------------------------------------------------------------ *
 * Pure selection logic. Every function takes an optional mode id and
 * defaults to the graphical mode.
 * ------------------------------------------------------------------ */

/** The selected term in the mode's filter category (e.g. the app type), if any. */
export function currentFilter(selected, modeId) {
  const mode = getMode(modeId);
  if (!mode.filterCategory) return null;
  for (const id of selected) {
    if (mode.termsById.get(id)?.category === mode.filterCategory) return id;
  }
  return null;
}

/**
 * Drops selections that no longer make sense — unknown ids, and terms tied to
 * a filter choice (such as an app type) the user has since switched away from.
 */
export function prune(selected, modeId) {
  const mode = getMode(modeId);
  const filterId = currentFilter(selected, mode.id);
  const next = new Set();
  for (const id of selected) {
    const term = mode.termsById.get(id);
    if (!term) continue;
    if (!appliesToFilter(term, filterId)) continue;
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
export function toggleTerm(selected, id, modeId) {
  const mode = getMode(modeId);
  const term = mode.termsById.get(id);
  if (!term) return new Set(selected);

  const next = new Set(selected);
  if (next.has(id)) {
    next.delete(id);
    return prune(next, mode.id);
  }

  const category = mode.categoriesById.get(term.category);
  if (category?.selectMode === 'single') {
    for (const other of [...next]) {
      if (mode.termsById.get(other)?.category === term.category) next.delete(other);
    }
  }
  for (const conflicting of mode.conflicts.get(id) ?? []) {
    next.delete(conflicting);
  }

  next.add(id);
  return prune(next, mode.id);
}

/**
 * Terms the current selection hints at but the user hasn't picked. Shown as a
 * soft highlight rather than auto-selected — suggesting beats deciding.
 */
export function suggestionsFor(selected, modeId) {
  const mode = getMode(modeId);
  const filterId = currentFilter(selected, mode.id);
  const suggestions = new Set();
  for (const id of selected) {
    for (const suggested of mode.termsById.get(id)?.suggests ?? []) {
      if (selected.has(suggested)) continue;
      const term = mode.termsById.get(suggested);
      if (!term || !appliesToFilter(term, filterId)) continue;
      if ([...(mode.conflicts.get(suggested) ?? [])].some((c) => selected.has(c))) continue;
      suggestions.add(suggested);
    }
  }
  return suggestions;
}

export function applyPreset(presetId, modeId) {
  const mode = getMode(modeId);
  const preset = mode.presetsById.get(presetId);
  if (!preset) return new Set();
  // Run the terms through toggleTerm so preset data can't smuggle in a
  // combination the rules would otherwise forbid.
  let selected = new Set();
  for (const id of preset.terms) selected = toggleTerm(selected, id, mode.id);
  return selected;
}

/* ------------------------------------------------------------------ *
 * Serialization
 * ------------------------------------------------------------------ */

/**
 * @returns {string} a URL query fragment, without the leading '#'. The mode is
 * left out for the default mode, so links shared before modes existed still match.
 */
export function encodeState({ mode, selected = [], notes = {} } = {}) {
  const resolved = getMode(mode);
  const paramList = new URLSearchParams();
  if (resolved.id !== DEFAULT_MODE_ID) paramList.set('m', resolved.id);
  const ids = [...selected].filter((id) => resolved.termsById.has(id));
  if (ids.length) paramList.set('t', ids.join(','));
  for (const [section, text] of Object.entries(notes)) {
    if (text && text.trim() && resolved.sectionIds.includes(section)) paramList.set(`n.${section}`, text.trim());
  }
  return paramList.toString();
}

/** Whether a fragment carries anything beyond the mode itself. */
function hasContent({ selected, notes }) {
  return selected.size > 0 || Object.keys(notes).length > 0;
}

export function decodeState(fragment = '') {
  const paramList = new URLSearchParams(fragment.replace(/^#/, ''));
  const mode = getMode(paramList.get('m'));
  const ids = (paramList.get('t') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter((id) => mode.termsById.has(id));

  const notes = {};
  for (const [key, value] of paramList.entries()) {
    if (!key.startsWith('n.')) continue;
    const section = key.slice(2);
    if (mode.sectionIds.includes(section)) notes[section] = value;
  }
  return { mode: mode.id, selected: prune(new Set(ids), mode.id), notes };
}

/* ------------------------------------------------------------------ *
 * Store
 *
 * Each mode keeps its own selection and notes, so switching from Writing to
 * Image and back doesn't throw away a prompt in progress.
 * ------------------------------------------------------------------ */

function emptyWorkspace() {
  return { selected: new Set(), notes: {} };
}

/**
 * @param {object} initial
 * @param {string} [initial.mode]
 * @param {Iterable<string>} [initial.selected]  for the initial mode
 * @param {object} [initial.notes]               for the initial mode
 * @param {Record<string, {selected, notes}>} [initial.workspaces]  other modes' saved work
 */
export function createStore(initial = {}) {
  const workspaces = new Map(MODES.map((m) => [m.id, emptyWorkspace()]));
  for (const [modeId, saved] of Object.entries(initial.workspaces ?? {})) {
    if (!workspaces.has(modeId)) continue;
    workspaces.set(modeId, { selected: prune(new Set(saved.selected ?? []), modeId), notes: { ...(saved.notes ?? {}) } });
  }

  let mode = getMode(initial.mode).id;
  if (initial.selected || initial.notes) {
    workspaces.set(mode, { selected: prune(new Set(initial.selected ?? []), mode), notes: { ...(initial.notes ?? {}) } });
  }

  const listeners = new Set();
  const current = () => workspaces.get(mode);

  function getState() {
    const { selected, notes } = current();
    return { mode, selected: new Set(selected), notes: { ...notes }, suggestions: suggestionsFor(selected, mode) };
  }

  function emit() {
    const snapshot = getState();
    for (const listener of listeners) listener(snapshot);
  }

  return {
    getState,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    mode: () => mode,
    isSelected: (id) => current().selected.has(id),
    /** The selected term in the current mode's filter category, e.g. the app type. */
    appType: () => currentFilter(current().selected, mode),
    setMode(modeId) {
      const next = getMode(modeId).id;
      if (next === mode) return;
      mode = next;
      emit();
    },
    toggle(id) {
      current().selected = toggleTerm(current().selected, id, mode);
      emit();
    },
    setNote(section, text) {
      current().notes[section] = text;
      emit();
    },
    usePreset(presetId) {
      workspaces.set(mode, { selected: applyPreset(presetId, mode), notes: {} });
      emit();
    },
    clear() {
      workspaces.set(mode, emptyWorkspace());
      emit();
    },
    replace(next) {
      if (next.mode) mode = getMode(next.mode).id;
      workspaces.set(mode, { selected: prune(new Set(next.selected ?? []), mode), notes: { ...(next.notes ?? {}) } });
      emit();
    },
    /** Everything worth saving: the active mode plus every mode's work, encoded. */
    serialize() {
      const saved = {};
      for (const [modeId, workspace] of workspaces) {
        const fragment = encodeState({ mode: modeId, ...workspace });
        if (fragment && fragment !== `m=${modeId}`) saved[modeId] = fragment;
      }
      return { mode, workspaces: saved };
    },
  };
}

/* ------------------------------------------------------------------ *
 * Browser persistence (no-ops outside a browser, so tests can import this)
 * ------------------------------------------------------------------ */

function readStored() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const workspaces = {};
      for (const [modeId, fragment] of Object.entries(parsed.workspaces ?? {})) {
        const decoded = decodeState(fragment);
        if (decoded.mode === modeId) workspaces[modeId] = decoded;
      }
      return { mode: getMode(parsed.mode).id, workspaces };
    }
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) return { mode: DEFAULT_MODE_ID, workspaces: { [DEFAULT_MODE_ID]: decodeState(legacy) } };
  } catch {
    // Private browsing, blocked storage or corrupt JSON — just start empty.
  }
  return { mode: DEFAULT_MODE_ID, workspaces: {} };
}

export function readInitialState() {
  if (typeof window === 'undefined') return {};

  const stored = readStored();
  if (window.location.hash.length > 1) {
    const fromUrl = decodeState(window.location.hash);
    // A link always wins for the mode it names; other modes keep their saved work.
    if (hasContent(fromUrl) || /(^|[#&])m=/.test(window.location.hash)) {
      const keepUrl = hasContent(fromUrl) ? fromUrl : stored.workspaces[fromUrl.mode] ?? {};
      return { mode: fromUrl.mode, selected: keepUrl.selected, notes: keepUrl.notes, workspaces: stored.workspaces };
    }
  }
  const active = stored.workspaces[stored.mode] ?? {};
  return { mode: stored.mode, selected: active.selected, notes: active.notes, workspaces: stored.workspaces };
}

/** @param {ReturnType<ReturnType<typeof createStore>['serialize']>} saved */
export function persist(saved) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Ignore — persistence is a convenience, not a requirement.
  }
  const fragment = saved.workspaces[saved.mode] ?? (saved.mode === DEFAULT_MODE_ID ? '' : `m=${saved.mode}`);
  const url = `${window.location.pathname}${window.location.search}${fragment ? `#${fragment}` : ''}`;
  window.history.replaceState(null, '', url);
}
