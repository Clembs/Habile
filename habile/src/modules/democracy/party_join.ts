import { emojis, habileGuildId } from '$lib/constants';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';
import { getUser } from '$lib/db/utils';
import dedent from 'dedent';
import { GuildMember } from 'discord.js';
import { eq } from 'drizzle-orm';
import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';

export default ChatCommand({
  name: 'party join',
  description: 'join a party.',
  options: new OptionBuilder().string('party', 'The party you want to join.', {
    required: true,
    async autocomplete({ party }) {
      const list = await db.query.parties.findMany({
        where: ({ name, joinType }, { ilike, ne, and }) =>
          and(ne(joinType, 'invite'), ilike(name, `%${party}%`)),
        limit: 25,
      });

      return list.map(({ name, id }) => ({
        name,
        value: id,
      }));
    },
  }),
  async handle({ party: partyId }) {
    try {
      await this.deferReply({
        ephemeral: true,
      });

      const user = await getUser(this.user.id);

      if (user && user.party) {
        await this.editReply({
          content: "you're already in a party! leave your current party with /party leave.",
        });
        return;
      }

      const party = await db.query.parties.findFirst({
        where: ({ id }, { eq }) => eq(id, partyId),
        with: {
          banned: true,
        },
      });

      if (!party) {
        await this.editReply({
          content: 'party not found!',
        });
        return;
      }

      if (party.banned.find(({ userId }) => userId === this.user.id)) {
        await this.editReply({
          content: 'you are banned from this party.',
        });
        return;
      }

      if (party.joinType === 'invite') {
        await this.editReply({
          content: 'you need an invite to join this party!',
        });
        return;
      }

      const leaderUser = await this.client.users.fetch(party.leaderId);

      if (party.joinType === 'request') {
        if (leaderUser) {
          try {
            await leaderUser.send({
              content: `<@${this.user.id}> (${this.user.username}) has requested to join your party.`,
              components: components(
                row(
                  new AcceptJoinButton(this.user.id).setStyle('SUCCESS').setLabel('accept'),
                  new RejectJoinButton(this.user.id).setStyle('DANGER').setLabel('reject'),
                ),
              ),
            });
          } catch (e) {
            await this.editReply({
              content: dedent`
                ${emojis.habileScared} couldn't DM to the party leader!
                this might be due to their privacy settings...
                you should ask <@${party.leaderId}> directly to \`/party invite\` you to their party!
                `,
            });
            return;
          }
        }

        await this.editReply({
          content: dedent`
        you\`ve sent a request to join **${party.name}**!
        the leader of the party will have to accept your request for you to join it.
        `,
        });
        return;
      }

      if (party.joinType === 'open') {
        await db
          .insert(users)
          .values({
            id: this.user.id,
            partyId: partyId,
          })
          .onConflictDoUpdate({
            set: {
              partyId: partyId,
            },
            where: eq(users.id, this.user.id),
            target: users.id,
          });

        if (leaderUser) {
          await leaderUser
            .send({
              content: `<@${this.user.id}> (${this.user.username}) has joined your party.`,
            })

            .catch(() => {});
        }

        const member = this.member as GuildMember;
        const partyRole = (await this.guild.roles.fetch()).find((r) => r.name === party.id);

        member.roles.add(partyRole);

        await this.editReply({
          content: dedent`
        # ${emojis.habileHappy} you joined the **${party.name}**!
        you can leave it at any moment using \`/party leave\`.
        `,
        });
      }
    } catch (e) {
      console.error(e);
    }
  },
});

export const AcceptJoinButton = ButtonComponent({
  async handle(userId: string) {
    await this.deferUpdate();

    try {
      const askingUser = await getUser(userId);

      if (askingUser?.party) {
        await this.editReply({
          content: `${emojis.habileScared} **yikes!** this user joined another party in the meantime!`,
          components: [],
        });
        return;
      }

      const leader = await getUser(this.user.id);

      await db
        .insert(users)
        .values({
          id: userId,
          partyId: leader.party.id,
        })
        .onConflictDoUpdate({
          set: {
            partyId: leader.party.id,
          },
          where: eq(users.id, userId),
          target: users.id,
        });

      const guild = await this.client.guilds.fetch(habileGuildId);
      const member = await guild.members.fetch(userId);
      const partyRole = (await guild.roles.fetch()).find((r) => r.name === leader.party.id);

      member.roles.add(partyRole);

      member.user
        .send({
          content: `you have been accepted into the party **${leader.party.name}**!`,
        })
        .catch(() => {});

      await this.editReply({
        content: `${emojis.habileHappy} <@${member.user.id}> (${member.user.username}) is now part of the party!`,
        components: [],
      });
    } catch (e) {
      console.error(e);
    }
  },
});

export const RejectJoinButton = ButtonComponent({
  async handle(userId: string) {
    await this.deferUpdate();

    const askingUserData = await getUser(userId);

    if (askingUserData?.party) {
      await this.editReply({
        content: `${emojis.habileScared} **yikes!** this user entered a party in the meantime!`,
        components: [],
      });
      return;
    }

    const askingUser = await this.client.users.fetch(userId);
    const leader = await getUser(this.user.id);

    askingUser
      .send({
        content: `your request to join the party **${leader.party.name}** has been rejected.`,
      })
      .catch(() => {});

    await this.editReply({
      content: `<@${userId}> (${askingUser.username}) has been rejected from the party.`,
      components: [],
    });
  },
});
