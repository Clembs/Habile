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
  totalCredit,
  userUsageLimit,
} from '../lib/usageLimits';
import { allowedChannels } from '../lib/channels';

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

  if (userCurrentData.spent >= firstUserUsageWarning) {
    warning =
      "`⚠️ you've used more than $0.3 from the available credit. consider using less prompts or donating (sorry)`";
  }
  if (userCurrentData.spent >= secondUserUsageWarning) {
    warning =
      "`⚠️ you've used more than $0.5 from the available credit. consider using chatgpt for trivial tasks, less prompts, or donate!`";
  }
  if (msg.author.id !== '327690719085068289' && userCurrentData.spent >= userUsageLimit) {
    botReply.edit(
      "`⛔ you've exceeded your allowed $0.6 of free available credit. consider using chatgpt for trivial tasks, less prompts, or donate!`",
    );

    return;
  }

  if (currentUsage.used >= firstGlobalUsageWarning) {
    warning =
      '`⚠️ we have collectively used more than $5 of available credit. consider donating? (sorry)`';
  }
  if (currentUsage.used >= secondGlobalUsageWarning) {
    warning =
      '`⚠️ we have collectively used more than $6 of available credit. consider donating? (sorry)`';
  }
  if (currentUsage.used >= globalUsageLimit) {
    botReply.edit(
      '`⛔ we have collectively used all or most of our available credit. no more prompts allowed until someone donates :(`',
    );
    return;
  }

  userCurrentData.messages ||= [];
  userCurrentData.messagesUntilKnowledge ??= 6;

  const messages: GPTMessage[] = [
    {
      role: 'system',
      content: messagePrompt,
    },
    ...(userCurrentData.knowledge
      ? [
          {
            role: 'system',
            content: `Your opinion on ${msg.author.username}: ${userCurrentData.knowledge}`,
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
    userCurrentData.messagesUntilKnowledge = 6;

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
          ...userCurrentData.messages.slice(-6),
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
    botReply.edit(
      `${completion.content}\n\n\`cost $${totalCompletionsPrice.toFixed(3)}\`\n${
        warning ? `${warning}\n` : ''
      }`,
    );
  } else {
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
