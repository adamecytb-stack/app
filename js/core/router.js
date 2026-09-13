/* Hash routing — the only kind that survives GitHub Pages without a 404
 * rewrite, and the only kind that survives an iOS standalone relaunch cleanly. */

const routes = [];
let mount = null;
let current = null;
let onChange = null;

function compile(pattern) {
  const keys = [];
  const source = pattern
    .replace(/\/:([A-Za-z0-9_]+)/g, (_, key) => { keys.push(key); return '/([^/]+)'; })
    .replace(/\*$/, '(?:.*)');
  return { re: new RegExp(`^${source}/?$`), keys };
}

export function route(pattern, handler) {
  routes.push({ ...compile(pattern), pattern, handler });
}

export function path() {
  const hash = location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
}

export function go(to, { replace = false } = {}) {
  const target = `#${to.startsWith('/') ? to : `/${to}`}`;
  if (location.hash === target) { render(); return; }
  if (replace) location.replace(target);
  else location.hash = target;
}

export function back(fallback = '/') {
  if (history.length > 1 && document.referrer !== '') history.back();
  else go(fallback, { replace: true });
}

/** Screens can register cleanup that runs when they are replaced. */
let teardown = null;
export function onLeave(fn) { teardown = fn; }

export function render() {
  const here = path();
  if (teardown) { try { teardown(); } catch (err) { console.error(err); } teardown = null; }

  for (const r of routes) {
    const match = here.match(r.re);
    if (!match) continue;
    const params = {};
    r.keys.forEach((key, i) => { params[key] = decodeURIComponent(match[i + 1]); });

    let view;
    try {
      view = r.handler(params);
    } catch (err) {
      console.error('[prism] route failed', here, err);
      view = errorScreen(err);
    }
    if (view === false) return; // handler redirected

    current = here;
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    if (view) mount.append(view);
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    onChange?.(here);
    return;
  }

  go('/', { replace: true });
}

function errorScreen(err) {
  const node = document.createElement('div');
  node.className = 'screen';
  node.innerHTML = `
    <h1 class="display" style="margin-top:18vh">Something broke.</h1>
    <p class="body" style="margin-top:12px">${String(err && err.message ? err.message : err)}</p>
    <a class="btn btn--ghost" style="margin-top:24px" href="#/">Back to the hub</a>`;
  return node;
}

export function start(mountNode, { change = null } = {}) {
  mount = mountNode;
  onChange = change;
  addEventListener('hashchange', render);
  render();
}

export function currentPath() { return current; }
