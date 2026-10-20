/**
 * Mode: apps & code that aren't primarily graphical — business apps, scripts,
 * APIs and automations. Prompts are written for an AI coding assistant.
 */

const SCRIPTY = ['script', 'automation'];
const HAS_UI = ['crud-app', 'dashboard', 'web-site', 'browser-ext'];

const kinds = [
  { id: 'crud-app', label: 'Business app', description: 'Forms and lists for tracking records: requests, approvals, inventory, onboarding.', promptText: 'an internal business app for creating, viewing and updating records' },
  { id: 'dashboard', label: 'Dashboard', description: 'Charts and key numbers that summarize data at a glance.', promptText: 'a reporting dashboard' },
  { id: 'web-site', label: 'Website', description: 'Mostly content pages: an information site, landing page or portal.', promptText: 'a website' },
  { id: 'api', label: 'API / backend', description: 'A service other software calls, with endpoints and a data layer.', promptText: 'a backend API service' },
  { id: 'script', label: 'Script / CLI tool', description: 'A command-line or scheduled script that does one job well.', promptText: 'a command-line script' },
  { id: 'automation', label: 'Workflow automation', description: '“When this happens, do that” — triggers and actions connecting systems.', promptText: 'a workflow automation' },
  { id: 'browser-ext', label: 'Browser extension', description: 'Adds features to the browser or to specific websites.', promptText: 'a browser extension' },
];

const stacks = [
  { id: 'power-apps', label: 'Power Apps', description: 'Microsoft’s low-code canvas apps, written in Excel-like Power Fx formulas.', promptText: 'a Power Apps canvas app with Power Fx formulas', appliesTo: ['crud-app', 'dashboard'], suggests: ['delegation', 'sharepoint-list'] },
  { id: 'power-automate', label: 'Power Automate', description: 'Microsoft’s flow builder: triggers, approvals and hundreds of connectors.', promptText: 'Power Automate cloud flows', appliesTo: ['automation'], suggests: ['retries', 'audit-log'] },
  { id: 'spfx', label: 'SharePoint (SPFx)', description: 'Custom web parts and extensions that run inside SharePoint Online pages.', promptText: 'the SharePoint Framework (SPFx)', appliesTo: ['crud-app', 'dashboard', 'web-site'] },
  { id: 'react', label: 'React', description: 'The most common component framework for web interfaces.', promptText: 'React with TypeScript', appliesTo: HAS_UI },
  { id: 'vanilla', label: 'Plain HTML/CSS/JS', description: 'No framework and no build step. Easy to host anywhere.', promptText: 'plain HTML, CSS and JavaScript with no framework', appliesTo: HAS_UI },
  { id: 'python', label: 'Python', description: 'Readable general-purpose language; great for scripts, data and APIs.', promptText: 'Python 3' },
  { id: 'node', label: 'Node.js', description: 'JavaScript on the server and command line.', promptText: 'Node.js' },
  { id: 'powershell', label: 'PowerShell', description: 'Windows and Microsoft 365 administration and automation.', promptText: 'PowerShell 7', appliesTo: [...SCRIPTY, 'api'], suggests: ['dry-run', 'logging'] },
  { id: 'csharp', label: 'C# / .NET', description: 'Microsoft’s typed language for services, tools and desktop apps.', promptText: 'C# and .NET' },
  { id: 'sql', label: 'SQL', description: 'Queries, views and stored procedures against a relational database.', promptText: 'SQL', appliesTo: ['script', 'dashboard', 'api'] },
  { id: 'apps-script', label: 'Google Apps Script', description: 'JavaScript automation for Google Sheets, Docs and Gmail.', promptText: 'Google Apps Script', appliesTo: SCRIPTY },
];

const data = [
  { id: 'sharepoint-list', label: 'SharePoint list', description: 'Microsoft 365 lists. Watch the 5,000-item view threshold.', promptText: 'a SharePoint Online list' },
  { id: 'dataverse', label: 'Dataverse', description: 'The Power Platform’s relational database, with security roles built in.', promptText: 'Dataverse tables' },
  { id: 'sql-db', label: 'SQL database', description: 'SQL Server, PostgreSQL or similar.', promptText: 'a SQL database' },
  { id: 'sqlite', label: 'SQLite', description: 'A single-file database. Zero setup, good for small tools.', promptText: 'a local SQLite database file' },
  { id: 'files', label: 'Excel / CSV files', description: 'Spreadsheets in and out.', promptText: 'Excel or CSV files' },
  { id: 'rest-api', label: 'External REST API', description: 'Data that comes from another system’s web API.', promptText: 'an external REST API, with its base URL and credentials kept in configuration' },
  { id: 'graph-api', label: 'Microsoft Graph', description: 'One API for users, mail, calendars, Teams, OneDrive and SharePoint.', promptText: 'the Microsoft Graph API' },
  { id: 'browser-storage', label: 'Browser storage', description: 'Data stays on the user’s own machine. No server needed.', promptText: 'browser localStorage, so nothing leaves the user’s machine', appliesTo: HAS_UI },
];

const features = [
  { id: 'auth', label: 'Sign-in', description: 'Users log in with their organization account before using it.', promptText: 'sign-in with organization accounts' },
  { id: 'roles', label: 'Roles & permissions', description: 'Different users can see and do different things.', promptText: 'role-based permissions so users only see and do what their role allows', suggests: ['auth'] },
  { id: 'approval', label: 'Approval workflow', description: 'Requests route to an approver who approves or rejects with comments.', promptText: 'an approval step where an approver can approve or reject each request with a comment', suggests: ['notifications', 'audit-log'] },
  { id: 'search-filter', label: 'Search & filter', description: 'Find records by typing or narrowing by status, date or owner.', promptText: 'search and filtering on the main list', appliesTo: [...HAS_UI, 'api'] },
  { id: 'paging', label: 'Sorting & paging', description: 'Long lists stay fast and manageable.', promptText: 'sorting and pagination for long lists', appliesTo: [...HAS_UI, 'api'] },
  { id: 'validation', label: 'Form validation', description: 'Catch bad input before it’s saved, with helpful messages.', promptText: 'form validation with clear inline error messages', appliesTo: HAS_UI },
  { id: 'attachments', label: 'File attachments', description: 'Users can attach documents to a record.', promptText: 'file attachments on records' },
  { id: 'notifications', label: 'Email notifications', description: 'People hear about changes without checking the app.', promptText: 'email notifications when a record’s status changes' },
  { id: 'audit-log', label: 'Audit trail', description: 'A record of who changed what, and when.', promptText: 'an audit trail of who changed what and when' },
  { id: 'import-export', label: 'Import / export', description: 'Move data in and out as CSV.', promptText: 'CSV import and export' },
  { id: 'schedule', label: 'Runs on a schedule', description: 'Runs nightly or hourly without anyone pressing a button.', promptText: 'a scheduled run, with a log of each run', appliesTo: [...SCRIPTY, 'api'] },
  { id: 'retries', label: 'Retries', description: 'Network calls that fail briefly get retried instead of crashing the run.', promptText: 'retries with backoff for calls that can fail temporarily', appliesTo: [...SCRIPTY, 'api'] },
  { id: 'dry-run', label: 'Dry-run mode', description: 'Preview what would change without changing anything. Essential for admin scripts.', promptText: 'a dry-run mode that reports what would change without changing anything', appliesTo: SCRIPTY },
  { id: 'cli-params', label: 'Command-line options', description: 'Parameters with defaults and help text instead of edited variables.', promptText: 'command-line parameters with defaults and help text', appliesTo: ['script'] },
  { id: 'delegation', label: 'Delegation-safe', description: 'Power Apps only: queries that keep working on lists with more than 2,000 items.', promptText: 'queries that stay delegable so they work on lists with thousands of items', appliesTo: ['crud-app', 'dashboard'] },
];

const ui = [
  { id: 'responsive-ui', label: 'Responsive layout', description: 'Works on a phone as well as a desktop.', promptText: 'a layout that works on phones and desktops' },
  { id: 'data-table', label: 'Data table', description: 'The main records in a sortable table.', promptText: 'a sortable data table for the main records' },
  { id: 'charts-ui', label: 'Charts', description: 'The key numbers shown visually.', promptText: 'charts for the key numbers' },
  { id: 'empty-states', label: 'Empty & error states', description: 'Screens that say what to do when there’s nothing to show or something failed.', promptText: 'empty and error states that tell the user what to do next' },
  { id: 'loading', label: 'Loading states', description: 'Feedback while data loads, so nobody clicks twice.', promptText: 'loading indicators for anything slower than a moment' },
  { id: 'themes', label: 'Light & dark themes', description: 'Follows the user’s system setting.', promptText: 'light and dark themes that follow the system setting' },
  { id: 'a11y', label: 'Accessible', description: 'Keyboard, screen reader and contrast requirements (WCAG 2.1 AA).', promptText: 'full keyboard and screen-reader support with WCAG 2.1 AA contrast' },
  { id: 'branding', label: 'Match branding', description: 'Use your organization’s colors and fonts. Name them in the note below.', promptText: 'colors and fonts that match our organization’s branding' },
].map((t) => ({ ...t, appliesTo: HAS_UI }));
ui.push({ id: 'console-output', label: 'Readable output', description: 'Clear progress messages and a summary at the end of each run.', promptText: 'clear progress messages and a summary at the end of each run', appliesTo: SCRIPTY });

const quality = [
  { id: 'error-handling', label: 'Error handling', description: 'Failures are caught and explained instead of crashing silently.', promptText: 'handle errors explicitly with clear messages' },
  { id: 'logging', label: 'Logging', description: 'Key steps and errors recorded so problems can be traced later.', promptText: 'log key steps and errors so problems can be traced' },
  { id: 'typed', label: 'Type safety', description: 'TypeScript or type hints catch mistakes before they run.', promptText: 'use strict typing (TypeScript or type hints)' },
  { id: 'tests', label: 'Unit tests', description: 'Automated checks for the core logic.', promptText: 'include unit tests for the core logic' },
  { id: 'comments', label: 'Useful comments', description: 'Explain the why on non-obvious code, not every line.', promptText: 'comment the non-obvious parts rather than every line' },
  { id: 'small-functions', label: 'Small functions', description: 'Each function does one thing. Easier to read, test and change.', promptText: 'keep functions small and single-purpose' },
  { id: 'few-deps', label: 'Minimal dependencies', description: 'Every package added is something to update and secure.', promptText: 'avoid new dependencies unless they clearly earn their place' },
  { id: 'config', label: 'No hard-coded values', description: 'URLs, IDs and settings live in configuration.', promptText: 'keep URLs, IDs and settings in configuration rather than hard-coding them' },
  { id: 'idempotent', label: 'Safe to re-run', description: 'Running it twice doesn’t duplicate work or data.', promptText: 'make it safe to run more than once without duplicating work', appliesTo: [...SCRIPTY, 'api'] },
];

const security = [
  { id: 'no-secrets', label: 'No secrets in code', description: 'Passwords and keys come from environment variables or a vault.', promptText: 'read credentials from environment variables or a secret store, never from the code' },
  { id: 'input-validation', label: 'Validate input', description: 'Never trust what users or other systems send.', promptText: 'validate and sanitize all input' },
  { id: 'least-privilege', label: 'Least privilege', description: 'Ask for only the permissions it actually needs.', promptText: 'request only the permissions it needs (and list them)' },
  { id: 'pii', label: 'Protect personal data', description: 'Names, IDs and emails handled carefully and never logged.', promptText: 'keep personal data (names, IDs, emails) out of logs' },
  { id: 'ferpa', label: 'FERPA-aware', description: 'US student-records privacy rules apply.', promptText: 'assume student records are covered by FERPA and must never be shown to unauthorized users' },
  { id: 'param-queries', label: 'Parameterized queries', description: 'Prevents SQL injection.', promptText: 'use parameterized queries everywhere' },
];

const deliverables = [
  { id: 'readme', label: 'README', description: 'Setup, configuration and how to run it.', promptText: 'a README that explains setup and usage' },
  { id: 'setup-steps', label: 'Setup steps', description: 'Instructions someone new could follow, click by click.', promptText: 'step-by-step setup instructions for someone who has never seen the project' },
  { id: 'complete-files', label: 'Complete files', description: 'Whole files ready to paste — no “rest unchanged” placeholders.', promptText: 'complete files with no placeholders such as “rest of code unchanged”' },
  { id: 'changes-only', label: 'Only the changes', description: 'Just the edited parts, with enough context to find them.', promptText: 'only the changed sections with enough surrounding context to place them', conflictsWith: ['complete-files'] },
  { id: 'explanation', label: 'Explanation', description: 'How it works and why it’s built this way.', promptText: 'a short explanation of how it works and why it is built this way' },
  { id: 'test-plan', label: 'Test plan', description: 'Cases to try by hand, with expected results.', promptText: 'a short list of test cases with expected results' },
  { id: 'sample-data', label: 'Sample data', description: 'Something realistic to try it with.', promptText: 'realistic sample data to try it with' },
  { id: 'rollback', label: 'Rollback plan', description: 'How to undo the change if it goes wrong.', promptText: 'instructions for undoing the change if something goes wrong' },
];

const process = [
  { id: 'ask-first', label: 'Ask before assuming', description: 'Questions first if something important is unclear.', promptText: 'ask clarifying questions before starting if anything important is unclear' },
  { id: 'plan-first', label: 'Plan first', description: 'See the approach before any code is written.', promptText: 'outline your plan and wait for my go-ahead before writing code' },
  { id: 'assumptions', label: 'State assumptions', description: 'Know what the AI decided on your behalf.', promptText: 'state any assumptions you make' },
  { id: 'match-style', label: 'Match existing style', description: 'New code looks like the code already there.', promptText: 'match the style and conventions of the existing code' },
  { id: 'minimal-change', label: 'Change only what’s needed', description: 'No drive-by rewrites of unrelated code.', promptText: 'change only what is needed and leave unrelated code alone' },
  { id: 'small-steps', label: 'Small steps', description: 'Build in pieces you can test as you go.', promptText: 'work in small steps I can test as we go' },
  { id: 'compare-options', label: 'Compare options', description: 'A quick look at alternatives before committing to one.', promptText: 'briefly compare the main options before picking one' },
  { id: 'beginner', label: 'Explain for a beginner', description: 'For when the language or platform is new to you.', promptText: 'explain each part as you would to someone new to this language' },
];

export const software = {
  id: 'software',
  label: 'Apps & code',
  blurb: 'Business apps, scripts, APIs, automations',
  searchHint: 'try “approval” or “tests”',
  filterCategory: 'sw-kind',
  categories: [
    { id: 'sw-kind', title: 'What you’re building', hint: 'Pick one — this filters the options below.', selectMode: 'single' },
    { id: 'sw-stack', title: 'Language / platform', selectMode: 'single' },
    { id: 'sw-data', title: 'Data & storage', selectMode: 'multi', lead: 'Store and read data using {list}.' },
    { id: 'sw-features', title: 'Features', selectMode: 'multi', lead: 'It needs {list}.' },
    { id: 'sw-ui', title: 'Interface', selectMode: 'multi', lead: 'For the interface, include {list}.' },
    { id: 'sw-quality', title: 'Code quality', selectMode: 'multi', lead: 'Engineering standards: {list}.' },
    { id: 'sw-security', title: 'Security & privacy', selectMode: 'multi', lead: 'Security: {list}.' },
    { id: 'sw-deliver', title: 'Deliverables', selectMode: 'multi', lead: 'Along with the code, provide {list}.' },
    { id: 'sw-process', title: 'How to work', selectMode: 'multi', lead: 'While working, {list}.' },
  ],
  sections: [
    { id: 'core', title: 'What to build', defaultOpen: true, categories: ['sw-kind', 'sw-stack'], noteLabel: 'What should it do?', notePlaceholder: 'e.g. staff submit expense requests and their chair approves them' },
    { id: 'data', title: 'Data', defaultOpen: true, categories: ['sw-data'], noteLabel: 'Any details about the data?', notePlaceholder: 'e.g. the list has Title, Status (choice) and Amount (currency) columns' },
    { id: 'features', title: 'Features & interface', defaultOpen: true, categories: ['sw-features', 'sw-ui'], noteLabel: 'Any other features or screens?', notePlaceholder: 'e.g. managers see a second tab with everything waiting on them' },
    { id: 'quality', title: 'Quality & security', categories: ['sw-quality', 'sw-security'], noteLabel: 'Any other standards to follow?', notePlaceholder: 'e.g. must run under a service account with no admin rights' },
    { id: 'delivery', title: 'Deliverables & process', categories: ['sw-deliver', 'sw-process'], noteLabel: 'Anything else about how to work?', notePlaceholder: 'e.g. I will paste the current code in my next message' },
  ],
  terms: [
    ['sw-kind', kinds], ['sw-stack', stacks], ['sw-data', data], ['sw-features', features], ['sw-ui', ui],
    ['sw-quality', quality], ['sw-security', security], ['sw-deliver', deliverables], ['sw-process', process],
  ],
  presets: [
    { id: 'power-app', label: 'Power Apps tracker', blurb: 'A canvas app over a SharePoint list, with approvals and email.', terms: ['crud-app', 'power-apps', 'sharepoint-list', 'roles', 'approval', 'search-filter', 'validation', 'notifications', 'delegation', 'responsive-ui', 'empty-states', 'a11y', 'error-handling', 'config', 'least-privilege', 'pii', 'setup-steps', 'test-plan', 'assumptions'] },
    { id: 'admin-script', label: 'Admin script', blurb: 'PowerShell that’s safe to run twice and says what it did.', terms: ['script', 'powershell', 'files', 'cli-params', 'dry-run', 'retries', 'console-output', 'error-handling', 'logging', 'config', 'idempotent', 'no-secrets', 'least-privilege', 'readme', 'sample-data', 'assumptions'] },
    { id: 'approval-flow', label: 'Approval flow', blurb: 'A Power Automate flow with approvals, notifications and an audit trail.', terms: ['automation', 'power-automate', 'sharepoint-list', 'approval', 'notifications', 'audit-log', 'retries', 'error-handling', 'logging', 'config', 'least-privilege', 'setup-steps', 'test-plan', 'rollback', 'plan-first'] },
    { id: 'web-tool', label: 'Small web tool', blurb: 'A self-contained browser tool with no server.', terms: ['crud-app', 'vanilla', 'browser-storage', 'search-filter', 'import-export', 'validation', 'responsive-ui', 'data-table', 'empty-states', 'themes', 'a11y', 'error-handling', 'comments', 'few-deps', 'complete-files', 'readme'] },
    { id: 'api-service', label: 'API service', blurb: 'A Python API with tests, validation and no secrets in code.', terms: ['api', 'python', 'sql-db', 'auth', 'roles', 'paging', 'error-handling', 'logging', 'typed', 'tests', 'config', 'no-secrets', 'input-validation', 'param-queries', 'readme', 'explanation', 'ask-first'] },
    { id: 'fix-code', label: 'Fix my code', blurb: 'Small, explained changes to code you paste in.', terms: ['error-handling', 'match-style', 'minimal-change', 'assumptions', 'ask-first', 'changes-only', 'explanation', 'test-plan'] },
  ],
  opening(pick) {
    const [kind] = pick('sw-kind');
    const [stack] = pick('sw-stack');
    if (kind) return [`Build ${kind.promptText}${stack ? ` using ${stack.promptText}` : ''}.`];
    if (stack) return [`Write the code using ${stack.promptText}.`];
    return [];
  },
};
