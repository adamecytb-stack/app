#!/usr/bin/env node
/* Level designer's assistant.
 *
 *   node tools/gen-levels.mjs > /tmp/levels.txt
 *
 * Hand-drawing mazes for slide movement is deceptively hard: you can only
 * stop where a wall stops you, so most pretty layouts turn out to have
 * uncollectable coins or an unreachable exit. This proposes candidates,
 * throws away everything the solver rejects, and prints the survivors with
 * their true optimal par. The output is pasted into levels.js by hand so the
 * shipped content stays readable and reviewable.
 */

const W = 15;
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const key = (c, r) => `${c},${r}`;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

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

/** Cells you can stop on, and every cell you can pass over, from `start`. */
function explore(grid, spikes, start) {
  const stops = new Set([key(start.c, start.r)]);
  const crossed = new Set([key(start.c, start.r)]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const [dc, dr] of DIRS) {
      const move = slide(grid, spikes, cur.c, cur.r, dc, dr);
      if (!move) continue;
      for (const [pc, pr] of move.path) crossed.add(key(pc, pr));
      const id = key(move.c, move.r);
      if (!stops.has(id)) { stops.add(id); queue.push({ c: move.c, r: move.r }); }
    }
  }
  return { stops, crossed };
}

/** Exact minimum slides to take every pickup and then cross the exit. */
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

function build(seed, opts) {
  const rand = rng(seed);
  const H = opts.height;
  const grid = [];
  for (let r = 0; r < H; r += 1) {
    grid.push(Array.from({ length: W }, (_, c) => (
      r === 0 || r === H - 1 || c === 0 || c === W - 1 ? '#' : '.'
    )));
  }

  // Mirrored pillars, so the result reads as designed rather than sprayed.
  for (let r = 2; r < H - 2; r += 1) {
    for (let c = 1; c <= 7; c += 1) {
      if (rand() < opts.density) {
        grid[r][c] = '#';
        grid[r][W - 1 - c] = '#';
      }
    }
  }

  const open = [];
  for (let r = 1; r < H - 1; r += 1) for (let c = 1; c < W - 1; c += 1) if (grid[r][c] === '.') open.push({ c, r });
  if (open.length < H * 6) return null;

  // Spikes go down before anything else, since they shrink what is reachable.
  const spikes = new Set();
  const mid = open.filter((p) => p.r > 1 && p.r < H - 2);
  for (let i = 0; i < opts.spikes && mid.length; i += 1) {
    const p = mid[Math.floor(rand() * mid.length)];
    spikes.add(key(p.c, p.r));
    if (p.c !== W - 1 - p.c) spikes.add(key(W - 1 - p.c, p.r));
  }

  const startCandidates = open.filter((p) => p.r <= 2 && !spikes.has(key(p.c, p.r)));
  // Exit sits in the top fifth so a level always reads as a climb.
  if (!startCandidates.length) return null;
  const start = startCandidates[Math.floor(rand() * startCandidates.length)];

  const { stops, crossed } = explore(grid, spikes, start);
  if (crossed.size < open.length * 0.55) return null;

  const cross = [...crossed].map((k) => {
    const [c, r] = k.split(',').map(Number);
    return { c, r };
  }).filter((p) => !spikes.has(key(p.c, p.r)));

  const exits = cross.filter((p) => p.r >= H - 4 && !(p.c === start.c && p.r === start.r));
  if (!exits.length) return null;
  const exit = exits[Math.floor(rand() * exits.length)];

  // Spread the pickups out so a level isn't three coins in one corner.
  const pool = cross.filter((p) => !(p.c === exit.c && p.r === exit.r) && !(p.c === start.c && p.r === start.r));
  const pickups = [];
  for (let attempt = 0; attempt < 400 && pickups.length < opts.coins; attempt += 1) {
    const p = pool[Math.floor(rand() * pool.length)];
    if (!p) break;
    if (pickups.some((q) => Math.abs(q.c - p.c) + Math.abs(q.r - p.r) < 3)) continue;
    pickups.push(p);
  }
  if (pickups.length < opts.coins) return null;

  const { par, reachedExit } = solvePar(grid, spikes, start, exit, pickups);
  if (!reachedExit || par === null) return null;
  if (par < opts.parMin || par > opts.parMax) return null;

  // Wardens patrol open runs; they move, so they never affect solvability.
  const wardens = [];
  const runs = cross.filter((p) => {
    if (spikes.has(key(p.c, p.r))) return false;
    if (pickups.some((q) => q.c === p.c && q.r === p.r)) return false;
    if (p.c === exit.c && p.r === exit.r) return false;
    if (Math.abs(p.r - start.r) < 2) return false;
    const horiz = grid[p.r][p.c - 1] === '.' && grid[p.r][p.c + 1] === '.';
    const vert = grid[p.r - 1]?.[p.c] === '.' && grid[p.r + 1]?.[p.c] === '.';
    return horiz || vert;
  });
  for (let i = 0; i < opts.wardens && runs.length; i += 1) {
    const p = runs[Math.floor(rand() * runs.length)];
    if (wardens.some((q) => Math.abs(q.c - p.c) + Math.abs(q.r - p.r) < 4)) continue;
    const horiz = grid[p.r][p.c - 1] === '.' && grid[p.r][p.c + 1] === '.';
    wardens.push({ ...p, axis: horiz ? '~' : '|' });
  }

  // Paint the symbols in and emit top-to-bottom.
  const out = grid.map((row) => [...row]);
  for (const k of spikes) { const [c, r] = k.split(',').map(Number); out[r][c] = '^'; }
  for (const w of wardens) out[w.r][w.c] = w.axis;
  pickups.forEach((p, i) => { out[p.r][p.c] = i === 0 && opts.gem ? '*' : 'o'; });
  out[exit.r][exit.c] = 'X';
  out[start.r][start.c] = 'S';

  return { rows: out.map((row) => row.join('')).reverse(), par, seed, pickups: pickups.length };
}

/* Heights climb from 20 to 32 rows. Anything shorter leaves a portrait phone
 * mostly empty, because 15 columns caps how large a cell can be. */
const RECIPES = [
  { name: 'Awakening', height: 20, density: 0.10, spikes: 0, wardens: 0, coins: 4, parMin: 6, parMax: 9 },
  { name: 'Pillars', height: 21, density: 0.15, spikes: 0, wardens: 0, coins: 5, parMin: 8, parMax: 11 },
  { name: 'The Shaft', height: 22, density: 0.17, spikes: 0, wardens: 0, coins: 5, parMin: 9, parMax: 12 },
  { name: 'Teeth', height: 22, density: 0.16, spikes: 4, wardens: 0, coins: 5, parMin: 9, parMax: 13 },
  { name: 'The Warden', height: 23, density: 0.16, spikes: 0, wardens: 3, coins: 6, parMin: 10, parMax: 14 },
  { name: 'Switchback', height: 24, density: 0.20, spikes: 3, wardens: 2, coins: 6, parMin: 11, parMax: 15 },
  { name: 'Crossfire', height: 25, density: 0.18, spikes: 3, wardens: 4, coins: 6, parMin: 12, parMax: 16 },
  { name: 'The Gauntlet', height: 26, density: 0.20, spikes: 5, wardens: 3, coins: 7, parMin: 13, parMax: 17, gem: true },
  { name: 'Hollow', height: 27, density: 0.22, spikes: 4, wardens: 3, coins: 7, parMin: 14, parMax: 18 },
  { name: 'Ossuary', height: 28, density: 0.22, spikes: 6, wardens: 4, coins: 7, parMin: 15, parMax: 19, gem: true },
  { name: 'Descent', height: 30, density: 0.23, spikes: 7, wardens: 4, coins: 8, parMin: 16, parMax: 21 },
  { name: 'The Tomb', height: 32, density: 0.23, spikes: 8, wardens: 5, coins: 8, parMin: 17, parMax: 23, gem: true },
];

let seed = 1;
RECIPES.forEach((recipe, i) => {
  let made = null;
  let tries = 0;
  while (!made && tries < 60000) { made = build(seed++, recipe); tries += 1; }
  if (!made) { console.log(`// ${recipe.name}: no candidate found`); return; }
  console.log(`  {`);
  console.log(`    id: 'l${i + 1}', name: '${recipe.name}', par: ${made.par},`);
  console.log(`    rows: [`);
  for (const row of made.rows) console.log(`      '${row}',`);
  console.log(`    ],`);
  console.log(`  },`);
});
