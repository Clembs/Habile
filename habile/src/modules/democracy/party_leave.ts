import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { getUser } from '$lib/db/utils';
import { GuildMember } from 'discord.js';
import { eq } from 'drizzle-orm';
import { ButtonComponent, ChatCommand, components, row } from 'purplet';

export default ChatCommand({
  name: 'party leave',
  description: 'Leave your current party.',
  async handle() {
    await this.deferReply({
      ephemeral: true,
    });

    const user = await getUser(this.user.id);

    if (!user || !user.party) {
      await this.editReply({
        content: "you're not in a party!",
      });
      return;
    }

    if (user.party.leaderId === user.id) {
      await this.editReply({
        content:
          "you're the leader of your party! transfer leadership before leaving using `/party transfer-leadership`.",
      });
      return;
    }

    await this.editReply({
      content: `are you SURE that you want to leave your current party, ${user.party.name}?`,
      components: components(
        row(
          new GenericCancelButton().setStyle('SECONDARY').setLabel('no.'),
          new ConfirmLeaveButton(user.party.id).setStyle('DANGER').setLabel('yes.'),
        ),
      ),
    });
  },
});

export const ConfirmLeaveButton = ButtonComponent({
  async handle(partyId: string) {
    await this.deferUpdate();

    await db
      .update(users)
      .set({
        partyId: null,
      })
      .where(eq(users.id, this.user.id));

    const oldParty = await db.query.parties.findFirst({
      where: ({ id }, { eq }) => eq(id, partyId),
    });

    const member = this.member as GuildMember;
    const partyRole = (await this.guild.roles.fetch()).find((r) => r.name === partyId);

    member.roles.remove(partyRole);

    const leaderUser = await this.client.users.fetch(oldParty.leaderId);

    if (leaderUser) {
      await leaderUser
        .send({
          content: `<@${this.user.id}> (${this.user.username}) has left your party.`,
        })
        .catch(() => {});
    }

    await this.editReply({
      content: 'you have left your party.',
      components: [],
    });
  },
});

export const GenericCancelButton = ButtonComponent({
  async handle() {
    await this.update({
      content: '*cancelled.*',
      components: [],
    });
  },
});
