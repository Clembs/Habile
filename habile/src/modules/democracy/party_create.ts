import { ButtonComponent, ChatCommand, components, OptionBuilder, row } from 'purplet';
import { colorRoles, emojis } from '../../lib/constants';
import { getUser } from '../../lib/db/utils';
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
  description: 'Create and register a party.',
  options: new OptionBuilder()
    .string('name', "The new party's name. Should include 'Party' at the end.", {
      maxLength: 48,
      minLength: 3,
      required: true,
    })
    .string('color', "The party's color, in hexadecimal format (or one of the suggestions)", {
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
        name.split(' ').length > 1
          ? // If the name has multiple words, get each first letter of each word
            name
              .split(' ')
              .map((w) => w.charAt(0))
              .slice(0, 10)
              .join('')
              .toUpperCase()
          : // Otherwise, just uppercase the first 10 letters
            name.slice(0, 10).toUpperCase();
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
      name,
      reason: 'Party creation',
      hoist: true,
    });

    const member = this.member as GuildMember;

    member.roles.add(role);

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
