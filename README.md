# Prism

A pocket suite of small, sharp apps — free, offline-capable, and installable to an iPhone Home Screen. No accounts, no server, no subscriptions.

Two apps so far: **Gleam** (social skills) and **Scarab** (a tomb maze arcade game).

---

## Scarab

A maze arcade game. Flick up, down, left or right and the beetle slides until a wall stops it — you don't get to stop halfway or change your mind mid-slide.

- **Endless climb** — the main mode. Go as high as you can while lava rises from below, speeding up the higher you get and closing the gap faster if you stall. Score is height plus gold, with a chain multiplier for coins taken in a single slide.
- **12 levels** — fixed tombs with three stars each: clear it, take all the gold, and do it within par.
- **Hazards** — spikes, wardens that patrol, and the lava. One hit kills; shields absorb one.
- **Sound** — a generative chiptune soundtrack in Phrygian dominant (the scale that makes anything sound ancient) that adds layers and tempo as the lava closes in, plus ~15 effects. All synthesized from oscillators at runtime: no audio files, so it still works offline.

Everything is drawn procedurally on a canvas — no sprite sheets. The art, the beetle, the levels, the music and the name are all original to this repo; what it shares with the games that inspired it is the slide-until-you-hit-something mechanic, which is a rule, not artwork.

**Content is machine-verified.** Slide movement makes level design deceptively hard — you can only stop where a wall stops you, so hand-drawn mazes routinely end up with uncollectable coins or an unreachable exit. So:

```bash
node tools/check-levels.mjs     # proves every level is completable and every chunk escapable
node tools/gen-levels.mjs       # proposes new level candidates, discarding anything unsolvable
```

Maps are **mazes**, not open rooms with a few pillars. That matters more than it sounds: with nothing to stop you, one flick carries you clean across the map and there is no decision in it. Dense one-cell corridors keep every slide to two or three cells. The generator enforces this rather than leaving it to taste — a candidate is discarded if its longest slide exceeds `MAX_SLIDE` or its average exceeds `AVG_SLIDE`. Shipped content runs at max 6–7, average ~3.

`check-levels` runs a breadth-first search over slide moves with a collectible bitmask, which gives the *exact* optimal number of slides for a full clear — that's where each level's `par` comes from, so the third star is genuinely earned.

For arcade chunks it proves something stronger than "a way out exists": **every cell you can reach inside a chunk must itself still be able to reach the top.** Otherwise a perfectly normal move can strand you, and the run ends because of the generator rather than because of you. Slide reachability is not symmetric, so this is also checked in the direction the game is actually played — bottom to top.

Spikes are bolted to a wall and point away from it, with the facing derived from the finished grid at parse time so it can never disagree with the map. The generator only places them on cells that have a wall to attach to, and the checker fails any spike left floating.

It also emits the optimal move sequence (`--solution l1`), which the browser test replays key by key and asserts a three-star clear. If the engine's physics ever drift from the solver's model, that test fails.

---

The first app is **Gleam**: a Duolingo-style trainer for social skills, replicating the paid app of the same name (bite-sized scenario lessons, streaks, XP, a weekly league, AI practice conversations) with the paywall removed.

**The content is written for one specific person**: a 13–14 year old who is completely fine with their friends and falls apart around people they like romantically. Every example is set at school, in a group chat, or at someone's house — there is no careers advice, no networking, no bars, no dating apps. If that is not you, the lessons in `data/gleam/courses/` are plain JS and rewriting them is the whole job.

---

## Getting it online

The repo is the site — no build step, no bundler, no `npm install`.

1. **Push to `main`.** The Pages workflow (`.github/workflows/deploy.yml`) runs on every push there.
2. **Enable Pages:** repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**. Do this once.
3. Your site appears at `https://<user>.github.io/<repo>/` a minute later.

If you'd rather deploy from this feature branch instead of `main`, change the `branches:` line in the workflow.

## Putting it on your Home Screen

Open the site **in Safari** on iOS, tap **Share → Add to Home Screen**. It then runs full screen with no browser chrome, works with no signal, and keeps your progress on the device.

### You never have to reinstall it

That was the main requirement, so it's handled in three layers:

- The service worker re-checks itself on every launch, on every return to the app, and hourly.
- `version.json` is polled with `no-store`, which catches the case where an aggressive HTTP cache hides the new `sw.js`.
- A waiting update is applied immediately: silently when you're idle, behind a one-tap toast when you're mid-lesson so you don't lose an answer.

Every deploy stamps a fresh build id into `sw.js` (that's what the browser notices), and `Profile → Updates` shows the running build with a manual **Check for updates** button.

---

## What's in Gleam

**Onboarding** — 27 steps, close to the real app's: goal quiz, blocker diagnostic, three situational questions, a self-rating slider, an animated "building your profile" pass, a social-baseline score reveal on a dial, a comparison chart, a 90-day projection, and the signature **press-and-hold fingerprint commitment**. No paywall — the real app's funnel ends in a subscription; this one ends in lesson one.

**40 lessons / 243 exercises across 8 courses**, reordered by the goals you pick in onboarding:

| Course | What it drills |
|---|---|
| Talking To Them | why you go blank, openers, keeping it going, being funny when nervous, their friends being there |
| Texting Them | starting from nothing, reply speed, not being dry, stories and streaks, getting off the phone |
| Do They Like Me? | what actually counts as a signal, reading texts, reading them in person, spotting a no, how to stop guessing |
| Making A Move | why nothing ever happens, asking them to hang out, saying it, if they say no, if they say yes |
| Overthinking & Nerves | the 2am replay, cringe attacks, calming down beforehand, the spotlight effect, doing it scared |
| School Days | the person you sit next to, lunch, corridors, group projects, getting into a group |
| Parties & Hangouts | walking in, joining a group, when your friends vanish, group games, leaving well |
| Being Someone People Like | warmth over impressive, listening visibly, telling a story, trying too hard, banter that goes too far |

**Eight exercise types** — concept cards, best-reply multiple choice, select-all, true/false, ordering, fill-the-gap, matching pairs, and free-text answers scored against a rubric with a model answer. Anything you get wrong is pushed back onto the end of the lesson, which is the mechanic that makes drilling actually work.

**Practice** — six branching conversations that run as one arc with the same person: sat next to them in class → the class group chat → DMs at half nine → they're at the same party → asking them to hang out → and one for when they say no. Every reply is scored on warmth, curiosity, confidence and clarity, and each one tells you *why* it lands or doesn't.

**Gamification** — XP and a daily goal, streaks with auto-spending streak freezes (earned every three good days, two max), 13 achievements, a 12-week activity heatmap, and a weekly league with promotion and demotion.

---

## The optional AI layer

Everything above works with no key, offline, forever. Add an **Anthropic API key** in `Profile → Practice → AI practice partner` and practice gains a **freeform mode**: type whatever you want, Claude plays the other person in character, and at the end you get a written coaching report with scores and the single highest-value change to make.

There is no backend to hide a key behind, so:

- The key is stored in this browser only (`localStorage`) and sent directly to `api.anthropic.com` from your device.
- Requests use the `anthropic-dangerous-direct-browser-access` header. That name is accurate — this is fine for *your own* key on *your own* device, and it is never appropriate for a shared one.
- Anyone with access to the device can read it, so use a key you're happy to rotate. Remove it any time from the same screen.

Model is selectable (Opus 5 / Sonnet 5 / Haiku 4.5); roleplay turns run at low effort so replies come back fast and cost a fraction of a cent.

The roleplay system prompt states the user's age and holds the character to it: peers only, school-level conversation, and the character refuses and disengages if the chat is steered anywhere explicit or unsafe. That is in `js/apps/gleam/ai.js` if you want to read it.

---

## Honest notes

- **The league is simulated.** There's no server and no other players — rivals are a deterministic roster seeded from the ISO week, with XP curves that advance in real time. The app says so on the League screen. The pressure still works.
- **The baseline score is not a clinical measure.** It's a weighted read of your own onboarding answers, there to give the number somewhere to move from.
- **Data lives in one browser.** No account, no sync, no analytics. `Profile → Export a backup` writes a JSON file; **Restore** reads it back. That's how you move to a new phone.
- **Hearts are off by default.** The real Duolingo mechanic is in there as a toggle, but wrong answers re-queueing is what actually teaches, so nothing blocks you by default.
- **Rewriting the course library bumps `CONTENT_VERSION`** in `js/apps/gleam/state.js`. On the next load, progress pointing at lessons that no longer exist is pruned and the plan re-derives — XP, streak and achievements are kept, because they were still earned.

---

## Working on it locally

```bash
npx http-server -p 8099 -c-1 .    # any static server works
open http://127.0.0.1:8099/
```

Before pushing:

```bash
node tools/build.mjs --check      # parses every module + verifies the SW precache list
```

CI runs the same check and fails the deploy if a file is missing from `sw.js`'s precache list or a module doesn't parse.

```bash
node tools/make-icons.mjs         # regenerate app icons (pure Node, no image libs)
node tools/build.mjs --build abc  # stamp a build id by hand
```

### Layout

```
index.html            shell: background layers, #app, toast + sheet layers
sw.js                 service worker — versioned cache, network-first navigation
version.json          build id, regenerated at deploy
css/                  tokens → base → hub → gleam
js/core/              router, store, UI kit (hyperscript, icons, sound, confetti), update manager
js/apps/hub/          the Prism launcher
js/apps/gleam/        onboarding, learn path, lesson engine, practice, league, profile, AI client
js/apps/scarab/       game engine, synth audio, levels, arcade chunks, screens
data/gleam/           course content + practice scenarios (plain JS modules)
tools/                build stamping, icon generation, level solver and generator
```

### Adding the next app

1. Add an entry to `APPS` in `js/core/registry.js` (id, name, tagline, accent colours, SVG mark).
2. Create `js/apps/<id>/index.js` exporting `register()` that adds its routes.
3. Import and call it in `js/main.js`.
4. Give it a slice of storage with `slice('<id>', defaults)` from `js/core/store.js`.
5. Add its files to the `PRECACHE` list in `sw.js` (`node tools/build.mjs --check` will tell you if you forget).

The hub retints every shared component to the app's accent on entry, so one component set wears a different colour per app.

Sketched but not built yet, listed on the hub: **Ember** (habit streaks), **Tide** (sleep), **Ledger** (money), **Plate** (calories).
