/* Practice conversations — scripted by default, freeform when a key is set. */

import { el, icon, feedback, confetti, clear, toast, sheet } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { setBusy } from '../../core/update.js';
import { SCENARIOS, scenarioById, DIMENSIONS } from '../../../data/gleam/scenarios.js';
import { g, recordPractice } from './state.js';
import { save } from '../../core/store.js';
import { tabScreen } from './index.js';
import { hasKey, roleplayTurn, coachReport, AiError } from './ai.js';

/* ── Scenario list ─────────────────────────────────────────── */

function scenarioCard(scenario) {
  const record = g.practice[scenario.id];
  return el('button', {
    class: 'scncard',
    onclick: () => { feedback('tap'); router.go(`/gleam/practice/${scenario.id}`); },
  }, [
    el('div', { class: 'scncard__top' }, [
      el('div', { class: 'avatar avatar--npc', text: scenario.persona.initial }),
      el('div', {}, [
        el('div', { class: 'scncard__title', text: scenario.title }),
        el('div', { class: 'scncard__who', text: `${scenario.persona.name} · ${scenario.persona.note}` }),
      ]),
    ]),
    el('p', { class: 'scncard__set', text: scenario.setting }),
    el('div', { class: 'scncard__foot' }, [
      el('span', { class: 'dots' }, [1, 2, 3].map((n) => el('i', { dataset: n <= scenario.difficulty ? { on: '' } : {} }))),
      el('span', { class: 'small', text: `${scenario.turns.length} exchanges` }),
      record && el('span', { class: 'scncard__best num', text: `Best ${Math.round(record.best * 100)}%` }),
    ]),
  ]);
}

export function practiceScreen() {
  return tabScreen('practice', [
    el('div', { class: 'stack', style: { padding: '0 var(--gutter)' } }, [
      el('h1', { class: 'display display--sm', text: 'Practice' }),
      el('p', { class: 'body', style: { margin: '6px 0 20px' }, text: hasKey()
        ? 'Pick a situation. Choose your lines, or switch on freeform to type your own and get AI feedback.'
        : 'Pick a situation and choose what you would actually say. Every line is scored on warmth, curiosity, confidence and clarity.' }),
      el('div', { class: 'scn' }, SCENARIOS.map(scenarioCard)),
      !hasKey() && el('div', { class: 'notice', style: { marginTop: '18px' } }, [
        el('b', { text: 'Want an open-ended partner? ' }),
        'Add your own Anthropic API key in Profile → Settings and you can type freely instead of picking from four options.',
      ]),
    ]),
  ]);
}

/* ── Scoring ───────────────────────────────────────────────── */

function scoreFromPicks(picks) {
  const totals = { w: 0, c: 0, f: 0, k: 0 };
  for (const pick of picks) for (const key of Object.keys(totals)) totals[key] += pick.s[key] ?? 0;
  const n = Math.max(1, picks.length);
  // Each dimension runs -1..2 per turn, so shift and divide to land in 0..1.
  const out = {};
  for (const key of Object.keys(totals)) out[key] = Math.max(0, Math.min(1, (totals[key] + n) / (n * 3)));
  return out;
}

function overall(scores) {
  const values = Object.values(scores);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function barColor(value) {
  if (value >= 0.72) return 'linear-gradient(90deg,#2C9C74,#4FD8A8)';
  if (value >= 0.45) return 'linear-gradient(90deg,#DC8709,#FFC763)';
  return 'linear-gradient(90deg,#C4444F,#FF6B7A)';
}

function reportView(scenario, scores, { extra = null, ai = false } = {}) {
  const total = overall(scores);
  const xpEvents = recordPractice(scenario.id, { score: total, ai });
  const badges = xpEvents.filter((e) => e.type === 'achievement');

  if (total >= 0.75) confetti({ count: 46 });
  feedback(total >= 0.75 ? 'complete' : 'tap');

  const verdict = total >= 0.82 ? 'You ran that well.'
    : total >= 0.62 ? 'Solid, with one clear gap.'
      : total >= 0.42 ? 'Workable. You left a lot on the table.'
        : 'That one got away from you.';

  return el('div', { class: 'stack gap-20', style: { padding: '10px var(--gutter) 30px' } }, [
    el('div', { class: 'center' }, [
      (() => { const i = icon(total >= 0.75 ? 'star' : 'target', 70); i.style.color = 'var(--ember)'; i.style.margin = '0 auto 14px'; return i; })(),
      el('h2', { class: 'display', text: verdict }),
      el('p', { class: 'body', style: { marginTop: '6px' }, text: `${scenario.title} · ${Math.round(total * 100)}%` }),
    ]),

    el('div', { class: 'dims' }, DIMENSIONS.map((dim) => {
      const value = scores[dim.key];
      const fill = el('div', { class: 'dim__fill', style: { background: barColor(value) } });
      requestAnimationFrame(() => setTimeout(() => { fill.style.width = `${value * 100}%`; }, 160));
      return el('div', {}, [
        el('div', { class: 'dim__top' }, [
          el('span', { class: 'dim__name', text: dim.name }),
          el('span', { class: 'dim__note', text: dim.note }),
          el('span', { class: 'dim__pct num', text: `${Math.round(value * 100)}` }),
        ]),
        el('div', { class: 'dim__track' }, fill),
      ]);
    })),

    extra,

    ...badges.map((b) => el('div', { class: 'eventcard' }, [
      el('span', { class: 'eventcard__icon' }, icon(b.achievement.icon)),
      el('div', {}, [el('b', { text: b.achievement.name }), el('span', { text: b.achievement.note })]),
    ])),

    el('div', { class: 'stack gap-8' }, [
      el('button', {
        class: 'btn btn--primary',
        text: 'Run it again',
        onclick: () => { feedback('tap'); router.render(); },
      }),
      el('button', {
        class: 'btn btn--ghost',
        text: 'Back to scenarios',
        onclick: () => { feedback('tap'); router.go('/gleam/practice'); },
      }),
    ]),
  ]);
}

/* ── Scripted run ──────────────────────────────────────────── */

function bubble(role, text, { stage = false } = {}) {
  return el('div', { class: `msg msg--${stage ? 'stage' : role}` }, el('div', { class: 'msg__bubble', text }));
}

function typingBubble() {
  return el('div', { class: 'msg msg--npc' }, el('div', { class: 'msg__bubble' },
    el('span', { class: 'typing' }, [el('i'), el('i'), el('i')])));
}

function scriptedRun(scenario, root) {
  const chat = el('div', { class: 'chat' });
  const foot = el('div', { class: 'lesson__foot' });
  const scroll = el('div', { class: 'lesson__scroll' }, chat);
  root.append(scroll, foot);

  const picks = [];
  let turn = 0;

  const toBottom = () => { scroll.scrollTop = scroll.scrollHeight; };

  function askTurn() {
    if (turn >= scenario.turns.length) { finish(); return; }
    const step = scenario.turns[turn];

    const typing = typingBubble();
    chat.append(typing);
    toBottom();

    setTimeout(() => {
      typing.remove();
      const isStage = step.npc.startsWith('*') && step.npc.endsWith('*');
      chat.append(bubble('npc', step.npc, { stage: isStage }));
      toBottom();
      showChoices(step);
    }, 620);
  }

  function showChoices(step) {
    clear(foot);
    foot.append(el('div', { class: 'replies' }, step.choices.map((choice) => el('button', {
      class: 'reply',
      text: choice.text,
      onclick: () => pick(choice),
    }))));
  }

  function pick(choice) {
    feedback('tap');
    clear(foot);
    picks.push(choice);
    chat.append(bubble('you', choice.text));
    toBottom();

    const typing = typingBubble();
    setTimeout(() => { chat.append(typing); toBottom(); }, 260);

    setTimeout(() => {
      typing.remove();
      const isStage = choice.reaction.startsWith('*') && choice.reaction.endsWith('*');
      const node = bubble('npc', choice.reaction, { stage: isStage });
      node.append(el('div', { class: 'msg__note' }, [
        el('b', { text: 'Why: ' }), choice.note,
      ]));
      chat.append(node);
      toBottom();

      clear(foot);
      foot.append(el('button', {
        class: 'btn btn--primary',
        text: turn === scenario.turns.length - 1 ? 'See how you did' : 'Continue',
        onclick: () => { feedback('tap'); turn += 1; askTurn(); },
      }));
    }, 900);
  }

  function finish() {
    setBusy(false);
    clear(foot);
    clear(scroll);
    scroll.append(reportView(scenario, scoreFromPicks(picks)));
    scroll.scrollTop = 0;
  }

  askTurn();
}

/* ── Freeform (AI) run ─────────────────────────────────────── */

function aiRun(scenario, root) {
  const chat = el('div', { class: 'chat' });
  const foot = el('div', { class: 'lesson__foot' });
  const scroll = el('div', { class: 'lesson__scroll' }, chat);
  root.append(scroll, foot);

  const history = [];
  let busy = false;

  const toBottom = () => { scroll.scrollTop = scroll.scrollHeight; };

  chat.append(bubble('npc', scenario.ai.opening, { stage: true }));
  history.push({ role: 'assistant', text: scenario.ai.opening });

  const box = el('textarea', {
    placeholder: 'Say something…',
    rows: '1',
    oninput: () => {
      box.style.height = 'auto';
      box.style.height = `${Math.min(130, box.scrollHeight)}px`;
      send.disabled = busy || box.value.trim().length === 0;
    },
    onkeydown: (event) => {
      if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); submit(); }
    },
  });

  const send = el('button', { class: 'composer__send', disabled: true, 'aria-label': 'Send', onclick: () => submit() }, icon('arrowRight'));

  const endButton = el('button', {
    class: 'btn btn--ghost btn--sm',
    style: { marginTop: '10px' },
    text: 'End and get feedback',
    onclick: () => finish(),
  });

  foot.append(el('div', { class: 'composer' }, [box, send]), endButton);

  async function submit() {
    const text = box.value.trim();
    if (!text || busy) return;
    busy = true;
    send.disabled = true;
    box.value = '';
    box.style.height = 'auto';

    chat.append(bubble('you', text));
    history.push({ role: 'user', text });
    toBottom();

    const typing = typingBubble();
    chat.append(typing);
    toBottom();

    try {
      const reply = await roleplayTurn(scenario, history);
      typing.remove();
      const isStage = reply.startsWith('*') && reply.endsWith('*');
      chat.append(bubble('npc', reply, { stage: isStage }));
      history.push({ role: 'assistant', text: reply });
    } catch (err) {
      typing.remove();
      toast(err instanceof AiError ? err.message : 'Something went wrong.', { icon: '!' });
    } finally {
      busy = false;
      toBottom();
      box.focus();
    }
  }

  async function finish() {
    if (busy) return;
    const userTurns = history.filter((m) => m.role === 'user').length;
    if (userTurns < 2) { toast('Say at least a couple of things first.', { icon: '!' }); return; }

    busy = true;
    clear(foot);
    foot.append(el('p', { class: 'small center', text: 'Reading the conversation back…' }));

    try {
      const report = await coachReport(scenario, history);
      setBusy(false);
      clear(foot);
      clear(scroll);

      const extra = el('div', { class: 'stack gap-10' }, [
        report.headline && el('div', { class: 'card' }, el('p', { class: 'body--lg', text: report.headline })),
        report.good && el('div', { class: 'card' }, [el('div', { class: 'eyebrow', text: 'What worked' }), el('p', { class: 'body', style: { marginTop: '6px' }, text: report.good })]),
        report.fix && el('div', { class: 'card' }, [el('div', { class: 'eyebrow', text: 'The one change' }), el('p', { class: 'body', style: { marginTop: '6px' }, text: report.fix })]),
        report.prose && el('div', { class: 'card' }, el('p', { class: 'body', style: { whiteSpace: 'pre-line' }, text: report.prose })),
      ]);

      const scores = report.scores
        ? { w: report.scores.w / 100, c: report.scores.c / 100, f: report.scores.f / 100, k: report.scores.k / 100 }
        : { w: 0.6, c: 0.6, f: 0.6, k: 0.6 };

      scroll.append(reportView(scenario, scores, { extra, ai: true }));
      scroll.scrollTop = 0;
    } catch (err) {
      busy = false;
      clear(foot);
      foot.append(
        el('p', { class: 'small center', style: { marginBottom: '10px' }, text: err instanceof AiError ? err.message : 'Could not get feedback.' }),
        el('button', { class: 'btn btn--ghost', text: 'Back to scenarios', onclick: () => router.go('/gleam/practice') }),
      );
    }
  }

  setTimeout(() => box.focus(), 300);
}

/* ── Run screen ────────────────────────────────────────────── */

export function practiceRunScreen(id) {
  const scenario = scenarioById(id);
  if (!scenario) { router.go('/gleam/practice', { replace: true }); return false; }

  setBusy(true);
  router.onLeave(() => setBusy(false));

  const stage = el('div', { class: 'lesson__inner' });
  const root = el('div', { class: 'lesson' }, stage);

  stage.append(el('div', { class: 'lesson__top' }, [
    el('button', {
      class: 'iconbtn', 'aria-label': 'Leave practice',
      onclick: () => { feedback('tap'); setBusy(false); router.go('/gleam/practice'); },
    }, icon('x')),
    el('div', { class: 'grow' }, [
      el('div', { style: { fontWeight: '800', fontSize: '15px' }, text: scenario.persona.name }),
      el('div', { class: 'small', text: scenario.goal }),
    ]),
    hasKey() && el('button', {
      class: 'iconbtn', 'aria-label': 'Conversation mode',
      onclick: () => modeSheet(scenario),
    }, icon('sliders')),
  ]));

  const useAi = hasKey() && g.settings.practiceMode === 'ai';
  if (useAi) aiRun(scenario, stage);
  else scriptedRun(scenario, stage);

  return root;
}

function modeSheet(scenario) {
  sheet((close) => el('div', { class: 'stack gap-12' }, [
    el('h3', { class: 'title', text: 'Conversation mode' }),
    el('div', { class: 'opts' }, [
      { id: 'scripted', label: 'Guided', sub: 'Pick from four written replies, each one scored and explained.' },
      { id: 'ai', label: 'Freeform', sub: 'Type whatever you want. Claude plays the other person and coaches you at the end.' },
    ].map((option) => el('button', {
      class: 'opt',
      dataset: (g.settings.practiceMode ?? 'scripted') === option.id ? { on: '' } : {},
      onclick: () => {
        g.settings.practiceMode = option.id;
        save();
        feedback('tap');
        close();
        router.go(`/gleam/practice/${scenario.id}`);
        router.render();
      },
    }, [
      el('span', { class: 'opt__text' }, [option.label, el('span', { class: 'opt__sub', text: option.sub })]),
      el('span', { class: 'opt__tick' }, icon('check')),
    ]))),
  ]));
}
