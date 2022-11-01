import { $button, ShowMessage } from '$core';
import { ButtonStyle, MessageFlags } from 'discord-api-types/v10';

export const RolesButton = $button({
  customId: 'button',
  template(number: string) {
    return {
      style: ButtonStyle.Primary,
      label: number,
    };
  },
  async handle() {
    return ShowMessage({
      embeds: [
        {
          title: 'Select roles to pick',
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});
