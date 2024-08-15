import { ChatCommand, OptionBuilder } from 'purplet';
import { colorRoles, emojis } from '../lib/constants';
import { GuildMember } from 'discord.js';

export const color = ChatCommand({
  name: 'color',
  description: 'change your name color to a different one!',
  options: new OptionBuilder().string('color', 'your new username color', {
    required: true,
    choices: colorRoles.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: cur.name,
      }),
      {},
    ),
  }),
  async handle({ color }) {
    await this.deferReply({
      ephemeral: true,
    });

    const member = this.member as GuildMember;
    const currentColorRole = colorRoles.find(({ id }) => member.roles.cache.has(id));
    const newColorRole = (await this.guild?.roles.fetch(color!))!;

    // remove all color roles
    if (currentColorRole) {
      await member.roles.remove(currentColorRole.id);
    }
    // add the selected color role
    await member.roles.add(newColorRole);

    await this.editReply({
      content: `your name is now colored in **${newColorRole?.name?.toLowerCase()}**! ${emojis.habileHappy}`,
    });
  },
});
