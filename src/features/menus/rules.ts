import { $button, $selectMenu, getEmojiObject, InteractionReply, InteractionUpdate } from '$core';
import { colors, emojis } from '$lib/env';
import enUS from '$lib/strings/en-US';
import {
  APIInteractionResponseCallbackData,
  ButtonStyle,
  ComponentType,
  MessageFlags,
} from 'discord-api-types/v10';

export const rulesMenu = $button({
  customId: 'menu_rules',
  template(page: number) {
    return {
      style: ButtonStyle.Primary,
      emoji: getEmojiObject(emojis.buttons.rules),
      label: 'Read the rules',
    };
  },
  handle(page = 0) {
    const res = goToPage(page);

    if ((this.message.flags & MessageFlags.Ephemeral) === MessageFlags.Ephemeral) {
      return InteractionUpdate(this, res);
    }
    return InteractionReply(res);
  },
});

function goToPage(index: number): APIInteractionResponseCallbackData {
  console.log(index);

  const rules = enUS.rules[Number(index)];

  return {
    embeds: [
      {
        title: `${rules.emoji} ${rules.name}`,
        description: rules.value,
        footer: {
          text: `Page ${index + 1}/${enUS.rules.length}`,
        },
        color: colors.default,
      },
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [rulesSelectMenu.create()],
      },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            ...rulesMenu.create(index - 1),
            emoji: getEmojiObject(emojis.buttons.left_arrow),
            label: '',
            disabled: index === 0,
          },
          {
            ...rulesMenu.create(index + 1),
            emoji: getEmojiObject(emojis.buttons.right_arrow),
            label: '',
            disabled: index + 1 === enUS.rules.length,
          },
        ],
      },
    ],
    flags: MessageFlags.Ephemeral,
  };
}

export const rulesSelectMenu = $selectMenu({
  customId: 'rules_select',
  type: ComponentType.StringSelect,
  template() {
    return {
      options: enUS.rules.map((r, i) => ({
        emoji: {
          name: r.emoji,
        },
        label: r.name,
        value: i.toString(),
      })),
    };
  },
  handle() {
    return InteractionUpdate(this, goToPage(Number(this.data.values[0])));
  },
});
