export default {
  id: 'charisma',
  title: 'Charisma & Presence',
  subtitle: 'Warmth you can feel across a room',
  glyph: 'sparkle',
  color: '#FFC763',
  lessons: [
    {
      id: 'ch-1',
      title: 'Warmth and competence',
      blurb: 'The two dials every first impression runs on.',
      items: [
        {
          t: 'concept',
          title: 'People read two things',
          body: 'Within seconds, people are answering two questions about you: can I trust you, and can you do anything. Warmth and competence. Charisma is not a third quality — it is both dials up at once, which is rare enough to feel like magic.',
          example: { label: 'The four corners', line: 'Low/low: forgettable. High competence only: impressive, cold. High warmth only: lovely, not taken seriously. Both: charismatic.' },
        },
        {
          t: 'match',
          prompt: 'Match the behaviour to the dial it moves.',
          pairs: [
            ['Remembering a detail from last time', 'Warmth'],
            ['Saying “I don\'t know” without flinching', 'Competence'],
            ['Turning your whole body to face someone', 'Warmth'],
            ['Speaking slightly slower than you want to', 'Competence'],
          ],
        },
        {
          t: 'choice',
          prompt: 'You are technically excellent but people find you a bit cold. Which dial do you turn, and how?',
          options: [
            { text: 'Competence — be even more prepared.', why: 'You are solving the problem you do not have. More competence in a cold read just makes you more intimidating.' },
            { text: 'Warmth — ask one personal question per conversation and actually react.', ok: true, why: 'Warmth is built from small, specific attention. One real question and one real reaction shifts the read fast.' },
            { text: 'Warmth — smile more in general.', why: 'Closer, but unattached smiling reads as nervous or false. Warmth needs a target: a person, a detail, a reaction.' },
            { text: 'Neither — some people are just cold.', why: 'Both dials are behaviours, not traits. That is the entire premise of practising this.' },
          ],
        },
        {
          t: 'concept',
          title: 'Warmth is specific',
          body: 'Generic friendliness reads as customer service. Warmth is specific: their name, the thing they told you last week, the fact that you noticed they went quiet. Specificity is the proof you were actually there.',
          tip: 'One remembered detail is worth ten compliments.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Admitting a small weakness lowers how competent people think you are.',
          answer: false,
          why: 'When competence is already established, a small admitted flaw raises likeability without denting credibility — the “pratfall effect”. Only people who have not yet shown competence get hurt by it.',
        },
        {
          t: 'multi',
          prompt: 'Which of these raise warmth without touching competence?',
          options: [
            { text: 'Using their name once, naturally', ok: true },
            { text: 'Asking about the thing they were worried about last week', ok: true },
            { text: 'Listing your qualifications', ok: false },
            { text: 'Laughing at their joke properly, not politely', ok: true },
            { text: 'Correcting their pronunciation', ok: false },
          ],
          why: 'Warmth is attention paid outward. Anything that redirects to your own standing is the other dial — or neither.',
        },
      ],
    },

    {
      id: 'ch-2',
      title: 'The body speaks first',
      blurb: 'What your posture says before you do.',
      items: [
        {
          t: 'concept',
          title: 'Take up your own space',
          body: 'Confidence in the body is mostly about stillness and openness: feet planted, shoulders back and down, hands visible, no fidgeting. You are not performing dominance. You are removing the signals that say “I am about to apologise for existing”.',
          tip: 'Hands in pockets, arms crossed, and phone-in-hand all read the same: closed for business.',
        },
        {
          t: 'multi',
          prompt: 'Which of these read as anxious to almost everyone?',
          options: [
            { text: 'Rocking on your heels', ok: true },
            { text: 'Touching your face or neck repeatedly', ok: true },
            { text: 'Pausing before you answer', ok: false },
            { text: 'Fast, shallow nodding while they speak', ok: true },
            { text: 'Holding a drink with both hands at chest height', ok: true },
          ],
          why: 'A pause reads as thinking, which is confident. Everything else on that list is your body trying to make itself smaller or busier.',
        },
        {
          t: 'choice',
          prompt: 'Someone approaches while you are talking to one person. What do you do with your body?',
          options: [
            { text: 'Keep facing your current partner and glance over.', why: 'It signals “you are interrupting”. They will hover and then leave.' },
            { text: 'Open your stance so the three of you form a triangle.', ok: true, why: 'Opening the circle is the single most generous piece of body language there is — it is how people decide you are someone worth standing near.' },
            { text: 'Turn fully to the newcomer.', why: 'Now you have abandoned the person you were with. You solved one exclusion by creating another.' },
            { text: 'Step back to make room.', why: 'Better than nothing, but stepping back without turning still reads as a closed pair.' },
          ],
        },
        {
          t: 'concept',
          title: 'Eye contact in beats',
          body: 'Constant eye contact is unnerving; avoiding it reads as shifty. The natural rhythm is roughly 50% while you speak, 70% while you listen, breaking away sideways rather than down. Looking down signals submission; looking sideways just signals thinking.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'When you break eye contact, looking down is better than looking to the side.',
          answer: false,
          why: 'Down reads as shame or submission. Sideways reads as recall. Same break, entirely different message.',
        },
        {
          t: 'order',
          prompt: 'Order these from most to least “settled” in a room.',
          items: [
            'Standing still, weight even, hands loose at your sides',
            'Leaning on a wall with one hand in a pocket',
            'Shifting weight foot to foot, holding a drink at your chest',
            'Pacing while checking your phone',
          ],
        },
      ],
    },

    {
      id: 'ch-3',
      title: 'Voice and pace',
      blurb: 'Slower, lower, with pauses. That is most of it.',
      items: [
        {
          t: 'concept',
          title: 'The pause is the power',
          body: 'Nervous speech is fast, high, and has no gaps — because gaps feel like invitations to be interrupted. Confident speech has gaps. A one-second pause before you answer says “I am considering this”, and it makes everything after it sound more considered.',
          example: { label: 'Try it', line: 'Question → one full second of nothing → answer. It feels enormous to you and normal to everyone else.' },
        },
        {
          t: 'choice',
          prompt: 'You get asked a question in a meeting you have not fully thought through. Best move?',
          options: [
            { text: 'Start talking immediately and figure it out mid-sentence.', why: 'This is where “um”, upspeak and hedging live. You will sound less sure than you actually are.' },
            { text: 'Pause, then say “Let me think about that for a second.”', ok: true, why: 'Buying time out loud is a high-status move. It signals the answer is worth getting right.' },
            { text: 'Say “sorry, I am not sure I am the right person.”', why: 'Pre-emptive shrinking. Often untrue, and it is remembered.' },
            { text: 'Talk quickly and quietly so fewer people notice.', why: 'Everyone notices. Speed and volume drop together is the clearest tell there is.' },
          ],
        },
        {
          t: 'concept',
          title: 'Kill the upward inflection',
          body: 'Ending a statement as if it were a question — “so we should probably ship it?” — hands your authority away for free. Land the ends of sentences flat or slightly down. It is one change and it alters how every sentence is received.',
        },
        {
          t: 'multi',
          prompt: 'Which habits quietly undercut what you are saying?',
          options: [
            { text: '“This might be stupid, but—”', ok: true },
            { text: '“I could be wrong here, obviously—”', ok: true },
            { text: '“I think we should push the deadline.”', ok: false },
            { text: '“Sorry, can I just say something?”', ok: true },
            { text: '“Just a quick thought, no big deal—”', ok: true },
          ],
          why: 'Pre-apologies tell people how much to weight what follows. “I think” is fine — it is honest ownership, not a discount code.',
        },
        {
          t: 'blank',
          prompt: 'Rewrite the hedge.',
          sentence: '“Sorry, this is probably dumb, but maybe we should test it first?” → “___ we test it first.”',
          bank: ['I\'d rather', 'Maybe', 'Sorry, could', 'Do you think'],
          answer: 'I\'d rather',
        },
        {
          t: 'freeform',
          prompt: 'Say it without the hedges.',
          context: 'You want to tell your manager you think the timeline is unrealistic. Write one sentence, no pre-apology.',
          rubric: {
            want: ['timeline', 'deadline', 'weeks', 'realistic', 'think', 'need', 'not', 'more', 'time'],
            avoid: ['sorry', 'stupid', 'dumb', 'just a quick', 'might be wrong'],
            minWords: 6,
            sample: '“I do not think this timeline is realistic — I would want two more weeks, and I can show you where it breaks.”',
          },
        },
      ],
    },

    {
      id: 'ch-4',
      title: 'Undivided attention',
      blurb: 'The rarest thing you can give someone.',
      items: [
        {
          t: 'concept',
          title: 'Presence is a competitive advantage',
          body: 'Almost nobody is fully in the conversation. Most people are partly composing their next line. If you genuinely attend — no phone, no scanning the room, no waiting to talk — you will be described as charismatic by people who cannot explain why.',
          tip: 'The room-scan while someone is mid-sentence is the most damaging half-second in social life.',
        },
        {
          t: 'choice',
          prompt: 'They are telling you something that matters to them. Your phone buzzes. What is the move?',
          options: [
            { text: 'Glance at it quickly — it takes a second.', why: 'They saw it. What they heard was “something else might be more important than you”.' },
            { text: 'Ignore it entirely and do not break eye contact.', ok: true, why: 'The clearest signal available that they have your full attention. It costs you nothing and they will remember it.' },
            { text: 'Say “sorry, one sec” and check.', why: 'More honest than the sneaky glance, still ends the moment they were building.' },
            { text: 'Turn the phone face down while nodding.', why: 'Decent — but doing it mid-sentence still puts a beat of admin into their story.' },
          ],
        },
        {
          t: 'concept',
          title: 'Listen to understand, not to reply',
          body: 'If you are holding a sentence in your head waiting for a gap, you are not listening — you are queuing. Drop the line. You will find another one, and what you say next will actually connect to what they said.',
        },
        {
          t: 'multi',
          prompt: 'Which of these prove you were listening?',
          options: [
            { text: 'Referring back to a detail three minutes later', ok: true },
            { text: 'Asking about the part they skipped over', ok: true },
            { text: 'Saying “totally” at regular intervals', ok: false },
            { text: 'Naming the emotion — “that sounds like it stung”', ok: true },
            { text: 'Nodding continuously', ok: false },
          ],
          why: 'Backchannel noise is easy to fake and everyone knows it. Specific recall and accurate emotional naming cannot be faked.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Repeating back the last few words someone said is a cheap trick that people notice.',
          answer: false,
          why: 'Used sparingly, an echo — “...for eleven years?” — is one of the most effective invitations to continue, and it is nearly invisible. Overused, it becomes a parrot. Once every few minutes is plenty.',
        },
        {
          t: 'freeform',
          prompt: 'Prove you were listening.',
          context: 'Earlier they mentioned, in passing, that they are the one who has to organise their dad\'s care. Now they have finished a long story about work stress.',
          rubric: {
            want: ['dad', 'father', 'care', 'top', 'of', 'everything', 'else', 'also', 'and'],
            avoid: [],
            minWords: 8,
            sample: '“And that is on top of sorting things out for your dad. That is a lot to be holding at once — how are you actually doing?”',
          },
        },
      ],
    },

    {
      id: 'ch-5',
      title: 'Status without arrogance',
      blurb: 'Being impressive without needing to be.',
      items: [
        {
          t: 'concept',
          title: 'Stop bidding for status',
          body: 'The one-up, the humblebrag, the name-drop, the correction nobody needed — these are bids. Bidding signals you are not sure you have it. Not bidding, when you obviously could, signals you do.',
          example: { label: 'The tell', line: 'They mention a hard week. You mention a harder one. That is a bid, and everyone hears it.' },
        },
        {
          t: 'choice',
          prompt: 'Someone tells the group about a small win at work. What is the highest-status response?',
          options: [
            { text: '“Nice — we did something similar but at a much bigger scale.”', why: 'A textbook bid. You just taxed their moment to pay for yours.' },
            { text: '“How did you actually pull that off?”', ok: true, why: 'Giving someone the floor when you could take it is the clearest possible signal that you do not need it.' },
            { text: '“Congrats!” then change the subject.', why: 'Not harmful, but it treats their news as an obstacle to get past.' },
            { text: '“That is basically what I told you to do.”', why: 'Claiming credit in public is the most expensive cheap win available.' },
          ],
        },
        {
          t: 'concept',
          title: 'Give status away',
          body: 'Credit someone publicly, ask their opinion in front of others, quote them back to the room. Handing out status makes you the person who has it to hand out. This is why generous people end up central.',
          tip: '“That was Priya\'s idea, actually” costs you nothing and buys everything.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are status bids in disguise?',
          options: [
            { text: '“I am so exhausted, I have been in back-to-backs since six.”', ok: true },
            { text: '“When I was in Tokyo last month—”', ok: true },
            { text: '“I actually have no idea how that works.”', ok: false },
            { text: '“Well, technically it is not called that.”', ok: true },
            { text: '“Say more about that.”', ok: false },
          ],
          why: 'Busyness, travel and pedantry are the three most common bids in professional settings. Admitting ignorance and inviting elaboration are the opposite move.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Saying “I don\'t know” in a room of experts lowers your standing.',
          answer: false,
          why: 'Said flatly, without apology, it reads as secure. The people who cannot say it are the ones being read as unsure.',
        },
        {
          t: 'freeform',
          prompt: 'Give the status away.',
          context: 'Your manager praises a project in a group meeting. Two other people did significant work on it.',
          rubric: {
            want: ['thanks', 'thank', 'was', 'did', 'their', 'they', 'help', 'built', 'credit', 'team'],
            avoid: ['i alone', 'basically me', 'i did all'],
            minWords: 8,
            sample: '“Thanks — though the part that actually worked was Sam\'s rewrite of the intake flow. I mostly stayed out of the way.”',
          },
        },
      ],
    },
  ],
};
