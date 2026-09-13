/* Practice conversations.
 *
 * Each scenario is a spine of turns. A choice carries a score across four
 * dimensions and the reaction it provokes, so the other person feels
 * responsive without needing a combinatorial branch tree.
 *
 *   score: { w: warmth, c: curiosity, f: confidence, k: clarity }   // -1 .. 2
 *
 * `ai` seeds the optional bring-your-own-key mode with the same character.
 */

export const DIMENSIONS = [
  { key: 'w', name: 'Warmth', note: 'Did they feel liked?' },
  { key: 'c', name: 'Curiosity', note: 'Did you go after what they said?' },
  { key: 'f', name: 'Confidence', note: 'Did you take up your space?' },
  { key: 'k', name: 'Clarity', note: 'Were you direct and easy to follow?' },
];

export const SCENARIOS = [
  {
    id: 'coffee-queue',
    title: 'The coffee queue',
    course: 'small-talk',
    difficulty: 1,
    setting: 'A long queue in a café near your office. The person ahead of you keeps checking the time.',
    goal: 'Start something from nothing, and leave it warm.',
    persona: { name: 'Nadia', initial: 'N', note: 'In a hurry, not unfriendly' },
    ai: {
      character: 'Nadia, early 30s, waiting in a long café queue before a meeting she is mildly stressed about. Dry sense of humour. Warm if the other person is easy, monosyllabic if they are stiff or intense.',
      opening: '*checks phone, sighs at the queue*',
    },
    turns: [
      {
        npc: '*glances at the queue, then at her phone again*',
        choices: [
          { text: '“I think we live here now.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*laughs* “Honestly. I have aged in this line.”', note: 'Shared-third opener. Low cost, easy to answer, and the joke does the warmth for you.' },
          { text: '“Excuse me, sorry — is this the queue?”', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '“...Yeah.” *turns back to her phone*', note: 'A logistics question opens nothing. The double apology sets you below her before you start.' },
          { text: '“You look like you are in a rush. Big day?”', s: { w: 1, c: 2, f: 1, k: 1 }, reaction: '“Is it that obvious? I have a thing at ten that I am not ready for.”', note: 'Observant and warm, though it reads her state out loud — fine here because it is visible and harmless.' },
          { text: 'Say nothing. Look at your phone.', s: { w: -1, c: -1, f: -1, k: 0 }, reaction: '*the queue moves. Nothing happens.*', note: 'The default. Always available, never gets you anywhere.' },
        ],
      },
      {
        npc: '“I have got a presentation at ten and I have not looked at it since Friday.”',
        choices: [
          { text: '“Classic. What is it on?”', s: { w: 1, c: 2, f: 1, k: 2 }, reaction: '“Supply chain forecasting. Try to contain yourself.”', note: 'Light normalising plus a real question. She gets to be funny about her own topic.' },
          { text: '“Oh I never leave things that late.”', s: { w: -1, c: -1, f: 1, k: 2 }, reaction: '“...Good for you.” *small laugh, turns away slightly*', note: 'A status bid at her expense. You won a point and lost the conversation.' },
          { text: '“Honestly, my best work has all been done in a blind panic.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Right? I am choosing to find that reassuring.”', note: 'A small confession that puts you on her side. This is the highest-yield everyday move there is.' },
          { text: '“That sounds stressful.”', s: { w: 1, c: 0, f: 0, k: 1 }, reaction: '“Yeah.” *pause*', note: 'Kind but closed. There is nothing here for her to pick up.' },
        ],
      },
      {
        npc: '“Anyway. What about you, are you escaping something or just caffeine?”',
        choices: [
          { text: '“Caffeine. Purely.”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '“Fair.” *nods, looks at the counter*', note: 'True and dead. No free information means she has to invent the next question alone.' },
          { text: '“Escaping. I have a spreadsheet upstairs that has beaten me twice already.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Twice! What is in it?” *properly turns towards you*', note: 'Answer plus a hook. One specific, slightly absurd detail is all it takes.' },
          { text: '“Just work stuff, nothing interesting.”', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '“Fair enough.” *back to phone*', note: 'Pre-emptively declaring yourself boring. People tend to believe you.' },
          { text: '“Both. Also I wanted to see if this place is as slow as everyone says.”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“And? Verdict?” *grins*', note: 'Playful callback to the opener. Keeps the thread alive without effort.' },
        ],
      },
      {
        npc: '*She reaches the front, orders, then turns back to you* “Right — good luck with the spreadsheet.”',
        choices: [
          { text: '“Thanks. Good luck at ten — I hope supply chains are kind to you.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“Ha — thank you. I needed that.” *genuine smile, leaves*', note: 'A callback in the goodbye. It proves you listened, and the last thirty seconds are what she will remember.' },
          { text: '“You too, bye.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Bye.” *leaves*', note: 'Nothing wrong with it. Also nothing in it — the conversation ends on its flattest note.' },
          { text: '“Wait — are you here most mornings?”', s: { w: 1, c: 1, f: 2, k: 1 }, reaction: '“Most, yeah. Usually earlier than this.” *slightly surprised, friendly*', note: 'Bold and fine. It reads better after a good exchange than as an opener.' },
          { text: '*nod, no words*', s: { w: -1, c: 0, f: 0, k: 0 }, reaction: '*she leaves*', note: 'You did the hard part and skipped the cheap part.' },
        ],
      },
    ],
  },

  {
    id: 'party-stranger',
    title: 'The party where you know one person',
    course: 'groups',
    difficulty: 2,
    setting: 'A friend\'s birthday. They vanished twenty minutes ago. You are next to someone by the kitchen.',
    goal: 'Turn standing near someone into an actual conversation.',
    persona: { name: 'Tobias', initial: 'T', note: 'Also a bit stranded' },
    ai: {
      character: 'Tobias, 30s, at a birthday party where he knows only the host. Friendly but slightly awkward, warms up fast if the other person is easy. Works in landscape gardening, recently moved cities.',
      opening: '*standing near the snacks, holding a beer, looking around*',
    },
    turns: [
      {
        npc: '*standing near you, both of you facing the room*',
        choices: [
          { text: '“Are you also just standing here hoping someone talks to you?”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*laughs* “God, yes. I have been doing laps for ten minutes.”', note: 'Naming the shared awkwardness dissolves it instantly. Both of you are off the hook.' },
          { text: '“So how do you know the host?”', s: { w: 1, c: 1, f: 1, k: 2 }, reaction: '“We used to work together. You?”', note: 'The standard party opener. Safe, functional, slightly forgettable.' },
          { text: '“Nice party.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Yeah, it is good.” *pause*', note: 'A closed comment about a thing you are both already in.' },
          { text: '“What do you do?”', s: { w: 0, c: 1, f: 1, k: 2 }, reaction: '“Landscape gardening, mostly.” *waits*', note: 'Straight to the CV question. It works, but it starts you in the driest possible register.' },
        ],
      },
      {
        npc: '“I do landscaping — mostly gardens for people who are never in them.”',
        choices: [
          { text: '“That is a very pointed way to describe your clients.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*grins* “You have no idea. I built a whole herb garden for a man who eats out every night.”', note: 'You caught the wry edge in what he said and played with it. This is threading done well.' },
          { text: '“Cool. Do you enjoy it?”', s: { w: 1, c: 1, f: 0, k: 1 }, reaction: '“Yeah, mostly.” *nods*', note: 'A yes/no question about a topic he just made interesting. The energy drops.' },
          { text: '“How long have you done that?”', s: { w: 0, c: 1, f: 1, k: 2 }, reaction: '“About eight years.”', note: 'A number. You walked past the interesting part to collect a fact.' },
          { text: '“I have killed every plant I have ever owned.”', s: { w: 2, c: 0, f: 1, k: 2 }, reaction: '“Everyone says that. It is almost always overwatering.” *warms up*', note: 'A small confession that hands him expertise. Easy generosity.' },
        ],
      },
      {
        npc: '“What about you? Are you local, or did you get dragged here?”',
        choices: [
          { text: '“Local, three years. Came for a job I quit almost immediately, so, great planning.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Ha! Same energy — I moved here in January for someone I am no longer with.”', note: 'Free information plus a hook. He matched your disclosure level immediately, which is exactly what should happen.' },
          { text: '“Local.”', s: { w: 0, c: 0, f: 0, k: 2 }, reaction: '“Right.” *looks around the room*', note: 'One word. He now has to do all the work, and he probably will not.' },
          { text: '“Dragged, honestly. I know exactly one person here and they have vanished.”', s: { w: 2, c: 0, f: 1, k: 2 }, reaction: '“Same! Should we just... be each other\'s person?”', note: 'Honest, funny, and it turns the situation into something you share.' },
          { text: '“Yeah I am local. Anyway, what were you saying about the herb garden?”', s: { w: 1, c: 2, f: 1, k: 1 }, reaction: '“Oh — right, yeah.” *slightly thrown but pleased*', note: 'Good instinct to return to his thread. Slightly abrupt: give something before you take.' },
        ],
      },
      {
        npc: '*the host reappears across the room and waves at you both*',
        choices: [
          { text: '“Before we get absorbed — I am going to steal your overwatering theory and pretend it is mine.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“Please do. Tell them the plant forgave you.” *both laughing as the host arrives*', note: 'Callback, warmth, and you closed the loop before the interruption. Textbook exit-on-a-high.' },
          { text: '*turn away to the host without a word*', s: { w: -1, c: -1, f: 0, k: 0 }, reaction: '*Tobias is left mid-conversation*', note: 'The moment a new person arrives is exactly when the previous one gets dropped. Do not be that.' },
          { text: '“Come over — you should meet her properly.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“Yeah, alright.” *visibly relieved to be brought along*', note: 'Host behaviour from a guest. Bringing someone with you is the strongest group move on the list.' },
          { text: '“Anyway. Nice chatting.”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '“You too.” *turns away*', note: 'Clean but cold. No door left open at all.' },
        ],
      },
    ],
  },

  {
    id: 'first-date',
    title: 'Twenty minutes into a first date',
    course: 'dating',
    difficulty: 3,
    setting: 'A wine bar. It is going okay. There has just been the first proper lull.',
    goal: 'Move it from polite to real without forcing it.',
    persona: { name: 'Ines', initial: 'I', note: 'Interested, slightly guarded' },
    ai: {
      character: 'Ines, 30s, on a first date from an app. Warm but a bit guarded early on; funny and direct once she relaxes. Architect. Hates being interviewed and will gently push back if the conversation feels like a questionnaire.',
      opening: '*swirls her glass* “So. This is the bit where we run out of easy questions.”',
    },
    turns: [
      {
        npc: '*a lull. She swirls her glass* “So. This is the bit where we run out of the easy questions.”',
        choices: [
          { text: '“Right — do you want to skip to the strange ones?”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*laughs* “Yes. Absolutely yes.”', note: 'She named the lull; you turned it into an invitation. Playful and forward without being heavy.' },
          { text: '“Ha, yeah. So what do you do for fun?”', s: { w: 0, c: 1, f: 0, k: 1 }, reaction: '“...Hiking, I suppose?” *the questionnaire continues*', note: 'She just told you the easy questions were exhausted, and you asked one anyway.' },
          { text: '“I was weirdly nervous about tonight, which I have not been in a while.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Oh thank God. I changed three times.” *visibly relaxes*', note: 'A confession at exactly the right moment. It resets the register from performance to real.' },
          { text: '*laugh nervously and look at the menu*', s: { w: 0, c: -1, f: -1, k: 0 }, reaction: '“...Yeah.” *she looks at hers too*', note: 'She made an opening and you let it close.' },
        ],
      },
      {
        npc: '“Okay. Strange question, then: what is something you have completely changed your mind about?”',
        choices: [
          { text: '“Dogs. I was militantly anti-dog until about two years ago and now I stop for all of them.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Militantly anti-dog. What did they do to you?” *leaning in*', note: 'Specific, self-mocking, easy to pull on. She immediately had a follow-up, which is the test.' },
          { text: '“Hmm. Nothing comes to mind.”', s: { w: -1, c: -1, f: -1, k: 1 }, reaction: '“Fair enough.” *the energy drops noticeably*', note: 'She took a risk with a real question. “Nothing” is the one answer that punishes it.' },
          { text: '“Probably politics, but that is a heavy first-date topic.”', s: { w: 0, c: 0, f: 1, k: 1 }, reaction: '“...Probably, yeah.” *neutral*', note: 'You raised a topic and refused it in the same sentence. It creates a small dead zone.' },
          { text: '“That people either have it together or they do not. Turns out everyone is improvising.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“God, yes. When did you work that out?” *properly engaged now*', note: 'A real answer at Level 3. It gives her somewhere genuine to go.' },
        ],
      },
      {
        npc: '“See, this is much better than the CV portion of the evening.”',
        choices: [
          { text: '“Agreed. Although I did prepare some very strong facts about myself.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Go on then. Best fact.” *delighted*', note: 'Self-aware, light, and it hands her the next move. This is flirting: warmth with the intent showing.' },
          { text: '“Yeah, small talk is the worst.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Mm.” *agreement, nowhere to go*', note: 'Agreeing without adding. The thread ends in your hand.' },
          { text: '“You are quite good at this, you know.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*slightly caught out, pleased* “I have my moments.”', note: 'A specific compliment about something she is doing, not how she looks. Lands well and raises the temperature a notch.' },
          { text: '“So what are you looking for, generally?”', s: { w: 0, c: 1, f: 1, k: 0 }, reaction: '“Oh — um. That is a big one for twenty minutes in.” *pulls back slightly*', note: 'A trapdoor, not a staircase. You skipped three levels in one question.' },
        ],
      },
      {
        npc: '*the evening is winding down. She reaches for her coat* “This was really not what I expected.”',
        choices: [
          { text: '“In a good way, I hope. I would like to do it again — are you free next week?”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“I am, actually. Yes.” *smiling*', note: 'Direct, specific, and asked while it is still going well. Clarity is kind.' },
          { text: '“Yeah, same. We should do this again sometime.”', s: { w: 1, c: 0, f: 0, k: 0 }, reaction: '“Definitely, yeah.” *neither of you will make it concrete*', note: '“Sometime” is how two interested people accidentally never meet again.' },
          { text: '“Ha, I will take that.”', s: { w: 1, c: 0, f: 1, k: 1 }, reaction: '“You should.” *warm, but the moment passes*', note: 'Charming and unfinished. She gave you an opening and you enjoyed it instead of using it.' },
          { text: '“I will text you.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Okay.” *neutral*', note: 'The phrase has been ruined by everyone who said it and did not. Say the specific thing instead.' },
        ],
      },
    ],
  },

  {
    id: 'friend-upset',
    title: 'A friend is not okay',
    course: 'reading-people',
    difficulty: 2,
    setting: 'Your kitchen. They came over “for a coffee” and have been quiet for ten minutes.',
    goal: 'Be useful without fixing, minimising, or making it about you.',
    persona: { name: 'Rafa', initial: 'R', note: 'Holding something in' },
    ai: {
      character: 'Rafa, close friend, mid-30s. Has just been passed over for a promotion he was told was his. Deflects with humour, minimises, says “it is fine” while clearly not fine. Opens up if given room and shuts down if given advice too early.',
      opening: '*stirring a coffee he has not drunk* “Anyway. How are you?”',
    },
    turns: [
      {
        npc: '*stirring a coffee he has not touched* “Anyway. Enough about me. How are you?”',
        choices: [
          { text: '“We have not actually talked about you yet. What is going on?”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*long pause* “...They gave the role to someone else.”', note: 'You noticed the deflection and named it gently. That is what opens the door.' },
          { text: '“Yeah, good! Work is mad but fine.”', s: { w: 0, c: -1, f: 0, k: 1 }, reaction: '“Good, good.” *he takes the exit you offered*', note: 'He handed you a way out and you took it. He will leave with it still in his chest.' },
          { text: '“You have been stirring that coffee for four minutes.”', s: { w: 1, c: 2, f: 2, k: 2 }, reaction: '*small laugh* “Have I.” *puts the spoon down* “It has been a week.”', note: 'Naming what you observe, lightly, is often gentler than a direct question.' },
          { text: '“Is this about the promotion?”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '“...Yeah.” *guarded*', note: 'Direct and probably right. It can land as being caught out rather than being noticed.' },
        ],
      },
      {
        npc: '“They gave it to someone who has been there eight months. It is fine. It is genuinely fine.”',
        choices: [
          { text: '“That does not sound fine.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*exhales* “No. It is not.” *and then it comes out*', note: 'Words and tone disagreed; you went with the tone. Four words, and the real conversation starts.' },
          { text: '“At least you still have the senior role, right?”', s: { w: -1, c: -1, f: 0, k: 1 }, reaction: '“...Yeah. I guess.” *closes down*', note: '“At least” is an argument that he should feel better than he does. It reliably ends disclosure.' },
          { text: '“That is ridiculous, you should talk to HR.”', s: { w: 0, c: -1, f: 1, k: 1 }, reaction: '“It is not — it is fine. Honestly.” *retreats further*', note: 'Solving before understanding. He has to defend the situation now instead of feeling it.' },
          { text: '“Eight months. God. How did you find out?”', s: { w: 1, c: 2, f: 1, k: 2 }, reaction: '“In the all-hands. Same time as everyone else.” *the real wound surfaces*', note: 'A specific question that lets him tell it rather than summarise it — and it found the actual injury.' },
        ],
      },
      {
        npc: '“I found out in the all-hands. Everyone turned and looked at me.”',
        choices: [
          { text: '“So it is not really the job. It is being blindsided in front of everyone.”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*nods slowly* “Yeah. That is exactly it.” *visibly relieved to be understood*', note: 'A reflection that finds the thing under the thing. This is the highest-value move in supportive conversation.' },
          { text: '“That is horrible. I would have walked out.”', s: { w: 1, c: 0, f: 2, k: 1 }, reaction: '“Ha. I thought about it.” *some relief, but it is now about what you would do*', note: 'Solidarity, slightly overshooting. It nudges him toward performing anger rather than feeling what he feels.' },
          { text: '“Do you want thoughts, or do you just want to say it out loud?”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“...Just say it, I think. Sorry.” *and he keeps going*', note: 'The most useful sentence available. It prevents the single most common failure — solving when he wanted witnessing.' },
          { text: '“Something similar happened to me actually—”', s: { w: -1, c: -1, f: 1, k: 1 }, reaction: '“Oh, right.” *he listens politely to your story*', note: 'Level 1 listening. The spotlight moved and it will not come back tonight.' },
        ],
      },
      {
        npc: '*a long pause* “Sorry. I did not mean to dump all this on you.”',
        choices: [
          { text: '“You did not. This is what the kitchen is for.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*proper laugh* “Thanks.” *and he means it*', note: 'Short, warm, and it removes the apology without making a speech about it.' },
          { text: '“Honestly, it is fine. Anyway — are you hungry?”', s: { w: 1, c: 0, f: 1, k: 1 }, reaction: '“Yeah, could eat.” *the moment closes a bit early*', note: 'Kind, but you took the first exit. Let the pause sit a beat longer.' },
          { text: '“You never dump things on me. That is sort of the problem.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*quiet* “Yeah. Fair.”', note: 'True, affectionate, and slightly braver than the comfortable answer. It invites more next time.' },
          { text: '“No worries.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Cool.” *he starts getting his coat*', note: 'Two words that make the whole conversation feel like it was an imposition after all.' },
        ],
      },
    ],
  },

  {
    id: 'networking',
    title: 'The person you wanted to meet',
    course: 'charisma',
    difficulty: 3,
    setting: 'An industry event. You have been trying to talk to this person all evening. They are briefly alone.',
    goal: 'Be memorable without pitching, grovelling, or bidding for status.',
    persona: { name: 'Odette', initial: 'O', note: 'Senior, has heard every pitch' },
    ai: {
      character: 'Odette, 50s, senior and well-known in the industry. Has been approached all evening and is slightly tired of it. Sharp, dry, generous with people who are relaxed and direct, immediately bored by flattery or pitches.',
      opening: '*standing alone near the window with a drink, briefly unbothered*',
    },
    turns: [
      {
        npc: '*alone by the window, enjoying two minutes of not being talked at*',
        choices: [
          { text: '“I have been working up to coming over here for about forty minutes, so this had better be good.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*laughs* “No pressure on me at all, then.”', note: 'Honest, self-aware, and it makes her the one who is put at ease. Confidence without a bid.' },
          { text: '“I am such a huge admirer of your work — the talk you gave in Lisbon changed how I think.”', s: { w: 1, c: 0, f: -1, k: 2 }, reaction: '“That is kind, thank you.” *polite wall goes up*', note: 'Flattery puts her in the position of receiving tribute. She has done that nine times tonight.' },
          { text: '“Hi — sorry to interrupt, I know you must be exhausted.”', s: { w: 1, c: 0, f: -1, k: 1 }, reaction: '“It is fine.” *waits*', note: 'You framed yourself as an imposition, so she has to reassure you before anything can happen.' },
          { text: '“You look like someone hiding from the room.”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*grins* “Caught. Ninety more seconds and I would have been fine.”', note: 'An accurate, playful observation. It reads her situation generously and gives her a way in.' },
        ],
      },
      {
        npc: '“So — are you going to tell me what you do, or can we skip that part?”',
        choices: [
          { text: '“Let us skip it. I would rather know what you are actually working on that you are not talking about on stage.”', s: { w: 1, c: 2, f: 2, k: 2 }, reaction: '*raises an eyebrow* “Now that is a better question.” *settles in*', note: 'You took the invitation and asked something she does not get asked. That is how you become the memorable one.' },
          { text: '“I run a small team at—” *and you describe your role for ninety seconds*', s: { w: 0, c: -1, f: 1, k: 0 }, reaction: '“Mm. Interesting.” *scanning the room*', note: 'She offered you an exit from the CV portion and you did the CV portion.' },
          { text: '“Skip it. Nothing you have not heard.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Alright.” *pause, and it is yours to fill*', note: 'Fine, but you gave nothing and asked nothing. Now the silence is your problem.' },
          { text: '“Honestly I mostly wanted to ask you something and I have forgotten what it was.”', s: { w: 2, c: 0, f: 1, k: 1 }, reaction: '*laughs* “Take your time.”', note: 'Disarming and human. It buys goodwill, though you now need to produce an actual question.' },
        ],
      },
      {
        npc: '“Most people who come over here want something. What do you want?”',
        choices: [
          { text: '“Twenty minutes of your time in a month, once I have something worth showing you.”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“That is a reasonable ask. Email me.” *takes out her phone*', note: 'Specific, bounded, and delayed until you have earned it. This is how the actual ask should sound.' },
          { text: '“Nothing! Genuinely nothing.”', s: { w: 1, c: 0, f: 0, k: 0 }, reaction: '“Everyone says that.” *amused, unconvinced*', note: 'It is a fine instinct and it reads as a dodge. She asked a direct question — answer it.' },
          { text: '“A job, ideally.” *said lightly*', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '*laughs* “At least that is honest. We are not hiring, but tell me what you do.”', note: 'Directness with a light touch. Even a no becomes a conversation.' },
          { text: '“I mean, if you had any advice for someone starting out...”', s: { w: 0, c: 1, f: -1, k: 0 }, reaction: '“...In general?” *the question is too big to answer*', note: 'Unanswerably broad. It asks her to do all the work of narrowing it.' },
        ],
      },
      {
        npc: '*someone is hovering nearby, clearly waiting for their turn*',
        choices: [
          { text: '“I will let you get back to it. Genuinely good to meet you — I will send that email.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Do. And thank you for not pitching me.” *she means it*', note: 'You noticed the hoverer and released her before she had to manage it. Read the room; leave on a high.' },
          { text: 'Keep talking — you finally got here.', s: { w: -1, c: 0, f: 1, k: 0 }, reaction: '*her attention splits. The good part of the conversation is over.*', note: 'Holding someone past the natural end undoes the goodwill you just built.' },
          { text: '“One more thing before I lose you—”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '“Go on, quickly.” *she gives you the beat*', note: 'Acknowledging the clock buys you a genuine extra thirty seconds. Use them well.' },
          { text: '*trail off and drift away*', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '*she turns to the next person*', note: 'No close at all. The last impression is a fade.' },
        ],
      },
    ],
  },

  {
    id: 'saying-no',
    title: 'Your manager asks for one more thing',
    course: 'hard-conversations',
    difficulty: 3,
    setting: 'A one-to-one. You are already at capacity. She has a new project she wants you on.',
    goal: 'Hold the line, keep the relationship, avoid a resentful yes.',
    persona: { name: 'Beatriz', initial: 'B', note: 'Reasonable, but will take a yes' },
    ai: {
      character: 'Beatriz, engineering manager, direct and reasonable but under pressure herself. Will accept a clear no with a reason, and will absolutely accept a soft yes if offered one. Respects people who negotiate scope rather than complain.',
      opening: '“So — I want to put you on the Harbour migration as well. It is not huge.”',
    },
    turns: [
      {
        npc: '“I want to put you on the Harbour migration too. It should not be huge.”',
        choices: [
          { text: '“I cannot take that on as well. I am at capacity with the intake work until the 20th.”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“Okay. Talk me through what is on your plate.”', note: 'Clear no, specific reason, no apology spiral. She moves straight to problem-solving, which is what you want.' },
          { text: '“Yeah, I can probably squeeze it in.”', s: { w: 1, c: 0, f: -1, k: 0 }, reaction: '“Great, I will add you.” *and now you own it*', note: 'A yes you will resent. “Probably squeeze” is how three months of quiet overload starts.' },
          { text: '“I mean... it depends how big it is, I guess, but I am pretty stretched, although if it is really needed then—”', s: { w: 1, c: 0, f: -1, k: -1 }, reaction: '“It is not that big. I will put you down.”', note: 'Every hedge was a hook and she took one. Ambiguity gets resolved in the asker\'s favour, always.' },
          { text: '“What would you want me to drop?”', s: { w: 1, c: 2, f: 2, k: 2 }, reaction: '*pauses* “...Good question. Let me think.”', note: 'You did not refuse — you made the trade-off visible. Often the most effective form of no there is.' },
        ],
      },
      {
        npc: '“Realistically, how much of the intake work is left?”',
        choices: [
          { text: '“Two weeks of build, then a week of testing. I could start Harbour on the 20th, not before.”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“That could work. Let me see if it can wait.”', note: 'A concrete alternative. You gave her something to plan with instead of a wall.' },
          { text: '“Loads. It is a nightmare, honestly.”', s: { w: 0, c: 0, f: 0, k: -1 }, reaction: '“Right...” *no information to act on*', note: 'Complaint instead of data. It reads as reluctance rather than a real constraint.' },
          { text: '“Hard to say. A while?”', s: { w: 0, c: 0, f: -1, k: -1 }, reaction: '“Hm. Well, keep me posted.” *she has not dropped it*', note: 'Vagueness invites her to assume the optimistic version.' },
          { text: '“Three weeks if nothing breaks. Four if the vendor is late again, which they will be.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*laughs* “Honest. Fine — four.”', note: 'Realistic, specific, and a bit funny. Credibility is built out of accurate pessimism.' },
        ],
      },
      {
        npc: '“The trouble is Harbour is the one the exec team is actually watching.”',
        choices: [
          { text: '“Then let us move me onto Harbour and hand intake to someone else. I cannot do both well.”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '“...Yeah. Okay. Let me find cover for intake.”', note: 'You accepted her priority and made the cost explicit. This is negotiating, not refusing.' },
          { text: '“Okay, fine, I will do both.”', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '“Amazing, thank you!” *and it is now your problem*', note: 'The pressure worked. You will do two jobs badly and nobody will remember that you flagged it.' },
          { text: '“That is not really my problem though.”', s: { w: -1, c: 0, f: 2, k: 2 }, reaction: '*pause* “...Okay.” *something cools*', note: 'You held the line and spent relationship you did not need to spend. Firm and warm is the target.' },
          { text: '“Understood — so which one do you want done properly?”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '*sighs* “Fair point. Harbour.”', note: 'One question that forces the real decision without you having to make it. Very hard to argue with.' },
        ],
      },
      {
        npc: '“Alright. Harbour, and I will get intake covered. That work?”',
        choices: [
          { text: '“That works. I will send you a handover doc for intake by Thursday.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Perfect. Thanks for pushing back on that, genuinely.”', note: 'Agreement plus a concrete next step. You end the hard conversation as the reliable one, not the difficult one.' },
          { text: '“Sure.”', s: { w: 0, c: 0, f: 1, k: 1 }, reaction: '“Great.” *neutral*', note: 'Fine. A small amount of warmth here costs nothing and is remembered.' },
          { text: '“Yes — and thank you for actually moving things instead of just adding.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Well. You made it quite hard to ignore.” *smiles*', note: 'Acknowledging that she moved makes it far easier for her to do it again next time.' },
          { text: '“I mean, if it is a real problem I could still try to do both...”', s: { w: 0, c: 0, f: -1, k: -1 }, reaction: '“Really? That would help.” *and you have undone all of it*', note: 'You won the negotiation and then handed it back in the last ten seconds. Stop talking after the yes.' },
        ],
      },
    ],
  },
];

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}
