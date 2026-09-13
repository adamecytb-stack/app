/* Single localStorage-backed document for the whole suite.
 *
 * One key, one JSON blob, one schema version. Each app owns a slice under its
 * own id, so adding an app never touches another app's data — and a full
 * backup is just this object.
 */

const KEY = 'prism.state';
const SCHEMA = 1;

const BLANK = {
  schema: SCHEMA,
  createdAt: null,
  hub: { lastApp: null, visits: 0 },
  apps: {},
};

function clone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function migrate(raw) {
  const data = { ...clone(BLANK), ...raw };
  data.hub = { ...BLANK.hub, ...(raw.hub || {}) };
  data.apps = raw.apps || {};
  data.schema = SCHEMA;
  return data;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...clone(BLANK), createdAt: new Date().toISOString() };
    return migrate(JSON.parse(raw));
  } catch (err) {
    console.warn('[prism] could not read saved state, starting fresh', err);
    return { ...clone(BLANK), createdAt: new Date().toISOString() };
  }
}

export const state = read();

const listeners = new Set();
let pending = null;
let storageWorks = true;

function flush() {
  pending = null;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    if (storageWorks) console.warn('[prism] could not persist state', err);
    storageWorks = false;
  }
}

/** Persist (debounced) and notify subscribers. Call after any mutation. */
export function save() {
  if (pending === null) pending = setTimeout(flush, 120);
  for (const fn of listeners) {
    try { fn(state); } catch (err) { console.error(err); }
  }
}

/** Persist right now — used before the page may go away. */
export function saveNow() {
  if (pending !== null) clearTimeout(pending);
  flush();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The mutable slice belonging to one app, created on first use. */
export function slice(appId, defaults) {
  if (!state.apps[appId]) state.apps[appId] = clone(defaults);
  else state.apps[appId] = { ...clone(defaults), ...state.apps[appId] };
  return state.apps[appId];
}

export function exportBackup() {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);
}

export function importBackup(text) {
  const incoming = JSON.parse(text);
  if (!incoming || typeof incoming !== 'object' || !('apps' in incoming)) {
    throw new Error('That file is not a Prism backup.');
  }
  const next = migrate(incoming);
  Object.keys(state).forEach((k) => delete state[k]);
  Object.assign(state, next);
  saveNow();
  for (const fn of listeners) fn(state);
}

export function resetApp(appId) {
  delete state.apps[appId];
  saveNow();
}

export function resetEverything() {
  try { localStorage.removeItem(KEY); } catch { /* nothing to do */ }
}

addEventListener('pagehide', saveNow);
addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });
