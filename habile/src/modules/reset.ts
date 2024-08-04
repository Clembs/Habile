import { TextCommand } from 'purplet';
import { db } from '../lib/db';
import { users } from '../lib/db/schema';

export const e = TextCommand({
  name: 'reset',
  async handle() {
    if (this.author.id !== '327690719085068289') return;

    const msg = await this.reply('deleting everything...');

    await db.delete(users);

    await msg.edit('aight done');
  },
});
