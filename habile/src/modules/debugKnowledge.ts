import { TextCommand } from 'purplet';
import { UserData } from '../lib/types';
import { existsSync, readFileSync } from 'fs';

export default TextCommand({
  name: 'knowledge',
  async handle() {
    const userDataPath = `./static/users/${this.author.id}.json`;

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
