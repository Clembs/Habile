//@ts-check

import { ApplicationCommandType } from 'discord-api-types/v10';

export const commands = [
  {
    name: 'ping',
    description: 'A simple ping command.',
  },
  {
    name: 'Report User',
    type: ApplicationCommandType.User,
  },
];
