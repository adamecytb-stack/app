export default {
  id: 'parties',
  title: 'Parties & Hangouts',
  subtitle: 'Walking in, joining in, and getting through the night',
  glyph: 'grid',
  color: '#FF9F5A',
  lessons: [
    {
      id: 'pt-1',
      title: 'Walking in',
      blurb: 'The worst two minutes of any night, handled.',
      items: [
        {
          t: 'concept',
          title: 'Arrive earlier than you want to',
          body: 'Walking into a room with eight people in it is easy. Walking into the same room with forty is horrible. Arriving early means you meet people one at a time as they turn up, instead of facing a room that is already full and already in groups.',
          tip: 'Early is the single biggest cheat code for anyone who finds these hard.',
        },
        {
          t: 'choice',
          prompt: 'You walk in and everyone is already in groups. What now?',
          options: [
            { text: 'Go straight to your phone in a corner.', why: 'It buys you thirty seconds and costs you the night. Once you are the person on their phone in the corner it gets harder to leave that spot.' },
            { text: 'Find one person you know and start there.', ok: true, why: 'One anchor is all you need. From there you get absorbed into whatever group they are in, which is far easier than joining cold.' },
            { text: 'Go and get a drink, then decide.', ok: true, why: 'Also correct — it gives you a reason to be moving and takes you past several groups on the way. Anything beats standing still.' },
            { text: 'Stand near the door and wait for someone to notice you.', why: 'You become visibly unattached, which weirdly makes people less likely to approach, not more.' },
          ],
        },
        {
          t: 'concept',
          title: 'Have a reason to be moving',
          body: 'The hardest thing to do at a party is stand still doing nothing. Getting a drink, taking a plate through, looking for someone — all of it gives you a purpose, takes you past people, and makes joining a group look accidental rather than deliberate.',
          example: { label: 'The move', line: 'Walk somewhere with intent, end up next to a group, react to what they are saying.' },
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Everyone else at the party is relaxed and you are the only one finding it hard.',
          answer: false,
          why: 'A large chunk of any room is managing the exact same thing, including people who look completely fine. Confidence at a party is mostly a performance everyone is putting on at once.',
        },
        {
          t: 'multi',
          prompt: 'Which of these help in the first ten minutes?',
          options: [
            { text: 'Arriving early', ok: true },
            { text: 'Arriving with one other person', ok: true },
            { text: 'Standing still in the middle of the room', ok: false },
            { text: 'Having a small job — drinks, music, letting people in', ok: true },
            { text: 'Waiting for the right group to become available', ok: false },
          ],
          why: 'Anything that gives you movement or a role. Standing still and waiting are the two things that make the first ten minutes stretch out.',
        },
        {
          t: 'freeform',
          prompt: 'Plan your first two minutes.',
          context: 'Write exactly what you will do when you walk in next time. Be specific — future-you will not improvise well.',
          rubric: {
            want: ['i', 'will', 'find', 'go', 'get', 'say', 'to', 'first', 'then', 'talk'],
            avoid: ['see how it goes', 'wing it', 'hope'],
            minWords: 8,
            sample: '“I will find whoever I came with, say hi to whoever is nearest, then go and get a drink rather than standing anywhere.”',
          },
        },
      ],
    },

    {
      id: 'pt-2',
      title: 'Joining a group',
      blurb: 'Walking up to people who are already talking.',
      items: [
        {
          t: 'concept',
          title: 'Listen first, then add',
          body: 'The mistake is arriving with something to say. Stand at the edge, listen for twenty seconds, react to what is happening, and then add one line that builds on it. Groups push away people who change the subject on arrival and absorb people who join the current one.',
          tip: 'You are joining a conversation in progress, not starting a new one.',
        },
        {
          t: 'order',
          prompt: 'Order the join.',
          items: [
            'Walk over and stand at the open edge',
            'Listen for a few beats without speaking',
            'React visibly — laugh, nod, wince',
            'Add one line that builds on the topic',
          ],
        },
        {
          t: 'concept',
          title: 'Read the shape of the circle',
          body: 'Two people angled tightly towards each other with low voices is a closed conversation — leave it. A loose circle with gaps in it is open. Three or more people with space between them is the easiest group in any room.',
        },
        {
          t: 'multi',
          prompt: 'Which groups are open to being joined?',
          options: [
            { text: 'Four people in a loose circle with gaps', ok: true },
            { text: 'Two people close together, talking quietly', ok: false },
            { text: 'Three people, one already looking around the room', ok: true },
            { text: 'A group laughing loudly with space between them', ok: true },
            { text: 'Two people who look like they are arguing', ok: false },
          ],
          why: 'Physical openness maps almost exactly onto conversational openness. Look for gaps and outward attention.',
        },
        {
          t: 'choice',
          prompt: 'You are at the edge of a group mid-story. What is your first contribution?',
          options: [
            { text: '“Hi, sorry to interrupt —”', why: 'A hard stop in the middle of someone’s story. The group has to restart, and they will associate that cost with you.' },
            { text: 'Laugh at the right bit, then “wait, he actually said that?”', ok: true, why: 'You joined the story instead of interrupting it. Names and hellos can happen at the next natural gap.' },
            { text: '“What are you all talking about?”', why: 'It asks four people to summarise for your benefit. Small tax, immediately noticed.' },
            { text: 'Stand silently until someone notices you.', why: 'The most common approach and the most uncomfortable one — for everyone, including them.' },
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'It is better to wait to be invited into a group than to join one.',
          answer: false,
          why: 'Almost nobody issues invitations at a party — everyone is managing their own night. Joining is normal behaviour, not an imposition.',
        },
      ],
    },

    {
      id: 'pt-3',
      title: 'When your friends disappear',
      blurb: 'Stranded, and what to do about it.',
      items: [
        {
          t: 'concept',
          title: 'Being alone for five minutes is not an emergency',
          body: 'Everyone ends up momentarily stranded at every gathering. It feels enormously visible and it is barely noticed. The mistake is panicking and hiding — the fix is picking a direction and moving.',
          tip: 'Go to the kitchen. There is always someone in the kitchen and it is the easiest room to arrive in.',
        },
        {
          t: 'choice',
          prompt: 'Your friends have vanished and you are on your own. Best move?',
          options: [
            { text: 'Text them to find out where they are.', why: 'Reasonable, but it turns into ten minutes of standing still looking at a phone, which is exactly what you are trying to avoid.' },
            { text: 'Go and talk to whoever is nearest and least busy.', ok: true, why: 'Someone else stranded, someone in the kitchen, someone getting a drink. Being alone at a party is the best possible reason to meet someone new.' },
            { text: 'Leave.', why: 'Sometimes the right call at the end of a night. As a first response to five minutes alone, it is the avoidance option.' },
            { text: 'Find them and stick with them all night.', why: 'Safe and it means you spend the whole night talking to people you already know.' },
          ],
        },
        {
          t: 'concept',
          title: 'Look for the other stranded person',
          body: 'There is always someone else on their own at the edge, and they are the single easiest person in the room to talk to, because you are both in the same position and they will be relieved. Naming it out loud is allowed and it usually gets a laugh.',
          example: { label: 'Instant bond', line: '“Are you also just standing here pretending to be busy?”' },
        },
        {
          t: 'multi',
          prompt: 'Who is easiest to talk to at a party?',
          options: [
            { text: 'Someone else standing on their own', ok: true },
            { text: 'Whoever is in the kitchen', ok: true },
            { text: 'The middle of the loudest group', ok: false },
            { text: 'Someone doing a job — music, drinks, food', ok: true },
            { text: 'Two people deep in conversation', ok: false },
          ],
          why: 'People who are unoccupied or doing something practical are easy. People who are already deep in something are not.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Standing on your own at a party makes people think there is something wrong with you.',
          answer: false,
          why: 'Most people assume you are waiting for someone. The bigger cost is that you assume it about yourself and then hide, which is what actually shapes the night.',
        },
        {
          t: 'freeform',
          prompt: 'Write the stranded-person opener.',
          context: 'You have spotted someone else on their own near the edge of the room.',
          rubric: {
            want: ['?', 'you', 'also', 'are', 'do', 'know', 'anyone', 'here', 'standing', 'same'],
            avoid: [],
            minWords: 5,
            sample: '“Are you also doing the thing where you stand here and look like you are waiting for someone?”',
          },
        },
      ],
    },

    {
      id: 'pt-4',
      title: 'Games and group stuff',
      blurb: 'When everyone is watching, including them.',
      items: [
        {
          t: 'concept',
          title: 'Joining in badly beats sitting out well',
          body: 'Nobody remembers who was bad at the game. Everyone notices who refused to play. Being willing to look slightly stupid in a group is read as confidence, and it is one of the fastest ways to be liked.',
          tip: 'The goal is to be in it, not to win it.',
        },
        {
          t: 'choice',
          prompt: 'Everyone is playing something and you are not good at it. What do you do?',
          options: [
            { text: 'Sit it out and watch.', why: 'You become an observer for the rest of the night, and it is hard to rejoin the energy once you are outside it.' },
            { text: 'Play and be openly bad at it.', ok: true, why: 'Being cheerfully terrible is genuinely charming. It also takes all the pressure off, because you already announced the outcome.' },
            { text: 'Play but take it seriously to avoid embarrassment.', why: 'Taking a silly game seriously is the one thing that actually looks awkward in a group.' },
            { text: 'Suggest a different game you are good at.', why: 'Reads as trying to control the room. Join this one; suggest yours later.' },
          ],
        },
        {
          t: 'concept',
          title: 'Truth-or-dare rules',
          body: 'Games at this age often turn into dares or questions about who fancies who. You are always allowed to pass, and “nah, I am good” said calmly is a complete answer. Anyone who pushes after that is the one being weird, and everyone watching knows it.',
          tip: 'Never out someone else’s secret for a laugh. It gets a five-second reaction and a long memory.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are completely fine to do in a group game?',
          options: [
            { text: 'Passing on a question you do not want to answer', ok: true },
            { text: 'Saying “nah” to a dare without explaining', ok: true },
            { text: 'Telling everyone who someone else likes', ok: false },
            { text: 'Being obviously bad and laughing about it', ok: true },
            { text: 'Pressuring someone who said no', ok: false },
          ],
          why: 'Your own boundaries need no justification, and neither do theirs. Sharing someone else’s private thing for a laugh is the one that lasts.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If everyone is doing something you are not comfortable with, you have to join in or you will look boring.',
          answer: false,
          why: 'People who can say no calmly, without a speech, are consistently read as more confident, not less. The ones who look uncomfortable are the ones going along with it visibly.',
        },
        {
          t: 'freeform',
          prompt: 'Write your calm no.',
          context: 'A dare you are not doing. Write the short version you say, without a lecture or an excuse.',
          rubric: {
            want: ['no', 'nah', 'not', 'doing', 'that', 'pass', 'good', 'i', 'am', 'one'],
            avoid: ['sorry', 'because my', 'i would but', 'please do not make me'],
            minWords: 3,
            sample: '“Nah, I am good. Someone else go.”',
          },
        },
      ],
    },

    {
      id: 'pt-5',
      title: 'Leaving',
      blurb: 'The last thirty seconds decide how the night is remembered.',
      items: [
        {
          t: 'concept',
          title: 'Go while it is still good',
          body: 'Most people stay until they are flat and then leave awkwardly. If you leave while you are still enjoying it, the whole night gets remembered as good. People rate an experience by its best moment and its last one, and you control the last one.',
          tip: 'Leaving at eighty percent beats leaving at ten percent.',
        },
        {
          t: 'choice',
          prompt: 'You are ready to go. What is the best exit?',
          options: [
            { text: 'Slip out without telling anyone.', why: 'Occasionally fine, but it means the last thing you did was disappear. Fifteen seconds of goodbye is worth a lot.' },
            { text: 'Say bye to two or three people and leave on something warm.', ok: true, why: 'Short, memorable and it leaves a door open. This is the part almost everyone skips.' },
            { text: 'Announce to the whole room that you are leaving.', why: 'Makes an event of it and puts you on the spot, and someone will try to talk you out of it.' },
            { text: 'Stay because it feels rude to go.', why: 'Nobody is tracking your attendance. Staying past empty is how a good night turns into a flat memory.' },
          ],
        },
        {
          t: 'concept',
          title: 'Leave a door open',
          body: 'A door is a specific reference to the future — their match, their thing next week, a plan you half-made. “See you” closes. “Tell me how Saturday goes” means there is a reason to speak again. It is the cheapest and most-skipped move there is.',
          example: { label: 'Door, not full stop', line: '“Good luck with the thing Tuesday — I want to know what happens.”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these leave a door open?',
          options: [
            { text: '“Let me know how the match goes.”', ok: true },
            { text: '“See ya.”', ok: false },
            { text: '“Send me that video you were talking about.”', ok: true },
            { text: '“Bye!”', ok: false },
            { text: '“We are doing this again, right?”', ok: true },
          ],
          why: 'Doors are specific and point forwards. Generic goodbyes are fine and nobody remembers them.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'How a conversation ends matters more than most of the middle of it.',
          answer: true,
          why: 'People remember the peak and the end. The last thirty seconds does a huge amount of work, and it is the part that takes the least effort to get right.',
        },
        {
          t: 'freeform',
          prompt: 'Write your exit.',
          context: 'You are leaving. Earlier, the person you like mentioned they have a big match on Saturday.',
          rubric: {
            want: ['good', 'luck', 'saturday', 'match', 'let', 'me', 'know', 'tell', 'how', 'goes', 'want'],
            avoid: [],
            minWords: 6,
            sample: '“Right, I am off — good luck Saturday. Tell me how it goes, I actually want to know.”',
          },
        },
      ],
    },
  ],
};
