import { $button, getEmojiObject, InteractionReply } from '$core';
import { colors, emojis } from '$lib/env';
import { ButtonStyle, ComponentType, MessageFlags } from 'discord-api-types/v10';
import { RolesButton } from '../roles/handlers';

export const rolesMenu = $button({
  customId: 'menu_roles',
  template() {
    return {
      style: ButtonStyle.Primary,
      label: 'Roles',
      emoji: getEmojiObject(emojis.buttons.pencil),
    };
  },
  handle() {
    return InteractionReply({
      embeds: [
        {
          title: `${emojis.buttons.pencil} Customize your Clembs Server experience!`,
          description: 'Click a button below to add or remove your different roles!',
          color: colors.default,
        },
      ],
      components: [
        {
          components: [
            RolesButton.create('colors'),
            RolesButton.create('notifications'),
            RolesButton.create('access'),
          ],
          type: ComponentType.ActionRow,
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});
