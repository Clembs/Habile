import { APIResponse, isCommand, isComponent, ShowMessage } from '$core';
import { loadHandlers } from '$core/load-handlers';
import { APIInteraction, InteractionResponseType, InteractionType } from 'discord-api-types/v10';
import { verifyKey } from 'discord-interactions';

export interface Env {
  PUBLIC_KEY: string;
}

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

      const { commands, components } = loadHandlers();

      if (isCommand(i)) {
        const command = commands.get(i.data.name);

        if (!command) {
          return ShowMessage({
            content: 'command handler not found',
          });
        }

        //@ts-ignore
        return await command.handle.call(i);
      }

      if (isComponent(i)) {
        const component = components.get(i.data.custom_id);

        if (!component) {
          return ShowMessage({
            content: 'component handler not found',
          });
        }

        //@ts-ignore
        return await component.handle.call(i);
      }
    }
  },
};
