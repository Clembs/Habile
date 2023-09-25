import { ChatCommand, OptionBuilder } from 'purplet';
import { UserData } from '../lib/types';
import { existsSync, readFileSync } from 'fs';

export default ChatCommand({
  name: 'knowledge',
  description: 'Debugs what Habile knows about you and what she thinks about you.',
  options: new OptionBuilder().user('user', 'Whose knowledge to get'),
  async handle({ user }) {
    user ??= this.user;

    const userDataPath = `./static/users/${user.id}.json`;

    const userCurrentData: UserData = existsSync(userDataPath)
      ? JSON.parse(readFileSync(userDataPath, 'utf-8'))
      : {};

    this.reply(
      userCurrentData.knowledge
        ? `\`${userCurrentData.knowledge}\``
        : "i have no knowledge stored about you :((. let's chat a bit more so we can get to know each other better! ping me to start :eyes:",
    );
  },
});
