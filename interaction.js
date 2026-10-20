/** Category: controls. Reads after "Controls: ...". */
export const controls = [
  {
    id: 'keyboard',
    label: 'Keyboard',
    description: 'WASD and arrow keys, tracked by key-down state rather than repeat events.',
    promptText: 'keyboard movement with both WASD and the arrow keys',
  },
  {
    id: 'mouse',
    label: 'Mouse',
    description: 'Aiming or interacting at the cursor position.',
    promptText: 'mouse aiming and clicking',
  },
  {
    id: 'touch',
    label: 'Touch',
    description: 'Taps, drags and pinches, so it works on a phone.',
    promptText: 'touch input so it works on phones and tablets',
    suggests: ['mobile'],
  },
  {
    id: 'virtual-joystick',
    label: 'Virtual joystick',
    description: 'An on-screen thumbstick for touch devices.',
    promptText: 'an on-screen virtual joystick for touch devices',
    suggests: ['touch'],
  },
  {
    id: 'gamepad',
    label: 'Gamepad',
    description: 'Controller support through the Gamepad API, including analog sticks.',
    promptText: 'gamepad support via the Gamepad API',
  },
  {
    id: 'pointer-lock',
    label: 'Pointer lock',
    description: 'Capturing the cursor for unlimited mouse-look. Standard for first-person views.',
    promptText: 'pointer lock for free mouse-look',
  },
  {
    id: 'drag-interact',
    label: 'Drag to interact',
    description: 'Grabbing objects in the scene and throwing them around.',
    promptText: 'the ability to grab, drag and fling objects directly',
  },
  {
    id: 'click-place',
    label: 'Click to place',
    description: 'Putting something down where you click, usually snapped to a grid.',
    promptText: 'click-to-place building snapped to the grid',
  },
  {
    id: 'click-spawn',
    label: 'Click to spawn',
    description: 'Adding new entities into a running simulation at the cursor.',
    promptText: 'click-and-drag to spawn new entities into the running scene',
  },
  {
    id: 'zoom',
    label: 'Zoom & pan',
    description: 'Scroll-wheel zoom and drag-to-pan across a larger space.',
    promptText: 'scroll-wheel zoom and drag-to-pan',
  },
  {
    id: 'hotkeys',
    label: 'Hotkeys',
    description: 'Single-key shortcuts for common actions, listed somewhere visible.',
    promptText: 'single-key hotkeys for the common actions',
  },
];

/** Category: hud. Reads after "Include this interface: ...". */
export const hud = [
  {
    id: 'start-menu',
    label: 'Start menu',
    description: 'A title screen before play begins.',
    promptText: 'a title screen',
  },
  {
    id: 'pause-screen',
    label: 'Pause screen',
    description: 'Freezing the action with an overlay and a way back in.',
    promptText: 'a pause overlay',
  },
  {
    id: 'game-over',
    label: 'Game over screen',
    description: 'A results screen with the score and a one-click restart.',
    promptText: 'a game-over screen with the final score and instant restart',
  },
  {
    id: 'score',
    label: 'Score display',
    description: 'The current score, ideally counting up rather than jumping.',
    promptText: 'a score display that counts up smoothly',
  },
  {
    id: 'health-bar',
    label: 'Health bar',
    description: 'A depleting bar, often with a trailing "ghost" showing damage just taken.',
    promptText: 'a health bar with a trailing damage indicator',
  },
  {
    id: 'timer',
    label: 'Timer',
    description: 'Elapsed or remaining time, visible during play.',
    promptText: 'a visible timer',
  },
  {
    id: 'minimap',
    label: 'Minimap',
    description: 'A small overview of the wider world and where you are in it.',
    promptText: 'a minimap of the wider world',
  },
  {
    id: 'level-select',
    label: 'Level select',
    description: 'Choosing which level or scenario to load.',
    promptText: 'a level select screen',
  },
  {
    id: 'inventory-ui',
    label: 'Inventory UI',
    description: 'A visible set of slots for held items.',
    promptText: 'an inventory panel',
    suggests: ['inventory'],
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    description: 'Ranked best scores, local or shared.',
    promptText: 'a leaderboard of best runs',
    suggests: ['high-scores'],
  },
  {
    id: 'settings-panel',
    label: 'Settings panel',
    description: 'Volume, difficulty, quality and accessibility options in one place.',
    promptText: 'a settings panel for volume, difficulty and quality',
  },
  {
    id: 'tutorial',
    label: 'Onboarding hints',
    description: 'Teaching controls in context on first play instead of with a wall of text.',
    promptText: 'contextual onboarding hints that teach the controls during the first play',
  },
  {
    id: 'tooltips',
    label: 'Tooltips',
    description: 'Details on hover, so the main view stays uncluttered.',
    promptText: 'hover tooltips with details',
  },
  {
    id: 'toasts',
    label: 'Toast notifications',
    description: 'Small messages that appear and fade for events worth noticing.',
    promptText: 'brief toast notifications for notable events',
  },
  {
    id: 'stats',
    label: 'Live stats readout',
    description: 'Numbers from the running simulation, updating in place.',
    promptText: 'a live readout of the key simulation statistics',
  },
  {
    id: 'filters',
    label: 'Filters',
    description: 'Narrowing what is shown by category, range or search.',
    promptText: 'filter controls for narrowing what is shown',
  },
  {
    id: 'legend',
    label: 'Legend',
    description: 'What each color and shape means.',
    promptText: 'a legend explaining the colors and shapes',
  },
  {
    id: 'timeline-scrub',
    label: 'Timeline scrubber',
    description: 'Dragging through time to replay or inspect any moment.',
    promptText: 'a timeline scrubber for moving through time',
  },
  {
    id: 'hud-instruments',
    label: 'Instrument HUD',
    description: 'Cockpit-style gauges: speed, altitude, heading.',
    promptText: 'cockpit-style instruments for speed, altitude and heading',
  },
  {
    id: 'fps-counter',
    label: 'FPS counter',
    description: 'A frame-rate readout, useful while tuning performance.',
    promptText: 'a toggleable FPS counter',
  },
];

/** Category: params. Reads after "Give the user live control over the running scene: ...". */
export const params = [
  {
    id: 'sliders',
    label: 'Parameter sliders',
    description: 'Live controls for the constants that matter, so the user can experiment.',
    promptText: 'sliders for every meaningful parameter, applied live without restarting',
  },
  {
    id: 'play-pause',
    label: 'Play / pause / reset',
    description: 'The basic transport controls for anything that runs on its own.',
    promptText: 'play, pause and reset controls',
  },
  {
    id: 'speed-control',
    label: 'Speed control',
    description: 'Running the simulation faster or in slow motion.',
    promptText: 'a simulation speed control including slow motion',
  },
  {
    id: 'step-frame',
    label: 'Step one frame',
    description: 'Advancing a single tick while paused, for inspecting behavior closely.',
    promptText: 'a single-step button to advance one frame while paused',
    suggests: ['play-pause'],
  },
  {
    id: 'presets',
    label: 'Preset scenarios',
    description: 'Interesting starting configurations, one click away.',
    promptText: 'a set of preset starting scenarios worth looking at',
  },
  {
    id: 'randomize',
    label: 'Randomize',
    description: 'A button that rerolls the parameters for happy accidents.',
    promptText: 'a randomize button that rerolls the parameters',
  },
  {
    id: 'reset',
    label: 'Reset',
    description: 'Back to the initial state without reloading the page.',
    promptText: 'a reset that restores the initial state without a page reload',
  },
  {
    id: 'undo',
    label: 'Undo / redo',
    description: 'A history stack so mistakes are cheap.',
    promptText: 'undo and redo backed by a history stack',
  },
  {
    id: 'debug-overlay',
    label: 'Debug overlay',
    description: 'A toggle exposing hitboxes, vectors and internal state.',
    promptText: 'a toggleable debug overlay showing hitboxes and vectors',
  },
];
