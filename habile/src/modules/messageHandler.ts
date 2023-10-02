import { OnEvent } from 'purplet';
import { ChatCompletion, GPTMessage, generateChatCompletion } from '@paperdave/openai';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { GlobalUsage, UserData } from '../lib/types';
import { messagePrompt } from '../lib/prompts';
import { generateKnowledge } from './generateKnowledge';
import {
  firstGlobalUsageWarning,
  firstUserUsageWarning,
  globalUsageLimit,
  secondGlobalUsageWarning,
  secondUserUsageWarning,
  supporterUsageLimit,
  totalCredit,
  userUsageLimit,
} from '../lib/usageLimits';
import { allowedChannels } from '../lib/channels';
import { supporterRoleId } from '../lib/roles';
import { emojis } from '../lib/emojis';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;

  if (msg.author.id === msg.client.user?.id) return;
  if (!msg.mentions.has(msg.client.user!)) return;
  if (!allowedChannels.includes(msg.channelId)) return;

  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;

  const botReply = await msg.reply('*Habile is thinking...*');

  const usageDataPath = './static/usage.json';
  const userDataPath = `./static/users/${msg.author.id}.json`;

  const currentUsage: GlobalUsage = JSON.parse(readFileSync(usageDataPath, 'utf-8'));
  const userCurrentData: UserData = existsSync(userDataPath)
    ? JSON.parse(readFileSync(userDataPath, 'utf-8'))
    : { spent: 0, messages: [] };

  let warning: string;

  if (currentUsage.used >= firstGlobalUsageWarning) {
    warning = '`⚠️` 2/3 of global usage used. Consider donating?';
  }
  if (currentUsage.used >= secondGlobalUsageWarning) {
    warning = '`⚠️` 3/4 of global usage used. Consider donating?';
  }
  if (currentUsage.used >= globalUsageLimit) {
    botReply.edit(
      "`⛔` We have collectively used most of our global usage. Until anyone donates ([Ko-fi](https://ko-fi.com/clembs) or [Boosty](https://boosty.to/clembs)), I cannot communicate with GPT 4 (it's not free!).",
    );
    return;
  }

  const userLimit = msg.member.roles.cache.has(supporterRoleId)
    ? supporterUsageLimit
    : userUsageLimit;
  if (userCurrentData.spent >= firstUserUsageWarning) {
    warning = `\`⚠️\` You've used ${emojis.hydrollar} ${Math.ceil(userCurrentData.spent * 100)} / ${
      userLimit * 100
    } of your usage. Consider ChatGPT, less prompts or donating?`;
  }
  if (msg.author.id !== '327690719085068289' && userCurrentData.spent >= userLimit) {
    botReply.edit(
      `\`⛔\` You've exceeded your allowed ${emojis.hydrollar} ${
        userLimit * 100
      } of usage. Consider donating?`,
    );

    return;
  }

  userCurrentData.messages ||= [];
  userCurrentData.messagesUntilKnowledge ??= 5;

  const messages: GPTMessage[] = [
    {
      role: 'system',
      content: messagePrompt,
    },
    ...(userCurrentData.knowledge
      ? [
          {
            role: 'system',
            content: `Your knowledge about ${msg.author.username}: ${userCurrentData.knowledge}`,
          } as GPTMessage,
        ]
      : []),
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

  userCurrentData.messagesUntilKnowledge -= 1;

  if (userCurrentData.messagesUntilKnowledge <= 0) {
    userCurrentData.messagesUntilKnowledge = 5;

    await botReply.edit('*Saving knowledge...*');

    opinionCompletion = await generateKnowledge(msg.author, messages);

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
        total: totalCredit,
        spent: userCurrentData.spent + totalCompletionsPrice,
        messages: [
          ...userCurrentData.messages.slice(-4),
          { id: msg.id, content: contentWithoutPing, userId: msg.author.id },
          { id: botReply.id, content: completion.content, userId: msg.client.user?.id! },
        ],
        messagesUntilKnowledge: userCurrentData.messagesUntilKnowledge,
        ...(opinionCompletion ? { knowledge: opinionCompletion.content } : {}),
      },
      null,
      2,
    ),
  );

  if (completion.content) {
    botReply.edit(`${completion.content}\n\n${warning ? `${warning}\n` : ''}`);
  } else {
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
