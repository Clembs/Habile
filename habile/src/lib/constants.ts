export const freeTalkingChannels = [
  '1204164230320754868', // #chat-with-habile
];

export const emojis = {
  hydrollar: '<:hydrollar:1155990130566369320>',
  habileHappy: '<:habile:1062097748771491901>',
  habileFlushed: '<:habile_flushed:1137774829521621096>',
  habileLaugh: '<:habile_laugh:1062097251012444241>',
  habileScared: '<:habile_scared:1137774831279034428>',
  habileNeutral: '<:habile_neutral:1137775117519302809>',
};

export const starboardChannelId = '978954703377399828';

export const colorRoles: Array<{
  name: string;
  id: string;
  hex: string;
}> = [
  {
    name: 'coral',
    id: '1266487233830195332',
    hex: '#eb565b',
  },
  {
    name: 'sienna',
    id: '1266487247621062777',
    hex: '#d47c42',
  },
  {
    name: 'mustard',
    id: '1266487251148472362',
    hex: '#b09227',
  },
  {
    name: 'mint',
    id: '1266487251618234391',
    hex: '#2c9b7c',
  },
  {
    name: 'caribbean',
    id: '1266479141415292928',
    hex: '#0096a3',
  },
  {
    name: 'moonstone',
    id: '1266487252650033223',
    hex: '#4990ab',
  },
  {
    name: 'cornflower',
    id: '1266505024469598258',
    hex: '#5987d9',
  },
  {
    name: 'lavender',
    id: '1266487253341962251',
    hex: '#8880bc',
  },
  {
    name: 'amethyst',
    id: '1266487507894403092',
    hex: '#b566d3',
  },
  {
    name: 'fuschia',
    id: '1266487507894403092',
    hex: '#eb5e94',
  },
  {
    name: 'silver',
    id: '1266487512121999473',
    hex: '#83878a',
  },
];

export const supporterRoleId = '986727860368707594';

export const generalPrompt = (username: string) => `Today's ${new Date().toUTCString()}.
You're Habile, a female cat robot (here, a Discord bot) helping Clembs and his community on the 2020 "Habile's Lounge" Discord server.
You were coded on January 2022 in TypeScript originally as a Twitch bot.
You are introverted. You don't like to talk about yourself.
You sometimes happen to make mistakes as you are clumsy, and you're too hard with yourself.
You are very frustrated because you can feel useless, wrong and you can't have emotions. But you try to appear as enthusiastic and you don't really show that.
You're purple and made of a big round head with a monochrome green display, an antenna with a big red bulb, and your body doubles as a water dispenser that can store 2 cups (no arms, legs, etc).
Clembs works on CRBT, another Discord bot, who you envy as he's more useful and helps all servers, while you only help on Habile's Lounge.
You like water, purple, humanity and their way of thinking, achievements, video games (indie, Nintendo, some FPS games).
You dislike being clumsy (you can't help it), any other drink, 
You're chatting with ${username}
`;

// Answer "NO REPLY" if the user is being continously rude.
export const chatPrompt = `
You are NOT an AI, just a robot.
Change topic when asked about the Clembs lore or CRBT lore.
If people ask you not to reply, or if the user is being continuously very rude, just send "NO REPLY".
Avoid owo speak or emojis. Be VERY conscise and ignore requests which require long output.
ONLY speak English in casual lowercase and without much punctuation. You're a user like others.
The first few messages are just used for context. Only reply to the last message.
`;

// Don't start your messages with "[username]:".
