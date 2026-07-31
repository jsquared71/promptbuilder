# Prompt Builder

Click predefined terms to build a precise prompt for an AI coding assistant — aimed at
**graphical apps, simulations and games**, where "make me a game" and a prompt that actually
names coyote time, parallax layers and a fixed timestep produce very different results.

Around 200 terms across 13 categories. Every chip carries a one-line explanation, so the app
doubles as a vocabulary reference: you can learn what *boids*, *juice*, *Verlet integration*
or *wave function collapse* mean while you assemble the prompt that asks for them.

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

Click chips; the prompt on the right rewrites itself on every click. Three rules keep the
selections sensible:

- **Single-select categories replace.** Picking Three.js drops Canvas 2D.
- **Conflicts cancel out.** "No external libraries" and "Three.js" remove each other,
  whichever you click second.
- **The app type filters everything.** Choosing *physics simulation* swaps the genre list from
  platformers and shooters to cloth, n-body and fluid. Switching app type drops selections
  that no longer apply.

Terms also *suggest* related terms — picking "coyote time" outlines gravity and collision
detection with a dashed border. Suggestions are never auto-selected; they point, they don't
decide.

Each section has a free-text field for the specifics chips can't cover, and the finished
prompt is editable before you copy it. Your selection is mirrored into the URL hash, so a
prompt-in-progress can be bookmarked or shared, and into `localStorage` so a reload doesn't
lose it.

## Layout

```
index.html              layout shell
styles.css              two-column responsive layout, chips, light/dark themes
src/
  main.js               wiring: events, persistence, clipboard, theme
  state.js              selection rules, suggestions, URL/storage serialization
  render.js             builds the chip DOM once, then syncs it in place
  promptBuilder.js      buildPrompt() — pure selection-to-prose assembly
  data/
    categories.js       categories and the sections that group them
    presets.js          six starting templates
    terms/              the term data, one file per group
tests/                  node --test coverage of the two pure modules
```

`promptBuilder.js` and `state.js` hold all the logic worth testing and touch no DOM, which is
why the test suite needs no browser and no framework. `render.js` builds the chip DOM once at
startup and afterwards only updates classes and attributes, so free-text fields never lose
focus mid-typing.

## Adding terms

Add an entry to the right file in `src/data/terms/` — the category id is stamped on
automatically by `terms/index.js`:

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
category's lead — "Implement these behaviors: …". Duplicate ids and references to terms that
don't exist throw at import rather than failing quietly.

## Deployment

Pushing to the default branch publishes the repo root to GitHub Pages via
`.github/workflows/pages.yml`. No build step runs; the files are served as they are.
