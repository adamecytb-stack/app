export default {
  id: 'conversation-flow',
  title: 'Conversation Flow',
  subtitle: 'Get past the first two minutes',
  glyph: 'compass',
  color: '#63C6F5',
  lessons: [
    {
      id: 'cf-1',
      title: 'Threading',
      blurb: 'Every sentence they say hands you three places to go.',
      items: [
        {
          t: 'concept',
          title: 'Pull the thread',
          body: 'Any sentence contains several threads — a place, a person, an emotion, an oddity. Fluent conversationalists are not inventing topics from nothing. They are picking one thread out of what was just said and pulling.',
          example: { label: 'Threads in one line', line: '“I got back from my sister\'s wedding in Lisbon on Tuesday and I am wrecked.” → sister · wedding · Lisbon · wrecked' },
        },
        {
          t: 'multi',
          prompt: '“I moved here from Manchester after my band broke up.” Which threads are worth pulling?',
          options: [
            { text: 'The band', ok: true },
            { text: 'Manchester', ok: true },
            { text: 'What “broke up” means here', ok: true },
            { text: 'The word “after”', ok: false },
            { text: 'Whether they own a car', ok: false },
          ],
          why: 'Pull the thread with the most life in it. “The band broke up” is loaded with story; grammar and unrelated logistics are not.',
        },
        {
          t: 'choice',
          prompt: 'They say: “Work is fine. I mostly just want to get through to March.” Best response?',
          options: [
            { text: '“What happens in March?”', ok: true, why: 'The strangest word in the sentence is “March”. Go straight at it — that is where the real topic is hiding.' },
            { text: '“Yeah, work is rough for everyone.”', why: 'Generalising away from what they said. It moves the conversation from them to nobody.' },
            { text: '“What do you do again?”', why: 'You just walked past the interesting thing to ask a form question.' },
            { text: '“Same.”', why: 'Fine as a first beat, fatal as the whole response.' },
          ],
        },
        {
          t: 'concept',
          title: 'The odd word is the door',
          body: 'When someone uses a word you did not expect — “wrecked”, “finally”, “again”, “March” — that word is where their feeling is. Ask about that, not the sensible part of the sentence.',
          tip: 'If you only remember one thing: ask about the weird word.',
        },
        {
          t: 'blank',
          prompt: 'They said: “I finally quit that job.” Which word is the door?',
          sentence: 'The word to ask about is “___”.',
          bank: ['finally', 'that', 'job', 'quit'],
          answer: 'finally',
        },
        {
          t: 'freeform',
          prompt: 'Pull a thread.',
          context: 'They say: “I have not really cooked since I moved in with my brother.”',
          rubric: {
            want: ['brother', 'cook', 'cooking', 'why', 'what', 'how', 'move', 'moved'],
            avoid: [],
            minWords: 4,
            sample: '“Wait — is your brother a monster in the kitchen, or did you just give up the second someone else could do it?”',
          },
        },
      ],
    },

    {
      id: 'cf-2',
      title: 'Three levels deep',
      blurb: 'Facts, opinions, feelings — and how to move down a level.',
      items: [
        {
          t: 'concept',
          title: 'The three levels',
          body: 'Level 1 is facts: what, where, when. Level 2 is opinions: what you think about it. Level 3 is feelings and reasons: why it matters to you. Small talk that never leaves Level 1 is what people mean when they say they hate small talk.',
          example: { label: 'The same topic, three levels', line: '“I moved in March.” → “The move was the right call.” → “I was more scared of staying than of leaving.”' },
        },
        {
          t: 'match',
          prompt: 'Match each line to its level.',
          pairs: [
            ['“I work in logistics.”', 'Level 1 — fact'],
            ['“Honestly, logistics is more interesting than it sounds.”', 'Level 2 — opinion'],
            ['“I took it because I was terrified of being broke again.”', 'Level 3 — feeling'],
            ['“It is a forty minute commute.”', 'Level 1 — fact'],
          ],
        },
        {
          t: 'choice',
          prompt: 'They just gave you a Level 1 fact: “I have two kids, 6 and 9.” How do you go a level down?',
          options: [
            { text: '“What schools do they go to?”', why: 'Another fact. You are now collecting data about a stranger, which feels like a form.' },
            { text: '“What has surprised you most about it?”', ok: true, why: 'Straight to opinion, and it asks for their experience rather than their logistics.' },
            { text: '“Nice, I have a niece who is 7.”', why: 'Not wrong — but it takes the floor before they got to say anything real.' },
            { text: '“Two is a lot!”', why: 'A closed comment. They can only agree.' },
          ],
        },
        {
          t: 'concept',
          title: 'Go down one level, not three',
          body: 'Depth is a staircase, not a trapdoor. Answer a fact with an opinion, an opinion with a feeling. Skipping straight from “nice weather” to “do you fear death” is how you get remembered for the wrong reason.',
          tip: 'Match their depth, then go one step further. Let them follow.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'You should wait for the other person to get personal first.',
          answer: false,
          why: 'Someone has to go first, and whoever does sets the depth. Going one small step deeper is the single most reliable way to turn a polite exchange into a real one.',
        },
        {
          t: 'freeform',
          prompt: 'Take it one level down.',
          context: 'They said: “I have been at the same company for eleven years.”',
          rubric: {
            want: ['eleven', '11', 'years', 'stay', 'stayed', 'keep', 'why', 'what', 'feel', 'like'],
            avoid: [],
            minWords: 5,
            sample: '“Eleven years is a long time to keep choosing the same place. What keeps you there — is it the work, or the people?”',
          },
        },
      ],
    },

    {
      id: 'cf-3',
      title: 'Statements beat questions',
      blurb: 'Stop interviewing. Start talking.',
      items: [
        {
          t: 'concept',
          title: 'The interview trap',
          body: 'Question, answer, question, answer. It feels safe because you are always in control, and it feels awful because the other person is doing all the work and getting nothing back. A statement gives them something to react to instead of something to complete.',
          example: { label: 'Statement as invitation', line: 'Not “Do you like living here?” → “You seem like you actually like it here. Most people I meet are halfway to leaving.”' },
        },
        {
          t: 'choice',
          prompt: 'They mention they run marathons. Which reply builds the most rapport?',
          options: [
            { text: '“How many have you done?”', why: 'Another data point. You are three questions into an interview.' },
            { text: '“I could not run to the end of my road. I find the whole thing genuinely baffling.”', ok: true, why: 'A statement with a bit of self-deprecation. It gives them something to push back on, and pushing back is fun.' },
            { text: '“That\'s impressive.”', why: 'A compliment that closes. There is nowhere to go after “thanks”.' },
            { text: '“What\'s your time?”', why: 'A test. Now they are being assessed.' },
          ],
        },
        {
          t: 'concept',
          title: 'The guess',
          body: 'Instead of asking, guess. “You sound like you were the oldest child.” A right guess feels like being seen; a wrong guess is even better, because now they have to correct you, and correcting someone is more fun than answering them.',
          tip: 'Guess with a smile, hold it loosely, and never guess about anything they might be sensitive about.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are good guesses to make out loud?',
          options: [
            { text: '“You are definitely the one who organises everything.”', ok: true },
            { text: '“Let me guess — you hated school.”', ok: true },
            { text: '“You look like you had a rough year.”', ok: false },
            { text: '“You have got a younger sibling energy about you.”', ok: true },
            { text: '“You seem like you are struggling financially.”', ok: false },
          ],
          why: 'Guesses work when being wrong is harmless and being right is flattering. Guessing at pain or status is not playful, it is exposing.',
        },
        {
          t: 'order',
          prompt: 'Arrange this exchange so it does not feel like an interview.',
          items: [
            'They say they just got back from Japan',
            'You react — “okay, I am jealous, that is my one big trip”',
            'You add something — “I have had a Tokyo tab open for two years”',
            'You ask — “what actually surprised you?”',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'A good ratio is roughly one statement of your own for every question you ask.',
          answer: true,
          why: 'Roughly one-to-one keeps it mutual. All questions is an interview; all statements is a monologue.',
        },
      ],
    },

    {
      id: 'cf-4',
      title: 'Matching energy',
      blurb: 'The fastest way to feel like someone “gets” you.',
      items: [
        {
          t: 'concept',
          title: 'Meet them where they are',
          body: 'People relax around people whose pace resembles their own. Loud into quiet feels like an assault; flat into excited feels like rejection. You are not becoming a different person — you are adjusting volume, speed, and how much you move.',
          example: { label: 'Mismatch', line: 'They are describing a hospital visit in a low voice. You reply at party volume. Everything they say next will be shorter.' },
        },
        {
          t: 'choice',
          prompt: 'Someone tells you excitedly that they got a promotion. Which response matches?',
          options: [
            { text: '“Congrats.” (flat, small nod)', why: 'Technically correct, emotionally a door closing. They will feel slightly silly for being excited.' },
            { text: '“WAIT. Tell me everything — when did you find out?”', ok: true, why: 'Matched energy plus a question that lets them keep the feeling going. This is what people mean by “they were so happy for me”.' },
            { text: '“Nice, does it come with more money?”', why: 'Straight to logistics. It deflates the moment they were offering you.' },
            { text: '“I got promoted last year too, it was mad.”', why: 'You took the moment. Give it back first, share yours second.' },
          ],
        },
        {
          t: 'concept',
          title: 'Match, then lead',
          body: 'Match their energy first so they feel met, then you can gently move it. If someone is anxious and you want them calmer, start near their level and slow down — do not open at total serenity, which reads as not listening.',
          tip: 'Two beats of matching buys you permission to lead.',
        },
        {
          t: 'multi',
          prompt: 'What can you match, other than volume?',
          options: [
            { text: 'Speed of speech', ok: true },
            { text: 'How formal or casual their words are', ok: true },
            { text: 'How much they gesture', ok: true },
            { text: 'Their accent', ok: false },
            { text: 'How long their sentences are', ok: true },
          ],
          why: 'Matching accent is mimicry and it is instantly detectable. Everything else is just tuning.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'When someone is upset, matching their energy means getting upset too.',
          answer: false,
          why: 'Match the weight, not the distress. Slow down, lower your voice, stop being breezy — but stay steady. They need one person in the conversation who is not sinking.',
        },
        {
          t: 'freeform',
          prompt: 'Match the moment.',
          context: 'A colleague says quietly, half-laughing: “I completely fell apart in that meeting. It was humiliating.”',
          rubric: {
            want: ['that', 'sounds', 'rough', 'happened', 'okay', 'you', 'brutal', 'sorry', 'what'],
            avoid: ['relax', 'overreacting', 'fine', 'least'],
            minWords: 6,
            sample: '“Oh that is a horrible feeling. What actually happened — or do you not want to relive it?”',
          },
        },
      ],
    },

    {
      id: 'cf-5',
      title: 'Reviving a dying conversation',
      blurb: 'Four moves for when it flatlines.',
      items: [
        {
          t: 'concept',
          title: 'It is not dead, it is out of fuel',
          body: 'Conversations die because the current topic ran out, not because you two have nothing. The fix is never to try harder on the exhausted topic. It is to change fuel: callback, confession, opinion, or observation.',
        },
        {
          t: 'match',
          prompt: 'Match the move to the line.',
          pairs: [
            ['Callback', '“You said your flat has no oven — how do you live?”'],
            ['Confession', '“I have been faking knowing what our new CFO does.”'],
            ['Opinion', '“I think this open-plan thing is a con.”'],
            ['Observation', '“That guy has refilled his plate four times.”'],
          ],
        },
        {
          t: 'choice',
          prompt: 'You have covered work, weather and the venue. Nothing is landing. Best move?',
          options: [
            { text: 'Ask another question about work.', why: 'Returning to an exhausted topic is how you get a conversation that both people want to escape.' },
            { text: 'Make a small confession — “I am terrible at these events, by the way.”', ok: true, why: 'A confession changes the register from polite to real, and it gives them permission to drop the act too. It is the highest-yield move on this list.' },
            { text: 'Compliment their shoes.', why: 'A pleasant dead end. They say thanks, and you are back where you were.' },
            { text: 'Say you need the toilet and do not come back.', why: 'Occasionally correct. Not a skill.' },
          ],
        },
        {
          t: 'concept',
          title: 'Confessions are cheap and powerful',
          body: 'A small confession — a mild fear, a dumb habit, a thing you do not understand — costs you almost nothing and instantly makes you a person rather than a participant. It is the fastest available shortcut to real conversation.',
          example: { label: 'Small, not heavy', line: '“I have nodded through this entire presentation without understanding one slide.”' },
          tip: 'Small confessions connect. Large ones burden. Know the difference.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are appropriately small confessions for a new acquaintance?',
          options: [
            { text: '“I always get lost in this building.”', ok: true },
            { text: '“I never know what to do with my hands at these things.”', ok: true },
            { text: '“My marriage is falling apart.”', ok: false },
            { text: '“I have not read a single one of the emails about this.”', ok: true },
            { text: '“I think about quitting every single day and I mean that.”', ok: false },
          ],
          why: 'Small confessions are low-stakes and universal. Heavy ones ask a near-stranger to hold something they did not agree to hold.',
        },
        {
          t: 'freeform',
          prompt: 'Revive it.',
          context: 'Work chat has run out. You are both holding drinks, looking at the room.',
          rubric: {
            want: ['i', 'honestly', 'always', 'never', 'terrible', 'bad', 'admit', 'confess', 'these'],
            avoid: [],
            minWords: 6,
            sample: '“Can I admit something? I have been here forty minutes and I have not learned a single person\'s name.”',
          },
        },
      ],
    },
  ],
};
