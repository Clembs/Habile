import { ChatCommand, OptionBuilder } from 'purplet';
import { Headers, fetch } from 'undici';
import { API_BASE_URL } from '../lib/url';

export default ChatCommand({
  name: 'link',
  description: 'Link your Discord profile to clembs.com account with a connection code.',
  options: new OptionBuilder().string('code', 'The connection code you were given.', {
    required: true,
  }),
  async handle({ code }) {
    await this.deferReply();

    const headers = new Headers();
    headers.set('Authorization', process.env.HABILE_SECRET!);
    headers.set('X-User-Id', this.user.id);

    const req = await fetch(`${API_BASE_URL}/link`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        otp: code,
      }),
    });

    if (!req.ok) {
      const res = (await req.json())! as { message: string };

      return this.editReply({
        content: res.message,
      });
    }

    if (req.status === 200) {
      return this.editReply({
        content: `Successfully linked your Discord profile to your clembs.com account.\nRefresh the Dashboard page to see your usage and more!`,
      });
    }
  },
});
