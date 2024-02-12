import { OnEvent, components, row } from 'purplet';
import { starboardChannelId } from '../lib/constants';
import {
  BaseGuildTextChannel,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';

const MIN_REACTIONS = 3;
const REACTION_EMOJI = '⭐';

export const onAddStarboardReaction = OnEvent('messageReactionAdd', async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();

  // if the message author is reacting to themselves, ignore it
  if (reaction.message.author?.id === user.id) return;
  // if the message is in an age-restricted channel, ignore it
  if ((reaction.message.channel as BaseGuildTextChannel).nsfw) return;
  // if the reaction isn't the starboard emoji, ignore it
  if (reaction.emoji.name !== REACTION_EMOJI) return;
  // if there's not enough reactions, ignore it
  if ((reaction.count || 0) < MIN_REACTIONS) return;
  console.log('new reaction', user.username);

  await sendStarboardMessage(reaction, user);
});

export const onRemoveStarboardReaction = OnEvent(
  'messageReactionRemove',
  async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();

    // if the reaction isn't the starboard emoji, ignore it
    if (reaction.emoji.name !== REACTION_EMOJI) return;
    // if the message author is reacting to themselves, ignore it
    if (reaction.message.author?.id === user.id) return;
    console.log('removed reaction', user.username);

    await sendStarboardMessage(reaction, user);
  },
);

async function sendStarboardMessage(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) {
  let originalMessage: Message | PartialMessage;
  let starboardMessage: Message | PartialMessage | undefined;

  const starboardChannel = (await reaction.message.guild?.channels.fetch(
    starboardChannelId,
  )) as BaseGuildTextChannel;
  const starboardMessages = await starboardChannel.messages.fetch({ limit: 100 });

  // all the users who have reacted to the message
  const reactedUsers = new Set();

  // if the starred message is in the starboard channel, find the original message
  if (reaction.message.channel.id === starboardChannelId) {
    const firstMessageComponent = reaction.message.components[0].components[0];
    const url = firstMessageComponent.type === 'BUTTON' ? firstMessageComponent.url : null;
    if (!url) return;

    const [channelId, messageId] = url.split('/').slice(-2);

    const originalMsgChannel = (await reaction.message.client.channels.fetch(
      channelId,
    )) as BaseGuildTextChannel;

    originalMessage = await originalMsgChannel.messages.fetch(messageId);
    starboardMessage = reaction.message;
  } else {
    originalMessage = reaction.message;
    // check if the message is referenced in the starboard
    starboardMessage = starboardMessages.find((m) =>
      m.components.some((c) =>
        c.components.some((b) => b.type === 'BUTTON' && b.url === reaction.message.url),
      ),
    );
  }

  // add all reactions from the original message
  const ogMsgReactions = originalMessage.reactions.cache.find(
    (r) => r.emoji.name === REACTION_EMOJI,
  );

  if (ogMsgReactions) {
    const ogMsgReactionsUsers = await ogMsgReactions.users.fetch();
    ogMsgReactionsUsers.filter((u) => !u.bot).forEach((u) => reactedUsers.add(u.id));
  }

  // if the message is in the starboard, update the count
  if (starboardMessage) {
    // add all of the starboard message reactions
    (
      await starboardMessage.reactions.cache
        .find((r) => r.emoji.name === REACTION_EMOJI)!
        .users.fetch()
    )
      .filter((u) => !u.bot)
      .forEach((u) => reactedUsers.add(u.id));

    console.log({ reactedUsers });

    // if there's no reactions, delete the message
    if (reactedUsers.size === 0) {
      await starboardMessage.delete();
    } else {
      // update the message with the new count
      await starboardMessage.edit({
        content: `**⭐ ${reactedUsers.size}** | ${originalMessage.channel}`,
      });
    }
  } else {
    console.log({ reactedUsers });

    // create a new message
    const newMessage = await starboardChannel.send({
      content: `**⭐ ${reactedUsers.size}** | ${originalMessage.channel}`,
      embeds: [
        {
          author: {
            name:
              reaction.message.author?.discriminator === '0'
                ? reaction.message.author?.username
                : reaction.message.author?.tag,
            iconURL: reaction.message.author?.displayAvatarURL({ dynamic: true }),
          },
          description:
            reaction.message.content +
            reaction.message.attachments.map((a) => ` [${a.name}](${a.url})`).join(''),
          image: {
            url:
              reaction.message.attachments
                .filter((a) => !!(a.contentType && a.contentType?.startsWith('image')))
                .first()?.url ||
              reaction.message.content!.match(/(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif))/)?.[0],
          },
          timestamp: reaction.message.createdAt,
          color: '#987fff',
        },
      ],
      components: components(
        row({
          type: 'BUTTON',
          style: 'LINK',
          label: 'Jump to message',
          url: reaction.message.url,
        }),
      ),
    });

    newMessage.react(REACTION_EMOJI);
  }
}
