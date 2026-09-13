/* Keeps a home-screen install current without the user ever reinstalling it.
 *
 * Three things conspire to make that work:
 *   1. the service worker checks itself on launch, on focus, and hourly
 *   2. version.json is polled with no-store, catching the case where an
 *      aggressive HTTP cache hides the new sw.js from us
 *   3. a waiting worker is activated immediately and the page reloads —
 *      silently when the user is idle, behind a tap when they're mid-lesson
 */
import { toast } from './ui.js';

const MIN_CHECK_INTERVAL = 60_000;
const POLL_INTERVAL = 15 * 60_000;

let registration = null;
let lastCheck = 0;
let reloading = false;
let runningBuild = null;

/* Screens set this while something would be lost by a reload mid-flight. */
let busy = false;
export function setBusy(value) { busy = !!value; }

export function currentBuild() { return runningBuild; }

async function fetchBuild() {
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.build || null;
  } catch {
    return null;
  }
}

function applyUpdate(worker) {
  if (!worker) return;
  worker.postMessage({ type: 'SKIP_WAITING' });
}

function offerUpdate(worker) {
  if (!worker || reloading) return;

  if (!busy) {
    // Nothing to lose — swap it in without bothering anyone.
    toast('Updating to the latest version…', { icon: '↑', duration: 2200 });
    setTimeout(() => applyUpdate(worker), 400);
    return;
  }

  toast('A new version is ready', {
    icon: '✦',
    duration: 0,
    action: { label: 'Update', onClick: () => applyUpdate(worker) },
  });
}

function watchWorker(worker) {
  if (!worker) return;
  if (worker.state === 'installed' && navigator.serviceWorker.controller) {
    offerUpdate(worker);
    return;
  }
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(worker);
  });
}

export async function checkForUpdates({ force = false, announce = false } = {}) {
  if (!registration) {
    if (announce) toast('Updates need a served page (not file://)', { icon: '!' });
    return false;
  }
  const now = Date.now();
  if (!force && now - lastCheck < MIN_CHECK_INTERVAL) return false;
  lastCheck = now;

  try {
    await registration.update();
  } catch { /* offline; try again next time */ }

  if (registration.waiting) {
    offerUpdate(registration.waiting);
    return true;
  }

  const latest = await fetchBuild();
  if (latest && runningBuild && latest !== runningBuild) {
    // sw.js itself may be served from a stale HTTP cache. Bust it directly.
    try {
      await fetch(`./sw.js?t=${Date.now()}`, { cache: 'reload' });
      await registration.update();
    } catch { /* offline */ }
    if (registration.waiting) {
      offerUpdate(registration.waiting);
      return true;
    }
  }

  if (announce) {
    toast(latest && latest === runningBuild ? "You're on the latest version" : 'No update found yet', { icon: '✓' });
  }
  return false;
}

export async function initUpdates() {
  runningBuild = await fetchBuild();

  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;

  try {
    registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
  } catch (err) {
    console.warn('[prism] service worker registration failed', err);
    return;
  }

  if (registration.waiting && navigator.serviceWorker.controller) offerUpdate(registration.waiting);
  watchWorker(registration.installing);
  registration.addEventListener('updatefound', () => watchWorker(registration.installing));

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdates();
  });
  window.addEventListener('online', () => checkForUpdates({ force: true }));
  setInterval(() => checkForUpdates(), POLL_INTERVAL);

  // Give the first paint room to breathe before hitting the network again.
  setTimeout(() => checkForUpdates({ force: true }), 3_000);
}
