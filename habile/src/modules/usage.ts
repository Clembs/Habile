import dedent from 'dedent';
import { ChatCommand, components, row } from 'purplet';
import { emojis } from '../lib/emojis';
import { Headers, fetch } from 'undici';
import { API_BASE_URL } from '../lib/url';
import { UserData } from '../lib/types';

const averageUsageCost = 0.04;

export default ChatCommand({
  name: 'usage',
  description: 'View your Habile Chat balance and some stats.',
  async handle() {
    await this.deferReply({
      ephemeral: true,
    });

    const headers = new Headers();
    headers.set('Authorization', process.env.HABILE_SECRET!);
    headers.set('X-User-Id', this.user.id);

    const req = await fetch(`${API_BASE_URL}/usage`, {
      method: 'GET',
      headers,
    });

    if (!req.ok) {
      return this.editReply({
        content:
          'Failed to get your clembs.com account info. Have you signed in and linked your account?',
        components: components(
          row({
            type: 'BUTTON',
            style: 'LINK',
            label: 'Sign in',
            url: 'https://dev.clembs.com/account',
          }),
        ),
      });
    }

    const habileChatData = (await req.json()) as UserData;

    const tokensUsed = Math.ceil(habileChatData.used * 100);
    const tokensTotal = Math.floor(habileChatData.tokens * 100);
    const tokensRemaining = tokensTotal - tokensUsed;
    const averageMessagesRemaining = Math.floor(tokensRemaining / averageUsageCost / 100);

    await this.editReply({
      content: dedent`
      # ${emojis.habileHappy} Habile Chat - Mini-dashboard

      ### Balance
      ${emojis.hydrollar} **${tokensRemaining} Hydrollars (${
        tokensUsed < tokensTotal
          ? `~${averageMessagesRemaining} messages left`
          : '`⚠️` usage exceeded'
      })**
      ### Usage
      ${emojis.hydrollar} **${tokensUsed} Hydrollars** spent
      💬 **${habileChatData.messagesSent} messages** sent\*

      *On average, a message costs about ${
        averageUsageCost * 100
      } Hydrollars to generate, based on length.*
      *\*Calculated since October 23, 2023.*
        `,
      components: components(
        row(
          {
            type: 'BUTTON',
            style: 'LINK',
            label: 'View on Dashboard',
            url: 'https://dev.clembs.com/habile/dashboard',
          },
          {
            type: 'BUTTON',
            style: 'LINK',
            label: 'Get more Hydrollars',
            url: 'https://dev.clembs.com/habile/dashboard#add-funds',
            emoji: emojis.hydrollar,
          },
        ),
      ),
    });
  },
});
