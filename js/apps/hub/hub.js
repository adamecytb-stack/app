import { el, icon, toast, feedback } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { APPS, PLANNED } from '../../core/registry.js';
import { state, save } from '../../core/store.js';
import { currentBuild, checkForUpdates } from '../../core/update.js';
import { summary as gleamSummary } from '../gleam/state.js';

const SUMMARIES = { gleam: gleamSummary };

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  if (h < 22) return 'Evening';
  return 'Late one';
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIOS() {
  return /iP(hone|ad|od)/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function markSvg(app) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.innerHTML = app.mark;
  return svg;
}

function appCard(app) {
  const info = SUMMARIES[app.id]?.() ?? null;

  const stats = info && info.onboarded
    ? [
        el('div', { class: 'appcard__stat' }, [
          el('b', { class: 'num', text: String(info.streak) }),
          el('span', { text: info.streak === 1 ? 'day streak' : 'day streak' }),
        ]),
        el('div', { class: 'appcard__stat' }, [
          el('b', { class: 'num', text: `${info.xpToday}/${info.goal}` }),
          el('span', { text: 'xp today' }),
        ]),
        el('div', { class: 'appcard__stat' }, [
          el('b', { class: 'num', text: `${info.done}/${info.total}` }),
          el('span', { text: 'lessons' }),
        ]),
      ]
    : [
        el('div', { class: 'appcard__stat' }, [
          el('b', { text: '2 min' }),
          el('span', { text: 'to set up' }),
        ]),
      ];

  return el('button', {
    class: 'appcard',
    onclick: () => {
      feedback('tap');
      state.hub.lastApp = app.id;
      state.hub.visits += 1;
      save();
      router.go(app.home);
    },
  }, [
    info?.goalMet && el('div', { class: 'appcard__ring' }, [el('i'), 'goal met']),
    el('div', { class: 'appcard__head' }, [
      el('div', { class: 'appcard__icon' }, markSvg(app)),
      el('div', {}, [
        el('div', { class: 'appcard__name', text: app.name }),
        el('div', { class: 'appcard__tag', text: app.tagline }),
      ]),
    ]),
    el('p', { class: 'appcard__blurb', text: app.blurb }),
    el('div', { class: 'appcard__stats' }, [
      ...stats,
      el('div', { class: 'appcard__go' }, icon('arrowRight')),
    ]),
  ]);
}

function installHint() {
  if (isStandalone() || state.hub.installHintDismissed) return null;
  if (!isIOS()) return null;

  return el('div', { class: 'install' }, [
    el('div', { class: 'install__title' }, [icon('sparkle'), 'Put Prism on your Home Screen']),
    el('p', { class: 'small', text: 'It runs full screen, works offline, and updates itself — you never reinstall it.' }),
    el('ol', {}, [
      el('li', { html: 'Tap the <kbd>Share</kbd> button in Safari' }),
      el('li', { html: 'Choose <kbd>Add to Home Screen</kbd>' }),
      el('li', { html: 'Open it from the icon, not from Safari' }),
    ]),
    el('button', {
      class: 'btn btn--quiet',
      style: { marginTop: '8px' },
      text: 'Got it',
      onclick: (e) => {
        state.hub.installHintDismissed = true;
        save();
        e.target.closest('.install').remove();
      },
    }),
  ]);
}

function footer() {
  const build = currentBuild() || 'dev';
  return el('div', { class: 'hub__foot' }, [
    el('span', {}, [el('code', { text: `build ${build}` })]),
    el('button', {
      onclick: async (event) => {
        const btn = event.currentTarget;
        btn.disabled = true;
        await checkForUpdates({ force: true, announce: true });
        btn.disabled = false;
      },
    }, [icon('refresh'), 'Check for updates']),
  ]);
}

function hubScreen() {
  const now = new Date();
  const dateLine = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return el('div', { class: 'screen' }, [
    el('div', { class: 'hub__top' }, [
      el('div', { class: 'hub__mark' }, prismMark()),
      el('div', { class: 'hub__wordmark', text: 'Prism' }),
    ]),
    el('div', { class: 'stagger' }, [
      el('h1', { class: 'hub__greet', html: `${greeting()}. <em>What are we sharpening?</em>` }),
      el('div', { class: 'hub__date', text: dateLine }),
      ...APPS.map(appCard),
      el('div', { class: 'hub__label', text: 'On the workbench' }),
      el('div', { class: 'shelf' }, PLANNED.map((p) => el('button', {
        class: 'shelf__item',
        onclick: () => toast(`${p.name} isn't built yet — ask Claude to make it next.`, { icon: '◷' }),
      }, [
        el('div', { class: 'shelf__glyph', html: p.mark }),
        el('div', {}, [
          el('div', { class: 'shelf__name', text: p.name }),
          el('div', { class: 'shelf__tag', html: p.tagline }),
        ]),
      ]))),
      installHint(),
      footer(),
    ]),
  ]);
}

function prismMark() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');
  svg.innerHTML = `
    <path d="M24 6 42 38H6Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M2 24h13" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <g stroke-width="2.6" stroke-linecap="round">
      <path d="M31 22h15" stroke="#FFC763"/>
      <path d="M31.5 27h14" stroke="#4FD8A8"/>
      <path d="M32 32h13" stroke="#63C6F5"/>
      <path d="M32.5 37h12" stroke="#9A86FF"/>
    </g>`;
  return svg;
}

export function registerHub() {
  router.route('/', () => hubScreen());
}
