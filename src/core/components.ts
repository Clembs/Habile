import { SelectMenuType, Typeless } from '$core';
import { Awaitable } from '@paperdave/utils';
import {
  APIBaseSelectMenuComponent,
  APIButtonComponent,
  APIButtonComponentWithCustomId,
  APIMessageComponent,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIStringSelectComponent,
  ComponentType,
} from 'discord-api-types/v10';

export type ComponentData<P> = ButtonData<P> | SelectMenuData<P, SelectMenuType>;

interface BaseComponentData<P extends any> {
  customId: string;
  template?: (props?: P) => Typeless<APIMessageComponent>;
  handle: (this, props?: P) => Awaitable<void | Response>;
  type: ComponentType;
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

function generateCustomId(props?: any) {
  let id = '';
  const j =
    typeof props === 'object'
      ? JSON.stringify({ [Object.keys(props)[0]]: props[Object.keys(props)[0]] })
      : props
      ? String(props)
      : '';
  console.log(j);
  if (j) {
    id += j.slice(0, 50);
  } else {
    id += Math.round(Math.random() * 10000).toString();
  }
  return id;
}

function $component<P extends any, T extends APIMessageComponent>(
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
        custom_id: templateProps
          ? `${data.customId}_${generateCustomId(templateProps)}`
          : data.customId,
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
