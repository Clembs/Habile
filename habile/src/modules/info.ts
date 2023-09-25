import dedent from 'dedent';
import { readFileSync } from 'fs';
import { ChatCommand } from 'purplet';
import { GlobalUsage, UserData } from '../lib/types';
import { timestampMention } from '@purplet/utils';
import { averageUsageCost } from '../lib/usageLimits';

export default ChatCommand({
  name: 'usage',
  description: 'Get useful info about your Habile Chat credit usage.',
  async handle() {
    const totalUsage: GlobalUsage = JSON.parse(readFileSync('./static/usage.json', 'utf-8'));
    const userUsage: UserData = JSON.parse(
      readFileSync(`./static/users/${this.user.id}.json`, 'utf-8'),
    );

    this.reply({
      content: dedent`
      # Habile Chat - Usage
      **Total spent:** $${Number(totalUsage.used).toFixed(3)} / $${totalUsage.total.toFixed(
        3,
      )} ($${(totalUsage.total - totalUsage.used).toFixed(3)} remaining - about ${Math.round(
        (totalUsage.total - totalUsage.used) / averageUsageCost,
      )} messages)
      
      **You spent:** $${userUsage.spent.toFixed(3)}
      
      Note: a message costs ~$${averageUsageCost} to generate, based on token usage.
      Note 2: user usage is calculated since ${timestampMention(new Date('2023-09-24T21:40:00'))}.
        `,
    });
  },
});
