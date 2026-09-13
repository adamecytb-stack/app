/* The lesson runner.
 *
 * Eight exercise types share one loop: render → let them answer → grade →
 * verdict → next. Anything answered wrong is pushed back onto the end of the
 * queue once, which is the single mechanic that makes drilling work. */

import { el, icon, feedback, confetti, shuffle, countUp, clear } from '../../core/ui.js';
import * as router from '../../core/router.js';
import { setBusy } from '../../core/update.js';
import { lessonById, recordLesson, g, courseById } from './state.js';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/* ── Exercise renderers ────────────────────────────────────────
 * Each returns { node, grade() -> {ok, why, title} | null, gradable }.
 * `grade` returns null while the answer is incomplete. */

function renderConcept(item, api) {
  api.setReady(true);
  return {
    gradable: false,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Concept' }),
      el('h2', { class: 'concept__title', text: item.title }),
      el('p', { class: 'concept__body', text: item.body }),
      item.example && el('div', { class: 'concept__ex' }, [
        el('div', { class: 'concept__exLabel', text: item.example.label }),
        el('div', { class: 'concept__exLine', text: item.example.line }),
      ]),
      item.tip && el('div', { class: 'concept__tip' }, [icon('sparkle'), el('span', { text: item.tip })]),
    ]),
  };
}

function renderChoice(item, api) {
  const options = shuffle(item.options, hashSeed(item.prompt));
  let chosen = null;
  const buttons = [];

  const list = el('div', { class: 'choices' }, options.map((option, i) => {
    const button = el('button', {
      class: 'choice',
      onclick: () => {
        if (api.locked()) return;
        chosen = option;
        buttons.forEach((b) => delete b.dataset.on);
        button.dataset.on = '';
        feedback('tap');
        api.setReady(true);
      },
    }, [
      el('span', { class: 'choice__key', text: LETTERS[i] }),
      el('span', { text: option.text }),
    ]);
    buttons.push(button);
    return button;
  }));

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Pick the best move' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      item.context && el('div', { class: 'q__context', text: item.context }),
      list,
    ]),
    grade() {
      if (!chosen) return null;
      const ok = Boolean(chosen.ok);
      buttons.forEach((b, i) => {
        b.disabled = true;
        if (options[i].ok) b.dataset.verdict = 'right';
        else if (options[i] === chosen) b.dataset.verdict = 'wrong';
      });
      if (!ok) buttons[options.indexOf(chosen)].classList.add('choice--shake');
      const right = options.find((o) => o.ok);
      return {
        ok,
        title: ok ? 'Exactly' : 'Not quite',
        why: ok ? chosen.why : `${chosen.why}\n\nThe stronger move: “${right.text}” — ${right.why}`,
      };
    },
  };
}

function renderMulti(item, api) {
  const options = shuffle(item.options, hashSeed(item.prompt));
  const picked = new Set();
  const buttons = [];

  const list = el('div', { class: 'choices' }, options.map((option, i) => {
    const button = el('button', {
      class: 'choice',
      onclick: () => {
        if (api.locked()) return;
        if (picked.has(option)) { picked.delete(option); delete button.dataset.on; }
        else { picked.add(option); button.dataset.on = ''; }
        feedback('tap');
        api.setReady(picked.size > 0);
      },
    }, [
      el('span', { class: 'choice__key', text: LETTERS[i] }),
      el('span', { text: option.text }),
    ]);
    buttons.push(button);
    return button;
  }));

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Select every one that applies' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      item.context && el('div', { class: 'q__context', text: item.context }),
      list,
    ]),
    grade() {
      if (picked.size === 0) return null;
      const wanted = options.filter((o) => o.ok);
      const ok = wanted.every((o) => picked.has(o)) && [...picked].every((o) => o.ok);
      buttons.forEach((b, i) => {
        b.disabled = true;
        const option = options[i];
        if (option.ok && picked.has(option)) b.dataset.verdict = 'right';
        else if (option.ok) b.dataset.verdict = 'miss';
        else if (picked.has(option)) b.dataset.verdict = 'wrong';
      });
      return {
        ok,
        title: ok ? 'All of them' : 'Close',
        why: item.why || `The right set: ${wanted.map((o) => `“${o.text}”`).join(', ')}.`,
      };
    },
  };
}

function renderTf(item, api) {
  let chosen = null;
  const buttons = [true, false].map((value) => el('button', {
    class: 'choice',
    onclick: () => {
      if (api.locked()) return;
      chosen = value;
      buttons.forEach((b) => delete b.dataset.on);
      buttons[value ? 0 : 1].dataset.on = '';
      feedback('tap');
      api.setReady(true);
    },
  }, el('span', { text: value ? 'True' : 'False' })));

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: item.prompt || 'True or false?' }),
      el('div', { class: 'statement', text: item.statement }),
      el('div', { class: 'tfrow' }, buttons),
    ]),
    grade() {
      if (chosen === null) return null;
      const ok = chosen === item.answer;
      buttons.forEach((b, i) => {
        b.disabled = true;
        const value = i === 0;
        if (value === item.answer) b.dataset.verdict = 'right';
        else if (value === chosen) b.dataset.verdict = 'wrong';
      });
      return { ok, title: ok ? 'Right' : `Actually ${item.answer ? 'true' : 'false'}`, why: item.why };
    },
  };
}

function renderOrder(item, api) {
  const correct = item.items;
  let current = shuffle(correct, hashSeed(item.prompt) + 7);
  if (current.every((v, i) => v === correct[i])) current = [...current].reverse();
  api.setReady(true);

  const list = el('div', { class: 'orderlist' });

  function paint() {
    clear(list);
    current.forEach((text, i) => {
      list.append(el('div', { class: 'orderitem' }, [
        el('span', { class: 'orderitem__n', text: String(i + 1) }),
        el('span', { class: 'grow', text }),
        el('span', { class: 'orderitem__arrows' }, [
          el('button', {
            class: 'up', 'aria-label': 'Move up', disabled: i === 0,
            onclick: () => { if (api.locked() || i === 0) return; swap(i, i - 1); },
          }, icon('chevronRight')),
          el('button', {
            class: 'down', 'aria-label': 'Move down', disabled: i === current.length - 1,
            onclick: () => { if (api.locked() || i === current.length - 1) return; swap(i, i + 1); },
          }, icon('chevronRight')),
        ]),
      ]));
    });
  }

  function swap(a, b) {
    [current[a], current[b]] = [current[b], current[a]];
    feedback('tap');
    paint();
  }

  paint();

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Put these in order' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      list,
    ]),
    grade() {
      const ok = current.every((v, i) => v === correct[i]);
      list.querySelectorAll('button').forEach((b) => { b.disabled = true; });
      return {
        ok,
        title: ok ? 'Correct order' : 'Not the order',
        why: ok ? 'That is the sequence.' : `The order is:\n${correct.map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
      };
    },
  };
}

function renderBlank(item, api) {
  let chosen = null;
  const slot = el('span', { class: 'blankslot' });
  const [before, after] = item.sentence.split('___');

  const tokens = shuffle(item.bank, hashSeed(item.sentence)).map((word) => el('button', {
    class: 'token',
    text: word,
    onclick: () => {
      if (api.locked()) return;
      chosen = word;
      tokens.forEach((t) => delete t.dataset.on);
      const self = tokens.find((t) => t.textContent === word);
      if (self) self.dataset.on = '';
      slot.textContent = word;
      feedback('tap');
      api.setReady(true);
    },
  }));

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Fill the gap' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      el('div', { class: 'blanksentence' }, [before, slot, after]),
      el('div', { class: 'bank' }, tokens),
    ]),
    grade() {
      if (chosen === null) return null;
      const ok = chosen === item.answer;
      tokens.forEach((t) => { t.dataset.used = ''; });
      return {
        ok,
        title: ok ? 'That is the one' : 'Not that one',
        why: ok ? item.sentence.replace('___', item.answer) : `It is “${item.answer}”: ${item.sentence.replace('___', item.answer)}`,
      };
    },
  };
}

function renderMatch(item, api) {
  const lefts = item.pairs.map((p) => p[0]);
  const rights = shuffle(item.pairs.map((p) => p[1]), hashSeed(item.prompt));
  const answer = new Map(item.pairs);

  let selectedLeft = null;
  let matched = 0;
  let mistakes = 0;

  const leftNodes = new Map();
  const rightNodes = new Map();

  function cell(text, side) {
    const node = el('button', {
      class: 'matchcell',
      text,
      onclick: () => {
        if (api.locked() || node.dataset.paired !== undefined) return;
        feedback('tap');
        if (side === 'l') {
          [...leftNodes.values()].forEach((n) => delete n.dataset.on);
          selectedLeft = text;
          node.dataset.on = '';
          return;
        }
        if (selectedLeft === null) return;
        if (answer.get(selectedLeft) === text) {
          leftNodes.get(selectedLeft).dataset.paired = '';
          delete leftNodes.get(selectedLeft).dataset.on;
          node.dataset.paired = '';
          selectedLeft = null;
          matched += 1;
          feedback('correct');
          api.setReady(matched === item.pairs.length);
        } else {
          mistakes += 1;
          node.dataset.wrong = '';
          feedback('wrong');
          setTimeout(() => { delete node.dataset.wrong; }, 420);
        }
      },
    });
    (side === 'l' ? leftNodes : rightNodes).set(text, node);
    return node;
  }

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Tap a pair to match them' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      el('div', { class: 'matchpair' }, [
        el('div', { class: 'matchcol' }, lefts.map((t) => cell(t, 'l'))),
        el('div', { class: 'matchcol' }, rights.map((t) => cell(t, 'r'))),
      ]),
    ]),
    grade() {
      if (matched < item.pairs.length) return null;
      const ok = mistakes === 0;
      return {
        ok,
        title: ok ? 'All matched, clean' : `Matched, with ${mistakes} wrong ${mistakes === 1 ? 'try' : 'tries'}`,
        why: item.pairs.map(([l, r]) => `${l} → ${r}`).join('\n'),
      };
    },
  };
}

function renderFreeform(item, api) {
  const rubric = item.rubric || {};
  const minWords = rubric.minWords ?? 5;

  const meta = el('div', { class: 'freeform__meta' }, [
    el('span', { text: `At least ${minWords} words` }),
    el('span', { class: 'count num', text: '0' }),
  ]);

  const box = el('textarea', {
    class: 'freeform',
    placeholder: 'Type what you would actually say…',
    rows: '5',
    oninput: () => {
      const n = words(box.value).length;
      meta.querySelector('.count').textContent = String(n);
      api.setReady(n >= minWords);
    },
  });

  return {
    gradable: true,
    node: el('div', { class: 'q' }, [
      el('div', { class: 'q__kicker', text: 'Write it in your own words' }),
      el('h2', { class: 'q__prompt', text: item.prompt }),
      item.context && el('div', { class: 'q__context', text: item.context }),
      box, meta,
    ]),
    grade() {
      const text = box.value.trim();
      if (words(text).length < minWords) return null;
      box.disabled = true;

      const lower = text.toLowerCase();
      const hits = (rubric.want || []).filter((w) => lower.includes(w.toLowerCase()));
      const slipped = (rubric.avoid || []).filter((w) => lower.includes(w.toLowerCase()));
      const ok = slipped.length === 0 && (hits.length >= 1 || (rubric.want || []).length === 0);

      const notes = [];
      if (slipped.length) notes.push(`Watch out for: ${slipped.map((w) => `“${w}”`).join(', ')}. That phrasing works against you here.`);
      else if (hits.length >= 2) notes.push('Good — specific and on target.');
      else if (ok) notes.push('That works. Compare it with the model answer below.');
      else notes.push('It is a bit off-target. Look at how the model answer stays concrete.');

      return {
        ok,
        title: ok ? 'Good answer' : 'Have a look at this',
        why: notes.join(' '),
        extra: rubric.sample && el('div', { class: 'sample' }, [
          el('div', { class: 'sample__label', text: 'One way to do it' }),
          el('div', { class: 'sample__line', text: rubric.sample }),
        ]),
      };
    },
  };
}

const RENDERERS = {
  concept: renderConcept,
  choice: renderChoice,
  multi: renderMulti,
  tf: renderTf,
  order: renderOrder,
  blank: renderBlank,
  match: renderMatch,
  freeform: renderFreeform,
};

function words(text) { return text.trim().split(/\s+/).filter(Boolean); }

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ── The runner ────────────────────────────────────────────── */

export function lessonScreen(lessonId) {
  const lesson = lessonById(lessonId);
  if (!lesson) { router.go('/gleam/learn', { replace: true }); return false; }
  const course = courseById(lesson.courseId);

  const queue = [...lesson.items];
  let index = 0;
  let correct = 0;
  let graded = 0;
  let hearts = 5;
  const requeued = new Set();

  let locked = false;
  let ready = false;
  let active = null;

  setBusy(true);

  const fill = el('div', { class: 'progress__fill' });
  const heartRow = el('div', { class: 'lesson__hearts' });
  const scroll = el('div', { class: 'lesson__scroll' });
  const foot = el('div', { class: 'lesson__foot' });

  const root = el('div', { class: 'lesson' }, el('div', { class: 'lesson__inner' }, [
    el('div', { class: 'lesson__top' }, [
      el('button', {
        class: 'iconbtn', 'aria-label': 'Quit lesson',
        onclick: () => { feedback('tap'); setBusy(false); router.go('/gleam/learn'); },
      }, icon('x')),
      el('div', { class: 'progress grow' }, fill),
      heartRow,
    ]),
    scroll,
    foot,
  ]));

  const api = {
    locked: () => locked,
    setReady(value) { ready = value; syncCta(); },
  };

  function syncCta() {
    const button = foot.querySelector('.btn');
    if (button) button.disabled = !ready;
  }

  function paintHearts() {
    clear(heartRow);
    if (!g.settings.hearts) return;
    for (let i = 0; i < 5; i += 1) heartRow.append(icon(i < hearts ? 'heart' : 'heartOff', 19));
  }

  function paintProgress() {
    fill.style.width = `${(index / queue.length) * 100}%`;
  }

  function step() {
    locked = false;
    ready = false;
    clear(scroll);
    clear(foot);
    paintProgress();
    paintHearts();

    if (index >= queue.length) { complete(); return; }

    const item = queue[index];
    const renderer = RENDERERS[item.t] || renderConcept;
    active = renderer(item, api);
    scroll.append(active.node);
    scroll.scrollTop = 0;

    foot.append(el('button', {
      class: 'btn btn--primary',
      text: active.gradable ? 'Check' : 'Continue',
      disabled: !ready,
      onclick: () => (active.gradable ? check() : advance()),
    }));
    syncCta();
  }

  function check() {
    const result = active.grade();
    if (!result) return;
    locked = true;
    graded += 1;
    if (result.ok) correct += 1;
    else {
      hearts = Math.max(0, hearts - 1);
      const item = queue[index];
      if (!requeued.has(item)) { requeued.add(item); queue.push(item); }
    }
    feedback(result.ok ? 'correct' : 'wrong');
    paintHearts();
    showVerdict(result);
  }

  function showVerdict(result) {
    clear(foot);
    const outOfHearts = g.settings.hearts && hearts === 0;
    foot.append(el('div', { class: `verdict verdict--${result.ok ? 'right' : 'wrong'}` }, [
      el('div', { class: 'verdict__head' }, [
        el('span', { class: 'verdict__badge' }, icon(result.ok ? 'check' : 'x')),
        el('span', { class: 'verdict__title', text: result.title }),
      ]),
      result.why && el('p', { class: 'verdict__why', style: { whiteSpace: 'pre-line' }, text: result.why }),
      result.extra || null,
      el('button', {
        class: `btn ${result.ok ? 'btn--mint' : 'btn--rose'}`,
        style: { marginTop: '4px' },
        text: outOfHearts ? 'Out of hearts — keep going anyway' : 'Continue',
        onclick: () => { if (outOfHearts) hearts = 2; advance(); },
      }),
    ]));
    foot.querySelector('.btn').focus?.();
  }

  function advance() {
    index += 1;
    feedback('tap');
    step();
  }

  function complete() {
    setBusy(false);
    const accuracy = graded ? correct / graded : 1;
    const perfect = accuracy === 1;
    const xp = lesson.xp + (perfect ? 5 : 0);
    const streakBefore = g.streak;
    const events = recordLesson(lesson.id, { correct, total: graded, xp });

    feedback('complete');
    if (perfect) confetti();
    else confetti({ count: 34 });

    clear(scroll);
    clear(foot);
    fill.style.width = '100%';
    clear(heartRow);

    const xpNode = el('b', { class: 'num', text: '0' });
    const goalEvent = events.find((e) => e.type === 'goal');
    const freezeEvent = events.find((e) => e.type === 'freeze');
    const badges = events.filter((e) => e.type === 'achievement');

    scroll.append(el('div', { class: 'done' }, [
      (() => { const i = icon(perfect ? 'crown' : 'sparkle', 92); i.classList.add('done__glyph'); return i; })(),
      el('h2', { class: 'done__title', text: perfect ? 'Flawless.' : 'Lesson done.' }),
      el('p', { class: 'done__sub', text: `${course.title} · ${lesson.title}` }),
      el('div', { class: 'done__stats' }, [
        el('div', { class: 'done__stat done__stat--xp' }, [xpNode, el('span', { text: 'XP earned' })]),
        el('div', { class: 'done__stat done__stat--acc' }, [
          el('b', { class: 'num', text: `${Math.round(accuracy * 100)}%` }), el('span', { text: 'Accuracy' }),
        ]),
        el('div', { class: 'done__stat done__stat--streak' }, [
          el('b', { class: 'num', text: String(g.streak) }), el('span', { text: 'Day streak' }),
        ]),
      ]),
      goalEvent && el('div', { class: 'eventcard' }, [
        el('span', { class: 'eventcard__icon' }, icon('flame')),
        el('div', {}, [
          el('b', { text: streakBefore === 0 ? 'Streak started' : `${goalEvent.streak} days in a row` }),
          el('span', { text: 'Daily goal hit. Come back tomorrow to keep it.' }),
        ]),
      ]),
      freezeEvent && el('div', { class: 'eventcard' }, [
        el('span', { class: 'eventcard__icon' }, icon('snow')),
        el('div', {}, [
          el('b', { text: 'Streak freeze earned' }),
          el('span', { text: `You are holding ${freezeEvent.total}. One miss will not cost you the streak.` }),
        ]),
      ]),
      ...badges.map((b) => el('div', { class: 'eventcard' }, [
        el('span', { class: 'eventcard__icon' }, icon(b.achievement.icon)),
        el('div', {}, [
          el('b', { text: b.achievement.name }),
          el('span', { text: b.achievement.note }),
        ]),
      ])),
    ]));

    countUp(xpNode, xp, { duration: 1100, format: (n) => `+${Math.round(n)}` });

    foot.append(
      el('button', {
        class: 'btn btn--primary',
        text: 'Continue',
        onclick: () => { feedback('tap'); router.go('/gleam/learn'); },
      }),
      el('button', {
        class: 'btn btn--quiet',
        text: 'Practise a conversation instead',
        onclick: () => { feedback('tap'); router.go('/gleam/practice'); },
      }),
    );
  }

  /* Desktop keyboard shortcuts: 1-6 to pick, Enter to check. */
  function onKey(event) {
    if (event.target.matches('textarea, input')) return;
    if (event.key === 'Enter') {
      const button = foot.querySelector('.btn:not(:disabled)');
      if (button) { event.preventDefault(); button.click(); }
      return;
    }
    const n = Number(event.key);
    if (n >= 1 && n <= 6) {
      const options = scroll.querySelectorAll('.choice, .token, .matchcell');
      options[n - 1]?.click();
    }
  }
  addEventListener('keydown', onKey);
  router.onLeave(() => { setBusy(false); removeEventListener('keydown', onKey); });

  step();
  return root;
}
