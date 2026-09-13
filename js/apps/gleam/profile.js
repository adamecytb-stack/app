/* Profile: stats, achievements, activity, and every setting in the suite. */

import { el, icon, feedback, toast, sheet, setFeedbackPrefs } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { save, exportBackup, importBackup, resetApp } from '../../core/store.js';
import { currentBuild, checkForUpdates } from '../../core/update.js';
import { prefs, savePrefs } from '../../main.js';
import { g, ACHIEVEMENTS, dayKey, allLessons, rollDay } from './state.js';
import { tabScreen } from './index.js';
import { MODELS, hasKey, testKey, AiError } from './ai.js';

/* ── Pieces ────────────────────────────────────────────────── */

function header() {
  const name = g.profile.name || 'You';
  const since = g.profile.committedAt ? new Date(g.profile.committedAt) : new Date();
  return el('div', { class: 'prof' }, [
    el('div', { class: 'prof__avatar', text: name.trim().charAt(0).toUpperCase() || '?' }),
    el('div', { class: 'prof__name', text: name }),
    el('div', { class: 'prof__since', text: `Committed ${since.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}` }),
  ]);
}

function statTile(iconName, color, value, label) {
  const glyph = icon(iconName, 21);
  glyph.style.color = color;
  return el('div', { class: 'stat' }, [
    el('span', { class: 'stat__icon' }, glyph),
    el('div', {}, [el('b', { class: 'num', text: value }), el('span', { text: label })]),
  ]);
}

function stats() {
  const lessonsTotal = allLessons().length;
  const accuracy = g.stats.exercisesDone ? Math.round((g.stats.correct / g.stats.exercisesDone) * 100) : 0;
  return el('div', { class: 'statgrid' }, [
    statTile('flame', 'var(--flame-b)', String(g.streak), 'Day streak'),
    statTile('bolt', 'var(--ember)', g.xp.toLocaleString(), 'Total XP'),
    statTile('book', 'var(--mint)', `${g.stats.lessonsDone}/${lessonsTotal}`, 'Lessons'),
    statTile('target', 'var(--sky)', `${accuracy}%`, 'Accuracy'),
    statTile('chat', 'var(--iris)', String(g.stats.practiceRuns), 'Practice'),
    statTile('crown', 'var(--ember-300)', String(g.longest), 'Best streak'),
  ]);
}

/* Twelve weeks of activity, most recent week last. */
function heatmap() {
  const cells = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 83 - ((today.getDay() + 6) % 7));

  const max = Math.max(g.profile.dailyGoalXp, ...Object.values(g.history || {}), 1);

  for (let i = 0; i < 84; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const xp = g.history?.[dayKey(d)] ?? 0;
    const level = xp === 0 ? 0 : Math.min(4, Math.ceil((xp / max) * 4));
    cells.push(el('i', { dataset: { l: String(level) }, title: `${dayKey(d)} · ${xp} XP` }));
  }

  return el('div', {}, [
    el('div', { class: 'heat' }, cells),
    el('div', { class: 'heat__legend' }, [
      el('span', { text: 'Less' }),
      ...[0, 1, 2, 3, 4].map((l) => el('i', { dataset: { l: String(l) } })),
      el('span', { text: 'More' }),
    ]),
  ]);
}

function badges() {
  return el('div', { class: 'badges' }, ACHIEVEMENTS.map((a) => {
    const earned = Boolean(g.achievements[a.id]);
    return el('div', { class: `badge${earned ? '' : ' badge--locked'}` }, [
      el('div', { class: 'badge__disc' }, icon(earned ? a.icon : 'lock', 24)),
      el('b', { text: a.name }),
      el('span', { text: a.note }),
    ]);
  }));
}

/* ── Settings rows ─────────────────────────────────────────── */

function toggleRow(iconName, label, get, set) {
  const knob = el('i');
  const toggle = el('span', { class: 'toggle', dataset: get() ? { on: '' } : {} }, knob);
  return el('button', {
    class: 'srow',
    onclick: () => {
      set(!get());
      if (get()) toggle.dataset.on = ''; else delete toggle.dataset.on;
      feedback('tap');
    },
  }, [
    el('span', { class: 'srow__icon' }, icon(iconName)),
    el('span', { class: 'srow__label', text: label }),
    toggle,
  ]);
}

function actionRow(iconName, label, value, onClick, { danger = false } = {}) {
  return el('button', { class: `srow${danger ? ' srow--danger' : ''}`, onclick: onClick }, [
    el('span', { class: 'srow__icon' }, icon(iconName)),
    el('span', { class: 'srow__label', text: label }),
    value && el('span', { class: 'srow__value', text: value }),
    el('span', { class: 'srow__icon' }, icon('chevronRight')),
  ]);
}

function goalSheet() {
  sheet((close) => el('div', { class: 'stack gap-12' }, [
    el('h3', { class: 'title', text: 'Daily goal' }),
    el('div', { class: 'opts' }, [
      { xp: 20, label: 'Steady', sub: '20 XP · about 1 lesson' },
      { xp: 30, label: 'Regular', sub: '30 XP · about 2 lessons' },
      { xp: 50, label: 'Serious', sub: '50 XP · about 3 lessons' },
      { xp: 80, label: 'Obsessive', sub: '80 XP · about 5 lessons' },
    ].map((option) => el('button', {
      class: 'opt',
      dataset: g.profile.dailyGoalXp === option.xp ? { on: '' } : {},
      onclick: () => {
        g.profile.dailyGoalXp = option.xp;
        save();
        feedback('tap');
        close();
        router.render();
      },
    }, [
      el('span', { class: 'opt__text' }, [option.label, el('span', { class: 'opt__sub', text: option.sub })]),
      el('span', { class: 'opt__tick' }, icon('check')),
    ]))),
  ]));
}

function keySheet() {
  sheet((close) => {
    const input = el('input', {
      type: 'password',
      placeholder: 'sk-ant-api03-…',
      value: prefs.aiKey || '',
      autocomplete: 'off',
      spellcheck: 'false',
    });

    const status = el('p', { class: 'small' });

    const modelPicker = el('div', { class: 'opts' }, MODELS.map((m) => el('button', {
      class: 'opt',
      dataset: (prefs.aiModel || 'claude-opus-5') === m.id ? { on: '' } : {},
      onclick: (event) => {
        prefs.aiModel = m.id;
        savePrefs();
        modelPicker.querySelectorAll('.opt').forEach((n) => delete n.dataset.on);
        event.currentTarget.dataset.on = '';
        feedback('tap');
      },
    }, [
      el('span', { class: 'opt__text' }, [m.name, el('span', { class: 'opt__sub', text: m.note })]),
      el('span', { class: 'opt__tick' }, icon('check')),
    ])));

    return el('div', { class: 'stack gap-14' }, [
      el('h3', { class: 'title', text: 'Freeform practice' }),
      el('p', { class: 'body', text: 'Paste an Anthropic API key to unlock open-ended roleplay and written feedback. Everything else in Gleam works without one.' }),

      el('div', { class: 'notice' }, [
        el('b', { text: 'Where this key goes. ' }),
        'It is stored in this browser only and sent straight to api.anthropic.com from your device — there is no server in between. Anyone with access to this device can read it, so use a key you are happy to rotate.',
      ]),

      el('div', { class: 'keyfield' }, [input]),
      status,

      el('div', { class: 'section__title', style: { marginTop: '4px' }, text: 'Model' }),
      modelPicker,

      el('button', {
        class: 'btn btn--primary',
        text: 'Save and test',
        onclick: async (event) => {
          const button = event.currentTarget;
          prefs.aiKey = input.value.trim();
          savePrefs();
          if (!prefs.aiKey) { close(); router.render(); return; }
          button.disabled = true;
          status.textContent = 'Testing…';
          try {
            await testKey();
            status.textContent = 'Working. Freeform practice is unlocked.';
            feedback('correct');
            setTimeout(() => { close(); router.render(); }, 700);
          } catch (err) {
            status.textContent = err instanceof AiError ? err.message : 'That did not work.';
            feedback('wrong');
            button.disabled = false;
          }
        },
      }),
      prefs.aiKey && el('button', {
        class: 'btn btn--quiet',
        text: 'Remove key',
        onclick: () => { prefs.aiKey = ''; savePrefs(); close(); router.render(); toast('Key removed.', { icon: '✓' }); },
      }),
    ]);
  });
}

function exportData() {
  const blob = new Blob([exportBackup()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: `prism-backup-${dayKey()}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Backup saved to your downloads.', { icon: '↓' });
}

function importData() {
  const input = el('input', { type: 'file', accept: 'application/json,.json' });
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      importBackup(await file.text());
      toast('Backup restored.', { icon: '✓' });
      router.go('/gleam/learn');
      router.render();
    } catch (err) {
      toast(err.message || 'That file could not be read.', { icon: '!' });
    }
  });
  input.click();
}

function confirmReset() {
  sheet((close) => el('div', { class: 'stack gap-12' }, [
    el('h3', { class: 'title', text: 'Erase Gleam progress?' }),
    el('p', { class: 'body', text: 'Your streak, XP, lessons, league and achievements all go. Onboarding starts again. Other apps in Prism are untouched, and this cannot be undone.' }),
    el('button', {
      class: 'btn btn--rose',
      text: 'Erase everything',
      onclick: () => { resetApp('gleam'); close(); location.hash = '#/'; location.reload(); },
    }),
    el('button', { class: 'btn btn--quiet', text: 'Keep it', onclick: close }),
  ]));
}

/* ── Screen ────────────────────────────────────────────────── */

export function profileScreen() {
  rollDay();
  const build = currentBuild() || 'dev';

  return tabScreen('profile', [
    el('div', { class: 'stack', style: { padding: '0 var(--gutter)' } }, [
      header(),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: 'Stats' }),
        stats(),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: 'Last twelve weeks' }),
        heatmap(),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: `Achievements · ${Object.keys(g.achievements).length}/${ACHIEVEMENTS.length}` }),
        badges(),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: 'Practice' }),
        el('div', { class: 'rows' }, [
          actionRow('target', 'Daily goal', `${g.profile.dailyGoalXp} XP`, () => { feedback('tap'); goalSheet(); }),
          toggleRow('heart', 'Hearts (lose one per mistake)', () => g.settings.hearts, (v) => { g.settings.hearts = v; save(); }),
          actionRow('sparkle', 'AI practice partner', hasKey() ? 'On' : 'Off', () => { feedback('tap'); keySheet(); }),
        ]),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: 'App' }),
        el('div', { class: 'rows' }, [
          toggleRow('bolt', 'Sound', () => prefs.sound, (v) => { prefs.sound = v; savePrefs(); setFeedbackPrefs(prefs); }),
          toggleRow('shield', 'Haptics', () => prefs.haptics, (v) => { prefs.haptics = v; savePrefs(); setFeedbackPrefs(prefs); }),
          actionRow('download', 'Export a backup', null, () => { feedback('tap'); exportData(); }),
          actionRow('upload', 'Restore from a backup', null, () => { feedback('tap'); importData(); }),
        ]),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'section__title', text: 'Updates' }),
        el('div', { class: 'rows' }, [
          actionRow('refresh', 'Check for updates', build, async () => {
            feedback('tap');
            await checkForUpdates({ force: true, announce: true });
          }),
        ]),
        el('p', { class: 'small', style: { marginTop: '10px' }, text: 'Prism updates itself in the background whenever you open it online. You never need to remove it from your Home Screen and add it again.' }),
      ]),

      el('section', { class: 'section' }, [
        el('div', { class: 'rows' }, [
          actionRow('x', 'Erase Gleam progress', null, () => { feedback('tap'); confirmReset(); }, { danger: true }),
        ]),
      ]),

      el('p', {
        class: 'small center',
        style: { paddingBottom: '10px' },
        text: 'Everything here lives in this browser. No account, no server, no analytics.',
      }),
    ]),
  ]);
}
