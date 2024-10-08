import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';
import { colorRoles, emojis, partyLeaderRoleId } from '../../lib/constants';
import { addMemberToParty, getUser } from '../../lib/db/utils';
import dedent from 'dedent';
import { db } from '$lib/db';
import { parties } from '$lib/db/schema';
import { GenericCancelButton } from './party_leave';
import { GuildMember } from 'discord.js';

const pendingPartiesMap = new Map<string, Partial<typeof parties.$inferSelect>>();

const JoinTypes = {
  open: 'Anyone can join',
  request: 'Members must request to join',
  invite: 'Members must be invited',
};

export default ChatCommand({
  name: 'party create',
  description: 'create and register a party.',
  options: new OptionBuilder()
    .string('name', "the new party's name, should include 'Party' at the end", {
      maxLength: 48,
      minLength: 3,
      required: true,
    })
    .string('color', "the party's color, in hexadecimal format (or one of the suggestions)", {
      required: true,
      async autocomplete({ color }) {
        const list = colorRoles
          .filter(({ name }) => name.toLowerCase().includes(color.toLowerCase()))
          .map(({ name, hex }) => ({
            name,
            value: hex,
          }));

        return list.length
          ? list
          : [
              {
                name: color,
                value: color,
              },
            ];
      },
    })
    .string('join_type', 'How server members can join the party.', {
      required: true,
      choices: JoinTypes,
    })
    .string('id', 'An acronym or the shortened party name. Leave blank to auto generate.', {
      maxLength: 10,
      minLength: 2,
      required: false,
    }),
  async handle({ id, name, color, join_type: joinType }) {
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

    if (!id) {
      id =
        name.replace(/party/i, '').trim().split(' ').length > 1
          ? // If the name has multiple words, get each first letter of each word
            name
              .replace(/party/i, '')
              .trim()
              .split(' ')
              .map((w) => w.charAt(0))
              .slice(0, 10)
              .join('')
              .toUpperCase()
          : // Otherwise, just uppercase the first 10 letters
            name.replace(/party/i, '').trim().slice(0, 10).toUpperCase();
    }

    const partyWithSameId = await db.query.parties.findFirst({
      where: ({ id: dbId }, { eq }) => eq(dbId, id),
    });

    if (partyWithSameId) {
      await this.editReply({
        content: `a party with the ID \`${id}\` already exists. please define a new one.`,
      });
      return;
    }

    const decimalColor = parseInt(color.replace('#', ''), 16);

    // check against a color regex, with # optional
    if (!/^#?[0-9A-F]{6}$/i.test(color) || isNaN(decimalColor)) {
      await this.editReply({
        content: 'please provide a valid color in hexadecimal format.',
      });
      return;
    }

    const thisMsg = await this.fetchReply();
    pendingPartiesMap.set(thisMsg.id, {
      id,
      name,
      color: decimalColor,
      joinType: joinType as any,
      leaderId: this.user.id,
    });

    await this.editReply({
      content: dedent`
        nearly done.
        please double-check that this is the correct info.
        you can always use \`/party edit\` to change anything later (except the ID).`,
      embeds: [
        {
          title: `${name} (\`${id}\`)`,
          description: dedent`
          Security: ${JoinTypes[joinType]}
          Leader: <@${this.user.id}>
          Members: 1
          `,
          color: decimalColor,
        },
      ],
      components: components(
        row(
          new GenericCancelButton().setStyle('DANGER').setLabel('actually nvm'),
          new ConfirmCreateButton().setStyle('PRIMARY').setLabel("let's do it!!!"),
        ),
      ),
    });
  },
});

export const ConfirmCreateButton = ButtonComponent({
  async handle() {
    await this.deferUpdate();

    const { color, id, name, joinType, leaderId } = pendingPartiesMap.get(this.message.id);

    // get the party whose ID is right before the new one, to position the role correctly
    const preceedingParty = await db.query.parties.findFirst({
      orderBy: ({ id }, { desc }) => desc(id),
      where: ({ id: dbId }, { lt }) => lt(dbId, id),
    });
    const preceedingPartyRole = this.guild.roles.cache.find(({ id }) => id === preceedingParty.id);

    const [newParty] = await db
      .insert(parties)
      .values({
        id,
        name,
        color,
        joinType,
        leaderId,
      })
      .returning();

    const role = await this.guild.roles.create({
      color,
      name: id,
      reason: 'Party creation',
      hoist: true,
      position: preceedingPartyRole ? preceedingPartyRole.position + 1 : 0,
    });

    const member = this.member as GuildMember;

    member.roles.add(partyLeaderRoleId);

    await addMemberToParty(member, newParty.id);

    await this.editReply({
      content:
        `# ${emojis.habileHappy} party created!` +
        (joinType !== 'invite'
          ? dedent`\n
        - members can join it using \`/party join\`,
        - you can also invite them using \`/party invite\`.
        `
          : '- invite members using `/party invite`.') +
        `\n- you can also edit your party's settings using \`/party edit\`.`,
      components: [],
    });
  },
});
