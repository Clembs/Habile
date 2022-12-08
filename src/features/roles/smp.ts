import { $button, getEmojiObject, getRest, InteractionUpdate } from '$core';
import { channels, colors, emojis } from '$lib/env';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { rolesMenu } from '../menus/roles';

// export const SMPButton = $button({
//   customId: 'smp-button',
//   template(enabled: boolean) {
//     if (enabled) {
//       return {
//         label: 'Unregister from the Clembs SMP',
//         style: ButtonStyle.Danger,
//       };
//     }
//     return {
//       label: 'Pre-register for the Clembs SMP',
//       emoji: {
//         name: '⛏️',
//       },
//       style: ButtonStyle.Primary,
//     };
//   },
//   async handle() {
//     if (this.member.roles.includes('1021801774757195808')) {
//       return await getRest()
//         .guild.removeGuildMemberRole({
//           guildId: this.guild_id,
//           roleId: '1021801774757195808',
//           userId: this.member.user.id,
//         } as any)
//         .then(() =>
//           InteractionUpdate(this, {
//             embeds: [
//               {
//                 title: `You unregistered from the Clembs SMP Early Access! ${emojis.appreciable_meal}`,
//                 description:
//                   'If you change your mind, simply come back to this menu. Beware that once the Early Access starts, you will no longer be able to pre-register.',
//                 color: colors.success,
//               },
//             ],
//             components: [
//               {
//                 type: ComponentType.ActionRow,
//                 components: [
//                   {
//                     ...rolesMenu.create(),
//                     label: 'Back to role editing',
//                     style: ButtonStyle.Secondary,
//                     emoji: getEmojiObject(emojis.buttons.back),
//                   },
//                 ],
//               },
//             ],
//           })
//         );
//     }

//     return InteractionUpdate(this, {
//       embeds: [
//         {
//           title: 'Clembs SMP Early Access Pre-registration',
//           description: `The Clembs SMP early access phase is opening <t:${
//             new Date('2022-12-09T19:00:00+00:00').valueOf() / 1000
//           }:R>, so make sure to pre-register before time runs out! It'll open **publicly** the week after, so if you choose to ignore this phase you won't be missing out!\n\nYou can choose to play and pre-register, or just to get the role and spectate.`,
//           color: colors.default,
//         },
//       ],
//       components: [
//         {
//           type: ComponentType.ActionRow,
//           components: [
//             {
//               ...rolesMenu.create(),
//               label: '',
//               style: ButtonStyle.Secondary,
//               emoji: getEmojiObject(emojis.buttons.back),
//             },
//             SMPRegisterButton.create(),
//             SMPNoRegisterButton.create(),
//           ],
//         },
//       ],
//     });
//   },
// });

// export const SMPRegisterButton = $button({
//   customId: 'register-smp',
//   template: () => ({
//     label: 'I want to play!',
//     style: ButtonStyle.Primary,
//   }),
//   handle: () => ShowModal(SMPRegisterModal.create()),
// });

export const SMPButton = $button({
  customId: 'no-register-smp',
  template(enabled: boolean) {
    if (enabled) {
      return {
        label: 'Unregister from the Clembs SMP',
        style: ButtonStyle.Danger,
      };
    }
    return {
      label: 'Access the Clembs SMP channels',
      emoji: {
        name: '⛏️',
      },
      style: ButtonStyle.Primary,
    };
  },
  async handle() {
    if (this.member.roles.includes('1021801774757195808')) {
      return await getRest()
        .guild.removeGuildMemberRole({
          guildId: this.guild_id,
          roleId: '1021801774757195808',
          userId: this.member.user.id,
        } as any)
        .then(() =>
          InteractionUpdate(this, {
            embeds: [
              {
                title: `You unregistered from the Clembs SMP Early Access! ${emojis.appreciable_meal}`,
                description:
                  'If you change your mind, simply come back to this menu. Beware that once the Early Access starts, you will no longer be able to pre-register.',
                color: colors.success,
              },
            ],
            components: [
              {
                type: ComponentType.ActionRow,
                components: [
                  {
                    ...rolesMenu.create(),
                    label: 'Back to role editing',
                    style: ButtonStyle.Secondary,
                    emoji: getEmojiObject(emojis.buttons.back),
                  },
                ],
              },
            ],
          })
        );
    }
    return await getRest()
      .guild.addGuildMemberRole({
        guildId: this.guild_id,
        roleId: '1021801774757195808',
        userId: this.member.user.id,
      } as any)
      .then((r) =>
        InteractionUpdate(this, {
          embeds: [
            {
              title: `You were added to the Clembs SMP channels! ${emojis.habile}`,
              description: `You should now read <#${channels.smp_about}>, where you'll find some crucial information about the server. You won't be able to play as pre-registrations are now closed. Worry not, since the server will be public the following week!`,
              color: colors.success,
            },
          ],
          components: [],
        })
      );
  },
});

// export const SMPRegisterModal = $modal({
//   customId: 'smp-modal',
//   template: () => ({
//     title: 'Clembs SMP Pre-registration Form',
//     components: [
//       {
//         type: ComponentType.ActionRow,
//         components: [
//           {
//             type: ComponentType.TextInput,
//             label: 'Your Minecraft player username',
//             custom_id: 'player_name',
//             style: TextInputStyle.Short,
//             max_length: 100,
//             min_length: 3,
//             placeholder: 'For example, "Clembs"',
//             required: true,
//           },
//         ],
//       },
//       {
//         type: ComponentType.ActionRow,
//         components: [
//           {
//             type: ComponentType.TextInput,
//             label: 'Did you pay for the game?',
//             custom_id: 'is_premium',
//             style: TextInputStyle.Short,
//             max_length: 3,
//             min_length: 2,
//             required: true,
//             placeholder: 'Yes, or no.',
//           },
//         ],
//       },
//     ],
//   }),
//   async handle() {
//     const playerName = this.data.components[0].components[0].value;
//     const isPremium = this.data.components[1].components[0].value;

//     const defer = await getRest().interactionResponse.createInteractionResponse({
//       interactionToken: this.token,
//       body: {
//         type: InteractionResponseType.DeferredMessageUpdate,
//       },
//       interactionId: this.id,
//     });

//     const sendMsg = await getRest().channel.createMessage({
//       body: {
//         content: `<@${this.member.user.id}> (${this.member.user.username}) registered with the name \`${playerName}\`. Is premium set to ${isPremium}.`,
//       },
//       channelId: channels.notifications,
//     });

//     const giveRole = await getRest().guild.addGuildMemberRole({
//       guildId: this.guild_id,
//       roleId: '1021801774757195808',
//       userId: this.member.user.id,
//     } as any);

//     const finalEdit = await getRest().interactionResponse.editOriginalInteractionResponse({
//       applicationId: getEnv().APPLICATION_ID,
//       body: {
//         embeds: [
//           {
//             title: `You are succesfully registered! ${emojis.habile}`,
//             description: `You should now read <#${channels.smp_about}>, where you'll find some crucial information about the server.`,
//             color: colors.success,
//           },
//         ],
//         components: [],
//       },
//       interactionToken: this.token,
//     });

//     return Promise.all([defer, sendMsg, giveRole, finalEdit]).then(() => new Response('ok'));
//   },
// });
