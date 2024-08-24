import { db } from '$lib/db';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'party list',
  description: 'list all parties and their members.',
  options: new OptionBuilder().string('party', 'a party whose members to list (optional)', {
    async autocomplete({ party }) {
      const list = await db.query.parties.findMany({
        where: ({ name }, { ilike }) => ilike(name, `%${party}%`),
        limit: 25,
      });

      return list.map(({ name, id }) => ({
        name,
        value: id,
      }));
    },
  }),
  async handle({ party }) {
    await this.deferReply({ ephemeral: true });

    const parties = await db.query.parties.findMany({
      ...(party ? { where: ({ id }, { eq }) => eq(id, party) } : {}),
      with: {
        members: true,
        ...(party ? { banned: true } : {}),
      },
      orderBy: ({ name }, { asc }) => asc(name),
    });

    if (party && !parties.length) {
      await this.editReply({
        content:
          "no party found with this name or ID. use the autocomplete when entering the party you're looking for.",
      });
      return;
    }

    await this.editReply({
      embeds: parties.map(({ id, name, leaderId, members, banned, color }) => ({
        title: `${name} (${id})`,
        description:
          `${members.length} members\n` +
          members
            .sort((a, b) => (a.id === leaderId ? -1 : b.id === leaderId ? 1 : 0))
            .map(({ id }) => `<@${id}>` + (id === leaderId ? ` (Leader)` : ''))
            .join('\n'),

        fields:
          party && leaderId === this.user.id
            ? [
                {
                  name: 'banned members',
                  value: banned.map(({ userId }) => `<@${userId}>`).join('\n'),
                },
              ]
            : [],
        color,
      })),
    });
  },
});
