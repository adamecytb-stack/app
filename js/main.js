import { slice, save } from './core/store.js';
import { setFeedbackPrefs } from './core/ui.js';
import * as router from './core/router.js';
import { initUpdates } from './core/update.js';
import { applyAccent, findApp } from './core/registry.js';
import { registerHub } from './apps/hub/hub.js';
import { registerGleam } from './apps/gleam/index.js';

/** Suite-wide preferences, shared by every app. */
export const prefs = slice('_prefs', {
  sound: true,
  haptics: true,
  aiKey: '',
  aiModel: 'claude-sonnet-5',
});

export function savePrefs() {
  setFeedbackPrefs(prefs);
  save();
}

setFeedbackPrefs(prefs);

registerHub();
registerGleam();

const mount = document.getElementById('app');

router.start(mount, {
  change(here) {
    const appId = here.split('/')[1] || null;
    applyAccent(findApp(appId));
    document.title = appId ? `${findApp(appId)?.name ?? 'Prism'} — Prism` : 'Prism';
  },
});

initUpdates();

/* iOS standalone: stop rubber-band scroll from making the shell feel like a
   web page, while leaving real scroll containers alone. */
document.addEventListener('touchmove', (event) => {
  if (event.touches.length > 1) event.preventDefault();
}, { passive: false });
