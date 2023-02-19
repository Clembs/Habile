import { $button, getEmojiObject, InteractionReply, InteractionUpdate } from '$core';
import { colors, emojis } from '$lib/env';
import { createLinkButton } from '@purplet/utils';
import {
  APIInteractionResponseCallbackData,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from 'discord-api-types/v10';

export const rolesMenu = $button({
  customId: 'menu_roles',
  template() {
    return {
      style: ButtonStyle.Primary,
      label: 'Customize your roles',
      emoji: getEmojiObject(emojis.buttons.pencil),
    };
  },
  handle() {
    const message = {
      embeds: [
        {
          title: `⏩ Channel customization is moving!`,
          description: `As Discord released their new "Customize Community" feature, I will no longer be in charge of giving or removing roles ${emojis.disaster}...\nHit the button below to check out the new customization options, where you can also toggle viewing some channels.`,
          color: colors.default,
        },
      ],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            createLinkButton(
              'Go to Customize Community',
              'https://discord.com/channels/738747595438030888/customize-community'
            ),
          ],
        },
      ],
      flags: MessageFlags.Ephemeral,
    } as APIInteractionResponseCallbackData;

    if ((this.message.flags & MessageFlags.Ephemeral) === MessageFlags.Ephemeral) {
      return InteractionUpdate(this, message);
    } else {
      return InteractionReply(message);
    }
  },
});
