import { TextChannel } from 'discord.js';
import { OnEvent } from 'purplet';

export default OnEvent('ready', async (client) => {
  const channelId = '1155549814705111050';
  const channel = await client.channels.fetch(channelId);

  client.user.setActivity({
    name: 'DOOM',
    type: 'PLAYING',
  });

  if (channel.isText()) {
    channel.send({
      content: '🟢 I am alive!',
    });
  }
});
