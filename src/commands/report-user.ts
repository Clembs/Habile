import { $userContextCommand } from '../commands';
import { ShowMessage } from '../helpers';

export const command = $userContextCommand({
  name: 'Report User',
  handle() {
    return ShowMessage({
      content: 'hi',
    });
  },
});
