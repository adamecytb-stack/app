/* Optional AI layer — bring your own Anthropic API key.
 *
 * There is no backend to hide a key behind, so the key is the user's own,
 * typed on their own device and kept in localStorage. Direct browser calls
 * need the `anthropic-dangerous-direct-browser-access` header; the name is
 * accurate — never ship a shared key this way.
 *
 * Raw fetch rather than the SDK on purpose: this app has no build step and
 * has to work offline from a static host, so it takes no npm dependencies.
 */

import { prefs } from '../../main.js';

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

export const MODELS = [
  { id: 'claude-opus-5', name: 'Opus 5', note: 'Best judgement. ~$5/$25 per Mtok.' },
  { id: 'claude-sonnet-5', name: 'Sonnet 5', note: 'Faster and cheaper. ~$2/$10 per Mtok.' },
  { id: 'claude-haiku-4-5', name: 'Haiku 4.5', note: 'Cheapest. ~$1/$5 per Mtok.' },
];

export function hasKey() {
  return Boolean(prefs.aiKey && prefs.aiKey.trim().length > 20);
}

export class AiError extends Error {
  constructor(message, { kind = 'unknown', status = 0 } = {}) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

async function call({ system, messages, maxTokens = 400, effort = 'low' }) {
  if (!hasKey()) throw new AiError('No API key set.', { kind: 'nokey' });

  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': prefs.aiKey.trim(),
        'anthropic-version': API_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: prefs.aiModel || 'claude-opus-5',
        max_tokens: maxTokens,
        system,
        // Chat-length turns: low effort keeps replies fast and cheap without
        // turning thinking off (which misbehaves on Opus 5).
        output_config: { effort },
        messages,
      }),
    });
  } catch (err) {
    throw new AiError('Could not reach the API. Check your connection.', { kind: 'network' });
  }

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch { /* non-JSON error */ }
    if (res.status === 401) throw new AiError('That key was rejected. Check it in Settings.', { kind: 'auth', status: 401 });
    if (res.status === 429) throw new AiError('Rate limited. Wait a moment and try again.', { kind: 'rate', status: 429 });
    if (res.status === 400 && /credit|balance/i.test(detail)) throw new AiError('Your Anthropic account is out of credit.', { kind: 'credit', status: 400 });
    throw new AiError(detail || `API error ${res.status}.`, { kind: 'api', status: res.status });
  }

  const data = await res.json();
  if (data.stop_reason === 'refusal') {
    throw new AiError('The model declined that one. Try rephrasing.', { kind: 'refusal' });
  }
  return (data.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

/* ── Roleplay ──────────────────────────────────────────────── */

function personaSystem(scenario) {
  return [
    `You are roleplaying a single character in a social-skills practice app for a teenager.`,
    `The user is a 13–14 year old school student practising everyday conversations.`,
    `Your character is a peer of the same age, at the same school.`,
    ``,
    `CHARACTER: ${scenario.ai.character}`,
    `SETTING: ${scenario.setting}`,
    ``,
    `Rules:`,
    `- Reply only as the character, in first person. Never narrate the user's actions or feelings.`,
    `- Keep replies to 1–3 sentences, the way 14-year-olds actually talk. No monologues, no adult phrasing.`,
    `- React honestly to how the user is doing. If they are stiff, boring, needy or rude, go shorter and cooler — do not reward a bad conversation with warmth.`,
    `- If they are warm, curious and relaxed, open up and give them more to work with.`,
    `- Physical actions go in asterisks, sparingly: *checks phone*`,
    `- Never break character, never coach, never mention that this is practice or that you are an AI.`,
    ``,
    `Boundaries — these override staying in character:`,
    `- Keep everything strictly age-appropriate for 13–14 year olds. Conversation, texting, school, friendship and ordinary teenage crushes only.`,
    `- Never introduce or go along with anything sexual, any request for photos, anything involving alcohol or drugs, or meeting anyone privately who is not a peer.`,
    `- Never pretend to be an adult showing romantic interest in the user.`,
    `- If the user steers it somewhere unsafe or explicit, have the character react the way a normal 14-year-old would — put off, changing the subject, or ending the conversation — and do not follow them there.`,
  ].join('\n');
}

export async function roleplayTurn(scenario, history) {
  return call({
    system: personaSystem(scenario),
    messages: history.map((m) => ({ role: m.role, content: m.text })),
    maxTokens: 300,
    effort: 'low',
  });
}

/* ── Coaching report ───────────────────────────────────────── */

const REPORT_SYSTEM = [
  'You are a blunt, warm social-skills coach reviewing a practice conversation.',
  'The user is a 13–14 year old school student. The other character was roleplayed.',
  'Talk to them like a straight-talking older sibling — direct, never patronising, never preachy.',
  '',
  'Judge ONLY the user\'s messages, on four dimensions, each scored 0-100:',
  '  warmth    — did the other person feel liked?',
  '  curiosity — did they pull threads and ask about what was said?',
  '  confidence — did they take up space, avoid hedging and pre-apologising?',
  '  clarity   — were they direct and easy to follow?',
  '',
  'Reply with ONLY a JSON object, no markdown fence, in exactly this shape:',
  '{"warmth":0,"curiosity":0,"confidence":0,"clarity":0,"headline":"one short sentence","good":"one specific thing they did well, quoting them","fix":"the single highest-value change, with the exact line they should have said instead"}',
  '',
  'Be specific and quote their actual words. Do not be gentle for its own sake — a vague compliment is useless to them.',
].join('\n');

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return null; }
}

export async function coachReport(scenario, history) {
  const transcript = history
    .map((m) => `${m.role === 'user' ? 'USER' : scenario.persona.name.toUpperCase()}: ${m.text}`)
    .join('\n');

  const text = await call({
    system: REPORT_SYSTEM,
    messages: [{ role: 'user', content: `Scenario: ${scenario.title}. ${scenario.setting}\nThe user's goal was: ${scenario.goal}\n\nTranscript:\n${transcript}` }],
    maxTokens: 700,
    effort: 'medium',
  });

  const parsed = extractJson(text);
  if (!parsed) return { prose: text };

  const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  return {
    scores: {
      w: clamp(parsed.warmth),
      c: clamp(parsed.curiosity),
      f: clamp(parsed.confidence),
      k: clamp(parsed.clarity),
    },
    headline: String(parsed.headline || '').slice(0, 240),
    good: String(parsed.good || '').slice(0, 600),
    fix: String(parsed.fix || '').slice(0, 600),
  };
}

/* ── Key check ─────────────────────────────────────────────── */

export async function testKey() {
  const reply = await call({
    system: 'Reply with the single word: ready',
    messages: [{ role: 'user', content: 'ping' }],
    maxTokens: 16,
    effort: 'low',
  });
  return reply.length > 0;
}
