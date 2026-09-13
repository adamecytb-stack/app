/* Practice conversations.
 *
 * Each scenario is a spine of turns. A choice carries a score across four
 * dimensions and the reaction it provokes, so the other person feels
 * responsive without needing a combinatorial branch tree.
 *
 *   score: { w: warmth, c: curiosity, f: confidence, k: clarity }   // -1 .. 2
 *
 * `ai` seeds the optional bring-your-own-key mode with the same character.
 *
 * Sam runs through most of these on purpose: class → group chat → DMs →
 * party → the ask. Practising the same person across settings is closer to
 * how it actually goes than six unrelated strangers.
 */

export const DIMENSIONS = [
  { key: 'w', name: 'Warmth', note: 'Did they feel liked?' },
  { key: 'c', name: 'Curiosity', note: 'Did you go after what they said?' },
  { key: 'f', name: 'Confidence', note: 'Did you take up your space?' },
  { key: 'k', name: 'Clarity', note: 'Were you direct and easy to follow?' },
];

export const SCENARIOS = [
  {
    id: 'next-to-them',
    title: 'Sat next to them in class',
    course: 'talking-to-them',
    difficulty: 1,
    setting: 'Science. You have been moved next to Sam for the rest of term. Forty minutes to go and you have said nothing.',
    goal: 'Say something. Anything. Then keep it going for more than one line.',
    persona: { name: 'Sam', initial: 'S', note: 'Friendly, a bit shy' },
    ai: {
      character: 'Sam, 14, sitting next to the user in a science lesson they have been moved to. Friendly but a bit reserved at first — warms up properly if the other person is relaxed and easy, goes short and quiet if they are intense or try too hard. Into art and football. Speaks like a normal 14-year-old: short sentences, not formal.',
      opening: '*gets their book out, glances over* “hey”',
    },
    turns: [
      {
        npc: '*gets their book out, half looks at you* “...hey”',
        choices: [
          { text: '“hey. Do you actually get any of this?”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*small laugh* “No. Genuinely none of it. I have written the title.”', note: 'The perfect opener for this: shared situation, tiny confession, easy to answer. The bar is low on purpose.' },
          { text: '“hey”', s: { w: 1, c: 0, f: 0, k: 1 }, reaction: '“hey.” *looks back at their book*', note: 'Not wrong, just nothing. You both said hey and now you are back to silence with the awkwardness intact.' },
          { text: 'Say nothing and hope they speak first.', s: { w: -1, c: -1, f: -1, k: 0 }, reaction: '*they get their pen out. The lesson starts.*', note: 'They already went first. Not returning it usually gets read as you not wanting to talk.' },
          { text: '“so what do you like doing outside school?”', s: { w: 0, c: 1, f: 1, k: 0 }, reaction: '“um... normal stuff I guess?” *slightly caught off guard*', note: 'Too big a jump from one “hey”. It is a good question for later — right now it feels like an interview starting.' },
        ],
      },
      {
        npc: '“I have got no idea what she is talking about. I missed last lesson.”',
        choices: [
          { text: '“Why, were you off?”', s: { w: 1, c: 2, f: 1, k: 2 }, reaction: '“Yeah I had a thing with my knee, football. Could not walk properly for a week.”', note: 'You pulled the thread instead of just agreeing. Two words, and now there is an actual topic.' },
          { text: '“Same, I never know what is going on.”', s: { w: 1, c: 0, f: 1, k: 1 }, reaction: '“Ha, yeah.” *pause*', note: 'Agreeing is friendly and it closes. Agree, then add something or ask — otherwise you are back to nothing.' },
          { text: '“You can copy mine if you want.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“Wait, seriously? You are a lifesaver.” *properly turns towards you*', note: 'Genuinely useful, and doing something for someone is a shortcut to being liked. Costs you nothing.' },
          { text: '“You should probably catch up then.”', s: { w: -1, c: -1, f: 1, k: 2 }, reaction: '“...Yeah. Thanks.” *turns back to their book*', note: 'Accidentally sounds like a telling-off. They told you a small problem and you handed it straight back.' },
        ],
      },
      {
        npc: '“What did you put for question three? I have written absolute rubbish.”',
        choices: [
          { text: '“Also rubbish. Mine says “because of the reaction” which I think is technically just repeating the question.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*laughs properly* “That is exactly what mine says. We are going to fail together.”', note: 'A specific, self-deprecating answer. Specific is what makes it funny — “I do not know either” would have been flat.' },
          { text: '“I have not done it.”', s: { w: 0, c: 0, f: 0, k: 2 }, reaction: '“Oh. Fair.” *looks back down*', note: 'True, and a full stop. One extra clause would have kept it alive.' },
          { text: '“I got it right I think, do you want me to explain it?”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“Go on then.” *shifts their chair over*', note: 'Helpful and confident. Just watch the tone — explaining can tip into lecturing if you go on too long.' },
          { text: '*shrug*', s: { w: -1, c: -1, f: -1, k: -1 }, reaction: '*they turn to ask the person behind instead*', note: 'A shrug is an answer that closes every door at once. They asked you directly — that was the easy part done for you.' },
        ],
      },
        {
        npc: '*bell goes, they start packing up* “right, see you”',
        choices: [
          { text: '“See you Thursday — let me know if your knee explodes again.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*laughs* “I will keep you updated.” *actually smiles at you*', note: 'A callback in the goodbye. It proves you were listening, and the last ten seconds are what they will remember.' },
          { text: '“Bye.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“Bye.” *leaves*', note: 'Fine. Also the flattest possible ending to a conversation that was going well.' },
          { text: '“Are you sitting here next lesson too?”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '“Think so, she said it is permanent.” *shrugs, smiles*', note: 'Low-key and forward-looking. It reads much better after a good conversation than as an opener.' },
          { text: '*look at your bag until they have gone*', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '*they leave*', note: 'You did the whole hard part and then skipped the free bit at the end.' },
        ],
      },
    ],
  },

  {
    id: 'group-chat',
    title: 'The group chat',
    course: 'texting',
    difficulty: 1,
    setting: 'The chat for your class. Sam has just posted something. Thirty people can see everything you type.',
    goal: 'Be funny in front of an audience without trying too hard — then take it private.',
    persona: { name: 'Sam', initial: 'S', note: 'In the chat with everyone else' },
    ai: {
      character: 'Sam, 14, messaging in a class group chat and then in DMs. Types like a teenager — lowercase, short, occasional typos, no full stops. Funny and quick if the other person is relaxed. Goes brief and polite if they are intense, needy, or obviously performing.',
      opening: '*in the group chat* “has anyone actually done the history thing or are we all just not doing it”',
    },
    turns: [
      {
        npc: '*in the group chat* “has anyone actually done the history thing or are we all just not doing it”',
        choices: [
          { text: '“I have done the title and drawn a box around it”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*Sam reacts 😭* “that is more than me”', note: 'Funny, specific, and it answers the question. The detail — the box — is what makes it land.' },
          { text: '“not doing it”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '*two people react. Sam does not.*', note: 'Fine, and it disappears into the chat. Nothing wrong with it, nothing in it either.' },
          { text: '“I have done it if you want to copy 😉”', s: { w: 0, c: 0, f: 1, k: 1 }, reaction: '*Sam does not reply. Someone else says “go on then”.*', note: 'The wink aimed at one person in a group of thirty is visible to all thirty, and it puts them on the spot publicly.' },
          { text: 'Type something, delete it, say nothing.', s: { w: -1, c: -1, f: -1, k: 0 }, reaction: '*the chat moves on*', note: 'The most common move in every group chat. The bar for posting is far lower than you think it is.' },
        ],
      },
      {
        npc: '*Sam, in the chat* “honestly at this point I am just going to write what I remember from the film”',
        choices: [
          { text: '“which film. we did not watch a film”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*Sam* “...we did not watch a film” *Sam* “oh no”', note: 'You picked the funny thread and pulled. This is the one that gets a proper reaction, and it made them laugh at themselves.' },
          { text: '“same 😂😂”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '*nothing*', note: '“same” plus emojis is chat filler. It is seen and forgotten within four seconds.' },
          { text: '“that is actually a really good idea”', s: { w: 1, c: 0, f: 1, k: 2 }, reaction: '*Sam* “right?? I am doing it”', note: 'Warm and it keeps the thread alive. Slightly safe, but there is nothing wrong with safe.' },
          { text: '“you are so funny hahaha”', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '*no reply*', note: 'Complimenting the joke rather than joining it. In a public chat it reads as trying, and everyone can see it.' },
        ],
      },
      {
        npc: '*Sam, in the chat* “ok who actually understands question 4, I will pay you”',
        choices: [
          { text: '*DM them* “I do actually understand q4 if you want, group chat is chaos”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*Sam, replying in DMs* “oh my god yes please. the group chat is useless”', note: 'A real reason to move to DMs, and it is genuinely helpful. This is the cleanest way to get from a group chat to a one-to-one.' },
          { text: '*in the chat* “I do”', s: { w: 1, c: 0, f: 1, k: 2 }, reaction: '*four other people reply at once. It gets lost.*', note: 'You offered — into a crowd. The chance was there to make it one-to-one and you left it public.' },
          { text: '*DM them* “hey”', s: { w: 0, c: 0, f: 0, k: 0 }, reaction: '*Sam* “hey”', note: 'You had a perfect reason to DM and used none of it. Now you are starting from nothing in a new window.' },
          { text: 'Say nothing, but screenshot it.', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '*nothing happens*', note: 'This is the move that keeps people exactly where they are for a whole year.' },
        ],
      },
      {
        npc: '*in DMs* “ok explain it to me like I am extremely stupid”',
        choices: [
          { text: '“ok so basically [the answer]. and honestly I only know because I got it wrong first”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“ohhh that actually makes sense. thank you genuinely”', note: 'Helpful plus a small confession so you are not above them. That combination is very hard to dislike.' },
          { text: '“it is quite easy really”', s: { w: -1, c: 0, f: 1, k: 1 }, reaction: '“...right”', note: 'Four words that make someone feel stupid for asking. They will not ask you again.' },
          { text: '“I will explain if you tell me something first”', s: { w: 0, c: 0, f: 1, k: 0 }, reaction: '“...what? just tell me 😭”', note: 'Making them earn help turns a warm moment into a game. Just be useful — it is worth more.' },
          { text: '“[the answer]. also what were you saying about the film, I need to know”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '“DO NOT bring that up again” *followed by three messages about it*', note: 'Answer plus a callback. You helped and reopened the funniest thing either of you had said. Best possible move.' },
        ],
      },
    ],
  },

  {
    id: 'late-dms',
    title: 'DMs, half nine at night',
    course: 'texting',
    difficulty: 2,
    setting: 'You have been messaging Sam on and off for a week. It is going well. It is 9:30pm and they have just replied.',
    goal: 'Keep it alive, go one level deeper, and do not let it die at midnight.',
    persona: { name: 'Sam', initial: 'S', note: 'Replying properly, not just politely' },
    ai: {
      character: 'Sam, 14, DMing at night with someone they are starting to like. Types lowercase and short. Opens up gradually if the other person is warm and asks real questions; gets brief if they are boring, needy, or push too hard too fast. Into art, does football, has an older brother they find annoying.',
      opening: '“cannot believe we have double maths tomorrow, genuinely dreading it”',
    },
    turns: [
      {
        npc: '“cannot believe we have double maths tomorrow. genuinely dreading it”',
        choices: [
          { text: '“same. what is the worst lesson for you? because I think for me it is actually PE”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '“PE?? how. also mine is maths, obviously, I am so bad at it”', note: 'Agreed, added something about you, and asked. That is the full rhythm in one message.' },
          { text: '“same”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“yeah”', note: 'A one-word reply at 9:30pm is how a good chat quietly dies. They gave you a feeling and you gave back nothing.' },
          { text: '“you will be fine!! do not worry”', s: { w: 1, c: 0, f: 0, k: 1 }, reaction: '“ha, thanks”', note: 'Kind and it closes the topic. Reassurance ends conversations; curiosity continues them.' },
          { text: '“wanna skip it 😏”', s: { w: 0, c: 0, f: 1, k: 0 }, reaction: '“...I mean no 😭”', note: 'Suggesting something you both know is not happening is a dead end, and it makes you the person who says things for effect.' },
        ],
      },
        {
        npc: '“I am so bad at maths it is actually embarrassing. my brother does it for fun which makes it worse”',
        choices: [
          { text: '“for FUN? what is wrong with him”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '“genuinely everything. he is 17 and he does puzzles. voluntarily” *three more messages about the brother*', note: 'You went for the funniest thing in the message. They now have something they actually want to talk about.' },
          { text: '“you are not bad at it”', s: { w: 1, c: 0, f: 0, k: 1 }, reaction: '“I am though lol”', note: 'Contradicting someone about their own experience is meant kindly and lands as not listening.' },
          { text: '“have you got an older brother? what is he like”', s: { w: 1, c: 2, f: 1, k: 2 }, reaction: '“yeah, 17, deeply annoying. he is good at literally everything which is a lot”', note: 'Good instinct going for the brother. Slightly formal for DMs, but it opens the right door.' },
          { text: '“I am good at maths if you ever need help”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“oh actually yeah, might take you up on that”', note: 'Useful, and it creates a reason to talk again. It does skip past the feeling they just shared.' },
        ],
      },
      {
        npc: '“honestly it is fine, I just get compared to him a lot. anyway this got deep 😭 sorry”',
        choices: [
          { text: '“do not apologise, that sounds genuinely annoying. being compared to someone constantly is the worst”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“...yeah. it really is” *pause* “nobody has really said that before”', note: 'You did not rush past it. Naming the feeling accurately is the single strongest move in any conversation.' },
          { text: '“haha yeah anyway what are you doing at the weekend”', s: { w: -1, c: -1, f: 1, k: 2 }, reaction: '“nothing much”', note: 'They opened up slightly and you changed the subject. It reads as “I do not want to hear that” even if you just got nervous.' },
          { text: '“that sucks”', s: { w: 1, c: 0, f: 1, k: 1 }, reaction: '“yeah.”', note: 'Correct sentiment, minimum effort. Two more words would have turned this into the good part of the night.' },
          { text: '“I get that, my parents do the same thing with my cousin. it is so annoying”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“wait really? what do they say” *properly engaged now*', note: 'Matching a disclosure with your own is how people get closer. Just make sure you hand it back, which you did.' },
        ],
      },
      {
        npc: '“it is nearly half 11. I should sleep. this was nice though”',
        choices: [
          { text: '“it was. night — and good luck with double maths, I will be watching your face”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“do NOT watch my face. night 😭”', note: 'Warm, funny, callback, and it ends the night on a high instead of letting it trail off.' },
          { text: '“night”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '“night”', note: 'Perfectly fine, slightly cold after the conversation you just had. The ending sets the tone for tomorrow.' },
          { text: '“wait do not go, one more thing”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“I really do have to sleep 😭 talk tomorrow”', note: 'They said they were going. Holding someone past the end is the thing that makes the next chat feel like work.' },
          { text: '“it was nice. we should do something at the weekend actually”', s: { w: 2, c: 0, f: 2, k: 1 }, reaction: '“yeah? like what” *interested*', note: 'Good instinct and good timing — right after a great conversation. Now you need a day and a thing, not “something”.' },
        ],
      },
    ],
  },

  {
    id: 'at-the-party',
    title: 'They are at the same party',
    course: 'parties',
    difficulty: 3,
    setting: 'Someone’s house. Sam is across the room with three of their friends. You have been aware of exactly where they are for an hour.',
    goal: 'Get into the conversation without making it obvious, and leave it better than you found it.',
    persona: { name: 'Sam', initial: 'S', note: 'With their friends' },
    ai: {
      character: 'Sam, 14, at a house party with a few friends around. Pleased to see the user but slightly self-conscious with friends nearby. Warm and funny if the user is relaxed with the whole group; awkward and short if the user only talks to them or is obviously nervous.',
      opening: '*across the room with friends, spots you, small wave*',
    },
    turns: [
      {
        npc: '*spots you across the room, small wave, goes back to their group*',
        choices: [
          { text: 'Wave back, carry on talking to who you are with, go over in ten minutes.', s: { w: 1, c: 0, f: 2, k: 1 }, reaction: '*ten minutes later they have moved to the kitchen and it is easier*', note: 'Patient and relaxed. Not going over instantly is not a missed chance — it is you not looking like you were waiting.' },
          { text: 'Go straight over and stand next to them without saying anything to the group.', s: { w: -1, c: 0, f: 0, k: 0 }, reaction: '*the group quietens slightly. Sam looks a bit caught out.*', note: 'Everyone clocks it, including the friends, and it puts Sam on the spot in front of them.' },
          { text: 'Go over and say hi to the whole group.', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '“Oh hey!” *one of their friends shuffles over to make room*', note: 'The right move. Their friends deciding you are alright is worth more than any single conversation with Sam.' },
          { text: 'Wave and then avoid them all night.', s: { w: -1, c: -1, f: -1, k: 0 }, reaction: '*you do not speak all night*', note: 'The most common outcome at every party, and it always feels worse on the way home than any awkward conversation would have.' },
        ],
      },
      {
        npc: '*the group is mid-story about someone falling in a pond on a school trip*',
        choices: [
          { text: 'Laugh at the right bit, then “wait, who fell in?”', s: { w: 2, c: 2, f: 2, k: 2 }, reaction: '*the storyteller turns to include you* “right, so —” *and you are in the group*', note: 'You joined the story instead of interrupting it. Twenty seconds later you are just someone in the circle.' },
          { text: '“Hi, sorry to interrupt — has everyone met?”', s: { w: 0, c: 0, f: 1, k: 1 }, reaction: '*the story stops. Someone restarts it from the beginning, less well.*', note: 'You made four people pay a small cost. They will not resent it, but they will feel it.' },
          { text: 'Stand there silently waiting for a gap.', s: { w: 0, c: 0, f: -1, k: 0 }, reaction: '*the story ends, the group splits, you have not spoken*', note: 'The gap you are waiting for does not reliably arrive. Reacting is speaking — you do not have to wait for a full opening.' },
          { text: 'Tell your own, better pond story.', s: { w: -1, c: -1, f: 1, k: 1 }, reaction: '*polite laughs. The energy drops slightly.*', note: 'Topping someone’s story ten seconds after arriving is the fastest way to be the person who just turned up and took over.' },
        ],
      },
      {
        npc: '*the group breaks up. Sam stays* “I did not know you were coming”',
        choices: [
          { text: '“Nor did I until about six o’clock. I am glad I did though.”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*small smile* “...yeah. same.”', note: 'Warm with the interest showing, and it does not make a huge deal of itself. This is flirting, done lightly.' },
          { text: '“Yeah, Jess asked me.”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '“Oh, cool.” *pause*', note: 'A fact with no hook. Answer plus one more thing is all that was needed.' },
          { text: '“I have been trying to talk to you all night actually.”', s: { w: 1, c: 0, f: 1, k: 2 }, reaction: '“oh — right” *slightly flustered, not in a bad way*', note: 'Honest and quite bold. It can land well, and it does hand them a lot to react to in the middle of a party.' },
          { text: '“Yeah I am here.”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“...yep.” *long pause*', note: 'They handed you an easy one. Restating the obvious puts the conversation straight back on them.' },
        ],
      },
      {
        npc: '*their friend calls them from the kitchen* “I should probably go — but yeah. See you Monday?”',
        choices: [
          { text: '“See you Monday. I will be the one with no idea what is going on in maths.”', s: { w: 2, c: 1, f: 2, k: 2 }, reaction: '*laughs* “obviously” *and they are still smiling as they walk off*', note: 'Callback, warm, ends on a laugh. The last ten seconds are what gets replayed, and you just made them good.' },
          { text: '“Yeah, see you.”', s: { w: 1, c: 0, f: 1, k: 2 }, reaction: '“See you.” *leaves*', note: 'Completely fine. Also the flattest available ending to a night that was going well.' },
          { text: '“Wait — are you free next weekend?”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '“um — yeah I think so? message me” *their friend calls again*', note: 'Bold and it worked, just about. Being interrupted mid-ask is a risk — this one is usually better over text the next day.' },
          { text: '“Do you have to go?”', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '“...yeah, sorry” *slightly awkward exit*', note: 'It asks them to justify leaving and makes the last moment of the night a small negotiation.' },
        ],
      },
    ],
  },

  {
    id: 'the-ask',
    title: 'Asking them to hang out',
    course: 'making-a-move',
    difficulty: 3,
    setting: 'Sunday afternoon. You have decided today is the day. The chat has been good for two weeks.',
    goal: 'Name a day and a thing, without a paragraph of apologies attached.',
    persona: { name: 'Sam', initial: 'S', note: 'No idea this is coming' },
    ai: {
      character: 'Sam, 14, being asked to hang out over text by someone they like but have not admitted it to themselves about. Slightly surprised, then pleased. Says yes if the ask is clear and light; gets confused and hesitant if it is vague, heavy, or buried in apologies.',
      opening: '“hey! what are you up to”',
    },
    turns: [
      {
        npc: '“hey! what are you up to”',
        choices: [
          { text: '“nothing, genuinely nothing. what are you doing next saturday?”', s: { w: 1, c: 1, f: 2, k: 2 }, reaction: '“I do not think anything? why”', note: 'You set it up in one line without over-explaining. Now the ask can be short, because the question is already open.' },
          { text: '“nothing much you?”', s: { w: 0, c: 0, f: 0, k: 1 }, reaction: '“same honestly”', note: 'You have handed the conversation straight back and used up the opening you were given.' },
          { text: '“so I have been thinking about something and I do not know how to say it”', s: { w: 0, c: 0, f: -1, k: 0 }, reaction: '“...ok?? what” *worried*', note: 'That sentence makes people brace for bad news. Never build a runway — just ask.' },
          { text: '“nothing. do you want to do something sometime?”', s: { w: 1, c: 0, f: 1, k: 0 }, reaction: '“yeah sure!” *and nothing ever happens*', note: '“Sometime” gets a yes that means nothing. Two people can agree to this and never meet.' },
        ],
      },
      {
        npc: '“I do not think I am doing anything saturday. why?”',
        choices: [
          { text: '“there is that thing in town saturday. come with me”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“oh — yeah! ok. what time?”', note: 'Day, thing, invitation. Eight words and it is done. Short is what makes it feel easy rather than enormous.' },
          { text: '“sorry this is so random and obviously no pressure at all and it is totally fine if not but I was maybe wondering if you might possibly want to do something maybe?”', s: { w: 0, c: 0, f: -1, k: -1 }, reaction: '“haha you are being so weird. yeah maybe?”', note: 'Every apology added weight. By the end they can feel how much it cost you, which makes it awkward for both of you.' },
          { text: '“no reason”', s: { w: -1, c: 0, f: -1, k: -1 }, reaction: '“...ok?”', note: 'You built the opening and then shut it yourself. This is how people end up doing this for months.' },
          { text: '“me and a couple of people are going into town saturday, you should come”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“yes definitely, what time are you going”', note: 'The group version. Lower stakes for both of you and it works just as well — it is not a lesser move.' },
        ],
      },
      {
        npc: '“yeah ok! what time? and is it just us or”',
        choices: [
          { text: '“like 12? and yeah just us unless you want me to invite the whole year”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“😭 no just us is good”', note: 'Answered clearly and defused the slightly loaded question with a joke. Exactly the right amount of light.' },
          { text: '“whatever you want, I do not mind, whenever suits you”', s: { w: 0, c: 0, f: -1, k: -1 }, reaction: '“I do not mind either 😭” *now nobody is deciding*', note: 'Total flexibility sounds polite and creates a stalemate. Whoever asked should pick the time.' },
          { text: '“just us. is that ok?”', s: { w: 1, c: 1, f: 1, k: 2 }, reaction: '“yeah that is good” *nice, if slightly nervous*', note: 'Clear, and checking is genuinely considerate. It just gives away a bit of nerve you did not need to give.' },
          { text: '“I mean I can invite other people if you would rather”', s: { w: 0, c: 0, f: -1, k: 0 }, reaction: '“um, up to you?” *the energy drops*', note: 'Retreating immediately after a yes. They already said yes — you do not need to give them a way out.' },
        ],
      },
      {
        npc: '“ok cool. see you saturday then 🙂”',
        choices: [
          { text: '“see you saturday”', s: { w: 1, c: 0, f: 2, k: 2 }, reaction: '🙂', note: 'Clean. You got the yes and you stopped talking, which is genuinely the hardest part of this.' },
          { text: '“cannot wait 😁 this is going to be so good, I am so glad you said yes, I was so nervous asking”', s: { w: 1, c: 0, f: -1, k: 1 }, reaction: '“haha ok!” *slightly overwhelmed*', note: 'Enthusiasm is good; three messages of it right after a yes puts a lot of weight on a Saturday in town.' },
          { text: '“unless you change your mind obviously lol”', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '“why would I change my mind 😭”', note: 'Handing them an exit they did not ask for. It reads as expecting to be let down.' },
          { text: '“see you saturday. I will find the one place that does decent chips beforehand”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“this is already the best plan I have had all year”', note: 'Warm, light, and it makes the plan feel real. Small specifics are what turn an agreement into something they look forward to.' },
        ],
      },
    ],
  },

  {
    id: 'after-a-no',
    title: 'When they say no',
    course: 'making-a-move',
    difficulty: 2,
    setting: 'You told Sam you liked them. They have just replied. This is the bit everyone is scared of.',
    goal: 'Keep your dignity, keep the friendship possible, and do not negotiate.',
    persona: { name: 'Sam', initial: 'S', note: 'Being honest, and finding it hard' },
    ai: {
      character: 'Sam, 14, who has just been told by a friend that they like them, and does not feel the same. Kind, a bit awkward, genuinely does not want to hurt them. Relieved and warm if the other person takes it gracefully; uncomfortable and withdrawn if they argue, sulk, or ask why repeatedly.',
      opening: '“I really did not expect that. you are honestly one of my favourite people but I do not think I feel the same way, I am sorry”',
    },
    turns: [
      {
        npc: '“I did not expect that at all. you are honestly one of my favourite people but I do not think I feel the same. I am really sorry”',
        choices: [
          { text: '“that is ok. thanks for actually telling me instead of being weird about it”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“...thank you for being normal about it. I was dreading this”', note: 'Short, warm, done. This is genuinely the best available response and it keeps everything intact.' },
          { text: '“why though?”', s: { w: 0, c: 1, f: -1, k: 1 }, reaction: '“I do not really know, I just... do not? sorry” *uncomfortable*', note: 'It asks them to justify a feeling they cannot explain, and no answer will make you feel better.' },
          { text: '“I did not really mean it anyway”', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '“...oh. ok” *confused and a bit hurt*', note: 'Everyone can tell. It protects you for ten seconds and makes the honest thing you did into a lie.' },
          { text: '“ok”', s: { w: -1, c: 0, f: 0, k: 1 }, reaction: '“...are you ok?” *worried*', note: 'One word reads as cold, and now they have to look after your feelings on top of everything else.' },
        ],
      },
      {
        npc: '“I do not want this to be weird. you are genuinely one of my closest friends”',
        choices: [
          { text: '“it will not be. give me like a week to be normal and then it is fine”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“that is fair. thank you” *visibly relieved*', note: 'Honest — you are not pretending to be instantly fine, and you are not making it their problem. Almost nobody manages this and it is the best answer.' },
          { text: '“it is completely fine, I am totally fine, everything is fine”', s: { w: 1, c: 0, f: 0, k: 0 }, reaction: '“...ok” *not convinced*', note: 'Over-reassuring is its own signal. One honest sentence beats three that nobody believes.' },
          { text: '“it is already weird”', s: { w: -1, c: 0, f: 0, k: 2 }, reaction: '“...yeah” *and now it is*', note: 'True, and saying it out loud makes it permanent instead of temporary.' },
          { text: '“are you sure? like completely sure?”', s: { w: -1, c: 0, f: -1, k: 1 }, reaction: '“...yeah. I am sure” *this is the uncomfortable part*', note: 'Asking them to confirm a no is the first step of negotiating it, and they can feel exactly what it is.' },
        ],
      },
      {
        npc: '“are we ok?”',
        choices: [
          { text: '“yeah. see you monday”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“see you monday 🙂”', note: 'Short and steady. It closes the conversation without drama and gives you both somewhere normal to go next.' },
          { text: '“I do not know”', s: { w: 0, c: 0, f: 1, k: 2 }, reaction: '“oh. ok” *long pause*', note: 'Honest, and it leaves them holding something unresolved. If you need time, say you need time rather than leaving it open.' },
          { text: '“yeah, but can I ask one more thing —”', s: { w: -1, c: 0, f: -1, k: 0 }, reaction: '“...go on” *guarded*', note: 'Extending it after a clean ending is where people undo a good response.' },
          { text: '“yeah we are ok. I might be a bit quiet for a couple of days, it is not about you”', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '“that is completely fine. thank you for saying that” *genuinely grateful*', note: 'Mature and clear. Naming it in advance stops them reading your silence as punishment, which is what usually ruins the friendship.' },
        ],
      },
      {
        npc: '*Monday, in person. They catch your eye in the corridor.*',
        choices: [
          { text: 'Say hi like you always did.', s: { w: 2, c: 0, f: 2, k: 2 }, reaction: '*they visibly relax* “hey”', note: 'The whole thing survives or dies here. Being normal on Monday is worth more than everything you said on Saturday.' },
          { text: 'Look away and keep walking.', s: { w: -1, c: 0, f: -1, k: 1 }, reaction: '*they look a bit hurt and carry on*', note: 'It reads as punishing them for an honest answer — and everyone watching reads it that way too.' },
          { text: 'Go over and check they are still ok with you.', s: { w: 0, c: 0, f: -1, k: 1 }, reaction: '“yeah — we talked about this?” *slightly awkward*', note: 'Reopening it makes them manage your feelings again. It was settled. Let it be settled.' },
          { text: 'Nod and carry on, and say something normal later.', s: { w: 1, c: 0, f: 1, k: 2 }, reaction: '*small nod back*', note: 'Fine if the later part actually happens. If it does not, it becomes avoidance with extra steps.' },
        ],
      },
    ],
  },
];

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}
