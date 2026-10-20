import { MODES, appliesToFilter } from './modes.js';

/**
 * DOM handles built in buildSections and updated in place afterwards. They are
 * rebuilt only when the mode changes, never on an ordinary click.
 */
let chipNodes = new Map(); // term id -> button
let categoryNodes = new Map(); // category id -> section element
let sectionNodes = new Map(); // section id -> { details, badge, note }
let builtMode = null;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function buildChip(term) {
  const button = el('button', 'chip');
  button.type = 'button';
  button.dataset.termId = term.id;
  button.setAttribute('aria-pressed', 'false');
  button.append(el('span', 'chip-label', term.label));

  const description = el('span', 'chip-desc', term.description);
  description.id = `desc-${term.id}`;
  button.append(description);
  button.setAttribute('aria-describedby', description.id);
  return button;
}

/**
 * Builds the chip UI for one mode. Later updates only touch attributes and
 * classes, so free-text fields never lose focus mid-typing.
 */
export function buildSections(container, mode, { onToggle, onNote }) {
  chipNodes = new Map();
  categoryNodes = new Map();
  sectionNodes = new Map();
  builtMode = mode;
  container.replaceChildren();

  for (const section of mode.sections) {
    const details = el('details', 'section');
    details.open = Boolean(section.defaultOpen);
    details.dataset.sectionId = section.id;

    const summary = el('summary', 'section-summary');
    summary.append(el('span', 'section-title', section.title));
    const badge = el('span', 'section-badge');
    badge.hidden = true;
    summary.append(badge);
    details.append(summary);

    for (const categoryId of section.categories) {
      const category = mode.categoriesById.get(categoryId);
      const block = el('div', 'category');
      block.dataset.categoryId = categoryId;

      const heading = el('h3', 'category-title', category.title);
      block.append(heading);
      if (category.hint) block.append(el('p', 'category-hint', category.hint));

      const chips = el('div', 'chips');
      for (const term of mode.termsByCategory.get(categoryId)) {
        const chip = buildChip(term);
        chipNodes.set(term.id, chip);
        chips.append(chip);
      }
      block.append(chips);
      categoryNodes.set(categoryId, block);
      details.append(block);
    }

    const noteWrap = el('div', 'note');
    const noteId = `note-${section.id}`;
    const label = el('label', 'note-label', section.noteLabel);
    label.htmlFor = noteId;
    const input = el('input', 'note-input');
    input.id = noteId;
    input.type = 'text';
    input.placeholder = section.notePlaceholder ?? '';
    input.addEventListener('input', () => onNote(section.id, input.value));
    noteWrap.append(label, input);
    details.append(noteWrap);

    sectionNodes.set(section.id, { details, badge, note: input });
    container.append(details);
  }

  // Assigned rather than added, so rebuilding for another mode doesn't stack handlers.
  container.onclick = (event) => {
    const chip = event.target.closest('.chip');
    if (chip?.dataset.termId) onToggle(chip.dataset.termId);
  };
}

function matchesQuery(term, query) {
  if (!query) return true;
  return (
    term.label.toLowerCase().includes(query) ||
    term.description.toLowerCase().includes(query) ||
    term.promptText.toLowerCase().includes(query)
  );
}

/** Reflects the current state onto the already-built DOM. */
export function syncSections(state, { query = '', appType = null } = {}) {
  const mode = builtMode;
  const needle = query.trim().toLowerCase();
  const visibleByCategory = new Map();

  for (const [termId, chip] of chipNodes) {
    const term = mode.termsById.get(termId);
    const selected = state.selected.has(termId);
    const visible = appliesToFilter(term, appType) && matchesQuery(term, needle);

    chip.hidden = !visible;
    chip.classList.toggle('is-selected', selected);
    chip.classList.toggle('is-suggested', !selected && state.suggestions.has(termId));
    chip.setAttribute('aria-pressed', String(selected));

    if (visible) visibleByCategory.set(term.category, (visibleByCategory.get(term.category) ?? 0) + 1);
  }

  for (const [categoryId, block] of categoryNodes) {
    const category = mode.categoriesById.get(categoryId);
    const blocked = category.requiresFilter && !appType;
    block.hidden = blocked || !visibleByCategory.get(categoryId);
  }

  for (const section of mode.sections) {
    const { details, badge } = sectionNodes.get(section.id);
    const count = section.categories.reduce(
      (total, categoryId) =>
        total + [...state.selected].filter((id) => mode.termsById.get(id)?.category === categoryId).length,
      0,
    );
    badge.textContent = String(count);
    badge.hidden = count === 0;

    const hasVisible = section.categories.some((categoryId) => visibleByCategory.get(categoryId));
    details.hidden = Boolean(needle) && !hasVisible;
    if (needle && hasVisible) details.open = true;
  }
}

/** Notes are only pushed into inputs when they disagree, to preserve the caret. */
export function syncNotes(notes) {
  for (const [sectionId, { note }] of sectionNodes) {
    const value = notes[sectionId] ?? '';
    if (note.value !== value) note.value = value;
  }
}

export function renderPresets(container, mode, onPick) {
  container.replaceChildren();
  for (const preset of mode.presets) {
    const button = el('button', 'preset');
    button.type = 'button';
    button.append(el('span', 'preset-label', preset.label));
    button.append(el('span', 'preset-blurb', preset.blurb));
    button.addEventListener('click', () => onPick(preset.id));
    container.append(button);
  }
}

/** The removable tag list above the prompt — a quick way to undo a click. */
export function renderChosen(container, state, mode, onRemove) {
  container.replaceChildren();
  const ids = [...state.selected];
  if (!ids.length) {
    container.append(el('p', 'chosen-empty', 'Nothing selected yet.'));
    return;
  }
  for (const id of ids) {
    const term = mode.termsById.get(id);
    if (!term) continue;
    const tag = el('button', 'tag');
    tag.type = 'button';
    tag.title = `Remove "${term.label}"`;
    tag.setAttribute('aria-label', `Remove ${term.label}`);
    tag.append(el('span', null, term.label), el('span', 'tag-x', '×'));
    tag.addEventListener('click', () => onRemove(id));
    container.append(tag);
  }
}

/** The prompt-type switcher. Built once; syncModes marks the active one. */
export function buildModes(container, onPick) {
  container.replaceChildren();
  for (const mode of MODES) {
    const button = el('button', 'mode');
    button.type = 'button';
    button.dataset.modeId = mode.id;
    button.setAttribute('aria-pressed', 'false');
    button.append(el('span', 'mode-label', mode.label), el('span', 'mode-blurb', mode.blurb));
    button.addEventListener('click', () => onPick(mode.id));
    container.append(button);
  }
}

export function syncModes(container, activeId) {
  for (const button of container.querySelectorAll('.mode')) {
    button.setAttribute('aria-pressed', String(button.dataset.modeId === activeId));
  }
}
