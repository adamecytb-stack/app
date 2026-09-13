#!/usr/bin/env node
/* Stamps a build id into sw.js and writes version.json.
 *
 *   node tools/build.mjs                 # stamp with a timestamp id
 *   node tools/build.mjs --build abc123  # stamp with an explicit id (CI passes the sha)
 *   node tools/build.mjs --check         # verify sw.js PRECACHE matches what's on disk
 *
 * The build id is what makes an installed PWA notice a new release: it changes
 * sw.js's bytes, the browser installs the new worker, and the app reloads itself.
 */
import { readFile, writeFile, readdir, stat, mkdtemp, copyFile, rm } from 'node:fs/promises';
import { join, relative, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const run = promisify(execFile);

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SW = join(ROOT, 'sw.js');

const SKIP_DIRS = new Set(['.git', '.github', 'node_modules', 'tools', '.idea', '.vscode']);
const SKIP_FILES = new Set(['version.json', 'README.md', '.nojekyll', '.DS_Store', 'sw.js']);

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      await walk(join(dir, entry.name), out);
    } else {
      if (SKIP_FILES.has(entry.name)) continue;
      out.push('./' + relative(ROOT, join(dir, entry.name)).split(sep).join('/'));
    }
  }
  return out;
}

function parsePrecache(src) {
  const block = src.match(/const PRECACHE = \[([\s\S]*?)\];/);
  if (!block) throw new Error('could not find PRECACHE in sw.js');
  return [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((p) => p !== './');
}

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : (args[i + 1] ?? true);
};

const files = (await walk(ROOT)).sort();
const swSrc = await readFile(SW, 'utf8');

/** Parse every module. `node --check` only treats .mjs as ESM, so copy first. */
async function syntaxCheck(paths) {
  const dir = await mkdtemp(join(tmpdir(), 'prism-check-'));
  const failures = [];
  try {
    for (const rel of paths) {
      const target = join(dir, `${rel.replace(/[./]/g, '_')}.mjs`);
      await copyFile(join(ROOT, rel), target);
      try {
        await run(process.execPath, ['--check', target]);
      } catch (err) {
        failures.push(`${rel}: ${String(err.stderr || err.message).split('\n').slice(0, 4).join(' ').trim()}`);
      }
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
  return failures;
}

if (flag('check') !== null) {
  const modules = files.filter((f) => f.endsWith('.js'));
  const broken = await syntaxCheck(modules);
  if (broken.length) {
    for (const line of broken) console.error(`syntax error — ${line}`);
    process.exit(1);
  }
  console.log(`syntax ok — ${modules.length} modules`);

  const listed = new Set(parsePrecache(swSrc));
  const onDisk = new Set(files);
  const missing = [...listed].filter((f) => !onDisk.has(f));
  const unlisted = [...onDisk].filter((f) => !listed.has(f));
  let bad = false;
  for (const f of missing) { console.error(`precache lists a file that does not exist: ${f}`); bad = true; }
  for (const f of unlisted) { console.error(`file is not in sw.js precache: ${f}`); bad = true; }
  if (bad) process.exit(1);
  console.log(`precache ok — ${listed.size} files`);
  process.exit(0);
}

const stamp = new Date().toISOString();
const build = String(flag('build') || `${stamp.slice(0, 10).replace(/-/g, '')}-${Date.now().toString(36)}`);

await writeFile(SW, swSrc.replace(/const BUILD = '[^']*';/, `const BUILD = '${build}';`));

const sizes = {};
for (const f of files) sizes[f] = (await stat(join(ROOT, f))).size;

await writeFile(
  join(ROOT, 'version.json'),
  JSON.stringify({ build, released: stamp, files: files.length, bytes: Object.values(sizes).reduce((a, b) => a + b, 0) }, null, 2) + '\n',
);

console.log(`build ${build} — ${files.length} files`);
