import { getUser, removeMemberFromParty } from '$lib/db/utils';
import dedent from 'dedent';
import { ChatCommand, OptionBuilder } from 'purplet';

export default ChatCommand({
  name: 'party kick',
  description: 'kick a member of your party (they can join again)',
  options: new OptionBuilder().user('user', 'the user to kick', {
    required: true,
  }),
  async handle({ user: targetUser }) {
    await this.deferReply({ ephemeral: true });

    const user = await getUser(this.user.id);

    if (user.party.leaderId !== this.user.id) {
      await this.editReply({
        content: 'you must be the leader of your party to kick someone!',
      });
      return;
    }

    if (user.id === targetUser.id) {
      await this.editReply({
        content: 'you cannot kick yourself from your party!!',
      });
      return;
    }

    if (user.party.banned.find(({ userId }) => userId === targetUser.id)) {
      await this.editReply({
        content: 'this user is already banned from the party (unban them with `/party unban`.)',
      });
      return;
    }

    if (!user.party.members.find(({ id }) => id === targetUser.id)) {
      await this.editReply({
        content: `this user isn't a member of your party! (see: \`/party list party:${user.partyId}\`)`,
      });
    }

    const member = await this.guild.members.fetch(targetUser.id);

    await removeMemberFromParty(member, user.partyId);

    await this.editReply({
      content: dedent`
      <@${targetUser.id}> has been kicked from your party.
      they have not been notified, but they can always join back with \`/party join\`.
      `,
    });
  },
});
