import dedent from 'dedent';
import { readFileSync, readdirSync } from 'fs';
import { ChatCommand } from 'purplet';
import { GlobalUsage, UserData } from '../lib/types';

export default ChatCommand({
  name: 'usage',
  description: 'Know how much you and others have used Habile Chat.',
  async handle() {
    let currentUserSpending = 0;
    const usersSpending: { id: string; spent: number }[] = [];

    const totalUsage: GlobalUsage = JSON.parse(readFileSync('./static/usage.json', 'utf-8'));
    const users = readdirSync('./static/users');

    users.forEach((u) => {
      u = u.replace('.json', '');

      const { spent } = JSON.parse(readFileSync(`./static/users/${u}.json`, 'utf-8')) as UserData;

      usersSpending.push({ id: u, spent });

      if (u === this.user.id) {
        currentUserSpending = spent;
      }
    });

    this.reply({
      content: dedent`
      # Habile Chat - Usage
      **Total spent:** $${Number(totalUsage.used).toFixed(3)} / $${totalUsage.total.toFixed(
        3,
      )} ($${(totalUsage.total - totalUsage.used).toFixed(3)} remaining - about ${Math.round(
        (totalUsage.total - totalUsage.used) / 0.02,
      )} messages)
      
      **You spent:** $${currentUserSpending.toFixed(3)}
      
      **Leaderboard:**
      ${usersSpending
        .sort((a, b) => b.spent - a.spent)
        .map(({ id, spent }) => `\\- <@${id}>: **$${spent.toFixed(3)}**`)
        .join('\n')}
        
      Note: Each message costs around $0.02 to generate, depending on token (word/expression) usage.
      Note 2: Per-user usage is calculated since since 2023-09-24 at 21:40 CET.
        `,
    });
  },
});
