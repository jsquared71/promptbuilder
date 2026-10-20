import { CATEGORIES, SECTIONS } from '../categories.js';
import { SOURCES } from '../terms/index.js';
import { PRESETS } from '../presets.js';

/** The original mode: prompts for graphical apps, simulations and games. */
export const graphical = {
  id: 'graphical',
  label: 'Graphics & games',
  blurb: 'Games, simulations, generative art, data viz',
  searchHint: 'try “camera” or “noise”',
  filterCategory: 'app-type',
  categories: CATEGORIES,
  sections: SECTIONS,
  terms: SOURCES,
  presets: PRESETS,
  opening(pick) {
    const [appType] = pick('app-type');
    const [genre] = pick('genre');
    const [tech] = pick('tech');
    if (!appType && !genre && !tech) return [];

    const sentences = [];
    if (appType && genre) sentences.push(`Build ${appType.promptText}: ${genre.promptText}.`);
    else if (appType) sentences.push(`Build ${appType.promptText}.`);
    else if (genre) sentences.push(`Build ${genre.promptText}.`);
    else sentences.push('Build an interactive graphical web app.');
    if (tech) sentences.push(`Implement it with ${tech.promptText}.`);
    return sentences;
  },
};
