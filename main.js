import { buildPrompt, promptStats, EMPTY_PROMPT_HINT } from './promptBuilder.js';
import { createStore, readInitialState, persist } from './state.js';
import { getMode } from './modes.js';
import {
  buildSections, syncSections, syncNotes, renderPresets, renderChosen, buildModes, syncModes,
} from './render.js';

const dom = {
  modes: document.getElementById('modes'),
  sections: document.getElementById('sections'),
  presets: document.getElementById('presets'),
  search: document.getElementById('search'),
  clear: document.getElementById('clear'),
  chosen: document.getElementById('chosen'),
  output: document.getElementById('prompt-output'),
  stats: document.getElementById('stats'),
  copy: document.getElementById('copy'),
  edited: document.getElementById('edited-notice'),
  revert: document.getElementById('revert'),
  theme: document.getElementById('theme-toggle'),
  jump: document.getElementById('jump'),
  jumpCount: document.getElementById('jump-count'),
};

const store = createStore(readInitialState());
let query = '';
/** True once the user has hand-edited the prompt; we stop overwriting them then. */
let edited = false;
/** The mode whose chips are currently in the DOM. */
let builtModeId = null;

/** Rebuilds the chips and presets — only when the mode actually changes. */
function buildForMode(mode) {
  buildSections(dom.sections, mode, {
    onToggle: (id) => store.toggle(id),
    onNote: (section, text) => store.setNote(section, text),
  });
  renderPresets(dom.presets, mode, (presetId) => {
    edited = false;
    store.usePreset(presetId);
  });
  dom.search.placeholder = `Search all terms — ${mode.searchHint}`;
  syncModes(dom.modes, mode.id);
  builtModeId = mode.id;
}

function render() {
  const state = store.getState();
  const mode = getMode(state.mode);
  if (mode.id !== builtModeId) buildForMode(mode);

  syncSections(state, { query, appType: store.appType() });
  syncNotes(state.notes);
  renderChosen(dom.chosen, state, mode, (id) => store.toggle(id));

  const prompt = buildPrompt(state.selected, state.notes, mode.id);
  if (!edited) {
    dom.output.value = prompt;
  }
  dom.output.placeholder = EMPTY_PROMPT_HINT;
  dom.edited.hidden = !edited;

  const { words, terms } = promptStats(dom.output.value, state.selected);
  dom.stats.textContent = `${terms} term${terms === 1 ? '' : 's'} · ${words} word${words === 1 ? '' : 's'}`;
  dom.copy.disabled = !dom.output.value.trim();
  dom.jumpCount.textContent = String(terms);
  dom.jump.hidden = terms === 0;

  persist(store.serialize());
}

buildModes(dom.modes, (modeId) => {
  if (modeId === store.mode()) return;
  // A hand-edited prompt belongs to the mode it was written in.
  edited = false;
  dom.search.value = '';
  query = '';
  store.setMode(modeId);
});

store.subscribe(render);

dom.search.addEventListener('input', () => {
  query = dom.search.value;
  render();
});

dom.clear.addEventListener('click', () => {
  edited = false;
  dom.search.value = '';
  query = '';
  store.clear();
});

dom.output.addEventListener('input', () => {
  edited = true;
  render();
});

dom.revert.addEventListener('click', () => {
  edited = false;
  render();
  dom.output.focus();
});

dom.copy.addEventListener('click', async () => {
  const text = dom.output.value;
  if (!text.trim()) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard access is denied in some contexts; selecting the text at least
    // leaves the user one keystroke away.
    dom.output.select();
    return;
  }
  const original = dom.copy.textContent;
  dom.copy.textContent = 'Copied';
  dom.copy.classList.add('is-done');
  setTimeout(() => {
    dom.copy.textContent = original;
    dom.copy.classList.remove('is-done');
  }, 1400);
});

/* Theme: follow the system by default, remember an explicit choice. */
const THEME_KEY = 'promptbuilder.theme';
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  dom.theme.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Not important enough to fail over.
  }
}
const storedTheme = (() => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
})();
setTheme(storedTheme ?? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
dom.theme.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
});

render();
