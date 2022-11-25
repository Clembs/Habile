import { CommandData, ComponentData } from '$core';
import { ApplicationCommandType } from 'discord-api-types/v10';
import * as allFeatures from '../features';
import { AutocompleteData } from './autocomplete';

export function loadHandlers() {
  const commands = new Map<string, CommandData>();
  const components = new Map<string, ComponentData<any>>();
  const autocompletes = new Map<string, AutocompleteData>();

  Object.entries(allFeatures).forEach(([_, modules]) => {
    Object.entries(modules).forEach(([__, module]) => {
      if ('customId' in module) {
        components.set(module.customId, module);
      } else if (Object.values(ApplicationCommandType).includes(module.type)) {
        commands.set(module.name, module);
      } else if ('commandName' in module && 'optionName' in module) {
        autocompletes.set(`${module.commandName}_${module.optionName}`, module);
      }
    });
  });

  return {
    commands,
    components,
    autocompletes,
  };
}
