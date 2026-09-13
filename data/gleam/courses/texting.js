export default {
  id: 'texting',
  title: 'Texting Them',
  subtitle: 'Starting it, keeping it alive, not overthinking it',
  glyph: 'chat',
  color: '#63C6F5',
  lessons: [
    {
      id: 'tx-1',
      title: 'Starting from nothing',
      blurb: 'How to text someone first without an excuse to.',
      items: [
        {
          t: 'concept',
          title: 'You do not need a reason',
          body: 'Most people wait until they have a legitimate excuse — homework, a question, something from school. You do not need one. The excuse is usually transparent anyway, and it traps the conversation inside a boring topic you then have to escape.',
          example: { label: 'No excuse needed', line: '“ok this is going to sound mad but I have thought about that thing you said in english like four times today”' },
          tip: 'A message that is obviously just “I wanted to talk to you” is fine. It is honest, and honest is attractive.',
        },
        {
          t: 'choice',
          prompt: 'You want to text them for the first time. Which opener works best?',
          options: [
            { text: '“hey”', why: 'It puts the whole job on them. They now have to invent a conversation from one syllable, and most people just reply “hey” back and it dies.' },
            { text: '“hey, do you know what page the science homework is on”', why: 'Fine, but you have built a conversation that ends the second they answer. You will have to restart from zero.' },
            { text: '“ok I need your opinion on something stupid”', ok: true, why: 'Gives them a reason to reply, creates curiosity, and it is light. Almost nobody ignores this one.' },
            { text: '“hey how are you? how has your day been? what have you been up to?”', why: 'Three questions at once reads as nervous and it is a lot to answer. One question is enough.' },
          ],
        },
        {
          t: 'concept',
          title: 'Open a door, not a gate',
          body: 'A good first message is easy to answer in one line and interesting enough to want to. “hey” is a gate — all effort, no reward. “would you rather never use your phone again or never watch anything again” is a door.',
          example: { label: 'Easy and fun to answer', line: '“genuine question, is [thing at school] as bad as everyone is saying or is everyone being dramatic”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these are easy to reply to?',
          options: [
            { text: '“ok settle something for me”', ok: true },
            { text: '“hey”', ok: false },
            { text: '“you were so right about that teacher by the way”', ok: true },
            { text: '“wyd”', ok: false },
            { text: '“I saw this and thought of what you said yesterday”', ok: true },
          ],
          why: 'The good ones give them something specific to react to. “hey” and “wyd” both hand them a blank page.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If they do not reply within a few hours, you should send another message to check.',
          answer: false,
          why: 'People are at dinner, at training, on a dead phone, or just not on it. A follow-up within hours reads as anxious, and anxious is the one thing you cannot text your way out of. Leave it.',
        },
        {
          t: 'freeform',
          prompt: 'Write the first message.',
          context: 'You have their number or their socials. You have never DMed them before. Nothing has happened to give you an excuse.',
          rubric: {
            want: ['?', 'you', 'ok', 'random', 'question', 'opinion', 'think', 'settle', 'need', 'thought'],
            avoid: ['sorry to bother', 'you probably do not remember me', 'hope i am not annoying'],
            minWords: 5,
            sample: '“ok random but I need a second opinion — is it acceptable to put ketchup on a roast dinner. my whole family has turned on me”',
          },
        },
      ],
    },

    {
      id: 'tx-2',
      title: 'Reply speed',
      blurb: 'Waiting, double texting, and the game nobody is actually winning.',
      items: [
        {
          t: 'concept',
          title: 'Nobody is timing you',
          body: 'Waiting an hour to reply so you do not look keen is a game where both people lose. The person who replies quickly is not losing status — they are having a better conversation. Strategic slowness mostly just makes chats die of boredom.',
          tip: 'Reply when you see it and want to. That is the whole rule.',
        },
        {
          t: 'choice',
          prompt: 'They replied two minutes ago. You have your phone in your hand. What do you do?',
          options: [
            { text: 'Wait forty minutes so you do not seem eager.', why: 'You are adding forty minutes of silence to a conversation that was working. Waiting does not make you more interesting; it makes the chat slower.' },
            { text: 'Reply now, properly.', ok: true, why: 'Fast, warm replies are how good conversations happen. Being interested is not embarrassing — it is the point.' },
            { text: 'Reply now, but with one word so it seems casual.', why: 'Speed is not the problem — this fixes nothing and makes you seem bored instead of busy.' },
            { text: 'Leave it on read while you think of the perfect reply.', why: 'They can usually see that. Twenty minutes of “seen” with nothing after it says more than a slightly imperfect message would.' },
          ],
        },
        {
          t: 'concept',
          title: 'Double texting is allowed',
          body: 'Sending a second message before they reply is not a crime. It is only a problem when it is chasing — “??”, “hello?”, “wow ok”. A second message that adds something is completely normal and nobody thinks about it as hard as you do.',
          example: { label: 'Fine', line: '“also I forgot to say — the thing you sent me was so funny”' },
          tip: 'Adding something: fine. Demanding a reply: not fine.',
        },
        {
          t: 'multi',
          prompt: 'Which second messages are fine to send?',
          options: [
            { text: '“oh also — did you see what happened at lunch”', ok: true },
            { text: '“??”', ok: false },
            { text: '“wow ok”', ok: false },
            { text: '“ignore that, I meant the other one”', ok: true },
            { text: '“are you ignoring me”', ok: false },
          ],
          why: 'Anything that adds to the conversation is fine. Anything that asks them to account for their silence is pressure, and pressure is what makes people go quiet for real.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Being left on read once means they are not interested.',
          answer: false,
          why: 'Once means nothing at all. Phones die, people get distracted mid-reply, parents take phones. A pattern over weeks means something. One instance means one instance.',
        },
        {
          t: 'order',
          prompt: 'They have not replied in two days. Order these from best to worst.',
          items: [
            'Leave it, and say something normal to them in person',
            'Send one new, unrelated message a few days later',
            'Send “hey, you good?”',
            'Send “wow, ok then”',
          ],
        },
      ],
    },

    {
      id: 'tx-3',
      title: 'Not being dry',
      blurb: 'Why chats die, and how to stop killing them.',
      items: [
        {
          t: 'concept',
          title: 'Never end on a full stop',
          body: 'Dry texting is not about being boring. It is about sending messages that close. “yeah”, “same”, “lol” all end the conversation and hand them the job of restarting it. Add one thing — a question, a detail, a reaction — and it keeps moving.',
          example: { label: 'Closed vs open', line: '“yeah same” → “yeah same, I have not slept properly all week. what is your excuse”' },
        },
        {
          t: 'choice',
          prompt: 'They text: “I am so tired, I stayed up way too late.” Best reply?',
          options: [
            { text: '“same”', why: 'Technically a reply. Also a full stop. They now have to do all the work again, and after a few of these they stop bothering.' },
            { text: '“lol”', why: 'The single most conversation-ending message there is. It reacts without adding anything.' },
            { text: '“doing what? I was up til 1 watching absolute rubbish”', ok: true, why: 'A question plus something about you. They can answer the question or react to your thing — two doors instead of none.' },
            { text: '“you should sleep more”', why: 'Advice nobody asked for. It also reads as slightly parental, which is not the energy.' },
          ],
        },
        {
          t: 'concept',
          title: 'Match their length, roughly',
          body: 'If they send three lines and you send one word, they feel it. If they send one word and you send four paragraphs, they feel that too. Sitting roughly where they are is the easiest way to seem in sync without thinking about it.',
          tip: 'If their messages have been getting shorter for a while, that is information. Ease off rather than pushing harder.',
        },
        {
          t: 'multi',
          prompt: 'Which of these keep a chat alive?',
          options: [
            { text: 'Answering, then adding a detail they can ask about', ok: true },
            { text: 'Reacting to something they said earlier that day', ok: true },
            { text: 'Sending “lol” and nothing else', ok: false },
            { text: 'Asking something you actually want to know', ok: true },
            { text: 'Sending five messages in a row while they are typing', ok: false },
          ],
          why: 'Every good one gives them something to grab. Every bad one either closes the door or floods it.',
        },
        {
          t: 'match',
          prompt: 'Match each dry reply to the version that keeps it going.',
          pairs: [
            ['“same”', '“same, I was up til 1 doing nothing. what is your excuse”'],
            ['“lol”', '“no because that is actually so annoying, what did you say back”'],
            ['“nice”', '“wait that is sick, how long have you been doing that”'],
            ['“idk”', '“no idea honestly. what do you reckon”'],
          ],
        },
        {
          t: 'blank',
          prompt: 'Un-dry it.',
          sentence: 'They say they got a dog. You reply: “no way, ___ is it? send a picture immediately”',
          bank: ['what kind', 'ok', 'cool', 'nice'],
          answer: 'what kind',
        },
        {
          t: 'freeform',
          prompt: 'Keep it alive.',
          context: 'They text: “I have got so much revision to do this weekend, I am dreading it.”',
          rubric: {
            want: ['?', 'what', 'which', 'how', 'i', 'me', 'too', 'have', 'do', 'same', 'you'],
            avoid: ['lol'],
            minWords: 6,
            sample: '“which subject is the worst one? I have got geography and I genuinely do not know a single thing”',
          },
        },
      ],
    },

    {
      id: 'tx-4',
      title: 'Snaps, stories and streaks',
      blurb: 'The low-stakes ways in.',
      items: [
        {
          t: 'concept',
          title: 'A story reply is the cheapest opener there is',
          body: 'Replying to someone’s story is the lowest-risk message you can send. It has a built-in reason to exist, it is clearly casual, and if they do not reply, nothing happened. It is the easiest first contact available.',
          example: { label: 'Reacting properly', line: 'Not “🔥” → “wait is that the place by the park? I have been trying to go for ages”' },
          tip: 'React to the content, not just with an emoji. An emoji is seen and forgotten; a sentence starts something.',
        },
        {
          t: 'choice',
          prompt: 'They post a story of them at a gig. What do you send?',
          options: [
            { text: '🔥', why: 'Read, appreciated, forgotten. There is nothing here for them to reply to, so they will not.' },
            { text: '“who are you seeing? I keep meaning to go to something and never do”', ok: true, why: 'A question plus a bit of you. Casual, easy to answer, and it turns a story view into a conversation.' },
            { text: '“nice”', why: 'Marginally better than an emoji, and still a dead end.' },
            { text: 'Nothing, but watch it three times.', why: 'On most apps they can see you watched it. Watching a lot and never speaking is a worse look than just saying something.' },
          ],
        },
        {
          t: 'concept',
          title: 'A streak is not a relationship',
          body: 'Sending a blank photo every day for 200 days is not the same as talking. It feels like contact and it builds nothing. If you have a streak going, use it as a reason to send an actual sentence sometimes.',
          tip: 'One real message beats a hundred streak saves.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If they view your story but never reply, it means they are not interested.',
          answer: false,
          why: 'People watch everything. It means almost nothing on its own. Whether they reply when you actually speak to them is the real signal — story views are not.',
        },
        {
          t: 'concept',
          title: 'Screenshots are forever',
          body: 'Assume everything you send can end up shown to their friends, screenshotted, or read out loud. Not because people are cruel, but because phones get passed around and group chats exist. Send things you would not mind being seen, and never send anything of yourself you would not want the whole year group to have.',
          tip: 'If a message would ruin your week if it got shared, do not send it. That is the whole test.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are safe to send?',
          options: [
            { text: 'A joke about a lesson you both hate', ok: true },
            { text: 'Something mean about one of their friends', ok: false },
            { text: 'A genuine compliment about something they made or did', ok: true },
            { text: 'Any photo of yourself you would not want shared', ok: false },
            { text: 'Asking if they want to hang out at the weekend', ok: true },
          ],
          why: 'Assume a second audience. Kind and normal survives being screenshotted; anything mean or private does not.',
        },
      ],
    },

    {
      id: 'tx-5',
      title: 'Getting off the phone',
      blurb: 'Texting is the warm-up. This is the point.',
      items: [
        {
          t: 'concept',
          title: 'A good chat is not the goal',
          body: 'It is easy to text someone for a month and end up exactly where you started. Texting is practice and it is fun, but nothing actually changes until you see each other in real life on purpose. At some point you have to say a day and a thing.',
          tip: 'If you have been texting for weeks and never suggested anything, the chat has become the whole relationship.',
        },
        {
          t: 'choice',
          prompt: 'The chat is going really well. How do you move it?',
          options: [
            { text: '“we should hang out sometime”', why: '“Sometime” is how two interested people never meet. It sounds like a plan and it commits nobody to anything.' },
            { text: '“are you doing anything Saturday? there is that thing in town, come”', ok: true, why: 'A day and a thing. Easy to say yes to, easy to say no to, and it actually moves.' },
            { text: '“do you want to meet up?”', why: 'Closer, but still vague enough that they have to do the planning. Give them something concrete to agree to.' },
            { text: 'Keep texting and wait for them to suggest it.', why: 'They might. They also might be waiting for exactly the same thing, which is how months pass.' },
          ],
        },
        {
          t: 'concept',
          title: 'Specific is kinder',
          body: 'A vague invite makes them guess what you mean and whether you mean it. A specific one — day, place, what you would be doing — is easy to answer either way. Being easy to say no to is part of being easy to say yes to.',
          example: { label: 'The shape', line: '“[day] + [thing] + come” — that is it. No build-up, no paragraph.' },
        },
        {
          t: 'order',
          prompt: 'Order the steps of moving it off text.',
          items: [
            'Have a few chats that actually go somewhere',
            'Notice they are replying properly, not just politely',
            'Name a day and a thing',
            'Let it be easy either way',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'You should keep texting for a long time before suggesting meeting up, so it is not too sudden.',
          answer: false,
          why: 'Waiting too long is a much more common mistake than going too fast. Long texting phases usually fade out rather than turn into anything.',
        },
        {
          t: 'freeform',
          prompt: 'Make the suggestion.',
          context: 'You have been texting for a couple of weeks and it is going well. They mentioned they like going to the skatepark.',
          rubric: {
            want: ['saturday', 'sunday', 'weekend', 'friday', 'after', 'school', 'skatepark', 'come', 'you', 'free', 'want'],
            avoid: ['sometime', 'at some point', 'one day', 'we should probably'],
            minWords: 6,
            sample: '“are you free Saturday? I am going to the skatepark with a couple of people, you should come”',
          },
        },
      ],
    },
  ],
};
