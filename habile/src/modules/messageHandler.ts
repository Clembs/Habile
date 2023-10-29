import { OnEvent, components, row } from 'purplet';
import { APIUseResponse } from '../lib/types';
import { fetch } from 'undici';
import { API_BASE_URL } from '../lib/url';
import { emojis } from '../lib/emojis';

export default OnEvent('messageCreate', async (msg) => {
  const ping = `<@${msg.client.user?.id}>`;
  const contentWithoutPing = msg.content.replace(ping, '').trim();

  if (!contentWithoutPing) return;
  if (msg.author.id === msg.client.user?.id) return;
  if (!msg.mentions.has(msg.client.user!)) return;

  const botReply = await msg.reply('*gimme some time to think...*');

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

    if (req.status === 401) {
      return botReply.edit({
        content:
          'Failed to get your clembs.com account info. Have you signed in and linked your account?',
        components: components(
          row({
            type: 'BUTTON',
            style: 'LINK',
            label: 'Go to Dashboard/Sign in',
            url: 'https://dev.clembs.com/habile/dashboard',
          }),
        ),
      });
    }

    if (req.status === 403) {
      return botReply.edit({
        content:
          "You've exceeded your allowed Hydrollar usage. You can get more in the Habile Dashboard",
        components: components(
          row({
            type: 'BUTTON',
            style: 'LINK',
            label: 'Get more Hydrollars',
            url: 'https://dev.clembs.com/habile/dashboard#add-funds',
            emoji: emojis.hydrollar,
          }),
        ),
      });
    }

    if (req.ok) {
      const res = (await req.json()) as APIUseResponse;
      botReply.edit(res.completion.content!);
    } else {
      const { message } = (await req.json()) as { message: string };
      botReply.edit(message);
    }
  } catch (e) {
    console.error(e);
    botReply.edit('yikes, that kinda failed. maybe try later?');
  }
});
