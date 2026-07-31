/** Category: app-type (single select). Drives `appliesTo` filtering everywhere else. */
export const appTypes = [
  {
    id: '2d-game',
    label: '2D game',
    description: 'A game rendered in two dimensions — sprites, tiles, side or top-down views.',
    promptText: 'a 2D browser game',
  },
  {
    id: '3d-game',
    label: '3D game',
    description: 'A game in a 3D scene with a camera, meshes and lighting.',
    promptText: 'a 3D browser game',
  },
  {
    id: 'physics-sim',
    label: 'Physics simulation',
    description: 'Bodies obeying physical laws — gravity, forces, collisions — that you can poke at.',
    promptText: 'an interactive physics simulation',
  },
  {
    id: 'particle-sim',
    label: 'Agent / particle simulation',
    description: 'Many simple entities following local rules, producing emergent group behavior.',
    promptText: 'an interactive agent-based simulation',
  },
  {
    id: 'generative-art',
    label: 'Generative art',
    description: 'Visuals produced by an algorithm rather than drawn by hand, often with randomness.',
    promptText: 'a generative art piece',
  },
  {
    id: 'data-viz',
    label: 'Interactive data viz',
    description: 'A visualization the user can filter, zoom and explore rather than just look at.',
    promptText: 'an interactive data visualization',
  },
  {
    id: 'creative-tool',
    label: 'Creative tool',
    description: 'An app for making something — drawing, composing, editing, arranging.',
    promptText: 'a browser-based creative tool',
  },
  {
    id: 'demo',
    label: 'Demo / screensaver',
    description: 'A looping ambient visual with little or no interaction. Pure eye candy.',
    promptText: 'an animated visual demo',
  },
];
