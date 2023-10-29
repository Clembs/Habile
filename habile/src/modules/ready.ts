import { OnEvent } from 'purplet';
import 'dotenv/config';

export default OnEvent('ready', async (client) => {
  client.user.setActivity({
    name: '@mention me to chat!',
    type: 'PLAYING',
  });
});
