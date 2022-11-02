import { $button, getRest, InteractionReply } from '$core';
import { colors } from '$lib/env';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { rolesMenu } from './menus/roles';

export default $button({
  customId: 'send',
  async handle() {
    const rest = getRest();

    await rest.channel.createMessage({
      body: {
        embeds: [
          {
            title: 'Welcome to the Clembs Server!',
            description:
              "Please read the rules carefully, they're not long and can prevent you from being striked in advance.",
            color: colors.default,
            fields: [
              {
                name: 'Be respectful',
                value:
                  "• Use common sense, don't purposefully offend anyone, etc.\n• Use constructive criticism as much as you can. Pure hatred for a person or what they do is simply rude and mean.\n• Just like any server, you need to comply to the **[Discord Terms of Service](https://dis.gd/tos)**.",
              },
              {
                name: "Things you shouldn't send",
                value:
                  '• Limit chains & "screenshot this" memes (or similar) to threads.\n• **Do not** share, encourage, discuss piracy, illegal software (hacks, unauthorized client mods) or malware. You\'ve be warned, and are subject to heavier sanctions',
              },
              {
                name: 'Keep the server friendly & safe',
                value:
                  'Maintain dark humor, inappropriate jokes, slurs, mentions of NSFW things and everything that can fall in this to a strict minimum. \n:warning: This server should be friendly to teens 13 and older.',
              },
              {
                name: 'Sanctions',
                value:
                  '• If you accidentally slip or forget about these rules, a simple warn will be added to your Moderation history (which you can view with </modlogs user:988494582981484585>), nothing more.\n• Now, if you repeatedly break rules, sanctions can range from a timeout to a full permanent ban and will depend on your case.',
              },
            ],
          },
        ],
        components: [
          {
            type: ComponentType.ActionRow,
            components: [
              rolesMenu.create(),
              {
                type: ComponentType.Button,
                style: ButtonStyle.Secondary,
                label: 'Send Feedback',
                custom_id: 'menu_feedback',
                emoji: {
                  name: '💡',
                },
              },
            ],
          },
        ],
      },
      channelId: '1037103610137419866',
    });

    return InteractionReply({});
  },
});
