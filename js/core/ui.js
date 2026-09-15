/* The UI kit: DOM building, icons, toasts, sheets, confetti, sound, haptics.
 * No framework — just a tiny hyperscript that keeps rendering code readable. */

/* ── DOM ───────────────────────────────────────────────────── */

/** el('div', {class:'card', onclick: fn}, [children]) */
export function el(tag, props = null, children = null) {
  const node = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
      else if (key === 'html') node.innerHTML = value;
      else if (key === 'text') node.textContent = value;
      else if (key === 'dataset') Object.assign(node.dataset, value);
      else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
      else if (value === true) node.setAttribute(key, '');
      else node.setAttribute(key, value);
    }
  }
  append(node, children);
  return node;
}

export function append(parent, children) {
  if (children === null || children === undefined || children === false) return parent;
  if (Array.isArray(children)) {
    for (const child of children) append(parent, child);
    return parent;
  }
  parent.append(children instanceof Node ? children : document.createTextNode(String(children)));
  return parent;
}

export function frag(children) {
  const f = document.createDocumentFragment();
  append(f, children);
  return f;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/* ── Icons ─────────────────────────────────────────────────── */

const STROKE = 'fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round';

const ICONS = {
  flame: `<path fill="currentColor" d="M12.6 2.2c.6 3.3-1.4 4.6-2.7 6.2-1.2 1.5-1.9 3-1.9 4.9 0 3.7 2.7 6.6 6 6.6s6-2.7 6-6.4c0-2.6-1.1-4.6-2.6-6.1-.2 1.4-.9 2.3-1.9 2.7.4-3-.7-6.1-2.9-7.9Z" opacity=".95"/><path fill="currentColor" d="M12 13c.3 1.6-.7 2.3-1.3 3.1-.5.7-.8 1.4-.8 2.3 0 1.7 1.2 3 2.7 3s2.7-1.2 2.7-2.9c0-1.6-1.4-3.6-3.3-5.5Z" opacity=".45"/>`,
  bolt: `<path fill="currentColor" d="M13.7 2.2 4.9 13.5c-.4.5 0 1.3.6 1.3h4.6l-1 6.9c-.1.7.8 1.1 1.2.5l8.8-11.3c.4-.5 0-1.3-.6-1.3h-4.6l1-6.9c.1-.7-.8-1.1-1.2-.5Z"/>`,
  heart: `<path fill="currentColor" d="M12 20.9 3.8 12.6A5.1 5.1 0 0 1 11 5.4l1 1 1-1a5.1 5.1 0 1 1 7.2 7.2Z"/>`,
  heartOff: `<path style="${STROKE}" d="M12 20.9 3.8 12.6A5.1 5.1 0 0 1 11 5.4l1 1 1-1a5.1 5.1 0 1 1 7.2 7.2Z" opacity=".4"/>`,
  snow: `<path style="${STROKE}" d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 7l2.5-2M12 7 9.5 5M12 17l2.5 2M12 17l-2.5 2"/>`,
  check: `<path style="${STROKE}" d="m4.5 12.7 4.8 4.8L19.5 7.3"/>`,
  x: `<path style="${STROKE}" d="M6 6l12 12M18 6 6 18"/>`,
  chevronLeft: `<path style="${STROKE}" d="m15 4.5-7.5 7.5L15 19.5"/>`,
  chevronRight: `<path style="${STROKE}" d="m9 4.5 7.5 7.5L9 19.5"/>`,
  arrowRight: `<path style="${STROKE}" d="M4.5 12h15m-6-6.5 6.5 6.5-6.5 6.5"/>`,
  lock: `<rect x="4.5" y="10.5" width="15" height="10" rx="3" style="${STROKE}"/><path style="${STROKE}" d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>`,
  star: `<path fill="currentColor" d="m12 2.6 2.7 6 6.5.7-4.9 4.4 1.4 6.4L12 16.8l-5.7 3.3 1.4-6.4L2.8 9.3l6.5-.7Z"/>`,
  sparkle: `<path fill="currentColor" d="m12 2.5 1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9Z"/><path fill="currentColor" d="m19 14.5.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9Z" opacity=".6"/>`,
  crown: `<path style="${STROKE}" d="M3.5 8.5 7 12l5-6.5 5 6.5 3.5-3.5-1.5 10h-14Z"/><path style="${STROKE}" d="M5 21h14"/>`,
  medal: `<circle cx="12" cy="14.5" r="5.5" style="${STROKE}"/><path style="${STROKE}" d="M8.5 9.5 6 2.5h12l-2.5 7"/>`,
  target: `<circle cx="12" cy="12" r="8.5" style="${STROKE}"/><circle cx="12" cy="12" r="4.5" style="${STROKE}"/><circle cx="12" cy="12" r="1" fill="currentColor"/>`,
  chat: `<path style="${STROKE}" d="M20.5 12c0 4.1-3.8 7.5-8.5 7.5-1 0-2-.2-2.9-.5L4 20.5l1.6-4A7 7 0 0 1 3.5 12c0-4.1 3.8-7.5 8.5-7.5s8.5 3.4 8.5 7.5Z"/>`,
  book: `<path style="${STROKE}" d="M4 4.5h6a3 3 0 0 1 3 3v12a2.5 2.5 0 0 0-2.5-2.5H4Z"/><path style="${STROKE}" d="M20 4.5h-6a3 3 0 0 0-3 3v12a2.5 2.5 0 0 1 2.5-2.5H20Z"/>`,
  user: `<circle cx="12" cy="8" r="4" style="${STROKE}"/><path style="${STROKE}" d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>`,
  sliders: `<path style="${STROKE}" d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.2" style="${STROKE}"/><circle cx="10" cy="17" r="2.2" style="${STROKE}"/>`,
  refresh: `<path style="${STROKE}" d="M20 12a8 8 0 1 1-2.6-5.9"/><path style="${STROKE}" d="M20 3.5V9h-5.5"/>`,
  download: `<path style="${STROKE}" d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 17v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"/>`,
  upload: `<path style="${STROKE}" d="M12 14.5v-11m0 0 4 4m-4-4-4 4M4.5 17v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"/>`,
  play: `<path fill="currentColor" d="M8 5.2v13.6c0 .8.9 1.3 1.6.9l10.2-6.8a1 1 0 0 0 0-1.8L9.6 4.3A1 1 0 0 0 8 5.2Z"/>`,
  clock: `<circle cx="12" cy="12" r="8.5" style="${STROKE}"/><path style="${STROKE}" d="M12 7v5.3l3.2 2"/>`,
  shield: `<path style="${STROKE}" d="M12 3 5 5.7v5.5c0 4.3 2.9 8.2 7 9.3 4.1-1.1 7-5 7-9.3V5.7Z"/>`,
  grid: `<rect x="3.5" y="3.5" width="7" height="7" rx="2.2" style="${STROKE}"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.2" style="${STROKE}"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.2" style="${STROKE}"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.2" style="${STROKE}"/>`,
  fingerprint: `<path style="${STROKE}" d="M12 10.5v3.2c0 2.3-.4 4.5-1.2 6.6M8.4 5.9a7 7 0 0 1 10.3 5.8c0 1.6-.1 3.2-.4 4.7M5 9.2A7 7 0 0 0 4.8 12c0 2-.3 4-.9 5.9M8.6 12a3.4 3.4 0 1 1 6.8 0c0 3-.4 5.9-1.2 8.6M15.2 18.5c.2-1 .3-2.1.3-3.2"/>`,
  compass: `<circle cx="12" cy="12" r="8.5" style="${STROKE}"/><path style="${STROKE}" d="m14.8 9.2-1.6 4.4-4.4 1.6 1.6-4.4Z"/>`,
  quote: `<path fill="currentColor" d="M9.4 5.5C6.3 6.9 4.5 9.6 4.5 13v5.5h6.2V12H7.6c0-2 .8-3.6 2.6-4.6Zm9.6 0c-3.1 1.4-4.9 4.1-4.9 7.5v5.5h6.2V12h-3.1c0-2 .8-3.6 2.6-4.6Z"/>`,
};

export function icon(name, size = 24) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = ICONS[name] || '';
  return svg;
}

/* ── Feedback: haptics + synthesised sound (no audio files) ── */

let audioCtx = null;
let prefs = { sound: true, haptics: true };

export function setFeedbackPrefs(next) { prefs = { ...prefs, ...next }; }

function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** Shared AudioContext — apps with their own synths reuse this one.
 *  Browsers cap how many you may create, so never open a second. */
export function audioContext() { return ctx(); }

function tone(freq, start, duration, { gain = 0.07, type = 'sine' } = {}) {
  const ac = ctx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ac.currentTime + start;
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(amp).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

const SOUNDS = {
  tap: () => tone(660, 0, 0.05, { gain: 0.025, type: 'triangle' }),
  correct: () => { tone(784, 0, 0.13); tone(1175, 0.075, 0.2); },
  wrong: () => { tone(180, 0, 0.16, { gain: 0.06, type: 'sawtooth' }); tone(140, 0.06, 0.2, { gain: 0.04, type: 'sawtooth' }); },
  complete: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.085, 0.3, { gain: 0.06 })); },
  levelup: () => { [440, 554, 659, 880, 1109].forEach((f, i) => tone(f, i * 0.07, 0.35, { gain: 0.05, type: 'triangle' })); },
};

export function feedback(kind) {
  if (prefs.sound && SOUNDS[kind]) { try { SOUNDS[kind](); } catch { /* audio unavailable */ } }
  if (prefs.haptics && navigator.vibrate) {
    const pattern = { tap: 8, correct: 14, wrong: [26, 40, 26], complete: [14, 50, 14, 50, 30], levelup: [20, 60, 40] }[kind];
    if (pattern) { try { navigator.vibrate(pattern); } catch { /* unsupported */ } }
  }
}

/* ── Toast ─────────────────────────────────────────────────── */

export function toast(message, { icon: glyph = '✦', duration = 3200, action = null } = {}) {
  const layer = document.getElementById('layer-toast');
  if (!layer) return () => {};

  const node = el('div', { class: 'toast' }, [
    el('span', { class: 'toast__icon', text: glyph }),
    el('span', { class: 'toast__msg', text: message }),
    action && el('button', {
      class: 'toast__action',
      text: action.label,
      onclick: () => { action.onClick?.(); dismiss(); },
    }),
  ]);

  let done = false;
  function dismiss() {
    if (done) return;
    done = true;
    node.classList.add('toast--out');
    setTimeout(() => node.remove(), 240);
  }

  layer.append(node);
  if (duration > 0) setTimeout(dismiss, duration);
  return dismiss;
}

/* ── Sheet ─────────────────────────────────────────────────── */

export function sheet(build, { dismissible = true } = {}) {
  const layer = document.getElementById('layer-sheet');
  if (!layer) return () => {};

  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    const panel = layer.querySelector('.sheet__panel');
    if (panel) panel.style.animation = 'sheet-in 240ms var(--ease-out) reverse both';
    setTimeout(() => { clear(layer); layer.removeAttribute('data-open'); layer.setAttribute('aria-hidden', 'true'); }, 220);
  }

  clear(layer);
  layer.append(
    el('div', { class: 'sheet__scrim', onclick: () => dismissible && close() }),
    el('div', { class: 'sheet__panel', role: 'dialog', 'aria-modal': 'true' }, [
      dismissible && el('div', { class: 'sheet__grab' }),
      build(close),
    ]),
  );
  layer.setAttribute('data-open', '');
  layer.setAttribute('aria-hidden', 'false');
  return close;
}

/* ── Confetti ──────────────────────────────────────────────── */

export function confetti({ count = 70, colors = ['#F5A524', '#FFC763', '#4FD8A8', '#9A86FF', '#F4F0E8'] } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = el('div', { class: 'confetti' });
  for (let i = 0; i < count; i += 1) {
    const duration = 1900 + Math.random() * 1500;
    layer.append(el('i', {
      style: {
        left: `${Math.random() * 100}%`,
        background: colors[i % colors.length],
        animationDuration: `${duration}ms`,
        animationDelay: `${Math.random() * 450}ms`,
        '--dx': `${(Math.random() - 0.5) * 240}px`,
        '--rot': `${360 + Math.random() * 900}deg`,
        opacity: 0.55 + Math.random() * 0.45,
        width: `${6 + Math.random() * 6}px`,
        height: `${9 + Math.random() * 9}px`,
      },
    }));
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 4200);
}

/* ── Number count-up ───────────────────────────────────────── */

export function countUp(node, to, { from = 0, duration = 900, format = (n) => Math.round(n).toLocaleString() } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = format(to); return; }
  const start = performance.now();
  function step(now) {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - p) ** 3;
    node.textContent = format(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Misc ──────────────────────────────────────────────────── */

export function shuffle(list, seed = null) {
  const out = [...list];
  let rand = Math.random;
  if (seed !== null) {
    let s = seed >>> 0;
    rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function plural(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
