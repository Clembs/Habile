import {
  APIButtonComponent,
  APIMessageActionRowComponent,
  APIMessageComponent,
  APIMessageComponentButtonInteraction,
  APIMessageStringSelectInteractionData,
  APISelectMenuComponent,
  ComponentType,
} from 'discord-api-types/v10';
import { AwaitableResponse, SelectMenuType, Typeless } from './helpers';

export type ComponentData = ButtonData | SelectMenuData;

interface BaseComponentData {
  customId: string;
  template: (args?: any) => Typeless<APIMessageComponent>;
  handle: (this) => AwaitableResponse;
  type: ComponentType;
}

export interface ButtonData extends BaseComponentData {
  template: (args?: any) => Typeless<APIButtonComponent>;
  handle: (this: APIMessageComponentButtonInteraction) => AwaitableResponse;
  type: ComponentType.Button;
}

export interface SelectMenuData extends BaseComponentData {
  template: (args?: any) => Typeless<APISelectMenuComponent>;
  handle: (this: APIMessageStringSelectInteractionData) => AwaitableResponse;
  type: SelectMenuType;
}

function $component(data: ComponentData) {
  return {
    ...data,
    create(args: any): APIMessageActionRowComponent {
      // @ts-ignore
      return {
        ...data.template(args),
        custom_id: data.customId,
        type: data.type,
      };
    },
  };
}

export function $button(data: Typeless<ButtonData>) {
  return $component({ ...data, type: ComponentType.Button });
}

export function $selectMenu(data: SelectMenuData) {
  return $component(data);
}
