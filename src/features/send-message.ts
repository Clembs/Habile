import { $button, getRest, InteractionReply } from '$core';
import { channels, colors, emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import dedent from 'dedent';
import { ComponentType } from 'discord-api-types/v10';
import { feedbackMenu } from './menus/feedback';
import { rolesMenu } from './menus/roles';
import { rulesMenu } from './menus/rules';
import { SMPGuideBtn, SMPRulesBtn } from './roles/smp';

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
            title: `${emojis.clembs}  Clembs Server - Read me`,
            description: dedent`Welcome to the Clembs Server! It is an honor to have you on this growing community!
              Using the buttons below, you can read the server's rules (you should!), customize your experience or send us feedback!`,
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

export const smpSend = $button({
  customId: 'send-smp',
  handle() {
    getRest().channel.createMessage({
      body: {
        embeds: [
          {
            color: colors.default,
            image: {
              url: 'https://cdn.discordapp.com/attachments/1037085832198230147/1053708509801369721/image.png',
            },
          },
          {
            title: `${emojis.clembs}  Clembs SMP - About`,
            description: dedent`
              The Clembs SMP (Survival Multi Player) is a Minecraft server where many players come together to build, fight, survive and create!
              
              Before joining the server, you should read the rules and the lore (origin story of the server).

              **For a comprehensive guide to start the server, click the "View Guide" button below!**
              `,
            color: colors.default,
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              SMPGuideBtn.create(),
              SMPRulesBtn.create(),
              createLinkButton(
                'Read lore',
                'https://discord.com/channels/738747595438030888/1023518028694040576/1043619367893602314'
              ),
              createLinkButton(
                'Members list',
                'https://clembs.notion.site/fa3c9f293d8d49c3b5703b3ee72a861d?v=41a8929478dd4d60a75928c204b2d217'
              ),
            ],
          },
        ],
      },
      channelId: channels.smp_about,
    });

    return InteractionReply({});
  },
});
