/* The learn tab: daily goal, then a winding path of lesson nodes per course. */

import { el, icon, feedback, toast } from '../../core/ui.js';
import * as router from '../../core/router.js';
import {
  g, rollDay, goalProgress, goalMet, nextLesson,
  courseUnlocked, courseProgress, isLessonUnlocked, courseSequence,
} from './state.js';
import { tabScreen } from './index.js';

/* The path snakes so it reads as a journey rather than a list. */
const OFFSETS = [0, 44, 68, 44, 0, -44, -68, -44];

function goalCard() {
  const pct = goalProgress();
  const fill = el('div', { class: 'progress__fill' });
  requestAnimationFrame(() => { fill.style.width = `${pct * 100}%`; });

  return el('div', { class: 'goalcard' }, [
    el('div', { class: 'goalcard__top' }, [
      el('span', { class: 'goalcard__label', text: 'Today' }),
      el('span', { class: 'goalcard__val num', text: `${g.xpToday} / ${g.profile.dailyGoalXp} XP` }),
    ]),
    el('div', { class: 'progress' }, fill),
    goalMet()
      ? el('div', { class: 'goalcard__done' }, [icon('check'), `Day ${g.streak} banked. Anything else is a bonus.`])
      : el('div', { class: 'small', style: { marginTop: '10px' } , text: g.streak > 0
        ? `${g.profile.dailyGoalXp - g.xpToday} XP to keep a ${g.streak}-day streak alive.`
        : 'Finish today to start a streak.' }),
  ]);
}

function lessonNode(lesson, { current }) {
  const done = Boolean(g.progress[lesson.id]?.done);
  const unlocked = isLessonUnlocked(lesson);
  const perfect = (g.progress[lesson.id]?.best ?? 0) === 1;

  const cls = ['node'];
  if (done) cls.push('node--done');
  else if (current) cls.push('node--current');
  if (!unlocked && !done) cls.push('node--locked');

  const glyph = done ? icon('check', 28) : unlocked ? icon('play', 26) : icon('lock', 24);

  return el('button', {
    class: cls.join(' '),
    onclick: () => {
      feedback('tap');
      if (!unlocked && !done) {
        toast('Finish the lesson before this one first.', { icon: '🔒' });
        return;
      }
      router.go(`/gleam/lesson/${lesson.id}`);
    },
  }, [
    el('div', { class: 'node__disc' }, [
      current && !done && el('span', { class: 'node__pulse' }),
      current && !done && el('span', { class: 'node__start', text: 'Start' }),
      perfect && (() => { const c = icon('crown', 20); c.classList.add('node__crown'); return c; })(),
      glyph,
    ]),
    el('div', { class: 'node__label', text: lesson.title }),
  ]);
}

function unitBlock(course, upNext, { position, previous }) {
  const unlocked = courseUnlocked(course);
  const { done, total, ratio } = courseProgress(course);

  const meterFill = el('div', { class: 'unit__meterFill' });
  requestAnimationFrame(() => { meterFill.style.width = `${ratio * 100}%`; });

  const head = el('div', {
    class: 'unit__head',
    style: unlocked ? { background: `linear-gradient(140deg, ${course.color}, ${shade(course.color, -26)})` } : {},
  }, [
    el('div', { class: 'unit__kicker', text: unlocked ? `Course ${position + 1}` : 'Locked' }),
    el('div', { class: 'unit__title', text: course.title }),
    el('div', { class: 'unit__sub', text: course.subtitle }),
    el('div', { class: 'unit__meter' }, [
      el('span', { class: 'num', text: `${done}/${total}` }),
      el('div', { class: 'unit__meterTrack' }, meterFill),
    ]),
  ]);

  const rows = course.lessons.map((lesson, i) => el('div', {
    class: 'path__row',
    style: { transform: `translateX(${OFFSETS[i % OFFSETS.length]}px)` },
  }, lessonNode(lesson, { current: upNext && lesson.id === upNext.id })));

  return el('section', { class: `unit${unlocked ? '' : ' unit--locked'}` }, [
    head,
    unlocked
      ? el('div', { class: 'path' }, rows)
      : el('p', { class: 'small center', style: { padding: '0 var(--gutter)' }, text: `Clear half of ${previous?.title ?? 'the previous course'} to open this.` }),
  ]);
}

/** Darken a hex colour for the unit header gradient. */
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 255) + amount);
  const gg = clamp(((n >> 8) & 255) + amount);
  const b = clamp((n & 255) + amount);
  return `#${((r << 16) | (gg << 8) | b).toString(16).padStart(6, '0')}`;
}

export function learnScreen() {
  rollDay();
  const courses = courseSequence();
  const upNext = nextLesson();

  return tabScreen('learn', [
    goalCard(),
    ...courses.map((course, i) => unitBlock(course, upNext, { position: i, previous: courses[i - 1] })),
    el('p', {
      class: 'small center',
      style: { padding: '10px var(--gutter) 0' },
      text: 'Finished everything? Replays still earn XP and keep the streak alive.',
    }),
  ]);
}
