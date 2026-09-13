export default {
  id: 'small-talk',
  title: 'Small Talk Foundations',
  subtitle: 'Start conversations without the dread',
  glyph: 'chat',
  color: '#F5A524',
  lessons: [
    {
      id: 'st-1',
      title: 'The first ten seconds',
      blurb: 'Openers that work because they ask for almost nothing.',
      items: [
        {
          t: 'concept',
          title: 'Openers are not auditions',
          body: 'A good opener is not clever. It is easy to answer. Its only job is to move two people from “not talking” to “talking” — anything that does that has already succeeded.',
          example: { label: 'Boring, and it works', line: '“Have you tried the coffee here, or is it a trap?”' },
          tip: 'If your opener would sound insane written on a T-shirt, it is trying too hard.',
        },
        {
          t: 'choice',
          prompt: 'You are both waiting for a lift. Which opener is most likely to get a real reply?',
          options: [
            { text: '“So what do you do for a living?”', why: 'Fine later, heavy now. It asks a stranger to summarise their identity before you have earned it.' },
            { text: '“This building has the slowest lifts in the country.”', ok: true, why: 'Shared situation, shared mild complaint, zero pressure. They can agree with two words or add their own story.' },
            { text: '“Hi! I noticed you and thought you seemed interesting.”', why: 'It makes the interaction about you evaluating them. Now they have to perform.' },
            { text: 'Say nothing and look at your phone.', why: 'The default. It is comfortable and it is also how you stay a stranger.' },
          ],
        },
        {
          t: 'concept',
          title: 'The shared-third rule',
          body: 'The safest opener points at something you are both already experiencing: the queue, the weather in this exact room, the music, the food, the delay. You are not two strangers facing each other — you are two people facing the same third thing.',
          example: { label: 'Point at the third thing', line: '“Whoever picked this playlist has strong opinions.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these count as a “shared third”? Pick every one that does.',
          options: [
            { text: 'The absurd length of the queue', ok: true },
            { text: 'Their job title on their badge', ok: true },
            { text: 'Your worry about seeming weird', ok: false },
            { text: 'The dog they are walking', ok: true },
            { text: 'A story about your ex', ok: false },
          ],
          why: 'A shared third is something visible to both of you right now. Your internal state and your history are not in the room yet.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'A slightly awkward opener delivered warmly beats a perfect opener delivered nervously.',
          answer: true,
          why: 'People remember tone far longer than wording. Warmth reads as “safe”; polish reads as nothing in particular.',
        },
        {
          t: 'freeform',
          prompt: 'Write an opener for this moment.',
          context: 'You are at a friend\'s birthday. Someone is standing alone near the snacks, looking at the table.',
          rubric: {
            want: ['?', 'these', 'this', 'you', 'here', 'know', 'try', 'food', 'snack', 'cake', 'birthday'],
            avoid: ['salary', 'politics', 'religion', 'weird'],
            minWords: 4,
            sample: '“Okay, honest opinion — is the dip worth it? I have been circling for five minutes.”',
          },
        },
      ],
    },

    {
      id: 'st-2',
      title: 'Questions that open doors',
      blurb: 'Why “how was your weekend?” dies and what to ask instead.',
      items: [
        {
          t: 'concept',
          title: 'Closed questions get closed answers',
          body: 'A closed question can be answered in one word, so it usually is. An open question asks for a small story. You are not interrogating — you are handing them somewhere to go.',
          example: { label: 'Swap the frame', line: 'Not “Did you have a good weekend?” → “What was the best part of your weekend?”' },
        },
        {
          t: 'choice',
          prompt: 'Which question gives them the most to work with?',
          options: [
            { text: '“Do you like your job?”', why: 'Yes or no. Most people say “yeah, it\'s fine” and the door shuts.' },
            { text: '“What\'s the part of your job nobody expects?”', ok: true, why: 'Specific, slightly playful, and it invites the interesting half of the answer instead of the CV half.' },
            { text: '“How long have you worked there?”', why: 'A number. Useful for a form, useless for a conversation.' },
            { text: '“Is work busy?”', why: 'The single most answerable-and-forgettable question in English.' },
          ],
        },
        {
          t: 'blank',
          prompt: 'Complete the upgrade.',
          sentence: 'Instead of “Was the trip good?”, ask “___ surprised you most about it?”',
          bank: ['What', 'Did', 'Was', 'Have'],
          answer: 'What',
        },
        {
          t: 'concept',
          title: 'Ask about the choice, not the fact',
          body: 'Facts are dead ends: where they live, what they studied, how long they stayed. Choices are alive: why there, why that, what nearly happened instead. Everyone can talk about a decision they made.',
          example: { label: 'Live version', line: 'Not “So you studied biology?” → “What made you pick biology over everything else?”' },
        },
        {
          t: 'match',
          prompt: 'Match each dead-end question to its upgrade.',
          pairs: [
            ['“You from around here?”', '“What made you settle in this part of town?”'],
            ['“Busy week?”', '“What\'s been eating your week?”'],
            ['“Nice weather, right?”', '“What do you actually do when it\'s like this out?”'],
            ['“Do you have hobbies?”', '“What have you been spending too much time on lately?”'],
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Asking three open questions in a row is a great way to build rapport.',
          answer: false,
          why: 'Three in a row is an interview. After an answer, give something of your own before asking again — that is what makes it feel mutual.',
        },
      ],
    },

    {
      id: 'st-3',
      title: 'Free information',
      blurb: 'The habit that makes you easy to talk to.',
      items: [
        {
          t: 'concept',
          title: 'Answer, then add a hook',
          body: 'Free information is the extra detail you volunteer after answering. Without it, the other person has to keep generating questions and the conversation dies of exhaustion — usually while they quietly decide you are hard work.',
          example: { label: 'Closed vs open', line: '“Good, thanks.” → “Good — I finally started climbing again, which my hands are furious about.”' },
          tip: 'One hook per answer is plenty. Three is a monologue.',
        },
        {
          t: 'choice',
          prompt: '“Have you lived here long?” Which answer keeps things alive?',
          options: [
            { text: '“About three years.”', why: 'True, and a dead end. They now have to invent the next question alone.' },
            { text: '“Three years — I came for a job that I quit four months later, so, great planning.”', ok: true, why: 'Same fact, plus two hooks (the job, the quitting) and a bit of self-deprecation that gives them permission to be human too.' },
            { text: '“Yes.”', why: 'Technically responsive.' },
            { text: '“Three years, then two in Berlin before that, then a year in Lisbon, then...”', why: 'That is a CV, not a hook. Volume is not the same as openness.' },
          ],
        },
        {
          t: 'concept',
          title: 'Hooks are permission slips',
          body: 'Every detail you offer is a door the other person may walk through. Offer none and they are standing in a corridor. Offer one specific, slightly odd detail and most people cannot help themselves.',
          example: { label: 'The odd detail wins', line: '“I spent the weekend arguing with a bookshelf.” beats “I did some DIY.”' },
        },
        {
          t: 'multi',
          prompt: '“How was your weekend?” — which replies contain a usable hook?',
          options: [
            { text: '“Quiet. I got obsessed with a documentary about competitive dog grooming.”', ok: true },
            { text: '“Fine, thanks.”', ok: false },
            { text: '“Chaotic — my sister turned up unannounced with a puppy.”', ok: true },
            { text: '“Not bad. You?”', ok: false },
            { text: '“Good! I finally cooked something that wasn\'t pasta.”', ok: true },
          ],
          why: 'A hook is a specific noun the other person can grab: the documentary, the sister, the pasta streak. “Fine” has no nouns in it.',
        },
        {
          t: 'freeform',
          prompt: 'Answer with a hook.',
          context: 'Someone at a party asks: “So how do you know the host?”',
          rubric: {
            want: ['we', 'i', 'met', 'work', 'through', 'years', 'back', 'when'],
            avoid: [],
            minWords: 8,
            sample: '“We worked together for two years — she is the reason I know how to use a spreadsheet and also why I have a scar on my thumb.”',
          },
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If someone gives you a one-word answer twice in a row, the polite move is to keep asking questions until they open up.',
          answer: false,
          why: 'Two dead ends is a signal, not a challenge. Either offer something of your own to lower the stakes, or let them go warmly. Persistence reads as pressure.',
        },
      ],
    },

    {
      id: 'st-4',
      title: 'The awkward pause',
      blurb: 'Silence is not an emergency. Here is what to do with it.',
      items: [
        {
          t: 'concept',
          title: 'The pause is shorter than it feels',
          body: 'A silence that feels like ten seconds is usually two. Your nervous system is running the clock fast because it thinks the pause means failure. It does not. It means someone finished a sentence.',
          tip: 'Count it silently once. You will be startled by how short it actually is.',
        },
        {
          t: 'choice',
          prompt: 'A lull hits. What is the strongest move?',
          options: [
            { text: 'Fill it instantly with anything.', why: 'Panic-filling is audible. It usually produces the weakest thing you will say all night.' },
            { text: 'Say “well, this got awkward.”', why: 'Naming it once can be charming, but it makes the silence the topic and puts the awkwardness on the table permanently.' },
            { text: 'Return to something they said earlier.', ok: true, why: 'Callbacks are the cheat code. It proves you were listening, and it restarts a thread you already know they like.' },
            { text: 'Check your phone.', why: 'The universal signal for “we are done here.”' },
          ],
        },
        {
          t: 'concept',
          title: 'The three escape hatches',
          body: 'When a thread ends, you have three reliable doors: go back (callback to something earlier), go out (comment on the shared situation), or go in (say something slightly more personal than you have so far).',
          example: { label: 'Go in', line: '“Honestly I have been dreading these things all month — this is the first one I have actually enjoyed.”' },
        },
        {
          t: 'order',
          prompt: 'Order these from lowest to highest risk.',
          items: [
            'Comment on the room (“this venue is freezing”)',
            'Callback (“you said you just moved — how is that going?”)',
            'Share something mildly personal (“I am terrible at these events”)',
            'Ask a direct opinion question (“do you actually like your job?”)',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Comfortable silence is a sign the conversation is going badly.',
          answer: false,
          why: 'The opposite. Being able to share a pause without scrambling is a marker of ease — it is what conversations between close friends are half made of.',
        },
        {
          t: 'freeform',
          prompt: 'Write a callback.',
          context: 'Ten minutes ago they mentioned they are training for a half marathon. The current thread has just died.',
          rubric: {
            want: ['marathon', 'training', 'run', 'half', 'race'],
            avoid: [],
            minWords: 5,
            sample: '“Wait, go back — half marathon. What made you sign up for that, out of all the ways to spend a Sunday?”',
          },
        },
      ],
    },

    {
      id: 'st-5',
      title: 'Leaving well',
      blurb: 'How you end it is what they remember.',
      items: [
        {
          t: 'concept',
          title: 'Exit on a high, not on empty',
          body: 'Most people stay until the conversation dies, then leave awkwardly. Leave while it is still good and the whole exchange gets filed as “that was nice”. The last thirty seconds colour the entire memory.',
          tip: 'Peak-end rule: people rate an experience by its best moment and its final moment. You control the final moment.',
        },
        {
          t: 'order',
          prompt: 'Put the parts of a clean exit in order.',
          items: [
            'Signal it is ending (“I should go find my friend, but—”)',
            'Name something you liked (“—this was a genuinely good tangent”)',
            'Leave a door open (“I want to hear how the move goes”)',
            'Actually leave',
          ],
        },
        {
          t: 'choice',
          prompt: 'Which exit lands best?',
          options: [
            { text: '“Anyway... yeah. Cool. Okay.”', why: 'The slow fade. It is what most people do and it retroactively makes the conversation feel flat.' },
            { text: '“I\'m going to grab another drink — but seriously, the dog-grooming documentary. I\'m watching that tonight.”', ok: true, why: 'Clear reason to move, a specific callback that proves you listened, and a warm note to end on.' },
            { text: '“Sorry, I have to go, this is boring.”', why: 'Honest, memorable, catastrophic.' },
            { text: 'Wait for them to leave first.', why: 'A strategy that guarantees the conversation ends on its weakest moment.' },
          ],
        },
        {
          t: 'concept',
          title: 'The open door',
          body: 'A door is a specific future reference: their trip, their deadline, their move. “Nice to meet you” closes; “tell me how the move goes” leaves something to pick up next time. It is also how a stranger becomes an acquaintance.',
          example: { label: 'Door, not full stop', line: '“Good luck Thursday — I want to know if the client says yes.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these leave a door open?',
          options: [
            { text: '“Let me know how the exam goes.”', ok: true },
            { text: '“Nice meeting you.”', ok: false },
            { text: '“Send me the name of that place — I will actually go.”', ok: true },
            { text: '“Take care!”', ok: false },
            { text: '“Next time you are in town, I owe you a coffee.”', ok: true },
          ],
          why: 'Doors are specific and forward-looking. Pleasantries are neither, which is why nobody remembers them.',
        },
        {
          t: 'freeform',
          prompt: 'Write your exit.',
          context: 'A twenty-minute conversation at a work event. They talked about moving house next month and hating their commute.',
          rubric: {
            want: ['move', 'moving', 'house', 'commute', 'good', 'luck', 'hope', 'hear'],
            avoid: [],
            minWords: 8,
            sample: '“I should do a lap before this ends — but good luck with the move. If the new commute is any better I want to hear about it.”',
          },
        },
      ],
    },
  ],
};
