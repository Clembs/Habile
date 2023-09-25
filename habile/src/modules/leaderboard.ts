import dedent from 'dedent';
import { TextCommand } from 'purplet';
import { readFileSync, readdirSync } from 'fs';
import { GlobalUsage, UserData } from '../lib/types';
import {
  userUsageLimit,
  firstUserUsageWarning,
  averageUsageCost,
  supporterUsageLimit,
} from '../lib/usageLimits';
import { timestampMention } from '@purplet/utils';

export default TextCommand({
  name: 'lb',
  async handle() {
    const totalUsage: GlobalUsage = JSON.parse(readFileSync('./static/usage.json', 'utf-8'));
    const users: [string, UserData][] = readdirSync('./static/users').map((u) => {
      u = u.replace('.json', '');

      return [u, JSON.parse(readFileSync(`./static/users/${u}.json`, 'utf-8'))];
    });

    this.reply({
      content: dedent`
      # Habile Chat - Global Usage
      **Total spent:** $${Number(totalUsage.used).toFixed(3)} / $${totalUsage.total.toFixed(
        3,
      )} ($${(totalUsage.total - totalUsage.used).toFixed(3)} remaining - about ${Math.round(
        (totalUsage.total - totalUsage.used) / averageUsageCost,
      )} messages)

      **Spending per user:**
      ${users
        .sort(([_, a], [__, b]) => b.spent - a.spent)
        .map(
          ([id, { spent }]) =>
            `\\- <@${id}>: **$${spent.toFixed(3)}** ${
              spent >=
              (this.guild.members.cache.get(id).roles.cache.has('986727860368707594')
                ? supporterUsageLimit
                : userUsageLimit)
                ? '(`⛔`)'
                : spent >= firstUserUsageWarning
                ? '(`⚠️`)'
                : ''
            }`,
        )
        .join('\n')}
        
      Note: a message costs ~$${averageUsageCost} to generate, based on token usage.
      Note 2: user usage is calculated since ${timestampMention(new Date('2023-09-24T21:40:00'))}.
        `,
    });
  },
});
