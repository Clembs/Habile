import { OnEvent } from 'purplet';
import { useChat } from '../lib/functions/useChat';
import { freeTalkingChannels } from '../lib/constants';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;
  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;
  if (msg.author.id === msg.client.user?.id) return;
  if (!freeTalkingChannels.includes(msg.channelId) && !msg.mentions.has(msg.client.user!)) return;
  if (freeTalkingChannels.includes(msg.channelId) && msg.content.startsWith('!')) return;
  if (msg.content.includes(`${ping}.`)) return;

  const botReply = await msg.reply('*gimme some time to think...*');

  try {
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
