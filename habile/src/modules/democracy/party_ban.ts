import { db } from '$lib/db';
import { partyBanned } from '$lib/db/schema';
import { getUser, removeMemberFromParty } from '$lib/db/utils';
import dedent from 'dedent';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'party ban',
  description: 'ban a user from entering your party.',
  options: new OptionBuilder().user('user', 'the user to ban', {
    required: true,
  }),
  async handle({ user: targetUser }) {
    await this.deferReply({
      ephemeral: true,
    });

    const user = await getUser(this.user.id);

    if (!user?.party) {
      await this.editReply({
        content: 'you must be in a party to ban someone!',
      });
      return;
    }

    if (user.party.leaderId !== this.user.id) {
      await this.editReply({
        content: 'you must be the leader of your party to ban someone!',
      });
      return;
    }

    if (user.id === targetUser.id) {
      await this.editReply({
        content: 'you cannot ban yourself from your party!!',
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
      const member = await this.guild.members.fetch(targetUser.id);

      await removeMemberFromParty(member, user.partyId);
    }

    await this.editReply({
      content: dedent`
      <@${targetUser.id}> has been banned from your party.
      they can no longer join it, and they have been kicked (if they were part of it.)`,
    });
  },
});
