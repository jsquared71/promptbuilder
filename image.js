/**
 * Mode: prompts for image generators. The subject is free text, so the
 * opening sentence folds the core note in — "Create a photograph of …" —
 * instead of appending it as a separate sentence.
 */

const types = [
  { id: 'photo', label: 'Photograph', description: 'Realistic, as if taken with a camera.', promptText: 'a photograph' },
  { id: 'illustration', label: 'Illustration', description: 'Drawn or painted rather than photographed.', promptText: 'an illustration' },
  { id: 'icon', label: 'Icon', description: 'A simple symbol that reads at small sizes.', promptText: 'a simple icon', suggests: ['flat', 'centered', 'no-text'] },
  { id: 'poster', label: 'Poster / flyer art', description: 'Bold artwork with room for a headline.', promptText: 'poster artwork', suggests: ['negative-space'] },
  { id: 'render-3d', label: '3D render', description: 'Clean computer-generated objects and scenes.', promptText: 'a 3D render' },
  { id: 'painting', label: 'Painting', description: 'Oil, acrylic or gouache look.', promptText: 'a painting' },
  { id: 'pattern', label: 'Seamless pattern', description: 'Tiles without visible edges — backgrounds, textiles.', promptText: 'a seamless repeating pattern' },
  { id: 'background', label: 'Background', description: 'Abstract or soft imagery for behind text.', promptText: 'a background image', suggests: ['negative-space', 'muted'] },
];

const styles = [
  { id: 'photoreal', label: 'Photorealistic', description: 'Indistinguishable from a real photo.', promptText: 'photorealistic' },
  { id: 'editorial', label: 'Editorial', description: 'Magazine-style, natural and candid.', promptText: 'editorial and candid' },
  { id: 'cinematic', label: 'Cinematic', description: 'Like a film still: depth, drama, color grading.', promptText: 'cinematic' },
  { id: 'flat', label: 'Flat vector', description: 'Clean shapes, no texture or shading.', promptText: 'flat vector' },
  { id: 'line-art', label: 'Line art', description: 'Outlines only.', promptText: 'minimal line art' },
  { id: 'watercolor', label: 'Watercolor', description: 'Soft edges and visible paper.', promptText: 'watercolor' },
  { id: 'isometric', label: 'Isometric', description: '3D-looking view with no perspective. Good for tech scenes.', promptText: 'isometric' },
  { id: 'hand-drawn', label: 'Hand-drawn', description: 'Sketchy, human, imperfect.', promptText: 'hand-drawn' },
  { id: 'paper-cut', label: 'Paper cut', description: 'Layered paper with soft shadows.', promptText: 'layered paper cut-out' },
  { id: 'retro', label: 'Retro', description: 'Vintage print or film look.', promptText: 'retro, like a vintage print' },
  { id: 'minimal', label: 'Minimal', description: 'Few elements, lots of space.', promptText: 'minimal' },
];

const moods = [
  { id: 'calm', label: 'Calm', description: '', promptText: 'calm' },
  { id: 'energetic', label: 'Energetic', description: '', promptText: 'energetic' },
  { id: 'professional', label: 'Professional', description: '', promptText: 'professional' },
  { id: 'playful', label: 'Playful', description: '', promptText: 'playful' },
  { id: 'hopeful', label: 'Hopeful', description: '', promptText: 'hopeful' },
  { id: 'cozy', label: 'Cozy', description: '', promptText: 'cozy' },
  { id: 'mysterious', label: 'Mysterious', description: '', promptText: 'mysterious' },
  { id: 'focused', label: 'Focused', description: '', promptText: 'focused and studious' },
].map((t) => ({ ...t, description: `A ${t.promptText} feel.` }));

const composition = [
  { id: 'close-up', label: 'Close-up', description: 'Fills the frame with the subject.', promptText: 'a close-up' },
  { id: 'wide', label: 'Wide shot', description: 'Subject in its surroundings.', promptText: 'a wide shot' },
  { id: 'overhead', label: 'Overhead', description: 'Looking straight down — flat lays, desks.', promptText: 'an overhead view' },
  { id: 'eye-level', label: 'Eye level', description: 'Natural, relatable viewpoint.', promptText: 'an eye-level viewpoint' },
  { id: 'low-angle', label: 'Low angle', description: 'Looking up — makes subjects feel bigger.', promptText: 'a low camera angle' },
  { id: 'thirds', label: 'Rule of thirds', description: 'Subject off-center for balance.', promptText: 'the subject placed on the rule of thirds' },
  { id: 'centered', label: 'Centered', description: 'Subject in the middle. Good for icons.', promptText: 'the subject centered' },
  { id: 'negative-space', label: 'Space for text', description: 'Empty area to put a headline over.', promptText: 'plenty of empty space on one side for text' },
  { id: 'shallow-dof', label: 'Blurred background', description: 'Shallow depth of field.', promptText: 'a shallow depth of field with a softly blurred background' },
];

const lighting = [
  { id: 'natural', label: 'Natural light', description: 'Daylight from windows or outdoors.', promptText: 'natural daylight' },
  { id: 'golden-hour', label: 'Golden hour', description: 'Warm, low sun.', promptText: 'warm golden-hour light' },
  { id: 'soft', label: 'Soft & even', description: 'Diffuse, flattering, few shadows.', promptText: 'soft, even light' },
  { id: 'studio', label: 'Studio', description: 'Clean controlled lighting, plain backdrop.', promptText: 'clean studio lighting' },
  { id: 'dramatic', label: 'Dramatic', description: 'Strong contrast and deep shadows.', promptText: 'dramatic lighting with strong shadows' },
  { id: 'backlit', label: 'Backlit', description: 'Light behind the subject, glowing edges.', promptText: 'backlighting' },
];

const colors = [
  { id: 'brand', label: 'Brand colors', description: 'Name the colors in the note below.', promptText: 'our brand colors' },
  { id: 'warm', label: 'Warm', description: 'Reds, oranges, golds.', promptText: 'a warm palette' },
  { id: 'cool', label: 'Cool', description: 'Blues, greens, purples.', promptText: 'a cool palette' },
  { id: 'muted', label: 'Muted', description: 'Soft, desaturated tones.', promptText: 'muted, desaturated tones' },
  { id: 'vibrant', label: 'Vibrant', description: 'Saturated and bright.', promptText: 'vibrant, saturated color' },
  { id: 'pastel', label: 'Pastel', description: 'Light and soft.', promptText: 'pastels' },
  { id: 'mono', label: 'Black & white', description: 'No color at all.', promptText: 'black and white only' },
];

const ratios = [
  { id: 'square', label: 'Square 1:1', description: 'Social posts, icons, avatars.', promptText: '1:1 (square)' },
  { id: 'wide-16-9', label: 'Wide 16:9', description: 'Slides, banners, video thumbnails.', promptText: '16:9 (wide)' },
  { id: 'tall-9-16', label: 'Tall 9:16', description: 'Phone screens, stories.', promptText: '9:16 (tall)' },
  { id: 'r-4-3', label: '4:3', description: 'Classic photo and older slides.', promptText: '4:3' },
  { id: 'r-3-2', label: '3:2', description: 'Standard camera photo.', promptText: '3:2' },
];

const avoid = [
  { id: 'no-text', label: 'No text', description: 'Image generators often garble lettering.', promptText: 'text or lettering' },
  { id: 'no-logos', label: 'No logos', description: 'And no watermarks.', promptText: 'logos or watermarks' },
  { id: 'no-people', label: 'No people', description: 'Objects and places only.', promptText: 'people' },
  { id: 'no-clutter', label: 'No clutter', description: 'Keep backgrounds clean.', promptText: 'busy, cluttered backgrounds' },
  { id: 'no-distortion', label: 'No distortion', description: 'Common generator failures.', promptText: 'distorted hands or faces' },
];

export const image = {
  id: 'image',
  label: 'Image',
  blurb: 'Photos, illustrations and icons for generators',
  searchHint: 'try “light” or “watercolor”',
  filterCategory: null,
  categories: [
    { id: 'im-type', title: 'Image type', selectMode: 'single' },
    { id: 'im-style', title: 'Style', selectMode: 'multi', lead: 'Style: {list}.' },
    { id: 'im-mood', title: 'Mood', selectMode: 'multi', lead: 'Mood: {list}.' },
    { id: 'im-composition', title: 'Composition & camera', selectMode: 'multi', lead: 'Composition: {list}.' },
    { id: 'im-light', title: 'Lighting', selectMode: 'multi', lead: 'Lighting: {list}.' },
    { id: 'im-color', title: 'Color', selectMode: 'multi', lead: 'Color: {list}.' },
    { id: 'im-ratio', title: 'Aspect ratio', selectMode: 'single', lead: 'Aspect ratio {list}.' },
    { id: 'im-avoid', title: 'Keep out', selectMode: 'multi', lead: 'Keep these out of the image: {list}.' },
  ],
  sections: [
    { id: 'core', title: 'Subject', defaultOpen: true, categories: ['im-type'], noteLabel: 'What is in the image?', notePlaceholder: 'e.g. students working together around a laptop in a bright study room' },
    { id: 'look', title: 'Style & mood', defaultOpen: true, categories: ['im-style', 'im-mood'], noteLabel: 'Any other style notes?', notePlaceholder: 'e.g. like a university admissions brochure' },
    { id: 'camera', title: 'Composition, light & color', defaultOpen: true, categories: ['im-composition', 'im-light', 'im-color'], noteLabel: 'Specific colors or details?', notePlaceholder: 'e.g. purple and gold accents, mountains through the window' },
    { id: 'output', title: 'Format & exclusions', categories: ['im-ratio', 'im-avoid'], noteLabel: 'Where will it be used?', notePlaceholder: 'e.g. the title slide of a training deck' },
  ],
  terms: [
    ['im-type', types], ['im-style', styles], ['im-mood', moods], ['im-composition', composition],
    ['im-light', lighting], ['im-color', colors], ['im-ratio', ratios], ['im-avoid', avoid],
  ],
  presets: [
    { id: 'slide-photo', label: 'Slide photo', blurb: 'A wide editorial photo with room for a title.', terms: ['photo', 'editorial', 'professional', 'hopeful', 'wide', 'negative-space', 'shallow-dof', 'natural', 'muted', 'wide-16-9', 'no-text', 'no-logos', 'no-distortion'] },
    { id: 'flat-illustration', label: 'Flat illustration', blurb: 'Clean vector art for docs and web pages.', terms: ['illustration', 'flat', 'minimal', 'playful', 'centered', 'soft', 'brand', 'wide-16-9', 'no-text', 'no-clutter'] },
    { id: 'app-icon', label: 'App icon', blurb: 'One clear symbol that reads at small sizes.', terms: ['icon', 'flat', 'minimal', 'centered', 'brand', 'square', 'no-text', 'no-clutter'] },
    { id: 'social-image', label: 'Social post image', blurb: 'Bright, square and scroll-stopping.', terms: ['photo', 'cinematic', 'energetic', 'close-up', 'thirds', 'golden-hour', 'vibrant', 'square', 'no-text', 'no-logos', 'no-distortion'] },
  ],
  openingUsesNote: true,
  opening(pick, note = '') {
    const [type] = pick('im-type');
    const subject = note.trim().replace(/[.\s]+$/, '');
    if (!type && !subject) return [];
    const what = type?.promptText ?? 'an image';
    if (!subject) return [`Create ${what}.`];
    // "Students in a library" -> "of students in a library", but leave "ECU campus" alone.
    const lead = /^[A-Z][a-z]/.test(subject) ? subject[0].toLowerCase() + subject.slice(1) : subject;
    return [`Create ${what} of ${lead}.`];
  },
};
