import { $slashCommand, getRest, InteractionReply } from '$core';
import { emojis, roles } from '$lib/env';
import {
  APIApplicationCommandInteractionDataStringOption,
  ApplicationCommandOptionType,
  MessageFlags,
} from 'discord-api-types/v10';

export default $slashCommand({
  name: 'color',
  description: 'Change your username display color.',
  options: [
    {
      name: 'color',
      description: 'The new color to use.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: roles.colors.roles.map((role) => ({
        name: role.name,
        value: role.id,
      })),
    },
  ],
  async handle() {
    const currentRoleData = roles.colors.roles.find((role) => this.member.roles.includes(role.id));
    const newRoleId = (this.data.options[0] as APIApplicationCommandInteractionDataStringOption)
      .value;
    const newRoleData = roles.colors.roles.find(({ id }) => id === newRoleId);

    if (currentRoleData.id === newRoleId) {
      return InteractionReply({
        content: `${emojis.habile.neutral} You already have the **${currentRoleData.emoji} ${currentRoleData.name}** color!`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await getRest().guild.addGuildMemberRole({
        guildId: this.guild_id,
        roleId: newRoleId,
        userId: this.member.user.id,
        reason: '/color used',
      } as any);

      await getRest().guild.removeGuildMemberRole({
        guildId: this.guild_id,
        roleId: currentRoleData.id,
        userId: this.member.user.id,
        reason: '/color used',
      } as any);

      return InteractionReply({
        content: `${emojis.habile.happy} You have been given the **${newRoleData.emoji} ${newRoleData.name}** color!`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (e) {
      return InteractionReply({
        content: `${emojis.habile.scared} Woops, something went wrong. Contact Clembs about this issue.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
});
