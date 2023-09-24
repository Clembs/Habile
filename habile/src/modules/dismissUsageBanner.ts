import { TextCommand } from 'purplet';
import { UserData } from '../lib/types';
import { existsSync, readFileSync, writeFileSync } from 'fs';

export default TextCommand({
  name: 'oknerd',
  async handle() {
    const userDataPath = `./static/users/${this.author.id}.json`;

    const userCurrentData: UserData = existsSync(userDataPath)
      ? JSON.parse(readFileSync(userDataPath, 'utf-8'))
      : {};

    writeFileSync(
      userDataPath,
      JSON.stringify(
        {
          ...userCurrentData,
          dismissedUsageBanner: true,
        },
        null,
        2,
      ),
    );

    this.reply(
      "you won't see the usage costs on every message anymore. just as a last reminder, use /usage to see your habile chat usage.",
    );
  },
});
