export default {
  id: 'groups',
  title: 'Groups & Social Energy',
  subtitle: 'Rooms, circles, and lasting the night',
  glyph: 'grid',
  color: '#9A86FF',
  lessons: [
    {
      id: 'gp-1',
      title: 'Joining a circle',
      blurb: 'The hardest ten seconds in social life.',
      items: [
        {
          t: 'concept',
          title: 'Approach, listen, then contribute',
          body: 'The mistake is arriving with something to say. Walk up, stand at the edge of the circle, listen for twenty seconds, and only then add to what is already happening. Groups reject people who change the subject on arrival.',
          tip: 'You are joining a conversation in progress, not starting a new one.',
        },
        {
          t: 'order',
          prompt: 'Order the join.',
          items: [
            'Walk over and stand at the open edge of the circle',
            'Listen without speaking for a few beats',
            'React visibly — laugh, nod, wince',
            'Add one line that builds on the current topic',
          ],
        },
        {
          t: 'choice',
          prompt: 'You are on the edge of a group mid-story. What is the best first contribution?',
          options: [
            { text: '“Hi, sorry to interrupt — I am Adam.”', why: 'A hard stop in the middle of someone\'s story. The group has to restart, and they will associate that cost with you.' },
            { text: 'Laugh at the right moment, then “wait, he actually said that?”', ok: true, why: 'You joined the story instead of interrupting it. Names can happen at the next natural gap.' },
            { text: '“What are we talking about?”', why: 'It asks the group to summarise for your benefit. Small tax, immediately noticed.' },
            { text: 'Stand there silently until someone notices you.', why: 'The most common approach and the most uncomfortable one — for everyone.' },
          ],
        },
        {
          t: 'concept',
          title: 'Read the shape of the circle',
          body: 'Two people angled tightly toward each other is a closed conversation — do not join. A loose horseshoe with a gap is an open one. Groups of three or more with visible space between people are the easiest rooms in any venue.',
        },
        {
          t: 'multi',
          prompt: 'Which groups are open to being joined?',
          options: [
            { text: 'Four people in a loose circle with gaps', ok: true },
            { text: 'Two people face to face, close, low voices', ok: false },
            { text: 'Three people, one already glancing around the room', ok: true },
            { text: 'A pair with a visible gap between them, standing side on', ok: true },
            { text: 'Two people mid-argument', ok: false },
          ],
          why: 'Physical openness maps almost exactly onto conversational openness. Look for gaps and outward attention.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'It is better to wait to be invited into a group than to join one.',
          answer: false,
          why: 'Almost nobody issues invitations at a party. Everyone is managing their own discomfort. Joining confidently is normal behaviour, not an imposition.',
        },
      ],
    },

    {
      id: 'gp-2',
      title: 'Holding the floor',
      blurb: 'Being heard in a group without dominating it.',
      items: [
        {
          t: 'concept',
          title: 'Start before you are ready',
          body: 'In a fast group, the gap you are waiting for will not arrive. The move is to begin on the tail of the previous line — start slightly louder, with a short entry phrase, and the floor comes to you. Waiting politely is how quiet people stay quiet.',
          example: { label: 'Entry phrases', line: '“See, this is the thing—” · “Okay, but—” · “Can I say something horrible?”' },
        },
        {
          t: 'choice',
          prompt: 'You get half a sentence out and someone talks over you. What now?',
          options: [
            { text: 'Give up and let them have it.', why: 'It works once, then becomes the pattern the group learns about you.' },
            { text: 'Wait, then “sorry, I was just going to say—”', why: 'Fine, though the pre-apology tells the group your point was optional.' },
            { text: 'Keep going for three more words, then let them in.', ok: true, why: 'Holding briefly signals you were mid-thought without turning it into a fight. Most people then hand it back.' },
            { text: 'Say “excuse me, I was talking.”', why: 'Correct in principle, costly in a casual group. Save it for repeated offenders.' },
          ],
        },
        {
          t: 'concept',
          title: 'Then give it away',
          body: 'The people everyone likes in groups are the ones who redirect: “Sam, you actually know about this.” Passing the floor to someone quieter makes you the person who runs the room without needing to hold it.',
          tip: 'One redirect per conversation. It is the most underrated group move there is.',
        },
        {
          t: 'multi',
          prompt: 'Which behaviours build standing in a group?',
          options: [
            { text: 'Bringing a quiet person in by name', ok: true },
            { text: 'Building on someone\'s point before adding yours', ok: true },
            { text: 'Being the funniest person continuously', ok: false },
            { text: 'Remembering and referencing what someone said earlier', ok: true },
            { text: 'Correcting small factual errors', ok: false },
          ],
          why: 'Groups reward people who make the group work. Relentless performing and pedantry both cost, slowly.',
        },
        {
          t: 'blank',
          prompt: 'Bring someone in.',
          sentence: '“___, you were saying something about this earlier — what was it?”',
          bank: ['Nia', 'Someone', 'Anyone', 'Guys'],
          answer: 'Nia',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you are quiet in groups, the fix is to talk more.',
          answer: false,
          why: 'The fix is to contribute more visibly — reacting, redirecting, asking one good question. Volume without contribution just makes you a louder quiet person.',
        },
      ],
    },

    {
      id: 'gp-3',
      title: 'The person nobody is talking to',
      blurb: 'Being the one who notices.',
      items: [
        {
          t: 'concept',
          title: 'Include on purpose',
          body: 'Every group has someone slightly outside it. Noticing and pulling them in is the single most memorable thing you can do socially, because it is rare and because they will never forget it.',
          example: { label: 'The move', line: '“Wait, we have been talking over you for five minutes. What do you think?”' },
        },
        {
          t: 'choice',
          prompt: 'Someone in your circle has not spoken in ten minutes. Best move?',
          options: [
            { text: 'Ask them a direct question about themselves.', why: 'Close, but a cold spotlight can be worse than being ignored — especially if they are shy.' },
            { text: 'Ask their opinion on what is already being discussed.', ok: true, why: 'It brings them in on a topic they have context for. Much easier to answer than a question about themselves.' },
            { text: 'Say “you are quiet!”', why: 'A public observation about their behaviour. It makes the quietness the topic, which is mortifying.' },
            { text: 'Leave them be — they clearly want to be left alone.', why: 'Sometimes true. Usually they are just stuck outside the current.' },
          ],
        },
        {
          t: 'concept',
          title: 'Hand them a bridge',
          body: 'The best inclusion gives them something to say and a reason they are qualified. “Dev just got back from Japan — he will have opinions about this.” You have created their entry and their credentials in one sentence.',
        },
        {
          t: 'multi',
          prompt: 'Which are good bridges?',
          options: [
            { text: '“Ines works in exactly this field, actually.”', ok: true },
            { text: '“You were saying earlier that you disagreed with this — go on.”', ok: true },
            { text: '“You are being very quiet over there.”', ok: false },
            { text: '“Rafa has the best story about this.”', ok: true },
            { text: '“Say something!”', ok: false },
          ],
          why: 'A bridge supplies both a topic and a warrant. Pointing at someone\'s silence supplies only pressure.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Introducing two people with a reason they should talk is better than just saying their names.',
          answer: true,
          why: '“This is Tobias — he is also mid-renovation and also regretting it” gives them a conversation. Names alone give them a silence.',
        },
        {
          t: 'freeform',
          prompt: 'Write the introduction.',
          context: 'You are introducing Hana (who just started running) to Marcus (who runs marathons).',
          rubric: {
            want: ['hana', 'marcus', 'running', 'run', 'started', 'marathon', 'both', 'this'],
            avoid: [],
            minWords: 8,
            sample: '“Hana, this is Marcus — he runs marathons, which I think makes him either the perfect person to ask or exactly the wrong one, given you just started.”',
          },
        },
      ],
    },

    {
      id: 'gp-4',
      title: 'Hosting energy',
      blurb: 'You do not need to own the room to run it.',
      items: [
        {
          t: 'concept',
          title: 'Host behaviour is available to guests',
          body: 'Getting someone a drink, making an introduction, opening the circle, starting the toast — none of these require being the host. Acting like the host at any gathering makes you central, and it is mostly just noticing what is needed.',
          tip: 'The person who says “has everyone met?” runs the party.',
        },
        {
          t: 'multi',
          prompt: 'Which are host behaviours you can do as a guest?',
          options: [
            { text: 'Introducing two people who should meet', ok: true },
            { text: 'Opening the circle when someone hovers', ok: true },
            { text: 'Rearranging the furniture', ok: false },
            { text: 'Asking the group a question everyone can answer', ok: true },
            { text: 'Checking on someone who went quiet', ok: true },
          ],
          why: 'Hosting is attention and initiative, not authority. Actual territorial changes are still the host\'s call.',
        },
        {
          t: 'concept',
          title: 'The group question',
          body: 'Have one question that any group can answer and that produces stories rather than facts. “What is the worst job you have ever had?” restarts a stalling table instantly, because everyone has one and everyone wants to go second.',
          example: { label: 'Reliable ones', line: 'Worst job · most irrational fear · the thing you were wrong about for years' },
        },
        {
          t: 'choice',
          prompt: 'A dinner table has gone flat. What works best?',
          options: [
            { text: 'Ask the table a question everyone can answer.', ok: true, why: 'A shared prompt gets everyone participating at once and resets the energy without any one person carrying it.' },
            { text: 'Tell your best story.', why: 'It fills five minutes and then you are back where you started, having spent your material.' },
            { text: 'Comment that it has gone quiet.', why: 'Announcing a lull makes it a fact everyone now has to deal with.' },
            { text: 'Start a conversation with the person next to you.', why: 'It fragments the table instead of reviving it.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Good hosts talk the most.',
          answer: false,
          why: 'Good hosts talk least and connect most. Their work is making other people talk to each other.',
        },
        {
          t: 'freeform',
          prompt: 'Write your table question.',
          context: 'A question any group of adults can answer, that produces a story rather than a fact.',
          rubric: {
            want: ['what', 'worst', 'best', 'most', 'ever', 'you', 'time', 'story', '?'],
            avoid: ['favourite colour', 'how old'],
            minWords: 5,
            sample: '“What is the most confidently wrong you have ever been about something?”',
          },
        },
      ],
    },

    {
      id: 'gp-5',
      title: 'Social battery',
      blurb: 'Lasting the evening without going flat.',
      items: [
        {
          t: 'concept',
          title: 'Drain is real and manageable',
          body: 'Social energy is finite, and it drains fastest during high-vigilance moments: arriving, meeting new people, large groups. Plan around it rather than pretending you are limitless and then going quiet at 9pm.',
          tip: 'Arrive early. Ten people arriving to you is far cheaper than you arriving to fifty.',
        },
        {
          t: 'multi',
          prompt: 'Which actually preserve energy at a long event?',
          options: [
            { text: 'Arriving early while the room is small', ok: true },
            { text: 'Taking a genuine five minutes alone mid-event', ok: true },
            { text: 'Drinking more to loosen up', ok: false },
            { text: 'Having two or three longer conversations rather than fifteen short ones', ok: true },
            { text: 'Staying to the very end to prove you can', ok: false },
          ],
          why: 'Depth costs less than breadth, and breaks work. Alcohol and endurance-proving both borrow from tomorrow.',
        },
        {
          t: 'concept',
          title: 'Leave before you are empty',
          body: 'Leaving at 80% means your last conversation was good and the memory is warm. Staying to 10% means the night ends with you monosyllabic in a corner, and that is the version you will remember tomorrow.',
        },
        {
          t: 'choice',
          prompt: 'You are two hours in and fading, but the night is still going. What is the move?',
          options: [
            { text: 'Push through — leaving early is rude.', why: 'Almost nobody notices departures and everybody notices someone visibly depleted.' },
            { text: 'Take five minutes outside, then decide.', ok: true, why: 'A genuine break often buys another good hour. And if it does not, you now know it is time to go.' },
            { text: 'Have another drink to get a second wind.', why: 'A loan at a bad interest rate.' },
            { text: 'Leave without saying anything.', why: 'Sometimes the right call, but a fifteen-second goodbye to one or two people costs little and is remembered well.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Needing recovery time after socialising means you are bad at socialising.',
          answer: false,
          why: 'It means you have a nervous system. Recovery need is unrelated to social skill — plenty of highly charismatic people need a quiet day afterwards.',
        },
        {
          t: 'order',
          prompt: 'Order an evening that protects your energy.',
          items: [
            'Arrive early while the room is still small',
            'Have two or three real conversations',
            'Take five minutes alone somewhere quiet',
            'Leave warmly while you still have something left',
          ],
        },
      ],
    },
  ],
};
