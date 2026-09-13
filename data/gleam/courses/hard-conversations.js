export default {
  id: 'hard-conversations',
  title: 'Hard Conversations',
  subtitle: 'No, boundaries, disagreement, repair',
  glyph: 'shield',
  color: '#63C6F5',
  lessons: [
    {
      id: 'hc-1',
      title: 'Saying no',
      blurb: 'Short, warm, and without a paragraph of excuses.',
      items: [
        {
          t: 'concept',
          title: 'A reason, not a case',
          body: 'Over-explaining a no invites negotiation, because every reason you give is a problem they can offer to solve. One sentence of warmth, one clear no, one optional reason. Then stop talking.',
          example: { label: 'The shape', line: '“I would love to, but I cannot take that on this month. Ask me again in November?”' },
        },
        {
          t: 'choice',
          prompt: 'A colleague asks you to take on extra work you do not have room for. Best reply?',
          options: [
            { text: '“I mean, I am pretty slammed, but if nobody else can, I guess I could try to...”', why: 'That is a yes wearing a no\'s coat. You will do the work and resent it.' },
            { text: '“I cannot take this on right now. I am at capacity with the migration until the 20th.”', ok: true, why: 'Clear, specific, no apology spiral, and the reason is a fact rather than a plea.' },
            { text: '“Sorry, sorry — I am so bad at this — it is just that I have so much on and my manager said, and honestly things at home are...”', why: 'Every clause is a hook for negotiation, and it hands them your personal life as leverage.' },
            { text: '“No.”', why: 'Clear, but coldness costs you relationship you did not need to spend. Add the warmth back.' },
          ],
        },
        {
          t: 'concept',
          title: 'Say no to the task, yes to the person',
          body: 'Separate the refusal from the relationship. “I cannot do this one — but send me the next one” keeps the warmth while holding the line. People remember whether they felt rejected, not whether they got the yes.',
          tip: 'A no with a door in it is remembered as helpfulness.',
        },
        {
          t: 'multi',
          prompt: 'Which are clean nos?',
          options: [
            { text: '“That does not work for me, but thank you for asking.”', ok: true },
            { text: '“Let me think about it.” (when you already know)', ok: false },
            { text: '“I cannot commit to that. I can do X instead if it helps.”', ok: true },
            { text: '“Maybe? Probably not. We will see.”', ok: false },
            { text: '“No — but genuinely, ask me again next quarter.”', ok: true },
          ],
          why: 'Clean means unambiguous and warm. Deferring a decision you have already made is just a slower no with more anxiety attached.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'A no that arrives quickly is kinder than one that arrives after a week of avoidance.',
          answer: true,
          why: 'Speed is a form of respect. The week you spend avoiding it is a week they cannot plan around.',
        },
        {
          t: 'freeform',
          prompt: 'Say no.',
          context: 'A friend asks you to help them move house on Saturday. You do not want to and you have no real excuse.',
          rubric: {
            want: ['cannot', 'can\'t', 'not', 'able', 'sorry', 'saturday', 'weekend', 'help', 'good', 'luck', 'hope'],
            avoid: ['maybe', 'we will see', 'let me check and'],
            minWords: 8,
            sample: '“I am going to sit this one out — I need the weekend. Sorry to be useless. Let me buy you dinner once you are in.”',
          },
        },
      ],
    },

    {
      id: 'hc-2',
      title: 'Boundaries that hold',
      blurb: 'State the line once, then keep it.',
      items: [
        {
          t: 'concept',
          title: 'A boundary is about you, not them',
          body: 'A boundary describes what you will do, not what they must do. “Stop messaging me at midnight” is a demand they can ignore. “I turn my phone off at ten, so I will reply in the morning” is a fact about your behaviour that requires nothing from them.',
          example: { label: 'Reframe', line: '“You have to stop asking me for money.” → “I am not lending money any more — it is not good for us.”' },
        },
        {
          t: 'choice',
          prompt: 'Which is a real boundary?',
          options: [
            { text: '“You need to stop calling me so late.”', why: 'A request. It is fine, but it depends entirely on their cooperation.' },
            { text: '“I do not answer calls after nine. I will always call back the next day.”', ok: true, why: 'It describes your behaviour, so you can hold it alone. It also tells them what they will get, which removes the sting.' },
            { text: '“It is fine, I am just tired.”', why: 'No boundary at all — just a hint that will be missed.' },
            { text: '“If you call me late again, I am done.”', why: 'A threat, not a boundary. It escalates the stakes rather than defining your behaviour.' },
          ],
        },
        {
          t: 'concept',
          title: 'The test comes after',
          body: 'People test a new boundary once, usually not maliciously — the old pattern is just automatic. Holding it calmly the first time is what makes it real. Explaining it again at length is what makes it negotiable.',
          tip: 'Second time: repeat the same sentence, same tone, no extra reasons. Repetition beats justification.',
        },
        {
          t: 'order',
          prompt: 'Order the boundary sequence.',
          items: [
            'State it once, plainly, describing your behaviour',
            'They test it, probably without meaning to',
            'Repeat the identical sentence, calmly, no new reasons',
            'Follow through in your actions',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If someone reacts badly to a reasonable boundary, you should soften it.',
          answer: false,
          why: 'Discomfort is the expected first reaction to a changed pattern, not evidence the boundary was wrong. Stay warm, stay put. Softening teaches that pushback works.',
        },
        {
          t: 'freeform',
          prompt: 'Write the boundary.',
          context: 'A relative keeps commenting on your weight at family gatherings.',
          rubric: {
            want: ['i', 'not', 'don\'t', 'do', 'discuss', 'talk', 'about', 'my', 'body', 'weight', 'change', 'subject', 'leave'],
            avoid: ['you always', 'you never', 'how dare'],
            minWords: 8,
            sample: '“I do not talk about my body at dinner. If it comes up again I will just change the subject — nothing personal.”',
          },
        },
      ],
    },

    {
      id: 'hc-3',
      title: 'Disagreeing well',
      blurb: 'Hold your position without making an enemy.',
      items: [
        {
          t: 'concept',
          title: 'Steelman first',
          body: 'Before you disagree, say their argument back in its strongest form. “So the case is that shipping now beats shipping right, because the window closes in March.” Now they know you understood, and the disagreement is about the idea rather than about being heard.',
          tip: 'Nobody changes their mind while they are still trying to be understood.',
        },
        {
          t: 'choice',
          prompt: 'Which opening makes disagreement productive?',
          options: [
            { text: '“I disagree completely.”', why: 'It sets up a contest. Positions harden within one exchange.' },
            { text: '“So your argument is that speed matters more than polish here. I get it — I just weigh the risk differently.”', ok: true, why: 'Steelman, then a difference in weighting rather than a difference in intelligence. Almost nobody gets defensive at this.' },
            { text: '“With respect, that is not how it works.”', why: '“With respect” reliably signals its opposite, and “that is not how it works” is a status move.' },
            { text: '“Sure, whatever you think.”', why: 'Fake agreement. It postpones the disagreement to a worse moment.' },
          ],
        },
        {
          t: 'concept',
          title: 'Separate the person from the position',
          body: 'Attack the argument, never the arguer, and never their motives. “I think that estimate is optimistic” is workable. “You are always optimistic” is a character claim, and people defend their character far harder than their spreadsheets.',
        },
        {
          t: 'multi',
          prompt: 'Which phrases keep a disagreement workable?',
          options: [
            { text: '“What am I missing?”', ok: true },
            { text: '“Help me understand the reasoning.”', ok: true },
            { text: '“You always do this.”', ok: false },
            { text: '“I might be wrong, but here is where I get stuck.”', ok: true },
            { text: '“Anyone who thinks that has not read the data.”', ok: false },
          ],
          why: 'Curiosity keeps the door open. Character claims and contempt close it, usually permanently.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Conceding a point mid-argument weakens your position.',
          answer: false,
          why: 'It does the opposite. Granting a real point proves you are evaluating rather than defending, and it makes your remaining points more credible.',
        },
        {
          t: 'freeform',
          prompt: 'Disagree well.',
          context: 'Your manager wants to cut testing to hit a date. You think that is a mistake. Write your opening.',
          rubric: {
            want: ['understand', 'get', 'see', 'date', 'deadline', 'matters', 'risk', 'think', 'worry', 'concerned', 'testing'],
            avoid: ['you always', 'that is stupid', 'obviously wrong'],
            minWords: 12,
            sample: '“I get why the date matters — missing it costs us the quarter. My worry is that the bug we ship costs us more than the week we save. Can I show you the two scenarios?”',
          },
        },
      ],
    },

    {
      id: 'hc-4',
      title: 'Taking criticism',
      blurb: 'The two seconds that decide everything.',
      items: [
        {
          t: 'concept',
          title: 'Your first reaction is the whole game',
          body: 'People decide whether you are safe to be honest with in the two seconds after they criticise you. Defend once and they will stop telling you things — permanently, and without announcing it.',
          tip: 'Buy the two seconds. Breathe, then say “okay, say more.”',
        },
        {
          t: 'choice',
          prompt: 'Someone says your presentation was hard to follow. Best first response?',
          options: [
            { text: '“Well, it was a complicated topic.”', why: 'Defence in eight words. They will not offer feedback again.' },
            { text: '“Which part lost you?”', ok: true, why: 'It converts a vague criticism into something usable and signals that you can hear it. It also gets you the real information.' },
            { text: '“Sorry, I am terrible at presenting.”', why: 'Self-attack. Now they have to comfort you, which is a punishment for honesty.' },
            { text: '“Did other people say that?”', why: 'You are auditing their standing rather than the content.' },
          ],
        },
        {
          t: 'concept',
          title: 'Separate the signal from the delivery',
          body: 'Badly delivered criticism can still be true. If you dismiss the content because the tone was poor, you protect your feelings and lose the information. Note the delivery, act on the signal — and if the delivery keeps being bad, raise that separately.',
        },
        {
          t: 'order',
          prompt: 'Order a good response to criticism.',
          items: [
            'Pause instead of replying immediately',
            'Ask a question that makes it specific',
            'Say back what you understood',
            'Say what you will do, or that you need to think',
          ],
        },
        {
          t: 'multi',
          prompt: 'Which responses keep people honest with you?',
          options: [
            { text: '“That is useful — thank you for saying it.”', ok: true },
            { text: '“Can you give me an example?”', ok: true },
            { text: '“I hear you, but you have to understand—”', ok: false },
            { text: '“Let me sit with that and come back to you.”', ok: true },
            { text: '“Everyone else seemed fine with it.”', ok: false },
          ],
          why: 'Gratitude, specificity and time are all fine. “But” and appeals to the crowd are defence.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'You should accept every piece of criticism you receive.',
          answer: false,
          why: 'You should receive it well and evaluate it honestly. Receiving is not agreeing — “thanks, I have thought about it and I disagree” is a complete and respectable answer.',
        },
      ],
    },

    {
      id: 'hc-5',
      title: 'Repair',
      blurb: 'The apology that actually works.',
      items: [
        {
          t: 'concept',
          title: 'Four parts, no “but”',
          body: 'A real apology: name what you did, name the effect, no excuse, say what changes. “I cut you off in front of the team. That was undermining. I should have raised it privately — I will.”  Everything after a “but” deletes everything before it.',
          example: { label: 'The killer word', line: '“I am sorry I snapped, but you were being difficult.” → not an apology.' },
        },
        {
          t: 'order',
          prompt: 'Order the four parts.',
          items: [
            'Name specifically what you did',
            'Name the effect it had on them',
            'No excuse and no “but”',
            'Say what you will do differently',
          ],
        },
        {
          t: 'choice',
          prompt: 'Which is a real apology?',
          options: [
            { text: '“I am sorry you felt that way.”', why: 'The classic non-apology. It relocates the problem into their feelings.' },
            { text: '“I am sorry if I upset anyone.”', why: '“If” makes the harm hypothetical and “anyone” makes it nobody.' },
            { text: '“I dismissed your idea in the meeting without hearing it. That was unfair, and I would be annoyed too. I will bring it back on Monday and credit it properly.”', ok: true, why: 'Specific act, named effect, no excuse, concrete repair. This is the whole recipe.' },
            { text: '“Look, we both said things.”', why: 'A negotiated draw, not an apology.' },
          ],
        },
        {
          t: 'concept',
          title: 'Repair beats never rupturing',
          body: 'Relationship research is consistent on this: what predicts strength is not the absence of conflict but the presence of repair. A rupture that gets repaired well leaves the relationship stronger than it was — which means getting it wrong is survivable, and often useful.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you apologise and they are still angry, the apology failed.',
          answer: false,
          why: 'An apology is not a transaction that buys immediate forgiveness. Say it once, properly, and then let them have their timeline. Pressing for absolution makes it about you again.',
        },
        {
          t: 'freeform',
          prompt: 'Write the apology.',
          context: 'You forgot a friend\'s birthday completely. They mentioned it, lightly, two days later.',
          rubric: {
            want: ['sorry', 'forgot', 'your', 'birthday', 'i', 'will', 'no', 'excuse', 'make', 'up', 'calendar'],
            avoid: ['but', 'been so busy', 'you know how'],
            minWords: 10,
            sample: '“I completely forgot your birthday and there is no version of that which is okay. I am sorry — I know you would not have forgotten mine. It is in my calendar now. Let me take you out this week.”',
          },
        },
      ],
    },
  ],
};
