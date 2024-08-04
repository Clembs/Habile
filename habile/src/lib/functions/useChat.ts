import { SnowflakeUtil, type Message } from 'discord.js';
import { chatPrompt, generalPrompt } from '../constants';
import { db } from '../db';
import { getUserData } from './getUserData';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { Chatter, ChatterMessage, CompletionResponse } from './Chatter';
// import { generateKnowledge } from './generateKnowledge';

export async function useChat(
  userMsg: Message,
  botReply: Message,
  content: string,
  // global uses the 10 past messages of the current channel from all users
  // personal uses using the user's last few messages with habile (for use in free talking channels)
  mode: 'global' | 'personal',
) {
  const user = userMsg.author;
  const bot = userMsg.client.user!;

  const userData = await getUserData(user.id);

  const messages: ChatterMessage[] = [
    {
      role: 'system',
      content: generalPrompt(user.username),
    },
    {
      role: 'system',
      content: chatPrompt,
    },
  ];

  // if (userData.knowledge) {
  //   messages.push({
  //     role: 'system',
  //     content: `About ${userMsg.author.username}: ${userData.knowledge}`,
  //   });
  // }

  // await Promise.all(
  //   userMsg.mentions.users.map(async (user) => {
  //     const mentionedUserData = await getUserData(user.id);

  //     if (mentionedUserData.knowledge) {
  //       messages.push({
  //         role: 'system',
  //         content: `About ${user.username}: ${mentionedUserData.knowledge}`,
  //       });
  //     }
  //   }),
  // );

  // const referencedMessage =
  //   userMsg.reference?.messageId &&
  //   (await userMsg.channel.messages.fetch(userMsg.reference.messageId));
  // const hasAnotherUserInThread =
  //   !!referencedMessage &&
  //   (referencedMessage.author.id !== userMsg.author.id ||
  //     referencedMessage.author.id === botReply.author.id);

  // if (referencedMessage && referencedMessage.author.id !== botReply.author.id) {
  //   messages.push({
  //     role: 'system',
  //     content: `${referencedMessage.author.username}: ${referencedMessage.content}`,
  //   });
  // } else

  if (mode === 'global') {
    // get the last 10 messages before the user's message
    const lastMessages = await userMsg.channel.messages.fetch({ limit: 10, before: userMsg.id });

    lastMessages.reverse().forEach((msg) => {
      messages.push({
        role: msg.author.id === bot.id ? 'system' : 'user',
        content: `${msg.author.username}: ${msg.content}`,
      });
    });
  } else if (mode === 'personal' && userData.lastMessages?.length) {
    userData.lastMessages.forEach(({ content, userId, id }) => {
      // if the message is older than two hours, we don't want to use it
      if (Date.now() - SnowflakeUtil.deconstruct(id).timestamp > 1000 * 60 * 60 * 2) return;
      const messageAuthor = userMsg.client.users.cache.get(userId);

      const isHabile = !userId || userId === 'habile';
      messages.push({
        role: isHabile ? 'assistant' : 'user',
        content:
          // if the discussion is only between the user and habile, we don't need to show the user's name
          // otherwise, include it so we know who's talking
          `${isHabile ? 'Habile' : messageAuthor?.username}: ${content}`,
      });
    });
  }

  messages.push({
    role: 'user',
    content:
      `${user.username}: ` +
      userMsg.cleanContent.replace('@​Habile ', '') +
      userMsg.attachments.map((a) => ` [${a.contentType?.split('/')[0]}]`).join(''),
  });

  console.log(userMsg.cleanContent.replace('@​Habile ', ''));
  console.log(messages);

  let completion: CompletionResponse;
  // const openai = new OpenAI();
  const chatter = new Chatter('Habile');

  console.time(`completion:${botReply.id}`);
  completion = await chatter.generateCompletion({ messages });
  console.timeEnd(`completion:${botReply.id}`);

  const avoidReplying = completion.message.content.toUpperCase() === 'NO REPLY';

  let totalTokensUsed = completion.prompt_eval_count + completion.eval_count;

  // ((completion.usage?.prompt_tokens || 0) / 1000) * 0.01 +
  // ((completion.usage?.completion_tokens || 0) / 1000) * 0.03;

  // let knowledgeCompletion: OpenAI.Chat.Completions.ChatCompletion | undefined = undefined;

  // if (userData.messagesSent > 0 && userData.messagesSent % 5 === 0) {
  //   knowledgeCompletion = await generateKnowledge(userMsg.author, [
  //     // remove the chat prompt
  //     messages[0],
  //     ...messages.slice(2),
  //   ]);
  //   totalCompletionsPrice +=
  //     ((knowledgeCompletion.usage?.prompt_tokens || 0) / 1000) * 0.01 +
  //     ((knowledgeCompletion.usage?.completion_tokens || 0) / 1000) * 0.03;
  // }

  completion.message.content =
    completion.message.content.replace(
      // replace either the user's name or habile's name with an empty string
      new RegExp(`(${userMsg.author.username}|Habile):`, 'i'),
      '',
    ) || '';

  // await db.update(habileChatData).set({
  //   messages: globalData.messages + 1,
  //   used: globalData.used + totalCompletionsPrice,
  // });

  const [newUserData] = await db
    .insert(users)
    .values({
      // ...userData,
      id: userMsg.author.id,
      tokensUsed: userData.tokensUsed + totalTokensUsed,
      messagesSent: userData.messagesSent + 1,
      // knowledge: knowledgeCompletion?.choices[0].message.content || userData.knowledge,
      ...(mode === 'personal' && !avoidReplying
        ? {
            lastMessages: [
              {
                id: userMsg.id,
                content,
                userId: userMsg.author.id,
              },
              {
                id: botReply.id,
                content: completion.message.content,
                userId: 'habile',
              },
            ],
          }
        : {}),
    })
    .onConflictDoUpdate({
      set: {
        tokensUsed: userData.tokensUsed + totalTokensUsed,
        messagesSent: userData.messagesSent + 1,
        // knowledge: knowledgeCompletion?.choices[0].message.content || userData.knowledge,
        ...(mode === 'personal' && !avoidReplying
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
                  content: completion.message.content,
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

  if (avoidReplying) {
    return {
      newUserData,
    };
  }

  return {
    newUserData,
    completion,
  };
}
