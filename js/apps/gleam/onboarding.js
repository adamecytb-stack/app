/* Gleam's onboarding: 27 steps, roughly three minutes, ending in a
 * press-and-hold commitment and an animated baseline score.
 *
 * It is deliberately long. A long onboarding is a costly signal — by the time
 * you reach the end you have invested enough to feel like you started. */

import { el, icon, feedback, confetti, countUp } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { save } from '../../core/store.js';
import { g, COURSES } from './state.js';

const DRAFT = {
  source: '',
  name: '',
  age: '',
  goals: [],
  whyNow: '',
  blockers: [],
  frequency: '',
  body: [],
  sitParty: '',
  sitAttraction: '',
  sitMeeting: '',
  selfRating: 4,
  imagine: '',
  dailyGoalXp: 30,
  when: '',
};

/* ── Step helpers ──────────────────────────────────────────── */

function single(key, options, { grid = false } = {}) {
  return (draft, api) => el('div', { class: grid ? 'opts opts--grid' : 'opts' }, options.map((o) => {
    const value = o.value ?? o.label;
    const node = el('button', {
      class: 'opt',
      dataset: draft[key] === value ? { on: '' } : {},
      onclick: () => {
        draft[key] = value;
        feedback('tap');
        api.refresh();
        setTimeout(() => api.next(), 190);
      },
    }, [
      o.glyph && el('span', { class: 'opt__glyph', text: o.glyph }),
      el('span', { class: 'opt__text' }, [o.label, o.sub && el('span', { class: 'opt__sub', text: o.sub })]),
      !grid && el('span', { class: 'opt__tick' }, icon('check')),
    ]);
    return node;
  }));
}

function multi(key, options, { min = 1, grid = false } = {}) {
  return (draft, api) => el('div', { class: grid ? 'opts opts--grid' : 'opts' }, options.map((o) => {
    const value = o.value ?? o.label;
    return el('button', {
      class: 'opt',
      dataset: draft[key].includes(value) ? { on: '' } : {},
      onclick: () => {
        const at = draft[key].indexOf(value);
        if (at === -1) draft[key].push(value); else draft[key].splice(at, 1);
        feedback('tap');
        api.refresh();
      },
    }, [
      o.glyph && el('span', { class: 'opt__glyph', text: o.glyph }),
      el('span', { class: 'opt__text' }, [o.label, o.sub && el('span', { class: 'opt__sub', text: o.sub })]),
      el('span', { class: 'opt__tick' }, icon('check')),
    ]);
  }));
}

const minPicked = (key, n = 1) => (draft) => draft[key].length >= n;
const picked = (key) => (draft) => Boolean(draft[key]);

/* ── Scoring ───────────────────────────────────────────────── */

const SIT_WEIGHT = {
  'I would find a reason not to go': 0, 'I would stick to the people I know': 1, 'I would manage, quietly': 2, 'I would actually enjoy it': 3,
  'I completely freeze': 0, 'I get awkward and talk too much': 1, 'I am fine until it actually matters': 2, 'I am pretty comfortable': 3,
  'I never put my hand up': 0, 'Only if I get asked directly': 1, 'Sometimes, if I am sure': 2, 'I just say it': 3,
};

const FREQ_WEIGHT = { 'Basically every time': 0, 'Most days': 1, 'A few times a week': 2, 'Now and then': 3 };

export function computeScore(draft) {
  const sits = [draft.sitParty, draft.sitAttraction, draft.sitMeeting]
    .map((v) => SIT_WEIGHT[v] ?? 1.5)
    .reduce((a, b) => a + b, 0); // 0..9
  const freq = FREQ_WEIGHT[draft.frequency] ?? 1.5; // 0..3
  const self = (draft.selfRating - 1) / 9; // 0..1
  const blockerPenalty = Math.min(1, draft.blockers.length / 7); // 0..1

  const raw = (sits / 9) * 0.36 + (freq / 3) * 0.2 + self * 0.32 + (1 - blockerPenalty) * 0.12;
  return Math.round(22 + raw * 52); // 22..74, so nobody is told they are a zero
}

function ratingCaption(v) {
  return [
    'I avoid it wherever I can',
    'I get through it and then replay it all night',
    'I manage, but it costs me',
    'Fine one-to-one, hard in groups',
    'Okay with people I know',
    'Comfortable most of the time',
    'Pretty easy, apart from a few situations',
    'I enjoy it and I am good at it',
    'I can talk to almost anyone',
    'I am the one who runs the room',
  ][Math.max(0, Math.min(9, v - 1))];
}

/* ── Custom step bodies ────────────────────────────────────── */

function ratingBody(draft, api) {
  const value = el('div', { class: 'rate__value num', text: String(draft.selfRating) });
  const caption = el('div', { class: 'rate__caption', text: ratingCaption(draft.selfRating) });
  const input = el('input', {
    type: 'range', min: '1', max: '10', step: '1', value: String(draft.selfRating),
    oninput: (e) => {
      draft.selfRating = Number(e.target.value);
      value.textContent = String(draft.selfRating);
      caption.textContent = ratingCaption(draft.selfRating);
      api.refresh({ bodyOnly: true });
    },
  });
  return el('div', { class: 'rate' }, [
    value, caption, input,
    el('div', { class: 'rate__ends' }, [el('span', { text: 'Dreading it' }), el('span', { text: 'Running the room' })]),
  ]);
}

const BUILD_LINES = [
  'Scoring your answers',
  'Mapping where you get stuck',
  'Choosing your first course',
  'Setting a pace you will actually keep',
  'Building your plan',
];

function buildingBody(draft, api) {
  const rows = BUILD_LINES.map((line) => el('div', { class: 'build__row' }, [
    el('span', { class: 'build__dot' }, icon('check')),
    el('span', { text: line }),
  ]));
  rows.forEach((row, i) => setTimeout(() => {
    row.dataset.on = '';
    feedback('tap');
    if (i === rows.length - 1) setTimeout(() => api.next(), 620);
  }, 420 + i * 520));
  return el('div', { class: 'build' }, rows);
}

function dialBody(draft) {
  const score = computeScore(draft);
  const R = 100;
  const circumference = 2 * Math.PI * R;

  const wrap = el('div', { class: 'dial' });
  wrap.innerHTML = `
    <svg viewBox="0 0 236 236">
      <defs>
        <linearGradient id="gleamGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#DC8709"/>
          <stop offset="55%" stop-color="#F5A524"/>
          <stop offset="100%" stop-color="#FFC763"/>
        </linearGradient>
      </defs>
      <circle class="dial__track" cx="118" cy="118" r="${R}"/>
      <circle class="dial__arc" cx="118" cy="118" r="${R}"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
    </svg>`;

  const num = el('div', { class: 'dial__num num', text: '0' });
  wrap.append(el('div', { class: 'dial__center' }, [num, el('div', { class: 'dial__of', text: 'Social baseline' })]));

  requestAnimationFrame(() => {
    const arc = wrap.querySelector('.dial__arc');
    arc.style.strokeDashoffset = String(circumference * (1 - score / 100));
    countUp(num, score, { duration: 1700, format: (n) => String(Math.round(n)) });
    setTimeout(() => feedback('levelup'), 1500);
  });

  const band = score < 38 ? 'That is a low starting point, and it is the most improvable one.'
    : score < 55 ? 'A middling baseline — capable in some rooms, avoiding others.'
      : 'A decent baseline. The gains here are in the harder rooms.';

  return el('div', {}, [wrap, el('p', { class: 'body center', text: band })]);
}

function compareBody(draft) {
  const score = computeScore(draft);
  const rows = [
    { label: 'You, today', value: score, color: 'linear-gradient(90deg,#DC8709,#FFC763)' },
    { label: 'Most people your age', value: 55, color: 'var(--ink-500)' },
    { label: 'The ones who make it look easy', value: 84, color: 'linear-gradient(90deg,#2C9C74,#4FD8A8)' },
  ];
  const node = el('div', { class: 'bars' }, rows.map((r) => {
    const fill = el('div', { class: 'bars__fill', style: { background: r.color } });
    requestAnimationFrame(() => setTimeout(() => { fill.style.width = `${r.value}%`; }, 120));
    return el('div', { class: 'bars__row' }, [
      el('div', { class: 'bars__label' }, [el('span', { text: r.label }), el('b', { class: 'num', text: String(r.value) })]),
      el('div', { class: 'bars__track' }, fill),
    ]);
  }));
  return el('div', {}, [
    node,
    el('p', { class: 'small', style: { marginTop: '18px' }, text: 'Reference points, not a clinical measure. The number that matters is the one that moves.' }),
  ]);
}

function projectionBody(draft) {
  const score = computeScore(draft);
  const target = Math.min(94, score + 32);
  const W = 320;
  const H = 150;
  const pts = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    // Fast early gains, then a flattening curve — honest about how this goes.
    const v = score + (target - score) * (1 - (1 - t) ** 2.1);
    pts.push([12 + t * (W - 24), H - ((v - 15) / 85) * H]);
  }
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts.at(-1)[0].toFixed(1)},${H} L12,${H} Z`;
  const flatY = H - ((score - 15) / 85) * H;

  const wrap = el('div', { class: 'proj' });
  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H + 22}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gleamArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F5A524" stop-opacity=".34"/>
          <stop offset="100%" stop-color="#F5A524" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path class="proj__area" d="${area}"/>
      <path class="proj__flat" d="M12,${flatY.toFixed(1)} L${W - 12},${flatY.toFixed(1)}"/>
      <path class="proj__line" d="${line}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <text class="proj__axis" x="12" y="${H + 16}">TODAY</text>
      <text class="proj__axis" x="${W - 12}" y="${H + 16}" text-anchor="end">90 DAYS</text>
    </svg>`;
  wrap.append(el('div', { class: 'proj__tag num', text: `→ ${target}` }));

  requestAnimationFrame(() => {
    const path = wrap.querySelector('.proj__line');
    path.style.transition = 'stroke-dashoffset 1600ms var(--ease-out)';
    path.style.strokeDashoffset = '0';
  });

  return el('div', {}, [
    wrap,
    el('p', { class: 'body', text: 'Five minutes a day. The dotted line is what happens if you keep doing what you are doing now.' }),
  ]);
}

function commitBody(draft, api) {
  const R = 78;
  const circumference = 2 * Math.PI * R;
  const HOLD = 1900;

  const pad = el('div', { class: 'press__pad' });
  pad.innerHTML = `
    <svg class="press__ring" viewBox="0 0 168 168">
      <circle class="press__ringTrack" cx="84" cy="84" r="${R}"/>
      <circle class="press__ringArc" cx="84" cy="84" r="${R}"
              stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"/>
    </svg>`;
  const print = icon('fingerprint', 74);
  print.classList.add('press__print');
  pad.append(print);

  const hint = el('div', { class: 'press__hint', text: 'Press and hold' });
  const arc = pad.querySelector('.press__ringArc');

  let raf = null;
  let startedAt = 0;
  let done = false;

  function frame(now) {
    const p = Math.min(1, (now - startedAt) / HOLD);
    arc.style.strokeDashoffset = String(circumference * (1 - p));
    if (p >= 1) { finish(); return; }
    raf = requestAnimationFrame(frame);
  }

  function begin(event) {
    event.preventDefault();
    if (done) return;
    pad.dataset.holding = '';
    startedAt = performance.now();
    feedback('tap');
    hint.textContent = 'Keep holding…';
    raf = requestAnimationFrame(frame);
  }

  function cancel() {
    if (done) return;
    cancelAnimationFrame(raf);
    delete pad.dataset.holding;
    arc.style.transition = 'stroke-dashoffset 260ms var(--ease-out)';
    arc.style.strokeDashoffset = String(circumference);
    setTimeout(() => { arc.style.transition = ''; }, 280);
    hint.textContent = 'Press and hold';
  }

  function finish() {
    done = true;
    delete pad.dataset.holding;
    pad.dataset.done = '';
    hint.textContent = 'Committed.';
    draft.committedAt = new Date().toISOString();
    feedback('levelup');
    confetti({ count: 46 });
    api.refresh();
    setTimeout(() => api.next(), 900);
  }

  pad.addEventListener('pointerdown', begin);
  pad.addEventListener('pointerup', cancel);
  pad.addEventListener('pointerleave', cancel);
  pad.addEventListener('pointercancel', cancel);
  pad.addEventListener('contextmenu', (e) => e.preventDefault());

  return el('div', { class: 'press' }, [
    el('p', { class: 'press__oath', text: '“I will do five minutes a day, on the days I do not feel like it, for the next thirty days.”' }),
    pad,
    hint,
  ]);
}

function planBody(draft) {
  const order = planOrder(draft);
  return el('div', { class: 'plan' }, order.slice(0, 5).map((course, i) => el('div', { class: 'planrow' }, [
    el('span', { class: 'planrow__n', text: String(i + 1) }),
    el('div', {}, [
      el('div', { class: 'planrow__t', text: course.title }),
      el('div', { class: 'planrow__s', text: `${course.lessons.length} lessons · ${course.subtitle}` }),
    ]),
  ])));
}

/** Order courses so the ones matching their stated goals come first. */
export function planOrder(draft) {
  const has = (goal) => draft.goals.includes(goal);
  const weight = {
    'talking-to-them': (has('Talk to someone I like') ? 3 : 0) + (has('Stop overthinking everything') ? 1 : 0),
    texting: (has('Get better at texting them') ? 3 : 0) + (has('Talk to someone I like') ? 1 : 0),
    signals: (has('Work out if they like me') ? 3 : 0),
    'making-a-move': (has('Actually ask someone out') ? 3 : 0),
    nerves: (has('Stop overthinking everything') ? 3 : 0),
    school: (has('Be better at school stuff') ? 3 : 0),
    parties: (has('Handle parties and groups') ? 3 : 0),
    likeable: (has('Be someone people like more') ? 3 : 0),
  };
  return [...COURSES].sort((a, b) => (weight[b.id] ?? 0) - (weight[a.id] ?? 0) || a.index - b.index);
}

function streakBody() {
  return el('div', { class: 'stack gap-12' }, [
    el('div', { class: 'card' }, [
      el('div', { class: 'row gap-10' }, [
        (() => { const i = icon('flame', 30); i.style.color = 'var(--flame-b)'; return i; })(),
        el('div', {}, [
          el('b', { text: 'A streak day = hitting your daily goal' }),
          el('div', { class: 'small', text: 'Not opening the app. Actually finishing the reps.' }),
        ]),
      ]),
    ]),
    el('div', { class: 'card' }, [
      el('div', { class: 'row gap-10' }, [
        (() => { const i = icon('snow', 30); i.style.color = 'var(--sky)'; return i; })(),
        el('div', {}, [
          el('b', { text: 'Three good days earns a streak freeze' }),
          el('div', { class: 'small', text: 'Miss a day and a freeze is spent automatically. You can hold two.' }),
        ]),
      ]),
    ]),
    el('div', { class: 'card' }, [
      el('div', { class: 'row gap-10' }, [
        (() => { const i = icon('shield', 30); i.style.color = 'var(--mint)'; return i; })(),
        el('div', {}, [
          el('b', { text: 'Nothing here is behind a paywall' }),
          el('div', { class: 'small', text: 'It is your app. Every lesson is open from day one.' }),
        ]),
      ]),
    ]),
  ]);
}

/* ── The 27 steps ──────────────────────────────────────────── */

const STEPS = [
  {
    hero: true,
    cta: 'Get started',
    build: () => el('div', { class: 'ob__hero' }, [
      (() => { const i = icon('sparkle', 108); i.classList.add('ob__glyph'); return i; })(),
      el('h1', { class: 'ob__heroTitle', text: 'Gleam' }),
      el('p', { class: 'ob__heroSub', text: 'Five minutes a day. Talking to people you like, texting, parties, and the overthinking afterwards — practised, not read about.' }),
    ]),
  },
  {
    eyebrow: 'The premise',
    title: 'You are not bad at this. <em>You are out of practice</em>',
    sub: 'You can talk to your friends for hours. The skill is already there — it just falls apart in the rooms where it matters. That part is trainable.',
    cta: 'Makes sense',
    build: () => el('div', { class: 'stack gap-12' }, [
      el('div', { class: 'card' }, [el('b', { text: 'It is a stakes problem' }), el('p', { class: 'small', text: 'Easy with friends, impossible with them. Same you — different pressure.' })]),
      el('div', { class: 'card' }, [el('b', { text: 'It is specific' }), el('p', { class: 'small', text: '“Be confident” is useless. “Ask about the weird word they used” is not.' })]),
      el('div', { class: 'card' }, [el('b', { text: 'It only goes down with reps' }), el('p', { class: 'small', text: 'Every time you avoid it, it gets slightly harder. Every time you do it, slightly easier.' })]),
    ]),
  },
  {
    eyebrow: 'Step 1',
    title: 'How did you get here?',
    cta: 'Continue',
    valid: picked('source'),
    build: single('source', [
      { glyph: '🤖', label: 'I had it built for me' },
      { glyph: '📱', label: 'TikTok or Instagram' },
      { glyph: '🔎', label: 'I went looking for something like this' },
      { glyph: '🗣️', label: 'Someone told me about it' },
      { glyph: '🌀', label: 'Honestly, no idea' },
    ]),
  },
  {
    eyebrow: 'Step 2',
    title: 'What should Gleam call you?',
    sub: 'Only used to make this feel less like a form.',
    cta: 'Continue',
    valid: (d) => d.name.trim().length > 0,
    build: (draft, api) => el('input', {
      class: 'field',
      type: 'text',
      placeholder: 'Your name',
      value: draft.name,
      autocomplete: 'given-name',
      maxlength: '24',
      oninput: (e) => { draft.name = e.target.value; api.refresh({ bodyOnly: true }); },
    }),
  },
  {
    eyebrow: 'Step 3',
    title: 'How old are you?',
    sub: 'It changes the examples, nothing else.',
    cta: 'Continue',
    valid: picked('age'),
    build: single('age', [
      { label: '12 or under' }, { label: '13' }, { label: '14' },
      { label: '15' }, { label: '16' }, { label: '17+' },
    ], { grid: true }),
  },
  {
    eyebrow: 'Step 4',
    title: 'What do you actually want out of this?',
    sub: 'Pick everything that applies. Your course order follows this.',
    cta: 'Continue',
    valid: minPicked('goals'),
    build: multi('goals', [
      { glyph: '💛', label: 'Talk to someone I like' },
      { glyph: '💬', label: 'Get better at texting them' },
      { glyph: '🔍', label: 'Work out if they like me' },
      { glyph: '🎯', label: 'Actually ask someone out' },
      { glyph: '🌀', label: 'Stop overthinking everything' },
      { glyph: '🎉', label: 'Handle parties and groups' },
      { glyph: '🏫', label: 'Be better at school stuff' },
      { glyph: '✨', label: 'Be someone people like more' },
    ]),
  },
  {
    eyebrow: 'Step 5',
    title: 'Why now?',
    sub: 'Something usually sets this off.',
    cta: 'Continue',
    valid: picked('whyNow'),
    build: single('whyNow', [
      { label: 'There is someone specific', sub: 'and I keep doing nothing about it' },
      { label: 'I am fine with my friends and useless otherwise', sub: 'and I am sick of it' },
      { label: 'I am tired of being the quiet one', sub: 'people think I am boring and I am not' },
      { label: 'Something embarrassing happened', sub: 'and I have thought about it every day since' },
      { label: 'New school or new year group', sub: 'and I want to get it right this time' },
      { label: 'No reason. Just decided.', sub: 'honestly the best one' },
    ]),
  },
  {
    eyebrow: 'Next',
    title: 'Now the harder part',
    sub: 'The next few questions are about where it goes wrong. Be honest — nothing here leaves your phone, and the plan is only as good as the answers.',
    cta: 'I am ready',
    build: () => el('div', { class: 'notice' }, [
      'Everything you enter stays in this browser. ',
      el('b', { text: 'No account, no server, no analytics.' }),
      ' You can export or wipe all of it from Profile at any time.',
    ]),
  },
  {
    eyebrow: 'Step 6',
    title: 'Which of these are true for you?',
    sub: 'Pick as many as apply.',
    cta: 'Continue',
    valid: minPicked('blockers'),
    build: multi('blockers', [
      { label: 'I go blank around people I like' },
      { label: 'I replay conversations for hours afterwards' },
      { label: 'I overthink every text before I send it' },
      { label: 'I cannot tell if they like me or are just being nice' },
      { label: 'I go quiet in groups of more than three' },
      { label: 'I never make the first move, ever' },
      { label: 'I get talked over' },
      { label: 'I avoid things I have already said yes to' },
    ]),
  },
  {
    eyebrow: 'Step 7',
    title: 'How often does that happen?',
    cta: 'Continue',
    valid: picked('frequency'),
    build: single('frequency', [
      { label: 'Basically every time' },
      { label: 'Most days' },
      { label: 'A few times a week' },
      { label: 'Now and then' },
    ]),
  },
  {
    eyebrow: 'Step 8',
    title: 'What does your body do?',
    sub: 'Social anxiety is physical before it is anything else.',
    cta: 'Continue',
    valid: () => true,
    build: multi('body', [
      { label: 'Heart rate goes up' },
      { label: 'I talk faster' },
      { label: 'I go blank' },
      { label: 'I get hot or flush' },
      { label: 'My voice gets quieter' },
      { label: 'None of this, really' },
    ], { min: 0 }),
  },
  {
    eyebrow: 'Situation 1 of 3',
    title: 'A party where you know a couple of people',
    sub: 'They end up in another room. What actually happens?',
    cta: 'Continue',
    valid: picked('sitParty'),
    build: single('sitParty', [
      { label: 'I would find a reason not to go' },
      { label: 'I would stick to the people I know' },
      { label: 'I would manage, quietly' },
      { label: 'I would actually enjoy it' },
    ]),
  },
  {
    eyebrow: 'Situation 2 of 3',
    title: 'Someone you like sits down next to you',
    sub: 'Be honest.',
    cta: 'Continue',
    valid: picked('sitAttraction'),
    build: single('sitAttraction', [
      { label: 'I completely freeze' },
      { label: 'I get awkward and talk too much' },
      { label: 'I am fine until it actually matters' },
      { label: 'I am pretty comfortable' },
    ]),
  },
  {
    eyebrow: 'Situation 3 of 3',
    title: 'You know the answer in class',
    cta: 'Continue',
    valid: picked('sitMeeting'),
    build: single('sitMeeting', [
      { label: 'I never put my hand up' },
      { label: 'Only if I get asked directly' },
      { label: 'Sometimes, if I am sure' },
      { label: 'I just say it' },
    ]),
  },
  {
    eyebrow: 'Step 12',
    title: 'Where would you put yourself?',
    sub: 'Gut answer. You will move this number in ninety days.',
    cta: 'Continue',
    build: ratingBody,
  },
  {
    eyebrow: 'Step 13',
    title: 'If this worked, what changes?',
    sub: 'The thing you are actually buying with five minutes a day.',
    cta: 'Continue',
    valid: picked('imagine'),
    build: single('imagine', [
      { label: 'I would actually talk to them', sub: 'instead of thinking about it' },
      { label: 'I would stop dreading things', sub: 'no more sick feeling beforehand' },
      { label: 'I would stop replaying everything', sub: 'and get my evenings back' },
      { label: 'People would know what I am actually like', sub: 'not the quiet version' },
      { label: 'I would just feel like myself', sub: 'around everyone, not only my friends' },
    ]),
  },
  {
    eyebrow: 'One moment',
    title: 'Building your profile',
    sub: 'Reading your answers back.',
    noCta: true,
    build: buildingBody,
  },
  {
    eyebrow: 'Your result',
    title: 'Here is where you are starting',
    cta: 'What does that mean?',
    build: dialBody,
  },
  {
    eyebrow: 'Context',
    title: 'For scale',
    cta: 'Show me the plan',
    build: compareBody,
  },
  {
    eyebrow: 'The projection',
    title: 'Ninety days of five minutes',
    cta: 'Continue',
    build: projectionBody,
  },
  {
    eyebrow: 'Why it works',
    title: 'Reps, not reading',
    sub: 'Every lesson makes you choose a line, write a reply, or judge a moment. Passive advice is why nothing has changed so far.',
    cta: 'Continue',
    build: () => el('div', { class: 'quotecard' }, [
      icon('quote', 26),
      el('p', { text: 'The person who is good in the room is not braver than you. They have simply had the conversation more times.' }),
      el('footer', { text: 'The entire premise of this app' }),
    ]),
  },
  {
    eyebrow: 'The part that matters',
    title: 'Commit to it',
    sub: 'Hold the circle until it fills. It is a gesture, and gestures work — that is why the app asks for one.',
    noCta: true,
    build: commitBody,
  },
  {
    eyebrow: 'Your pace',
    title: 'How hard do you want to go?',
    sub: 'You can change this later, and you probably will.',
    cta: 'Continue',
    valid: (d) => Boolean(d.dailyGoalXp),
    build: (draft, api) => el('div', { class: 'opts' }, [
      { xp: 20, label: 'Steady', sub: '20 XP · about 1 lesson · 4 min' },
      { xp: 30, label: 'Regular', sub: '30 XP · about 2 lessons · 7 min' },
      { xp: 50, label: 'Serious', sub: '50 XP · about 3 lessons · 11 min' },
      { xp: 80, label: 'Obsessive', sub: '80 XP · about 5 lessons · 18 min' },
    ].map((o) => el('button', {
      class: 'opt',
      dataset: draft.dailyGoalXp === o.xp ? { on: '' } : {},
      onclick: () => { draft.dailyGoalXp = o.xp; feedback('tap'); api.refresh(); setTimeout(() => api.next(), 190); },
    }, [
      el('span', { class: 'opt__text' }, [o.label, el('span', { class: 'opt__sub', text: o.sub })]),
      el('span', { class: 'opt__tick' }, icon('check')),
    ]))),
  },
  {
    eyebrow: 'Your slot',
    title: 'When are you doing this?',
    sub: 'Habits attach to a time and a trigger. Pick the one you will not have to negotiate with yourself about.',
    cta: 'Continue',
    valid: picked('when'),
    build: single('when', [
      { glyph: '🌅', label: 'Before school' },
      { glyph: '🚌', label: 'On the way in' },
      { glyph: '🍽️', label: 'At break or lunch' },
      { glyph: '🏠', label: 'Straight after school' },
      { glyph: '🌙', label: 'In bed before sleep' },
    ]),
  },
  {
    eyebrow: 'Your plan',
    title: 'Built around your answers',
    sub: 'Forty lessons across eight courses, reordered to hit your goals first.',
    cta: 'Continue',
    build: planBody,
  },
  {
    eyebrow: 'The rules',
    title: 'Three things and then we start',
    cta: 'Understood',
    build: streakBody,
  },
  {
    eyebrow: 'Day one',
    title: 'Your streak starts with <em>one lesson</em>',
    sub: 'Not tomorrow, not a plan for Monday. Now, and it takes four minutes.',
    cta: 'Start my first lesson',
    build: (draft) => el('div', { class: 'card center' }, [
      el('div', { class: 'display display--xl num', style: { color: 'var(--ember)' }, text: '0' }),
      el('div', { class: 'eyebrow eyebrow--quiet', style: { marginTop: '6px' }, text: 'Day streak' }),
      el('p', { class: 'body', style: { marginTop: '14px' }, text: `Let's make that a 1, ${draft.name.trim() || 'friend'}.` }),
    ]),
  },
];

/* ── Controller ────────────────────────────────────────────── */

export function onboardingScreen() {
  const draft = { ...DRAFT, goals: [], blockers: [], body: [] };
  let i = 0;

  const fill = el('div', { class: 'ob__fill' });
  const count = el('div', { class: 'ob__count' });
  const back = el('button', { class: 'iconbtn ob__back', 'aria-label': 'Back' }, icon('chevronLeft'));
  const body = el('div', { class: 'ob__body' });
  const foot = el('div', { class: 'ob__foot' });

  const root = el('div', { class: 'ob' }, [
    el('div', { class: 'ob__nav' }, [back, el('div', { class: 'ob__track' }, fill), count]),
    body, foot,
  ]);

  const api = {
    next() {
      if (i >= STEPS.length - 1) { finish(); return; }
      i += 1;
      paint();
    },
    prev() {
      if (i === 0) { router.go('/'); return; }
      i -= 1;
      paint();
    },
    refresh({ bodyOnly = false } = {}) {
      if (bodyOnly) { syncCta(); return; }
      paint({ keepScroll: true });
    },
  };

  back.addEventListener('click', () => { feedback('tap'); api.prev(); });

  let ctaButton = null;

  function syncCta() {
    const step = STEPS[i];
    if (!ctaButton) return;
    ctaButton.disabled = step.valid ? !step.valid(draft) : false;
  }

  function paint({ keepScroll = false } = {}) {
    const step = STEPS[i];
    const scrollTop = keepScroll ? root.scrollTop : 0;

    fill.style.width = `${((i + 1) / STEPS.length) * 100}%`;
    count.textContent = `${i + 1}/${STEPS.length}`;

    while (body.firstChild) body.removeChild(body.firstChild);
    while (foot.firstChild) foot.removeChild(foot.firstChild);

    if (!step.hero) {
      if (step.eyebrow) body.append(el('div', { class: 'ob__eyebrow', text: step.eyebrow }));
      if (step.title) body.append(el('h1', { class: 'ob__title', html: step.title }));
      if (step.sub) body.append(el('p', { class: 'ob__sub', text: step.sub }));
    }
    body.append(step.build(draft, api));

    ctaButton = null;
    if (!step.noCta) {
      ctaButton = el('button', {
        class: 'btn btn--primary',
        text: step.cta || 'Continue',
        onclick: () => { feedback('tap'); api.next(); },
      });
      foot.append(ctaButton);
      syncCta();
    }

    body.style.animation = 'none';
    void body.offsetWidth;
    body.style.animation = '';
    if (keepScroll) root.scrollTop = scrollTop;
  }

  function finish() {
    Object.assign(g.profile, {
      name: draft.name.trim(),
      goals: draft.goals,
      blockers: draft.blockers,
      situations: [draft.sitParty, draft.sitAttraction, draft.sitMeeting],
      selfRating: draft.selfRating,
      frequency: draft.frequency,
      energy: draft.when,
      biggestWin: draft.imagine,
      dailyGoalXp: draft.dailyGoalXp,
      baselineScore: computeScore(draft),
      committedAt: draft.committedAt || new Date().toISOString(),
      age: draft.age,
    });
    g.courseOrder = planOrder(draft).map((c) => c.id);
    g.onboarded = true;
    save();
    feedback('complete');
    router.go('/gleam/learn', { replace: true });
  }

  paint();
  return root;
}
