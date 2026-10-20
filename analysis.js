/**
 * Mode: data & analysis — asking an AI to explore, explain or clean data.
 * Task terms carry a sentence `template` with a {d} slot for the data term.
 */

const tasks = [
  { id: 'explore', label: 'Explore & describe', description: 'A first look: what’s in it and what stands out.', template: 'Explore {d} and describe what stands out.' },
  { id: 'trends', label: 'Find trends', description: 'How things change over time.', template: 'Analyze {d} to find trends and changes over time.', suggests: ['time-trends', 'charts'] },
  { id: 'compare', label: 'Compare groups', description: 'Departments, terms, products — where they differ and whether it matters.', template: 'Compare groups within {d} and explain which differences are meaningful.', suggests: ['breakdowns', 'significance'] },
  { id: 'root-cause', label: 'Explain a change', description: 'Work out what is driving a rise, drop or problem.', template: 'Use {d} to work out what is driving the change or problem described below.', suggests: ['breakdowns', 'limitations'] },
  { id: 'forecast', label: 'Forecast', description: 'Project likely future values, with a range.', template: 'Use {d} to forecast likely future values, with a realistic range.', suggests: ['time-trends', 'confidence'] },
  { id: 'anomalies', label: 'Spot anomalies', description: 'Errors, outliers and things that don’t add up.', template: 'Check {d} for errors, outliers and anything that does not add up.', suggests: ['data-quality'] },
  { id: 'clean', label: 'Clean & prepare', description: 'Fix formats, duplicates and gaps so the data is usable.', template: 'Clean and prepare {d} for analysis.', suggests: ['data-quality', 'cleaned-file'] },
  { id: 'survey', label: 'Summarize a survey', description: 'Ratings plus themes from the open-ended answers.', template: 'Summarize the survey responses in {d}, including themes in the open-ended answers.', suggests: ['theme-coding', 'small-samples'] },
  { id: 'metrics', label: 'Define metrics', description: 'Decide what to measure and how to calculate it.', template: 'Propose the key metrics to track from {d} and explain how to calculate each one.' },
  { id: 'decide', label: 'Support a decision', description: 'Weigh the options and recommend one.', template: 'Use {d} to help me choose between the options described below, and make a clear recommendation.', suggests: ['recommendations', 'assumptions'] },
];

const sources = [
  { id: 'spreadsheet', label: 'Spreadsheet / CSV', description: 'An attached Excel or CSV file.', promptText: 'the attached spreadsheet' },
  { id: 'pasted', label: 'Pasted table', description: 'Data pasted straight into the chat.', promptText: 'the data below', needsSource: true },
  { id: 'survey-export', label: 'Survey export', description: 'Results from Qualtrics, Forms or similar.', promptText: 'the attached survey export' },
  { id: 'database', label: 'Database tables', description: 'You’ll describe the tables and columns.', promptText: 'the database tables described below' },
  { id: 'logs', label: 'Logs', description: 'Server, app or audit logs.', promptText: 'the attached log files' },
  { id: 'documents', label: 'Documents', description: 'Reports, transcripts or other text.', promptText: 'the attached documents' },
];

const methods = [
  { id: 'summary-stats', label: 'Summary statistics', description: 'Counts, averages, medians and ranges.', promptText: 'summary statistics (counts, averages, medians and ranges)' },
  { id: 'breakdowns', label: 'Breakdowns', description: 'Split by department, type, term or whatever matters.', promptText: 'breakdowns by the most relevant categories' },
  { id: 'time-trends', label: 'Time comparisons', description: 'Month over month, year over year.', promptText: 'month-over-month and year-over-year comparisons' },
  { id: 'pivots', label: 'Pivot tables', description: 'Cross-tabulations you could rebuild in Excel.', promptText: 'pivot tables' },
  { id: 'correlation', label: 'Correlations', description: 'What moves together — without claiming cause.', promptText: 'correlations, without treating them as proof of cause' },
  { id: 'regression', label: 'Regression', description: 'Estimate the effect of each factor while controlling for the others.', promptText: 'regression to estimate the effect of each factor' },
  { id: 'significance', label: 'Significance tests', description: 'Is a difference real or just noise?', promptText: 'statistical significance tests wherever groups are compared' },
  { id: 'theme-coding', label: 'Theme coding', description: 'Group open-ended answers into themes and count them.', promptText: 'theme coding for open-ended text (with a count and example quote per theme)' },
  { id: 'benchmarks', label: 'Benchmarks', description: 'Compare against targets, last year or peers.', promptText: 'comparison against relevant targets or benchmarks' },
];

const tools = [
  { id: 'excel', label: 'Excel', description: 'Formulas you can inspect and reuse.', promptText: 'Excel, using formulas I can inspect' },
  { id: 'python', label: 'Python', description: 'pandas for the analysis, matplotlib for charts.', promptText: 'Python with pandas' },
  { id: 'sql', label: 'SQL', description: 'Queries you can run against the source.', promptText: 'SQL' },
  { id: 'power-bi', label: 'Power BI', description: 'DAX measures and visuals for a report.', promptText: 'Power BI, with DAX measures' },
  { id: 'r', label: 'R', description: 'Statistics-first language.', promptText: 'R' },
];

const rigor = [
  { id: 'data-quality', label: 'Check data quality first', description: 'Missing values, duplicates and odd entries found before they skew results.', promptText: 'check data quality (missing values, duplicates, errors) first and report what you find' },
  { id: 'show-work', label: 'Show calculations', description: 'Every number traceable to how it was computed.', promptText: 'show how each number was calculated' },
  { id: 'assumptions', label: 'State assumptions', description: 'Know what was decided on your behalf.', promptText: 'state every assumption you make' },
  { id: 'no-invention', label: 'No invented numbers', description: 'If the data can’t answer it, say so.', promptText: 'say when the data cannot answer something instead of estimating' },
  { id: 'small-samples', label: 'Flag small samples', description: 'Conclusions from a handful of rows get called out.', promptText: 'flag any conclusion that rests on a small sample' },
  { id: 'confidence', label: 'Confidence levels', description: 'How sure the AI is about each finding.', promptText: 'say how confident you are in each conclusion' },
  { id: 'limitations', label: 'Note limitations', description: 'What the data can’t tell you.', promptText: 'note the limitations of the data and the analysis' },
  { id: 'reproducible', label: 'Reproducible', description: 'Someone else could rerun it and get the same answer.', promptText: 'make every step reproducible' },
];

const outputs = [
  { id: 'exec-summary', label: 'Executive summary', description: 'The answer in a few sentences, first.', promptText: 'a short executive summary first' },
  { id: 'key-findings', label: 'Key findings', description: 'Three to five findings, most important first.', promptText: 'the three to five most important findings in ranked order' },
  { id: 'charts', label: 'Charts', description: 'Each with a one-line takeaway as its title.', promptText: 'a chart for each main finding with its takeaway as the title' },
  { id: 'tables', label: 'Summary tables', description: 'The numbers behind the findings.', promptText: 'summary tables' },
  { id: 'recommendations', label: 'Recommendations', description: 'What to do, tied to the evidence.', promptText: 'concrete recommendations tied to the findings' },
  { id: 'next-questions', label: 'Follow-up questions', description: 'What’s worth digging into next.', promptText: 'questions worth investigating next' },
  { id: 'cleaned-file', label: 'Cleaned file', description: 'The tidied dataset to download.', promptText: 'the cleaned dataset as a downloadable file' },
  { id: 'the-code', label: 'The code or formulas', description: 'So you can rerun it next month.', promptText: 'the code or formulas I need to rerun the analysis' },
  { id: 'method-note', label: 'Methodology note', description: 'A short paragraph on how it was done.', promptText: 'a brief methodology note' },
];

const audiences = [
  { id: 'leadership', label: 'Leadership', description: 'The bottom line and the decision it supports.', promptText: 'leaders who need the bottom line and the decision it supports' },
  { id: 'analysts', label: 'Analysts', description: 'Methods and detail welcome.', promptText: 'analysts who want the detail' },
  { id: 'general-readers', label: 'General audience', description: 'No statistics background.', promptText: 'a general audience with no statistics background' },
  { id: 'just-me', label: 'Just me', description: 'Exploring — raw detail is fine.', promptText: 'me alone, with all the raw detail' },
];

export const analysis = {
  id: 'analysis',
  label: 'Data & analysis',
  blurb: 'Spreadsheets, surveys, trends, cleanup',
  searchHint: 'try “survey” or “chart”',
  filterCategory: null,
  categories: [
    { id: 'a-task', title: 'Goal', selectMode: 'single' },
    { id: 'a-data', title: 'The data', hint: 'What are you giving it?', selectMode: 'single' },
    { id: 'a-methods', title: 'Methods', selectMode: 'multi', lead: 'Use {list}.' },
    { id: 'a-tool', title: 'Tool', selectMode: 'single', lead: 'Do the work in {list}.' },
    { id: 'a-rigor', title: 'Rigor', selectMode: 'multi', lead: 'To keep the analysis trustworthy, {list}.' },
    { id: 'a-output', title: 'Output', selectMode: 'multi', lead: 'Deliver {list}.' },
    { id: 'a-audience', title: 'Audience', selectMode: 'single', lead: 'Pitch the results for {list}.' },
  ],
  sections: [
    { id: 'core', title: 'What to analyze', defaultOpen: true, categories: ['a-task', 'a-data'], noteLabel: 'What question are you trying to answer?', notePlaceholder: 'e.g. which departments submit the most late expense reports, and why?' },
    { id: 'method', title: 'Methods & tools', defaultOpen: true, categories: ['a-methods', 'a-tool'], noteLabel: 'Anything about the columns or definitions?', notePlaceholder: 'e.g. “late” means submitted more than 30 days after the trip' },
    { id: 'rigor', title: 'Rigor', categories: ['a-rigor'], noteLabel: 'Anything the analysis should rule out or check?', notePlaceholder: 'e.g. exclude test records where the requester is “TIO Admin”' },
    { id: 'output', title: 'Output & audience', defaultOpen: true, categories: ['a-output', 'a-audience'], noteLabel: 'How will the results be used?', notePlaceholder: 'e.g. three slides for the dean’s meeting' },
  ],
  terms: [
    ['a-task', tasks], ['a-data', sources], ['a-methods', methods], ['a-tool', tools],
    ['a-rigor', rigor], ['a-output', outputs], ['a-audience', audiences],
  ],
  presets: [
    { id: 'survey-summary', label: 'Survey summary', blurb: 'Ratings and open-ended themes, with honest caveats.', terms: ['survey', 'survey-export', 'summary-stats', 'breakdowns', 'theme-coding', 'data-quality', 'small-samples', 'no-invention', 'exec-summary', 'key-findings', 'charts', 'leadership'] },
    { id: 'trend-report', label: 'Trend report', blurb: 'What changed over time and why it might have.', terms: ['trends', 'spreadsheet', 'time-trends', 'breakdowns', 'benchmarks', 'data-quality', 'assumptions', 'limitations', 'exec-summary', 'charts', 'recommendations', 'leadership'] },
    { id: 'cleanup', label: 'Clean a spreadsheet', blurb: 'Duplicates, formats and gaps fixed, with a log.', terms: ['clean', 'spreadsheet', 'excel', 'data-quality', 'show-work', 'assumptions', 'reproducible', 'cleaned-file', 'the-code', 'method-note', 'just-me'] },
    { id: 'decision', label: 'Decision support', blurb: 'Options weighed against the data, with a recommendation.', terms: ['decide', 'spreadsheet', 'breakdowns', 'benchmarks', 'assumptions', 'confidence', 'limitations', 'no-invention', 'exec-summary', 'tables', 'recommendations', 'leadership'] },
  ],
  opening(pick) {
    const [task] = pick('a-task');
    const [source] = pick('a-data');
    if (!task && !source) return [];
    return [(task?.template ?? 'Analyze {d}.').replace('{d}', source?.promptText ?? 'the data provided')];
  },
  closing(pick) {
    const [source] = pick('a-data');
    return source?.needsSource ? 'Data:\n[paste it here]' : '';
  },
};
