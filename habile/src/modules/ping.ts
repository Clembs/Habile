import { ChatCommand } from 'purplet';

export const ping = ChatCommand({
  name: 'ping',
  description: 'pong!',
  async handle() {
    await this.deferReply();

    await this.editReply(`pong! took me ${this.client.ws.ping}ms to respond`);
  },
});
