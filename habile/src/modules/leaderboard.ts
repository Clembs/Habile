import { ChatCommand } from 'purplet';
import { db } from '../lib/db';

export const leaderboard = ChatCommand({
  name: 'leaderboard',
  description: 'show who cost clembs the most lol',
  async handle() {
    const allMembers = await db.query.users.findMany({
      orderBy: ({ tokensUsed }, { desc }) => desc(tokensUsed),
      limit: 10,
      columns: {
        id: true,
        tokensUsed: true,
        messagesSent: true,
      },
    });

    const leaderboard = allMembers.map(
      ({ id, tokensUsed, messagesSent }, index) =>
        `${index + 1}. <@${id}>: ${tokensUsed} tokens - ${messagesSent} msgs`,
    );

    await this.reply({
      content: `## *chat leaderboard*
${leaderboard.join('\n')}`,
    });
  },
});
