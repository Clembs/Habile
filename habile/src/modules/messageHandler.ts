import { OnEvent } from 'purplet';
import { APIUseResponse } from '../lib/types';
import { allowedChannels } from '../lib/channels';
import { fetch } from 'undici';
import { API_BASE_URL } from '../lib/url';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;

  if (msg.author.id === msg.client.user?.id) return;
  if (!msg.mentions.has(msg.client.user!)) return;
  if (!allowedChannels.includes(msg.channelId)) return;

  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;

  const botReply = await msg.reply('*Habile is thinking...*');

  try {
    const req = await fetch(`${API_BASE_URL}/use`, {
      method: 'POST',
      headers: {
        Authorization: process.env.HABILE_SECRET!,
        'X-User-Id': msg.author.id,
      },
      body: JSON.stringify({
        content: contentWithoutPing,
        username: msg.author.username,
        botMessageId: botReply.id,
        userMessageId: msg.id,
      }),
    });

    if (req.ok) {
      const res = (await req.json()) as APIUseResponse;
      botReply.edit(res.completion.content!);
    } else {
      const message = await req.text();
      console.error(message);
      botReply.edit('yikes, that kinda failed. maybe try later?');
    }
  } catch (e) {
    console.error(e);
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
