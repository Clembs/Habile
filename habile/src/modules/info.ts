import dedent from 'dedent';
import { readFileSync } from 'fs';
import { ChatCommand } from 'purplet';
import { GlobalUsage, UserData } from '../lib/types';
import { timestampMention } from '@purplet/utils';
import { averageUsageCost, supporterUsageLimit, userUsageLimit } from '../lib/usageLimits';
import { emojis } from '../lib/emojis';
import { GuildMember } from 'discord.js';
import { supporterRoleId } from '../lib/roles';

export default ChatCommand({
  name: 'usage',
  description: 'Get useful info about your Habile Chat credit usage.',
  async handle() {
    const totalUsage: GlobalUsage = JSON.parse(readFileSync('./static/usage.json', 'utf-8'));
    const userUsage: UserData = JSON.parse(
      readFileSync(`./static/users/${this.user.id}.json`, 'utf-8'),
    );

    const isSupporter = (this.member as GuildMember).roles.cache.has(supporterRoleId);

    this.reply({
      content: dedent`
      # Habile Chat - Usage
      **Global usage**
      ${emojis.hydrollar} ${Math.ceil(totalUsage.used * 100)} / ${
        totalUsage.total * 100
      } (~${Math.floor(
        (totalUsage.total - totalUsage.used) / averageUsageCost,
      )} messages left for everyone)
      \`Check global usage with !lb.\`

      **Your usage**
      ${emojis.hydrollar} ${Math.ceil(userUsage.spent * 100)} / ${
        (isSupporter ? supporterUsageLimit : userUsageLimit) * 100
      } (${
        userUsage.spent < (isSupporter ? supporterUsageLimit : userUsageLimit)
          ? `~${Math.floor(
              (isSupporter ? supporterUsageLimit : userUsageLimit - userUsage.spent) /
                averageUsageCost,
            )} messages left for you`
          : '`⚠️` usage exceeded'
      })

      Note: a message uses about ${emojis.hydrollar} ${
        averageUsageCost * 100
      } to generate, based on length.
      Note 2: user usage is calculated since ${timestampMention(new Date('2023-09-24T21:40:00'))}.
        `,
    });
  },
});
