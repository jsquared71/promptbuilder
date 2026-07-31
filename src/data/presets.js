/**
 * Starting points. Each preset is a plain list of term ids applied over a
 * cleared selection — the user is expected to tweak from there, not accept it.
 */
export const PRESETS = [
  {
    id: 'arcade-platformer',
    label: 'Arcade platformer',
    blurb: 'A juicy 2D jump-and-run with pixel art and tight controls.',
    terms: [
      '2d-game', 'platformer', 'canvas-2d',
      'pixel-art', 'palette-limited', 'dark-bg',
      'gravity', 'collision', 'coyote-time', 'enemy-ai', 'health', 'checkpoints', 'difficulty-ramp',
      'game-juice', 'tweening', 'parallax', 'screen-shake', 'particles', 'squash-stretch', 'camera-follow',
      'keyboard', 'gamepad',
      'start-menu', 'pause-screen', 'game-over', 'score', 'health-bar',
      'sfx', 'webaudio', 'mute',
      'high-scores',
      'single-file', 'no-libraries', 'fps60', 'fixed-timestep', 'responsive', 'reduced-motion',
    ],
  },
  {
    id: 'emergent-sim',
    label: 'Emergent simulation',
    blurb: 'Many simple agents, live parameter sliders, and something surprising happening.',
    terms: [
      'particle-sim', 'boids', 'canvas-2d',
      'minimalist', 'dark-bg', 'palette-limited',
      'spatial-hash', 'friction',
      'trails', 'idle-anim',
      'mouse', 'click-spawn', 'drag-interact', 'zoom',
      'stats', 'legend', 'fps-counter',
      'sliders', 'play-pause', 'speed-control', 'presets', 'randomize', 'reset',
      'seeded-random', 'share-url', 'export-png',
      'single-file', 'no-libraries', 'fps60', 'responsive', 'tunable-constants',
    ],
  },
  {
    id: 'physics-toy',
    label: 'Physics toy',
    blurb: 'Rigid bodies you can grab, throw and stack, with the constants exposed.',
    terms: [
      'physics-sim', 'cloth', 'canvas-2d',
      'minimalist', 'high-contrast', 'soft-shadows',
      'gravity', 'collision', 'verlet', 'spring', 'friction', 'wind', 'elastic',
      'tweening', 'trails',
      'mouse', 'drag-interact', 'touch',
      'stats', 'tooltips',
      'sliders', 'play-pause', 'step-frame', 'reset', 'presets', 'debug-overlay',
      'single-file', 'no-libraries', 'fixed-timestep', 'separate-update-render', 'responsive', 'tunable-constants',
    ],
  },
  {
    id: 'generative-piece',
    label: 'Generative art piece',
    blurb: 'An algorithmic composition with a visible seed and a save button.',
    terms: [
      'generative-art', 'flow-field', 'canvas-2d',
      'minimalist', 'monochrome',
      'palette-limited', 'gradients', 'dark-bg',
      'trails', 'idle-anim',
      'mouse', 'zoom',
      'sliders', 'randomize', 'presets', 'reset',
      'seeded-random', 'export-png', 'share-url',
      'single-file', 'no-libraries', 'responsive', 'tunable-constants',
    ],
  },
  {
    id: 'three-d-scene',
    label: '3D scene',
    blurb: 'A navigable Three.js world with lighting and smooth camera work.',
    terms: [
      '3d-game', 'fps-explorer', 'three-js',
      'low-poly', 'soft-shadows', 'ambient-occlusion', 'god-rays', 'day-night',
      'gravity', 'collision', 'raycast',
      'tweening', 'camera-follow', 'idle-anim',
      'keyboard', 'mouse', 'pointer-lock',
      'settings-panel', 'tutorial', 'fps-counter',
      'sfx', 'spatial-audio', 'mute',
      'fps60', 'responsive', 'fixed-timestep', 'separate-update-render', 'tunable-constants',
    ],
  },
  {
    id: 'data-explorer',
    label: 'Data explorer',
    blurb: 'An interactive visualization built for poking at, not just looking at.',
    terms: [
      'data-viz', 'force-graph', 'svg',
      'minimalist', 'high-contrast', 'colorblind-safe',
      'tweening', 'ui-transitions',
      'mouse', 'drag-interact', 'zoom', 'touch',
      'tooltips', 'legend', 'filters', 'stats',
      'reset', 'presets',
      'import-export', 'share-url', 'export-png',
      'responsive', 'accessible', 'mobile', 'reduced-motion',
    ],
  },
];

export const PRESETS_BY_ID = new Map(PRESETS.map((p) => [p.id, p]));
