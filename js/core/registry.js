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
  {
    id: 'scarab',
    name: 'Scarab',
    tagline: 'Tomb maze arcade',
    blurb: 'Flick a direction and slide until something stops you. Twelve tombs, then an endless climb with the lava coming up behind you.',
    status: 'live',
    home: '/scarab',
    accent: {
      '--accent': '#2FD6A8',
      '--accent-300': '#7CF0CD',
      '--accent-600': '#1B8B6C',
      '--accent-ink': '#04251B',
      '--accent-glow': 'rgba(47,214,168,.34)',
      '--accent-veil': 'rgba(47,214,168,.12)',
    },
    mark: `<g stroke="currentColor" stroke-width="2.6" stroke-linecap="round" opacity=".8">
             <path d="M14 18 8 14M14 24H7M14 30l-6 4M34 18l6-4M34 24h7M34 30l6 4"/>
           </g>
           <ellipse cx="24" cy="26" rx="11" ry="13" fill="currentColor"/>
           <ellipse cx="24" cy="29" rx="11" ry="10" fill="currentColor" opacity=".55"/>
           <rect x="22.6" y="15" width="2.8" height="22" rx="1.4" fill="#F5C542"/>
           <ellipse cx="24" cy="13" rx="6" ry="4.4" fill="#F5C542"/>`,
  },
];

/* Sketched, not built. Shown in the hub so the shelf reads as a suite and so
   it's obvious what to say "build that one next" about. */
export const PLANNED = [
  { id: 'ember', name: 'Ember', tagline: 'Habit streaks, no subscription', mark: '🔥' },
  { id: 'tide', name: 'Tide', tagline: 'Sleep &amp; wind-down', mark: '🌙' },
  { id: 'ledger', name: 'Ledger', tagline: 'Money, one number a day', mark: '◆' },
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
