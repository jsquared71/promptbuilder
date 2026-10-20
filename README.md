# Prompt Builder

Click predefined terms to build a precise AI prompt. A vague request and a prompt that names
exactly what you want produce very different results, and most people don't know the words
that make the difference — so every chip carries a one-line explanation, and the app doubles
as a vocabulary reference.

Pick what the prompt is for first. Each prompt type has its own categories, chips, templates
and sentence structure:

| Prompt type | For | Examples of what it asks for |
|---|---|---|
| **Graphics & games** | AI coding assistants building games, simulations, generative art, data viz | coyote time, boids, parallax, fixed timestep |
| **Apps & code** | AI coding assistants building business apps, scripts, APIs, automations | Power Apps delegation, dry-run mode, audit trail, least privilege |
| **Writing** | Drafting, rewriting, summarizing, proofreading | main point first, plain language, keep facts exact |
| **Data & analysis** | Exploring, explaining and cleaning data | data-quality checks, theme coding, no invented numbers |
| **AI assistant** | System prompts for Copilot Studio agents, Custom GPTs, Claude Projects | answer only from sources, hand off to a person, ignore embedded instructions |
| **Image** | Image generators | composition, lighting, aspect ratio, what to keep out |

About 530 terms in all, and 30 starting templates.

## Running it

There is no build step and no dependencies. Open `index.html` through any static server:

```sh
npm run serve      # python3 -m http.server 8000
```

Then visit <http://localhost:8000>. (Opening the file directly with `file://` will not work —
the app uses ES modules, which browsers only load over HTTP.)

```sh
npm test           # node --test — no test framework needed
```

## How it works

Choose a prompt type, then click chips; the prompt on the right rewrites itself on every
click. Each prompt type keeps its own selection, so you can switch from Writing to Image and
back without losing either. Three rules keep the selections sensible:

- **Single-select categories replace.** Picking Three.js drops Canvas 2D.
- **Conflicts cancel out.** "No external libraries" and "Three.js" remove each other,
  whichever you click second.
- **The first pick filters the rest.** In Graphics & games, choosing *physics simulation* swaps
  the genre list from platformers and shooters to cloth, n-body and fluid; in Apps & code,
  choosing *script* hides Power Apps and React. Switching drops selections that no longer apply.

Terms also *suggest* related terms — picking "coyote time" outlines gravity and collision
detection with a dashed border. Suggestions are never auto-selected; they point, they don't
decide.

Each section has a free-text field for the specifics chips can't cover, and the finished
prompt is editable before you copy it. Prompts that work on existing text (rewrite, summarize,
analyze pasted data) end with a labeled slot to paste it into. Your selection is mirrored into
the URL hash (`#m=writing&t=…`), so a prompt-in-progress can be bookmarked or shared, and every
prompt type's work is saved to `localStorage` so a reload doesn't lose it. Links shared before
prompt types existed have no `m=` and still open in Graphics & games.

## Layout

```
index.html              layout shell
styles.css              two-column responsive layout, chips, light/dark themes
src/
  main.js               wiring: events, persistence, clipboard, theme
  modes.js              the prompt-type registry: compiles and validates mode data
  state.js              selection rules, suggestions, per-mode workspaces, URL/storage
  render.js             builds the chip DOM per mode, then syncs it in place
  promptBuilder.js      buildPrompt() — pure selection-to-prose assembly
  data/
    modes/              one file per prompt type (graphical.js wraps the files below)
    categories.js       Graphics & games: categories and sections
    presets.js          Graphics & games: starting templates
    terms/              Graphics & games: term data, one file per group
tests/                  node --test coverage of the pure modules and every mode's data
```

`promptBuilder.js`, `state.js` and `modes.js` hold all the logic worth testing and touch no
DOM, which is why the test suite needs no browser and no framework. `render.js` builds the chip
DOM when a prompt type is chosen and afterwards only updates classes and attributes, so
free-text fields never lose focus mid-typing.

## Adding terms

Add an entry to the term list for the right category — in `src/data/terms/` for Graphics &
games, or in the prompt type's file in `src/data/modes/`. The category id is stamped on
automatically by `src/modes.js`:

```js
{
  id: 'coyote-time',
  label: 'Coyote time',
  description: 'A short grace period to jump after walking off a ledge — makes platformers feel fair.',
  promptText: 'forgiving jump timing with coyote time and jump buffering',
  suggests: ['gravity', 'collision'],   // optional soft hints
  conflictsWith: [],                    // optional, applied in both directions
  appliesTo: ['2d-game'],               // optional; omit to show for every app type
}
```

`promptText` is a fragment dropped into a sentence, so write it to read well after the
category's lead — "Implement these behaviors: …". Fragments are joined into lists, so avoid
commas and "and" inside one where you can; parentheses keep a detail from blurring into its
neighbours. Duplicate ids, references to terms that don't exist and presets that name unknown
terms all throw at import rather than failing quietly. `appliesTo` lists ids from the prompt
type's filter category (its `filterCategory`), such as app type or kind of writing.

## Adding a prompt type

Create `src/data/modes/<name>.js` exporting an object and add it to the list in
`src/modes.js`:

```js
export const recipes = {
  id: 'recipes',                 // goes in the URL as m=recipes
  label: 'Recipes',
  blurb: 'Meal plans and recipes',
  searchHint: 'try “vegetarian”',
  filterCategory: 'r-meal',      // optional: the single-select category that drives appliesTo
  categories: [
    { id: 'r-meal', title: 'Meal', selectMode: 'single' },
    { id: 'r-diet', title: 'Diet', selectMode: 'multi', lead: 'It must be {list}.' },
  ],
  sections: [
    // A section with id 'core' is required; its categories are written by opening().
    { id: 'core', title: 'What to make', defaultOpen: true, categories: ['r-meal'], noteLabel: '…' },
    { id: 'diet', title: 'Diet', categories: ['r-diet'], noteLabel: '…' },
  ],
  terms: [['r-meal', [/* terms */]], ['r-diet', [/* terms */]]],
  presets: [{ id: 'weeknight', label: 'Weeknight dinner', blurb: '…', terms: ['…'] }],
  opening(pick, coreNote) {      // pick(categoryId) -> selected terms, in data order
    const [meal] = pick('r-meal');
    return meal ? [`Write a recipe for ${meal.promptText}.`] : [];
  },
  // Optional: openingUsesNote: true folds the core note into the opening instead of appending it.
  // Optional: closing(pick) returns a final paragraph, such as a slot to paste source text.
};
```

Every category outside `core` needs a `lead` containing `{list}`. The tests in
`tests/modes.test.js` check this, and that every preset applies in full, for every prompt type.

## Deployment

Pushing to the default branch publishes the repo root to GitHub Pages via
`.github/workflows/pages.yml`. No build step runs; the files are served as they are.
