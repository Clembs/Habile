import { User } from 'discord.js';
import OpenAI from 'openai';

export async function generateKnowledge(
  user: User,
  messages: OpenAI.ChatCompletionMessageParam[] = [],
) {
  const openai = new OpenAI();

  messages.push({
    role: 'system',
    content: `Based on the past information, summarize this conversation and key points about ${user.username}.`,
  });

  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-4-turbo-preview',
    max_tokens: 256,
    temperature: 0.8,
    user: user.id,
    n: 1,
  });

  return completion;
}
