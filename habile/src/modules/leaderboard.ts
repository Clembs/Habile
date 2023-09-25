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
import { emojis } from '../lib/emojis';
import { supporterRoleId } from '../lib/roles';

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
      **Global usage**
      ${emojis.hydrollar} ${Math.ceil(totalUsage.used * 100)} / ${
        totalUsage.total * 100
      } (~${Math.floor(
        (totalUsage.total - totalUsage.used) / averageUsageCost,
      )} messages left for everyone)

      **Usage per user**
      ${users
        .sort(([_, a], [__, b]) => b.spent - a.spent)
        .map(([id, { spent }]) => {
          const isSupported = this.guild.members.cache.get(id).roles.cache.has(supporterRoleId);

          return `\\- <@${id}>${isSupported ? '`💦` ' : ''} **${emojis.hydrollar} ${Math.ceil(
            spent * 100,
          )}** ${
            spent >= (isSupported ? supporterUsageLimit : userUsageLimit)
              ? '(`⛔`)'
              : spent >= firstUserUsageWarning
              ? '(`⚠️`)'
              : ''
          }`;
        })
        .join('\n')}
        
      Note: a message uses about ${emojis.hydrollar} ${
        averageUsageCost * 100
      } to generate, based on length.
      Note 2: user usage is calculated since ${timestampMention(new Date('2023-09-24T21:40:00'))}.
        `,
    });
  },
});
