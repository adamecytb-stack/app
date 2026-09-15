/* Scarab progress: level stars, arcade high scores, banked gold, settings. */

import { slice, save } from '../../core/store.js';
import { LEVELS } from './levels.js';

export const s = slice('scarab', {
  levels: {},          // levelId -> { stars, bestSlides, coins, done }
  arcade: { best: 0, bestHeight: 0, runs: 0 },
  gold: 0,
  totalDeaths: 0,
  settings: { music: true, sfx: true, haptics: true, southpaw: false },
  seenIntro: false,
});

export function levelRecord(id) {
  return s.levels[id] || null;
}

export function totalStars() {
  return Object.values(s.levels).reduce((sum, r) => sum + (r.stars || 0), 0);
}

export function maxStars() { return LEVELS.length * 3; }

/** A level opens once the one before it is cleared. */
export function levelUnlocked(index) {
  if (index === 0) return true;
  return Boolean(s.levels[LEVELS[index - 1].id]?.done);
}

export function nextLevelIndex() {
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (!s.levels[LEVELS[i].id]?.done) return i;
  }
  return LEVELS.length - 1;
}

/** Returns { stars, improved, firstClear } so the results screen can react. */
export function recordLevel(level, { slides, coins, totalCoins }) {
  const prev = s.levels[level.id];
  let stars = 1;
  if (coins >= totalCoins) stars += 1;
  if (slides <= level.par) stars += 1;

  const firstClear = !prev?.done;
  const improved = stars > (prev?.stars ?? 0);

  s.levels[level.id] = {
    done: true,
    stars: Math.max(stars, prev?.stars ?? 0),
    bestSlides: Math.min(slides, prev?.bestSlides ?? Infinity),
    coins: Math.max(coins, prev?.coins ?? 0),
  };
  s.gold += coins;
  save();
  return { stars, improved, firstClear };
}

/** Returns { record } so the results screen can celebrate a new best. */
export function recordArcade({ score, height, coins }) {
  const record = score > s.arcade.best;
  s.arcade.best = Math.max(s.arcade.best, score);
  s.arcade.bestHeight = Math.max(s.arcade.bestHeight, height);
  s.arcade.runs += 1;
  s.gold += coins;
  save();
  return { record };
}

export function recordDeath() {
  s.totalDeaths += 1;
  save();
}

export function summary() {
  return {
    stars: totalStars(),
    maxStars: maxStars(),
    best: s.arcade.best,
    gold: s.gold,
    cleared: Object.values(s.levels).filter((r) => r.done).length,
    levels: LEVELS.length,
  };
}
