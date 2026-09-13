export default {
  id: 'reading-people',
  title: 'Reading People',
  subtitle: 'Listening, empathy, and what is not being said',
  glyph: 'target',
  color: '#4FD8A8',
  lessons: [
    {
      id: 'rp-1',
      title: 'Listening that shows',
      blurb: 'Internal listening is invisible. Make it visible.',
      items: [
        {
          t: 'concept',
          title: 'Three levels of listening',
          body: 'Level 1: you are listening to how it relates to you. Level 2: you are listening to them. Level 3: you are listening to what they are not saying — tone, hesitation, the thing they circled twice. Most conversation happens at Level 1 and everyone can feel it.',
          example: { label: 'Level 1 tell', line: '“That reminds me of when I—”' },
        },
        {
          t: 'choice',
          prompt: 'They describe a hard week. Which reply is Level 2 or better?',
          options: [
            { text: '“Ugh, I know exactly what you mean, last month I—”', why: 'Level 1. The story became about you in nine words.' },
            { text: '“That is a lot. Which bit is actually weighing on you most?”', ok: true, why: 'It stays with them and asks them to locate the real thing, which is often not the first thing they said.' },
            { text: '“You should talk to your manager.”', why: 'Solving. It skips over how they feel to fix what you decided the problem is.' },
            { text: '“At least it is Friday!”', why: 'Cheering up is a way of asking them to stop.' },
          ],
        },
        {
          t: 'concept',
          title: 'Reflect before you respond',
          body: 'Say back what you heard in your own words before adding anything. “So it is less the workload and more that nobody noticed.” When you get it right, people visibly relax. When you get it slightly wrong, they correct you — which is just as useful.',
          tip: 'This is the highest-leverage listening habit there is, and almost nobody does it.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are reflections rather than replies?',
          options: [
            { text: '“So the deadline is not really the problem.”', ok: true },
            { text: '“That sounds like it felt unfair.”', ok: true },
            { text: '“Have you tried talking to HR?”', ok: false },
            { text: '“You are more annoyed about being left out than about the work.”', ok: true },
            { text: '“Same thing happened to me.”', ok: false },
          ],
          why: 'A reflection restates their experience. Advice and comparison move the spotlight.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'When someone shares a problem, the helpful default is to offer solutions.',
          answer: false,
          why: 'Most people want to be understood first, and many want only that. Ask: “do you want thoughts, or do you just want to say it out loud?” It is the most useful question in this course.',
        },
        {
          t: 'freeform',
          prompt: 'Reflect it back.',
          context: 'They say: “It is fine, honestly. I just did not expect them to announce it in the meeting without telling me first.”',
          rubric: {
            want: ['not', 'the', 'it', 'more', 'about', 'blindsided', 'told', 'first', 'heads', 'up', 'surprise', 'front'],
            avoid: ['you should', 'at least', 'try'],
            minWords: 6,
            sample: '“So it is not the decision itself — it is finding out in front of everyone else.”',
          },
        },
      ],
    },

    {
      id: 'rp-2',
      title: 'What the body is doing',
      blurb: 'Reading signals honestly, without pop psychology.',
      items: [
        {
          t: 'concept',
          title: 'Clusters, not single tells',
          body: 'One crossed arm means nothing — they might be cold. What matters is a cluster of signals that all changed at the same moment. The question is never “what does this gesture mean” but “what changed, and what did I just say?”',
          tip: 'Baseline first. You cannot read a change if you never noticed the normal.',
        },
        {
          t: 'choice',
          prompt: 'Mid-conversation they fold their arms, look away and their answers get shorter. What is the best read?',
          options: [
            { text: 'They are lying.', why: 'Popular myth. There is no reliable body-language signature for deception, and believing there is makes you confidently wrong.' },
            { text: 'Something in the last minute made them uncomfortable.', ok: true, why: 'A cluster that changed at once points to the moment, not the person. Back up and soften.' },
            { text: 'They are closed-off people generally.', why: 'You are reading a trait from a moment.' },
            { text: 'They are bored and you should change the subject entirely.', why: 'Possible, but jumping topics abandons whatever just happened rather than repairing it.' },
          ],
        },
        {
          t: 'concept',
          title: 'Feet and torso point at what people want',
          body: 'Of all the signals, orientation is the most honest. If their torso stays turned to you they are in it; if their feet have angled toward the door, the conversation has ended for them even if they are still being polite.',
        },
        {
          t: 'multi',
          prompt: 'Which are genuinely useful signals?',
          options: [
            { text: 'A sudden change in how much they move', ok: true },
            { text: 'Torso and feet orientation', ok: true },
            { text: 'Touching the nose (classic “lying” tell)', ok: false },
            { text: 'A pause before an answer that was easy before', ok: true },
            { text: 'Arms crossed on their own', ok: false },
          ],
          why: 'Changes and orientation are informative. Isolated gestures and folklore tells are noise that feels like signal.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If someone mirrors your posture, it usually means they are comfortable with you.',
          answer: true,
          why: 'Unconscious mirroring tracks rapport reasonably well. Deliberate mirroring, done obviously, does the opposite — people notice and it reads as strange.',
        },
        {
          t: 'freeform',
          prompt: 'Repair the moment.',
          context: 'You asked about their family and they visibly closed up. Write your next line.',
          rubric: {
            want: ['sorry', 'we', 'do', 'not', 'have', 'to', 'change', 'anyway', 'talk', 'about', 'something', 'else', 'ignore'],
            avoid: ['what happened', 'why', 'tell me more about your family'],
            minWords: 5,
            sample: '“We can leave that one — I did not mean to poke at anything. Tell me about the new place instead.”',
          },
        },
      ],
    },

    {
      id: 'rp-3',
      title: 'Empathy that helps',
      blurb: 'Validation, and why “at least” ruins it.',
      items: [
        {
          t: 'concept',
          title: 'Never start with “at least”',
          body: '“At least you still have a job.” “At least it was not worse.” Every “at least” is an argument that they should feel better than they do. It is silver lining as dismissal, and people remember it as not being heard.',
          example: { label: 'Replace it', line: 'Not “at least it is over” → “that sounds genuinely awful. I am sorry.”' },
        },
        {
          t: 'multi',
          prompt: 'Which responses validate rather than dismiss?',
          options: [
            { text: '“That would have really got to me too.”', ok: true },
            { text: '“At least you learned something.”', ok: false },
            { text: '“No wonder you are upset.”', ok: true },
            { text: '“Other people have it worse though.”', ok: false },
            { text: '“I would be furious.”', ok: true },
          ],
          why: 'Validation says “your reaction makes sense”. Comparison and silver linings say “your reaction is too big”.',
        },
        {
          t: 'concept',
          title: 'Name the feeling, tentatively',
          body: 'Naming an emotion accurately is enormously calming — but name it as a guess, not a diagnosis. “That sounds humiliating, is that right?” leaves them room to correct you, which is the point. “You are clearly furious” tells them what they feel.',
          tip: 'Guess with a question mark. Always.',
        },
        {
          t: 'choice',
          prompt: 'A friend is spiralling about a mistake at work. What is most useful first?',
          options: [
            { text: '“Honestly, nobody will even remember this next week.”', why: 'Probably true, and it lands as “your feeling is silly”. Reassurance before validation always bounces.' },
            { text: '“Okay. Tell me what happened, properly.”', ok: true, why: 'Space first. Let them get it out before anyone tries to resize it.' },
            { text: '“Here is what you do—”', why: 'You are three steps ahead of where they are.' },
            { text: '“You always do this.”', why: 'A pattern observation during distress is a criticism, whatever it is meant as.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Asking “do you want advice or do you just want to vent?” is a cop-out.',
          answer: false,
          why: 'It is the single most useful sentence in supportive conversation. It prevents the most common failure — solving when they wanted witnessing.',
        },
        {
          t: 'order',
          prompt: 'Order the support sequence.',
          items: [
            'Let them say the whole thing',
            'Reflect what you heard',
            'Name the feeling as a guess',
            'Ask whether they want thoughts or company',
          ],
        },
      ],
    },

    {
      id: 'rp-4',
      title: 'Names and details',
      blurb: 'The memory tricks that make people feel known.',
      items: [
        {
          t: 'concept',
          title: 'You do not have a bad memory for names',
          body: 'You have a bad habit of not listening during the introduction, because you are busy being nervous. The fix is entirely at the point of hearing: pause, actually take the name in, and say it back once.',
          example: { label: 'Say it back', line: '“Priya — good to meet you, Priya.”' },
        },
        {
          t: 'order',
          prompt: 'Order the name-remembering sequence.',
          items: [
            'Actually listen during the introduction instead of preparing your reply',
            'Repeat it back immediately in your reply',
            'Attach it to something visual or absurd about them',
            'Use it once more before the conversation ends',
          ],
        },
        {
          t: 'choice',
          prompt: 'You have forgotten their name and you are five minutes in. Best move?',
          options: [
            { text: 'Avoid ever addressing them directly.', why: 'Sustainable for ten minutes and exhausting after that. It also leaks — people notice the swerve.' },
            { text: '“I am so sorry, your name has completely gone.”', ok: true, why: 'Fast, honest, universally forgiven. The awkwardness lasts two seconds; the avoidance lasts all night.' },
            { text: 'Introduce them to someone else and hope they say it.', why: 'The classic manoeuvre. Works about half the time and fails visibly the other half.' },
            { text: 'Call them “mate” for the rest of the evening.', why: 'A long-term commitment to a short-term problem.' },
          ],
        },
        {
          t: 'concept',
          title: 'Keep a mental file',
          body: 'Charismatic people are not remembering effortlessly — many keep actual notes. One detail per person: their dog, the exam, the move. Opening the next conversation with “how did the exam go?” is worth more than an hour of general charm.',
          tip: 'A note in your phone is not cheating. It is caring, with a system.',
        },
        {
          t: 'multi',
          prompt: 'Which details are worth storing?',
          options: [
            { text: 'A thing they are worried about that resolves soon', ok: true },
            { text: 'Names of their kids or pets', ok: true },
            { text: 'Their exact job title', ok: false },
            { text: 'The show they said they were halfway through', ok: true },
            { text: 'A strong opinion they enjoyed defending', ok: true },
          ],
          why: 'Store things that will have moved on by next time — those create natural openings. Job titles are just facts.',
        },
        {
          t: 'freeform',
          prompt: 'Open with the detail.',
          context: 'Three weeks ago, Marcus told you he was nervous about his daughter starting school. You have just run into him.',
          rubric: {
            want: ['marcus', 'daughter', 'school', 'how', 'did', 'go', 'start', 'settling', 'first', 'week'],
            avoid: [],
            minWords: 5,
            sample: '“Marcus — how did the first week of school go? You were dreading it more than she was.”',
          },
        },
      ],
    },

    {
      id: 'rp-5',
      title: 'Subtext',
      blurb: 'Hearing the thing underneath the thing.',
      items: [
        {
          t: 'concept',
          title: 'People rarely lead with the real thing',
          body: 'The first complaint is usually a proxy. Someone annoyed about a meeting time is often annoyed about not being consulted. Listen for what would have to be true for their reaction to make sense — that is usually the actual topic.',
        },
        {
          t: 'choice',
          prompt: 'Your partner says, flatly: “It is fine, do whatever you want.” What is the useful read?',
          options: [
            { text: 'Take it literally and do what you want.', why: 'Technically permitted. Everyone knows how this ends.' },
            { text: 'Hear the mismatch between words and tone, and ask about it gently.', ok: true, why: 'When words and tone disagree, tone is the message. Naming the gap kindly is how you get to the real conversation.' },
            { text: 'Point out that they said it was fine.', why: 'Winning the transcript, losing the evening.' },
            { text: 'Cancel your plans without saying anything.', why: 'Silent resentment banking. It resolves nothing and collects interest.' },
          ],
        },
        {
          t: 'concept',
          title: 'Name the gap, gently',
          body: 'When words and tone disagree, say so without accusation: “You are saying it is fine but it does not quite sound fine — am I reading that wrong?” The escape hatch at the end matters. It gives them a way to answer that is not a confession.',
        },
        {
          t: 'multi',
          prompt: 'Which phrases are usually carrying something underneath?',
          options: [
            { text: '“It is not a big deal.”', ok: true },
            { text: '“I am not annoyed.”', ok: true },
            { text: '“Yes, I would love to come.”', ok: false },
            { text: '“Whatever you think is best.”', ok: true },
            { text: '“No, go ahead.”', ok: true },
          ],
          why: 'Pre-emptive minimising and total deference are the two most common wrappers for an unspoken objection.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you sense subtext, you should always name it immediately.',
          answer: false,
          why: 'Timing and audience matter enormously. Naming someone\'s hidden feeling in front of a group is exposure, not insight. In private, gently, is the rule.',
        },
        {
          t: 'freeform',
          prompt: 'Name the gap.',
          context: 'A colleague says brightly: “No no, it is totally fine that they gave it to Sam. Makes sense. Sam is great.”',
          rubric: {
            want: ['you', 'sound', 'seem', 'okay', 'really', 'that', 'is', 'wanted', 'it', 'wrong', 'if', 'reading'],
            avoid: ['you are clearly', 'obviously you', 'admit'],
            minWords: 6,
            sample: '“You are saying all the right words in a voice that does not match them. Did you want that one?”',
          },
        },
      ],
    },
  ],
};
