export default {
  id: 'storytelling',
  title: 'Storytelling & Humour',
  subtitle: 'Be the one people lean toward',
  glyph: 'quote',
  color: '#FF9F5A',
  lessons: [
    {
      id: 'sy-1',
      title: 'The shape of a story',
      blurb: 'Setup, tension, turn. Nothing else is required.',
      items: [
        {
          t: 'concept',
          title: 'Three beats, that is all',
          body: 'Setup: where we are and what I wanted. Tension: what went wrong. Turn: the thing you did not see coming. Most bad stories fail because they are all setup — three minutes of context for a ten-second payoff.',
          example: { label: 'Whole story, twenty seconds', line: '“I was late for a job interview. Sprinted in, gave my name — and the receptionist said the interview was tomorrow. So I sat in the car park and cried a bit. Then I got the job.”' },
        },
        {
          t: 'order',
          prompt: 'Put this story in the order that actually works.',
          items: [
            'I had one job: pick my sister up from the airport.',
            'I got there, waited an hour, no sister.',
            'Turns out I was at the wrong airport. Different city.',
            'She still brings it up at Christmas.',
          ],
        },
        {
          t: 'choice',
          prompt: 'Which opening line makes people listen?',
          options: [
            { text: '“So this was, I think, maybe two years ago? Or three. Anyway, my cousin — you don\'t know him—”', why: 'You have spent your entire attention budget on dates and cast lists before anything has happened.' },
            { text: '“I once got banned from a supermarket.”', ok: true, why: 'A promise. Everyone now wants the answer, and you can fill in context as you go.' },
            { text: '“I have a funny story, it is really funny.”', why: 'Never announce the verdict. You have just set a bar you now have to clear.' },
            { text: '“This is probably boring but—”', why: 'They will believe you.' },
          ],
        },
        {
          t: 'concept',
          title: 'Lead with the promise',
          body: 'Start at or near the interesting part, then backfill. “I got banned from a supermarket” earns you the thirty seconds of context that would otherwise have lost the room.',
          tip: 'If your first sentence could be the last sentence of the setup, start there instead.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'A story needs to be extraordinary to be worth telling.',
          answer: false,
          why: 'Almost every great told story is small. Shape and delivery do the work — a lost airport run beats a vague account of something genuinely dramatic.',
        },
        {
          t: 'freeform',
          prompt: 'Write the promise line.',
          context: 'You once spent forty minutes assembling a piece of flat-pack furniture upside down. Write only the opening line of the story.',
          rubric: {
            want: ['i', 'once', 'spent', 'built', 'upside', 'down', 'wardrobe', 'desk', 'shelf', 'wrong'],
            avoid: ['so basically', 'this is boring', 'funny story'],
            minWords: 5,
            sample: '“I once built an entire wardrobe upside down and did not notice until I tried to open it.”',
          },
        },
      ],
    },

    {
      id: 'sy-2',
      title: 'Details that land',
      blurb: 'Specific beats impressive, every time.',
      items: [
        {
          t: 'concept',
          title: 'One weird specific',
          body: 'Vague stories evaporate. One concrete, slightly odd detail makes the whole thing real: not “an old guy”, but “a man in a full three-piece suit at 7am on a Tuesday”. The brain stores images, not summaries.',
          example: { label: 'Vague vs specific', line: '“The flat was a mess.” → “There were four kettles in the kitchen and no chairs.”' },
        },
        {
          t: 'choice',
          prompt: 'Which line does the most work?',
          options: [
            { text: '“He was acting really strangely.”', why: 'A judgement with no image. The listener has nothing to picture, so nothing sticks.' },
            { text: '“He kept thanking the vending machine.”', ok: true, why: 'One image, immediately visible, and it lets the listener reach the conclusion themselves — which is always funnier than being told.' },
            { text: '“He was, like, quite an odd person, you know?”', why: 'Three hedges and no content.' },
            { text: '“His behaviour was very unusual for the setting.”', why: 'You have written a report.' },
          ],
        },
        {
          t: 'concept',
          title: 'Use dialogue, not summary',
          body: 'Do not report what was said — say it. “And she goes, \'that is not my dog\'” beats “she told me the dog was not hers”. Dialogue puts the listener in the room, and it lets you act rather than narrate.',
          tip: 'Present tense sharpens it further: “so I am standing there holding this dog...”',
        },
        {
          t: 'multi',
          prompt: 'Which techniques make a told story more vivid?',
          options: [
            { text: 'Quoting people directly', ok: true },
            { text: 'Switching to present tense at the tense bit', ok: true },
            { text: 'Explaining how everyone felt', ok: false },
            { text: 'One concrete visual detail per beat', ok: true },
            { text: 'Adding background about everyone involved', ok: false },
          ],
          why: 'Show the scene and let them feel it. Explaining feelings and cast backgrounds is the two most common ways a story slows to a halt.',
        },
        {
          t: 'blank',
          prompt: 'Sharpen it.',
          sentence: '“The place was really busy.” → “There were ___ people queuing outside in the rain.”',
          bank: ['forty', 'lots of', 'many', 'a few'],
          answer: 'forty',
        },
        {
          t: 'freeform',
          prompt: 'Make it specific.',
          context: 'Rewrite this so it lands: “My neighbour is a bit of a character.”',
          rubric: {
            want: ['he', 'she', 'they', 'once', 'every', 'keeps', 'has', 'told', 'garden', 'door', 'morning'],
            avoid: ['character', 'weird person', 'strange guy'],
            minWords: 7,
            sample: '“My neighbour has named every plant in his front garden and he says goodnight to them.”',
          },
        },
      ],
    },

    {
      id: 'sy-3',
      title: 'Your five stories',
      blurb: 'Stop improvising. Have material.',
      items: [
        {
          t: 'concept',
          title: 'Charismatic people are not improvising',
          body: 'They have a small stock of stories they have told before, sharpened by repetition. Five is enough: the disaster, the embarrassment, the surprise, the thing you love, the origin story. Every social situation can be met with one of them.',
        },
        {
          t: 'match',
          prompt: 'Match each stock story to when you deploy it.',
          pairs: [
            ['The disaster', 'When someone else\'s plan just fell apart'],
            ['The embarrassment', 'When the group is being a bit stiff'],
            ['The thing you love', 'When someone asks what you do outside work'],
            ['The origin story', 'When someone asks how you ended up here'],
          ],
        },
        {
          t: 'concept',
          title: 'Rehearsal is not cheating',
          body: 'You are not memorising a script — you are learning the shape so you do not have to construct it live. Comedians run material for years. The version you tell for the fifth time is always better than the first, and nobody has heard your first.',
          tip: 'Tell a story out loud in the car once. That is the whole practice.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Reusing the same story with different people is dishonest.',
          answer: false,
          why: 'It is how every good conversationalist operates. The only rule is do not tell the same person the same story twice — and if you do, be gracious when they say so.',
        },
        {
          t: 'multi',
          prompt: 'What makes a good stock story?',
          options: [
            { text: 'Under 60 seconds', ok: true },
            { text: 'You come out of it slightly worse, not better', ok: true },
            { text: 'It needs no set-up about people they do not know', ok: true },
            { text: 'It proves something impressive about you', ok: false },
            { text: 'It has one clear turn', ok: true },
          ],
          why: 'A story that flatters you is a bid. A story where you are the idiot is a gift — it lowers the stakes for everyone listening.',
        },
        {
          t: 'freeform',
          prompt: 'Draft one.',
          context: 'Write your “embarrassment” story in three sentences: setup, tension, turn. Real or invented.',
          rubric: {
            want: ['i'],
            avoid: [],
            minWords: 20,
            sample: '“I once waved at someone across a station who was clearly waving at the person behind me. Rather than stop, I committed — full arm, big grin. They waved back out of pity and we had a four-minute conversation about nothing.”',
          },
        },
      ],
    },

    {
      id: 'sy-4',
      title: 'How humour actually works',
      blurb: 'Four mechanics you can use on purpose.',
      items: [
        {
          t: 'concept',
          title: 'Funny is a mechanism, not a gift',
          body: 'Most everyday humour runs on four engines: contrast (huge reaction to a tiny thing), understatement (tiny reaction to a huge thing), callback (referencing something from earlier), and self-deprecation (you are the target). All four are learnable.',
          example: { label: 'Understatement', line: 'Car on fire. “Well, that is not ideal.”' },
        },
        {
          t: 'match',
          prompt: 'Match the line to its engine.',
          pairs: [
            ['“I have been preparing for this for eleven seconds.”', 'Contrast'],
            ['(after a total disaster) “Could have gone worse.”', 'Understatement'],
            ['“...and this is where the four kettles come back.”', 'Callback'],
            ['“I have the spatial awareness of a shopping trolley.”', 'Self-deprecation'],
          ],
        },
        {
          t: 'concept',
          title: 'The callback is the strongest one',
          body: 'Bringing back something from twenty minutes ago is the highest-yield joke available, because it is funny and it is proof you were paying attention. It also only works between you two, which is exactly what makes it feel like a bond.',
          tip: 'Keep one odd thing from early in the conversation in your back pocket. Deploy it once, late.',
        },
        {
          t: 'choice',
          prompt: 'Which self-deprecating line works, and which is a problem?',
          options: [
            { text: '“I am hopeless with names — I called my boss \'mate\' for a year.”', ok: true, why: 'Light, specific, and the flaw is harmless. It gives everyone permission to be imperfect.' },
            { text: '“I am genuinely bad at my job and everyone knows it.”', why: 'Too true and too heavy. Now the group has to reassure you, which is work you have handed them.' },
            { text: '“Ha, I am so ugly.”', why: 'Fishing. The only available response is a compliment, and everyone can feel the transaction.' },
            { text: '“I mean, I am basically a failure.”', why: 'This is not a joke, it is a disclosure, and it stops the room.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Self-deprecation works best when the flaw is real but low-stakes.',
          answer: true,
          why: 'Real makes it honest, low-stakes makes it safe. Fake reads as fishing; high-stakes reads as a cry for help.',
        },
        {
          t: 'freeform',
          prompt: 'Try understatement.',
          context: 'You arrive at a dinner party you are hosting and realise you forgot to buy any food at all. What do you say to the first guest?',
          rubric: {
            want: ['so', 'slight', 'minor', 'small', 'bit', 'issue', 'problem', 'change', 'plan', 'hope', 'like'],
            avoid: ['oh my god', 'disaster', 'i am so sorry i ruined'],
            minWords: 5,
            sample: '“Slight adjustment to the evening — I hope everyone likes the concept of food.”',
          },
        },
      ],
    },

    {
      id: 'sy-5',
      title: 'Reading the room',
      blurb: 'Knowing when the joke is wrong.',
      items: [
        {
          t: 'concept',
          title: 'Check the temperature before you swing',
          body: 'The same line kills at 11pm with friends and lands like a brick at 9am in a meeting about layoffs. Before a joke, ask one silent question: what is this group currently feeling? Humour that ignores the room is not bold, it is deaf.',
        },
        {
          t: 'choice',
          prompt: 'A colleague has just shared that they are struggling. The room is quiet. What is the move?',
          options: [
            { text: 'Lighten it with a joke — they clearly need cheering up.', why: 'A joke here tells them the feeling is unwelcome. It is a way of making your own discomfort stop.' },
            { text: 'Say something plain and short: “that sounds really hard.”', ok: true, why: 'Acknowledge before anything else. Humour can come later, from them, if they want it.' },
            { text: 'Immediately offer three solutions.', why: 'Fixing is the professional version of changing the subject. Ask before you solve.' },
            { text: 'Say nothing and hope someone else speaks.', why: 'Understandable. Also the moment they will remember the silence of.' },
          ],
        },
        {
          t: 'concept',
          title: 'Punch at yourself or upward',
          body: 'Jokes at the expense of whoever has least power in the room are the fastest way to be quietly written off. At yourself is safe. At the situation is safe. At the most senior person, carefully, can be excellent. At the newest, quietest person: never.',
          tip: 'If someone in the group would not laugh if they overheard it, it is not a joke, it is a cost.',
        },
        {
          t: 'multi',
          prompt: 'Which signals mean “do not joke right now”?',
          options: [
            { text: 'Someone has just gone quiet after speaking', ok: true },
            { text: 'Arms folded, no eye contact across the group', ok: true },
            { text: 'Two people already laughing', ok: false },
            { text: 'Somebody is mid-sentence about something difficult', ok: true },
            { text: 'The topic just shifted to money or health', ok: true },
          ],
          why: 'Read whether the group is opening or closing. Laughter already in the air is a green light; withdrawal, difficulty and sensitive topics are not.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If a joke does not land, the best recovery is to explain it.',
          answer: false,
          why: 'Explaining doubles the awkwardness. Acknowledge it briefly — “tough crowd” — or simply move on. Both are over in a second; the explanation lasts a minute.',
        },
        {
          t: 'freeform',
          prompt: 'Recover gracefully.',
          context: 'You made a light joke and it landed flat. Two seconds of silence. Write your next line.',
          rubric: {
            want: ['anyway', 'moving', 'on', 'noted', 'tough', 'crowd', 'that', 'was', 'okay', 'right'],
            avoid: ['what i meant was', 'get it', 'because', 'explain'],
            minWords: 3,
            sample: '“Noted — retiring that one. Anyway, you were saying about the move?”',
          },
        },
      ],
    },
  ],
};
