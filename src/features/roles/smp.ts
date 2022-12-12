import { $button, getEmojiObject, getRest, InteractionReply, InteractionUpdate } from '$core';
import { channels, colors, emojis } from '$lib/env';
import enUS from '$lib/strings/en-US';
import fr from '$lib/strings/fr';
import ru from '$lib/strings/ru';
import { ButtonStyle, ComponentType, MessageFlags } from 'discord-api-types/v10';
import { rolesMenu } from '../menus/roles';

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

export const SMPRulesBtn = $button({
  customId: 'smp-rules',
  template: () => ({
    label: 'Read Rules',
    style: ButtonStyle.Primary,
  }),
  handle() {
    return InteractionReply({
      embeds: [
        {
          title: `Clembs SMP - Server Rules`,
          description: `
**1.** You must not use a cheating client or try to hack any player.
**2.** You must not create "lag machines", or any kind of exploit/Redstone machine to forcefully create lag on the server.
**3.** You may change teams, create teams at any moment. Just ask me via DMs.
**4.** You may respect each team's rules, or not!
**5.** You must not connect to another player's account illegally.
**6.** You must not try to DDoS the server or use any kinds of attacks against it.
**7.** You must not use slurs, use bigotry, or any kind of messages that may be discriminative.
**8.** You must comply to the same rules as this Discord server uses, including Discord's Terms of Service.
**9.** You must not use alternate accounts, whether to give yourself an advantage or not.
**10.** For any kind of public events (global chats when I'm streaming, or another kind of general event), you may only use English, even if that requires someone else to translate your messages afterwards or any kind of online translator.
**11.** You may not create any kinds of inappropriate art within Minecraft.
`,
          color: colors.default,
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});

export const SMPGuideBtn = $button({
  customId: 'smp-guide',
  template: () => ({
    label: 'View Guide',
    style: ButtonStyle.Primary,
  }),
  handle() {
    const strings = {
      'en-US': enUS.smp.guide,
      fr: fr.smp.guide,
      ru: ru.smp.guide,
    };

    const embed: typeof enUS.smp.guide = strings[this.locale] ?? strings['en-US'];

    console.log(
      JSON.stringify({
        title: embed.title,
        fields: embed.steps.map(([name, value], i) => ({
          name: `${i + 1} ${name}`,
          value: value
            .replace('{optifine}', 'https://optifine.net/adloadx?f=OptiFine_1.19.2_HD_U_H9.jar')
            .replace(
              '{sodium}',
              'https://github.com/CaffeineMC/sodium-fabric/releases/tag/mc1.19.2-0.4.4'
            ),
        })),
        color: colors.default,
      })
    );

    return InteractionReply({
      embeds: [
        {
          title: embed.title,
          fields: embed.steps.map(([name, value], i) => ({
            name: `${i + 1}. ${name}`,
            value: value
              .replace('{optifine}', 'https://optifine.net/adloadx?f=OptiFine_1.19.2_HD_U_H9.jar')
              .replace(
                '{sodium}',
                'https://github.com/CaffeineMC/sodium-fabric/releases/tag/mc1.19.2-0.4.4'
              ),
          })),
          color: colors.default,
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
});
