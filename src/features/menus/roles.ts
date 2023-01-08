import { $button, getEmojiObject, InteractionReply, InteractionUpdate } from '$core';
import { colors, emojis, roles } from '$lib/env';
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
      components: [renderNavbar()],
      flags: MessageFlags.Ephemeral,
    };

    if ((this.message.flags & MessageFlags.Ephemeral) === MessageFlags.Ephemeral) {
      return InteractionUpdate(this, message);
    } else {
      return InteractionReply(message);
    }
  },
});

export function renderNavbar(activeTab?: keyof typeof roles) {
  return {
    type: ComponentType.ActionRow,
    components: [
      ...(activeTab
        ? [
            {
              ...rolesMenu.create(),
              label: '',
              style: ButtonStyle.Secondary,
              emoji: getEmojiObject(emojis.buttons.back),
            },
          ]
        : []),
      ...Object.keys(roles).map((roleMenu) => ({
        ...RolesButton.create(roleMenu),
        disabled: activeTab === roleMenu,
      })),
    ],
  };
}
