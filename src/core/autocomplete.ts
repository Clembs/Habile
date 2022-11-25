import { Awaitable } from '@paperdave/utils';
import {
  APIApplicationCommandAutocompleteInteraction,
  APICommandAutocompleteInteractionResponseCallbackData,
} from 'discord-api-types/v10';

export interface AutocompleteData {
  commandName: string;
  optionName: string;
  handle: (
    this: APIApplicationCommandAutocompleteInteraction
  ) => Awaitable<APICommandAutocompleteInteractionResponseCallbackData>;
}

export function $autocomplete(data: AutocompleteData) {
  return data;
}
