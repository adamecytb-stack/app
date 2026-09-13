export default {
  id: 'making-a-move',
  title: 'Making A Move',
  subtitle: 'Asking, saying it, and surviving either answer',
  glyph: 'heart',
  color: '#FF6B7A',
  lessons: [
    {
      id: 'mv-1',
      title: 'Why nothing ever happens',
      blurb: 'The waiting game, and who wins it.',
      items: [
        {
          t: 'concept',
          title: 'Both of you are waiting',
          body: 'The most common outcome between two people who like each other is nothing. Not rejection — nothing. Both wait for certainty that never arrives, both tell themselves they will do it when the moment is right, and then the year ends. Someone has to go first, and there is no rule saying it cannot be you.',
          tip: 'Doing it slightly too early beats doing it never, and never is the default.',
        },
        {
          t: 'choice',
          prompt: 'You are “waiting for the right moment”. What is that usually?',
          options: [
            { text: 'A sensible plan.', why: 'It feels sensible. In practice the right moment is defined as “when I am not nervous”, which is a moment that does not exist.' },
            { text: 'A polite way of putting it off forever.', ok: true, why: 'Almost always. The moment never arrives because the thing you are waiting for is the nerves going away, and they do not go away before — they go away after.' },
            { text: 'Good, because timing really matters.', why: 'Timing matters a bit — not in the middle of a family emergency. It matters far less than people use it for.' },
            { text: 'Fine, because they will make the move eventually.', why: 'They are running the same programme you are. Two people waiting is how nothing happens for a year.' },
          ],
        },
        {
          t: 'concept',
          title: 'Lower what you are actually risking',
          body: 'You are not asking them to marry you. You are asking whether they want to do a normal thing on a normal day. Framed that way, a no costs you an awkward afternoon, not your dignity. The size of the ask controls the size of the fall.',
          example: { label: 'Small ask, small fall', line: '“come town Saturday” is survivable. “I have been in love with you since Year 7” is a lot to come back from.' },
        },
        {
          t: 'multi',
          prompt: 'Which of these make a move easier to make?',
          options: [
            { text: 'Asking about a specific day and thing', ok: true },
            { text: 'Keeping it light rather than serious', ok: true },
            { text: 'Waiting until you are completely certain they like you', ok: false },
            { text: 'Doing it in private rather than in front of people', ok: true },
            { text: 'Planning a big gesture', ok: false },
          ],
          why: 'Small, specific and private is the formula. Certainty never arrives, and big gestures put enormous pressure on someone to react well in public.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Big public gestures are romantic and usually work.',
          answer: false,
          why: 'They force someone to answer in front of an audience, which is pressure, not romance. Almost everyone would rather be asked quietly.',
        },
        {
          t: 'freeform',
          prompt: 'Name the smallest version.',
          context: 'Write the smallest possible move you could make this week — something so small it would be embarrassing not to manage it.',
          rubric: {
            want: ['ask', 'say', 'text', 'sit', 'walk', 'talk', 'them', 'to', 'about', 'next', 'if', 'them'],
            avoid: [],
            minWords: 5,
            sample: '“Ask if they want to walk back from school on Thursday because we go the same way anyway.”',
          },
        },
      ],
    },

    {
      id: 'mv-2',
      title: 'Asking them to hang out',
      blurb: 'A day, a thing, and no paragraph.',
      items: [
        {
          t: 'concept',
          title: 'Day plus thing',
          body: 'The entire formula is a day and a thing. “Saturday” plus “town” plus “come”. No build-up, no explaining why you are asking, no apology. The shorter it is, the less like a big deal it is, and the easier it is for them to just say yes.',
          example: { label: 'Whole message', line: '“are you doing anything Saturday? going into town with a couple of people, come”' },
          tip: 'The longer the message, the bigger a deal it becomes. Keep it to two lines.',
        },
        {
          t: 'choice',
          prompt: 'Which ask is best?',
          options: [
            { text: '“we should hang out sometime!!”', why: 'Enthusiastic and completely unactionable. There is no day, no thing, and nothing for them to agree to.' },
            { text: '“hey so I was thinking, and obviously no pressure at all, and it is completely fine if not, but would you maybe want to possibly do something at some point?”', why: 'Every hedge makes it heavier. By the end they can feel how much it cost you to send, which makes saying no feel brutal.' },
            { text: '“are you free Sunday? going to the cinema, come”', ok: true, why: 'Day, thing, invitation. Four seconds to read, easy to answer either way. This is the whole skill.' },
            { text: '“what are you doing this weekend?”', why: 'Not an ask, it is reconnaissance. They will answer and you will still have to ask, having now used up the natural opening.' },
          ],
        },
        {
          t: 'concept',
          title: 'Group first is completely fine',
          body: 'If a one-on-one ask feels like too much, ask them into something with other people. It is lower stakes for both of you, you get to be around each other properly, and it very often turns into the one-on-one version later.',
          tip: 'There is no rule that the first thing has to be a date. Getting into each other’s actual life is the goal.',
        },
        {
          t: 'order',
          prompt: 'Order a clean ask.',
          items: [
            'Name a day',
            'Name a specific thing',
            'Invite them in one short line',
            'Let them answer without you filling the silence',
          ],
        },
        {
          t: 'multi',
          prompt: 'Which things should you cut from the message?',
          options: [
            { text: '“obviously no pressure”', ok: true },
            { text: '“it is completely fine if not”', ok: true },
            { text: '“are you free Saturday?”', ok: false },
            { text: '“sorry if this is weird”', ok: true },
            { text: '“I know you are probably busy but”', ok: true },
          ],
          why: 'Every softener is you apologising for asking. One clean question is warmer than a paragraph of pre-emptive excuses.',
        },
        {
          t: 'freeform',
          prompt: 'Write the ask.',
          context: 'You want to ask them to come to the cinema on Saturday. Two lines maximum, no hedging.',
          rubric: {
            want: ['saturday', 'cinema', 'come', 'you', 'free', 'doing', 'anything', 'want', '?'],
            avoid: ['sorry', 'no pressure', 'if not', 'probably busy', 'sometime', 'weird'],
            minWords: 5,
            sample: '“are you doing anything Saturday? me and a couple of people are going to the cinema, come”',
          },
        },
      ],
    },

    {
      id: 'mv-3',
      title: 'Actually saying it',
      blurb: 'Telling someone you like them, out loud.',
      items: [
        {
          t: 'concept',
          title: 'Short, clear, in private',
          body: 'One sentence, said directly, with nobody else around. “I like you — I thought you should know.” That is genuinely it. The long version is not more romantic; it is just longer, and it gives them more to respond to while they are already caught off guard.',
          example: { label: 'Enough', line: '“I wanted to say it properly instead of being weird about it — I like you.”' },
          tip: 'Then stop talking. Let them answer. Filling the silence is where people undo it.',
        },
        {
          t: 'choice',
          prompt: 'Which is the best way to say it?',
          options: [
            { text: 'A long message at 2am explaining everything you feel.', why: '2am plus a long message is a combination people recognise, and it usually reads as intense rather than sincere. Whatever you write then, wait and reread it in the morning.' },
            { text: '“I like you. I just wanted to actually say it.”', ok: true, why: 'Clear, short, no demand attached. It respects them enough to be direct and does not trap them into a reaction.' },
            { text: 'Hint heavily and hope they work it out.', why: 'Hints are deniable, which means they resolve nothing. You can hint for a year and still be exactly here.' },
            { text: 'Get a friend to tell them.', why: 'It turns a private thing into a group event, and it says you would not say it yourself.' },
          ],
        },
        {
          t: 'concept',
          title: 'Do not attach a demand',
          body: 'Saying how you feel is a gift. Saying it and then waiting for a matching answer, or asking what they think, or following up ten minutes later, turns it into a bill. Say it, mean it, and let them have whatever reaction they have, including needing time.',
          tip: '“You do not have to say anything back” is one of the kindest sentences here — as long as you mean it.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If they need a few days to think, it is a bad sign.',
          answer: false,
          why: 'Being told something like that is a lot to process, especially if you are friends. Needing time is normal and often a good sign. Pushing during those days is what actually ruins it.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are good conditions for saying it?',
          options: [
            { text: 'In private', ok: true },
            { text: 'When you have both got time, not between lessons', ok: true },
            { text: 'In front of their friends', ok: false },
            { text: 'When things between you have been good recently', ok: true },
            { text: 'Late at night over text after a long silence', ok: false },
          ],
          why: 'Private, unhurried, and on the back of things going well. Public and late-night are the two settings that most reliably make it go badly.',
        },
        {
          t: 'freeform',
          prompt: 'Write your version.',
          context: 'One or two sentences. Say it clearly and do not attach a demand.',
          rubric: {
            want: ['i', 'like', 'you', 'wanted', 'say', 'tell', 'know', 'not', 'have', 'to'],
            avoid: ['do you like me', 'so do you', 'what do you think', 'please'],
            minWords: 6,
            sample: '“I have wanted to say this for a while — I like you. You do not have to say anything back, I just did not want to keep being weird about it.”',
          },
        },
      ],
    },

    {
      id: 'mv-4',
      title: 'If they say no',
      blurb: 'The bit everyone is scared of, handled properly.',
      items: [
        {
          t: 'concept',
          title: 'It hurts less and for less time than you think',
          body: 'People are consistently terrible at predicting how bad bad things will feel. A no is genuinely horrible for a day or two and then gets noticeably lighter. What lasts much longer is the year you spent not asking.',
          tip: 'Ask yourself honestly: will this matter in a month? Usually not. The not-knowing would have.',
        },
        {
          t: 'choice',
          prompt: 'They say they do not feel the same. Best response, right there?',
          options: [
            { text: '“okay, fair enough. Thanks for being honest.”', ok: true, why: 'Calm, short, done. It keeps your dignity completely intact and makes the next time you see each other survivable.' },
            { text: '“is it because of something I did?”', why: 'It makes them manage your feelings immediately after they did the hard thing. No answer exists that helps you.' },
            { text: '“okay well I did not really mean it anyway.”', why: 'Everyone can tell. It turns an honest moment into an obviously false one, and that is the bit that stings later.' },
            { text: '“can we at least try?”', why: 'Negotiating a no is the single fastest way to make someone uncomfortable around you permanently.' },
          ],
        },
        {
          t: 'concept',
          title: 'Then give it space',
          body: 'You do not have to be instantly fine, and you do not have to prove you are fine. Be normal in person, do not go cold as a punishment, and give yourself a couple of weeks of not thinking about it constantly. Both of those are allowed at the same time.',
          example: { label: 'What normal looks like', line: 'Say hi like you always did. Do not analyse them. Do not post about it.' },
        },
        {
          t: 'multi',
          prompt: 'Which are healthy ways to deal with a no?',
          options: [
            { text: 'Telling one friend you trust and letting it be a bit funny', ok: true },
            { text: 'Noting one thing you would do differently and then stopping', ok: true },
            { text: 'Rereading the whole chat looking for where it went wrong', ok: false },
            { text: 'Accepting that it is mostly about fit, not about your worth', ok: true },
            { text: 'Deciding never to try again', ok: false },
          ],
          why: 'One lesson and one friend is processing. Forensic rereading and swearing off people are avoidance — and they cost you far more than the no did.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Getting rejected means you did something wrong.',
          answer: false,
          why: 'Usually it means two people wanted different things, which is not a mistake. People who are good at this are not rejected less — they recover faster.',
        },
        {
          t: 'freeform',
          prompt: 'Write your reply to a no.',
          context: 'Write it now, while nothing is at stake. Having it ready makes it much easier to actually say.',
          rubric: {
            want: ['thanks', 'thank', 'you', 'fair', 'enough', 'okay', 'honest', 'telling', 'me', 'all', 'good', 'no', 'worries'],
            avoid: ['why', 'but', 'are you sure', 'what if', 'did i do'],
            minWords: 4,
            sample: '“fair enough — thanks for actually telling me instead of being weird about it. all good.”',
          },
        },
      ],
    },

    {
      id: 'mv-5',
      title: 'If they say yes',
      blurb: 'Nobody prepares for this one.',
      items: [
        {
          t: 'concept',
          title: 'Now be the same person',
          body: 'The most common way this goes wrong is that someone gets a yes and then changes — texts constantly, goes weirdly formal, or panics and pulls away. They said yes to the version of you that already existed. Keep being that.',
          tip: 'Nothing has to be different tomorrow. Same jokes, same conversations, just with the question answered.',
        },
        {
          t: 'choice',
          prompt: 'They said yes. What is the biggest risk now?',
          options: [
            { text: 'Not planning anything impressive enough.', why: 'Nobody needs impressive. Doing an ordinary thing together is the entire point.' },
            { text: 'Becoming a different, more intense version of yourself.', ok: true, why: 'The most common failure by far. Suddenly texting five times more or treating every conversation as important changes the thing they liked.' },
            { text: 'Telling too few people.', why: 'Telling fewer people is almost always the better call early on, especially at school.' },
            { text: 'Not saying how you feel often enough.', why: 'Overdoing this early is far more common than underdoing it, and it puts a lot of weight on something new.' },
          ],
        },
        {
          t: 'concept',
          title: 'Keep it off the group chat',
          body: 'Whatever happens between you belongs to the two of you until you both agree otherwise. Screenshots get forwarded, friends get excited, and something private becomes a school-wide topic in a day. That pressure has ended more things than any argument.',
          tip: 'Ask before you tell people. It is a very small question and it earns a lot of trust.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are good moves early on?',
          options: [
            { text: 'Asking them who they are okay with you telling', ok: true },
            { text: 'Keeping your own friends and hobbies exactly as they were', ok: true },
            { text: 'Screenshotting your chats for the group chat', ok: false },
            { text: 'Saying what you actually want instead of hinting', ok: true },
            { text: 'Replying instantly to everything at all hours', ok: false },
          ],
          why: 'Privacy, keeping your own life, and being direct. Disappearing into one person and broadcasting the details are the two classic early mistakes.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you like someone, you should drop your other plans whenever they are free.',
          answer: false,
          why: 'Having your own life is not a tactic, it is just healthier — and people who keep their own friends and interests are easier to be around. Dropping everything gets heavy fast for both of you.',
        },
        {
          t: 'freeform',
          prompt: 'Ask the small question.',
          context: 'Write how you would ask them who they are comfortable with you telling.',
          rubric: {
            want: ['who', 'do', 'you', 'want', 'tell', 'telling', 'people', 'keep', 'quiet', 'anyone', 'okay', 'mind'],
            avoid: [],
            minWords: 6,
            sample: '“do you want to keep this between us for a bit, or are you fine with people knowing? happy either way, just tell me”',
          },
        },
      ],
    },
  ],
};
