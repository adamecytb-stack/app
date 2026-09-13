#!/usr/bin/env node
/* Renders the Prism app icons.
 *
 * No image libraries in this environment, so shapes are drawn as signed
 * distance fields (analytically anti-aliased) into an RGBA buffer, then
 * encoded as PNG with node's zlib. Run: node tools/make-icons.mjs
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const OUT = fileURLToPath(new URL('../assets/icons/', import.meta.url));
mkdirSync(OUT, { recursive: true });

/* ── PNG encoding ──────────────────────────────────────────── */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ── Geometry ──────────────────────────────────────────────── */

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const mix = (a, b, t) => a + (b - a) * t;

/** Distance from p to the segment ab. */
function segmentDistance(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const t = clamp01((apx * abx + apy * aby) / (abx * abx + aby * aby || 1e-6));
  const dx = apx - abx * t;
  const dy = apy - aby * t;
  return Math.hypot(dx, dy);
}

function hex(value) {
  const n = parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/* ── The mark ──────────────────────────────────────────────── */

const BONE = hex('#F7F3EB');
const EMBER = hex('#F5A524');
const MINT = hex('#4FD8A8');
const SKY = hex('#63C6F5');
const IRIS = hex('#9A86FF');

/**
 * @param size    output pixels
 * @param inset   0..0.5 — how much padding around the mark (maskable needs more)
 */
function render(size, inset) {
  const rgba = Buffer.alloc(size * size * 4);

  // Work in a 0..1 space, with the mark scaled into the safe area.
  const scale = 1 - inset * 2;
  const toLocal = (v) => (v - inset) / scale;

  // Triangle points (local space).
  const T = [0.5, 0.15];
  const L = [0.13, 0.82];
  const R = [0.87, 0.82];

  const strokeW = 0.075;
  const beamW = 0.055;
  const rayW = 0.05;

  // Refracted rays leaving the right face.
  const rays = [
    { y: 0.395, color: EMBER },
    { y: 0.515, color: MINT },
    { y: 0.635, color: SKY },
    { y: 0.755, color: IRIS },
  ];

  const px = 1 / (size * scale); // one output pixel, in local units
  const aa = px * 0.9;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = toLocal((x + 0.5) / size);
      const v = toLocal((y + 0.5) / size);

      // Background: warm-to-black diagonal, with an ember bloom behind the prism.
      const diag = clamp01(((x / size) + (y / size)) / 2);
      let r = mix(0x1A, 0x08, diag);
      let g = mix(0x15, 0x07, diag);
      let b = mix(0x26, 0x0E, diag);

      const bloom = Math.exp(-(((u - 0.5) ** 2 + (v - 0.62) ** 2)) / 0.075) * 0.55;
      r += EMBER[0] * bloom * 0.34;
      g += EMBER[1] * bloom * 0.24;
      b += EMBER[2] * bloom * 0.1;

      function paint(dist, width, color, glow = 0.0) {
        const cov = 1 - clamp01((dist - width / 2) / aa);
        if (cov > 0) {
          r = mix(r, color[0], cov);
          g = mix(g, color[1], cov);
          b = mix(b, color[2], cov);
        }
        if (glow > 0) {
          const halo = Math.exp(-((dist - width / 2) ** 2) / (glow * glow)) * 0.4;
          r = Math.min(255, r + color[0] * halo * 0.5);
          g = Math.min(255, g + color[1] * halo * 0.5);
          b = Math.min(255, b + color[2] * halo * 0.5);
        }
      }

      // Incoming beam: left edge into the left face.
      paint(segmentDistance(u, v, -0.02, 0.5, 0.315, 0.5), beamW, BONE, 0.03);

      // Refracted rays: from inside the prism out past the right edge.
      for (const ray of rays) {
        paint(segmentDistance(u, v, 0.6, ray.y, 1.02, ray.y), rayW, ray.color, 0.035);
      }

      // Prism outline last, so it sits over the beam and the rays.
      const outline = Math.min(
        segmentDistance(u, v, T[0], T[1], L[0], L[1]),
        segmentDistance(u, v, L[0], L[1], R[0], R[1]),
        segmentDistance(u, v, R[0], R[1], T[0], T[1]),
      );
      paint(outline, strokeW, BONE, 0.04);

      const i = (y * size + x) * 4;
      rgba[i] = Math.round(clamp01(r / 255) * 255);
      rgba[i + 1] = Math.round(clamp01(g / 255) * 255);
      rgba[i + 2] = Math.round(clamp01(b / 255) * 255);
      rgba[i + 3] = 255;
    }
  }

  return encodePng(size, size, rgba);
}

const jobs = [
  ['icon-192.png', 192, 0.06],
  ['icon-512.png', 512, 0.06],
  ['apple-touch-icon.png', 180, 0.06],
  // Maskable icons get cropped to a circle on some launchers: keep the mark
  // inside the 80% safe zone.
  ['maskable-512.png', 512, 0.16],
];

for (const [name, size, inset] of jobs) {
  const buf = render(size, inset);
  writeFileSync(join(OUT, name), buf);
  console.log(`${name} — ${size}×${size}, ${(buf.length / 1024).toFixed(1)} KB`);
}
