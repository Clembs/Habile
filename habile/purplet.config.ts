import { Intents } from 'discord.js';
import {
  ChatCommandHandler,
  ContextCommandHandler,
  defineConfig,
  TextCommandHandler,
} from 'purplet';
import 'dotenv/config';

export default defineConfig({
  compiler: {
    esbuildOptions: {
      minify: true,
      minifyWhitespace: true,
    },
  },
  discord: {
    commandGuilds: ['738747595438030888'],
    clientOptions: {
      allowedMentions: {
        repliedUser: false,
      },
      //@ts-ignore
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
    },
  },
  handlers: [
    new ChatCommandHandler(),
    new ContextCommandHandler(),
    // new OnEventHandler(),ne
    new TextCommandHandler({
      prefix: ['!'],
    }),
  ],
});
