export default {
  id: 'signals',
  title: 'Do They Like Me?',
  subtitle: 'Reading it properly instead of guessing at 1am',
  glyph: 'target',
  color: '#4FD8A8',
  lessons: [
    {
      id: 'sg-1',
      title: 'What actually counts',
      blurb: 'Most of what you are analysing is noise.',
      items: [
        {
          t: 'concept',
          title: 'Effort is the only real signal',
          body: 'Forget eye contact theories and what their friend supposedly said. The thing that actually tells you something is effort: do they start conversations, do they ask you things back, do they keep it going, do they make time for you. Effort costs something, so people only spend it on purpose.',
          example: { label: 'Effort looks like', line: 'They text first · they ask you questions back · they remember what you said last week · they come and find you' },
          tip: 'Being nice to you is not a signal. Most people are nice. Making an effort for you is a signal.',
        },
        {
          t: 'multi',
          prompt: 'Which of these actually mean something?',
          options: [
            { text: 'They start conversations without you starting them', ok: true },
            { text: 'They ask you questions back', ok: true },
            { text: 'They laughed at something you said', ok: false },
            { text: 'They remembered something small you mentioned ages ago', ok: true },
            { text: 'They said hi to you in the corridor', ok: false },
          ],
          why: 'Laughing and saying hi are what people do to everyone. Starting, asking back and remembering all cost effort — that is what makes them count.',
        },
        {
          t: 'concept',
          title: 'One thing is never proof',
          body: 'A single moment — a look, a message, a seat they chose — proves nothing in either direction. Patterns over a couple of weeks are real. One data point analysed for three hours is how you end up certain about something that never happened.',
          tip: 'Ask yourself: has this happened repeatedly, or am I building a case out of one thing?',
        },
        {
          t: 'choice',
          prompt: 'They sat next to you in class today. What is the correct conclusion?',
          options: [
            { text: 'They definitely like you.', why: 'One seat. There were probably three free. You are constructing a whole story from one small thing, which is the exact habit that makes this painful.' },
            { text: 'They were being polite and it means nothing.', why: 'Equally overconfident in the other direction, and it is the version that stops you ever trying.' },
            { text: 'It is one small positive thing. Watch whether it keeps happening.', ok: true, why: 'The honest reading. It is mildly good news. Add it to the pile and see whether a pattern forms.' },
            { text: 'You should ask their friend what it meant.', why: 'Their friend does not know, and now two more people are involved in something that was private.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If someone is really shy, a lack of signals could still mean they like you.',
          answer: true,
          why: 'True — shy people give off less of everything. But it cuts both ways: you cannot tell the difference from the outside, which is exactly why guessing forever does not work and asking eventually does.',
        },
        {
          t: 'match',
          prompt: 'Match what they did to what it actually tells you.',
          pairs: [
            ['They said hi in the corridor', 'Nothing — people say hi to everyone'],
            ['They texted you first, twice this week', 'Effort. This one counts'],
            ['They laughed at your joke', 'Nothing much — being funny is not being liked'],
            ['They remembered your match was Saturday', 'They were paying attention. Counts a lot'],
          ],
        },
        {
          t: 'freeform',
          prompt: 'Be honest with yourself.',
          context: 'Write down the strongest bit of actual evidence you have — something they did, not something you interpreted. One sentence.',
          rubric: {
            want: ['they', 'she', 'he', 'asked', 'texted', 'said', 'came', 'sat', 'remembered', 'first', 'me'],
            avoid: [],
            minWords: 5,
            sample: '“They texted me first twice this week and asked what I was doing at the weekend.”',
          },
        },
      ],
    },

    {
      id: 'sg-2',
      title: 'Reading texts',
      blurb: 'What a chat tells you and what it does not.',
      items: [
        {
          t: 'concept',
          title: 'Look at the shape, not the words',
          body: 'Stop analysing whether “haha” means more than “lol”. Look at the shape of the conversation: who starts it, how fast it dies, whether they ask you things, whether their messages got longer or shorter over time. The shape is honest. The individual words are not.',
          example: { label: 'The three questions', line: 'Who starts it? · Do they ask you anything back? · Is it getting longer or shorter over weeks?' },
        },
        {
          t: 'choice',
          prompt: 'You always start the conversation and they always reply nicely but never ask anything back. What does that mean?',
          options: [
            { text: 'They like you but are shy.', why: 'Possible. But if it has been going on for weeks with zero questions back, you are doing all the work and calling it a conversation.' },
            { text: 'They are happy to chat but they are not chasing it.', ok: true, why: 'The honest read. Not a rejection, not encouragement. Usually the answer is to stop guessing and suggest something real.' },
            { text: 'They hate you.', why: 'People who hate you do not reply nicely. This is catastrophising, not reading.' },
            { text: 'You should text more so they get used to it.', why: 'More of a thing that is not working rarely fixes it, and it tips into pressure fast.' },
          ],
        },
        {
          t: 'concept',
          title: 'Dry replies are data, not disaster',
          body: 'If their replies get shorter over a week, something changed — mood, another situation, or interest. You cannot know which. What you can do is stop pushing, go quiet for a bit, and let them come back if they want to. Chasing a fading chat has never once worked.',
          tip: 'Pull back gently rather than pushing harder. Pushing harder is how you find out for certain, and badly.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are genuinely encouraging in a chat?',
          options: [
            { text: 'They ask you questions back, unprompted', ok: true },
            { text: 'They bring up something you said days ago', ok: true },
            { text: 'They reply fast every time', ok: false },
            { text: 'They send you things — videos, photos, memes — first', ok: true },
            { text: 'They use lots of emojis', ok: false },
          ],
          why: 'Fast replies and emoji use are personality, not interest — some people text like that with everyone. Asking back, remembering and sending things first are all effort.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Analysing the exact wording of their last message with your friends will help you work out how they feel.',
          answer: false,
          why: 'Your friends have exactly as little information as you do, and group analysis turns a small thing into a big one. It feels productive and it changes nothing.',
        },
        {
          t: 'order',
          prompt: 'Their replies have gone short for a week. Order these from best to worst.',
          items: [
            'Leave it a few days and carry on normally in person',
            'Send one light, unrelated message later in the week',
            'Ask if you have done something wrong',
            'Send several messages asking why they are being weird',
          ],
        },
      ],
    },

    {
      id: 'sg-3',
      title: 'In person',
      blurb: 'The signals that are harder to fake.',
      items: [
        {
          t: 'concept',
          title: 'Proximity is the loudest one',
          body: 'Where people put their body says more than what they say. Do they come over to you, sit near you when they did not have to, stay talking when they could leave? Choosing to be near you repeatedly is one of the least fakeable signals there is.',
          example: { label: 'Worth noticing', line: 'They walk the long way so it goes past you · they stay talking after their friends leave · they end up next to you more than chance explains' },
        },
        {
          t: 'multi',
          prompt: 'Which in-person things actually count?',
          options: [
            { text: 'They come and find you rather than waiting', ok: true },
            { text: 'They stay talking after they could have left', ok: true },
            { text: 'They smiled at you once', ok: false },
            { text: 'They introduce you to their friends', ok: true },
            { text: 'They were nice when you spoke to them', ok: false },
          ],
          why: 'Anything that costs them time or social effort counts. Anything a normal polite person does for everyone does not.',
        },
        {
          t: 'concept',
          title: 'Watch what changes, not what is',
          body: 'People are just different — some are loud with everyone, some are quiet with everyone. What tells you something is a change: they are different around you than around others, or they went quiet the moment you sat down. Compare them to themselves, not to other people.',
          tip: 'Are they like this with everyone? If yes, it is their personality, not a signal.',
        },
        {
          t: 'choice',
          prompt: 'They are loud and funny with their friends and go quiet around you. What is the most likely read?',
          options: [
            { text: 'They find you boring.', why: 'Possible but unlikely — bored people do not go quiet, they go elsewhere. Going quiet usually means something is at stake for them.' },
            { text: 'They might be nervous around you specifically.', ok: true, why: 'A change that happens only around you is worth noticing. Nerves and interest look almost identical from the outside — you would know, you do the same thing.' },
            { text: 'They do not like you.', why: 'If they did not, they would simply not be near you. Quiet and present is very different from absent.' },
            { text: 'It means nothing.', why: 'A consistent change in how someone behaves around one specific person is one of the few things that does mean something.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If their friends start acting weird or giggly when you show up, that usually means something.',
          answer: true,
          why: 'Friends know. Friends are also terrible at hiding it. It is not proof, but of all the second-hand signals, this is the one worth actually noticing.',
        },
        {
          t: 'freeform',
          prompt: 'Compare them to themselves.',
          context: 'Write one way they are different around you than around everyone else. If you cannot think of one, write that instead — that is also useful information.',
          rubric: {
            want: ['they', 'she', 'he', 'more', 'less', 'quiet', 'louder', 'different', 'same', 'with', 'me', 'not'],
            avoid: [],
            minWords: 5,
            sample: '“They talk a lot more than usual when it is just us, and barely at all when their friends are there.”',
          },
        },
      ],
    },

    {
      id: 'sg-4',
      title: 'When it is a no',
      blurb: 'Spotting it early, and respecting it immediately.',
      items: [
        {
          t: 'concept',
          title: 'A no is often quiet',
          body: 'Most people will not say “I am not interested”. It comes out as short replies, plans that never happen, and conversations that only ever go one way. That is still an answer. Reading it correctly saves you months, and it saves them from having to say it out loud.',
          example: { label: 'What it usually looks like', line: 'Never starts anything · always busy but never suggests another time · replies politely and briefly, forever' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are likely a no?',
          options: [
            { text: 'They say yes to plans then cancel, repeatedly, without ever re-suggesting', ok: true },
            { text: 'They never start a conversation, over months', ok: true },
            { text: 'They took a day to reply once', ok: false },
            { text: 'They keep the conversation strictly about school, every time', ok: true },
            { text: 'They were quiet the day after an argument with their mate', ok: false },
          ],
          why: 'Look for patterns over time, not single moments. A repeated pattern of no effort is an answer even when nobody says it.',
        },
        {
          t: 'concept',
          title: 'Respect it the first time',
          body: 'If someone says no, or shows you no repeatedly, that is the end of it. Not a challenge, not something to fix with a better message. Trying again after a clear no is the fastest way to turn “not interested” into “uncomfortable around you”, and that is a much worse place to be.',
          tip: 'Backing off gracefully is the thing people actually respect. It is also what makes being friends afterwards possible.',
        },
        {
          t: 'choice',
          prompt: 'They have said they see you as a friend. What is the right move?',
          options: [
            { text: 'Say “okay, no worries” and genuinely mean it.', ok: true, why: 'Short, warm, done. It protects your dignity and their comfort, and it leaves the friendship intact.' },
            { text: 'Ask why.', why: 'It puts them in the position of justifying a feeling, and no answer they give will make you feel better.' },
            { text: 'Keep trying — they might change their mind.', why: 'This is where people stop being kind and start being avoidant. It also makes them dread seeing you, which is the opposite of what you want.' },
            { text: 'Go cold and stop speaking to them.', why: 'It reads as a punishment for an honest answer, and it tells everyone watching that your friendliness was conditional.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you back off after a no, you look weak.',
          answer: false,
          why: 'Backing off cleanly is the strongest available move and everyone who sees it clocks it. Refusing to accept an answer is the thing that looks bad, and it looks bad to everyone, not just them.',
        },
        {
          t: 'freeform',
          prompt: 'Write the graceful reply.',
          context: 'They text: “you are really nice but I think I just see you as a friend.” Write your reply.',
          rubric: {
            want: ['thanks', 'thank', 'you', 'saying', 'telling', 'me', 'no', 'worries', 'all', 'good', 'fair', 'appreciate'],
            avoid: ['why', 'but', 'what if', 'are you sure', 'can we still try'],
            minWords: 5,
            sample: '“honestly thanks for saying it straight, I would rather know. all good — see you tomorrow”',
          },
        },
      ],
    },

    {
      id: 'sg-5',
      title: 'Stop guessing',
      blurb: 'The only method that actually resolves it.',
      items: [
        {
          t: 'concept',
          title: 'You cannot think your way to an answer',
          body: 'You can analyse for six months and still not know. There is no amount of evidence-gathering that produces certainty, because the information you need is inside another person. At some point the only move left is a small, low-stakes action that gets you a real answer.',
          tip: 'Guessing costs you months. Asking costs you one bad afternoon, worst case.',
        },
        {
          t: 'choice',
          prompt: 'You have been unsure for two months. What resolves it fastest?',
          options: [
            { text: 'Watch more carefully for another few weeks.', why: 'You have had two months of watching. More watching produces more theories, not more answers.' },
            { text: 'Suggest doing something specific together and see what they say.', ok: true, why: 'A real invitation gets you a real answer in a day. How they respond tells you more than everything you have observed so far.' },
            { text: 'Get a friend to ask them.', why: 'Now it is a school event with an audience. It also tells them you would not do it yourself.' },
            { text: 'Post something vague online hoping they see it.', why: 'Everyone sees it except, usefully, the one person. It creates a small public mess and resolves nothing.' },
          ],
        },
        {
          t: 'concept',
          title: 'Test small before you test big',
          body: 'You do not have to go from silence to a confession. Suggest a small, normal thing first — walking somewhere together, joining them at lunch, an actual plan on an actual day. A yes is information. A polite-but-nothing-happens is also information.',
          example: { label: 'The small test', line: '“are you going into town Saturday? come with us if you are” — normal, easy to accept, easy to decline' },
        },
        {
          t: 'order',
          prompt: 'Order these from smallest to biggest test.',
          items: [
            'Start a proper conversation and see if they keep it going',
            'Suggest doing something in a group',
            'Suggest doing something just the two of you',
            'Tell them how you feel',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Getting a clear no is worse than not knowing.',
          answer: false,
          why: 'A no costs you a rough few days. Not knowing costs you months of low-level stress and stops you noticing anyone else. Ask almost anyone who has done both.',
        },
        {
          t: 'freeform',
          prompt: 'Design your small test.',
          context: 'Write the smallest, most normal thing you could suggest this week that would tell you something real.',
          rubric: {
            want: ['saturday', 'sunday', 'friday', 'weekend', 'after', 'school', 'lunch', 'come', 'you', 'going', 'want', 'with'],
            avoid: ['sometime', 'one day', 'at some point'],
            minWords: 6,
            sample: '“are you walking back after school? I usually go that way, come with us”',
          },
        },
      ],
    },
  ],
};
