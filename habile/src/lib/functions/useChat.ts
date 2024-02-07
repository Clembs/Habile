import type { Message } from 'discord.js';
import { getGlobalData } from './getGlobalData';
import { messagePrompt } from '../constants';
import { db } from '../db';
import { getUserData } from './getUserData';
import { eq } from 'drizzle-orm';
import { habileChatData, users } from '../db/schema';
import OpenAI from 'openai';
import { generateKnowledge } from './generateKnowledge';

export async function useChat(
  userMsg: Message,
  botReply: Message,
  content: string,
  // global uses the 5 past messages of the current channel from all users
  // personal uses using the user's last few messages with habile (for use in free talking channels)
  mode: 'global' | 'personal',
) {
  const globalData = await getGlobalData();
  const userData = await getUserData(userMsg.author.id);

  if (globalData.used >= globalData.tokens) {
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
      content: `About ${userMsg.author.username}: ${userData.knowledge}`,
    });
  }

  if (mode === 'global') {
    const lastMessages = await userMsg.channel.messages.fetch({ limit: 8, before: userMsg.id });

    lastMessages.forEach((msg) => {
      messages.push({
        role: msg.author.id === userMsg.author.id ? 'user' : 'assistant',
        content: `${msg.author.username}: ${msg.content}`,
      });
    });
  } else if (mode === 'personal' && userData.lastMessages?.length) {
    userData.lastMessages.forEach(({ content, userId }) => {
      messages.push({
        role: !userId || userId === userId ? 'user' : 'assistant',
        content: !userId || userId === userId ? `${userMsg.author.username}: ${content}` : content,
      });
    });
  }

  messages.push({
    role: 'user',
    content: `${userMsg.author.username}: ${content}`,
  });

  let completion: OpenAI.Chat.Completions.ChatCompletion;
  const openai = new OpenAI();

  try {
    console.time(`completion:${botReply.id}`);
    completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-4-turbo-preview',
      max_tokens: 256,
      temperature: 0.8,
      user: userMsg.author.id,
      n: 1,
      // retry: 0,
    });
    console.timeEnd(`completion:${botReply.id}`);
  } catch (e) {
    throw new Error('no tokens');
  }

  let totalCompletionsPrice =
    ((completion.usage?.prompt_tokens || 0) / 1000) * 0.01 +
    ((completion.usage?.completion_tokens || 0) / 1000) * 0.03;

  let knowledgeCompletion: OpenAI.Chat.Completions.ChatCompletion | undefined = undefined;

  if (userData.messagesSent > 0 && userData.messagesSent % 5 === 0) {
    knowledgeCompletion = await generateKnowledge(userMsg.author, messages);
    totalCompletionsPrice +=
      ((knowledgeCompletion.usage?.prompt_tokens || 0) / 1000) * 0.01 +
      ((knowledgeCompletion.usage?.completion_tokens || 0) / 1000) * 0.03;
  }

  completion.choices[0].message.content =
    completion.choices[0].message.content?.replace(`${userMsg.author.username}:`, '') || '';

  await db.update(habileChatData).set({
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
      knowledge: knowledgeCompletion?.choices[0].message.content || userData.knowledge,
      ...(mode === 'personal'
        ? {
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
          }
        : {}),
    })
    .onConflictDoUpdate({
      set: {
        used: userData.used + totalCompletionsPrice,
        messagesSent: userData.messagesSent + 1,
        knowledge: knowledgeCompletion?.choices[0].message.content || userData.knowledge,
        ...(mode === 'personal'
          ? {
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
            }
          : {}),
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
