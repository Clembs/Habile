import { GPTMessage, generateChatCompletion } from '@paperdave/openai';
import { User } from 'discord.js';
import { TextCommand } from 'purplet';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { GlobalUsage, UserData } from '../lib/types';
import { messagePrompt } from '../lib/prompts';

export default TextCommand({
  name: 'gnkl',
  async handle([userId]) {
    if (this.author.id !== '327690719085068289') return;

    const user = this.client.users.cache.get(userId);

    if (!user) {
      this.reply('couldnt find user data. try again with a valid useer.');
      return;
    }

    const usageDataPath = './static/usage.json';
    const userDataPath = `./static/users/${user.id}.json`;

    const currentUsage: GlobalUsage = JSON.parse(readFileSync(usageDataPath, 'utf-8'));
    const userCurrentData: UserData = existsSync(userDataPath)
      ? JSON.parse(readFileSync(userDataPath, 'utf-8'))
      : {};

    if (!userCurrentData.messages?.length) {
      this.reply("I don't have any memories of this user.");
      return;
    }

    const knowledgeCompletion = await generateKnowledge(user, [
      {
        role: 'system',
        content: messagePrompt,
      },
      ...(userCurrentData.knowledge
        ? [
            {
              role: 'system',
              content: `Your previous knowledge about ${user.username}: ${userCurrentData.knowledge}`,
            } as GPTMessage,
          ]
        : []),
      ...((userCurrentData.messages || []).map(({ content, userId }) => {
        return {
          role: !userId || userId === user.id ? 'user' : 'assistant',
          content: !userId || userId === user.id ? `[${user.username}]: ${content}` : content,
        };
      }) as GPTMessage[]),
    ]);

    if (knowledgeCompletion.content) {
      writeFileSync(
        userDataPath,
        JSON.stringify(
          {
            ...userCurrentData,
            knowledge: knowledgeCompletion.content,
          },
          null,
          2,
        ),
      );

      this.reply(`Updated knowledge about ${user.username}: \`${knowledgeCompletion.content}\``);
    }

    currentUsage.used = currentUsage.used + knowledgeCompletion.usage.price;

    writeFileSync(usageDataPath, JSON.stringify(currentUsage, null, 2));
  },
});

export async function generateKnowledge(discordUser: User, messages: GPTMessage[] = []) {
  return await generateChatCompletion({
    messages: [
      ...messages,
      {
        role: 'system',
        content: `Based on your previous knowledge and the past user messages, what do you think of ${discordUser.username}? Summarize key things you know about them.`,
      },
    ],
    model: 'gpt-4',
    maxTokens: 300,
    temperature: 1,
    auth: {
      apiKey: process.env.OPENAI_KEY,
    },
    retry: 0,
  });
}
