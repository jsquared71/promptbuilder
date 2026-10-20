/**
 * Mode: writing — drafting, rewriting, summarizing and proofreading text.
 *
 * Kind terms carry a `noun` alongside their `promptText` ("email" / "an
 * email") and task terms carry a sentence `template`, so the opening reads
 * naturally for every combination: "Rewrite the email below…", "Write an FAQ."
 */

const kinds = [
  { id: 'email', label: 'Email', noun: 'email', description: 'A message to one person or a group.', promptText: 'an email' },
  { id: 'announcement', label: 'Announcement', noun: 'announcement', description: 'News for a wide audience: changes, outages, events.', promptText: 'an announcement' },
  { id: 'how-to', label: 'How-to guide', noun: 'guide', description: 'Instructions someone follows while doing the task.', promptText: 'a step-by-step how-to guide' },
  { id: 'report', label: 'Report', noun: 'report', description: 'Findings or status, written up for others to act on.', promptText: 'a report' },
  { id: 'proposal', label: 'Proposal', noun: 'proposal', description: 'Making the case for a project, purchase or change.', promptText: 'a proposal' },
  { id: 'policy', label: 'Policy / procedure', noun: 'document', description: 'Rules or a standard process people are expected to follow.', promptText: 'a policy or procedure document' },
  { id: 'faq', label: 'FAQ', noun: 'FAQ', description: 'Common questions, each with a short answer.', promptText: 'an FAQ' },
  { id: 'meeting-notes', label: 'Meeting notes', noun: 'notes', description: 'Decisions, action items and owners from a meeting.', promptText: 'meeting notes with decisions and action items' },
  { id: 'article', label: 'Article / blog post', noun: 'article', description: 'A longer piece written to inform or persuade.', promptText: 'an article' },
  { id: 'social', label: 'Social post', noun: 'post', description: 'Short, scannable, written for a feed.', promptText: 'a social media post' },
  { id: 'slides', label: 'Slide outline', noun: 'outline', description: 'What goes on each slide, plus speaker notes.', promptText: 'a slide-by-slide presentation outline with speaker notes' },
  { id: 'cover-letter', label: 'Cover letter', noun: 'letter', description: 'For a job application.', promptText: 'a cover letter' },
  { id: 'bio', label: 'Bio', noun: 'bio', description: 'A short professional introduction.', promptText: 'a short professional bio' },
  { id: 'feedback', label: 'Feedback', noun: 'feedback', description: 'Constructive comments on someone’s work.', promptText: 'constructive written feedback' },
];

const tasks = [
  { id: 'draft', label: 'Draft new', description: 'Write it from scratch using the details you give.', template: 'Write {a}.', bareTemplate: 'Write the text described below.' },
  { id: 'rewrite', label: 'Rewrite / improve', description: 'Make your draft clearer and stronger.', template: 'Rewrite the {n} below to make it clearer and more effective.', needsSource: 'Draft' },
  { id: 'shorten', label: 'Shorten', description: 'Same message, fewer words.', template: 'Shorten the {n} below without losing anything important.', needsSource: 'Draft' },
  { id: 'summarize', label: 'Summarize', description: 'The key points of something longer.', template: 'Summarize the {n} below.', needsSource: 'Text' },
  { id: 'expand', label: 'Expand notes', description: 'Turn rough notes or bullets into finished writing.', template: 'Turn the notes below into {a}.', bareTemplate: 'Turn the notes below into finished writing.', needsSource: 'Notes' },
  { id: 'reply', label: 'Reply', description: 'Respond to a message you received.', template: 'Write {a} replying to the message below.', bareTemplate: 'Write a reply to the message below.', needsSource: 'Message' },
  { id: 'proofread', label: 'Proofread only', description: 'Fix spelling, grammar and punctuation. Nothing else changes.', template: 'Proofread the {n} below. Fix only spelling, grammar and punctuation, and leave the wording otherwise unchanged.', needsSource: 'Text', conflictsWith: ['versions'] },
];

const audiences = [
  { id: 'general', label: 'General public', description: 'No background in the topic.', promptText: 'a general audience with no background in the topic' },
  { id: 'faculty', label: 'Faculty', description: 'Busy, expert in their field, not necessarily in yours.', promptText: 'faculty members' },
  { id: 'staff', label: 'Staff', description: 'Colleagues across departments.', promptText: 'staff colleagues' },
  { id: 'students', label: 'Students', description: 'Often skimming on a phone.', promptText: 'students' },
  { id: 'leaders', label: 'Leadership', description: 'Want the bottom line and what you need from them.', promptText: 'senior leaders who want the bottom line first' },
  { id: 'technical', label: 'Technical readers', description: 'Want specifics, not reassurance.', promptText: 'technical readers who want specifics' },
  { id: 'non-technical', label: 'Non-technical readers', description: 'Need the what and why without the how.', promptText: 'readers with no technical background' },
  { id: 'customers', label: 'Customers / clients', description: 'People outside your organization.', promptText: 'customers' },
  { id: 'hiring-manager', label: 'Hiring manager', description: 'Skimming many applications quickly.', promptText: 'a hiring manager skimming many applications' },
];

const tones = [
  { id: 'professional', label: 'Professional', description: 'Polished and businesslike.', promptText: 'professional' },
  { id: 'friendly', label: 'Friendly', description: 'Approachable, like a helpful colleague.', promptText: 'friendly' },
  { id: 'warm', label: 'Warm', description: 'Personal and kind.', promptText: 'warm' },
  { id: 'direct', label: 'Direct', description: 'Gets to the point without softening.', promptText: 'direct' },
  { id: 'formal', label: 'Formal', description: 'For official or ceremonial communication.', promptText: 'formal', conflictsWith: ['casual'] },
  { id: 'casual', label: 'Casual', description: 'Relaxed and conversational.', promptText: 'casual' },
  { id: 'confident', label: 'Confident', description: 'Sure of itself, without hedging.', promptText: 'confident' },
  { id: 'encouraging', label: 'Encouraging', description: 'Supportive, especially when asking people to change something.', promptText: 'encouraging' },
  { id: 'persuasive', label: 'Persuasive', description: 'Builds a case toward a decision.', promptText: 'persuasive' },
  { id: 'empathetic', label: 'Empathetic', description: 'Acknowledges frustration or difficulty.', promptText: 'empathetic' },
  { id: 'neutral', label: 'Neutral', description: 'Even-handed, no spin.', promptText: 'neutral' },
  { id: 'calm', label: 'Calm', description: 'Reassuring, never alarming — good for outages and bad news.', promptText: 'calm' },
];

const structure = [
  { id: 'subject-line', label: 'Subject line', description: 'Specific enough to act on from the inbox.', promptText: 'a specific subject line', appliesTo: ['email', 'announcement'] },
  { id: 'bluf', label: 'Main point first', description: 'Bottom line up front: the request or news in sentence one.', promptText: 'the main point or request in the first sentence' },
  { id: 'tldr', label: 'Summary at top', description: 'Two sentences for people who read nothing else.', promptText: 'a two-sentence summary at the top' },
  { id: 'headings', label: 'Headings', description: 'Short descriptive headings for scanning.', promptText: 'short descriptive headings' },
  { id: 'bullets', label: 'Bullet points', description: 'Lists of items as bullets.', promptText: 'bullet points for lists of items' },
  { id: 'steps', label: 'Numbered steps', description: 'Anything done in order, numbered.', promptText: 'numbered steps for anything the reader must do in order' },
  { id: 'table', label: 'Table', description: 'When comparing options or listing details.', promptText: 'a table where it makes a comparison easier' },
  { id: 'example', label: 'An example', description: 'One concrete example makes the main point stick.', promptText: 'one concrete example of the main point' },
  { id: 'dates', label: 'Dates & deadlines', description: 'Stated explicitly, with times and time zones.', promptText: 'every date, time and deadline stated in full' },
  { id: 'cta', label: 'Call to action', description: 'Exactly what the reader should do next.', promptText: 'a clear call to action at the end' },
  { id: 'contact', label: 'Who to contact', description: 'Where questions should go.', promptText: 'a closing line saying who to contact with questions' },
  { id: 'plain-paragraphs', label: 'Plain paragraphs', description: 'No headings or bullets. Good for personal messages.', promptText: 'plain paragraphs only (no headings or bullets)', conflictsWith: ['headings', 'bullets', 'steps', 'table'] },
];

const lengths = [
  { id: 'one-two', label: 'A sentence or two', description: 'Fits in a chat message or text.', promptText: 'one or two sentences' },
  { id: 'short', label: 'Under 100 words', description: 'Readable in under 30 seconds.', promptText: 'under 100 words' },
  { id: 'medium', label: 'About 250 words', description: 'A typical email or announcement.', promptText: 'about 250 words' },
  { id: 'long', label: 'About 600 words', description: 'A guide, article or report section.', promptText: 'about 600 words' },
  { id: 'one-page', label: 'One page', description: 'A printable single page.', promptText: 'one printed page' },
  { id: 'half', label: 'Half the original', description: 'For shortening and summarizing.', promptText: 'half the length of the original or less' },
];

const style = [
  { id: 'plain-language', label: 'Plain language', description: 'Short sentences and everyday words.', promptText: 'use plain language and short sentences' },
  { id: 'active-voice', label: 'Active voice', description: '“We will replace the printers,” not “the printers will be replaced.”', promptText: 'prefer the active voice' },
  { id: 'no-jargon', label: 'No jargon', description: 'Or explain it the first time it appears.', promptText: 'avoid jargon unless you explain it the first time it appears' },
  { id: 'you', label: 'Talk to “you”', description: 'Address the reader directly.', promptText: 'address the reader directly as “you”' },
  { id: 'inclusive', label: 'Inclusive language', description: 'People-first, gender-neutral wording.', promptText: 'use inclusive, people-first language' },
  { id: 'keep-voice', label: 'Keep my voice', description: 'Improve it without making it sound like someone else.', promptText: 'keep my voice and word choices wherever they already work' },
  { id: 'exact-facts', label: 'Keep facts exact', description: 'Names, numbers, dates and links stay as written.', promptText: 'keep all facts (names, numbers, dates, links) exactly as written' },
  { id: 'no-filler', label: 'No filler', description: 'Cut throat-clearing, clichés and hype.', promptText: 'cut filler and clichés' },
  { id: 'us-english', label: 'US English', description: 'American spelling and punctuation.', promptText: 'use US English spelling' },
  { id: 'ap-style', label: 'AP style', description: 'Associated Press conventions for numbers, dates and titles.', promptText: 'follow AP style' },
];

const output = [
  { id: 'subject-options', label: 'Subject line options', description: 'Alternatives to pick from.', promptText: 'three alternative subject lines', appliesTo: ['email', 'announcement'] },
  { id: 'just-text', label: 'Just the text', description: 'Ready to paste, nothing else.', promptText: 'only the finished text, with no introduction or commentary', conflictsWith: ['change-notes', 'questions-first'] },
  { id: 'versions', label: 'Three versions', description: 'Different approaches to choose from.', promptText: 'three labeled versions that take different approaches' },
  { id: 'change-notes', label: 'What changed', description: 'A list of edits and why.', promptText: 'a short list of the changes you made and why' },
  { id: 'marked-changes', label: 'Marked changes', description: 'See every edit in place.', promptText: 'the text with removals in ~~strikethrough~~ and additions in **bold**' },
  { id: 'questions-first', label: 'Questions first', description: 'The AI asks for missing details instead of inventing them.', promptText: 'questions about any missing key details before writing anything' },
];

export const writing = {
  id: 'writing',
  label: 'Writing',
  blurb: 'Emails, announcements, guides, summaries',
  searchHint: 'try “email” or “summary”',
  filterCategory: 'w-kind',
  categories: [
    { id: 'w-kind', title: 'Type of writing', hint: 'Pick one — this filters the options below.', selectMode: 'single' },
    { id: 'w-task', title: 'What to do', selectMode: 'single' },
    { id: 'w-audience', title: 'Audience', selectMode: 'multi', lead: 'Write it for {list}.' },
    { id: 'w-tone', title: 'Tone', selectMode: 'multi', lead: 'The tone should be {list}.' },
    { id: 'w-structure', title: 'Structure', selectMode: 'multi', lead: 'Structure it with {list}.' },
    { id: 'w-length', title: 'Length', selectMode: 'single', lead: 'Keep it to {list}.' },
    { id: 'w-style', title: 'Style rules', selectMode: 'multi', lead: 'Style: {list}.' },
    { id: 'w-output', title: 'What to return', selectMode: 'multi', lead: 'Return {list}.' },
  ],
  sections: [
    { id: 'core', title: 'What to write', defaultOpen: true, categories: ['w-kind', 'w-task'], noteLabel: 'What is it about?', notePlaceholder: 'e.g. the 2nd-floor printers are being replaced next Tuesday' },
    { id: 'audience', title: 'Audience & tone', defaultOpen: true, categories: ['w-audience', 'w-tone'], noteLabel: 'Anything else about the readers?', notePlaceholder: 'e.g. many of them were frustrated by the last outage' },
    { id: 'shape', title: 'Structure & length', defaultOpen: true, categories: ['w-structure', 'w-length'], noteLabel: 'Anything that must be included?', notePlaceholder: 'e.g. mention the help desk extension, 4-1234' },
    { id: 'style', title: 'Style & output', categories: ['w-style', 'w-output'], noteLabel: 'Anything to avoid or keep word for word?', notePlaceholder: 'e.g. keep the second paragraph exactly as it is' },
  ],
  terms: [
    ['w-kind', kinds], ['w-task', tasks], ['w-audience', audiences], ['w-tone', tones],
    ['w-structure', structure], ['w-length', lengths], ['w-style', style], ['w-output', output],
  ],
  presets: [
    { id: 'it-announcement', label: 'IT announcement', blurb: 'Maintenance or a change, explained without jargon.', terms: ['announcement', 'draft', 'faculty', 'staff', 'non-technical', 'friendly', 'calm', 'subject-line', 'bluf', 'bullets', 'dates', 'contact', 'short', 'plain-language', 'no-jargon', 'exact-facts', 'just-text', 'subject-options'] },
    { id: 'polish-email', label: 'Polish my email', blurb: 'Clearer and tighter, still sounding like you.', terms: ['email', 'rewrite', 'professional', 'warm', 'bluf', 'cta', 'short', 'active-voice', 'keep-voice', 'exact-facts', 'no-filler', 'change-notes'] },
    { id: 'how-to-guide', label: 'How-to guide', blurb: 'Steps a non-technical person can follow on their own.', terms: ['how-to', 'draft', 'non-technical', 'friendly', 'encouraging', 'tldr', 'headings', 'steps', 'example', 'contact', 'medium', 'plain-language', 'you', 'no-jargon', 'just-text'] },
    { id: 'exec-summary', label: 'Executive summary', blurb: 'A long report boiled down for leadership.', terms: ['report', 'summarize', 'leaders', 'direct', 'confident', 'bluf', 'bullets', 'short', 'plain-language', 'exact-facts', 'no-filler', 'just-text'] },
    { id: 'proofread-only', label: 'Proofread only', blurb: 'Fixes errors and shows you every change.', terms: ['proofread', 'keep-voice', 'exact-facts', 'us-english', 'marked-changes'] },
    { id: 'cover-letter', label: 'Cover letter', blurb: 'Specific, confident and one page.', terms: ['cover-letter', 'draft', 'hiring-manager', 'confident', 'warm', 'bluf', 'example', 'plain-paragraphs', 'one-page', 'active-voice', 'no-filler', 'questions-first'] },
  ],
  opening(pick) {
    const [kind] = pick('w-kind');
    const [task] = pick('w-task');
    if (!kind && !task) return [];
    if (!task) return [`Write ${kind.promptText}.`];
    // Some tasks read badly with a generic noun ("summarize the text as a
    // piece of writing"), so they carry their own wording for when no kind is picked.
    const template = kind ? task.template : task.bareTemplate ?? task.template;
    return [template.replace('{a}', kind?.promptText ?? '').replace('{n}', kind?.noun ?? 'text')];
  },
  /** Tasks that work on existing text end with a labeled slot to paste it into. */
  closing(pick) {
    const [task] = pick('w-task');
    return task?.needsSource ? `${task.needsSource}:\n[paste it here]` : '';
  },
};
