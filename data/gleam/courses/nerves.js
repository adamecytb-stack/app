export default {
  id: 'nerves',
  title: 'Overthinking & Nerves',
  subtitle: 'The 2am replays, the cringe, the dread beforehand',
  glyph: 'shield',
  color: '#9A86FF',
  lessons: [
    {
      id: 'nv-1',
      title: 'The 2am replay',
      blurb: 'Why your brain does this and how to stop the loop.',
      items: [
        {
          t: 'concept',
          title: 'Replaying is not reviewing',
          body: 'Running the conversation back for the ninth time feels like you are learning something. You are not — you learned everything available on the first pass. After that it is just your brain scaring itself with the same clip. Reviewing produces one lesson. Replaying produces nothing and costs you sleep.',
          tip: 'Ask: have I already worked out what I would do differently? If yes, the loop has nothing left to give you.',
        },
        {
          t: 'choice',
          prompt: 'It is late and you are replaying something you said for the twelfth time. What actually helps?',
          options: [
            { text: 'Keep going until you feel better about it.', why: 'That feeling does not arrive from the loop. Replaying makes the memory more vivid and more negative, not less.' },
            { text: 'Write down the one thing you would do differently, then deliberately stop.', ok: true, why: 'It gives the loop what it wants — a conclusion — and closes it. Writing it down matters, because it tells your brain the job is done.' },
            { text: 'Text them to check it was fine.', why: 'It makes a non-event into an event. They had almost certainly not thought about it at all until you asked.' },
            { text: 'Scroll until you fall asleep.', why: 'Understandable, and it just delays it. The loop is usually waiting for you when you put the phone down.' },
          ],
        },
        {
          t: 'concept',
          title: 'They are not thinking about it',
          body: 'The thing you have replayed forty times, they have thought about roughly zero times. Everyone is the main character of their own evening and a background extra in everyone else’s. This is not comforting nonsense — it is just how attention works.',
          example: { label: 'Test it', line: 'Try to remember something slightly awkward someone else did last month. You cannot. That is what they remember about you.' },
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Thinking about a conversation more will help you handle the next one better.',
          answer: false,
          why: 'One review helps. After that, more thinking measurably makes anxiety worse without improving anything. Practice helps; rumination does not.',
        },
        {
          t: 'multi',
          prompt: 'Which of these actually break the loop?',
          options: [
            { text: 'Writing the one lesson down and closing the notes app', ok: true },
            { text: 'Getting up and doing something physical for five minutes', ok: true },
            { text: 'Rereading the chat again', ok: false },
            { text: 'Telling yourself “I will deal with this tomorrow” and meaning it', ok: true },
            { text: 'Asking a friend to analyse it with you at 1am', ok: false },
          ],
          why: 'Closing the loop or interrupting it works. Feeding it more material — rereading, group analysis — keeps it running all night.',
        },
        {
          t: 'freeform',
          prompt: 'Close the loop.',
          context: 'Think of something you have replayed recently. Write the single thing you would do differently — then you are done with it.',
          rubric: {
            want: ['i', 'would', 'next', 'time', 'should', 'have', 'could', 'instead', 'not'],
            avoid: [],
            minWords: 6,
            sample: '“Next time I would just ask the question instead of waiting for a perfect moment and then saying nothing.”',
          },
        },
      ],
    },

    {
      id: 'nv-2',
      title: 'Cringe attacks',
      blurb: 'The sudden memory that makes you want to fold in half.',
      items: [
        {
          t: 'concept',
          title: 'Cringe is a memory, not a warning',
          body: 'That jolt when a two-year-old memory ambushes you is not information. It is your brain filing an old social risk and mistaking it for a current one. It feels like a message about who you are. It is a notification from 2023.',
          tip: 'Say “old news” to yourself and carry on doing whatever you were doing. It sounds stupid. It works.',
        },
        {
          t: 'choice',
          prompt: 'A cringe memory hits you out of nowhere. Best response?',
          options: [
            { text: 'Cringe, make a noise, and try to shove it away.', why: 'Suppression makes these come back more often. Fighting it tells your brain it is a real threat.' },
            { text: 'Notice it, name it as an old memory, and carry on.', ok: true, why: 'Naming it drops the charge. You are not pretending it did not happen — you are correctly filing it as the past.' },
            { text: 'Work out whether people still remember it.', why: 'They do not. And the research you will do to prove it will keep the memory active for another hour.' },
            { text: 'Decide you are fundamentally embarrassing.', why: 'That is one moment being used as evidence about your entire self. It is not evidence of anything except that you were once thirteen.' },
          ],
        },
        {
          t: 'concept',
          title: 'Everyone has these',
          body: 'Every person you think is effortlessly confident has a folder of these exact memories. They are not thinking about yours, because they are occasionally getting ambushed by their own. This is one of the most evenly distributed experiences there is.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'The fact that you cringe about something means it was actually as bad as it feels.',
          answer: false,
          why: 'Cringe intensity tracks how exposed you felt, not how bad it looked. Most cringe memories were invisible to everyone else at the time.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are true about cringe memories?',
          options: [
            { text: 'They get less intense over years, even without doing anything', ok: true },
            { text: 'Almost nobody else remembers them', ok: true },
            { text: 'They are a reliable guide to how you come across', ok: false },
            { text: 'Trying to suppress them makes them more frequent', ok: true },
            { text: 'Having a lot of them means you are socially bad', ok: false },
          ],
          why: 'They fade, they are private, and fighting them backfires. The number you have mostly tracks how much you have done, not how badly you did it.',
        },
        {
          t: 'match',
          prompt: 'Match the thought to what it actually is.',
          pairs: [
            ['“Everyone saw that”', 'One or two people, for four seconds'],
            ['“They must think I am weird”', 'They have not thought about it once'],
            ['“I should not have said that”', 'A normal sentence you are re-reading'],
            ['“I always do this”', 'You remember the misses, not the hundreds of fine ones'],
          ],
        },
        {
          t: 'order',
          prompt: 'Order the response to a cringe attack.',
          items: [
            'Notice the feeling arriving',
            'Name it — “that is an old memory”',
            'Let it be there without arguing with it',
            'Carry on with what you were doing',
          ],
        },
      ],
    },

    {
      id: 'nv-3',
      title: 'Before you talk to them',
      blurb: 'What to do in the ten minutes beforehand.',
      items: [
        {
          t: 'concept',
          title: 'Slow the breath out, not in',
          body: 'Nerves speed your breathing up, which keeps your body convinced something is wrong. The fastest fix is making the out-breath longer than the in-breath — in for four, out for six or seven, for about a minute. It is not a trick; it is the one lever you have on your nervous system that works in under a minute.',
          tip: 'Do it walking down the corridor. Nobody can see you doing it.',
        },
        {
          t: 'choice',
          prompt: 'You are about to go and talk to them and your heart is going. What helps most in the next sixty seconds?',
          options: [
            { text: 'Rehearse exactly what you are going to say.', why: 'A script makes it worse — you end up delivering lines instead of talking, and you panic when they say something off-script.' },
            { text: 'Slow your breathing out and decide on one thing to ask.', ok: true, why: 'One lever on the body, one small goal for the head. Not a script, just a starting point so you are not launching from nothing.' },
            { text: 'Decide not to bother today.', why: 'It works instantly and it costs you the rep. Avoidance is the thing that makes it harder next time — that is the whole mechanism.' },
            { text: 'Tell yourself to calm down.', why: 'Nobody in history has calmed down because they told themselves to. Give your body something to do instead.' },
          ],
        },
        {
          t: 'concept',
          title: 'Nervous and excited feel identical',
          body: 'Racing heart, shaky hands, stomach going — that is the same physical state as excitement. The only difference is the label you put on it. Telling yourself “I am excited” rather than “I am panicking” measurably helps, because your body cannot tell the difference and your head can.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Waiting until you feel calm before you go over is the sensible approach.',
          answer: false,
          why: 'The calm comes after, not before. If you only act when the nerves are gone you will almost never act — and every time you avoid it, the nerves get slightly stronger.',
        },
        {
          t: 'multi',
          prompt: 'Which of these actually help in the moment?',
          options: [
            { text: 'Longer out-breaths for about a minute', ok: true },
            { text: 'Relabelling it as excitement', ok: true },
            { text: 'Rehearsing full sentences', ok: false },
            { text: 'Having one thing you want to ask, not a script', ok: true },
            { text: 'Checking your reflection several times', ok: false },
          ],
          why: 'Regulate the body and give yourself a single starting point. Scripts and mirror-checking both increase self-monitoring, which is the actual problem.',
        },
        {
          t: 'freeform',
          prompt: 'Pick your one thing.',
          context: 'Write the single question you will ask them next time, so you never have to start from a blank brain.',
          rubric: {
            want: ['?', 'what', 'how', 'did', 'do', 'you', 'are', 'have'],
            avoid: [],
            minWords: 4,
            sample: '“How did the football thing go on Saturday?”',
          },
        },
      ],
    },

    {
      id: 'nv-4',
      title: 'Everyone saw that',
      blurb: 'They did not. Here is the actual maths.',
      items: [
        {
          t: 'concept',
          title: 'The spotlight is imaginary',
          body: 'People consistently overestimate how much others notice them — how obvious their blush was, whether anyone saw them trip, whether their voice sounded weird. In studies, the number of people who noticed is always a fraction of what the person predicted. Your embarrassment is loud inside your own head and almost silent outside it.',
          example: { label: 'The real numbers', line: 'You think everyone noticed. Realistically it is one or two people, for about four seconds, and they have already forgotten.' },
        },
        {
          t: 'choice',
          prompt: 'You said something that came out wrong in front of a group. What actually happened?',
          options: [
            { text: 'Everyone noticed and it will be remembered.', why: 'Almost never true. Group attention is fragmented — most people were half-listening and thinking about their own next line.' },
            { text: 'A couple of people half-noticed and moved on immediately.', ok: true, why: 'This is what actually happens nearly every time. The moment is enormous for you and background noise for everyone else.' },
            { text: 'Nobody heard anything at all.', why: 'Also not quite true, and pretending is not the point. The point is that noticing and caring are very different things.' },
            { text: 'You should explain what you meant.', why: 'Explaining makes a four-second thing into a forty-second thing and draws in everyone who missed it.' },
          ],
        },
        {
          t: 'concept',
          title: 'Recovery is what people actually notice',
          body: 'Nobody remembers the stumble. They remember whether you went red and went silent for ten minutes, or shrugged and carried on. The event is not the story — your reaction is. That part is completely under your control.',
          tip: 'Whatever happens, the move is: acknowledge briefly if you must, then carry on talking.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you visibly go red, people think less of you.',
          answer: false,
          why: 'People generally rate blushing as endearing rather than weak — it reads as sincere. What reads badly is a long silence afterwards, and that is a choice rather than a reflex.',
        },
        {
          t: 'multi',
          prompt: 'Which recoveries work?',
          options: [
            { text: 'A quick “ignore me” and carrying on', ok: true },
            { text: 'Laughing at yourself once and moving on', ok: true },
            { text: 'Going silent for the rest of the conversation', ok: false },
            { text: 'Carrying on as though nothing happened', ok: true },
            { text: 'Explaining what you meant in detail', ok: false },
          ],
          why: 'Short and forward. Anything that keeps the moment alive — silence or explanation — is what makes it memorable.',
        },
        {
          t: 'freeform',
          prompt: 'Write your recovery line.',
          context: 'Something came out wrong in front of people. Write the one short thing you say before carrying on.',
          rubric: {
            want: ['ignore', 'that', 'me', 'anyway', 'no', 'idea', 'what', 'said', 'moving', 'on', 'right'],
            avoid: ['what i meant was', 'sorry sorry', 'i am so stupid'],
            minWords: 3,
            sample: '“Ignore literally all of that. Anyway —”',
          },
        },
      ],
    },

    {
      id: 'nv-5',
      title: 'Doing it scared',
      blurb: 'The only method that has ever worked.',
      items: [
        {
          t: 'concept',
          title: 'Avoiding it is what keeps it scary',
          body: 'Every time you avoid a social thing, you get instant relief and the fear grows slightly. Every time you do it anyway, it is uncomfortable and the fear shrinks slightly. There is no third option where you wait and it gets easier on its own. This is the single most important idea in this app.',
          example: { label: 'The trade', line: 'Avoid: feel better now, worse forever. Do it: feel worse now, better every time after.' },
        },
        {
          t: 'choice',
          prompt: 'What is the fastest way to get less nervous around someone you like?',
          options: [
            { text: 'Wait until you feel more confident.', why: 'Confidence is produced by doing the thing. Waiting for it first is waiting for the reward before the work.' },
            { text: 'Talk to them in small, low-stakes ways, often.', ok: true, why: 'Lots of tiny reps beat one big attempt. Each one teaches your body that nothing bad happened, which is the only way the fear actually goes down.' },
            { text: 'Prepare a really good conversation first.', why: 'Preparation feels productive and it is often avoidance wearing a serious face.' },
            { text: 'Get them to talk to you first.', why: 'Might happen. Cannot be relied on, and it leaves you exactly as nervous as before.' },
          ],
        },
        {
          t: 'concept',
          title: 'Make the rep small enough to actually do',
          body: 'Do not set yourself “have a long conversation”. Set yourself “say one sentence to them today”. A rep you will actually complete beats an ambitious one you will avoid. Then make it slightly bigger next week.',
          tip: 'If you are not doing your target, the target is too big. Halve it rather than giving up.',
        },
        {
          t: 'order',
          prompt: 'Order these into a sensible ladder.',
          items: [
            'Say one sentence to them',
            'Have a short conversation in a group',
            'Have a proper conversation one-to-one',
            'Suggest doing something together',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you do something socially scary and it goes badly, you have made things worse.',
          answer: false,
          why: 'Even the ones that go badly teach your body that you survived it. People who do lots of things that occasionally go wrong end up far more comfortable than people who avoid everything.',
        },
        {
          t: 'freeform',
          prompt: 'Set this week’s rep.',
          context: 'Write one specific thing you will do this week that scares you slightly. Small enough that you will definitely do it.',
          rubric: {
            want: ['i', 'will', 'ask', 'say', 'talk', 'text', 'sit', 'this', 'week', 'them', 'monday', 'tomorrow'],
            avoid: ['try to', 'maybe', 'if i can', 'hopefully'],
            minWords: 6,
            sample: '“I will ask them what they got for the homework on Tuesday, out loud, even if their friends are there.”',
          },
        },
      ],
    },
  ],
};
