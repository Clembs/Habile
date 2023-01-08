import { $button, getRest, InteractionReply } from '$core';
import { colors, emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import dedent from 'dedent';
import { ComponentType } from 'discord-api-types/v10';
import { feedbackMenu } from './menus/feedback';
import { rolesMenu } from './menus/roles';
import { rulesMenu } from './menus/rules';

export default $button({
  customId: 'send',
  async handle() {
    const rest = getRest();

    await rest.channel.createMessage({
      body: {
        embeds: [
          {
            color: colors.default,
            image: {
              url: 'https://cdn.discordapp.com/attachments/1037085832198230147/1061610185824669756/image.png',
            },
          },
          {
            title: `${emojis.clembs}  Clembs Server - About`,
            description: dedent`Welcome to the Clembs Server! It is great to have you on this growing community of people from all different backgrounds!
              Using the buttons below, you can read the server's rules, customize your roles or send us feedback!`,
            color: colors.default,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [rulesMenu.create(0), rolesMenu.create(), feedbackMenu.create()],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              createLinkButton('Website', 'https://clembs.com'),
              createLinkButton('Twitch', 'https://twitch.tv/clembs'),
              createLinkButton('Donate', 'https://ko-fi.com/clembs'),
            ],
          },
        ],
      },
      channelId:
        // '1037103610137419866' ??
        '738747677084483624',
    });

    return InteractionReply({});
  },
});
