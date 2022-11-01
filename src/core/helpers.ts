import {
  APIApplicationCommandInteraction,
  APIBaseSelectMenuComponent,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIMessageComponentInteraction,
  ComponentType,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { SelectMenuData } from './components';

export type AwaitableResponse = Response | Promise<Response>;

export type Typeless<T> = Omit<T, 'type'>;

export type SelectMenuType =
  | ComponentType.StringSelect
  | ComponentType.UserSelect
  | ComponentType.RoleSelect
  | ComponentType.MentionableSelect
  | ComponentType.ChannelSelect;

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

export function isComponent(data: APIInteraction): data is APIMessageComponentInteraction {
  return data.type === InteractionType.MessageComponent;
}

export function selectMenuComponent<T extends SelectMenuType>(
  data: SelectMenuData
): APIBaseSelectMenuComponent<T> {
  const wouthandle = (({ handle, ...h }) => h)(data);
  return {
    ...wouthandle,
  };
}
