import { $slashCommand, ShowMessage } from '$core';
import { emojis } from '$lib/env';
import { snowflakeToDate } from '@purplet/utils';
import dedent from 'dedent';
import { ComponentType } from 'discord-api-types/v10';
import { RolesButton } from '../components/roles';

export const command = $slashCommand({
  name: 'ping',
  description: 'A simple ping command.',
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
      components: [
        {
          components: [RolesButton.create('1')],
          type: ComponentType.ActionRow,
        },
      ],
    });
  },
});
