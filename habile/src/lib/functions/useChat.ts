import type { Message } from 'discord.js';
import { getGlobalData } from './getGlobalData';
import { messagePrompt } from '../constants';
import { db } from '../db';
import { getUserData } from './getUserData';
import { eq } from 'drizzle-orm';
import { habileChatData, users } from '../db/schema';
import OpenAI from 'openai';

export async function useChat(userMsg: Message, botReply: Message, content: string) {
  const globalData = await getGlobalData();
  const userData = await getUserData(userMsg.author.id);

  if (globalData.tokens <= 0) {
    throw new Error('no tokens');
  }

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: messagePrompt,
    },
  ];

  if (userData.knowledge) {
    messages.push({
      role: 'system',
      content: `Your knowledge about ${userMsg.author.username}: ${userData.knowledge}`,
    });
  }

  if (userData.lastMessages?.length) {
    userData.lastMessages.forEach(({ content, userId }) => {
      messages.push({
        role: !userId || userId === userId ? 'user' : 'assistant',
        content:
          !userId || userId === userId ? `[${userMsg.author.username}]: ${content}` : content,
      });
    });
  }

  messages.push({
    role: 'user',
    content: `[${userMsg.author.username}]: ${content}`,
  });

  const openai = new OpenAI();

  console.time('completion');
  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-4-turbo-preview',
    max_tokens: 256,
    temperature: 0.8,
    user: userMsg.author.id,
    n: 1,
    // retry: 0,
  });
  console.timeEnd('completion');

  const totalCompletionsPrice =
    ((completion.usage?.prompt_tokens || 0) / 1000) * 0.01 +
    ((completion.usage?.completion_tokens || 0) / 1000) * 0.03;

  // TODO: generate knowledge

  await db.update(habileChatData).set({
    tokens: globalData.tokens - totalCompletionsPrice,
    messages: globalData.messages + 1,
    used: globalData.used + totalCompletionsPrice,
  });

  const [newUserData] = await db
    .insert(users)
    .values({
      // ...userData,
      id: userMsg.author.id,
      used: userData.used + totalCompletionsPrice,
      messagesSent: userData.messagesSent + 1,
      lastMessages: [
        {
          id: userMsg.id,
          content,
          userId: userMsg.author.id,
        },
        {
          id: botReply.id,
          content: completion.choices[0].message.content!,
          userId: 'habile',
        },
      ],
    })
    .onConflictDoUpdate({
      set: {
        used: userData.used + totalCompletionsPrice,
        messagesSent: userData.messagesSent + 1,
        lastMessages: [
          ...(userData.lastMessages || []).slice(-4),
          {
            id: userMsg.id,
            content,
            userId: userMsg.author.id,
          },
          {
            id: botReply.id,
            content: completion.choices[0].message.content!,
            userId: 'habile',
          },
        ],
      },
      where: eq(users.id, userMsg.author.id),
      target: [users.id],
    })
    .returning();

  return {
    newUserData,
    completion,
  };
}