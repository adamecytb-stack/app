/* Clean-up service worker.
 *
 * This address used to serve the Prism app, which installed an offline service worker (sw.js)
 * in visitors' browsers. When a browser checks that worker for updates it now gets this file,
 * which deletes Prism's offline caches and unregisters itself, so the backtest dashboard is
 * always loaded fresh from the network. The dashboard itself never registers a service worker.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('prism-')).map((k) => caches.delete(k)));
    await self.registration.unregister();
  })());
});
