/* The suite manifest. Adding an app means adding an entry here and a module
 * that exports `register()`; the hub, theming and routing pick it up for free. */

export const APPS = [
  {
    id: 'gleam',
    name: 'Gleam',
    tagline: 'Daily reps for social skills',
    blurb: 'Five minutes a day on the hard rooms — talking to people you like, texting, parties, and the overthinking afterwards.',
    status: 'live',
    home: '/gleam',
    accent: {
      '--accent': '#F5A524',
      '--accent-300': '#FFC763',
      '--accent-600': '#DC8709',
      '--accent-ink': '#2A1A03',
      '--accent-glow': 'rgba(245,165,36,.34)',
      '--accent-veil': 'rgba(245,165,36,.11)',
    },
    mark: `<circle cx="24" cy="24" r="7.5" fill="currentColor"/>
           <g stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".85">
             <path d="M24 4v6M24 38v6M4 24h6M38 24h6M10 10l4.2 4.2M33.8 33.8 38 38M38 10l-4.2 4.2M14.2 33.8 10 38"/>
           </g>`,
  },
];

/* Sketched, not built. Shown in the hub so the shelf reads as a suite and so
   it's obvious what to say "build that one next" about. */
export const PLANNED = [
  { id: 'ember', name: 'Ember', tagline: 'Habit streaks, no subscription', mark: '🔥' },
  { id: 'tide', name: 'Tide', tagline: 'Sleep &amp; wind-down', mark: '🌙' },
  { id: 'ledger', name: 'Ledger', tagline: 'Money, one number a day', mark: '◆' },
  { id: 'plate', name: 'Plate', tagline: 'Photo calorie tracking', mark: '◗' },
];

export function findApp(id) {
  return APPS.find((app) => app.id === id) || null;
}

const DEFAULT_ACCENT = {
  '--accent': '#F5A524',
  '--accent-300': '#FFC763',
  '--accent-600': '#DC8709',
  '--accent-ink': '#2A1A03',
  '--accent-glow': 'rgba(245,165,36,.34)',
  '--accent-veil': 'rgba(245,165,36,.11)',
};

/** Retint the whole UI for whichever app the user is inside. */
export function applyAccent(app) {
  const vars = app?.accent || DEFAULT_ACCENT;
  for (const [key, value] of Object.entries(vars)) {
    document.documentElement.style.setProperty(key, value);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', '#0B0A11');
}
