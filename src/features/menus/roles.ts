import { $button, getEmojiObject, InteractionReply, InteractionUpdate } from '$core';
import { colors, emojis } from '$lib/env';
import { ButtonStyle, ComponentType, MessageFlags } from 'discord-api-types/v10';
import { RolesButton } from '../roles/handlers';

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
          title: `✏️ Customize your server roles`,
          description:
            'In order to make your experience tailored to your needs, while looking unique, you can make use of the categories below to add or remove roles.',
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
    };

    if (this.message.flags << MessageFlags.Ephemeral) {
      return InteractionUpdate(this, message);
    } else {
      return InteractionReply(message);
    }
  },
});
