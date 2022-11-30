import { $button, $selectMenu, getEmojiObject, getRest, InteractionUpdate } from '$core';
import { colors, roles } from '$lib/env';
import {
  APIInteractionResponseCallbackData,
  APIMessageComponentInteraction,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from 'discord-api-types/v10';
import { renderNavbar } from '../menus/roles';

export const RolesButton = $button({
  customId: 'roles',
  template(roleType: keyof typeof roles) {
    return {
      style: ButtonStyle.Secondary,
      label: roles[roleType].label,
      // emoji: {
      //   name: roles[roleType].emoji,
      // },
    };
  },
  async handle(roleType) {
    const res = await renderRoleMenu(this, roleType);

    console.log(JSON.stringify(res));
    return InteractionUpdate(this, res);
  },
});

async function renderRoleMenu(i: APIMessageComponentInteraction, type: keyof typeof roles) {
  const selectMenu = RoleSelect.create(type);
  const rolePicker = roles[type];
  // TODO: this
  // const color = roles.colors.roles.find((color) =>
  //   type === 'colors' && i.data.component_type === ComponentType.StringSelect
  //     ? color.id === i.data.values[0]
  //     : i.member.roles.find((rId) => rId === color.id)
  // );

  return {
    embeds: [
      {
        title: `${rolePicker.emoji} ${rolePicker.title}`,
        description: roles[type].description,
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
              default:
                (!i.member.roles.includes(v.value) &&
                  i.data.component_type === ComponentType.StringSelect &&
                  i.data.values.includes(v.value)) ||
                i.member.roles.includes(v.value),
            })),
          },
        ],
      },
      renderNavbar(type),
    ],
    flags: MessageFlags.Ephemeral,
  } as APIInteractionResponseCallbackData;
}

export const RoleSelect = $selectMenu({
  customId: 'role_select',
  type: ComponentType.StringSelect,
  template(t: keyof typeof roles) {
    return {
      min_values: 0,
      max_values: t === 'colors' ? 1 : roles[t].roles.length,
      options: roles[t].roles.map((role) => ({
        label: role.name,
        value: role.id,
        ...(role.description ? { description: role.description } : {}),
        ...(role.emoji ? { emoji: getEmojiObject(role.emoji) } : {}),
      })),
    };
  },
  async handle(roleType) {
    const pending: Promise<any>[] = [];

    roles[roleType].roles.forEach(async ({ id: roleId }) => {
      if (this.member.roles.includes(roleId) && !this.data.values.includes(roleId)) {
        pending.push(
          getRest().guild.removeGuildMemberRole({
            guildId: this.guild_id,
            roleId: roleId,
            userId: this.member.user.id,
          } as any)
        );
      }

      if (this.data.values.includes(roleId) && !this.member.roles.includes(roleId)) {
        pending.push(
          getRest().guild.addGuildMemberRole({
            guildId: this.guild_id,
            roleId: roleId,
            userId: this.member.user.id,
          } as any)
        );
      }
    });

    return Promise.all(pending).then(async () =>
      InteractionUpdate(this, await renderRoleMenu(this, roleType))
    );
  },
});
