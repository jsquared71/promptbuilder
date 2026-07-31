# Prompt Builder — Plan

A web app that helps users build high-quality prompts for AI coding assistants by clicking
predefined terms. The focus is prompts for building **graphical apps, graphical simulations,
and games** — domains where the difference between a vague prompt ("make a game") and a
specific one ("make a browser platformer with pixel-art style, Canvas 2D rendering, keyboard
controls, coyote-time jumping, and a particle system for dust effects") is enormous.

## 1. Goals

- Let a user assemble a complete, well-structured prompt in under a minute by clicking terms
  instead of typing.
- Teach vocabulary as a side effect: each term has a short description, so users learn *what
  to ask for* (e.g. "juice", "boids", "orthographic camera").
- Produce readable natural-language prompts, not keyword soup — the output should be
  something the user is proud to paste into Claude.
- Zero-friction deployment: a static site with no backend, hostable on GitHub Pages.

## 2. Core user flow

1. **Pick a starting point** — either a blank slate or a preset template
   ("2D Game", "Physics Simulation", "Generative Art", "Data Visualization", "3D Scene").
   Presets pre-select a sensible set of terms the user then tweaks.
2. **Click terms** — the left/main pane shows collapsible category sections full of clickable
   chips. Clicking toggles a term on/off. Single-choice categories (e.g. rendering tech)
   behave like radio buttons; multi-choice categories (e.g. mechanics) allow many.
3. **Watch the prompt build live** — a preview pane assembles the selections into flowing
   prose, updating on every click. Selected chips are highlighted and also listed as
   removable tags above the preview.
4. **Refine** — a free-text field per section ("anything else about the visuals?") lets users
   add specifics the chips don't cover; the preview is also directly editable as a final step.
5. **Copy / share** — one-click copy to clipboard; the full selection state is encoded in the
   URL hash so a prompt-in-progress can be bookmarked or shared.

## 3. Term taxonomy (the heart of the app)

Categories, each with 8–20 terms. Every term carries a chip label, a one-line tooltip
description, and the prose fragment used in prompt assembly. Initial category set:

| Category | Select mode | Example terms |
|---|---|---|
| **App type** | single | 2D game, 3D game, physics simulation, particle simulation, generative art, interactive data viz, creative tool, screensaver/demo |
| **Genre / subject** | single | platformer, top-down shooter, puzzle, tower defense, racing, roguelike, idle/clicker; or for sims: boids/flocking, cellular automata, fluid, sand (falling-sand), orbital/n-body, double pendulum, wave interference, L-systems, slime mold |
| **Rendering tech** | single | HTML5 Canvas 2D, WebGL, Three.js, p5.js, SVG, DOM/CSS, Pixi.js, shader-based (GLSL) |
| **Visual style** | multi | pixel art, minimalist/flat, neon/synthwave, hand-drawn, low-poly, glassmorphism, retro CRT, watercolor, monochrome, vaporwave |
| **Color & light** | multi | dark mode, pastel palette, high contrast, dynamic day/night, bloom/glow, gradients, dithering |
| **Mechanics & physics** | multi | gravity, collision detection, jumping with coyote time, double jump, projectiles, health/damage, inventory, procedural generation, pathfinding (A*), spring physics, verlet integration, wind, buoyancy |
| **Motion & animation** | multi | easing/tweening, sprite animation, parallax scrolling, screen shake, particle effects, trails, squash & stretch, smooth camera follow |
| **Controls & input** | multi | keyboard (WASD/arrows), mouse, touch/mobile, gamepad, drag-and-drop, click-to-place |
| **Interface & HUD** | multi | score display, health bar, minimap, start menu, pause screen, game-over screen, settings panel, onboarding hints, FPS counter |
| **Interactivity & parameters** | multi | live parameter sliders, play/pause/reset, speed control, preset scenarios, randomize button, click-to-spawn |
| **Audio** | multi | sound effects, background music, mute toggle, Web Audio synthesized sounds |
| **Data & persistence** | multi | high scores in localStorage, save/load state, seeded randomness, export as image/GIF |
| **Quality & constraints** | multi | single HTML file, no external libraries, 60fps target, responsive/resizable, mobile-friendly, accessible (keyboard + reduced motion), commented code |

Cross-cutting data features:
- `conflictsWith`: selecting "Three.js" deselects "p5.js"; "single HTML file" warns when a
  library needing a bundler is selected.
- `implies` (soft): selecting "platformer" auto-suggests (highlights, doesn't force) gravity,
  collision, keyboard controls.
- `appliesTo`: genre terms shown depend on the chosen app type — picking "physics simulation"
  swaps the genre section to simulation subjects.

## 4. Prompt assembly

Not keyword concatenation — each category owns a sentence template and an ordering slot:

```
Build [a/an] {app type} — [a] {genre} — using {rendering tech}.
Visual style: {visual terms as prose list}, with {color & light terms}.
Gameplay/behavior: it should include {mechanics list}.
Animation & feel: {motion terms}.
Controls: {input terms}. Interface: {HUD terms}.
{Audio sentence, if any.} {Data sentence, if any.}
Requirements: {constraints list}.
{User's free-text additions, verbatim, at the end of their section.}
```

Rules:
- Empty categories emit nothing (no "Visual style: none").
- Lists are joined as natural prose ("gravity, collision detection, and a particle system"),
  with per-term prose fragments (`promptText`) that read well in a sentence — e.g. the chip
  "coyote time" becomes "forgiving jump timing with coyote time".
- Assembly is a pure function `buildPrompt(selections, freeText) → string`, unit-testable in
  isolation.

## 5. Architecture & stack

**Stack: no-build vanilla HTML/CSS/JS (ES modules), terms defined in JS data modules.**
Rationale: the app is a single screen with simple state; skipping a framework and bundler
means the repo stays clonable-and-openable, trivially deployable to GitHub Pages, and easy
for contributors to edit the term data. If the app later grows (accounts, AI suggestions),
migrating to Vite + React is straightforward because the term data and `buildPrompt` are
framework-independent.

```
promptbuilder/
├── index.html            # layout shell: category pane + preview pane
├── styles.css            # responsive two-column layout, chip styles, dark/light theme
├── src/
│   ├── main.js           # bootstrapping, event wiring
│   ├── state.js          # selection state, URL-hash encode/decode, localStorage autosave
│   ├── render.js         # renders categories/chips from data, preview pane updates
│   ├── promptBuilder.js  # buildPrompt() — pure assembly logic
│   └── data/
│       ├── categories.js # category definitions: id, title, selectMode, order, template
│       ├── terms/        # one file per category: appTypes.js, genres.js, styles.js, ...
│       └── presets.js    # named preset selections
├── tests/
│   └── promptBuilder.test.js  # node --test, no test framework dependency
├── PLAN.md
└── README.md
```

Term schema:

```js
{
  id: "coyote-time",
  label: "Coyote time",
  description: "A short grace period to jump after walking off a ledge — makes platformers feel fair.",
  promptText: "forgiving jump timing with coyote time",
  category: "mechanics",
  conflictsWith: [],       // term ids
  suggests: ["gravity"],   // soft implies
  appliesTo: ["2d-game"],  // optional filter by app type
}
```

State: a `Set` of selected term ids plus a map of free-text fields; serialized to the URL
hash (compact, comma-separated ids) and mirrored to localStorage for crash recovery.

## 6. Milestones

**M1 — MVP (core loop works end to end)**
- Layout with category sections, clickable chips, live preview, copy button.
- Term data for the 5 highest-value categories: app type, genre/subject, rendering tech,
  visual style, mechanics (~60 terms).
- `buildPrompt()` with tests; single/multi select behavior.

**M2 — Full taxonomy & guidance**
- Remaining categories (~150 terms total), tooltips, `appliesTo` filtering,
  conflict handling, soft suggestions.
- Presets (5 templates), free-text fields per section, editable preview.

**M3 — Persistence & sharing**
- URL-hash sharing, localStorage autosave, "reset" and "randomize" actions.
- Term search box that filters chips across all categories.

**M4 — Polish & deploy**
- Responsive/mobile layout, dark/light theme, keyboard navigation and ARIA on chips.
- GitHub Pages deployment via Actions; README with screenshots.

**Later / ideas**
- "Open in Claude" deep link with the prompt prefilled.
- AI-assisted mode: paste a rough idea, get suggested term selections.
- User-defined custom terms saved locally; import/export of term packs.
- Prompt history with diffing between iterations.

## 7. Testing & deployment

- `node --test tests/` covers `buildPrompt()` (empty state, single category, conflicts,
  prose joining, free text placement) and hash encode/decode round-trips — no dependencies.
- Manual checklist for UI behaviors per milestone.
- Deployment: GitHub Pages from the default branch via a minimal Actions workflow
  (upload-pages-artifact of the repo root — no build step needed).
