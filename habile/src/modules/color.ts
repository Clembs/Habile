import { ChatCommand, OptionBuilder } from 'purplet';
import { colorRoles, emojis } from '../lib/constants';

export const color = ChatCommand({
  name: 'color',
  description: 'change your name color to a different one!',
  options: new OptionBuilder().string('color', 'your new username color', {
    required: true,
    autocomplete({ color }) {
      return colorRoles
        .filter(({ name }) => name.toLowerCase().includes(color.toLowerCase()))
        .map(({ name, id }) => ({
          name,
          value: id,
        }));
    },
  }),
  async handle({ color }) {
    if (
      !color ||
      !colorRoles.some(({ id, name }) => name.toLowerCase() === color.toLowerCase() || id === color)
    ) {
      this.reply({
        content: "this color doesn't exist... try again and choose a color from the suggestions :3",
        ephemeral: true,
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

    await this.reply({
      content: `your name is now **${role?.name?.toLowerCase()}**! ${emojis.habileHappy}`,
      ephemeral: true,
    });
  },
});
