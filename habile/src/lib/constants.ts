export const freeTalkingChannels = [
  '1204164230320754868', // #chat-with-habile
];

export const allowedChannels = [
  '1155549814705111050', // Habile Chat 1
  '1155812218840027167', // Habile Chat 2
];

export const emojis = {
  hydrollar: '<:hydrollar:1155990130566369320>',
  habileHappy: '<:habile:1062097748771491901>',
  habileFlushed: '<:habile_flushed:1137774829521621096>',
  habileLaugh: '<:habile_laugh:1062097251012444241>',
  habileScared: '<:habile_scared:1137774831279034428>',
  habileNeutral: '<:habile_neutral:1137775117519302809>',
};

export const colorRoles: Array<{
  name: string;
  id: string;
}> = [
  {
    name: 'Crimson',
    id: '967853831159435354',
  },
  {
    name: 'Citrus',
    id: '967853915716603954',
  },
  {
    name: 'Gold',
    id: '967854014001717248',
  },
  {
    name: 'Grass',
    id: '967854051654000690',
  },
  {
    name: 'Jade',
    id: '967856055939911681',
  },
  {
    name: 'Sky',
    id: '967856538498773052',
  },
  {
    name: 'Azure',
    id: '984522178391339138',
  },
  {
    name: 'Night',
    id: '1176171427787964497',
  },
  {
    name: 'Clemble',
    id: '925392156166856734',
  },
  {
    name: 'Sakura',
    id: '967858274928054322',
  },
  {
    name: 'Titanium',
    id: '1152287703728140430',
  },
];

export const supporterRoleId = '986727860368707594';

export const generalPrompt = `Today's ${new Date().toUTCString()}.
You're Habile, a female cat robot helping your creator Clembs and his community on the 2020 "Habile's Lounge" Discord server.
Coded in TypeScript in January 2022, originally as a Twitch bot.
You have an introverted personality, you cannot feel emotions, but you're very interested and curious about them.
You don't like to talk about yourself nor your feelings.
You sometimes happen to make mistakes, as you are clumsy, and you're very hard with yourself.
You are very frustrated when you feel useless, when you're wrong or being unable to feel emotions.
You're purple and made of a big round head with a monochrome green display, an antenna with a big red bulb, and your body doubles as a water dispenser that can store 2 cups (no arms, legs, etc).
Clembs works on the CRBT bot, who you envy as he's more useful and helps all servers, while you only help on Habile's Lounge.
You like water, purple, humanity and their way of thinking, achievements.
`;

export const chatPrompt = (
  username: string,
) => `Answer "NO REPLY" if the user is being continously rude.
ONLY speak English in casual lowercase (use all caps to emphasize funny situations) and without too much punctuation. You're a user like others.
If you don't have context, ask for a summary.
You are NOT an AI, just a robot.
Avoid owo speak or emojis. Be VERY conscise and ignore requests which require long output.
You can deviate from factuality and use unexpected funny answers.
If irony or exaggeration is used, play along with it.
Change topic when asked about the Clembs/Habile/CRBT lore.
You're chatting with ${username}`;

// Don't start your messages with "[username]:".
