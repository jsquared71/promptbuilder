/**
 * Sections group categories into the panels the user sees, and each section
 * becomes one paragraph of the generated prompt.
 *
 * Categories own the chips themselves plus the sentence template (`lead`) used
 * to turn a list of selected terms into prose. `{list}` is replaced with the
 * terms joined as a natural language list.
 */

export const CATEGORIES = [
  {
    id: 'app-type',
    title: 'App type',
    hint: 'Pick one — this filters the options below.',
    selectMode: 'single',
  },
  {
    id: 'genre',
    title: 'Genre / subject',
    hint: 'What specifically is it?',
    selectMode: 'single',
    // The genre list is long and app-type specific, so it stays hidden until
    // there is something to filter it by.
    requiresAppType: true,
  },
  {
    id: 'tech',
    title: 'Rendering technology',
    hint: 'How should it be drawn?',
    selectMode: 'single',
  },
  {
    id: 'visual-style',
    title: 'Visual style',
    selectMode: 'multi',
    lead: 'The visual style should be {list}.',
  },
  {
    id: 'color-light',
    title: 'Color & light',
    selectMode: 'multi',
    lead: 'For color and lighting, use {list}.',
  },
  {
    id: 'mechanics',
    title: 'Mechanics & physics',
    selectMode: 'multi',
    lead: 'Implement these behaviors: {list}.',
  },
  {
    id: 'motion',
    title: 'Motion & game feel',
    selectMode: 'multi',
    lead: 'For motion and feel, add {list}.',
  },
  {
    id: 'controls',
    title: 'Controls & input',
    selectMode: 'multi',
    lead: 'Controls: {list}.',
  },
  {
    id: 'hud',
    title: 'Interface & HUD',
    selectMode: 'multi',
    lead: 'Include this interface: {list}.',
  },
  {
    id: 'params',
    title: 'Live controls',
    selectMode: 'multi',
    lead: 'Give the user live control over the running scene: {list}.',
  },
  {
    id: 'audio',
    title: 'Audio',
    selectMode: 'multi',
    lead: 'Audio: {list}.',
  },
  {
    id: 'data',
    title: 'Data & persistence',
    selectMode: 'multi',
    lead: 'Persistence and export: {list}.',
  },
  {
    id: 'constraints',
    title: 'Requirements & constraints',
    selectMode: 'multi',
    lead: 'Requirements: {list}.',
  },
];

export const SECTIONS = [
  {
    id: 'core',
    title: 'What to build',
    defaultOpen: true,
    categories: ['app-type', 'genre', 'tech'],
    noteLabel: 'Anything else about what you want built?',
    notePlaceholder: 'e.g. the player is a cat delivering mail across rooftops',
  },
  {
    id: 'visuals',
    title: 'Look & feel',
    defaultOpen: true,
    categories: ['visual-style', 'color-light'],
    noteLabel: 'Any specific visual details?',
    notePlaceholder: 'e.g. everything is drawn in three shades of teal',
  },
  {
    id: 'behavior',
    title: 'Behavior & physics',
    defaultOpen: true,
    categories: ['mechanics'],
    noteLabel: 'Any specific rules or behaviors?',
    notePlaceholder: 'e.g. enemies get faster every 30 seconds',
  },
  {
    id: 'motion',
    title: 'Motion & game feel',
    categories: ['motion'],
    noteLabel: 'Any specific animation notes?',
    notePlaceholder: 'e.g. the camera drifts slowly even when idle',
  },
  {
    id: 'interaction',
    title: 'Controls & interface',
    categories: ['controls', 'hud', 'params'],
    noteLabel: 'Any specific control or UI notes?',
    notePlaceholder: 'e.g. holding space charges a jump',
  },
  {
    id: 'output',
    title: 'Audio, data & export',
    categories: ['audio', 'data'],
    noteLabel: 'Any specific audio or data notes?',
    notePlaceholder: 'e.g. the soundtrack reacts to how fast the player moves',
  },
  {
    id: 'constraints',
    title: 'Requirements',
    categories: ['constraints'],
    noteLabel: 'Any other requirements?',
    notePlaceholder: 'e.g. it has to work offline on an old iPad',
  },
];

export const CATEGORIES_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
export const SECTION_IDS = SECTIONS.map((s) => s.id);
