import { $button, $modal, getRest, InteractionReply, ShowModal } from '$core';
import { colors, emojis } from '$lib/env';
import { resolveMemberAvatarURL } from '@purplet/utils';
import { ButtonStyle, ComponentType, MessageFlags, TextInputStyle } from 'discord-api-types/v10';

export const feedbackMenu = $button({
  customId: 'menu_feedback',
  template() {
    return {
      style: ButtonStyle.Secondary,
      label: 'Send feedback',
      emoji: {
        name: '💡',
      },
    };
  },
  handle() {
    return ShowModal(modal.create());
  },
});

export const modal = $modal({
  customId: 'feedback_modal',
  template() {
    return {
      title: 'Send feedback',
      components: [
        {
          components: [
            {
              type: ComponentType.TextInput,
              style: TextInputStyle.Paragraph,
              custom_id: 'name',
              label: 'Your message',
              min_length: 1,
              max_length: 2048,
              placeholder:
                'The server definitely needs more... Clembs is a big troublemaker because...',
              required: true,
            },
          ],
          type: ComponentType.ActionRow,
        },
      ],
    };
  },
  async handle() {
    const feedback = this.data.components[0].components[0];

    await getRest().channel.createMessage({
      channelId: '739062033626169395',
      body: {
        embeds: [
          {
            author: {
              name: `Feedback from ${this.member.nick ?? this.member.user.username}#${
                this.member.user.discriminator
              }`,
              icon_url: resolveMemberAvatarURL(this.guild_id, this.member),
            },
            description: feedback.value,
            color: colors.default,
          },
        ],
      },
    });

    return InteractionReply({
      embeds: [
        {
          title: `Thank you for your feedback! ${emojis.habile}`,
          color: colors.success,
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});
