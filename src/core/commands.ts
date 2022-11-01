import {
  APIApplicationCommandOption,
  APIChatInputApplicationCommandInteraction,
  APIMessageApplicationCommandInteraction,
  APIUserApplicationCommandInteraction,
  ApplicationCommandType,
} from 'discord-api-types/v10';
import { AwaitableResponse } from './helpers';

export type CommandData = SlashCommandData | UserCtxCommandData | MessageCtxCommandData;

interface BaseCommandData {
  name: string;
  handle: (this) => AwaitableResponse;
  type: ApplicationCommandType;
}

export interface SlashCommandData extends BaseCommandData {
  description: string;
  options?: APIApplicationCommandOption[];
  handle: (this: APIChatInputApplicationCommandInteraction) => AwaitableResponse;
  type: ApplicationCommandType.ChatInput;
}

export interface UserCtxCommandData extends BaseCommandData {
  handle: (this: APIUserApplicationCommandInteraction) => AwaitableResponse;
  type: ApplicationCommandType.User;
}

export interface MessageCtxCommandData extends BaseCommandData {
  handle: (this: APIMessageApplicationCommandInteraction) => AwaitableResponse;
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
