import {
  APIResponse,
  Env,
  getEnv,
  getRest,
  InteractionReply,
  isAutocomplete,
  isCommand,
  isComponent,
  loadHandlers,
  resolveCustomIdData,
  SlashCommandData,
} from '$core';
import {
  isChatInputApplicationCommandInteraction,
  isContextMenuApplicationCommandInteraction,
} from 'discord-api-types/utils/v10';
import {
  APIInteraction,
  ApplicationCommandType,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
} from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'POST') {
      const signature = request.headers.get('X-Signature-Ed25519');
      const timestamp = request.headers.get('X-Signature-Timestamp');
      const body = await request.clone().arrayBuffer();

      const isValid = verifyKey(body, signature, timestamp, env.PUBLIC_KEY);

      if (!isValid) {
        return new Response('Could not verify this request.', { status: 401 });
      }

      const i: APIInteraction = await request.json();

      if (i.type === InteractionType.Ping) {
        return APIResponse({
          type: InteractionResponseType.Pong,
        });
      }

      getRest(env);
      getEnv(env);

      const { commands, components, autocompletes } = loadHandlers();

      console.log(components);

      let response;

      if (isCommand(i)) {
        const command = commands.get(i.data.name);

        if (!command) {
          return InteractionReply({
            content: 'Command handler not found',
            flags: MessageFlags.Ephemeral,
          });
        }

        if (isChatInputApplicationCommandInteraction(i)) {
          response = await (command as SlashCommandData).handle.call(i, i.data);
        } else if (isContextMenuApplicationCommandInteraction(i)) {
          // @ts-ignore
          response = await command.handle.call(
            i,
            i.data.type === ApplicationCommandType.Message ? i.message : i.user
          );
        }
      }

      if (isComponent(i)) {
        const component = Array.from(components.values()).find((c) =>
          i.data.custom_id.startsWith(c.customId)
        );

        const data = resolveCustomIdData(i.data.custom_id);

        if (!component) {
          return InteractionReply({
            content: 'component handler not found',
            flags: MessageFlags.Ephemeral,
          });
        }

        // @ts-ignore
        response = await component.handle.call(i, data);
      }

      if (isAutocomplete(i)) {
        const autocomplete = Array.from(autocompletes.values()).find(
          ({ commandName }) =>
            i.data.name === commandName && i.data.options.find((o) => 'focused' in o && o.focused)
        );

        response = APIResponse({
          type: InteractionResponseType.ApplicationCommandAutocompleteResult,
          data: await autocomplete.handle.call(i),
        });
      }

      if (response instanceof Response) {
        return response;
      } else {
        return new Response('ok');
      }
    }
  },
};
