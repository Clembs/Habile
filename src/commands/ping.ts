import { emojis } from '$lib/env';
import { snowflakeToDate } from '@purplet/utils';
import dedent from 'dedent';
import { $slashCommand } from '../commands';
import { ShowMessage } from '../helpers';

export const command = $slashCommand({
  name: 'ping',
  handle() {
    const timestamp = snowflakeToDate(this.id);

    const randomPhrases = [
      '**Habile, always here for you!**',
      `${emojis.emotiguy.coolwoah} All systems operational!`,
      'Almost better than CRBT!',
      'Powering the Clembs Community since 2022!',
    ];
    const phrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];

    return ShowMessage({
      content: dedent`${phrase}
      > **Interaction latency:** ${Date.now() - timestamp.getTime()}ms
      `,
    });
  },
});
