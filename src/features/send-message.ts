import { $button, getRest, InteractionReply } from '$core';
import { channels, colors, emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import dedent from 'dedent';
import { ComponentType } from 'discord-api-types/v10';
import { feedbackMenu } from './menus/feedback';
import { rolesMenu } from './menus/roles';
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
