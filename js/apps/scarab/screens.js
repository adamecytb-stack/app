import { el, icon, feedback, confetti, clear, toast } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { setBusy } from '../../core/update.js';
import { save } from '../../core/store.js';
import { LEVELS } from './levels.js';
import { createGame } from './engine.js';
import {
  s, levelUnlocked, levelRecord, recordLevel, recordArcade, recordDeath,
  totalStars, maxStars, nextLevelIndex,
} from './state.js';
import {
  sfx, startMusic, stopMusic, setAudioPrefs, resumeAudio, setIntensity,
} from './audio.js';

/* ── Shared bits ───────────────────────────────────────────── */

function starRow(count, size = 18) {
  return el('span', { class: 'stars' }, [0, 1, 2].map((i) => {
    const node = icon('star', size);
    node.classList.add('star');
    if (i < count) node.classList.add('star--on');
    return node;
  }));
}

function scarabMark(size = 64) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.innerHTML = `
    <g stroke="#1E9C7A" stroke-width="2.6" stroke-linecap="round">
      <path d="M14 18 8 14M14 24H7M14 30l-6 4M34 18l6-4M34 24h7M34 30l6 4"/>
    </g>
    <ellipse cx="24" cy="26" rx="11" ry="13" fill="#2FD6A8"/>
    <ellipse cx="24" cy="29" rx="11" ry="10" fill="#1E9C7A"/>
    <rect x="22.6" y="15" width="2.8" height="22" rx="1.4" fill="#F5C542"/>
    <ellipse cx="24" cy="13" rx="6" ry="4.4" fill="#F5C542"/>
    <circle cx="21.6" cy="12.4" r="1.4" fill="#0B0910"/>
    <circle cx="26.4" cy="12.4" r="1.4" fill="#0B0910"/>`;
  return svg;
}

/* ── Menu ──────────────────────────────────────────────────── */

export function menuScreen() {
  stopMusic();
  const stars = totalStars();

  return el('div', { class: 'screen sc-menu' }, [
    el('div', { class: 'sc-menu__top' }, [
      el('a', { class: 'iconbtn', href: '#/', 'aria-label': 'Back to Prism' }, icon('chevronLeft')),
      el('span', { class: 'grow' }),
      el('button', {
        class: 'iconbtn', 'aria-label': 'Settings',
        onclick: () => { sfx.menu(); settingsSheet(); },
      }, icon('sliders')),
    ]),

    el('div', { class: 'sc-hero' }, [
      el('div', { class: 'sc-hero__mark' }, scarabMark(96)),
      el('h1', { class: 'sc-hero__title', text: 'Scarab' }),
      el('p', { class: 'sc-hero__sub', text: 'Flick to slide. You do not stop until something stops you.' }),
    ]),

    el('div', { class: 'stack gap-10' }, [
      // The climb is the main event: go up, don't let the lava have you.
      el('button', {
        class: 'btn btn--primary sc-play',
        onclick: () => { sfx.menu(); resumeAudio(); router.go('/scarab/arcade'); },
      }, [icon('flame', 20), 'Endless climb']),

      el('button', {
        class: 'btn btn--ghost sc-arcade',
        onclick: () => { sfx.menu(); resumeAudio(); router.go(`/scarab/play/${LEVELS[nextLevelIndex()].id}`); },
      }, [icon('play', 20), `Continue — ${LEVELS[nextLevelIndex()].name}`]),

      el('button', {
        class: 'btn btn--ghost',
        onclick: () => { sfx.menu(); router.go('/scarab/levels'); },
      }, [icon('grid', 20), `Levels · ${stars}/${maxStars()} stars`]),
    ]),

    el('div', { class: 'sc-stats' }, [
      el('div', { class: 'sc-stat' }, [
        el('b', { class: 'num', text: s.arcade.best.toLocaleString() }),
        el('span', { text: 'Best climb' }),
      ]),
      el('div', { class: 'sc-stat' }, [
        el('b', { class: 'num', text: String(s.gold) }),
        el('span', { text: 'Gold' }),
      ]),
      el('div', { class: 'sc-stat' }, [
        el('b', { class: 'num', text: `${stars}` }),
        el('span', { text: 'Stars' }),
      ]),
    ]),

    el('p', { class: 'small center', style: { marginTop: 'auto', paddingTop: '18px' } , text: 'Swipe anywhere, or use the arrow keys.' }),
  ]);
}

function settingsSheet() {
  const sheetEl = document.getElementById('layer-sheet');
  if (!sheetEl) return;

  function row(label, get, set) {
    const knob = el('i');
    const toggle = el('span', { class: 'toggle', dataset: get() ? { on: '' } : {} }, knob);
    return el('button', {
      class: 'srow',
      onclick: () => {
        set(!get());
        if (get()) toggle.dataset.on = ''; else delete toggle.dataset.on;
        feedback('tap');
      },
    }, [el('span', { class: 'srow__label', text: label }), toggle]);
  }

  clear(sheetEl);
  const close = () => { clear(sheetEl); sheetEl.removeAttribute('data-open'); };
  sheetEl.append(
    el('div', { class: 'sheet__scrim', onclick: close }),
    el('div', { class: 'sheet__panel' }, [
      el('div', { class: 'sheet__grab' }),
      el('h3', { class: 'title', style: { marginBottom: '12px' }, text: 'Sound' }),
      el('div', { class: 'rows' }, [
        row('Music', () => s.settings.music, (v) => {
          s.settings.music = v; save(); setAudioPrefs({ music: v });
        }),
        row('Sound effects', () => s.settings.sfx, (v) => {
          s.settings.sfx = v; save(); setAudioPrefs({ sfx: v });
        }),
      ]),
      el('button', { class: 'btn btn--ghost', style: { marginTop: '16px' }, text: 'Done', onclick: close }),
    ]),
  );
  sheetEl.setAttribute('data-open', '');
}

/* ── Level select ──────────────────────────────────────────── */

export function levelsScreen() {
  stopMusic();
  return el('div', { class: 'screen' }, [
    el('div', { class: 'sc-menu__top' }, [
      el('a', { class: 'iconbtn', href: '#/scarab', 'aria-label': 'Back' }, icon('chevronLeft')),
      el('h2', { class: 'title', text: 'Levels' }),
      el('span', { class: 'grow' }),
      el('span', { class: 'chip chip--accent' }, [icon('star', 14), `${totalStars()}/${maxStars()}`]),
    ]),
    el('div', { class: 'sc-grid' }, LEVELS.map((level, i) => {
      const open = levelUnlocked(i);
      const rec = levelRecord(level.id);
      return el('button', {
        class: `sc-card${open ? '' : ' sc-card--locked'}`,
        onclick: () => {
          if (!open) { toast('Clear the level before this one first.', { icon: '🔒' }); return; }
          sfx.menu();
          resumeAudio();
          router.go(`/scarab/play/${level.id}`);
        },
      }, [
        el('div', { class: 'sc-card__n', text: String(i + 1) }),
        el('div', { class: 'sc-card__name', text: open ? level.name : 'Locked' }),
        open ? starRow(rec?.stars ?? 0, 14) : icon('lock', 16),
        open && el('div', { class: 'sc-card__par', text: `par ${level.par}` }),
      ]);
    })),
  ]);
}

/* ── Play ──────────────────────────────────────────────────── */

function overlay(children, cls = '') {
  return el('div', { class: `sc-over ${cls}` }, el('div', { class: 'sc-over__panel' }, children));
}

export function playScreen({ mode, levelId }) {
  const level = mode === 'level' ? LEVELS.find((l) => l.id === levelId) : null;
  if (mode === 'level' && !level) { router.go('/scarab/levels', { replace: true }); return false; }

  setBusy(true);
  setAudioPrefs({ music: s.settings.music, sfx: s.settings.sfx });
  resumeAudio();

  const canvas = el('canvas', { class: 'sc-canvas' });
  const hudCoins = el('span', { class: 'num', text: '0' });
  const hudRight = el('span', { class: 'num', text: '0' });
  const hudChain = el('div', { class: 'sc-chain' });
  const layer = el('div', { class: 'sc-layer' });

  const root = el('div', { class: 'sc-play-root' }, [
    canvas,
    el('div', { class: 'sc-hud' }, [
      el('button', {
        class: 'sc-hud__btn', 'aria-label': 'Pause',
        onclick: () => { sfx.menu(); pause(); },
      }, icon('sliders', 18)),
      el('span', { class: 'sc-hud__stat' }, [icon('star', 16), hudCoins]),
      el('span', { class: 'grow' }),
      el('span', { class: 'sc-hud__stat sc-hud__stat--right' }, [
        el('span', { class: 'sc-hud__label', text: mode === 'arcade' ? 'SCORE' : 'SLIDES' }),
        hudRight,
      ]),
    ]),
    hudChain,
    layer,
  ]);

  let game = null;
  let hintTimer = null;

  function newGame() {
    clear(layer);
    game?.stop();
    game = createGame({
      mode: mode === 'arcade' ? 'arcade' : 'level',
      level,
      canvas,
      onEvent: handle,
    });
    game.start();
    if (s.settings.music) startMusic();

    const hint = el('div', { class: 'sc-hint' }, [
      icon('arrowRight', 26),
      el('span', { text: 'Swipe to slide' }),
    ]);
    layer.append(hint);
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.remove(), 2600);
  }

  function handle(event, data) {
    if (event === 'hud') {
      hudCoins.textContent = mode === 'arcade'
        ? String(data.coins)
        : `${data.coins}/${data.pickups}`;
      hudRight.textContent = mode === 'arcade' ? String(data.score) : String(data.slides);
      if (data.chain >= 3) {
        hudChain.textContent = `×${Math.min(data.chain, 8)} chain`;
        hudChain.dataset.on = '';
      } else {
        delete hudChain.dataset.on;
      }
      return;
    }
    if (event === 'dead') { setTimeout(() => showDead(data), 650); return; }
    if (event === 'win') { setTimeout(() => showWin(data), 700); return; }
  }

  function pause() {
    if (!game || game.isPaused()) return;
    game.pause(true);
    stopMusic();
    clear(layer);
    layer.append(overlay([
      el('h2', { class: 'sc-over__title', text: 'Paused' }),
      el('button', {
        class: 'btn btn--primary',
        text: 'Resume',
        onclick: () => { sfx.menu(); clear(layer); game.pause(false); if (s.settings.music) startMusic(); },
      }),
      el('button', {
        class: 'btn btn--ghost', text: 'Restart',
        onclick: () => { sfx.menu(); newGame(); },
      }),
      el('button', {
        class: 'btn btn--quiet', text: 'Quit',
        onclick: () => { sfx.menu(); router.go(mode === 'arcade' ? '/scarab' : '/scarab/levels'); },
      }),
    ]));
  }

  function showDead(data) {
    stopMusic();
    recordDeath();
    const reasons = {
      spike: 'The spikes got you.',
      warden: 'A warden got you.',
      lava: 'The lava caught up.',
    };

    let extra = null;
    if (mode === 'arcade') {
      const { record } = recordArcade({ score: data.score, height: data.height, coins: data.coins });
      if (record) { sfx.record(); confetti({ count: 40, colors: ['#F5C542', '#2FD6A8', '#FFF0C0'] }); }
      extra = el('div', { class: 'sc-score' }, [
        el('div', { class: 'sc-score__big num', text: data.score.toLocaleString() }),
        el('div', { class: 'sc-score__row' }, [
          el('span', { text: `${data.height} m climbed` }),
          el('span', { text: `${data.coins} gold` }),
        ]),
        record
          ? el('div', { class: 'sc-record', text: 'New best!' })
          : el('div', { class: 'small', text: `Best ${s.arcade.best.toLocaleString()}` }),
      ]);
    }

    clear(layer);
    layer.append(overlay([
      el('h2', { class: 'sc-over__title sc-over__title--bad', text: reasons[data.reason] || 'Caught.' }),
      extra,
      el('button', {
        class: 'btn btn--primary', text: 'Again',
        onclick: () => { sfx.menu(); newGame(); },
      }),
      el('button', {
        class: 'btn btn--quiet', text: mode === 'arcade' ? 'Back' : 'Level select',
        onclick: () => { sfx.menu(); router.go(mode === 'arcade' ? '/scarab' : '/scarab/levels'); },
      }),
    ], 'sc-over--dead'));
  }

  function showWin(data) {
    stopMusic();
    const total = level.rows.join('').split('').filter((ch) => ch === 'o' || ch === '*').length;
    const result = recordLevel(level, { slides: data.slides, coins: data.coins, totalCoins: total });
    confetti({ count: 60, colors: ['#F5C542', '#2FD6A8', '#FFF0C0', '#8DE9E0'] });

    const row = starRow(0, 30);
    const idx = LEVELS.findIndex((l) => l.id === level.id);
    const next = LEVELS[idx + 1];

    clear(layer);
    layer.append(overlay([
      el('h2', { class: 'sc-over__title', text: 'Cleared' }),
      row,
      el('div', { class: 'sc-over__rows' }, [
        el('div', { class: 'sc-over__line' }, [
          el('span', { text: 'Gold' }), el('b', { text: `${data.coins}/${total}` }),
        ]),
        el('div', { class: 'sc-over__line' }, [
          el('span', { text: 'Slides' }), el('b', { text: `${data.slides} (par ${level.par})` }),
        ]),
      ]),
      next
        ? el('button', {
          class: 'btn btn--primary', text: `Next — ${next.name}`,
          onclick: () => { sfx.menu(); router.go(`/scarab/play/${next.id}`); },
        })
        : el('div', { class: 'sc-record', text: 'Every level cleared.' }),
      el('button', {
        class: 'btn btn--ghost', text: 'Replay',
        onclick: () => { sfx.menu(); newGame(); },
      }),
      el('button', {
        class: 'btn btn--quiet', text: 'Level select',
        onclick: () => { sfx.menu(); router.go('/scarab/levels'); },
      }),
    ]));

    // Stars land one at a time so each one gets its own chime.
    const stars = row.querySelectorAll('.star');
    for (let i = 0; i < result.stars; i += 1) {
      setTimeout(() => {
        stars[i].classList.add('star--on', 'star--pop');
        sfx.star(i);
      }, 260 + i * 330);
    }
  }

  router.onLeave(() => {
    setBusy(false);
    clearTimeout(hintTimer);
    game?.stop();
    stopMusic();
    setIntensity(0);
  });

  // The canvas needs layout before it can size itself.
  requestAnimationFrame(() => { newGame(); });

  return root;
}
