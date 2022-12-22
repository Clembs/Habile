import { SelectMenuType, Typeless } from '$core';
import { Awaitable } from '@paperdave/utils';
import {
  APIBaseSelectMenuComponent,
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIMessageComponent,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIModalInteractionResponseCallbackData,
  APIModalSubmitInteraction,
  APIStringSelectComponent,
  ComponentType,
} from 'discord-api-types/v10';

export type ComponentData<P> = ButtonData<P> | SelectMenuData<P, SelectMenuType> | ModalData<P>;

interface BaseComponentData<P extends any> {
  customId: string;
  template?: (props?: P) => Typeless<APIMessageComponent>;
  handle: (this, props?: P) => Awaitable<void | Response>;
  type: ComponentType | 0;
}

export interface ButtonData<P> extends BaseComponentData<P> {
  template?: (props?: P) => Typeless<APIButtonComponent>;
  handle: (this: APIMessageComponentButtonInteraction, props?: P) => Awaitable<void | Response>;
  type: ComponentType.Button;
}

export interface SelectMenuData<P, T extends SelectMenuType> extends BaseComponentData<P> {
  template?: (
    props?: P
  ) => Awaitable<
    Typeless<
      Omit<
        T extends ComponentType.StringSelect
          ? APIStringSelectComponent
          : APIBaseSelectMenuComponent<T>,
        'custom_id'
      >
    >
  >;
  handle: (this: APIMessageComponentSelectMenuInteraction, props?: P) => Awaitable<void | Response>;
  type: T;
}

export interface ModalData<P> extends BaseComponentData<P> {
  template?: (props?: P) => Typeless<Omit<APIModalInteractionResponseCallbackData, 'custom_id'>>;
  handle: (this: APIModalSubmitInteraction, props?: P) => Awaitable<void | Response>;
  type: 0;
}

function generateCustomId(props?: any) {
  const j =
    props !== undefined
      ? typeof props === 'object'
        ? JSON.stringify({ [Object.keys(props)[0]]: props[Object.keys(props)[0]] })
        : String(props)
      : '';

  return j !== '' ? j.slice(0, 50) : Math.round(Math.random() * 10000).toString();
}

function $component<
  P extends any,
  T extends APIMessageComponent | APIModalInteractionResponseCallbackData
>(
  data: ComponentData<P>
): ComponentData<P> & {
  create(templateProps?: P): T;
} {
  return {
    ...data,
    create(templateProps): T {
      const temp = data.template?.(templateProps) ?? {};
      // @ts-ignore
      return {
        ...temp,
        custom_id: `${data.customId}_${generateCustomId(templateProps)}`,
        type: data.type,
      };
    },
  };
}

export function $button<P>(data: Typeless<ButtonData<P>>) {
  return $component<P, APIButtonComponentWithCustomId>({ ...data, type: ComponentType.Button });
}

export function $selectMenu<P, T extends SelectMenuType>(data: SelectMenuData<P, T>) {
  return $component<
    P,
    T extends ComponentType.StringSelect ? APIStringSelectComponent : APIBaseSelectMenuComponent<T>
  >(data);
}

export function $modal<P>(data: Typeless<ModalData<P>>) {
  return $component<P, APIModalInteractionResponseCallbackData>({ ...data, type: 0 });
}
