/** Category: visual-style. Reads after "The visual style should be ...". */
export const visualStyle = [
  {
    id: 'pixel-art',
    label: 'Pixel art',
    description: 'Low-resolution sprites with crisp, un-smoothed pixels.',
    promptText: 'pixel art with nearest-neighbour scaling and no blurring',
  },
  {
    id: 'minimalist',
    label: 'Minimalist / flat',
    description: 'Simple shapes, flat fills, no ornament. Everything reads instantly.',
    promptText: 'minimalist and flat, built from simple geometric shapes',
  },
  {
    id: 'neon',
    label: 'Neon / synthwave',
    description: 'Glowing lines on dark backgrounds, grids and sunsets. 80s sci-fi.',
    promptText: 'neon synthwave, with glowing lines over a dark backdrop',
  },
  {
    id: 'hand-drawn',
    label: 'Hand-drawn / sketchy',
    description: 'Wobbly lines and imperfect strokes, as if sketched in a notebook.',
    promptText: 'hand-drawn and sketchy, with slightly wobbly imperfect lines',
  },
  {
    id: 'low-poly',
    label: 'Low-poly',
    description: 'Faceted geometry with visible flat triangles and no smoothing.',
    promptText: 'low-poly, with visible flat-shaded facets',
  },
  {
    id: 'isometric',
    label: 'Isometric',
    description: 'A fixed 3/4 angle where depth is faked without perspective distortion.',
    promptText: 'isometric, drawn at a fixed three-quarter angle',
  },
  {
    id: 'glassmorphism',
    label: 'Glassmorphism',
    description: 'Frosted translucent panels blurring whatever is behind them.',
    promptText: 'glassmorphic, using frosted translucent panels',
  },
  {
    id: 'crt',
    label: 'Retro CRT',
    description: 'Scanlines, slight curvature and phosphor bleed, like an old monitor.',
    promptText: 'retro CRT, with scanlines and a subtle screen curvature',
  },
  {
    id: 'watercolor',
    label: 'Watercolor',
    description: 'Soft bleeding edges and translucent washes of color.',
    promptText: 'watercolor, with soft bleeding edges and translucent washes',
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    description: 'One hue at varying brightness — or pure black and white.',
    promptText: 'monochrome, using a single hue at varying brightness',
  },
  {
    id: 'vaporwave',
    label: 'Vaporwave',
    description: 'Pink and cyan, marble busts, wireframe grids, deliberate nostalgia.',
    promptText: 'vaporwave, heavy on pink and cyan',
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    description: 'Raw structure on show: heavy borders, system fonts, no polish.',
    promptText: 'brutalist, with heavy borders and unstyled system type',
  },
  {
    id: 'blueprint',
    label: 'Blueprint / wireframe',
    description: 'Technical drawing look: thin lines, grids, annotations, no fills.',
    promptText: 'blueprint-style, drawn as thin annotated wireframes on a grid',
  },
  {
    id: 'papercraft',
    label: 'Papercraft',
    description: 'Layered cut paper with drop shadows between the layers.',
    promptText: 'papercraft, built from layered cut-paper shapes with soft shadows',
  },
  {
    id: 'claymation',
    label: 'Claymation',
    description: 'Rounded, thumbprinted forms with a soft matte surface.',
    promptText: 'claymation-like, with rounded matte forms',
  },
  {
    id: 'ascii',
    label: 'ASCII / terminal',
    description: 'The entire scene rendered as text characters in a grid.',
    promptText: 'ASCII art rendered as a grid of monospace characters',
  },
];

/** Category: color-light. Reads after "For color and lighting, use ...". */
export const colorLight = [
  {
    id: 'dark-bg',
    label: 'Dark background',
    description: 'A near-black canvas so bright elements pop.',
    promptText: 'a near-black background so bright elements pop',
  },
  {
    id: 'pastel',
    label: 'Pastel palette',
    description: 'Desaturated, light colors — soft and low-tension.',
    promptText: 'a soft pastel palette',
  },
  {
    id: 'high-contrast',
    label: 'High contrast',
    description: 'Strong light/dark separation so everything stays legible.',
    promptText: 'strong contrast so every element stays legible',
  },
  {
    id: 'palette-limited',
    label: 'Limited palette',
    description: 'A strict handful of colors. Constraint that makes things look designed.',
    promptText: 'a strictly limited palette of four or five colors',
  },
  {
    id: 'gradients',
    label: 'Gradients',
    description: 'Smooth blends between colors rather than flat fills.',
    promptText: 'smooth color gradients',
  },
  {
    id: 'bloom',
    label: 'Bloom / glow',
    description: 'Bright areas bleeding light into their surroundings.',
    promptText: 'a bloom glow around bright elements',
  },
  {
    id: 'dithering',
    label: 'Dithering',
    description: 'Patterned pixels faking extra shades from a small palette.',
    promptText: 'ordered dithering for shading',
  },
  {
    id: 'day-night',
    label: 'Day / night cycle',
    description: 'Lighting and palette shifting over time as the scene runs.',
    promptText: 'a day/night cycle that shifts the palette over time',
  },
  {
    id: 'soft-shadows',
    label: 'Soft shadows',
    description: 'Blurred shadows that ground objects in the scene.',
    promptText: 'soft shadows that ground objects in the scene',
  },
  {
    id: 'ambient-occlusion',
    label: 'Ambient occlusion',
    description: 'Darkening in creases and contact points — cheap realism.',
    promptText: 'ambient occlusion darkening creases and contact points',
  },
  {
    id: 'god-rays',
    label: 'Volumetric light',
    description: 'Visible shafts of light through the air. God rays.',
    promptText: 'volumetric light shafts',
  },
  {
    id: 'color-grading',
    label: 'Color grading',
    description: 'A final pass pushing everything toward one coherent mood.',
    promptText: 'a final color grade for a coherent mood',
  },
  {
    id: 'colorblind-safe',
    label: 'Colorblind-safe',
    description: 'Hues distinguishable without relying on red-vs-green.',
    promptText: 'colorblind-safe hues that never rely on red-versus-green alone',
  },
];
