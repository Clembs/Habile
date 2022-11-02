import { $button, $selectMenu, getRest, InteractionUpdate } from '$core';
import { colors, roles } from '$lib/env';
import {
  APIInteractionResponseCallbackData,
  APIMessageComponentInteraction,
  APIRole,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from 'discord-api-types/v10';

export const RolesButton = $button({
  customId: 'roles',
  template(roleType: keyof typeof roles) {
    return {
      style: ButtonStyle.Primary,
      label: roles[roleType].title,
      emoji: {
        name: roles[roleType].emoji,
      },
    };
  },
  async handle(roleType) {
    const guildRoles = await getRest().guild.getGuildRoles({
      guildId: this.guild_id,
      body: null,
    });

    return InteractionUpdate(this, await renderRoleMenu(this, guildRoles, roleType));
  },
});

async function renderRoleMenu(
  i: APIMessageComponentInteraction,
  guildRoles: APIRole[],
  type: keyof typeof roles
) {
  const filteredRoles = guildRoles
    .filter((r) => roles[type].roles.includes(r.id))
    .map(({ id, name }) => ({ id, name }));

  const selectMenu = RoleSelect.create({
    t: type,
    guildRoles: filteredRoles,
  });

  return {
    embeds: [
      {
        title: 'Select roles to pick',
        color: colors.default,
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            ...selectMenu,
            options: selectMenu.options.map((v) => ({
              ...v,
              default: i.member.roles.includes(v.value),
            })),
          },
        ],
      },
    ],
    flags: MessageFlags.Ephemeral,
  } as APIInteractionResponseCallbackData;
}

export const RoleSelect = $selectMenu({
  customId: 'role_select',
  type: ComponentType.StringSelect,
  template({
    t,
    guildRoles,
  }: {
    t: keyof typeof roles;
    guildRoles: { id: string; name: string }[];
  }) {
    return {
      max_values: t === 'colors' ? 1 : guildRoles.length,
      options: guildRoles.map((role) => ({
        label: role.name,
        value: role.id,
      })),
    };
  },
  async handle(r) {
    const guildRoles = await getRest().guild.getGuildRoles({
      guildId: this.guild_id,
      body: null,
    });

    console.log(r);

    this.data.values.forEach(async (role) => {
      const h = await getRest().guild.addGuildMemberRole({
        guildId: this.guild_id,
        roleId: role,
        userId: this.user.id,
      } as any);

      console.log(h);
    });

    return InteractionUpdate(this, await renderRoleMenu(this, guildRoles, r.t));
  },
});
