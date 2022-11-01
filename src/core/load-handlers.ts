import * as allCommands from '../commands';
import * as allComponents from '../components';
import { CommandData } from './commands';
import { ComponentData } from './components';

export function loadHandlers() {
  const commands = new Map<string, CommandData>();
  const components = new Map<string, ComponentData>();

  Object.entries(allCommands).forEach(([_, modules]) => {
    Object.entries(modules).forEach(([__, module]) => commands.set(module.name, module));
  });
  Object.entries(allComponents).forEach(([_, modules]) => {
    Object.entries(modules).forEach(([__, module]) => components.set(module.customId, module));
  });

  return {
    commands,
    components,
  };
}
