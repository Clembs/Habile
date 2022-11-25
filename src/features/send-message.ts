import { $button, getRest, InteractionReply } from '$core';
import { colors, emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import { ComponentType } from 'discord-api-types/v10';
import { feedbackMenu } from './menus/feedback';
import { rolesMenu } from './menus/roles';

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
              url: 'https://cdn.discordapp.com/attachments/1037085832198230147/1041051749735207022/image.png',
            },
          },
          {
            title: `${emojis.clembs}  Clembs Server - Rules`,
            description:
              "Please read the rules carefully, they're not long and can prevent you from being striked in advance.\n\nYou can use the buttons below to customize your experience and send us feedback!",
            color: colors.default,
            fields: [
              {
                name: 'Be respectful',
                value:
                  "Use common sense, constructive criticism, and don't purposefully offend anyone or any group. Just like any server, you will need to comply to the **[Discord Terms of Service](https://dis.gd/tos)**.",
              },
              {
                name: "Things you shouldn't send",
                value:
                  "Limit chains, long images, repeatition-based memes **to threads**.\n**Do not** share, encourage, discuss piracy, illegal software (hacks, unauthorized client mods) or malware. You've be warned, and are subject to heavier sanctions.",
              },
              {
                name: 'Keep the server friendly & safe',
                value:
                  'Maintain inappropriate jokes/humor, slurs, NSFW topics and everything in-between to a strict minimum. **This server should be friendly to teens 13 and older.**',
              },
              {
                name: 'Sanctions',
                value:
                  'If you accidentally slip, a warn will be added to your Moderation history (</modlogs user:988494582981484585>), nothing more. If you repeatedly break the rules, sanctions can go from a timeout to a permanent ban, depending on your case.',
              },
            ],
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [rolesMenu.create(), feedbackMenu.create()],
          },
          {
            type: ComponentType.ActionRow,
            components: [
              createLinkButton('Website', 'https://clembs.com'),
              createLinkButton('Twitch', 'https://twitch.tv/clembs'),
              {
                ...createLinkButton('Donate', 'https://ko-fi.com/clembs'),
                disabled: true,
              },
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
