export default {
  id: 'school',
  title: 'School Days',
  subtitle: 'Lessons, lunch, corridors — the reps you get for free',
  glyph: 'book',
  color: '#FFC763',
  lessons: [
    {
      id: 'sc-1',
      title: 'The person you sit next to',
      blurb: 'An hour of free practice, every single day.',
      items: [
        {
          t: 'concept',
          title: 'The easiest conversation in the building',
          body: 'Whoever you sit next to is the lowest-risk person to practise on. You have a guaranteed shared topic, a built-in reason to speak, and a natural end when the bell goes. If you are trying to get better at this, that seat is the gym.',
          tip: 'You do not have to want to be their friend. You are getting reps in.',
        },
        {
          t: 'choice',
          prompt: 'You sit next to someone you barely know. What is the easiest opener?',
          options: [
            { text: '“What did you do at the weekend?”', why: 'Too big a jump from silence, and it usually gets “not much”. Start with what is in front of both of you.' },
            { text: '“Do you get any of this?”', ok: true, why: 'Shared situation, easy yes/no with an obvious follow-up, and it is a tiny bit of a confession. Almost always works.' },
            { text: 'Nothing — they might not want to talk.', why: 'They are equally likely to be thinking the same thing about you. One low-stakes sentence tells you everything.' },
            { text: '“You are in my form, right?”', why: 'Fine, but it is admin. It gets answered and then you are back to silence.' },
          ],
        },
        {
          t: 'concept',
          title: 'Complaining together is a shortcut',
          body: 'Mildly moaning about the same thing — the work, the heat, the teacher’s handwriting — builds a bond faster than almost anything else, because you are instantly on the same side. Keep it small and about the situation, not about people.',
          example: { label: 'Same side, immediately', line: '“There is no way we are finishing this in one lesson.”' },
          tip: 'Mild and about the thing. Not about a person, and never about them.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are good low-risk things to say to your neighbour?',
          options: [
            { text: '“Have you started this yet?”', ok: true },
            { text: '“What did you put for number three?”', ok: true },
            { text: 'Something critical about another person in the class', ok: false },
            { text: '“I did not sleep at all last night.”', ok: true },
            { text: 'A long story about your weekend, unprompted', ok: false },
          ],
          why: 'Short, shared and easy to answer. Gossip creates a risk you cannot control, and a long unprompted story is a lot to receive from someone you barely know.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If they give you a short answer, you should stop trying for the rest of the lesson.',
          answer: false,
          why: 'One short answer is often just someone concentrating. Try again in ten minutes with something equally small. Two or three flat answers in a row is the signal to leave it for today.',
        },
        {
          t: 'freeform',
          prompt: 'Write your neighbour opener.',
          context: 'You are sitting next to someone you have barely spoken to. The teacher has just set work.',
          rubric: {
            want: ['?', 'you', 'this', 'do', 'did', 'have', 'get', 'any', 'understand', 'started', 'what'],
            avoid: [],
            minWords: 4,
            sample: '“Have you got any idea what we are meant to be doing? Because I completely zoned out.”',
          },
        },
      ],
    },

    {
      id: 'sc-2',
      title: 'Lunch',
      blurb: 'Where to sit and how to end up somewhere.',
      items: [
        {
          t: 'concept',
          title: 'Arriving is the hard part, not staying',
          body: 'Walking up to a table is the ten seconds people dread. Once you are sitting down, it is just a conversation. Almost nobody gets turned away — the fear is about the walk, not about the reception.',
          tip: 'Ask “is anyone sitting here?” and sit down as you say it. Standing and waiting for permission makes it a bigger deal than it is.',
        },
        {
          t: 'choice',
          prompt: 'You want to sit with a group you sort of know. What is the move?',
          options: [
            { text: 'Hover nearby until someone invites you.', why: 'The worst version — it is visible, it is uncomfortable for everyone, and invitations rarely come because people assume you are waiting for someone else.' },
            { text: 'Sit down and say something about whatever they are already talking about.', ok: true, why: 'You join what is happening instead of announcing yourself. Within a minute you are just someone at the table.' },
            { text: 'Sit down silently and wait to be included.', why: 'It puts the work on them, and it can read as you not wanting to be there.' },
            { text: 'Sit somewhere else and message them instead.', why: 'It solves today and changes nothing. You will face the same ten seconds tomorrow.' },
          ],
        },
        {
          t: 'concept',
          title: 'Join the topic, do not change it',
          body: 'The quickest way to be absorbed into a group is to react to whatever is already being said. Arriving with a new subject makes everyone stop and restart, and they notice that. React first, contribute second.',
          example: { label: 'Joining properly', line: 'Laugh at the bit you caught, then “wait, who actually said that?”' },
        },
        {
          t: 'order',
          prompt: 'Order the lunch table approach.',
          items: [
            'Walk over without hesitating',
            'Sit down as you ask',
            'Catch up on what they are talking about',
            'React to it before you add anything',
          ],
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If a group goes quiet when you sit down, it means they were talking about you.',
          answer: false,
          why: 'It usually means the conversation was mid-sentence and someone lost their thread. Assuming the worst here is how people talk themselves out of sitting anywhere.',
        },
        {
          t: 'multi',
          prompt: 'Which make joining a table easier?',
          options: [
            { text: 'Going over with one other person', ok: true },
            { text: 'Having a reason to be there — food, a question, anything', ok: true },
            { text: 'Waiting until they have all finished eating', ok: false },
            { text: 'Sitting near someone you actually know', ok: true },
            { text: 'Standing until someone says you can sit', ok: false },
          ],
          why: 'Lower the barrier however you can. Anything that makes you stand and wait makes it harder and more visible.',
        },
      ],
    },

    {
      id: 'sc-3',
      title: 'Corridors and passing people',
      blurb: 'The two-second interactions that add up.',
      items: [
        {
          t: 'concept',
          title: 'Small acknowledgements build familiarity',
          body: 'A nod, a “hey”, a small comment in passing is not a wasted interaction. Repeated tiny contact is how someone goes from a stranger to a person you know — and it means the next real conversation starts from somewhere instead of from zero.',
          tip: 'You do not need to stop and have a conversation. Being consistently acknowledged is enough.',
        },
        {
          t: 'choice',
          prompt: 'You pass them in the corridor and you have about two seconds. What do you do?',
          options: [
            { text: 'Look away and pretend you did not see them.', why: 'The most common move and the worst one. Repeated over weeks it reads as you actively not wanting contact.' },
            { text: 'Say “hey” and keep walking.', ok: true, why: 'Two seconds, zero risk, and it does the job. Consistency here matters far more than content.' },
            { text: 'Stop and try to start a proper conversation.', why: 'Corridors are a bad venue — you are both going somewhere and there is a crowd. Save it for when there is time.' },
            { text: 'Wait to see if they say something first.', why: 'They are running the same calculation, in the same two seconds. Usually nothing happens.' },
          ],
        },
        {
          t: 'concept',
          title: 'The half-second too late problem',
          body: 'Most corridor awkwardness is timing. You decide to say hi just after the moment has passed, so it lands strangely. Decide earlier — as you see them, not as you reach them — and it comes out normally.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If you say hi and they do not hear you, you should assume they ignored you.',
          answer: false,
          why: 'Corridors are loud and people are in their own heads. The overwhelming majority of these are genuinely not heard, and treating it as a snub makes you avoid them next time for no reason.',
        },
        {
          t: 'multi',
          prompt: 'Which of these are fine in a two-second passing interaction?',
          options: [
            { text: 'A nod', ok: true },
            { text: '“Alright?”', ok: true },
            { text: 'A callback to something from earlier, in four words', ok: true },
            { text: 'Stopping the flow of people to talk properly', ok: false },
            { text: 'A long question they have to stop for', ok: false },
          ],
          why: 'Keep it to the length of the moment. Anything that requires them to stop moving turns a light interaction into an obligation.',
        },
        {
          t: 'blank',
          prompt: 'Four-word callback.',
          sentence: 'Yesterday they said they had a test today. Passing them, you say: “___ the test!”',
          bank: ['Good luck with', 'Hello there and', 'I remembered about', 'Hope you pass'],
          answer: 'Good luck with',
        },
      ],
    },

    {
      id: 'sc-4',
      title: 'Group projects',
      blurb: 'Forced proximity, and how to use it.',
      items: [
        {
          t: 'concept',
          title: 'A shared task removes the pressure',
          body: 'Group work is the easiest social setting there is, because the conversation has a built-in subject and nobody has to justify talking to anyone. If you want to get to know someone, being in a group with them beats any opener.',
          tip: 'Volunteer to do a bit of it together rather than splitting it up and disappearing.',
        },
        {
          t: 'choice',
          prompt: 'Nobody in your group is doing anything and it is due Friday. What is the best move?',
          options: [
            { text: 'Do the whole thing yourself and resent everyone.', why: 'It gets the grade and teaches everyone that you are the person who will absorb it. It also happens again next time.' },
            { text: 'Say “right — I will do this bit, can you two do those?” and be specific.', ok: true, why: 'Someone has to allocate, and whoever does it is running the group. Specific tasks get done; “we should all contribute” does not.' },
            { text: 'Complain to the teacher.', why: 'Sometimes necessary, rarely first. It also costs you standing with the group for the rest of the year.' },
            { text: 'Wait and see if someone else steps up.', why: 'Everyone is waiting. That is why nothing is happening.' },
          ],
        },
        {
          t: 'concept',
          title: 'Being the organiser is a status move',
          body: 'Nobody wants to divide up the work, so whoever does it quietly becomes the person the group listens to. It is not bossy if you take a fair share yourself and ask rather than order.',
          example: { label: 'How it sounds', line: '“I do not mind doing the slides — does someone want to do the research bit?”' },
        },
        {
          t: 'multi',
          prompt: 'Which of these work in a group task?',
          options: [
            { text: 'Naming specific jobs rather than “everyone do some”', ok: true },
            { text: 'Taking a fair share yourself first', ok: true },
            { text: 'Doing everything and saying nothing', ok: false },
            { text: 'Asking the quiet person what they want to do', ok: true },
            { text: 'Deciding everything without asking anyone', ok: false },
          ],
          why: 'Allocate clearly, carry your share, and include people. That is basically the entire job.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'Being in a group with someone is one of the best ways to get to know them.',
          answer: true,
          why: 'Shared tasks remove the awkwardness of having to justify the conversation. A lot of friendships and more start exactly here.',
        },
        {
          t: 'freeform',
          prompt: 'Allocate the work.',
          context: 'Four of you, nothing done, due in three days. Write what you say to the group.',
          rubric: {
            want: ['i', 'do', 'can', 'you', 'll', 'will', 'bit', 'part', 'who', 'wants', 'does'],
            avoid: ['everyone should', 'we all need to', 'someone needs to'],
            minWords: 8,
            sample: '“Right — I will do the intro and the slides. Can you two take the research, and can you do the ending? Then we are done by Thursday.”',
          },
        },
      ],
    },

    {
      id: 'sc-5',
      title: 'Getting into a group',
      blurb: 'When you are new, or on the edge of one.',
      items: [
        {
          t: 'concept',
          title: 'Groups form around repetition, not events',
          body: 'You do not get into a friend group with one great conversation. You get in by being around repeatedly — same table, same walk home, same club — until you are simply part of the furniture. It is slow and it is reliable.',
          tip: 'Turning up consistently beats being impressive once.',
        },
        {
          t: 'choice',
          prompt: 'You are on the edge of a group you would like to be properly in. Best approach?',
          options: [
            { text: 'Try to become close friends with the most popular one.', why: 'Groups notice this and it reads as climbing. It also puts everything on one relationship.' },
            { text: 'Consistently be around, and get to know the one you click with most.', ok: true, why: 'Groups are entered through one person and confirmed by repetition. Pick whoever you actually get on with, not whoever is most central.' },
            { text: 'Wait to be invited into things.', why: 'Groups rarely issue invitations to people on the edge, mostly because they assume you have your own thing going on.' },
            { text: 'Change how you act to fit what they are like.', why: 'Exhausting, and people can tell. Groups take in people who are consistent far more easily than people who are matching.' },
          ],
        },
        {
          t: 'concept',
          title: 'Be useful, funny or kind — pick one',
          body: 'Every group has room for someone who makes it better in one clear way. The one who is genuinely nice to everyone. The one who is funny. The one who organises things. You do not need all three, and you do not need to be the most interesting person there.',
        },
        {
          t: 'multi',
          prompt: 'Which of these get you into a group?',
          options: [
            { text: 'Turning up to the same thing repeatedly', ok: true },
            { text: 'Getting on properly with one person in it', ok: true },
            { text: 'Trying to be the funniest person there', ok: false },
            { text: 'Being the one who suggests plans', ok: true },
            { text: 'Agreeing with everything everyone says', ok: false },
          ],
          why: 'Repetition, one real connection, and being someone who adds something. Performing and total agreement both read as effort rather than fit.',
        },
        {
          t: 'tf',
          prompt: 'True or false?',
          statement: 'If a group does not include you straight away, it means they do not want you there.',
          answer: false,
          why: 'Existing groups run on habits, not decisions. Most of the time nobody has decided anything about you at all — you simply have not been around enough yet.',
        },
        {
          t: 'order',
          prompt: 'Order the realistic route into a group.',
          items: [
            'Be around the same places they are, regularly',
            'Get to know one of them properly',
            'Get invited to something small',
            'Become someone they assume is coming',
          ],
        },
      ],
    },
  ],
};
