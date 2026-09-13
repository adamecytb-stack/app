/* Prism service worker.
 *
 * The BUILD constant below is rewritten by tools/build.mjs at deploy time.
 * Changing it changes these bytes, which is what makes the browser notice a
 * new worker, which is what makes the installed home-screen app update itself.
 * Never hand-edit it to a value you don't intend to ship.
 */
const BUILD = 'dev';

const CACHE = `prism-${BUILD}`;
const OFFLINE_FALLBACK = './index.html';

/* Everything needed to cold-start the app with no network. Kept in sync by
 * tools/build.mjs (`node tools/build.mjs --check` fails if it drifts). */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/fonts.css',
  './css/tokens.css',
  './css/base.css',
  './css/hub.css',
  './css/gleam.css',
  './assets/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/fonts/fraunces-1.woff2',
  './assets/fonts/fraunces-2.woff2',
  './assets/fonts/fraunces-3.woff2',
  './assets/fonts/schibstedgrotesk-4.woff2',
  './assets/fonts/schibstedgrotesk-5.woff2',
  './js/main.js',
  './js/core/router.js',
  './js/core/store.js',
  './js/core/ui.js',
  './js/core/update.js',
  './js/core/registry.js',
  './js/apps/hub/hub.js',
  './js/apps/gleam/index.js',
  './js/apps/gleam/state.js',
  './js/apps/gleam/onboarding.js',
  './js/apps/gleam/learn.js',
  './js/apps/gleam/lesson.js',
  './js/apps/gleam/practice.js',
  './js/apps/gleam/league.js',
  './js/apps/gleam/profile.js',
  './js/apps/gleam/ai.js',
  './data/gleam/courses.js',
  './data/gleam/scenarios.js',
  './data/gleam/courses/small-talk.js',
  './data/gleam/courses/conversation-flow.js',
  './data/gleam/courses/charisma.js',
  './data/gleam/courses/storytelling.js',
  './data/gleam/courses/dating.js',
  './data/gleam/courses/reading-people.js',
  './data/gleam/courses/groups.js',
  './data/gleam/courses/hard-conversations.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // addAll is all-or-nothing; a single 404 would leave the app uninstallable,
    // so precache entries individually and let stragglers fill in at runtime.
    await Promise.all(PRECACHE.map(async (url) => {
      try {
        const res = await fetch(new Request(url, { cache: 'reload' }));
        if (res.ok) await cache.put(url, res);
      } catch { /* offline during install; runtime cache will pick it up */ }
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('prism-') && k !== CACHE).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch { /* unsupported */ }
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') self.skipWaiting();
  if (data.type === 'GET_BUILD') event.source?.postMessage({ type: 'BUILD', build: BUILD });
});

/* Navigations: network first, so a fresh deploy lands the moment we're online.
 * Assets: cache first within a build (a build's bytes never change), revalidated
 * in the background. A new build gets a new cache, so nothing goes stale. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('no-sw')) return;

  // The freshness probe must always hit the network.
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(req).catch(() => caches.match(req).then((r) => r || new Response('{}', { headers: { 'content-type': 'application/json' } }))));
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        const res = preload || await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(OFFLINE_FALLBACK, res.clone());
        return res;
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match(OFFLINE_FALLBACK)) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return hit || (await network) || Response.error();
  })());
});
