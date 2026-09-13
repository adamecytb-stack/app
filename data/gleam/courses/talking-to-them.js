export default {
  id: 'talking-to-them',
  title: 'Talking To Them',
  subtitle: 'When your brain goes blank around someone you like',
  glyph: 'sparkle',
  color: '#F5A524',
  lessons: [
    {
      id: 'tt-1',
      title: 'Why they break your brain',
      blurb: 'You are not bad at talking. Something else is going on.',
      items: [
        {
          t: 'concept',
          title: 'You already know how to do this',
          body: 'You can talk to your friends for four hours about nothing. That is the whole skill — you have it. What changes around someone you like is not your ability. It is that suddenly the conversation feels like a test you can fail, so your brain starts monitoring itself instead of talking.',
          example: { label: 'Same you, different setting', line: 'With friends: not thinking about it. With them: thinking about how you sound, what to say next, and whether your face is doing something weird.' },
          tip: 'The goal is not to become a different person. It is to be the friend-version of you in a harder room.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Going blank around someone you like means you are bad at talking to people.',
          answer: false,
          why: 'It means your body has decided this matters. That is a stakes problem, not a skill problem — and stakes problems get smaller with reps, which is the entire point of this app.',
        },
        {
          t: 'choice',
          prompt: 'They sit down next to you and say hey. Your mind empties. What actually helps in that second?',
          options: [
            { text: 'Frantically search for something interesting to say.', why: 'Searching for something *interesting* is the trap. The bar is not interesting — the bar is a sentence. Searching makes the pause longer and the pressure worse.' },
            { text: 'Say the boring obvious thing out loud.', ok: true, why: '“I have completely given up on this lesson” is not clever and it works. Boring restarts the conversation; silence ends it. Clever can come later, once you are talking.' },
            { text: 'Wait for them to lead.', why: 'They said hey. They already led. Waiting again puts the whole thing on them, and most people read that as you not wanting to talk.' },
            { text: 'Make a joke you have been saving.', why: 'A stored joke delivered under pressure usually lands strangely because it is not attached to anything happening. Real reactions beat prepared material.' },
          ],
        },
        {
          t: 'concept',
          title: 'Lower the bar on purpose',
          body: 'People who are easy to talk to are not producing brilliant lines. They are producing ordinary lines quickly. The comfort comes from the flow, not the content. If you only speak when you have something good, you will mostly be silent.',
          example: { label: 'Fully allowed', line: '“It is so hot in here.” · “Did you understand any of that?” · “I am so tired, I got like four hours.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are good enough to say to someone you like?',
          options: [
            { text: '“This lesson is going so slowly.”', ok: true },
            { text: '“Did you do the homework? Because I definitely did not.”', ok: true },
            { text: 'Nothing, because none of it is interesting enough', ok: false },
            { text: '“What did you get for question four?”', ok: true },
            { text: 'A long story you have planned out in advance', ok: false },
          ],
          why: 'Low-stakes and true beats impressive. The first three all hand them an easy reply, which is the only job the first sentence has.',
        },
        {
          t: 'freeform',
          prompt: 'Write the boring version.',
          context: 'You are both waiting outside a classroom for the teacher to turn up. Write one ordinary thing you could say — it does not need to be good.',
          rubric: {
            want: ['?', 'this', 'we', 'you', 'late', 'waiting', 'always', 'lesson', 'here', 'reckon', 'think'],
            avoid: [],
            minWords: 4,
            sample: '“Do you reckon she has actually forgotten about us?”',
          },
        },
      ],
    },

    {
      id: 'tt-2',
      title: 'The first thing you say',
      blurb: 'Openers that cost you nothing if they go nowhere.',
      items: [
        {
          t: 'concept',
          title: 'Point at something you are both in',
          body: 'The easiest thing to talk about is whatever is already happening to both of you — the lesson, the queue, the noise, the supply teacher, the weather doing something stupid. It is safe because it is not about them and not about you, so nobody is exposed.',
          example: { label: 'The shared thing', line: '“Why is it always freezing in this room and boiling in every other one.”' },
          tip: 'If it goes nowhere, nothing happened. That is what makes it safe to try.',
        },
        {
          t: 'choice',
          prompt: 'You end up next to them in a queue at lunch. Best opener?',
          options: [
            { text: '“Hey. So... how are you?”', why: 'Not wrong, but “how are you” gets “good, you?” and then you are both stuck. It is a door that opens onto a wall.' },
            { text: '“Okay, be honest — is the pasta ever actually good?”', ok: true, why: 'Shared situation, tiny bit funny, and it asks for an opinion instead of information. Opinions are easier and more fun to give.' },
            { text: '“I have been wanting to talk to you for ages.”', why: 'Way too much weight for a lunch queue. It turns a two-minute chat into a Moment, and most people freeze when handed one.' },
            { text: 'Stand there and hope they start.', why: 'They are probably running the same calculation you are. Someone has to go, and going first is not embarrassing — it is just going first.' },
          ],
        },
        {
          t: 'concept',
          title: 'Never open with an apology',
          body: '“Sorry, random, but—” or “this is probably weird—” tells them how to receive what comes next: as an intrusion. You are labelling yourself a problem before you have said anything. Cut all of it and just start.',
          example: { label: 'Delete the run-up', line: 'Not “sorry this is so random but did you do the geography thing” → “Did you do the geography thing? I am fully lost.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these should you cut from the front of a sentence?',
          options: [
            { text: '“Sorry, random but…”', ok: true },
            { text: '“This is probably a stupid question…”', ok: true },
            { text: '“Hey —”', ok: false },
            { text: '“You probably do not care but…”', ok: true },
            { text: '“Ignore me if you are busy…”', ok: true },
          ],
          why: 'Every one of those is you apologising for existing in the conversation. “Hey” is just a greeting — it costs nothing.',
        },
        {
          t: 'blank',
          prompt: 'Fix the opener.',
          sentence: '“Sorry, this is so random, but did you understand that?” → “___ you understand that? Because I did not.”',
          bank: ['Did', 'Sorry did', 'I know this is weird but did', 'You probably did but did'],
          answer: 'Did',
        },
        {
          t: 'freeform',
          prompt: 'Write your opener.',
          context: 'They are sitting near you before class starts, on their phone. Nothing is happening yet.',
          rubric: {
            want: ['?', 'you', 'did', 'have', 'what', 'is', 'this', 'do', 'hey'],
            avoid: ['sorry', 'random', 'weird', 'stupid', 'probably do not care'],
            minWords: 4,
            sample: '“Did you get the maths homework done? I am about to do it right now in about four minutes.”',
          },
        },
      ],
    },

    {
      id: 'tt-3',
      title: 'Keeping it going',
      blurb: 'What to do when you have said hi and your brain is empty.',
      items: [
        {
          t: 'concept',
          title: 'Pull the thread they just handed you',
          body: 'You do not need new topics. Every sentence they say contains two or three things you can ask about. “I was up late finishing that thing for Miss Ahmed” gives you: the thing, Miss Ahmed, being up late. Pick one and pull.',
          example: { label: 'Three doors in one line', line: '“I could not sleep so I just watched a whole series.” → the not sleeping · the series · all of it in one night' },
          tip: 'You are never actually out of things to say. You are out of confidence to ask the obvious next question.',
        },
        {
          t: 'multi',
          prompt: 'They say: “I only came in today because we had football after school.” What can you pull on?',
          options: [
            { text: 'The football', ok: true },
            { text: '“Only came in today” — were they going to skip?', ok: true },
            { text: 'What after school is like for them', ok: true },
            { text: 'The word “because”', ok: false },
            { text: 'Their opinion on the school timetable system', ok: false },
          ],
          why: 'Pull the part with feeling in it. “Only came in” is the interesting half of that sentence — it is doing a lot of work.',
        },
        {
          t: 'concept',
          title: 'Ask about the weird word',
          body: 'When someone uses a word you did not expect — “finally”, “actually”, “again”, “only” — that is where their opinion is hiding. Asking about the sensible part of the sentence gets you facts. Asking about the odd word gets you them.',
          example: { label: 'Go for the odd one', line: '“I finally quit dance” → the word to ask about is finally, not dance.' },
        },
        {
          t: 'choice',
          prompt: 'They say: “Yeah I am probably not going to the thing on Friday.” Best reply?',
          options: [
            { text: '“Oh okay.”', why: 'The conversation just died and you were the one holding it. “Oh okay” is a full stop with no follow-up.' },
            { text: '“Why not?”', ok: true, why: 'Two words, and it goes at the actual content. “Probably not” means they have a reason and half of them want to say it.' },
            { text: '“Yeah I am not going either.”', why: 'Might be a lie, and either way it closes the topic instead of opening theirs. Match later — ask first.' },
            { text: '“You should come!”', why: 'Skips straight to persuading. You do not know why they are not going yet, so you might be pushing on something they cannot change.' },
          ],
        },
        {
          t: 'concept',
          title: 'Give something back',
          body: 'Question, answer, question, answer is an interview and it gets exhausting fast. After they answer, say something of your own before you ask again. That is what turns it from you collecting information into an actual conversation.',
          example: { label: 'The rhythm', line: 'They answer → you react or add something → then you ask.' },
          tip: 'Roughly one thing about you for every one thing you ask.',
        },
        {
          t: 'freeform',
          prompt: 'Pull the thread.',
          context: 'They say: “I have not really been out much since I got my phone taken off me.”',
          rubric: {
            want: ['phone', 'taken', 'what', 'why', 'how', 'long', 'happened', 'did', 'you'],
            avoid: [],
            minWords: 4,
            sample: '“Hold on — what did you do to get your phone taken? I need the full story.”',
          },
        },
      ],
    },

    {
      id: 'tt-4',
      title: 'Being funny when you are nervous',
      blurb: 'You are funny with your friends. Here is how to get that back.',
      items: [
        {
          t: 'concept',
          title: 'Nerves kill timing, not humour',
          body: 'You have not stopped being funny. Nerves make you rush, so you deliver the line early, explain it, and then check their face. All three kill it. The fix is not better jokes — it is slowing down and not looking for the reaction.',
          tip: 'Say the funny thing and then just carry on. Do not wait to see if it landed.',
        },
        {
          t: 'choice',
          prompt: 'You make a joke and they do not laugh. What now?',
          options: [
            { text: 'Explain the joke.', why: 'Explaining doubles the awkward. The joke was two seconds; the explanation is twenty, and now it is the main event.' },
            { text: 'Say “sorry, that was bad.”', why: 'Apologising for a joke makes them manage your feelings. Now they have to reassure you about something neither of you cared about.' },
            { text: 'Carry straight on like nothing happened.', ok: true, why: 'Because nothing did. Not every line lands, including for genuinely funny people. Moving on is what makes it a non-event.' },
            { text: 'Go quiet for a bit.', why: 'That is the thing that actually makes it awkward. The silence afterwards is what they will notice, not the joke.' },
          ],
        },
        {
          t: 'concept',
          title: 'Laugh at yourself, not at them',
          body: 'The safest funny thing in the room is you. “I have walked into that door twice this week” costs you nothing and makes you easy to be around. Jokes at their expense are a gamble you do not need to take with someone you like.',
          example: { label: 'Safe and it works', line: '“I put my hand up in maths today to say something and then forgot what it was. In front of everyone.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are safe to joke about?',
          options: [
            { text: 'Something embarrassing you did', ok: true },
            { text: 'How much you both hate a lesson', ok: true },
            { text: 'How they look', ok: false },
            { text: 'A thing they told you they were worried about', ok: false },
            { text: 'How confident they were about something they got wrong', ok: true },
          ],
          why: 'Yourself and the situation are always safe. Appearance and anything they admitted feeling bad about are not — those two land as mean even when you meant it lightly.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you are naturally quiet, trying to be the funny one is the fastest way to be liked.',
          answer: false,
          why: 'Performing constantly is exhausting to do and to watch. Being warm and actually listening gets you further than being funny, and it does not run out.',
        },
        {
          t: 'freeform',
          prompt: 'Make yourself the joke.',
          context: 'You just tripped slightly walking up to them. They noticed. Write what you say.',
          rubric: {
            want: ['i', 'that', 'nothing', 'do', 'walk', 'happens', 'saw', 'planned', 'anyway', 'fine'],
            avoid: ['sorry', 'so embarrassing', 'i hate myself'],
            minWords: 4,
            sample: '“Yeah, I have been walking for fourteen years and it is still not going great.”',
          },
        },
      ],
    },

    {
      id: 'tt-5',
      title: 'When their friends are there',
      blurb: 'Talking to them in front of an audience.',
      items: [
        {
          t: 'concept',
          title: 'Talk to the group, not just to them',
          body: 'Walking up and talking only to the person you like, in front of their friends, is the single most obvious thing you can do — and it puts them on the spot in front of people who will bring it up later. Talk to everyone. They will notice you more, not less.',
          tip: 'Their friends deciding you are alright is worth a lot. It is also the part most people skip.',
        },
        {
          t: 'choice',
          prompt: 'They are with three friends. You want to go over. What is the move?',
          options: [
            { text: 'Go over and talk only to them.', why: 'Everyone clocks it instantly, including the friends, and it makes the person you like self-conscious. Nobody is relaxed after that.' },
            { text: 'Join the group and react to whatever is already being said.', ok: true, why: 'You join the conversation rather than redirecting it. It is lower pressure for them and it makes you part of the group instead of a visitor.' },
            { text: 'Wait until they are on their own.', why: 'Sometimes right. But if you only ever appear when they are alone, you stay a separate thing rather than part of their world.' },
            { text: 'Send them a message from across the room.', why: 'It looks exactly like what it is, and it skips the part that would actually help — them seeing you be normal around people.' },
          ],
        },
        {
          t: 'concept',
          title: 'Do not perform at them',
          body: 'The urge is to be louder and funnier when they are watching. It reads as trying, and trying is the thing that makes people pull back. Being slightly calmer than usual does more than being louder than usual.',
          example: { label: 'What it looks like', line: 'Telling a story to the group while checking their face for a reaction. Everyone can see you doing it.' },
        },
        {
          t: 'multi',
          prompt: 'Which of these help when their friends are around?',
          options: [
            { text: 'Being just as friendly to their friends as to them', ok: true },
            { text: 'Laughing at someone else’s joke properly', ok: true },
            { text: 'Constantly checking whether they are watching you', ok: false },
            { text: 'Talking a bit less than you want to', ok: true },
            { text: 'Bringing up something private they told you', ok: false },
          ],
          why: 'Never repeat something they told you one-to-one in front of their friends. It feels like a betrayal even if you meant it as a compliment.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If their friends start teasing them about you, the best move is to deny everything loudly.',
          answer: false,
          why: 'Loud denial makes it a bigger deal and can read as “being linked to you is embarrassing”. A relaxed shrug or a small joke lets the air out of it without insulting anyone.',
        },
        {
          t: 'freeform',
          prompt: 'Defuse it.',
          context: 'Their friend says, in front of everyone, “ooooh, you two.” Write your reaction.',
          rubric: {
            want: ['okay', 'right', 'yeah', 'thanks', 'that', 'was', 'anyway', 'calm', 'wow', 'sure'],
            avoid: ['no way', 'ew', 'as if', 'never', 'gross'],
            minWords: 3,
            sample: '“Incredible contribution, thank you for that.” *carries on with what you were saying*',
          },
        },
      ],
    },
  ],
};
