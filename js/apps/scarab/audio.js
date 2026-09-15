/* Scarab's sound — everything synthesised at runtime, no audio files.
 *
 * Two buses (music, sfx) hang off a soft limiter so a burst of coin pickups
 * can never clip. The music is a lookahead-scheduled generative loop in
 * Phrygian dominant, which is the scale that makes anything sound ancient.
 */

import { audioContext } from '../../core/ui.js';

let ac = null;
let master = null;
let musicBus = null;
let sfxBus = null;

let prefs = { music: true, sfx: true };
export function setAudioPrefs(next) {
  prefs = { ...prefs, ...next };
  if (musicBus) musicBus.gain.value = prefs.music ? MUSIC_LEVEL : 0;
  if (sfxBus) sfxBus.gain.value = prefs.sfx ? 1 : 0;
}

const MUSIC_LEVEL = 0.34;

function init() {
  if (master) return ac;
  ac = audioContext();
  if (!ac) return null;

  // A gentle limiter so stacked effects stay clean.
  const limiter = ac.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.18;

  master = ac.createGain();
  master.gain.value = 0.85;

  musicBus = ac.createGain();
  musicBus.gain.value = prefs.music ? MUSIC_LEVEL : 0;
  sfxBus = ac.createGain();
  sfxBus.gain.value = prefs.sfx ? 1 : 0;

  musicBus.connect(master);
  sfxBus.connect(master);
  master.connect(limiter).connect(ac.destination);
  return ac;
}

export function resumeAudio() {
  const c = init();
  if (c && c.state === 'suspended') c.resume();
}

/* ── Building blocks ───────────────────────────────────────── */

let noiseBuffer = null;
function noise() {
  if (!noiseBuffer) {
    const len = ac.sampleRate * 1.2;
    noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  return src;
}

/** One enveloped oscillator. `bend` sweeps the pitch over the note. */
function tone(bus, {
  freq, type = 'square', start = 0, dur = 0.12, gain = 0.2,
  bend = null, attack = 0.005, filter = null, q = 1, detune = 0,
}) {
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.detune.value = detune;
  osc.frequency.setValueAtTime(freq, t0);
  if (bend !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, bend), t0 + dur);

  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  let node = osc;
  if (filter !== null) {
    const f = ac.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filter;
    f.Q.value = q;
    node = osc.connect(f);
    f.connect(amp);
  } else {
    osc.connect(amp);
  }
  amp.connect(bus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

/** A burst of filtered noise — hats, whooshes, impacts. */
function hiss(bus, {
  start = 0, dur = 0.1, gain = 0.2, type = 'bandpass',
  from = 2000, to = 600, q = 1,
}) {
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const src = noise();
  const f = ac.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t0);
  f.frequency.exponentialRampToValueAtTime(Math.max(60, to), t0 + dur);

  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  src.connect(f).connect(amp).connect(bus);
  src.start(t0);
  src.stop(t0 + dur + 0.03);
}

/* ── Effects ───────────────────────────────────────────────── */

/* Phrygian dominant on A — the "tomb" scale.
 * A  Bb  C#  D  E  F  G */
const SCALE = [0, 1, 4, 5, 7, 8, 10];
const ROOT = 220;
const note = (deg, oct = 0) => ROOT * 2 ** ((SCALE[((deg % 7) + 7) % 7] + 12 * (oct + Math.floor(deg / 7))) / 12);

export const sfx = {
  menu() { tone(sfxBus, { freq: 880, type: 'triangle', dur: 0.05, gain: 0.1 }); },

  slide(speedUp = 0) {
    hiss(sfxBus, { dur: 0.13, gain: 0.13, from: 900 + speedUp * 300, to: 2600, type: 'bandpass', q: 1.6 });
    tone(sfxBus, { freq: 180, type: 'triangle', dur: 0.09, gain: 0.07, bend: 420 });
  },

  stop() {
    tone(sfxBus, { freq: 150, type: 'sine', dur: 0.07, gain: 0.16, bend: 70 });
    hiss(sfxBus, { dur: 0.05, gain: 0.07, from: 1400, to: 300 });
  },

  /** Pitch climbs with the chain, the way every arcade game does it. */
  coin(chain = 0) {
    const deg = Math.min(14, chain);
    tone(sfxBus, { freq: note(deg, 1), type: 'square', dur: 0.075, gain: 0.13, attack: 0.002 });
    tone(sfxBus, { freq: note(deg, 2), type: 'triangle', dur: 0.05, gain: 0.06, start: 0.012 });
  },

  gem() {
    [0, 2, 4].forEach((d, i) => tone(sfxBus, {
      freq: note(d, 2), type: 'triangle', dur: 0.3, gain: 0.11, start: i * 0.045,
    }));
    hiss(sfxBus, { dur: 0.3, gain: 0.05, from: 6000, to: 3000, type: 'highpass' });
  },

  power() {
    [0, 3, 5, 7].forEach((d, i) => tone(sfxBus, {
      freq: note(d, 1), type: 'square', dur: 0.14, gain: 0.12, start: i * 0.05,
    }));
  },

  shieldBreak() {
    hiss(sfxBus, { dur: 0.35, gain: 0.18, from: 7000, to: 900, type: 'highpass' });
    tone(sfxBus, { freq: 1200, type: 'triangle', dur: 0.3, gain: 0.1, bend: 300 });
  },

  spike() {
    tone(sfxBus, { freq: 2400, type: 'square', dur: 0.04, gain: 0.14, bend: 1200 });
    hiss(sfxBus, { dur: 0.06, gain: 0.1, from: 5000, to: 2000, type: 'highpass' });
  },

  warden() {
    tone(sfxBus, { freq: 90, type: 'sawtooth', dur: 0.26, gain: 0.13, bend: 55, filter: 700, detune: -14 });
  },

  death() {
    tone(sfxBus, { freq: 400, type: 'sawtooth', dur: 0.75, gain: 0.2, bend: 45, filter: 1400 });
    tone(sfxBus, { freq: 402, type: 'square', dur: 0.75, gain: 0.1, bend: 40, detune: 20 });
    hiss(sfxBus, { dur: 0.6, gain: 0.16, from: 1800, to: 80, type: 'lowpass' });
  },

  levelStart() {
    [0, 4, 7].forEach((d, i) => tone(sfxBus, {
      freq: note(d, 1), type: 'square', dur: 0.16, gain: 0.12, start: i * 0.07,
    }));
  },

  levelWin() {
    [0, 2, 4, 7].forEach((d, i) => {
      tone(sfxBus, { freq: note(d, 1), type: 'square', dur: 0.22, gain: 0.13, start: i * 0.1 });
      tone(sfxBus, { freq: note(d, 2), type: 'triangle', dur: 0.22, gain: 0.07, start: i * 0.1 });
    });
    tone(sfxBus, { freq: note(7, 1), type: 'square', dur: 0.7, gain: 0.14, start: 0.42 });
    hiss(sfxBus, { dur: 0.5, gain: 0.06, from: 8000, to: 4000, type: 'highpass', start: 0.42 });
  },

  star(index = 0) {
    tone(sfxBus, { freq: note(index * 2, 2), type: 'triangle', dur: 0.4, gain: 0.14 });
    tone(sfxBus, { freq: note(index * 2 + 2, 2), type: 'sine', dur: 0.4, gain: 0.08, start: 0.05 });
  },

  record() {
    [0, 2, 4, 7, 9].forEach((d, i) => tone(sfxBus, {
      freq: note(d, 1), type: 'square', dur: 0.2, gain: 0.13, start: i * 0.08,
    }));
  },

  /** Heartbeat thud while the lava is close. */
  danger() {
    tone(sfxBus, { freq: 62, type: 'sine', dur: 0.32, gain: 0.22, bend: 40 });
  },

  lava() {
    hiss(sfxBus, { dur: 0.5, gain: 0.05, from: 500, to: 160, type: 'lowpass', q: 2 });
  },
};

/* ── Generative soundtrack ─────────────────────────────────── */

const BAR = 8;                 // eighth notes per bar
const PROGRESSION = [0, 0, 3, 4];   // scale degrees for the bass root
const ARP = [0, 2, 4, 2, 6, 4, 2, 0];

let timer = null;
let step = 0;
let nextTime = 0;
let tempo = 138;
let intensity = 0;             // 0..1, raised as the lava closes in

/** 0 = calm exploration, 1 = lava at your heels. Adds layers and tempo. */
export function setIntensity(value) {
  intensity = Math.max(0, Math.min(1, value));
}

function scheduleStep(i, t) {
  const bar = Math.floor(i / BAR) % PROGRESSION.length;
  const beat = i % BAR;
  const root = PROGRESSION[bar];
  const at = t - ac.currentTime;

  // Bass — the spine. Always present.
  if (beat % 2 === 0) {
    tone(musicBus, {
      freq: note(root, -1), type: 'square', start: at, dur: 0.2,
      gain: 0.22, filter: 700 + intensity * 500,
    });
  }

  // Kick on 1 and 5.
  if (beat === 0 || beat === 4) {
    tone(musicBus, { freq: 150, type: 'sine', start: at, dur: 0.16, gain: 0.34, bend: 45 });
  }

  // Hats fill in as it gets tense.
  if (intensity > 0.18 && beat % 2 === 1) {
    hiss(musicBus, { start: at, dur: 0.045, gain: 0.05 + intensity * 0.05, from: 9000, to: 6000, type: 'highpass' });
  }

  // Snare from halfway up.
  if (intensity > 0.45 && beat === 4) {
    hiss(musicBus, { start: at, dur: 0.14, gain: 0.14, from: 3200, to: 900, type: 'bandpass', q: 0.8 });
  }

  // Arpeggio — the melody, fades in with intensity.
  if (intensity > 0.05) {
    const deg = root + ARP[beat];
    tone(musicBus, {
      freq: note(deg, 1), type: 'triangle', start: at, dur: 0.13,
      gain: 0.05 + intensity * 0.09,
    });
  }

  // A high counter-line only at full panic.
  if (intensity > 0.75 && beat % 4 === 2) {
    tone(musicBus, {
      freq: note(root + ARP[beat] , 2), type: 'square', start: at,
      dur: 0.09, gain: 0.05,
    });
  }
}

function pump() {
  if (!ac) return;
  const eighth = 30 / (tempo + intensity * 26);
  while (nextTime < ac.currentTime + 0.18) {
    if (nextTime < ac.currentTime) nextTime = ac.currentTime + 0.02;
    scheduleStep(step, nextTime);
    nextTime += eighth;
    step += 1;
  }
}

export function startMusic() {
  if (!init()) return;
  if (timer !== null) return;
  step = 0;
  nextTime = ac.currentTime + 0.08;
  timer = setInterval(pump, 55);
  pump();
}

export function stopMusic() {
  if (timer !== null) { clearInterval(timer); timer = null; }
}

export function isMusicRunning() { return timer !== null; }
