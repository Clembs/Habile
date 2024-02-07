import { OnEvent } from 'purplet';
import { useChat } from '../lib/functions/useChat';
import { freeTalkingChannels } from '../lib/constants';

const rateLimit = new Map<string, number>();

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;
  const contentWithoutPing = msg.content.replace(ping, '').trim();
  const isFreeTalkingChannel = freeTalkingChannels.includes(msg.channelId);

  if (!contentWithoutPing) return;
  if (msg.author.id === msg.client.user?.id) return;
  if (!isFreeTalkingChannel && !msg.mentions.has(msg.client.user!)) return;
  if (isFreeTalkingChannel && msg.content.startsWith('!')) return;
  if (msg.content.includes(`${ping}.`)) return;

  if (
    rateLimit.has(msg.author.id) &&
    Date.now() - rateLimit.get(msg.author.id)! < 1000 * (isFreeTalkingChannel ? 5 : 1)
  ) {
    await msg.reply({
      content: `slow down! you can only talk to me once every ${
        isFreeTalkingChannel ? '5 seconds' : 'second'
      }`,
    });
  }

  const botReply = await msg.reply('*gimme some time to think...*');

  try {
    rateLimit.set(msg.author.id, Date.now());
    const { completion } = await useChat(
      msg,
      botReply,
      contentWithoutPing,
      freeTalkingChannels.includes(msg.channelId) ? 'personal' : 'global',
    );

    if (completion) {
      botReply.edit(completion.choices[0].message.content!);
    }
  } catch (e) {
    if (e.message === 'no tokens') {
      botReply.edit(
        'we ran out of money meaning i can no longer talk :( ([donate](https://clembs.com/donate) if you can!)',
      );
      return;
    }
    console.error(e);
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
