/* Scarab's routes. */

import * as router from '../../core/router.js';
import { s } from './state.js';
import { setAudioPrefs } from './audio.js';
import { menuScreen, levelsScreen, playScreen } from './screens.js';

export function registerScarab() {
  setAudioPrefs({ music: s.settings.music, sfx: s.settings.sfx });

  router.route('/scarab', () => menuScreen());
  router.route('/scarab/levels', () => levelsScreen());
  router.route('/scarab/arcade', () => playScreen({ mode: 'arcade' }));
  router.route('/scarab/play/:id', (p) => playScreen({ mode: 'level', levelId: p.id }));
}
