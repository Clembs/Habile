import { db } from '$lib/db';
import { partyBanned, users } from '$lib/db/schema';
import { getUser } from '$lib/db/utils';
import dedent from 'dedent';
import { eq } from 'drizzle-orm';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'party ban',
  description: 'ban a user from entering your party.',
  options: new OptionBuilder().user('user', 'the user to kick.', {
    required: true,
  }),
  async handle({ user: targetUser }) {
    await this.deferReply({
      ephemeral: true,
    });

    const user = await getUser(this.user.id);

    if (user.party.leaderId !== this.user.id) {
      await this.editReply({
        content: 'you must be the leader of your party to invite someone!',
      });
      return;
    }

    if (user.party.banned.find(({ userId }) => userId === targetUser.id)) {
      await this.editReply({
        content: 'this user is already banned from the party (unban them with `/party unban`.)',
      });
      return;
    }

    await db.insert(partyBanned).values({
      userId: targetUser.id,
      partyId: user.partyId,
    });

    if (user.party.members.find(({ id }) => id === targetUser.id)) {
      await db
        .update(users)
        .set({
          partyId: null,
        })
        .where(eq(users.id, targetUser.id));

      const member = await this.guild.members.fetch(targetUser.id);
      const partyRole = this.guild.roles.cache.find(({ id }) => id === user.partyId);

      member.roles.remove(partyRole);
    }

    await this.editReply({
      content: dedent`
      <@${targetUser.id}> has been banned from your party.
      they can no longer join it, and they have been kicked (if they were part of it.)`,
    });
  },
});
