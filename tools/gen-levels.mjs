#!/usr/bin/env node
/* Map generator.
 *
 *   node tools/gen-levels.mjs levels > /tmp/levels.txt
 *   node tools/gen-levels.mjs chunks > /tmp/chunks.txt
 *
 * The first version of this scattered a few pillars into open rooms, which
 * played badly: with nothing to stop you, a single flick carried you clean
 * across the map. The genre wants the opposite — dense one-cell corridors so
 * every swipe is two or three cells and you are constantly choosing.
 *
 * So maps are now real mazes (recursive backtracker, then braided to knock
 * out some dead ends), and a candidate is thrown away unless its slides are
 * actually short: MAX_SLIDE and AVG_SLIDE below are the acceptance test for
 * "does this feel right", enforced rather than eyeballed.
 */

const W = 15;
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const key = (c, r) => `${c},${r}`;

/* The whole point of the rewrite. Tuned by playing: above ~7 cells a slide
 * starts to feel like the map is carrying you rather than you steering. */
const MAX_SLIDE = 7;
const AVG_SLIDE = 3.2;

/* Columns where stacked arcade chunks join. Every chunk opens at all three
 * in both its top and bottom wall row, so any chunk stacks on any other. */
const PORTS = [3, 7, 11];
const PORT_ROW = Array.from({ length: W }, (_, c) => (PORTS.includes(c) ? '.' : '#')).join('');

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ── Maze ──────────────────────────────────────────────────── */

/** Recursive backtracker on odd cells, then braid away some dead ends. */
function maze(H, rand, braidP) {
  const g = Array.from({ length: H }, () => Array(W).fill('#'));
  const inside = (c, r) => c > 0 && c < W - 1 && r > 0 && r < H - 1;

  const start = [1 + 2 * Math.floor(rand() * ((W - 1) / 2)), 1 + 2 * Math.floor(rand() * ((H - 1) / 2))];
  if (!inside(start[0], start[1])) return null;
  const seen = new Set([key(start[0], start[1])]);
  g[start[1]][start[0]] = '.';
  const stack = [start];

  while (stack.length) {
    const [c, r] = stack[stack.length - 1];
    const options = DIRS
      .map(([dc, dr]) => [c + dc * 2, r + dr * 2])
      .filter(([nc, nr]) => inside(nc, nr) && !seen.has(key(nc, nr)));
    if (!options.length) { stack.pop(); continue; }
    const [nc, nr] = options[Math.floor(rand() * options.length)];
    g[(r + nr) / 2][(c + nc) / 2] = '.';
    g[nr][nc] = '.';
    seen.add(key(nc, nr));
    stack.push([nc, nr]);
  }

  // Braiding: a pure maze is all dead ends, which makes for a lot of
  // backtracking. Opening a few gives loops and alternative routes.
  for (let r = 1; r < H - 1; r += 2) {
    for (let c = 1; c < W - 1; c += 2) {
      if (g[r][c] !== '.') continue;
      const open = DIRS.filter(([dc, dr]) => g[r + dr]?.[c + dc] === '.');
      if (open.length > 1) continue;
      if (rand() > braidP) continue;
      const walls = DIRS
        .filter(([dc, dr]) => inside(c + dc * 2, r + dr * 2) && g[r + dr][c + dc] === '#');
      if (!walls.length) continue;
      const [dc, dr] = walls[Math.floor(rand() * walls.length)];
      g[r + dr][c + dc] = '.';
    }
  }

  return g;
}

/* ── Slide mechanics ───────────────────────────────────────── */

function slide(grid, spikes, c, r, dc, dr) {
  let cc = c; let rr = r;
  const path = [];
  for (;;) {
    const tc = cc + dc; const tr = rr + dr;
    if (tr < 0 || tr >= grid.length || tc < 0 || tc >= W) break;
    if (grid[tr][tc] === '#') break;
    cc = tc; rr = tr;
    if (spikes.has(key(cc, rr))) return null;
    path.push([cc, rr]);
  }
  return path.length ? { c: cc, r: rr, path } : null;
}

/** A spike needs a wall to be bolted to, or it renders floating in mid-air. */
function anchored(grid, c, r) {
  return DIRS.some(([dc, dr]) => grid[r + dr]?.[c + dc] === undefined || grid[r + dr][c + dc] === '#');
}

function explore(grid, spikes, start) {
  const stops = new Set([key(start.c, start.r)]);
  const crossed = new Set([key(start.c, start.r)]);
  const lengths = [];
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const [dc, dr] of DIRS) {
      const move = slide(grid, spikes, cur.c, cur.r, dc, dr);
      if (!move) continue;
      lengths.push(move.path.length);
      for (const [pc, pr] of move.path) crossed.add(key(pc, pr));
      const id = key(move.c, move.r);
      if (!stops.has(id)) { stops.add(id); queue.push({ c: move.c, r: move.r }); }
    }
  }
  const max = lengths.length ? Math.max(...lengths) : 0;
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  return { stops, crossed, max, avg };
}

/** Can a slide starting from here ever touch `goalRow`? */
function canEscape(grid, spikes, start, goalRow) {
  const seen = new Set([key(start.c, start.r)]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    if (cur.r === goalRow) return true;
    for (const [dc, dr] of DIRS) {
      const move = slide(grid, spikes, cur.c, cur.r, dc, dr);
      if (!move) continue;
      for (const [, pr] of move.path) if (pr === goalRow) return true;
      const id = key(move.c, move.r);
      if (!seen.has(id)) { seen.add(id); queue.push({ c: move.c, r: move.r }); }
    }
  }
  return false;
}

/* Not just "a way out exists" — every cell you could end up on must still
 * have a way out, or the player can strand themselves by moving normally. */
function allEscape(grid, spikes, stops, goalRow) {
  for (const k of stops) {
    const [c, r] = k.split(',').map(Number);
    if (!canEscape(grid, spikes, { c, r }, goalRow)) return false;
  }
  return true;
}

function solvePar(grid, spikes, start, exit, pickups) {
  const index = new Map(pickups.map((p, i) => [key(p.c, p.r), i]));
  const full = (1 << pickups.length) - 1;
  const exitKey = key(exit.c, exit.r);
  const dist = new Map([[`${start.c},${start.r},0`, 0]]);
  const queue = [{ c: start.c, r: start.r, mask: 0 }];
  let par = Infinity;
  let reachedExit = false;

  while (queue.length) {
    const cur = queue.shift();
    const d = dist.get(`${cur.c},${cur.r},${cur.mask}`);
    for (const [dc, dr] of DIRS) {
      const move = slide(grid, spikes, cur.c, cur.r, dc, dr);
      if (!move) continue;
      let mask = cur.mask;
      let hitExit = false;
      for (const [pc, pr] of move.path) {
        const k = key(pc, pr);
        if (index.has(k)) mask |= 1 << index.get(k);
        if (k === exitKey) { hitExit = true; break; }
      }
      if (hitExit) {
        reachedExit = true;
        if (mask === full) par = Math.min(par, d + 1);
        continue;
      }
      const id = `${move.c},${move.r},${mask}`;
      if (!dist.has(id)) { dist.set(id, d + 1); queue.push({ c: move.c, r: move.r, mask }); }
    }
  }
  return { par: par === Infinity ? null : par, reachedExit };
}

/* ── Levels ────────────────────────────────────────────────── */

function buildLevel(seed, opts) {
  const rand = rng(seed);
  const H = opts.height;
  const grid = maze(H, rand, opts.braid);
  if (!grid) return null;

  const cellsAt = (rowsFromBottom) => {
    const out = [];
    for (const r of rowsFromBottom) {
      for (let c = 1; c < W - 1; c += 2) if (grid[r]?.[c] === '.') out.push({ c, r });
    }
    return out;
  };

  const startPool = cellsAt([1, 3]);
  if (!startPool.length) return null;
  const start = startPool[Math.floor(rand() * startPool.length)];

  const base = explore(grid, new Set(), start);
  if (base.max > MAX_SLIDE || base.avg > AVG_SLIDE) return null;
  if (base.stops.size < 18) return null;

  const exitPool = cellsAt([H - 2, H - 4]).filter((p) => base.crossed.has(key(p.c, p.r)));
  if (!exitPool.length) return null;
  const exit = exitPool[Math.floor(rand() * exitPool.length)];

  // Spikes go in corridors the player can see coming, never on the start cell.
  const spikes = new Set();
  const spikePool = [...base.crossed]
    .map((k) => { const [c, r] = k.split(',').map(Number); return { c, r }; })
    .filter((p) => Math.abs(p.r - start.r) > 3
      && !(p.c === exit.c && p.r === exit.r)
      && anchored(grid, p.c, p.r));
  for (let i = 0; i < opts.spikes && spikePool.length; i += 1) {
    const p = spikePool[Math.floor(rand() * spikePool.length)];
    spikes.add(key(p.c, p.r));
  }

  const after = explore(grid, spikes, start);
  if (after.max > MAX_SLIDE || after.avg > AVG_SLIDE) return null;

  const pool = [...after.crossed]
    .map((k) => { const [c, r] = k.split(',').map(Number); return { c, r }; })
    .filter((p) => !spikes.has(key(p.c, p.r))
      && !(p.c === exit.c && p.r === exit.r)
      && !(p.c === start.c && p.r === start.r));

  const pickups = [];
  for (let attempt = 0; attempt < 600 && pickups.length < opts.coins; attempt += 1) {
    const p = pool[Math.floor(rand() * pool.length)];
    if (!p) break;
    if (pickups.some((q) => Math.abs(q.c - p.c) + Math.abs(q.r - p.r) < 4)) continue;
    pickups.push(p);
  }
  if (pickups.length < opts.coins) return null;

  const { par, reachedExit } = solvePar(grid, spikes, start, exit, pickups);
  if (!reachedExit || par === null) return null;
  if (par < opts.parMin || par > opts.parMax) return null;

  const wardens = [];
  const wardenPool = pool.filter((p) => {
    if (spikes.has(key(p.c, p.r))) return false;
    if (pickups.some((q) => q.c === p.c && q.r === p.r)) return false;
    if (Math.abs(p.r - start.r) < 4) return false;
    const horiz = grid[p.r][p.c - 1] === '.' && grid[p.r][p.c + 1] === '.';
    const vert = grid[p.r - 1]?.[p.c] === '.' && grid[p.r + 1]?.[p.c] === '.';
    return horiz || vert;
  });
  for (let i = 0; i < opts.wardens && wardenPool.length; i += 1) {
    const p = wardenPool[Math.floor(rand() * wardenPool.length)];
    if (wardens.some((q) => Math.abs(q.c - p.c) + Math.abs(q.r - p.r) < 5)) continue;
    const horiz = grid[p.r][p.c - 1] === '.' && grid[p.r][p.c + 1] === '.';
    wardens.push({ ...p, axis: horiz ? '~' : '|' });
  }

  const out = grid.map((row) => [...row]);
  for (const k of spikes) { const [c, r] = k.split(',').map(Number); out[r][c] = '^'; }
  for (const w of wardens) out[w.r][w.c] = w.axis;
  pickups.forEach((p, i) => { out[p.r][p.c] = i === 0 && opts.gem ? '*' : 'o'; });
  out[exit.r][exit.c] = 'X';
  out[start.r][start.c] = 'S';

  return {
    rows: out.map((row) => row.join('')).reverse(),
    par, seed, maxSlide: after.max, avgSlide: after.avg,
  };
}

/* ── Arcade chunks ─────────────────────────────────────────── */

const CHUNK_H = 11;

function buildChunk(seed, opts) {
  const rand = rng(seed);
  const grid = maze(CHUNK_H, rand, opts.braid);
  if (!grid) return null;

  // Punch the shared ports through both wall rows so chunks always join.
  for (const c of PORTS) { grid[0][c] = '.'; grid[CHUNK_H - 1][c] = '.'; }

  const spikes = new Set();
  const reach = new Map();
  let worstMax = 0;
  let worstAvg = 0;

  // The player enters through a port on the chunk's BOTTOM and leaves through
  // the top. In generator orientation row 0 is the top, so entry is the last
  // row — getting this backwards silently verifies the wrong direction, and
  // slide reachability is not symmetric.
  for (const c of PORTS) {
    const r = explore(grid, spikes, { c, r: CHUNK_H - 1 });
    if (!allEscape(grid, spikes, r.stops, 0)) return null;
    worstMax = Math.max(worstMax, r.max);
    worstAvg = Math.max(worstAvg, r.avg);
    reach.set(c, r);
  }
  if (worstMax > MAX_SLIDE || worstAvg > AVG_SLIDE) return null;

  const crossed = new Set();
  for (const r of reach.values()) for (const k of r.crossed) crossed.add(k);
  const pool = [...crossed]
    .map((k) => { const [c, r] = k.split(',').map(Number); return { c, r }; })
    .filter((p) => p.r > 0 && p.r < CHUNK_H - 1);
  if (pool.length < 12) return null;

  const out = grid.map((row) => [...row]);
  const placed = [];
  for (let attempt = 0; attempt < 400 && placed.length < opts.coins; attempt += 1) {
    const p = pool[Math.floor(rand() * pool.length)];
    if (!p) break;
    if (placed.some((q) => Math.abs(q.c - p.c) + Math.abs(q.r - p.r) < 3)) continue;
    placed.push(p);
    out[p.r][p.c] = placed.length === 1 && opts.gem ? '*' : 'o';
  }
  if (placed.length < opts.coins) return null;

  // Hazards never sit on a port, or arriving is instant death.
  const hazardPool = pool.filter((p) => !placed.some((q) => q.c === p.c && q.r === p.r)
    && !(PORTS.includes(p.c) && (p.r === 1 || p.r === CHUNK_H - 2))
    && anchored(grid, p.c, p.r));
  let hazards = 0;
  for (let i = 0; i < opts.spikes * 4 && hazards < opts.spikes; i += 1) {
    const p = hazardPool[Math.floor(rand() * hazardPool.length)];
    if (!p || out[p.r][p.c] !== '.') continue;
    out[p.r][p.c] = '^';
    hazards += 1;
  }
  for (let i = 0; i < opts.wardens * 4; i += 1) {
    const p = hazardPool[Math.floor(rand() * hazardPool.length)];
    if (!p || out[p.r][p.c] !== '.') continue;
    const horiz = grid[p.r][p.c - 1] === '.' && grid[p.r][p.c + 1] === '.';
    const vert = grid[p.r - 1]?.[p.c] === '.' && grid[p.r + 1]?.[p.c] === '.';
    if (!horiz && !vert) continue;
    out[p.r][p.c] = horiz ? '~' : '|';
    if (--opts.wardens <= 0) break;
  }

  // Re-verify with the spikes in place: one badly placed spike can seal a
  // route that was fine a moment ago.
  const spikeSet = new Set();
  out.forEach((row, r) => row.forEach((ch, c) => { if (ch === '^') spikeSet.add(key(c, r)); }));
  for (const c of PORTS) {
    if (spikeSet.has(key(c, CHUNK_H - 1))) return null;
    const r = explore(grid, spikeSet, { c, r: CHUNK_H - 1 });
    if (!allEscape(grid, spikeSet, r.stops, 0)) return null;
  }

  return { rows: out.map((row) => row.join('')), seed, maxSlide: worstMax, avgSlide: worstAvg };
}

/* ── Recipes ───────────────────────────────────────────────── */

const LEVEL_RECIPES = [
  { name: 'Awakening', height: 21, braid: 0.55, spikes: 0, wardens: 0, coins: 4, parMin: 8, parMax: 18 },
  { name: 'Pillars', height: 21, braid: 0.5, spikes: 0, wardens: 0, coins: 5, parMin: 10, parMax: 20 },
  { name: 'The Shaft', height: 23, braid: 0.5, spikes: 0, wardens: 1, coins: 5, parMin: 11, parMax: 22 },
  { name: 'Teeth', height: 23, braid: 0.45, spikes: 3, wardens: 0, coins: 5, parMin: 12, parMax: 24 },
  { name: 'The Warden', height: 25, braid: 0.45, spikes: 0, wardens: 3, coins: 6, parMin: 13, parMax: 26 },
  { name: 'Switchback', height: 25, braid: 0.4, spikes: 3, wardens: 2, coins: 6, parMin: 14, parMax: 28 },
  { name: 'Crossfire', height: 27, braid: 0.4, spikes: 3, wardens: 3, coins: 6, parMin: 15, parMax: 30 },
  { name: 'The Gauntlet', height: 27, braid: 0.38, spikes: 5, wardens: 3, coins: 7, parMin: 16, parMax: 32, gem: true },
  { name: 'Hollow', height: 29, braid: 0.38, spikes: 4, wardens: 3, coins: 7, parMin: 17, parMax: 34 },
  { name: 'Ossuary', height: 29, braid: 0.35, spikes: 6, wardens: 4, coins: 7, parMin: 18, parMax: 36, gem: true },
  { name: 'Descent', height: 31, braid: 0.35, spikes: 6, wardens: 4, coins: 8, parMin: 19, parMax: 38 },
  { name: 'The Tomb', height: 31, braid: 0.36, spikes: 6, wardens: 4, coins: 7, parMin: 18, parMax: 70, gem: true },
];

const CHUNK_RECIPES = [
  { tier: 0, braid: 0.6, spikes: 0, wardens: 0, coins: 4 },
  { tier: 0, braid: 0.55, spikes: 0, wardens: 0, coins: 4 },
  { tier: 0, braid: 0.5, spikes: 0, wardens: 0, coins: 5 },
  { tier: 0, braid: 0.5, spikes: 0, wardens: 0, coins: 4 },
  { tier: 1, braid: 0.45, spikes: 2, wardens: 0, coins: 4 },
  { tier: 1, braid: 0.42, spikes: 1, wardens: 1, coins: 5 },
  { tier: 1, braid: 0.42, spikes: 2, wardens: 1, coins: 4 },
  { tier: 1, braid: 0.4, spikes: 2, wardens: 1, coins: 5, gem: true },
  { tier: 2, braid: 0.38, spikes: 3, wardens: 2, coins: 4 },
  { tier: 2, braid: 0.35, spikes: 4, wardens: 1, coins: 5 },
  { tier: 2, braid: 0.35, spikes: 3, wardens: 2, coins: 5, gem: true },
  { tier: 2, braid: 0.32, spikes: 4, wardens: 2, coins: 4 },
];

const what = process.argv[2] || 'levels';
let seed = 7;

if (what === 'levels') {
  LEVEL_RECIPES.forEach((recipe, i) => {
    let made = null;
    let tries = 0;
    while (!made && tries < 200000) { made = buildLevel(seed++, recipe); tries += 1; }
    if (!made) { console.error(`// ${recipe.name}: no candidate`); return; }
    console.log(`  {`);
    console.log(`    id: 'l${i + 1}', name: '${recipe.name}', par: ${made.par},`);
    console.log(`    // slides: max ${made.maxSlide}, avg ${made.avgSlide.toFixed(1)}`);
    console.log(`    rows: [`);
    for (const row of made.rows) console.log(`      '${row}',`);
    console.log(`    ],`);
    console.log(`  },`);
  });
} else {
  console.log(`export const CHUNK_W = ${W};`);
  console.log(`export const CHUNK_H = ${CHUNK_H};`);
  console.log(`export const PORT_ROW = '${PORT_ROW}';`);
  console.log('');
  console.log('export const CHUNKS = [');
  CHUNK_RECIPES.forEach((recipe) => {
    let made = null;
    let tries = 0;
    while (!made && tries < 200000) { made = buildChunk(seed++, { ...recipe }); tries += 1; }
    if (!made) { console.error(`// tier ${recipe.tier}: no candidate`); return; }
    console.log(`  {`);
    console.log(`    tier: ${recipe.tier},   // slides: max ${made.maxSlide}, avg ${made.avgSlide.toFixed(1)}`);
    console.log(`    rows: [`);
    for (const row of made.rows) console.log(`      '${row}',`);
    console.log(`    ],`);
    console.log(`  },`);
  });
  console.log('];');
}
