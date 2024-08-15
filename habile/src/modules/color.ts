import { ChatCommand, OptionBuilder } from 'purplet';
import { colorRoles, emojis } from '../lib/constants';

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

    if (
      !color ||
      !colorRoles.some(({ id, name }) => name.toLowerCase() === color.toLowerCase() || id === color)
    ) {
      this.editReply({
        content: "this color doesn't exist... try again and choose a color from the suggestions :3",
      });
      return;
    }

    const role = await this.guild?.roles.fetch(color);
    const member = await this.guild?.members.fetch(this.user.id);

    // remove all color roles
    await member?.roles.remove(
      colorRoles.map(({ id }) => id).filter((id) => member?.roles.cache.has(id)),
    );
    // add the selected color role
    await member?.roles.add(role!);

    await this.editReply({
      content: `your name is now **${role?.name?.toLowerCase()}**! ${emojis.habileHappy}`,
    });
  },
});
