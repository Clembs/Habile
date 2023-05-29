import { $button, getRest, InteractionReply } from '$core';
import { emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import dedent from 'dedent';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

export default $button({
  template: () => ({
    style: ButtonStyle.Primary,
    label: 'Send',
  }),
  customId: 'send',
  async handle() {
    const rest = getRest();

    const msg = await rest.channel.createMessage({
      body: {
        content: dedent`
# ${emojis.habile} Welcome to Habile's Lounge!

This server is the casual place for nerds, gamers and designers alike to hangout, and get updates about Clembs' projects.

- Before chatting, you should read the <#1112823712241160265>.
- Any discussion topic is allowed in <#738747595438030891>.
- Grab yourself a fancy color and notification roles in <id:customize>.
- Be aware of future streams in <#972946702812209212>, and post your fav moments in <#1102166564586934322>.
- You're an artist? Post your stuff in <#1019656273475674152>!

There's all kinds of channels for more specific topics! Thanks for staying here, take care.
`,
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              createLinkButton("Visit Clembs' website", 'https://clembs.com'),
              createLinkButton('Buy some water cups', 'https://ko-fi.com/clembs'),
              createLinkButton('Twitch', 'https://twitch.tv/clembs'),
            ],
          },
        ],
      },
      channelId:
        // '1037103610137419866' ??
        '738747677084483624',
    });

    console.log(msg);

    return InteractionReply({});
  },
});
