import { ChatCommand } from 'purplet';
import { getGlobalData } from '../lib/functions/getGlobalData';
import { getUserData } from '../lib/functions/getUserData';

export default ChatCommand({
  name: 'usage',
  description: 'view how much of a freak you are lol',
  async handle() {
    await this.deferReply();

    const globalData = await getGlobalData();
    const userData = await getUserData(this.user.id);

    await this.editReply({
      content: `## *habile usage*
> you've sent ${userData.messagesSent} messages to me
> you've used ${userData.tokensUsed} tokens
> y'all and me have sent ${globalData.messagesSent} messages
> we've used ${globalData.tokensUsed} tokens (that's a lot)
`,
    });
  },
});
