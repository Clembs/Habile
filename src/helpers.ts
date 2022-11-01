import {
  APIApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';

export type AwaitableResponse = Response | Promise<Response>;

export function APIResponse(data: APIInteractionResponse) {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

export function ShowMessage(data: APIInteractionResponseCallbackData) {
  return APIResponse({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  });
}

export function isCommand(data: APIInteraction): data is APIApplicationCommandInteraction {
  return data.type === InteractionType.ApplicationCommand;
}
