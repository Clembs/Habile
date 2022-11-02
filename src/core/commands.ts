import { AwaitableResponse } from '$core';
import {
  APIApplicationCommandOption,
  APIChatInputApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIMessage,
  APIMessageApplicationCommandInteraction,
  APIUser,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10';

export type CommandData = SlashCommandData | UserCtxCommandData | MessageCtxCommandData;

interface BaseCommandData {
  name: string;
  type: ApplicationCommandType;
}

export interface SlashCommandData extends BaseCommandData {
  description: string;
  options?: APIApplicationCommandOption[];
  handle: (
    this: APIChatInputApplicationCommandInteraction,
    opts: APIChatInputApplicationCommandInteractionData
  ) => AwaitableResponse;
  type: ApplicationCommandType.ChatInput;
}

export interface UserCtxCommandData extends BaseCommandData {
  handle: (this: APIUserApplicationCommandInteraction, user: APIUser) => AwaitableResponse;
  type: ApplicationCommandType.User;
}

export interface MessageCtxCommandData extends BaseCommandData {
  handle: (this: APIMessageApplicationCommandInteraction, message: APIMessage) => AwaitableResponse;
  type: ApplicationCommandType.Message;
}

export function $slashCommand(data: Omit<SlashCommandData, 'type'>) {
  return { ...data, type: ApplicationCommandType.ChatInput };
}

export function $userContextCommand(data: Omit<UserCtxCommandData, 'type'>) {
  return { ...data, type: ApplicationCommandType.User };
}

export function $messageContextCommand(data: Omit<MessageCtxCommandData, 'type'>) {
  return { ...data, type: ApplicationCommandType.Message };
}
