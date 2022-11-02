import { $userContextCommand, InteractionReply } from '$core';

export const command = $userContextCommand({
  name: 'Report User',
  handle() {
    return InteractionReply({
      content: 'hi',
    });
  },
});
