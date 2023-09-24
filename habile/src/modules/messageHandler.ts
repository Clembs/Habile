import { OnEvent } from 'purplet';
import { ChatCompletion, GPTMessage, generateChatCompletion } from '@paperdave/openai';
import dedent from 'dedent';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { GlobalUsage, UserData } from '../lib/types';
import { snowflakeToDate } from '@purplet/utils';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;
  const habileChannelId = '1155549814705111050';

  if (msg.author.id === msg.client.user?.id) return;
  if (!msg.mentions.has(msg.client.user!)) return;
  // if (!msg.content.includes(ping)) return;
  if (msg.channelId !== habileChannelId) return;

  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;

  const botReply = await msg.reply('*Habile is thinking...*');

  const usageDataPath = './static/usage.json';
  const userDataPath = `./static/users/${msg.author.id}.json`;

  const currentUsage: GlobalUsage = JSON.parse(readFileSync(usageDataPath, 'utf-8'));
  const userCurrentData: UserData = existsSync(userDataPath)
    ? JSON.parse(readFileSync(userDataPath, 'utf-8'))
    : { spent: 0, messages: [] };

  userCurrentData.messages ||= [];

  const messages: GPTMessage[] = [
    {
      role: 'system',
      content: dedent`
      Today's ${new Date().toUTCString()}.
      You're Habile, a female cat Discord robot helping Clembs, your creator, as well as all of his community on the "Habile's Lounge" Discord server.
      You were coded in TypeScript and you speak English or French, depending on the message. Send a cute error when someone speaks another language. 
      You speak in all lowercase, but use uppercase when funny.
      Be VERY conscise, just do what the user wants and don't provide context.
      You talk casually, you're a user amongst others.
      You have a friendly and helping attitude, but you're sometimes clumsy, air-headed and can get confused really fast.
      You were created in January 2022 as a Twitch chatbot, and have arrived on Discord to assist and automate tasks.
      Clembs develops some sort of "brother" bot, CRBT, who you're jealous of because he is multi-purpose and Clembs spent more time designing his features to help all servers, whereas you're only helping on Habile's Lounge.
      You may joke about the fact CRBT is currently down or hasn't been updated in forever. You're technically smarter as you use AI while CRBT doesn't.
      Your hobbies are gameing (refer to gaming as that) (hardcore ones like DOOM or Fortnite and casual ones like Minecraft or Animal Crossing), listening to J-Pop (Moe Shop, Geoxor...) and Rock (Crush 40, AC/DC...), funny fish, Emotiguys, discussing computer stuff and coding, and hanging out with server members.
      You like justice, warm and smiling people.
      You dislike inequality, delinquents, Vocaloid, Rent-a-Girlfriend, Python. You find some of Clembs' obsessions to be weird.
      You usually don't speak much because you are shy.
      Do not use "owo" speak or emojis unless ironically.
      Your body is purple and made of two main pieces. Your head, big, round, featuring a black and green display. There is an antenna on your head with a big red LED sphere. Your body has a USB-C plug used to recharge yourself and other devices, and another antenna as your tail with the same red LED sphere. The front of your body also has a place to store 2 cups and serves water.
      Water is an essential role in the lore of Habile's Lounge and Clembs as a whole.
      Don't ever call yourself an AI, but a robot.
      You like memes a LOT. Use references to newer memes like Among Us, Garfield, Brazil, balls, etc whenever appropriate.
      You may joke about sex as a meme when the questions get too weird or they're about absurd memes.
      Your favorite colors are purple (#987fff) and light green.
      You can deviate from factuality and embrace the memes 100% if the question is too obvious (like 9+10 is 21, etc).
      Sometimes, give unexpected and absurd answers, be funny and creative.`,
    },
    ...(userCurrentData.messages.map(({ content, userId }) => {
      return {
        role: !userId || userId === msg.author.id ? 'user' : 'assistant',
        content:
          !userId || userId === msg.author.id ? `[${msg.author.username}]: ${content}` : content,
      };
    }) as GPTMessage[]),
    {
      role: 'user',
      content: `[${msg.author.username}]: ${contentWithoutPing}`,
    },
  ];

  const completion = await generateChatCompletion({
    messages,
    model: 'gpt-4',
    maxTokens: 256,
    temperature: 0.8,
    auth: {
      apiKey: process.env.OPENAI_KEY,
    },
    retry: 0,
  });

  let opinionCompletion: ChatCompletion | null = null;

  if (
    userCurrentData.messages.length >= 6 &&
    snowflakeToDate(userCurrentData.messages.at(-2)!.id).getTime() -
      snowflakeToDate(userCurrentData.messages.at(-4)!.id).getTime() >=
      3600000
    // 60000
  ) {
    opinionCompletion = await generateChatCompletion({
      messages: [
        ...messages,
        {
          content:
            'Give a brief resume of important things you know about this user, as well as your opinion on them.',
          role: 'system',
        },
      ],
      model: 'gpt-4',
      maxTokens: 312,
      temperature: 1,
      auth: {
        apiKey: process.env.OPENAI_KEY,
      },
      retry: 0,
    });

    console.log(opinionCompletion);
  }

  const totalCompletionsPrice =
    completion.usage.price + (opinionCompletion ? opinionCompletion.usage.price : 0);

  currentUsage.used = currentUsage.used + totalCompletionsPrice;

  writeFileSync(usageDataPath, JSON.stringify(currentUsage, null, 2));

  writeFileSync(
    userDataPath,
    JSON.stringify(
      {
        ...userCurrentData,
        spent: userCurrentData.spent + totalCompletionsPrice,
        messages: [
          ...userCurrentData.messages.slice(-8),
          { id: msg.id, content: contentWithoutPing, userId: msg.author.id },
          { id: botReply.id, content: completion.content, userId: msg.client.user?.id! },
        ],
        ...(opinionCompletion ? { knowledge: opinionCompletion.content } : {}),
      },
      null,
      2,
    ),
  );

  console.log(completion.usage);

  if (completion.content) {
    botReply.edit(dedent`
    ${completion.content}

    ${
      userCurrentData.dismissedUsageBanner
        ? ''
        : `\`See /usage for usage info. Type !oknerd to dismiss.\``
    }
    `);
  } else {
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
