/** Category: audio. Reads after "Audio: ...". */
export const audio = [
  {
    id: 'sfx',
    label: 'Sound effects',
    description: 'Short sounds on key events. The cheapest way to make actions feel real.',
    promptText: 'sound effects on the key events',
  },
  {
    id: 'music',
    label: 'Background music',
    description: 'A looping track underneath everything.',
    promptText: 'a looping background track',
  },
  {
    id: 'webaudio',
    label: 'Synthesized audio',
    description: 'Sounds generated with the Web Audio API — no audio files to ship.',
    promptText: 'all sound synthesized with the Web Audio API rather than loaded from files',
  },
  {
    id: 'spatial-audio',
    label: 'Spatial audio',
    description: 'Sound panned and attenuated by position in the scene.',
    promptText: 'spatial audio panned by position',
  },
  {
    id: 'audio-reactive',
    label: 'Audio-reactive visuals',
    description: 'Graphics driven by frequency and amplitude analysis of the sound.',
    promptText: 'visuals that react to audio frequency and amplitude',
  },
  {
    id: 'mute',
    label: 'Mute toggle',
    description: 'An obvious way to silence everything. Never autoplay without one.',
    promptText: 'a clearly visible mute toggle, with audio starting only after a user gesture',
  },
  {
    id: 'volume',
    label: 'Volume slider',
    description: 'Separate levels for music and effects.',
    promptText: 'separate volume sliders for music and effects',
  },
];

/** Category: data. Reads after "Persistence and export: ...". */
export const data = [
  {
    id: 'high-scores',
    label: 'High scores',
    description: 'Best results kept in localStorage across sessions.',
    promptText: 'high scores persisted in localStorage',
  },
  {
    id: 'save-load',
    label: 'Save / load state',
    description: 'Resuming exactly where you left off after a reload.',
    promptText: 'saving and restoring the full state across reloads',
  },
  {
    id: 'seeded-random',
    label: 'Seeded randomness',
    description: 'A visible seed so the same input reproduces the same result exactly.',
    promptText: 'seeded randomness with the seed shown and editable, so results are reproducible',
  },
  {
    id: 'share-url',
    label: 'Shareable URL',
    description: 'The current configuration encoded into the address bar.',
    promptText: 'the current configuration encoded in the URL so it can be shared',
  },
  {
    id: 'export-png',
    label: 'Export PNG',
    description: 'Saving the current frame as an image.',
    promptText: 'exporting the current frame as a PNG',
  },
  {
    id: 'export-svg',
    label: 'Export SVG',
    description: 'Vector output suitable for printing or plotting.',
    promptText: 'exporting vector SVG output',
  },
  {
    id: 'export-gif',
    label: 'Export GIF / video',
    description: 'Recording a loop of the animation to share.',
    promptText: 'recording a short animated GIF or video clip',
  },
  {
    id: 'import-export',
    label: 'Import / export JSON',
    description: 'Round-tripping the scene as a file.',
    promptText: 'importing and exporting the scene as JSON',
  },
  {
    id: 'session-stats',
    label: 'Session stats',
    description: 'Totals accumulated across a play session, shown at the end.',
    promptText: 'session statistics summarised at the end of a run',
  },
];
