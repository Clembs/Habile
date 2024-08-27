import { db } from '$lib/db';
import { partyBanned } from '$lib/db/schema';
import { getUser } from '$lib/db/utils';
import dedent from 'dedent';
import { and, eq } from 'drizzle-orm';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'party unban',
  description: 'unban a user previously banned from your party.',
  options: new OptionBuilder().user('user', 'the user to unban', {
    required: true,
  }),
  async handle({ user: targetUser }) {
    await this.deferReply({
      ephemeral: true,
    });

    const user = await getUser(this.user.id);

    if (!user?.party) {
      await this.editReply({
        content: 'you must be in a party to unban someone!',
      });
      return;
    }

    if (user.party.leaderId !== this.user.id) {
      await this.editReply({
        content: 'you must be the leader of your party to unban someone!',
      });
      return;
    }

    if (this.user.id === targetUser.id) {
      await this.editReply({
        content: 'what',
      });
      return;
    }

    if (!user.party.banned.find(({ userId }) => userId === targetUser.id)) {
      await this.editReply({
        content: 'this user is not banned from the party (ban them with `/party ban`.)',
      });
      return;
    }

    await db
      .delete(partyBanned)
      .where(and(eq(partyBanned.userId, targetUser.id), eq(partyBanned.partyId, user.partyId)));

    await this.editReply({
      content: dedent`
      <@${targetUser.id}> has been unbanned from your party.
      they can join it whenever they want to using \`/party join\`.`,
    });
  },
});
