#!/usr/bin/env node
/* Proves Scarab's content is actually playable.
 *
 *   node tools/check-levels.mjs          report every level and chunk
 *   node tools/check-levels.mjs --check  exit non-zero if anything is broken
 *
 * Levels: breadth-first search over slide moves with a collectible bitmask,
 * so the reported par is the genuine optimum for taking everything and then
 * leaving — the third star is only fair if this number is right.
 *
 * Chunks: the arcade stacks these at random, so each one must be escapable
 * from ANY cell on the corridor below it. One unescapable chunk is a run
 * that ends in a wall through no fault of the player.
 */
import { LEVELS, parseGrid } from '../js/apps/scarab/levels.js';
import {
  CHUNKS, CHUNK_W, CHUNK_H, PORT_ROW,
} from '../js/apps/scarab/chunks.js';

const PORTS = [...PORT_ROW].map((ch, i) => (ch === '.' ? i : -1)).filter((i) => i >= 0);

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const key = (c, r) => `${c},${r}`;

/** Slide until a wall. Returns null if the path crosses a spike (= death). */
function slide(grid, spikes, c, r, dc, dr) {
  let cc = c;
  let rr = r;
  const path = [];
  for (;;) {
    const tc = cc + dc;
    const tr = rr + dr;
    if (tr < 0 || tr >= grid.length || tc < 0 || tc >= grid[0].length) break;
    if (grid[tr][tc] === '#') break;
    cc = tc; rr = tr;
    if (spikes.has(key(cc, rr))) return null;
    path.push([cc, rr]);
  }
  if (!path.length) return null;
  return { c: cc, r: rr, path };
}

function analyseLevel(level) {
  const world = parseGrid(level.rows);
  const { grid, start, exit } = world;
  const spikes = new Set(world.spikes.map((p) => key(p.c, p.r)));

  const pickups = [...world.coins, ...world.gems];
  const index = new Map(pickups.map((p, i) => [key(p.c, p.r), i]));
  const full = (1 << pickups.length) - 1;
  const exitKey = exit ? key(exit.c, exit.r) : null;

  const problems = [];
  if (!exit) problems.push('no exit');
  if (pickups.length > 16) problems.push(`${pickups.length} collectibles is too many to verify`);
  if (problems.length) return { problems };

  // BFS over (cell, collected) where crossing the exit is terminal.
  const startState = `${start.c},${start.r},0`;
  const dist = new Map([[startState, 0]]);
  const from = new Map();
  const queue = [{ c: start.c, r: start.r, mask: 0 }];
  let par = Infinity;
  let minToExit = Infinity;
  let bestMask = 0;
  let winFrom = null;
  let winDir = null;
  let maxSlide = 0;
  let slideSum = 0;
  let slideCount = 0;

  while (queue.length) {
    const cur = queue.shift();
    const id0 = `${cur.c},${cur.r},${cur.mask}`;
    const d = dist.get(id0);

    for (const [dc, dr] of DIRS) {
      const move = slide(grid, spikes, cur.c, cur.r, dc, dr);
      if (!move) continue;
      maxSlide = Math.max(maxSlide, move.path.length);
      slideSum += move.path.length;
      slideCount += 1;

      let mask = cur.mask;
      let crossesExit = false;
      for (const [pc, pr] of move.path) {
        const k = key(pc, pr);
        if (index.has(k)) mask |= 1 << index.get(k);
        if (k === exitKey) { crossesExit = true; break; }
      }

      if (crossesExit) {
        minToExit = Math.min(minToExit, d + 1);
        if (mask === full && d + 1 < par) {
          par = d + 1;
          winFrom = id0;
          winDir = [dc, dr];
        }
        continue; // reaching the exit ends the level
      }

      bestMask |= mask;
      const id = `${move.c},${move.r},${mask}`;
      if (!dist.has(id)) {
        dist.set(id, d + 1);
        from.set(id, { prev: id0, dir: [dc, dr] });
        queue.push({ c: move.c, r: move.r, mask });
      }
    }
  }

  if (minToExit === Infinity) problems.push('exit is unreachable');
  if (par === Infinity && minToExit !== Infinity) {
    const missing = pickups.filter((_, i) => !(bestMask & (1 << i)));
    problems.push(`cannot take everything and still leave (${missing.length} unreachable: ${missing.map((p) => `${p.c},${p.r}`).join(' ')})`);
  }

  // Walk the parent pointers back to get the actual optimal move sequence.
  let solution = null;
  if (winFrom) {
    const moves = [winDir];
    let node = winFrom;
    while (node !== startState) {
      const step = from.get(node);
      if (!step) break;
      moves.unshift(step.dir);
      node = step.prev;
    }
    solution = moves;
  }

  return {
    problems,
    pickups: pickups.length,
    minToExit,
    par: par === Infinity ? null : par,
    states: dist.size,
    solution,
    maxSlide,
    avgSlide: slideCount ? slideSum / slideCount : 0,
    floating: world.spikes.filter((p) => !p.dir).length,
  };
}

/* `--solution <levelId>` prints the optimal slides as arrow keys, so the
 * browser test can play a level perfectly and assert it clears with three
 * stars. If the engine and this solver ever disagree, that test fails. */
const wantSolution = process.argv.indexOf('--solution');
if (wantSolution !== -1) {
  const id = process.argv[wantSolution + 1];
  const level = LEVELS.find((l) => l.id === id);
  if (!level) { console.error(`no level ${id}`); process.exit(1); }
  const r = analyseLevel(level);
  if (!r.solution) { console.error(`no solution for ${id}`); process.exit(1); }
  const NAMES = new Map([['1,0', 'ArrowRight'], ['-1,0', 'ArrowLeft'], ['0,1', 'ArrowUp'], ['0,-1', 'ArrowDown']]);
  console.log(JSON.stringify({
    id, par: r.par, pickups: r.pickups,
    keys: r.solution.map((d) => NAMES.get(`${d[0]},${d[1]}`)),
  }));
  process.exit(0);
}

/* Chunks stack in random order, so a chunk must be escapable from EVERY port
 * the player might arrive through. One trap here is a run ended by the
 * generator rather than by the player, which is the worst bug this game
 * could ship. */
function analyseChunk(chunk, i) {
  const problems = [];
  if (chunk.rows.length !== CHUNK_H) problems.push(`is ${chunk.rows.length} rows, expected ${CHUNK_H}`);
  for (const [n, line] of chunk.rows.entries()) {
    if (line.length !== CHUNK_W) problems.push(`row ${n} is ${line.length} wide, expected ${CHUNK_W}`);
  }
  if (chunk.rows[0] !== PORT_ROW) problems.push(`top row must be the port row ${PORT_ROW}`);
  if (chunk.rows.at(-1) !== PORT_ROW) problems.push(`bottom row must be the port row ${PORT_ROW}`);
  if (problems.length) return { problems };

  const { grid, spikes } = parseGrid(chunk.rows);   // flips to floor-up
  const spikeSet = new Set(spikes.map((p) => key(p.c, p.r)));
  const goalRow = grid.length - 1;                  // the chunk's top ports

  let worstSlide = 0;
  let totalReach = 0;

  /** Can a slide from here ever touch the top? */
  const canEscape = (start) => {
    const seen = new Set([key(start.c, start.r)]);
    const queue = [start];
    while (queue.length) {
      const cur = queue.shift();
      if (cur.r === goalRow) return true;
      for (const [dc, dr] of DIRS) {
        const move = slide(grid, spikeSet, cur.c, cur.r, dc, dr);
        if (!move) continue;
        worstSlide = Math.max(worstSlide, move.path.length);
        for (const [, pr] of move.path) if (pr === goalRow) return true;
        const id = key(move.c, move.r);
        if (!seen.has(id)) { seen.add(id); queue.push({ c: move.c, r: move.r }); }
      }
    }
    return false;
  };

  for (const port of PORTS) {
    // Collect everywhere you could end up after entering through this port.
    const reachable = new Set([key(port, 0)]);
    const queue = [{ c: port, r: 0 }];
    while (queue.length) {
      const cur = queue.shift();
      for (const [dc, dr] of DIRS) {
        const move = slide(grid, spikeSet, cur.c, cur.r, dc, dr);
        if (!move) continue;
        const id = key(move.c, move.r);
        if (!reachable.has(id)) { reachable.add(id); queue.push({ c: move.c, r: move.r }); }
      }
    }
    totalReach = Math.max(totalReach, reachable.size);

    // Every one of those must still have a way out, or a normal move can
    // strand the player through no fault of their own.
    const stuck = [...reachable].filter((k) => {
      const [c, r] = k.split(',').map(Number);
      return !canEscape({ c, r });
    });
    if (stuck.length) {
      problems.push(`entering at column ${port}: ${stuck.length} cell(s) with no way out (${stuck.slice(0, 4).join(' ')})`);
    }
  }

  // Any spike the renderer cannot bolt to a wall would float in mid-air.
  const floating = spikes.filter((p) => !p.dir);
  if (floating.length) problems.push(`${floating.length} spike(s) with no wall to attach to`);

  return {
    problems, ports: PORTS.length, reachable: totalReach, maxSlide: worstSlide, index: i,
  };
}

/* ── Report ────────────────────────────────────────────────── */

let broken = 0;
const parUpdates = [];

console.log('Levels');
for (const level of LEVELS) {
  const r = analyseLevel(level);
  if (r.problems.length) {
    broken += 1;
    console.log(`  ✗ ${level.id} ${level.name}`);
    for (const p of r.problems) console.log(`      ${p}`);
    continue;
  }
  const parOk = level.par === r.par;
  if (!parOk) parUpdates.push({ id: level.id, from: level.par, to: r.par });
  if (r.floating) { broken += 1; console.log(`  ✗ ${level.id} has ${r.floating} floating spike(s)`); continue; }
  console.log(
    `  ${parOk ? '✓' : '·'} ${level.id.padEnd(4)} ${level.name.padEnd(14)}`
    + ` ${String(r.pickups).padStart(2)} pickups   exit in ${String(r.minToExit).padStart(2)}`
    + `   par ${String(r.par).padStart(2)}${parOk ? '' : `  (file says ${level.par})`}`
    + `   slide max ${r.maxSlide} avg ${r.avgSlide.toFixed(1)}`,
  );
}

console.log('\nArcade chunks');
for (const [i, chunk] of CHUNKS.entries()) {
  const r = analyseChunk(chunk, i);
  if (r.problems.length) {
    broken += 1;
    console.log(`  ✗ chunk ${i} (tier ${chunk.tier})`);
    for (const p of r.problems) console.log(`      ${p}`);
  } else {
    console.log(`  ✓ chunk ${String(i).padStart(2)} (tier ${chunk.tier})   ${r.ports} ports all escape   ${r.reachable} reachable   slide max ${r.maxSlide}`);
  }
}

if (parUpdates.length) {
  console.log('\npar values to update in levels.js:');
  for (const u of parUpdates) console.log(`  ${u.id}: ${u.from} → ${u.to}`);
}

const failed = broken > 0 || (process.argv.includes('--check') && parUpdates.length > 0);
console.log(`\n${broken === 0 ? 'all content is playable' : `${broken} broken`}`);
if (failed) process.exit(1);
