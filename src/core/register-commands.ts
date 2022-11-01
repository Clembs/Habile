// Do not import this file to anywhere else
// This doesn't run on a Cloudflare Worker, just in Node
// You just deploy commands using your env variables

import 'dotenv/config';
import fetch from 'node-fetch';
import { loadHandlers } from './load-handlers';

const { commands: commandHandlers } = loadHandlers();

const commands = Array.from(commandHandlers).map(([_, command]) => ({
  ...(({ handle, ...data }) => data)(command),
}));

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;
const testGuildId = process.env.DISCORD_TEST_GUILD_ID;

async function registerGuildCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url);
  const json: any = await res.json();
  console.log(json);
  json.forEach(async (cmd) => {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });
}

async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

async function registerCommands(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(commands),
  });

  if (response.ok) {
    console.log('Registered all commands');
  } else {
    console.error('Error registering commands');
    const text = await response.text();
    console.error(text);
  }
  return response;
}

await registerGuildCommands();
// await registerGlobalCommands();
