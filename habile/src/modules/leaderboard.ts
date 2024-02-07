import { ChatCommand } from 'purplet';
import { db } from '../lib/db';

export const leaderboard = ChatCommand({
  name: 'leaderboard',
  description: 'show who cost clembs the most lol',
  async handle() {
    const allMembers = await db.query.users.findMany({
      orderBy: ({ used }, { desc }) => desc(used),
      limit: 10,
      columns: {
        id: true,
        used: true,
        messagesSent: true,
      },
    });

    const leaderboard = allMembers.map(
      ({ id, used, messagesSent }, index) =>
        `${index + 1}. <@${id}>: $${used} - ${messagesSent} msgs`,
    );

    await this.reply({
      content: `## *chat leaderboard*
${leaderboard.join('\n')}`,
    });
  },
});
