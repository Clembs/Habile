import { CommandData, ComponentData } from '$core';
import * as allFeatures from '../features';

export function loadHandlers() {
  const commands = new Map<string, CommandData>();
  const components = new Map<string, ComponentData<any>>();

  Object.entries(allFeatures).forEach(([_, modules]) => {
    Object.entries(modules).forEach(([__, module]) => {
      if ('customId' in module) {
        components.set(module.customId, module);
      } else {
        commands.set(module.name, module);
      }
    });
  });

  return {
    commands,
    components,
  };
}
