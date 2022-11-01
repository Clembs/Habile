import { $userContextCommand, ShowMessage } from '$core';

export const command = $userContextCommand({
  name: 'Report User',
  handle() {
    return ShowMessage({
      content: 'hi',
    });
  },
});
