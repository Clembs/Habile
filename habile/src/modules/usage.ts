import { ChatCommand } from 'purplet';
import { getGlobalData } from '../lib/functions/getGlobalData';
import { getUserData } from '../lib/functions/getUserData';

const averageUsageCost = 0.01;

export default ChatCommand({
  name: 'usage',
  description: 'view how much money you cost clembs :)',
  async handle() {
    await this.deferReply();

    const globalData = await getGlobalData();
    const userData = await getUserData(this.user.id);

    await this.editReply({
      content: `## *habile usage*
> you've sent ${userData.messagesSent} messages to me
> you cost clembs $${userData.used.toFixed(2)}\\*
> we have $${(globalData.tokens - globalData.used).toFixed(2)} remaining
\\**one message i send costs about $${averageUsageCost}. **[donate](https://clembs.com/donate)** if you can so i can keep talking :)*`,
    });
  },
});
