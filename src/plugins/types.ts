import { Editor } from "slate";
import { Editable, RenderElementProps, RenderLeafProps } from "slate-react";

export type EditableProps = Parameters<typeof Editable>[0];

export type ElementProps = {
  element: RenderElementProps["element"];
  children: RenderElementProps["children"];
  attributes?: RenderElementProps["attributes"];
};

export type UseSlatePlugin<Options = {}> = (options: Options) => SlatePlugin;

export type SlatePlugin = {
  withOverrides?: (editor: Editor) => Editor;
  handlers?: {};
  renderElement?: (props: ElementProps) => JSX.Element | null;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | null;
};
