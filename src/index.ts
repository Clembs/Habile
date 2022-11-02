import {
  APIResponse,
  Env,
  getRest,
  InteractionReply,
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

      const { commands, components } = loadHandlers();

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
          response = await (command as any).handle.call(
            i,
            i.data.type === ApplicationCommandType.Message ? i.message : i.user
          );
        }
      }

      if (isComponent(i)) {
        const customId = i.data.custom_id.split('_').slice(0, -1).join('_');

        const component = components.get(customId);

        const data = resolveCustomIdData(i.data.custom_id);

        if (!component) {
          return InteractionReply({
            content: 'component handler not found',
            flags: MessageFlags.Ephemeral,
          });
        }

        //@ts-ignore
        response = await component.handle.call(i, data);
      }

      if (response instanceof Response) {
        return response;
      } else {
        return new Response('ok');
      }
    }
  },
};
