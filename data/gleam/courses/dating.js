export default {
  id: 'dating',
  title: 'Dating & Flirting',
  subtitle: 'Warm, direct, and not weird about it',
  glyph: 'heart',
  color: '#FF6B7A',
  lessons: [
    {
      id: 'dt-1',
      title: 'Flirting is warmth plus intent',
      blurb: 'What actually separates flirting from friendly.',
      items: [
        {
          t: 'concept',
          title: 'The only real difference',
          body: 'Flirting is friendly conversation with a little signalled interest. Not innuendo, not lines — just warmth with the intent showing. Most people who “cannot flirt” are perfectly warm and simply never let the intent be visible, so they get read as a nice friend.',
          example: { label: 'Same content, intent added', line: '“That is a good film.” → “Okay, that is a great answer. You are doing well here.”' },
        },
        {
          t: 'choice',
          prompt: 'Which line signals interest without being heavy?',
          options: [
            { text: '“You seem cool.”', why: 'Friendly and flat. It could be said to a colleague at a leaving do.' },
            { text: '“I like the way you talk about this stuff. It is very convincing and I am slightly suspicious of it.”', ok: true, why: 'Specific compliment, playful accusation, clear intent. The tease keeps it from being earnest and heavy.' },
            { text: '“You are gorgeous.”', why: 'Too early and about appearance only. It puts them on the spot and says nothing about who they are.' },
            { text: '“So, are you seeing anyone?”', why: 'A status check, not flirting. It reads as an interview question because it is one.' },
          ],
        },
        {
          t: 'concept',
          title: 'Tease, do not flatter',
          body: 'Pure compliments raise them above you and create an audition. A light tease says “I am comfortable here, and I like you enough to be playful”. The safest teases are about harmless choices — their coffee order, their terrible taste in films, their confidence about something trivial.',
          tip: 'Never tease insecurity. Tease a preference.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are safe to tease?',
          options: [
            { text: 'Their aggressively strong opinion about pizza toppings', ok: true },
            { text: 'How competitive they got at mini golf', ok: true },
            { text: 'Their accent', ok: false },
            { text: 'Their claim that they are “very organised”', ok: true },
            { text: 'Something they said they are self-conscious about', ok: false },
          ],
          why: 'Tease things they are proud of or amused by. Anything they flagged as a sore point is off the table permanently.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'The best flirting keeps your interest ambiguous so you never risk rejection.',
          answer: false,
          why: 'Permanent ambiguity is the most common reason nothing happens. Ambiguity is a tool for the first ten minutes, not a strategy for a month.',
        },
        {
          t: 'freeform',
          prompt: 'Add intent.',
          context: 'They just told you, with total conviction, that pineapple belongs on pizza. Reply in a way that is warm, playful and clearly interested.',
          rubric: {
            want: ['pineapple', 'pizza', 'you', 'that', 'wrong', 'okay', 'bold', 'deal', 'breaker', 'hm'],
            avoid: ['gross', 'disgusting you', 'stupid'],
            minWords: 6,
            sample: '“Right, well. That is a very confident thing to say to someone you just met, and annoyingly I think I like you more for it.”',
          },
        },
      ],
    },

    {
      id: 'dt-2',
      title: 'Openers that are not lines',
      blurb: 'Approaching without a script.',
      items: [
        {
          t: 'concept',
          title: 'Say the true thing',
          body: 'The strongest opener is usually just an honest observation about the moment, delivered without apology. Lines fail because they are obviously prepared, which tells the other person you are running a routine rather than talking to them.',
          example: { label: 'Honest and direct', line: '“I have been trying to think of a reason to come over and I do not have one. I am Adam.”' },
        },
        {
          t: 'choice',
          prompt: 'Which approach lands best in a bookshop?',
          options: [
            { text: '“Do you come here often?”', why: 'Recognisably a line. They will answer politely and disengage.' },
            { text: '“Sorry to bother you—”', why: 'Opening with an apology frames yourself as an intrusion. They will treat you as one.' },
            { text: '“Okay, is that any good? I have picked it up twice and put it back.”', ok: true, why: 'True, situational, easy to answer, and it does not demand anything. The interest can show in how you say it.' },
            { text: '“You have great taste in books.”', why: 'A compliment about a thing they have not read yet. It reads as a pretext.' },
          ],
        },
        {
          t: 'concept',
          title: 'Do not apologise for existing',
          body: '“Sorry to bother you”, “this is random but”, “you are probably busy” — every one of these tells them the interaction is a burden before it starts. Drop them all. Warmth plus directness is far less awkward than hedged approaching.',
          tip: 'Replace “sorry to bother you” with nothing at all. Just start.',
        },
        {
          t: 'order',
          prompt: 'Order a low-pressure approach.',
          items: [
            'Comment on the shared situation',
            'Give your name and get theirs',
            'Two or three minutes of actual conversation',
            'Leave or ask for their number while it is still going well',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If someone gives short answers and keeps their body turned away, you should try a different angle.',
          answer: false,
          why: 'That is a no. Reading it as a puzzle to solve is exactly what makes people uncomfortable. Warm exit, no sulking — that is the skill.',
        },
        {
          t: 'multi',
          prompt: 'Which signals mean “wrap this up warmly”?',
          options: [
            { text: 'One-word answers twice in a row', ok: true },
            { text: 'Feet and torso pointed away', ok: true },
            { text: 'They ask you a question back', ok: false },
            { text: 'Headphones going back on', ok: true },
            { text: 'They laugh and lean in', ok: false },
          ],
          why: 'Interest shows up as reciprocation — questions back, leaning in, time given. Its absence is an answer, and respecting it is the whole point.',
        },
      ],
    },

    {
      id: 'dt-3',
      title: 'Reading interest',
      blurb: 'The signals, and how to stop guessing.',
      items: [
        {
          t: 'concept',
          title: 'Reciprocation is the signal',
          body: 'Forget folded arms and hair-touching. The reliable measure is reciprocation: do they ask you things back, do they extend the conversation, do they offer information you did not ask for, do they make plans concrete. Interest costs effort, and effort is visible.',
        },
        {
          t: 'multi',
          prompt: 'Which are genuine signs of interest?',
          options: [
            { text: 'They ask follow-up questions about your answers', ok: true },
            { text: 'They mention their free time unprompted', ok: true },
            { text: 'They are polite and smiling', ok: false },
            { text: 'They make the next plan specific — day, place', ok: true },
            { text: 'They reply to your messages eventually', ok: false },
          ],
          why: 'Politeness and eventual replies are the baseline of being a normal person. Effort, specificity and volunteered information are the actual tell.',
        },
        {
          t: 'concept',
          title: 'Stop decoding, start proposing',
          body: 'The most efficient way to resolve uncertainty is a low-stakes concrete proposal. “There is a place near me that does absurd Sunday breakfast — come with me next weekend?” Their answer will tell you more than an hour of signal analysis.',
          tip: 'Specific beats vague: “we should hang out sometime” is a way of never finding out.',
        },
        {
          t: 'choice',
          prompt: 'You have had two good conversations. What is the strongest next move?',
          options: [
            { text: 'Wait and see if they message first.', why: 'A test they did not agree to take. It usually ends in nothing happening and both people telling themselves a story about it.' },
            { text: '“We should do something sometime.”', why: 'Vague enough that nobody has to act. It feels like progress and is not.' },
            { text: '“There is a market on Saturday I keep meaning to go to — come?”', ok: true, why: 'Specific, easy to say yes or no to, and low-cost for both of you. Clarity is kind.' },
            { text: 'Send three messages in a row to check they are still interested.', why: 'Anxiety made visible. It shifts the dynamic to reassurance-seeking, which is the least attractive frame available.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'A clear “no” is worse than a maybe.',
          answer: false,
          why: 'A no costs you an evening of feeling bad. A maybe can cost you months. Any experienced person will tell you the same thing.',
        },
        {
          t: 'freeform',
          prompt: 'Make it concrete.',
          context: 'Rewrite this into a real invitation: “We should hang out sometime!”',
          rubric: {
            want: ['saturday', 'sunday', 'thursday', 'friday', 'next', 'week', 'weekend', 'come', 'there', 'place', 'you', 'free'],
            avoid: ['sometime', 'someday', 'at some point'],
            minWords: 7,
            sample: '“There is a tiny ramen place near the station I have been meaning to try — are you free Thursday?”',
          },
        },
      ],
    },

    {
      id: 'dt-4',
      title: 'The first date',
      blurb: 'Two hours, one job: find out if you like each other.',
      items: [
        {
          t: 'concept',
          title: 'It is not an interview or an audition',
          body: 'The failure mode is treating the date as a test you must pass. The point is mutual assessment. Going in with “do I actually enjoy this person” as your question relaxes you, makes you more interesting, and stops you performing.',
          tip: 'The goal of a first date is a second date or a clean no. Both are wins.',
        },
        {
          t: 'choice',
          prompt: 'Twenty minutes in, there is a lull and a bit of nerves. Best move?',
          options: [
            { text: 'Run through your prepared list of questions.', why: 'Now it is a job interview with drinks. They will feel processed.' },
            { text: '“I was weirdly nervous about this, which I do not think I have been in a while.”', ok: true, why: 'A small confession resets the register from performance to real. Almost always reciprocated.' },
            { text: 'Talk more to fill the gap.', why: 'Volume as anxiety management. They will remember not being able to get a word in.' },
            { text: 'Check how the night is going by asking “are you having a good time?”', why: 'It hands them an exam paper about your own performance.' },
          ],
        },
        {
          t: 'concept',
          title: 'Ask about the shape of their life',
          body: 'Not their CV — their week. What their days actually look like, what they are avoiding, what they are looking forward to, what they would do with a free Saturday. It is far more revealing than job title and much more fun to answer.',
          example: { label: 'Better question', line: '“What does a good Saturday look like for you when nobody needs anything?”' },
        },
        {
          t: 'multi',
          prompt: 'Which questions actually tell you something?',
          options: [
            { text: '“What are you into at the moment that you would be embarrassed to admit?”', ok: true },
            { text: '“Where did you go to university?”', ok: false },
            { text: '“What is something you have changed your mind about recently?”', ok: true },
            { text: '“What do you do?”', ok: false },
            { text: '“What is your family like?”', ok: true },
          ],
          why: 'Questions about change, taste and relationships reveal a person. Questions about credentials reveal a form.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you are not sure, you should say “I will text you” and then not.',
          answer: false,
          why: 'The soft fade is the most common unkindness in dating. “I had a nice time but I do not think we are a match” takes ten seconds and treats them like an adult.',
        },
        {
          t: 'freeform',
          prompt: 'Close it well.',
          context: 'You genuinely enjoyed the date and want to see them again. You are about to say goodbye. Write what you say.',
          rubric: {
            want: ['again', 'next', 'week', 'this', 'was', 'good', 'fun', 'enjoyed', 'you', 'want', 'like'],
            avoid: ['sometime', 'maybe we could possibly'],
            minWords: 8,
            sample: '“I really enjoyed this — more than I expected to, which sounds worse than I meant it. I want to do it again. Are you free next week?”',
          },
        },
      ],
    },

    {
      id: 'dt-5',
      title: 'Rejection without collapse',
      blurb: 'The skill that makes all the others possible.',
      items: [
        {
          t: 'concept',
          title: 'A no is information, not a verdict',
          body: 'A rejection tells you about the fit between two people at one moment. It is not a ruling on your worth, and treating it as one is what makes people stop trying. The people who date well are not rejected less — they recover faster.',
        },
        {
          t: 'choice',
          prompt: 'They say they are not interested. What is the best response?',
          options: [
            { text: '“No worries at all — it was good to meet you. Take care.”', ok: true, why: 'Warm, brief, and it leaves both of you with dignity. This is the whole answer.' },
            { text: '“Can I ask why?”', why: 'It puts them in the position of justifying a feeling, and no answer will make you feel better.' },
            { text: '“Yeah, I was not that into it either.”', why: 'A face-saving lie that both of you can hear. It costs more than it saves.' },
            { text: '“Okay but what if we just—”', why: 'Negotiating a no is the fastest way to turn a small disappointment into a bad memory of you.' },
          ],
        },
        {
          t: 'concept',
          title: 'Rejection sensitivity is trainable',
          body: 'The sting is real and it is also shorter than you predict. Research on affective forecasting is consistent: we badly overestimate how long negative events will affect us. Knowing that does not remove the sting, but it stops you organising your life around avoiding it.',
          tip: 'Ask yourself: will this matter in a week? Almost always the honest answer is no.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Getting rejected more often is a sign you are doing something wrong.',
          answer: false,
          why: 'It is usually a sign you are actually asking. Zero rejections generally means zero attempts, which is the only outcome guaranteed to go nowhere.',
        },
        {
          t: 'multi',
          prompt: 'Which are healthy ways to process a no?',
          options: [
            { text: 'Note one thing you would do differently, then stop analysing', ok: true },
            { text: 'Tell a friend and let it be a bit funny', ok: true },
            { text: 'Re-read the conversation looking for the exact mistake', ok: false },
            { text: 'Accept that fit is mostly not about quality', ok: true },
            { text: 'Decide to stop trying for a while to be safe', ok: false },
          ],
          why: 'One lesson and a laugh is processing. Forensic re-reading and withdrawal are avoidance wearing a serious face.',
        },
        {
          t: 'freeform',
          prompt: 'Write the graceful reply.',
          context: 'After two good dates, they message: “I have had a really nice time but I do not think I am feeling a romantic connection.”',
          rubric: {
            want: ['thanks', 'thank', 'you', 'telling', 'me', 'appreciate', 'honest', 'good', 'luck', 'nice', 'enjoyed'],
            avoid: ['why', 'what did i', 'can we still', 'but'],
            minWords: 8,
            sample: '“Thanks for saying it straight — genuinely, I appreciate that. I enjoyed both evenings. All the best.”',
          },
        },
      ],
    },
  ],
};
