import { Editor } from "slate";
import React, { DOMAttributes, SyntheticEvent } from "react";
import { mergeWith, flatten } from "ramda";

type Plugin = (editor: Editor) => Editor;

export const composePlugins = (plugins: Plugin[], _editor: Editor) => {
  let editor = _editor;
  for (const plugin of plugins.reverse()) {
    editor = plugin(editor);
  }

  return editor;
};

type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

type Handler = React.EventHandler<SyntheticEvent> | undefined;
type EditorHandler = (editor: Editor) => Handler;
type DOMHandlersKeys = KeysMatching<DOMAttributes<Element>, Handler>;

export const composeHandlers = (
  editor: Editor,
  handlersConfig: Partial<Record<DOMHandlersKeys, EditorHandler>>[]
) => {
  const grouped = handlersConfig.reduce(
    (acc, x) => mergeWith((a, b) => flatten([a, b]), acc, x),
    {} as Record<DOMHandlersKeys, EditorHandler[]>
  );

  const composed: Partial<Record<string, Handler>> = {};
  for (const [key, value] of Object.entries(grouped)) {
    composed[key] = (e: SyntheticEvent) =>
      value.forEach((handler) => handler && handler(editor)!(e));
  }

  return composed as Partial<Record<DOMHandlersKeys, Handler>>;
};
