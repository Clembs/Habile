import { Rest } from '@purplet/rest';
import { Env } from './helpers';

let rest: Rest;

export function getRest(env?: Env) {
  if (env) {
    rest = new Rest({
      token: env.DISCORD_TOKEN,
      tokenType: 'Bot',
    });
  }

  return rest;
}
