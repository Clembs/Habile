import { emojis, habileGuildId } from '$lib/constants';
import { db } from '$lib/db';
import { addMemberToParty, getUser } from '$lib/db/utils';
import dedent from 'dedent';
import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';

export default ChatCommand({
  name: 'party invite',
  description: 'invite a user to your party.',
  options: new OptionBuilder().user('user', 'the user to invite', {
    required: true,
  }),
  async handle({ user: invitedUser }) {
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

    if (user.id === invitedUser.id) {
      await this.editReply({
        content: `did you try to invite yourself to your party? ${emojis.habileNeutral}`,
      });
      return;
    }

    if (user.party.members.find(({ id }) => id === invitedUser.id)) {
      await this.editReply({
        content: 'this user is already in your party!',
      });
      return;
    }

    const invitedUserData = await getUser(invitedUser.id);

    if (invitedUserData.party) {
      await this.editReply({
        content: 'this user is already in a party!',
      });
      return;
    }

    if (user.party.banned.find(({ userId }) => userId === invitedUser.id)) {
      await this.editReply({
        content: 'this user is banned from your party!',
      });
      return;
    }

    try {
      await invitedUser.send({
        content: `you have been invited to join the ${user.party.name}!`,
        components: components(
          row(
            new DeclineInviteButton(user.partyId).setStyle('SECONDARY').setLabel('decline'),
            new AcceptInviteButton(user.partyId).setStyle('SUCCESS').setLabel('accept'),
          ),
        ),
      });
    } catch (e) {
      await this.editReply({
        content: dedent`
        ${emojis.habileScared} couldn't DM this member!
        this might be due to their privacy settings... 
        if your party is open or request-only, you can ask the person to \`/party join\` your party! 
        `,
      });
      return;
    }

    await this.editReply({
      content: dedent`
      the invite to join ${user.party.name} has been sent!
      they should check their DMs and click the "accept" button to join.
      `,
    });
  },
});

export const AcceptInviteButton = ButtonComponent({
  async handle(partyId: string) {
    await this.deferUpdate();

    const currentUserData = await getUser(this.user.id);

    if (currentUserData?.party) {
      await this.editReply({
        content: `${emojis.habileScared} you've joined a party in the meantime!`,
        components: [],
      });
      return;
    }

    const party = await db.query.parties.findFirst({
      where: ({ id }, { eq }) => eq(id, partyId),
    });

    const leader = await this.client.users.fetch(party.leaderId);

    await leader
      .send({
        content: `<@${this.user.id}> has accepted your invite to your party!`,
      })
      .catch(() => {});

    const guild = await this.client.guilds.fetch(habileGuildId);
    const member = await guild.members.fetch(this.user.id);

    await addMemberToParty(member, partyId);

    await this.editReply({
      content: `you've successfully joined **${party.name}**!!`,
      components: [],
    });
  },
});

export const DeclineInviteButton = ButtonComponent({
  async handle(partyId: string) {
    await this.deferUpdate();

    const party = await db.query.parties.findFirst({
      where: ({ id }, { eq }) => eq(id, partyId),
    });

    const leaderDiscord = await this.client.users.fetch(party.leaderId);

    leaderDiscord
      .send({
        content: `<${this.user.id} has declined your invite to join your party.`,
      })
      .catch(() => {});

    await this.editReply({
      content: `you've declined the invite to join **${party.name}**.`,
      components: [],
    });
  },
});
