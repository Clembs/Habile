import { Intents } from 'discord.js';
import { ChatCommandHandler, defineConfig, TextCommandHandler } from 'purplet';
import 'dotenv/config';

export default defineConfig({
  compiler: {
    alias: {
      $lib: './src/lib',
      '$lib/*': './src/lib/*',
    },
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
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.MESSAGE_CONTENT,
      ],
      partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    },
  },
  handlers: [
    new ChatCommandHandler(),
    new TextCommandHandler({
      prefix: ['!'],
    }),
  ],
});
