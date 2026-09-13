/* Gleam's progress model: XP, daily goal, streak (with freezes), league,
 * achievements, per-lesson mastery. Everything is local to the device. */

import { slice, save } from '../../core/store.js';
import { COURSES, lessonById, courseById, allLessons } from '../../../data/gleam/courses.js';

/* Bumped when the course library is rewritten, so progress pointing at
 * lessons that no longer exist gets cleaned up instead of inflating stats. */
const CONTENT_VERSION = 2;

export const g = slice('gleam', {
  contentVersion: CONTENT_VERSION,
  onboarded: false,
  onboardStep: 0,
  profile: {
    name: '',
    goals: [],
    blockers: [],
    situations: [],
    selfRating: 3,
    frequency: '',
    energy: '',
    biggestWin: '',
    dailyGoalXp: 30,
    baselineScore: 0,
    committedAt: null,
  },
  settings: { hearts: false, requireStreakGoal: true, practiceMode: 'scripted' },
  courseOrder: [],
  xp: 0,
  xpToday: 0,
  todayKey: null,
  history: {},
  streak: 0,
  longest: 0,
  lastGoalDay: null,
  goalDaysSinceFreeze: 0,
  freezes: 0,
  freezeLog: [],
  progress: {},
  practice: {},
  achievements: {},
  stats: { lessonsDone: 0, exercisesDone: 0, correct: 0, perfect: 0, practiceRuns: 0, aiRuns: 0 },
  league: null,
});

/* Drop progress for lessons and scenarios that no longer exist. XP, streak
 * and achievements are kept — those were still earned. */
(function migrateContent() {
  if (g.contentVersion === CONTENT_VERSION) return;

  const known = new Set(allLessons().map((l) => l.id));
  let dropped = 0;
  for (const id of Object.keys(g.progress)) {
    if (!known.has(id)) { delete g.progress[id]; dropped += 1; }
  }
  if (dropped) {
    g.stats.lessonsDone = Math.max(0, g.stats.lessonsDone - dropped);
    g.stats.perfect = 0;
  }
  g.practice = {};
  g.courseOrder = [];
  g.contentVersion = CONTENT_VERSION;
  save();
}());

/* ── Dates ─────────────────────────────────────────────────── */

export function dayKey(date = new Date()) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a, b) {
  return Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86400000);
}

/** Roll the day over: bank yesterday, decide whether the streak survives. */
export function rollDay() {
  const today = dayKey();
  if (g.todayKey === today) return;

  if (g.todayKey) {
    const gap = daysBetween(g.todayKey, today);
    // Every whole day between the last active day and today that did not meet
    // the goal either burns a freeze or breaks the streak.
    for (let i = 1; i < gap; i += 1) {
      const missed = dayKey(new Date(Date.parse(`${g.todayKey}T00:00:00`) + i * 86400000));
      if (g.streak > 0 && g.freezes > 0) {
        g.freezes -= 1;
        g.freezeLog.push(missed);
      } else {
        g.streak = 0;
        break;
      }
    }
    if (gap >= 1 && g.lastGoalDay !== g.todayKey && g.streak > 0) {
      // The last active day itself never reached the goal.
      if (g.freezes > 0) { g.freezes -= 1; g.freezeLog.push(g.todayKey); }
      else g.streak = 0;
    }
  }

  g.todayKey = today;
  g.xpToday = 0;
  save();
}

export function goalMet() {
  return g.xpToday >= g.profile.dailyGoalXp;
}

export function goalProgress() {
  return Math.min(1, g.xpToday / Math.max(1, g.profile.dailyGoalXp));
}

/* ── XP ────────────────────────────────────────────────────── */

export function addXp(amount, { source = 'lesson' } = {}) {
  rollDay();
  const before = goalMet();
  g.xp += amount;
  g.xpToday += amount;
  g.history[g.todayKey] = (g.history[g.todayKey] || 0) + amount;
  leagueSelfXp(amount);

  const events = [];
  if (!before && goalMet()) events.push(...completeGoalDay());
  events.push(...checkAchievements({ source }));
  save();
  return events;
}

function completeGoalDay() {
  const events = [];
  if (g.lastGoalDay === g.todayKey) return events;

  const yesterday = dayKey(new Date(Date.now() - 86400000));
  g.streak = g.lastGoalDay === yesterday || g.freezeLog.includes(yesterday) ? g.streak + 1 : 1;
  g.lastGoalDay = g.todayKey;
  g.longest = Math.max(g.longest, g.streak);
  events.push({ type: 'goal', streak: g.streak });

  g.goalDaysSinceFreeze += 1;
  if (g.goalDaysSinceFreeze >= 3 && g.freezes < 2) {
    g.goalDaysSinceFreeze = 0;
    g.freezes += 1;
    events.push({ type: 'freeze', total: g.freezes });
  }
  return events;
}

/* ── Lessons ───────────────────────────────────────────────── */

export function lessonState(id) {
  return g.progress[id] || null;
}

/** Courses in the order onboarding chose, falling back to the authored order. */
export function courseSequence() {
  if (!g.courseOrder?.length) return COURSES;
  const byId = new Map(COURSES.map((c) => [c.id, c]));
  const out = g.courseOrder.map((id) => byId.get(id)).filter(Boolean);
  for (const c of COURSES) if (!out.includes(c)) out.push(c);
  return out;
}

export function isLessonUnlocked(lesson) {
  const course = COURSES.find((c) => c.id === lesson.courseId);
  if (!course) return false;
  const index = course.lessons.findIndex((l) => l.id === lesson.id);
  if (index <= 0) return courseUnlocked(course);
  const prev = course.lessons[index - 1];
  return Boolean(g.progress[prev.id]?.done);
}

export function courseUnlocked(course) {
  const sequence = courseSequence();
  const index = sequence.findIndex((c) => c.id === course.id);
  if (index <= 0) return true;
  const prev = sequence[index - 1];
  // A course opens once you've cleared over half of the one before it.
  const done = prev.lessons.filter((l) => g.progress[l.id]?.done).length;
  return done >= Math.ceil(prev.lessons.length / 2);
}

export function courseProgress(course) {
  const done = course.lessons.filter((l) => g.progress[l.id]?.done).length;
  return { done, total: course.lessons.length, ratio: done / course.lessons.length };
}

export function nextLesson() {
  for (const course of courseSequence()) {
    if (!courseUnlocked(course)) continue;
    for (const lesson of course.lessons) {
      if (!g.progress[lesson.id]?.done) return lesson;
    }
  }
  // Everything done — surface the weakest lesson for a refresher.
  return allLessons().slice().sort((a, b) => (g.progress[a.id]?.best ?? 1) - (g.progress[b.id]?.best ?? 1))[0];
}

export function recordLesson(lessonId, { correct, total, xp }) {
  rollDay();
  const accuracy = total ? correct / total : 0;
  const prev = g.progress[lessonId];
  g.progress[lessonId] = {
    done: true,
    best: Math.max(prev?.best ?? 0, accuracy),
    times: (prev?.times ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  if (!prev) g.stats.lessonsDone += 1;
  g.stats.exercisesDone += total;
  g.stats.correct += correct;
  if (accuracy === 1) g.stats.perfect += 1;
  return addXp(xp, { source: 'lesson' });
}

export function recordPractice(scenarioId, { score, ai = false }) {
  rollDay();
  const prev = g.practice[scenarioId];
  g.practice[scenarioId] = {
    times: (prev?.times ?? 0) + 1,
    best: Math.max(prev?.best ?? 0, score),
    lastAt: new Date().toISOString(),
  };
  g.stats.practiceRuns += 1;
  if (ai) g.stats.aiRuns += 1;
  return addXp(Math.round(10 + score * 15), { source: 'practice' });
}

/* ── Achievements ──────────────────────────────────────────── */

export const ACHIEVEMENTS = [
  { id: 'first-step', name: 'First Words', note: 'Finish your first lesson', icon: 'sparkle', test: () => g.stats.lessonsDone >= 1 },
  { id: 'streak-3', name: 'Three in a Row', note: 'Hit a 3-day streak', icon: 'flame', test: () => g.longest >= 3 },
  { id: 'streak-7', name: 'Week Solid', note: 'Hit a 7-day streak', icon: 'flame', test: () => g.longest >= 7 },
  { id: 'streak-30', name: 'Month Deep', note: 'Hit a 30-day streak', icon: 'flame', test: () => g.longest >= 30 },
  { id: 'xp-500', name: 'Warming Up', note: 'Earn 500 XP', icon: 'bolt', test: () => g.xp >= 500 },
  { id: 'xp-2500', name: 'In Flow', note: 'Earn 2,500 XP', icon: 'bolt', test: () => g.xp >= 2500 },
  { id: 'perfect-5', name: 'Flawless Five', note: 'Ace 5 lessons with no mistakes', icon: 'star', test: () => g.stats.perfect >= 5 },
  { id: 'course-1', name: 'Course Cleared', note: 'Finish every lesson in a course', icon: 'medal', test: () => COURSES.some((c) => courseProgress(c).ratio === 1) },
  { id: 'course-all', name: 'The Whole Room', note: 'Finish every course', icon: 'crown', test: () => COURSES.every((c) => courseProgress(c).ratio === 1) },
  { id: 'practice-5', name: 'Dress Rehearsal', note: 'Run 5 practice conversations', icon: 'chat', test: () => g.stats.practiceRuns >= 5 },
  { id: 'practice-25', name: 'Table Ready', note: 'Run 25 practice conversations', icon: 'chat', test: () => g.stats.practiceRuns >= 25 },
  { id: 'early', name: 'Before the World', note: 'Finish a lesson before 8am', icon: 'clock', test: () => new Date().getHours() < 8 && g.stats.lessonsDone >= 1 },
  { id: 'night', name: 'Night Shift', note: 'Finish a lesson after 11pm', icon: 'clock', test: () => new Date().getHours() >= 23 && g.stats.lessonsDone >= 1 },
];

function checkAchievements() {
  const events = [];
  for (const a of ACHIEVEMENTS) {
    if (g.achievements[a.id]) continue;
    let earned = false;
    try { earned = a.test(); } catch { earned = false; }
    if (earned) {
      g.achievements[a.id] = new Date().toISOString();
      events.push({ type: 'achievement', achievement: a });
    }
  }
  return events;
}

/* ── League ────────────────────────────────────────────────────
 * No server, so rivals are simulated: a deterministic roster per week whose
 * XP curves are seeded from the week number, ticking forward in real time.
 * It is fake competition, and it still works on the part of your brain that
 * does not want to be twelfth. */

export const TIERS = [
  { name: 'Bronze', color: '#C98A5A' },
  { name: 'Silver', color: '#C8CBD4' },
  { name: 'Gold', color: '#F5C542' },
  { name: 'Sapphire', color: '#63C6F5' },
  { name: 'Ruby', color: '#FF6B7A' },
  { name: 'Obsidian', color: '#9A86FF' },
  { name: 'Diamond', color: '#8DE9E0' },
];

const BOT_NAMES = [
  'Marisol', 'Dev', 'Ines', 'Tobias', 'Nia', 'Rafa', 'Юля', 'Kenji',
  'Priya', 'Odette', 'Sam', 'Beatriz', 'Léo', 'Hana', 'Cyrus', 'Wren',
  'Amara', 'Nikolai', 'Freya', 'Malik', 'Junie', 'Oskar', 'Talia', 'Bo',
];

export function weekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function seeded(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function weekStart(date = new Date()) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

export function ensureLeague() {
  const wk = weekKey();
  if (g.league && g.league.week === wk) return g.league;

  let tier = g.league?.tier ?? 0;
  if (g.league) {
    const finished = leagueBoard(g.league);
    const rank = finished.findIndex((r) => r.you) + 1;
    if (rank > 0 && rank <= 3) tier = Math.min(TIERS.length - 1, tier + 1);
    else if (rank >= finished.length - 2) tier = Math.max(0, tier - 1);
  }

  const rng = seeded(hash(wk + tier));
  const roster = [];
  const pool = [...BOT_NAMES];
  for (let i = 0; i < 11; i += 1) {
    const name = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    roster.push({
      name,
      // Higher tiers grind harder. Pace is XP per day.
      pace: Math.round((14 + rng() * 46) * (1 + tier * 0.34)),
      jitter: rng(),
    });
  }

  g.league = { week: wk, tier, bots: roster, selfXp: 0, lastTier: g.league?.tier ?? tier };
  save();
  return g.league;
}

function leagueSelfXp(amount) {
  const league = ensureLeague();
  league.selfXp += amount;
}

export function leagueBoard(league = ensureLeague()) {
  const start = weekStart();
  const elapsedDays = Math.min(7, Math.max(0.15, (Date.now() - start.getTime()) / 86400000));
  const rows = league.bots.map((bot) => {
    // A gentle S-curve plus per-bot noise, so the board moves through the week.
    const wobble = 0.78 + bot.jitter * 0.5;
    return { name: bot.name, xp: Math.round(bot.pace * elapsedDays * wobble), you: false };
  });
  rows.push({ name: 'You', xp: league.selfXp, you: true });
  rows.sort((a, b) => b.xp - a.xp || (a.you ? -1 : 1));
  return rows;
}

export function leagueEndsIn() {
  const end = weekStart().getTime() + 7 * 86400000;
  const ms = Math.max(0, end - Date.now());
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

/* ── Summary for the hub card ──────────────────────────────── */

export function summary() {
  rollDay();
  const total = allLessons().length;
  const done = Object.values(g.progress).filter((p) => p.done).length;
  return {
    onboarded: g.onboarded,
    streak: g.streak,
    xp: g.xp,
    xpToday: g.xpToday,
    goal: g.profile.dailyGoalXp,
    goalMet: goalMet(),
    done,
    total,
    next: nextLesson(),
  };
}

export { COURSES, lessonById, courseById, allLessons };
