import { CustomEmojiRegex } from '@purplet/utils';
import {
  APIApplicationCommandInteraction,
  APIInteraction,
  APIInteractionResponse,
  APIInteractionResponseCallbackData,
  APIMessageComponentInteraction,
  APIPartialEmoji,
  ComponentType,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';

export type AwaitableResponse = Response | Promise<Response>;

export type Typeless<T> = Omit<T, 'type'>;

export interface Env {
  PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
}

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

export function InteractionReply(data: APIInteractionResponseCallbackData) {
  return APIResponse({
    type: InteractionResponseType.ChannelMessageWithSource,
    data,
  });
}

export function InteractionUpdate(
  i: APIMessageComponentInteraction,
  data: APIInteractionResponseCallbackData
) {
  return APIResponse({
    type: InteractionResponseType.UpdateMessage,
    data,
  });
  // getRest().interactionResponse.editOriginalInteractionResponse({
  //   interactionToken: i.token,
  //   applicationId: i.application_id,
  //   body: data,
  // });
}

export function isCommand(i: APIInteraction): i is APIApplicationCommandInteraction {
  return i.type === InteractionType.ApplicationCommand;
}

export function isComponent(i: APIInteraction): i is APIMessageComponentInteraction {
  return i.type === InteractionType.MessageComponent;
}

export function resolveCustomIdData(customId: string) {
  const withoutKey = customId.split('_').at(-1);
  try {
    return JSON.parse(withoutKey);
  } catch (e) {
    return withoutKey;
  }
}

export function getEmojiObject(emoji: string): Partial<APIPartialEmoji> {
  if (!emoji.match(CustomEmojiRegex)) {
    return {
      name: emoji,
    };
  }

  const [animated, name, id] = emoji.replaceAll(/[<|>]/g, '').split(':');

  return {
    id,
    name,
    // ...(animated === 'a' ? { animated: true } : {}),
    animated: animated === 'a',
  };
}
