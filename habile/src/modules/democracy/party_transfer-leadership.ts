import { db } from '$lib/db';
import { parties } from '$lib/db/schema';
import { getUser } from '$lib/db/utils';
import dedent from 'dedent';
import { eq } from 'drizzle-orm';
import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';
import { GenericCancelButton } from './party_leave';
import { habileGuildId, partyLeaderRoleId } from '$lib/constants';

export default ChatCommand({
  name: 'party transfer-leadership',
  description: 'transfer the leadership of your party to another party member',
  options: new OptionBuilder().user('user', 'party member to transfer the leadership to', {
    required: true,
  }),
  async handle({ user: targerUser }) {
    await this.deferReply({ ephemeral: true });

    const user = await getUser(this.user.id);

    if (this.user.id !== user?.party?.leaderId) {
      await this.editReply({
        content: 'you must be the leader of your party to transfer its leadership!',
      });
      return;
    }

    const targetUserData = await getUser(targerUser.id);

    if (targetUserData?.partyId !== user.partyId) {
      await this.editReply({
        content: 'this user is not part of your party!',
      });
      return;
    }

    await this.editReply({
      content: dedent`
      # are you sure that you want to transfer the leadership to <@${targerUser.id}>?
      - they will be able to edit the party, manage its members, etc.
      - once you click "confirm", the member will have to accept or decline the leadership transfer.
      `,
      components: components(
        row(
          new GenericCancelButton().setLabel('cancel').setStyle('SECONDARY'),
          new ConfirmTransferLeadership(targerUser.id).setLabel('CONFIRM').setStyle('DANGER'),
        ),
      ),
    });
  },
});

export const ConfirmTransferLeadership = ButtonComponent({
  async handle(targetUserId: string) {
    await this.deferUpdate();

    const user = await getUser(this.user.id);

    const targetUser = await this.client.users.fetch(targetUserId);

    try {
      await targetUser.send({
        content: dedent`
      # <@${this.user.id}> has requested for you to become the leader of **${user.party.name}**.
      `,
        components: components(
          row(
            new RejectTransferLeadership().setLabel('reject').setStyle('DANGER'),
            new AcceptTransferLeadership().setLabel('accept').setStyle('SUCCESS'),
          ),
        ),
      });
    } catch (e) {
      await this.editReply({
        content: dedent`
        could not DM the target user.
        make sure their DMs are open for the server. try again when they have.
        `,
        components: [],
      });
      return;
    }
    await this.editReply({
      content: 'the leadership transfer has been requested!',
      components: [],
    });
  },
});

export const AcceptTransferLeadership = ButtonComponent({
  async handle() {
    await this.deferUpdate();

    const user = await getUser(this.user.id);

    const [party] = await db
      .update(parties)
      .set({ leaderId: this.user.id })
      .where(eq(parties.id, user.partyId))
      .returning();

    const guild = await this.client.guilds.fetch(habileGuildId);
    const previousLeaderMember = await guild.members.fetch(user.party.leaderId);
    const newLeaderMember = await guild.members.fetch(this.user.id);

    await previousLeaderMember.roles.remove(partyLeaderRoleId);
    await newLeaderMember.roles.add(partyLeaderRoleId);

    await previousLeaderMember.user
      .send({
        content: dedent`
      # party leadership transfered to <@${this.user.id}>
      your request for a leadership transfer for ${party.name} has been accepted.
      you are no longer the leader of the party.
      `,
      })
      .catch((e) => console.log(e));

    await this.editReply({
      content: dedent`
      # congratulations, you are now officially the leader of ${party.name}!
      you can now manage the party, edit its details, and more.
      you should announce the change in your party's chat (if you have one), and possibly in <#1267099883341348918>.`, // #party-announcements
      components: [],
    });
  },
});

export const RejectTransferLeadership = ButtonComponent({
  async handle() {
    await this.deferUpdate();

    const user = await getUser(this.user.id);
    const guild = await this.client.guilds.fetch(habileGuildId);
    const leaderMember = await guild.members.fetch(user.party.leaderId);

    await leaderMember.user
      .send({
        content: dedent`
      # party leadership transfer rejected
      your request for a leadership transfer to <@${this.user.id}> has been rejected.
      `,
      })
      .catch(() => {});

    await this.editReply({
      content: "you've rejected the leadership transfer proposition.",
      components: [],
    });
  },
});
