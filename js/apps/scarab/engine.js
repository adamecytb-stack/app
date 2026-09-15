/* Scarab's engine: grid world, slide movement, entities, and the renderer.
 *
 * Movement is the whole game. You flick a direction and the beetle slides
 * until a wall stops it — no stopping halfway, no changing your mind. Every
 * cell it passes through is resolved in order, so a coin two cells before a
 * spike is still collected before you die on the spike.
 *
 * Everything is drawn procedurally: no sprite sheets, no image files, so the
 * whole game stays inside the offline cache.
 */

import { COLS, parseGrid } from './levels.js';
import { CHUNKS, CHUNK_H, chunksForHeight } from './chunks.js';
import { sfx, setIntensity } from './audio.js';

const STEP = 0.036;             // seconds per cell — fast, like the genre wants
const WARDEN_STEP = 0.30;
const SWIPE_MIN = 22;
const VIEW_ROWS_MIN = 13;

const key = (c, r) => `${c},${r}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* Deterministic per-cell noise, so stone texture never shimmers. */
function hash(c, r) {
  let h = (c * 374761393 + r * 668265263) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/* ── World ─────────────────────────────────────────────────── */

function emptyWorld() {
  return {
    grid: [],
    coins: new Map(),
    gems: new Map(),
    shields: new Map(),
    spikes: new Map(),      // key -> { c, r, dir } so each one knows its wall
    wardens: [],
    exit: null,
    start: { c: 7, r: 1 },
  };
}

function addParsed(world, parsed, rowOffset) {
  parsed.grid.forEach((line) => world.grid.push(line));
  for (const p of parsed.coins) world.coins.set(key(p.c, p.r + rowOffset), { c: p.c, r: p.r + rowOffset });
  for (const p of parsed.gems) world.gems.set(key(p.c, p.r + rowOffset), { c: p.c, r: p.r + rowOffset });
  for (const p of parsed.shields) world.shields.set(key(p.c, p.r + rowOffset), { c: p.c, r: p.r + rowOffset });
  for (const p of parsed.spikes) {
    world.spikes.set(key(p.c, p.r + rowOffset), { c: p.c, r: p.r + rowOffset, dir: p.dir });
  }
  for (const w of parsed.wardens) world.wardens.push(makeWarden(world, w.c, w.r + rowOffset, w.axis));
}

function makeWarden(world, c, r, axis) {
  return {
    axis, c, r, pos: axis === 'h' ? c : r, dir: 1, min: 0, max: 0, bounded: false,
  };
}

/** Patrol limits are found once the surrounding grid actually exists. */
function boundWarden(world, w) {
  const solid = (c, r) => !world.grid[r] || world.grid[r][c] === '#';
  if (w.axis === 'h') {
    let lo = w.c; while (!solid(lo - 1, w.r)) lo -= 1;
    let hi = w.c; while (!solid(hi + 1, w.r)) hi += 1;
    w.min = lo; w.max = hi;
  } else {
    let lo = w.r; while (!solid(w.c, lo - 1)) lo -= 1;
    let hi = w.r; while (!solid(w.c, hi + 1)) hi += 1;
    w.min = lo; w.max = hi;
  }
  w.bounded = true;
}

function buildLevelWorld(level) {
  const world = emptyWorld();
  const parsed = parseGrid(level.rows);
  addParsed(world, parsed, 0);
  world.exit = parsed.exit;
  world.start = parsed.start;
  world.totalPickups = parsed.coins.length + parsed.gems.length;
  for (const w of world.wardens) boundWarden(world, w);
  return world;
}

function buildArcadeWorld(seed) {
  const world = emptyWorld();
  world.seed = seed >>> 0;
  world.rand = () => { world.seed = (world.seed * 1664525 + 1013904223) >>> 0; return world.seed / 4294967296; };
  // A calm opening platform so the first flick is never instant death.
  addParsed(world, parseGrid([
    '#.............#',
    '#.............#',
    '#.............#',
    '#..#.......#..#',
    '#.............#',
    '###############',
  ]), 0);
  world.start = { c: 7, r: 2 };
  appendChunk(world);
  appendChunk(world);
  return world;
}

function appendChunk(world) {
  const offset = world.grid.length;
  const pool = chunksForHeight(offset);
  let chunk = pool[Math.floor(world.rand() * pool.length)] || CHUNKS[0];
  let rows = chunk.rows;
  if (world.rand() < 0.5) rows = rows.map((line) => [...line].reverse().join(''));
  addParsed(world, parseGrid(rows), offset);
  for (const w of world.wardens) if (!w.bounded) boundWarden(world, w);
}

/* ── Game ──────────────────────────────────────────────────── */

export function createGame({ mode, level, canvas, onEvent }) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const arcade = mode === 'arcade';
  const world = arcade ? buildArcadeWorld(Date.now()) : buildLevelWorld(level);

  const state = {
    over: false, won: false, paused: false, started: false,
    col: world.start.c, row: world.start.r,
    vc: world.start.c, vr: world.start.r,
    dir: null, buffered: null, stepT: 0,
    slides: 0, coins: 0, chain: 0, bestChain: 0, score: 0,
    shield: 0, invuln: 0,
    maxRow: world.start.r,
    lava: arcade ? -6 : -999,
    lavaSpeed: 0.55,
    time: 0, shake: 0, flash: 0,
  };

  const trail = [];
  const particles = [];
  let cam = state.row - 4;
  let raf = null;
  let last = 0;
  let dangerTick = 0;

  /* ── Geometry ───────────────────────────────────────────── */

  let cell = 24;
  let viewRows = VIEW_ROWS_MIN;
  let originX = 0;

  function resize() {
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const w = canvas.clientWidth || 360;
    const h = canvas.clientHeight || 600;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    cell = Math.floor(w / COLS);
    originX = Math.round((w - cell * COLS) / 2);
    viewRows = Math.ceil(h / cell) + 1;
  }

  const screenX = (c) => originX + c * cell;
  const screenY = (r) => (canvas.clientHeight || 600) - (r - cam + 1) * cell;

  /* ── World queries ──────────────────────────────────────── */

  const solid = (c, r) => c < 0 || c >= COLS || r < 0 || !world.grid[r] || world.grid[r][c] === '#';

  /* ── Input ──────────────────────────────────────────────── */

  function queue(dx, dy) {
    if (state.over || state.paused) return;
    state.started = true;
    state.buffered = { dx, dy };
  }

  let touchX = 0;
  let touchY = 0;
  let touching = false;

  function onTouchStart(e) {
    const t = e.touches ? e.touches[0] : e;
    touchX = t.clientX; touchY = t.clientY; touching = true;
  }
  function onTouchMove(e) {
    if (!touching) return;
    const t = e.touches ? e.touches[0] : e;
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;
    touching = false;
    if (Math.abs(dx) > Math.abs(dy)) queue(Math.sign(dx), 0);
    else queue(0, -Math.sign(dy));      // screen-down is world-down
    e.preventDefault();
  }
  function onTouchEnd() { touching = false; }

  const KEYS = {
    ArrowLeft: [-1, 0], a: [-1, 0], A: [-1, 0],
    ArrowRight: [1, 0], d: [1, 0], D: [1, 0],
    ArrowUp: [0, 1], w: [0, 1], W: [0, 1],
    ArrowDown: [0, -1], s: [0, -1], S: [0, -1],
  };
  function onKey(e) {
    const dir = KEYS[e.key];
    if (!dir) return;
    e.preventDefault();
    queue(dir[0], dir[1]);
  }

  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: false });
  canvas.addEventListener('touchend', onTouchEnd, { passive: true });
  canvas.addEventListener('pointerdown', onTouchStart);
  canvas.addEventListener('pointermove', onTouchMove);
  canvas.addEventListener('pointerup', onTouchEnd);
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', resize);

  /* ── Effects ────────────────────────────────────────────── */

  function burst(c, r, colour, count = 10, speed = 5) {
    for (let i = 0; i < count; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.35 + Math.random());
      particles.push({
        x: c + 0.5, y: r + 0.5,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: 0.4 + Math.random() * 0.4, age: 0,
        colour, size: 0.1 + Math.random() * 0.12,
      });
    }
  }

  function emit(event, data) { onEvent?.(event, data); }

  function hud() {
    emit('hud', {
      coins: state.coins, score: Math.round(state.score), slides: state.slides,
      chain: state.chain, shield: state.shield,
      height: Math.max(0, state.maxRow - world.start.r),
      pickups: world.totalPickups,
    });
  }

  /* ── Death and win ──────────────────────────────────────── */

  function die(reason) {
    if (state.over) return;
    if (state.shield > 0 && reason !== 'lava') {
      state.shield -= 1;
      state.invuln = 1.1;
      state.shake = 10;
      sfx.shieldBreak();
      burst(state.col, state.row, '#8DE9E0', 18, 7);
      hud();
      return;
    }
    state.over = true;
    state.dir = null;
    state.shake = 16;
    state.flash = 0.5;
    sfx.death();
    burst(state.col, state.row, '#FF6B7A', 26, 9);
    setIntensity(0);
    emit('dead', {
      reason,
      score: Math.round(state.score),
      coins: state.coins,
      slides: state.slides,
      height: Math.max(0, state.maxRow - world.start.r),
      bestChain: state.bestChain,
    });
  }

  function win() {
    if (state.over) return;
    state.over = true;
    state.won = true;
    state.dir = null;
    sfx.levelWin();
    burst(state.col, state.row, '#F5C542', 30, 8);
    setIntensity(0);
    emit('win', {
      score: Math.round(state.score),
      coins: state.coins,
      slides: state.slides,
      bestChain: state.bestChain,
    });
  }

  /* ── Entering a cell ────────────────────────────────────── */

  function enterCell(c, r) {
    const k = key(c, r);

    if (world.coins.has(k)) {
      world.coins.delete(k);
      state.coins += 1;
      state.chain += 1;
      state.bestChain = Math.max(state.bestChain, state.chain);
      state.score += 10 * clamp(state.chain, 1, 8);
      sfx.coin(state.chain - 1);
      burst(c, r, '#F5C542', 6, 4);
      hud();
    }

    if (world.gems.has(k)) {
      world.gems.delete(k);
      state.coins += 1;
      state.score += 100;
      sfx.gem();
      burst(c, r, '#3FD9B0', 16, 6);
      state.shake = Math.max(state.shake, 5);
      hud();
    }

    if (world.shields.has(k)) {
      world.shields.delete(k);
      state.shield = Math.min(2, state.shield + 1);
      sfx.power();
      burst(c, r, '#8DE9E0', 14, 5);
      hud();
    }

    if (r > state.maxRow) {
      if (arcade) state.score += (r - state.maxRow) * 5;
      state.maxRow = r;
    }

    if (world.spikes.has(k) && state.invuln <= 0) { sfx.spike(); die('spike'); return; }
    if (world.exit && world.exit.c === c && world.exit.r === r) { win(); }
  }

  /* ── Simulation ─────────────────────────────────────────── */

  function stepPlayer(dt) {
    if (state.over) return;

    if (!state.dir && state.buffered) {
      const d = state.buffered;
      state.buffered = null;
      if (!solid(state.col + d.dx, state.row + d.dy)) {
        state.dir = d;
        state.stepT = 0;
        state.chain = 0;
        state.slides += 1;
        sfx.slide(state.chain);
        hud();
      }
    }

    if (!state.dir) return;

    state.stepT += dt;
    let guard = 0;
    while (state.stepT >= STEP && state.dir && !state.over && guard < 64) {
      guard += 1;
      state.stepT -= STEP;
      const nc = state.col + state.dir.dx;
      const nr = state.row + state.dir.dy;
      if (solid(nc, nr)) {
        state.dir = null;
        state.stepT = 0;
        sfx.stop();
        state.shake = Math.max(state.shake, 2.5);
        break;
      }
      state.col = nc;
      state.row = nr;
      enterCell(nc, nr);
    }

    if (state.dir) {
      const t = clamp(state.stepT / STEP, 0, 1);
      state.vc = state.col + state.dir.dx * t;
      state.vr = state.row + state.dir.dy * t;
    } else {
      state.vc = state.col;
      state.vr = state.row;
    }
  }

  function stepWardens(dt) {
    for (const w of world.wardens) {
      if (!w.bounded) continue;
      const lo = w.axis === 'h' ? w.min : w.min;
      const hi = w.axis === 'h' ? w.max : w.max;
      if (hi <= lo) continue;
      w.pos += (w.dir * dt) / WARDEN_STEP;
      if (w.pos <= lo) { w.pos = lo; w.dir = 1; }
      if (w.pos >= hi) { w.pos = hi; w.dir = -1; }

      if (state.over || state.invuln > 0) continue;
      const wx = w.axis === 'h' ? w.pos : w.c;
      const wy = w.axis === 'h' ? w.r : w.pos;
      if (Math.abs(wx - state.vc) < 0.68 && Math.abs(wy - state.vr) < 0.68) {
        sfx.warden();
        die('warden');
      }
    }
  }

  function stepLava(dt) {
    if (!arcade || state.over) return;
    if (!state.started) return;

    // Climbs faster the higher you get, and closes the gap if you stall.
    const height = Math.max(0, state.maxRow - world.start.r);
    const base = 0.55 + height * 0.0032;
    const gap = state.maxRow - state.lava;
    const catchUp = gap > 18 ? 1 + (gap - 18) * 0.05 : 1;
    state.lavaSpeed = base * clamp(catchUp, 1, 3.4);
    state.lava += state.lavaSpeed * dt;

    if (state.vr <= state.lava + 0.35) die('lava');

    const danger = clamp(1 - (state.vr - state.lava) / 14, 0, 1);
    setIntensity(danger);
    dangerTick -= dt;
    if (danger > 0.55 && dangerTick <= 0) {
      sfx.danger();
      dangerTick = 0.9 - danger * 0.35;
    }
  }

  function stepWorld() {
    if (!arcade) return;
    // Keep two chunks of headroom above the climber at all times.
    while (world.grid.length < state.maxRow + CHUNK_H * 2 + 6) appendChunk(world);
  }

  function stepCamera(dt) {
    const target = arcade
      ? Math.max(cam, state.vr - viewRows * 0.42)
      : clamp(state.vr - viewRows * 0.45, -0.5, Math.max(-0.5, world.grid.length - viewRows + 0.5));
    const fits = !arcade && world.grid.length <= viewRows;
    const want = fits ? (world.grid.length - viewRows) / 2 : target;
    cam += (want - cam) * clamp(dt * 9, 0, 1);
    if (arcade && state.lava > cam + 1) cam = Math.max(cam, state.lava - 1);
  }

  function stepParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) { particles.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy -= 14 * dt;
    }
    if (state.dir) {
      trail.push({ x: state.vc, y: state.vr, age: 0 });
    }
    for (let i = trail.length - 1; i >= 0; i -= 1) {
      trail[i].age += dt;
      if (trail[i].age > 0.34) trail.splice(i, 1);
    }
  }

  /* ── Drawing ────────────────────────────────────────────── */

  function drawStone(c, r) {
    const x = screenX(c);
    const y = screenY(r);
    const n = hash(c, r);
    const base = 48 + n * 16;
    ctx.fillStyle = `rgb(${Math.round(base + 16)},${Math.round(base + 4)},${Math.round(base + 26)})`;
    ctx.fillRect(x, y, cell, cell);
    // Lit top edge and a dark base — reads as carved blocks at any size.
    ctx.fillStyle = `rgba(255,220,180,${0.10 + n * 0.07})`;
    ctx.fillRect(x, y, cell, Math.max(1, cell * 0.14));
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.fillRect(x, y + cell - Math.max(1, cell * 0.12), cell, Math.max(1, cell * 0.12));
    if (n > 0.82) {
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(x + cell * 0.25, y + cell * 0.42, cell * 0.28, cell * 0.16);
    }
  }

  function drawCoin(c, r, t) {
    const x = screenX(c) + cell / 2;
    const y = screenY(r) + cell / 2 + Math.sin(t * 3 + c + r) * cell * 0.05;
    const rad = cell * 0.17;
    ctx.fillStyle = 'rgba(245,197,66,0.22)';
    ctx.beginPath(); ctx.arc(x, y, rad * 2.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F5C542';
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFF0C0';
    ctx.beginPath(); ctx.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.34, 0, Math.PI * 2); ctx.fill();
  }

  function drawGem(c, r, t) {
    const x = screenX(c) + cell / 2;
    const y = screenY(r) + cell / 2;
    const s = cell * 0.26 * (1 + Math.sin(t * 4 + c) * 0.07);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(63,217,176,0.25)';
    ctx.fillRect(-s * 1.7, -s * 1.7, s * 3.4, s * 3.4);
    ctx.fillStyle = '#3FD9B0';
    ctx.fillRect(-s, -s, s * 2, s * 2);
    ctx.fillStyle = '#C9FFEE';
    ctx.fillRect(-s * 0.55, -s * 0.55, s * 0.7, s * 0.7);
    ctx.restore();
  }

  function drawShield(c, r, t) {
    const x = screenX(c) + cell / 2;
    const y = screenY(r) + cell / 2;
    const s = cell * 0.3 * (1 + Math.sin(t * 5) * 0.06);
    ctx.fillStyle = 'rgba(141,233,224,0.25)';
    ctx.beginPath(); ctx.arc(x, y, s * 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8DE9E0';
    ctx.lineWidth = Math.max(1.5, cell * 0.08);
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s * 0.8, y - s * 0.4);
    ctx.lineTo(x + s * 0.55, y + s * 0.8);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s * 0.55, y + s * 0.8);
    ctx.lineTo(x - s * 0.8, y - s * 0.4);
    ctx.closePath();
    ctx.stroke();
  }

  /* Drawn in a rotated local frame so the teeth always grow out of the wall
   * they are bolted to, instead of floating in the middle of a corridor. */
  const SPIKE_TURN = { up: 0, down: Math.PI, right: Math.PI / 2, left: -Math.PI / 2 };

  function drawSpike(c, r, dir) {
    const cx = screenX(c) + cell / 2;
    const cy = screenY(r) + cell / 2;
    const h = cell / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(SPIKE_TURN[dir] ?? 0);

    // Mounting plate, flush against the wall face.
    ctx.fillStyle = '#6B6255';
    ctx.fillRect(-h, h - cell * 0.16, cell, cell * 0.16);

    const n = 3;
    const w = cell / n;
    for (let i = 0; i < n; i += 1) {
      const left = -h + i * w;
      ctx.fillStyle = i === 1 ? '#D6CCBA' : '#B9AFA0';
      ctx.beginPath();
      ctx.moveTo(left + w * 0.08, h - cell * 0.14);
      ctx.lineTo(left + w * 0.5, -h + cell * 0.12);
      ctx.lineTo(left + w * 0.92, h - cell * 0.14);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function drawWarden(w, t) {
    const wx = w.axis === 'h' ? w.pos : w.c;
    const wy = w.axis === 'h' ? w.r : w.pos;
    const x = screenX(wx) + cell / 2;
    const y = screenY(wy) + cell / 2;
    const s = cell * 0.34;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 2.2);
    ctx.fillStyle = 'rgba(255,80,80,0.2)';
    ctx.beginPath(); ctx.arc(0, 0, s * 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C0364A';
    for (let i = 0; i < 4; i += 1) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.35);
      ctx.lineTo(s * 0.34, -s * 0.6);
      ctx.lineTo(-s * 0.34, -s * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = '#8E1F31';
    ctx.beginPath(); ctx.arc(x, y, s * 0.8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFD166';
    ctx.beginPath(); ctx.arc(x, y, s * 0.28, 0, Math.PI * 2); ctx.fill();
  }

  function drawExit(t) {
    if (!world.exit) return;
    const x = screenX(world.exit.c) + cell / 2;
    const y = screenY(world.exit.r) + cell / 2;
    const pulse = 0.6 + Math.sin(t * 3) * 0.25;
    const g = ctx.createRadialGradient(x, y, 0, x, y, cell * 1.6);
    g.addColorStop(0, `rgba(245,197,66,${0.55 * pulse})`);
    g.addColorStop(1, 'rgba(245,197,66,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - cell * 1.6, y - cell * 1.6, cell * 3.2, cell * 3.2);

    ctx.strokeStyle = '#F5C542';
    ctx.lineWidth = Math.max(2, cell * 0.11);
    const s = cell * 0.3;
    ctx.beginPath();
    ctx.arc(x, y - s * 0.55, s * 0.62, Math.PI, 0);
    ctx.moveTo(x - s * 0.62, y - s * 0.55);
    ctx.lineTo(x - s * 0.62, y + s);
    ctx.moveTo(x + s * 0.62, y - s * 0.55);
    ctx.lineTo(x + s * 0.62, y + s);
    ctx.stroke();
  }

  /** The scarab: a round jade carapace with a gold seam, facing its travel. */
  function drawPlayer(t) {
    const x = screenX(state.vc) + cell / 2;
    const y = screenY(state.vr) + cell / 2;
    const s = cell * 0.36;
    const blink = state.invuln > 0 && Math.floor(state.invuln * 14) % 2 === 0;
    if (blink) return;

    const glow = ctx.createRadialGradient(x, y, 0, x, y, cell * 2.4);
    glow.addColorStop(0, 'rgba(255,214,140,0.30)');
    glow.addColorStop(1, 'rgba(255,214,140,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(x - cell * 2.4, y - cell * 2.4, cell * 4.8, cell * 4.8);

    const angle = state.dir
      ? Math.atan2(-state.dir.dy, state.dir.dx) + Math.PI / 2
      : Math.sin(t * 2) * 0.08;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (state.shield > 0) {
      ctx.strokeStyle = `rgba(141,233,224,${0.5 + Math.sin(t * 8) * 0.25})`;
      ctx.lineWidth = Math.max(1.5, cell * 0.07);
      ctx.beginPath(); ctx.arc(0, 0, s * 1.45, 0, Math.PI * 2); ctx.stroke();
    }

    // Legs
    ctx.strokeStyle = '#2B6B58';
    ctx.lineWidth = Math.max(1.4, cell * 0.06);
    for (const side of [-1, 1]) {
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(side * s * 0.6, i * s * 0.42);
        ctx.lineTo(side * s * 1.05, i * s * 0.62 - s * 0.1);
        ctx.stroke();
      }
    }

    // Carapace
    ctx.fillStyle = '#2FD6A8';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.78, s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E9C7A';
    ctx.beginPath();
    ctx.ellipse(0, s * 0.18, s * 0.78, s * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gold seam and head
    ctx.fillStyle = '#F5C542';
    ctx.fillRect(-s * 0.06, -s * 0.55, s * 0.12, s * 1.3);
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.82, s * 0.42, s * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0B0910';
    ctx.beginPath(); ctx.arc(-s * 0.2, -s * 0.85, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.85, s * 0.1, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  function drawLava(t) {
    if (!arcade) return;
    const top = screenY(state.lava) + cell;
    const h = (canvas.clientHeight || 600) - top;
    if (h <= 0) return;

    const g = ctx.createLinearGradient(0, top, 0, top + cell * 3);
    g.addColorStop(0, '#FF8A2B');
    g.addColorStop(0.35, '#E4432B');
    g.addColorStop(1, '#6E1020');
    ctx.fillStyle = g;
    ctx.fillRect(0, top, canvas.clientWidth || 360, h + cell);

    // Molten crest
    ctx.fillStyle = '#FFD166';
    const w = canvas.clientWidth || 360;
    for (let x = 0; x < w; x += 6) {
      const wave = Math.sin(x * 0.05 + t * 5) * cell * 0.12 + Math.sin(x * 0.11 - t * 3) * cell * 0.07;
      ctx.fillRect(x, top + wave - cell * 0.1, 6, cell * 0.18);
    }
  }

  function draw(t) {
    const w = canvas.clientWidth || 360;
    const h = canvas.clientHeight || 600;

    ctx.save();
    if (state.shake > 0.1) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }

    ctx.fillStyle = '#0B0910';
    ctx.fillRect(-20, -20, w + 40, h + 40);

    const first = Math.max(0, Math.floor(cam) - 1);
    const lastRow = Math.min(world.grid.length - 1, Math.ceil(cam + viewRows) + 1);

    // Floor tint, so the chamber reads as a space rather than a hole. Without
    // this the maze is dark blocks on pure black and you cannot see the shape.
    for (let r = first; r <= lastRow; r += 1) {
      for (let c = 0; c < COLS; c += 1) {
        if (r < 0 || solid(c, r)) continue;
        const n = hash(c, r);
        ctx.fillStyle = `rgba(${26 + n * 8},${20 + n * 6},${34 + n * 10},0.85)`;
        ctx.fillRect(screenX(c), screenY(r), cell, cell);
        if (n > 0.9) {
          ctx.fillStyle = 'rgba(255,220,180,0.05)';
          ctx.fillRect(screenX(c) + cell * 0.45, screenY(r) + cell * 0.45, 2, 2);
        }
      }
    }

    for (let r = first; r <= lastRow; r += 1) {
      for (let c = 0; c < COLS; c += 1) if (solid(c, r) && r >= 0) drawStone(c, r);
    }

    for (const sp of world.spikes.values()) {
      if (sp.r >= first && sp.r <= lastRow) drawSpike(sp.c, sp.r, sp.dir);
    }

    drawExit(t);
    for (const p of world.coins.values()) if (p.r >= first && p.r <= lastRow) drawCoin(p.c, p.r, t);
    for (const p of world.gems.values()) if (p.r >= first && p.r <= lastRow) drawGem(p.c, p.r, t);
    for (const p of world.shields.values()) if (p.r >= first && p.r <= lastRow) drawShield(p.c, p.r, t);
    for (const wd of world.wardens) {
      const wy = wd.axis === 'h' ? wd.r : wd.pos;
      if (wy >= first - 1 && wy <= lastRow + 1) drawWarden(wd, t);
    }

    // Trail
    for (const p of trail) {
      const a = 1 - p.age / 0.34;
      ctx.fillStyle = `rgba(63,217,176,${a * 0.34})`;
      const s = cell * 0.3 * a;
      ctx.fillRect(screenX(p.x) + cell / 2 - s, screenY(p.y) + cell / 2 - s, s * 2, s * 2);
    }

    if (!state.over || state.won) drawPlayer(t);

    for (const p of particles) {
      const a = 1 - p.age / p.life;
      ctx.fillStyle = p.colour;
      ctx.globalAlpha = a;
      const s = cell * p.size * a;
      ctx.fillRect(screenX(p.x) - s / 2, screenY(p.y) - s / 2, s, s);
    }
    ctx.globalAlpha = 1;

    drawLava(t);

    // Vignette keeps the eye in the middle of the shaft.
    const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.32, w / 2, h / 2, h * 0.78);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    if (state.flash > 0) {
      ctx.fillStyle = `rgba(255,80,90,${state.flash})`;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  /* ── Loop ───────────────────────────────────────────────── */

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (state.paused) return;

    state.time += dt;
    state.shake *= 1 - clamp(dt * 7, 0, 1);
    state.flash = Math.max(0, state.flash - dt * 1.4);
    state.invuln = Math.max(0, state.invuln - dt);

    if (!state.over) {
      stepPlayer(dt);
      stepWardens(dt);
      stepLava(dt);
      stepWorld();
    }
    stepCamera(dt);
    stepParticles(dt);
    draw(state.time);
  }

  /* ── Public surface ─────────────────────────────────────── */

  resize();
  cam = state.row - viewRows * 0.42;
  hud();
  sfx.levelStart();

  return {
    start() {
      if (raf === null) { last = performance.now(); raf = requestAnimationFrame(frame); }
    },
    stop() {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('pointerdown', onTouchStart);
      canvas.removeEventListener('pointermove', onTouchMove);
      canvas.removeEventListener('pointerup', onTouchEnd);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', resize);
      setIntensity(0);
    },
    pause(v) { state.paused = v; },
    isPaused() { return state.paused; },
    resize,
    /** Exposed so the smoke test can drive a run without touch events. */
    input: queue,
    state,
  };
}
