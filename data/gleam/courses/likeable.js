export default {
  id: 'likeable',
  title: 'Being Someone People Like',
  subtitle: 'Warmth, listening, stories, and not being walked over',
  glyph: 'crown',
  color: '#8DE9E0',
  lessons: [
    {
      id: 'lk-1',
      title: 'Warmth beats impressive',
      blurb: 'What people actually decide about you.',
      items: [
        {
          t: 'concept',
          title: 'Two questions, answered in seconds',
          body: 'People are quietly working out two things about you: can I trust you, and are you any good at anything. Almost everyone at your age tries to answer the second one — being funny, being good at something, having the best stuff. The first one is worth more and hardly anyone competes for it.',
          example: { label: 'The gap', line: 'Impressive gets attention. Warm gets invited to things.' },
        },
        {
          t: 'choice',
          prompt: 'Someone tells the group they did well at something. What is the strongest response?',
          options: [
            { text: '“Nice, I got a higher one though.”', why: 'A classic one-up. You won a point and everyone in the group filed it away.' },
            { text: '“How did you actually manage that?”', ok: true, why: 'Giving someone the floor when you could take it is the clearest possible signal that you do not need it. People remember who did this.' },
            { text: '“Cool.” then change the subject.', why: 'Not harmful, but it treats their news as an obstacle to get past.' },
            { text: '“That is easy though.”', why: 'Small, cheap, and it costs you more than it costs them.' },
          ],
        },
        {
          t: 'concept',
          title: 'Warmth is specific',
          body: 'Being generally friendly is forgettable. Warmth is remembering the specific thing — their match, their sister, the test they were dreading — and asking about it a week later. One remembered detail is worth ten compliments.',
          tip: 'If you are bad at remembering, write it in your notes app. That is not cheating, it is caring with a system.',
        },
        {
          t: 'multi',
          prompt: 'Which of these actually make people like you?',
          options: [
            { text: 'Asking about the thing they were worried about last week', ok: true },
            { text: 'Laughing at their joke properly rather than politely', ok: true },
            { text: 'Listing things you are good at', ok: false },
            { text: 'Using their name normally in conversation', ok: true },
            { text: 'Correcting small things they get wrong', ok: false },
          ],
          why: 'Everything that pays attention outward works. Everything that redirects to your own standing does not.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Admitting you are bad at something makes people respect you less.',
          answer: false,
          why: 'Said plainly, without apologising, it reads as secure. The people who can never admit it are the ones being read as unsure.',
        },
        {
          t: 'freeform',
          prompt: 'Give it away.',
          context: 'Someone in your group did something well and you had a small part in it. Write what you say when it comes up.',
          rubric: {
            want: ['they', 'was', 'their', 'did', 'mostly', 'idea', 'credit', 'honestly', 'him', 'her'],
            avoid: ['i did', 'me though', 'actually i'],
            minWords: 6,
            sample: '“That was honestly mostly their idea, I just did the boring bit at the end.”',
          },
        },
      ],
    },

    {
      id: 'lk-2',
      title: 'Listening so they can tell',
      blurb: 'Internal listening is invisible. Make it visible.',
      items: [
        {
          t: 'concept',
          title: 'Listening to reply is not listening',
          body: 'If you are holding a sentence in your head waiting for a gap, you are queuing, not listening. Drop the line — you will find another one, and what you say next will actually connect to what they said, which is the bit people notice.',
          tip: 'The proof you were listening is asking about the part they skipped over.',
        },
        {
          t: 'choice',
          prompt: 'They tell you about a bad week. What is the best response?',
          options: [
            { text: '“Ugh, same, last month I —”', why: 'The conversation became about you in nine words. It is the most common listening failure there is.' },
            { text: '“That is a lot. Which bit is actually the worst?”', ok: true, why: 'It stays with them and asks them to find the real thing, which is often not the first thing they said.' },
            { text: '“You should just tell them.”', why: 'Fixing. It skips over how they feel to solve a problem you have decided on.' },
            { text: '“At least it is nearly the weekend.”', why: '“At least” is an argument that they should feel better than they do. It reliably ends people opening up.' },
          ],
        },
        {
          t: 'concept',
          title: 'Say it back',
          body: 'Repeating what you heard in your own words is the single most underused move in conversation. “So it is not the work, it is that nobody noticed.” When you get it right they visibly relax. When you get it slightly wrong they correct you, which is just as useful.',
          example: { label: 'What it sounds like', line: '“So you are not actually annoyed about the game, you are annoyed they did not tell you.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these prove you were listening?',
          options: [
            { text: 'Referring to something they said ten minutes ago', ok: true },
            { text: 'Asking about the part they rushed past', ok: true },
            { text: 'Saying “yeah” and “true” a lot', ok: false },
            { text: 'Naming the feeling — “that sounds annoying”', ok: true },
            { text: 'Nodding continuously', ok: false },
          ],
          why: 'Noises are easy to fake and everyone knows it. Specific recall and getting the feeling right cannot be faked.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'When someone tells you a problem, the helpful thing is to offer solutions.',
          answer: false,
          why: 'Most people want to be understood first and many want only that. “Do you want advice or do you just want to vent?” is the most useful sentence in this entire app.',
        },
        {
          t: 'freeform',
          prompt: 'Say it back.',
          context: 'They say: “It is fine honestly, I just did not think they would pick the team without even asking me.”',
          rubric: {
            want: ['not', 'the', 'it', 'is', 'about', 'being', 'asked', 'not', 'team', 'more', 'left', 'out'],
            avoid: ['you should', 'at least', 'just tell them'],
            minWords: 6,
            sample: '“So it is not really about the team — it is that they did not ask you first.”',
          },
        },
      ],
    },

    {
      id: 'lk-3',
      title: 'Telling a story',
      blurb: 'Being the one people lean towards.',
      items: [
        {
          t: 'concept',
          title: 'Three beats and nothing else',
          body: 'Setup: where we were and what I wanted. Tension: what went wrong. Turn: the bit you did not see coming. Most bad stories are all setup — two minutes of context for a five-second payoff, and you can watch people leave.',
          example: { label: 'Whole story, fifteen seconds', line: '“I ran all the way to school because I thought I was late. Got there, no one was in. It was an inset day. My mum had told me twice.”' },
        },
        {
          t: 'order',
          prompt: 'Put this story in the order that works.',
          items: [
            'I had one job — bring the ball.',
            'We get to the park and everyone is waiting.',
            'I had left it on the bus.',
            'They still bring it up.',
          ],
        },
        {
          t: 'choice',
          prompt: 'Which opening line makes people listen?',
          options: [
            { text: '“So this was like, maybe two years ago? Or three. Anyway my cousin, you do not know him —”', why: 'You have spent all your attention budget on dates and a cast list before anything has happened.' },
            { text: '“I once got banned from a shop.”', ok: true, why: 'A promise. Everyone wants the answer now, and you can fill in the context while they are already listening.' },
            { text: '“I have got such a funny story.”', why: 'Never announce the verdict — you have set a bar you now have to clear.' },
            { text: '“This is probably boring but —”', why: 'They will believe you. People take your word for it on this one.' },
          ],
        },
        {
          t: 'concept',
          title: 'One weird specific detail',
          body: 'Vague stories evaporate. One concrete odd detail makes the whole thing real — not “he was acting strange” but “he kept thanking the vending machine”. The brain stores pictures, not summaries, and letting people reach the conclusion themselves is always funnier than telling them.',
          tip: 'Quote people instead of summarising: “and she goes —” beats “and then she told me that”.',
        },
        {
          t: 'multi',
          prompt: 'Which make a told story better?',
          options: [
            { text: 'Quoting people directly', ok: true },
            { text: 'One clear visual detail per bit', ok: true },
            { text: 'Explaining how everyone was feeling', ok: false },
            { text: 'Switching to present tense at the tense part', ok: true },
            { text: 'Background on everyone involved first', ok: false },
          ],
          why: 'Show the scene and let them feel it. Explaining feelings and introducing the cast are the two most common ways a story grinds to a halt.',
        },
        {
          t: 'freeform',
          prompt: 'Write the promise line.',
          context: 'You once did something embarrassing at school. Write only the first line of the story — the bit that makes people want the rest.',
          rubric: {
            want: ['i', 'once', 'got', 'was', 'did', 'time', 'school', 'accidentally', 'front', 'whole'],
            avoid: ['so basically', 'this is boring', 'funny story', 'like maybe'],
            minWords: 5,
            sample: '“I once called a teacher mum in front of the entire class.”',
          },
        },
      ],
    },

    {
      id: 'lk-4',
      title: 'Trying too hard',
      blurb: 'The thing everyone can sense and nobody can name.',
      items: [
        {
          t: 'concept',
          title: 'Trying is visible',
          body: 'Laughing slightly too loudly, checking whether they noticed, forcing your way into every joke — none of it is a crime and all of it is detectable. The fix is not to care less. It is to stop monitoring the reaction while you are doing the thing.',
          example: { label: 'The tell', line: 'Saying something funny and then scanning the group to see who laughed.' },
          tip: 'Say the thing, then look away. That one habit changes how you come across more than anything else.',
        },
        {
          t: 'choice',
          prompt: 'Which of these reads as trying too hard?',
          options: [
            { text: 'Repeating your joke louder when nobody heard it.', ok: true, why: 'The second delivery never lands and everybody watches it not land. Let it go.' },
            { text: 'Asking someone a genuine question.', why: 'That is just talking to a person. Interest is not the same as effort.' },
            { text: 'Laughing at something you found funny.', why: 'Normal. It only reads badly when the volume does not match how funny it actually was.' },
            { text: 'Telling a story you have told before.', why: 'Everyone does this — comedians do it for a living. It is fine as long as it is not the same audience.' },
          ],
        },
        {
          t: 'concept',
          title: 'Stop bidding',
          body: 'One-upping, name-dropping, correcting things nobody cared about, mentioning how busy or tired you are — these are bids for status. Bidding signals you are not sure you have it. Not bidding, when you obviously could, signals that you do.',
          example: { label: 'A bid, heard by everyone', line: 'They mention a hard week. You immediately mention a harder one.' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are status bids?',
          options: [
            { text: '“I am so tired, I have not slept in like three days.”', ok: true },
            { text: '“Well, actually it is not called that.”', ok: true },
            { text: '“I have no idea how that works, explain it.”', ok: false },
            { text: '“That is nothing, wait til you hear what happened to me.”', ok: true },
            { text: '“Say more about that.”', ok: false },
          ],
          why: 'Tiredness contests, pedantry and topping someone’s story are the three most common bids. Admitting you do not know and inviting more are the opposite.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Being a bit quieter than you feel like being usually makes you come across better.',
          answer: true,
          why: 'Especially in a group, and especially when you are nervous. Slightly under is almost always better than slightly over — it is the one adjustment that works nearly everywhere.',
        },
        {
          t: 'order',
          prompt: 'Order these from most to least relaxed-looking.',
          items: [
            'Saying something funny and carrying on without checking',
            'Saying something funny and glancing round',
            'Repeating it when nobody reacts',
            'Explaining why it was funny',
          ],
        },
      ],
    },

    {
      id: 'lk-5',
      title: 'When banter goes too far',
      blurb: 'Being liked without being the one everyone jokes about.',
      items: [
        {
          t: 'concept',
          title: 'There is a line and you are allowed to hold it',
          body: 'Banter is fine right up until it is always aimed at the same person. If that person is you, laughing along teaches the group it is free. You do not have to make a scene — you just have to not reward it.',
          tip: 'The move is not anger. It is not laughing.',
        },
        {
          t: 'choice',
          prompt: 'Someone makes the same joke about you for the fifth time this week. What works best?',
          options: [
            { text: 'Laugh along like it is fine.', why: 'It is the easiest option and it is exactly what keeps it going. The group reads the laugh as permission.' },
            { text: 'A flat “yeah, you have done that one” and move on.', ok: true, why: 'No anger, no scene, and it lands. It signals you noticed, you are not hurt, and it is getting boring — which is the thing that actually stops it.' },
            { text: 'Get visibly annoyed.', why: 'Sometimes justified, and in a group it usually hands them a reaction, which is the fuel. Save it for things that actually matter.' },
            { text: 'Say something worse back.', why: 'It escalates, and now you are in a contest that only ends when someone genuinely gets hurt.' },
          ],
        },
        {
          t: 'concept',
          title: 'Say it once, in private',
          body: 'If it keeps going, the version that works is one sentence, quietly, away from the group: “That thing you keep saying — give it a rest, yeah?” Almost everyone stops. Done in front of people it becomes a showdown and they have to defend themselves.',
          example: { label: 'One sentence, no speech', line: '“Can you drop the thing about my voice? It is not funny any more.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are good ways to hold the line?',
          options: [
            { text: 'Not laughing, without making a scene', ok: true },
            { text: 'Saying it once, in private, plainly', ok: true },
            { text: 'Laughing along and hoping it stops', ok: false },
            { text: 'Just not being around that person as much', ok: true },
            { text: 'Getting the group to turn on them', ok: false },
          ],
          why: 'Quiet, direct, and being willing to walk away. Recruiting the group is the same behaviour you are objecting to, pointed the other way.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you ask someone to stop and they call you sensitive, you were wrong to ask.',
          answer: false,
          why: '“You are so sensitive” is what people say when they do not want to stop. Asking once, calmly, is completely reasonable, and how they respond tells you a lot about them.',
        },
        {
          t: 'freeform',
          prompt: 'Write the private version.',
          context: 'One sentence, said quietly, away from everyone. No speech, no anger.',
          rubric: {
            want: ['can', 'you', 'drop', 'stop', 'give', 'it', 'rest', 'thing', 'not', 'funny', 'anymore', 'any', 'more'],
            avoid: ['you always', 'you never', 'i hate you', 'sorry but'],
            minWords: 5,
            sample: '“Can you drop the thing about my height? It was funny the first time, it is just boring now.”',
          },
        },
      ],
    },
  ],
};
