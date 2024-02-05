import { OnEvent } from 'purplet';
import { useChat } from '../lib/functions/useChat';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;
  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;
  if (msg.author.id === msg.client.user?.id) return;
  if (!msg.mentions.has(msg.client.user!)) return;

  const botReply = await msg.reply('*gimme some time to think...*');

  try {
    const { completion } = await useChat(msg, botReply, contentWithoutPing);

    if (completion) {
      botReply.edit(completion.choices[0].message.content!);
    }
  } catch (e) {
    if (e.message === 'no tokens') {
      botReply.edit(
        'we ran out of money meaning i can no longer talk :(... ([donate](https://clembs.com/donate) if you can!)',
      );
      return;
    }
    console.error(e);
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
